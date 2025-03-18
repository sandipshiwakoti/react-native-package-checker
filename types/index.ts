/* eslint-disable unused-imports/no-unused-vars */
export enum NewArchSupportStatus {
  Supported = 'supported',
  Unsupported = 'unsupported',
  Untested = 'untested',
}

export interface Package {
  name: string;
  selected: boolean;
}

export interface PackageResponse {
  packages: Record<string, PackageInfo>;
  reactNativeVersions: string[];
}

export interface PackageStatus {
  newArchitecture?: NewArchSupportStatus;
  newArchitectureNote?: string;
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
  alternatives?: string[];
  platforms?: {
    ios: boolean;
    android: boolean;
    web: boolean;
    windows: boolean;
    macos: boolean;
    fireos: boolean;
  };
  support?: {
    hasTypes: boolean;
    license: string | null;
    licenseUrl?: string;
    expoGo?: boolean;
    dev?: boolean;
  };
  github?: GithubInfo;
  newArchitecture?: NewArchSupportStatus;
  newArchitectureNote?: string;
  unmaintained?: boolean;
  error?: string;
  notInDirectory?: boolean;
  isRecent?: boolean;
}

export interface DirectoryPackage {
  npmPkg: string;
  githubUrl: string;
  ios: boolean;
  android: boolean;
  web: boolean;
  windows: boolean;
  macos: boolean;
  fireos: boolean;
  expoGo?: boolean;
  dev?: boolean;
  newArchitectureNote?: string;
  alternatives?: string[];
  isRecent?: boolean;
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

export interface PDFExportOptions {
  title?: string;
  fileName?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'Letter';
}

export interface FileExportPackageData {
  name: string;
  notInDirectory?: boolean;
  status: {
    newArchitecture: string;
    maintenance: string;
  };
  links: {
    github?: string;
    npm: string;
  };
  metrics?: {
    stars?: number;
    forks?: number;
    issues?: number;
    lastUpdated?: string;
  };
  support?: {
    platforms: string[];
    typescript: boolean;
    license?: string;
  };
  description?: string;
  alternatives?: string[];
}

export interface FileExportData {
  summary: {
    total: number;
    supported: number;
    unsupported: number;
    untested: number;
    unlisted: number;
    unmaintained: number;
  };
  packages: FileExportPackageData[];
  generatedAt: string;
}
