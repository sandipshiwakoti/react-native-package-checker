import {
  MAINTENANCE_ISSUE_QUERY,
  MAINTENANCE_PR_QUERY,
  NEW_ARCH_ISSUE_QUERY,
  NEW_ARCH_PR_QUERY,
} from '@/constants';

export const getNormalizedVersion = (version: string | null) => {
  if (!version) return null;
  const parts = version.split('.');
  return parts.length === 2 ? `${version}.0` : version;
};

const createGithubSearchUrl = (repoUrl: string, query: string, type: 'issues' | 'pulls') => {
  const searchParams = new URLSearchParams({ q: query }).toString();
  return `${repoUrl}/${type}?${searchParams}`;
};

export const getNewArchIssueSearchUrl = (repoUrl: string) =>
  createGithubSearchUrl(repoUrl, NEW_ARCH_ISSUE_QUERY, 'issues');

export const getNewArchPRSearchUrl = (repoUrl: string) =>
  createGithubSearchUrl(repoUrl, NEW_ARCH_PR_QUERY, 'pulls');

export const getMaintenanceIssuesUrl = (repoUrl: string) =>
  createGithubSearchUrl(repoUrl, MAINTENANCE_ISSUE_QUERY, 'issues');

export const getMaintenancePRSearchUrl = (repoUrl: string) =>
  createGithubSearchUrl(repoUrl, MAINTENANCE_PR_QUERY, 'pulls');
