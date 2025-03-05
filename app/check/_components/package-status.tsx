import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, MessageCircle, XCircle } from 'lucide-react';

import { getIssueSearchUrl } from '@/lib/helpers';
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/30">
        {archIcons[packageInfo.newArchitecture || NewArchSupportStatus.Untested]}
        <span className="text-sm">
          {packageInfo.newArchitecture === NewArchSupportStatus.Supported
            ? 'New Architecture Supported'
            : packageInfo.newArchitecture === NewArchSupportStatus.Unsupported
              ? 'New Architecture Unsupported'
              : 'New Architecture Untested'}
        </span>
        {(packageInfo.newArchitecture === NewArchSupportStatus.Unsupported ||
          packageInfo.newArchitecture === NewArchSupportStatus.Untested) &&
          packageInfo.githubUrl && (
            <a
              href={getIssueSearchUrl(packageInfo.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-80 transition-colors ${
                packageInfo.newArchitecture === NewArchSupportStatus.Unsupported
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }`}
              title="View New Architecture related issues on GitHub"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
      </div>
      {packageInfo.error && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{packageInfo.error}</span>
        </div>
      )}
    </div>
  );
};
