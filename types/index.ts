export enum NewArchSupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

export interface Package {
  name: string;
  selected: boolean;
}

export interface PackageStatus {
  newArchitecture?: NewArchSupportStatus;
  unmaintained?: boolean;
  error?: string;
  githubUrl?: string;
  npmUrl?: string;
  github?: {
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
    updated_at: string;
  };
}

export interface GithubInfo {
  description?: string;
  stargazers_count: number;
  stargazers_url: string;
  forks_count: number;
  forks_url: string;
  watchers_count: number;
  watchers_url: string;
  open_issues_count: number;
  issues_url: string;
  updated_at: string;
  commits_url: string;
}

export interface Platforms {
  ios: boolean;
  android: boolean;
  web: boolean;
}

export interface Support {
  hasTypes: boolean;
  license: string | null;
  licenseUrl?: string;
}

export interface PackageInfo {
  npmUrl: string;
  githubUrl?: string;
  score?: number;
  matchingScoreModifiers?: string[];
  alternatives?: string[];
  platforms?: {
    ios: boolean;
    android: boolean;
    web: boolean;
  };
  support?: {
    hasTypes: boolean;
    license: string | null;
    licenseUrl?: string;
  };
  github?: GithubInfo;
  newArchitecture?: NewArchSupportStatus;
  unmaintained?: boolean;
  error?: string;
  notInDirectory?: boolean;
}

export interface DirectoryPackage {
  npmPkg: string;
  githubUrl: string;
  ios: boolean;
  android: boolean;
  web: boolean;
  score?: number;
  matchingScoreModifiers?: string[];
  alternatives?: string[];
  github: {
    urls: {
      repo: string;
      clone: string;
      homepage: string;
    };
    description: string;
    hasTypes: boolean;
    license: {
      name: string;
      url: string;
    };
    stats: {
      stars: number;
      forks: number;
      subscribers: number;
      issues: number;
      updatedAt: string;
    };
  };
}

export type NewArchFilter = 'supported' | 'unsupported' | 'untested';