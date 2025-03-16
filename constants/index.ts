export const NEW_ARCH_ISSUE_QUERY =
  'is:issue is:open "new arch" OR "new architecture" OR "fabric" OR "turbomodule" OR "JSI" OR "codegen"';

export const NEW_ARCH_PR_QUERY =
  'is:pr is:open "new arch" OR "new architecture" OR "fabric" OR "turbomodule" OR "JSI" OR "codegen"';

export const NEW_ARCH_RELEASE_NOTES_QUERY = 'new+arch';

export const MAINTENANCE_ISSUE_QUERY =
  'is:issue is:open "unmaintained" OR "deprecated" OR "abandoned" OR "maintainer" OR "maintenance" OR "not maintained"';

export const MAINTENANCE_PR_QUERY = 'is:pr is:open sort:updated-asc';

export enum GITHUB_PATHS {
  ISSUES = 'issues',
  PULLS = 'pulls',
  FORKS = 'forks',
  CONTRIBUTORS_ACTIVITY = 'graphs/contributors',
  RELEASES = 'releases',
}

export const EXPORTED_FILE_NAME_PREFIX = 'react-native-package-checker-report';

export const CORE_PACKAGES = ['react', 'react-native'];
