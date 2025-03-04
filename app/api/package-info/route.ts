import { NextResponse } from 'next/server';
import { DirectoryPackage, PackageInfo } from '@/types';

export async function POST(request: Request) {
  try {
    const { packages } = await request.json();
    const results: Record<string, PackageInfo> = {};

    const directoryResponse = await fetch(
      'https://raw.githubusercontent.com/react-native-community/directory/main/assets/data.json'
    );
    const directoryData: { libraries: DirectoryPackage[] } = await directoryResponse.json();

    for (const pkg of packages) {
      try {
        const packageData = directoryData.libraries.find(item => item.npmPkg === pkg);

        if (packageData) {
          const githubUrl = packageData.github.urls.repo;
          results[pkg] = {
            npmUrl: `https://www.npmjs.com/package/${pkg}`,
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
            npmUrl: `https://www.npmjs.com/package/${pkg}`,
            error: 'Package not found in React Native Directory',
            notInDirectory: true,
          };
        }
      } catch (pkgError) {
        console.error(`Error processing ${pkg}:`, pkgError);
        results[pkg] = {
          npmUrl: `https://www.npmjs.com/package/${pkg}`,
          error: 'Failed to process package information',
          notInDirectory: true,
        };
      }
    }

    const releaseResponse = await fetch(
      'https://raw.githubusercontent.com/react-native-community/rn-diff-purge/master/RELEASES'
    );
    const releaseText = await releaseResponse.text();
    const versions = releaseText.split('\n').filter(v => !v.includes('-rc'));

    const response = {
      packages: results,
      reactNativeVersions: versions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Package info error:', error);
    return NextResponse.json({ error: 'Failed to fetch package information' }, { status: 500 });
  }
}
