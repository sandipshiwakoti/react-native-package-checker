import React from 'react';
import { AlertOctagon, Calendar, Eye, GitFork, InfoIcon, Star } from 'lucide-react';

import { MoreLinksButton } from '@/app/check/_components/more-links-button';
import { PackageFeaturesStatus } from '@/app/check/_components/package-features-status';
import { PackageNewArchStatus } from '@/app/check/_components/package-new-arch-status';
import { NpmIcon } from '@/components/icons/npm';
import { ReactNativeDirectoryIcon } from '@/components/icons/react-native-directory';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { externalUrls } from '@/config/urls';
import { PackageInfo } from '@/types';

interface DirectoryPackageItemProps {
  packageInfo: PackageInfo;
  name: string;
}

export const DirectoryPackageItem = ({ packageInfo, name }: DirectoryPackageItemProps) => {
  return (
    <div
      className="p-4 rounded-lg border border-border/80 bg-card/50 hover:border-primary/50 hover:bg-card/80 
      dark:border-border/70 dark:hover:border-primary/40 dark:hover:bg-card/60 
      transition-all duration-200 mb-6 shadow-sm hover:shadow-md flex flex-col justify-between gap-2 min-h-[200px]"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-wrap justify-between gap-3">
            <PackageNewArchStatus packageInfo={packageInfo} />
            <MoreLinksButton name={name} packageInfo={packageInfo} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="sm:text-lg font-medium relative group">
              {packageInfo.githubUrl ? (
                <a
                  href={packageInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                >
                  {name}
                </a>
              ) : (
                name
              )}
            </h3>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={externalUrls.reactNativeDirectory.package(name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground p-1"
                    >
                      <ReactNativeDirectoryIcon className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="w-45">View on React Native Directory</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          <div className="mb-2">
            <PackageFeaturesStatus packageInfo={packageInfo} />
          </div>
          {packageInfo.github?.description && (
            <p className="text-sm text-muted-foreground max-w-[600px] mb-1">
              <span>{packageInfo.github.description}</span>
            </p>
          )}
          {packageInfo.alternatives && packageInfo.alternatives.length > 0 && (
            <span className="text-sm text-muted-foreground max-w-[600px] mb-1">
              <span className="font-medium">Alternatives: </span>
              {packageInfo.alternatives.map((alt, index) => (
                <a
                  key={index}
                  href={externalUrls.npm.package(alt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  {alt}
                  {index < (packageInfo.alternatives?.length ?? 0) - 1 ? ', ' : ''}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
      {packageInfo.github && (
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-sm text-muted-foreground">
          <a
            href={packageInfo.github.commits_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Updated {new Date(packageInfo.github.updated_at).toLocaleDateString()}</span>
          </a>
          <a
            href={packageInfo.github.stargazers_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Star className="h-4 w-4" />
            <span>{packageInfo.github.stargazers_count.toLocaleString()}</span>
          </a>
          <a
            href={packageInfo.github.forks_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <GitFork className="h-4 w-4" />
            <span>{packageInfo.github.forks_count.toLocaleString()}</span>
          </a>
          <a
            href={packageInfo.github.watchers_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{packageInfo.github.watchers_count.toLocaleString()}</span>
          </a>
          <a
            href={packageInfo.github.issues_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>{packageInfo.github.open_issues_count.toLocaleString()} issues</span>
          </a>
          {!packageInfo?.isRecent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  These GitHub statistics might be slightly outdated. Visit GitHub for real-time
                  numbers.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
};
