import React from 'react';
import { AlertOctagon, Calendar, Eye, GitFork, Star } from 'lucide-react';

import { MoreLinksButton } from '@/app/check/_components/more-links-button';
import { PackageStatus } from '@/app/check/_components/package-status';
import { GithubIcon } from '@/components/icons/github';
import { NpmIcon } from '@/components/icons/npm';
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
      transition-all duration-200 mb-6 shadow-sm hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center flex-wrap gap-2 justify-between w-full mb-1">
            <div className="flex items-center gap-2">
              <h3 className="sm:text-lg font-medium relative group">{name}</h3>
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
            <MoreLinksButton packageInfo={packageInfo} />
          </div>
          <div className="mb-2">
            <PackageStatus packageInfo={packageInfo} />
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
      <div className="flex flex-row justify-between items-end gap-3">
        {packageInfo.github && (
          <div className="flex flex-wrap gap-2 sm:gap-3 text-sm text-muted-foreground">
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
          </div>
        )}
        {packageInfo.score !== undefined && (
          <div className="relative group">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card border">
              <span className="text-xs font-medium text-muted-foreground">Score:</span>
              <div
                className={`text-sm font-semibold ${
                  packageInfo.score > 75
                    ? 'text-green-500'
                    : packageInfo.score > 50
                      ? 'text-blue-500'
                      : packageInfo.score > 25
                        ? 'text-amber-500'
                        : 'text-red-500'
                }`}
              >
                {packageInfo.score}/100
              </div>
            </div>
            {packageInfo.matchingScoreModifiers &&
              packageInfo.matchingScoreModifiers.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="text-xs font-medium mb-2">Score Modifiers:</div>
                  <ul className="space-y-1">
                    {packageInfo.matchingScoreModifiers.map((modifier, index) => (
                      <li
                        key={index}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        {modifier}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
