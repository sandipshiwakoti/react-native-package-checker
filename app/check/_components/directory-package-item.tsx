import React from 'react';
import { AlertOctagon, Archive, Calendar, Eye, GitFork, Star } from 'lucide-react';

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
        <div className="block sm:hidden">
          <PackageStatus packageInfo={packageInfo} />
        </div>
        <div className="flex flex-col gap-1">
          {packageInfo.unmaintained && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-100/50 dark:bg-amber-900/30 w-fit">
              <Archive className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-600 dark:text-amber-400">Unmaintained</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-1">
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
          <div className="flex flex-wrap gap-2 mb-2">
            {packageInfo.platforms?.ios && (
              <span className="px-2 py-0.5 bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                iOS
              </span>
            )}
            {packageInfo.platforms?.android && (
              <span className="px-2 py-0.5 bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium">
                Android
              </span>
            )}
            {packageInfo.platforms?.web && (
              <span className="px-2 py-0.5 bg-purple-100/70 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium">
                Web
              </span>
            )}
            {packageInfo.support?.hasTypes && (
              <span className="px-2 py-0.5 bg-slate-100/70 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 rounded-full text-xs font-medium">
                TypeScript
              </span>
            )}
            {packageInfo.support?.license && (
              <a
                href={packageInfo.support.licenseUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 bg-slate-100/70 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 rounded-full text-xs font-medium hover:bg-slate-200/70 dark:hover:bg-slate-700/50 transition-colors"
              >
                {packageInfo.support.license}
              </a>
            )}
            {packageInfo.isRecent && (
              <span className="px-2 py-0.5 bg-slate-100/70 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 rounded-full text-xs font-medium">
                Recent
              </span>
            )}
          </div>
          {packageInfo.github?.description && (
            <p className="text-sm text-muted-foreground max-w-[600px] mb-1">
              {packageInfo.github.description}
              {packageInfo.alternatives && packageInfo.alternatives.length > 0 && (
                <span className="block mt-2">
                  <span className="font-medium">Alternatives: </span>
                  {packageInfo.alternatives.map((alt, index) => (
                    <a
                      key={index}
                      href={externalUrls.npm.package(alt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {alt}
                      {index < (packageInfo.alternatives?.length ?? 0) - 1 ? ', ' : ''}
                    </a>
                  ))}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="hidden sm:flex shrink-0">
          <PackageStatus packageInfo={packageInfo} />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        {packageInfo.github && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border">
              <span className="text-xs font-medium text-muted-foreground">Score:</span>
              <div
                className={`sm:text-lg font-semibold ${
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
