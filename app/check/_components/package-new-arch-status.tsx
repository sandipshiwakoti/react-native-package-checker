import React from 'react';
import { AlertCircle, Archive, CheckCircle, XCircle } from 'lucide-react';

import { Chip } from '@/components/ui/chip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface PackageNewArchStatusProps {
  packageInfo: PackageInfo;
}

const newArchChipConfig = {
  supported: { icon: CheckCircle, label: 'New Architecture Supported', variant: 'green' },
  unsupported: { icon: XCircle, label: 'New Architecture Unsupported', variant: 'red' },
  untested: { icon: AlertCircle, label: 'New Architecture Untested', variant: 'yellow' },
} as const;

export const PackageNewArchStatus = ({ packageInfo }: PackageNewArchStatusProps) => {
  const renderNewArchStatus = (status: NewArchSupportStatus) => {
    const config = newArchChipConfig[status];
    const tooltipContent =
      status === 'supported'
        ? 'This package fully supports the New Architecture'
        : status === 'unsupported'
          ? 'This package does not support the New Architecture yet'
          : 'This package has not been tested with the New Architecture';

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default">
              <Chip
                key={status}
                icon={config.icon}
                label={config.label}
                variant={config.variant}
                size="md"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-54">
            {tooltipContent}{' '}
            {packageInfo.newArchitectureNote && (
              <p className="text-slate-200 text-xs mt-2">Note: {packageInfo.newArchitectureNote}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex gap-2">
      {packageInfo.unmaintained && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <Chip icon={Archive} label="Unmaintained" variant="amber" size="md" />
              </div>
            </TooltipTrigger>
            <TooltipContent>This package is no longer actively maintained</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {packageInfo.newArchitecture && renderNewArchStatus(packageInfo.newArchitecture)}
    </div>
  );
};
