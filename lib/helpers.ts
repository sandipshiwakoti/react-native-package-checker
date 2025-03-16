import {
  GITHUB_PATHS,
  MAINTENANCE_ISSUE_QUERY,
  MAINTENANCE_PR_QUERY,
  NEW_ARCH_ISSUE_QUERY,
  NEW_ARCH_MERGED_PR_QUERY,
  NEW_ARCH_PR_QUERY,
  NEW_ARCH_RELEASE_NOTES_QUERY,
} from '@/constants';

export const getNormalizedVersion = (version: string | null) => {
  if (!version) return null;
  const parts = version.split('.');
  return parts.length === 2 ? `${version}.0` : version;
};

const createGithubUrl = (repoUrl: string, path: GITHUB_PATHS | string, query?: string) => {
  const baseUrl = `${repoUrl}/${path}`;
  return query ? `${baseUrl}?${new URLSearchParams({ q: query }).toString()}` : baseUrl;
};

export const getNewArchIssueSearchUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.ISSUES, NEW_ARCH_ISSUE_QUERY);

export const getNewArchPRSearchUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.PULLS, NEW_ARCH_PR_QUERY);

export const getNewArchMergedPRSearchUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.PULLS, NEW_ARCH_MERGED_PR_QUERY);

export const getNewArchReleaseNotesUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.RELEASES, NEW_ARCH_RELEASE_NOTES_QUERY);

export const getReadmeUrl = (repoUrl: string) => createGithubUrl(repoUrl, GITHUB_PATHS.README);

export const getMaintenanceIssuesUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.ISSUES, MAINTENANCE_ISSUE_QUERY);

export const getMaintenancePRSearchUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.PULLS, MAINTENANCE_PR_QUERY);

export const getContributorsActivityUrl = (repoUrl: string) =>
  createGithubUrl(repoUrl, GITHUB_PATHS.CONTRIBUTORS_ACTIVITY);

export const getActiveForksUrl = (repoUrl: string) => createGithubUrl(repoUrl, GITHUB_PATHS.FORKS);
