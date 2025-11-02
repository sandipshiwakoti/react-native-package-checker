import { NextResponse } from 'next/server';
import axios from 'axios';

import { externalUrls } from '@/config/urls';
import { cleanPackageName, extractPackageVersion } from '@/lib/helpers';
import { delay } from '@/lib/utils';
import { DirectoryPackage, PackageInfo } from '@/types';

export async function POST(request: Request) {
  try {
    const { packages } = await request.json();
    const results: Record<string, PackageInfo> = {};
    const cleanedPackages = packages.map(cleanPackageName);

    const [directoryResponse, releaseResponse, checkResponse] = await Promise.all([
      axios.get(externalUrls.reactNativeDirectory.directoryData),
      axios.get(externalUrls.reactNativeDirectory.rnReleases),
      axios.post(externalUrls.reactNativeDirectory.directoryCheck, { packages: cleanedPackages }),
    ]);

    const directoryData: { libraries: DirectoryPackage[] } = directoryResponse.data;
    const versions = releaseResponse.data
      .split('\n')
      .filter((v: string) => !v.includes('-rc')) as string[];
    const checkData = checkResponse.data;

    for (const packageName of packages) {
      const pkg = cleanPackageName(packageName);
      const version = extractPackageVersion(packageName);
      try {
        let packageData = directoryData.libraries.find(item => item.npmPkg === pkg);
        if (packageData) {
          const githubUrl = packageData.github.urls.repo;
          results[pkg] = {
            npmUrl: externalUrls.npm.package(pkg),
            version,
            githubUrl,
            platforms: {
              ios: packageData.ios || false,
              android: packageData.android || false,
              web: packageData.web || false,
              windows: packageData.windows || false,
              macos: packageData.macos || false,
              fireos: packageData.fireos || false,
              horizon: packageData.horizon || false,
              vegaos: packageData.vegaos || false,
            },
            support: {
              hasTypes: packageData.github.hasTypes || false,
              license: packageData.github.license?.name || null,
              licenseUrl: packageData.github.license?.url || undefined,
              expoGo: packageData.expoGo,
              dev: packageData.dev,
              hasNativeCode: packageData.github.hasNativeCode || false,
              configPlugin: packageData.github.configPlugin || false,
            },
            alternatives: packageData.alternatives,
            newArchitecture:
              checkData[pkg]?.newArchitecture === 'new-arch-only'
                ? 'supported'
                : checkData[pkg]?.newArchitecture || 'untested',
            newArchitectureNote: packageData.newArchitectureNote,
            unmaintained: checkData[pkg]?.unmaintained || false,
            github: {
              description: packageData.github.description,
              stargazers_count: packageData.github.stats.stars || 0,
              stargazers_url: `${githubUrl}/stargazers`,
              forks_count: packageData.github.stats.forks || 0,
              forks_url: `${githubUrl}/network/members`,
              watchers_count: packageData.github.stats.subscribers || 0,
              watchers_url: `${githubUrl}/watchers`,
              open_issues_count: packageData.github.stats.issues || 0,
              issues_url: `${githubUrl}/issues`,
              updated_at: packageData.github.stats.updatedAt,
              commits_url: `${githubUrl}/commits`,
            },
          };
        } else if (checkData[pkg]) {
          try {
            await delay(100); // Delay for preventing rate limiting from the React Native Directory API
            const searchResponse = await axios.get(
              `${externalUrls.reactNativeDirectory.directoryLibraries}?search=${encodeURIComponent(pkg)}`
            );
            const searchData = searchResponse.data;

            if (!searchData?.libraries || !Array.isArray(searchData.libraries)) {
              results[pkg] = {
                npmUrl: externalUrls.npm.package(pkg),
                version,
                error: 'Invalid response from Directory API',
                notInDirectory: true,
                newArchitecture:
                  checkData[pkg]?.newArchitecture === 'new-arch-only'
                    ? 'supported'
                    : checkData[pkg]?.newArchitecture || 'untested',
                newArchitectureNote: checkData[pkg]?.newArchitectureNote,
                unmaintained: checkData[pkg]?.unmaintained || false,
              };
              continue;
            }
            const exactMatch = searchData.libraries.find((item: any) => item.npmPkg === pkg);

            if (exactMatch) {
              const githubUrl = exactMatch.githubUrl;
              results[pkg] = {
                npmUrl: externalUrls.npm.package(pkg),
                version,
                githubUrl,
                platforms: {
                  ios: exactMatch.ios || false,
                  android: exactMatch.android || false,
                  web: exactMatch.web || false,
                  windows: exactMatch.windows || false,
                  macos: exactMatch.macos || false,
                  fireos: exactMatch.fireos || false,
                  horizon: exactMatch.horizon || false,
                  vegaos: exactMatch.vegaos || false,
                },
                support: {
                  hasTypes: exactMatch.github?.hasTypes || false,
                  license: exactMatch.github?.license?.name || null,
                  licenseUrl: exactMatch.github?.license?.url || undefined,
                  hasNativeCode: exactMatch.github?.hasNativeCode || false,
                  configPlugin: exactMatch.github?.configPlugin || false,
                },
                alternatives: exactMatch.alternatives || [],
                isRecent: true,
                newArchitecture:
                  checkData[pkg]?.newArchitecture === 'new-arch-only'
                    ? 'supported'
                    : checkData[pkg]?.newArchitecture || 'untested',
                newArchitectureNote: exactMatch.newArchitectureNote,
                unmaintained: checkData[pkg]?.unmaintained || false,
                github: {
                  description: exactMatch.github?.description || '',
                  stargazers_count: exactMatch.github?.stats?.stars || 0,
                  stargazers_url: `${githubUrl}/stargazers`,
                  forks_count: exactMatch.github?.stats?.forks || 0,
                  forks_url: `${githubUrl}/network/members`,
                  watchers_count: exactMatch.github?.stats?.subscribers || 0,
                  watchers_url: `${githubUrl}/watchers`,
                  open_issues_count: exactMatch.github?.stats?.issues || 0,
                  issues_url: `${githubUrl}/issues`,
                  updated_at: exactMatch.github?.stats?.updatedAt || '',
                  commits_url: `${githubUrl}/commits`,
                },
              };
              continue;
            }
          } catch (searchError) {
            results[pkg] = {
              npmUrl: externalUrls.npm.package(pkg),
              version,
              error: 'Failed to fetch package details',
              notInDirectory: true,
            };
          }
        } else {
          results[pkg] = {
            npmUrl: externalUrls.npm.package(pkg),
            version,
            error: 'Package not found in React Native Directory',
            notInDirectory: true,
          };
        }
      } catch (pkgError) {
        results[pkg] = {
          npmUrl: externalUrls.npm.package(pkg),
          version,
          error: 'Failed to process package information',
          notInDirectory: true,
        };
      }
    }

    return NextResponse.json({
      packages: results,
      reactNativeVersions: versions,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch package information' }, { status: 500 });
  }
}
