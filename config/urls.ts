export const urls = {
  packageInfo: '/package-info',
} as const;

export const externalUrls = {
  reactNativeDirectory: {
    directoryCheck: 'https://reactnative.directory/api/libraries/check',
    directoryLibraries: 'https://reactnative.directory/api/libraries',
    directoryData:
      'https://raw.githubusercontent.com/react-native-community/directory/main/assets/data.json',
    rnReleases:
      'https://raw.githubusercontent.com/react-native-community/rn-diff-purge/master/RELEASES',
  },
  npm: {
    package: (packageName: string) => `https://www.npmjs.com/package/${packageName}`,
  },
  github: {
    rnpc: 'https://github.com/sandipshiwakoti/react-native-package-checker',
    directory: 'https://github.com/react-native-community/directory',
  },
  tools: {
    upgradeHelper: (currentVersion: string, latestVersion: string) =>
      `https://react-native-community.github.io/upgrade-helper?from=${currentVersion}&to=${latestVersion}`,
    bundlephobia: {
      package: (name: string, version?: string) =>
        `https://bundlephobia.com/package/${name}${version ? `@${version}` : ''}`,
    },
  },
} as const;
