import { NextResponse } from 'next/server';
import axios from 'axios';
import { DirectoryPackage, PackageInfo } from '@/types';
import { externalUrls } from '../../../config/urls';

export async function POST(request: Request) {
  try {
    const { packages } = await request.json();
    const results: Record<string, PackageInfo> = {};

    const [directoryResponse, releaseResponse] = await Promise.all([
      axios.get(externalUrls.reactNativeDirectory.directoryData),
      axios.get(externalUrls.reactNativeDirectory.rnReleases),
    ]);

    const directoryData: { libraries: DirectoryPackage[] } = directoryResponse.data;
    const versions = releaseResponse.data.split('\n').filter((v: string) => !v.includes('-rc'));

    for (const pkg of packages) {
      try {
        const packageData = directoryData.libraries.find(item => item.npmPkg === pkg);

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
        } else {
          results[pkg] = {
            npmUrl: externalUrls.npm.package(pkg),
            error: 'Package not found in React Native Directory',
            notInDirectory: true,
          };
        }
      } catch (pkgError) {
        console.error(`Error processing ${pkg}:`, pkgError);
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
    console.error('Package info error:', error);
    return NextResponse.json({ error: 'Failed to fetch package information' }, { status: 500 });
  }
}
