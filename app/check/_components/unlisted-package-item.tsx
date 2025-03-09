import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

import { GithubIcon } from '@/components/icons/github';
import { NpmIcon } from '@/components/icons/npm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CORE_PACKAGES } from '@/constants';
import { PackageInfo } from '@/types';

interface UnlistedPackageItemProps {
  packageInfo: PackageInfo;
  name: string;
}

const UnlistedPackageItem = ({ name, packageInfo }: UnlistedPackageItemProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="sm:text-lg font-medium">{name}</h3>
            {CORE_PACKAGES.includes(name) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-popover-foreground text-xs">
                      Core dependency required by React Native. Not listed in the directory but
                      fully compatible with the New Architecture.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex items-center gap-1">
              {packageInfo.githubUrl && (
                <a
                  href={packageInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {packageInfo.npmUrl && (
                <a
                  href={packageInfo.npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <NpmIcon className="h-8 w-8" />
                </a>
              )}
            </div>
          </div>
          {packageInfo.error && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{packageInfo.error}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/30">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Not in Directory</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlistedPackageItem;
