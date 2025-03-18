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
                    Core dependency required by React Native. Not listed in the directory but fully
                    compatible with the New Architecture.
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={packageInfo.npmUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <NpmIcon className="h-8 w-8" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="w-45">View on npm registry</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          {packageInfo.error && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md 
              bg-red-100/50 text-red-700 
              dark:bg-red-900/30 dark:text-red-400"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">{packageInfo.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlistedPackageItem;
