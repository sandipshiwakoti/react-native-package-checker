import { NextResponse } from 'next/server';
import axios from 'axios';

import { externalUrls } from '@/config/urls';
import { delay } from '@/lib/utils';
import { DirectoryPackage, PackageInfo } from '@/types';

export async function POST(request: Request) {
  try {
    const { packages } = await request.json();
    const results: Record<string, PackageInfo> = {};

    const [directoryResponse, releaseResponse, checkResponse] = await Promise.all([
      axios.get(externalUrls.reactNativeDirectory.directoryData),
      axios.get(externalUrls.reactNativeDirectory.rnReleases),
      axios.post(externalUrls.reactNativeDirectory.directoryCheck, { packages }),
    ]);

    const directoryData: { libraries: DirectoryPackage[] } = directoryResponse.data;
    const versions = releaseResponse.data.split('\n').filter((v: string) => !v.includes('-rc'));
    const checkData = checkResponse.data;

    for (const pkg of packages) {
      try {
        let packageData = directoryData.libraries.find(item => item.npmPkg === pkg);
        if (packageData) {
          const githubUrl = packageData.github.urls.repo;
          results[pkg] = {
            npmUrl: externalUrls.npm.package(pkg),
            githubUrl,
            platforms: {
              ios: packageData.ios || false,
              android: packageData.android || false,
              web: packageData.web || false,
            },
            support: {
              hasTypes: packageData.github.hasTypes || false,
              license: packageData.github.license?.name || null,
              licenseUrl: packageData.github.license?.url || undefined,
            },
            score: packageData.score,
            matchingScoreModifiers: packageData.matchingScoreModifiers,
            alternatives: packageData.alternatives,
            newArchitecture: checkData[pkg]?.newArchitecture || 'untested',
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
                error: 'Invalid response from Directory API',
                notInDirectory: true,
                newArchitecture: checkData[pkg]?.newArchitecture || 'untested',
                unmaintained: checkData[pkg]?.unmaintained || false,
              };
              continue;
            }
            const exactMatch = searchData.libraries.find((item: any) => item.npmPkg === pkg);

            if (exactMatch) {
              const githubUrl = exactMatch.githubUrl;
              results[pkg] = {
                npmUrl: externalUrls.npm.package(pkg),
                githubUrl,
                platforms: {
                  ios: exactMatch.ios || false,
                  android: exactMatch.android || false,
                  web: exactMatch.web || false,
                },
                support: {
                  hasTypes: exactMatch.github?.hasTypes || false,
                  license: exactMatch.github?.license?.name || null,
                  licenseUrl: exactMatch.github?.license?.url || undefined,
                },
                score: exactMatch.score,
                matchingScoreModifiers: exactMatch.matchingScoreModifiers || [],
                alternatives: exactMatch.alternatives || [],
                isRecent: true,
                newArchitecture: checkData[pkg]?.newArchitecture || 'untested',
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
              error: 'Failed to fetch package details',
              notInDirectory: true,
            };
          }
        } else {
          results[pkg] = {
            npmUrl: externalUrls.npm.package(pkg),
            error: 'Package not found in React Native Directory',
            notInDirectory: true,
          };
        }
      } catch (pkgError) {
        results[pkg] = {
          npmUrl: externalUrls.npm.package(pkg),
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
