export const urls = {
  check: '/check',
  packageInfo: '/package-info',
} as const;

export const externalUrls = {
  reactNativeDirectory: {
    directoryCheck: 'https://reactnative.directory/api/libraries/check',
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
  },
} as const;
