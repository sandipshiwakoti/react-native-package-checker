import React from 'react';
import { useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  CircleDot,
  GitPullRequest,
  XCircle,
} from 'lucide-react';

import {
  getMaintenanceIssuesUrl,
  getMaintenancePRSearchUrl,
  getNewArchIssueSearchUrl,
  getNewArchPRSearchUrl,
} from '@/lib/helpers';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface PackageStatusProps {
  packageInfo: PackageInfo;
}

export const PackageStatus = ({ packageInfo }: PackageStatusProps) => {
  const archIcons = {
    [NewArchSupportStatus.Supported]: <CheckCircle className="h-4 w-4 text-green-500" />,
    [NewArchSupportStatus.Unsupported]: <XCircle className="h-4 w-4 text-red-500" />,
    [NewArchSupportStatus.Untested]: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  };

  const githubLinks = useMemo(() => {
    if (!packageInfo.githubUrl) return [];

    const baseUrl = packageInfo.githubUrl;
    const newArchLinks = [
      {
        icon: CircleDot,
        title: 'Search New Architecture issues',
        url: getNewArchIssueSearchUrl(baseUrl),
      },
      {
        icon: GitPullRequest,
        title: 'Search New Architecture PRs',
        url: getNewArchPRSearchUrl(baseUrl),
      },
    ];

    const links = {
      untested: newArchLinks,
      unsupported: newArchLinks,
      unmaintained: [
        {
          icon: CircleDot,
          title: 'Search maintenance issues',
          url: getMaintenanceIssuesUrl(baseUrl),
        },
        {
          icon: GitPullRequest,
          title: 'Search stale PRs',
          url: getMaintenancePRSearchUrl(baseUrl),
        },
      ],
    };

    if (packageInfo.unmaintained) return links.unmaintained;
    if (packageInfo.newArchitecture === NewArchSupportStatus.Untested) return links.untested;
    if (packageInfo.newArchitecture === NewArchSupportStatus.Unsupported) return links.unsupported;
    return [];
  }, [packageInfo.githubUrl, packageInfo.newArchitecture, packageInfo.unmaintained]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 py-1.5 rounded-md bg-muted/30">
        {archIcons[packageInfo.newArchitecture || NewArchSupportStatus.Untested]}
        <span className="text-sm">
          {packageInfo.newArchitecture === NewArchSupportStatus.Supported
            ? 'New Architecture Supported'
            : packageInfo.newArchitecture === NewArchSupportStatus.Unsupported
              ? 'New Architecture Unsupported'
              : 'New Architecture Untested'}
        </span>
        {packageInfo.githubUrl && githubLinks.length > 0 && (
          <div className="flex items-center gap-1 ml-1">
            {githubLinks.map(({ icon: Icon, title, url }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 rounded-md hover:bg-muted transition-colors ${
                  packageInfo.unmaintained
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-yellow-500 hover:text-yellow-600'
                }`}
                title={title}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </div>
      {packageInfo.error && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700 max-w-[300px]">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{packageInfo.error}</span>
        </div>
      )}
    </div>
  );
};
