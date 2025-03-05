import { NEW_ARCH_ISSUE_QUERY } from '@/constants';

export const getNormalizedVersion = (version: string | null) => {
  if (!version) return null;
  const parts = version.split('.');
  return parts.length === 2 ? `${version}.0` : version;
};

export const getIssueSearchUrl = (repoUrl: string) => {
  const searchParams = new URLSearchParams({
    q: NEW_ARCH_ISSUE_QUERY,
  }).toString();
  return `${repoUrl}/issues?${searchParams}`;
};
