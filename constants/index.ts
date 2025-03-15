export const NEW_ARCH_ISSUE_QUERY =
  'is:issue is:open "new architecture" OR "fabric" OR "turbomodule"';

export const NEW_ARCH_PR_QUERY = 'is:pr is:open "new architecture" OR "fabric" OR "turbomodule"';

export const MAINTENANCE_ISSUE_QUERY =
  'is:issue is:open "maintainer" OR "maintenance" OR "unmaintained"';

export const MAINTENANCE_PR_QUERY = 'is:pr is:open sort:updated-asc';

export const EXPORTED_FILE_NAME_PREFIX = 'react-native-package-checker-report';

export const CORE_PACKAGES = ['react', 'react-native'];
