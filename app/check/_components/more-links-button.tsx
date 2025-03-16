import { ChevronDown, CircleDot, ExternalLink, GitPullRequest } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getActiveForksUrl,
  getContributorsActivityUrl,
  getMaintenanceIssuesUrl,
  getMaintenancePRSearchUrl,
  getNewArchIssueSearchUrl,
  getNewArchPRSearchUrl,
  getNewArchReleaseNotesUrl,
} from '@/lib/helpers';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface MoreLinksButtonProps {
  packageInfo: PackageInfo;
}

export const MoreLinksButton = ({ packageInfo }: MoreLinksButtonProps) => {
  if (!packageInfo.githubUrl) return null;

  const renderNewArchLinks = () => {
    if (packageInfo.newArchitecture === NewArchSupportStatus.Supported) {
      return (
        <>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getNewArchReleaseNotesUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <CircleDot className="h-4 w-4 opacity-70" />
              <span>New Arch Release Notes</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getNewArchPRSearchUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GitPullRequest className="h-4 w-4 opacity-70" />
              <span>New Arch PRs</span>
            </a>
          </DropdownMenuItem>
        </>
      );
    }

    if (
      packageInfo.newArchitecture === NewArchSupportStatus.Untested ||
      packageInfo.newArchitecture === NewArchSupportStatus.Unsupported
    ) {
      return (
        <>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getNewArchIssueSearchUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <CircleDot className="h-4 w-4 opacity-70" />
              <span>New Arch Issues</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getNewArchPRSearchUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GitPullRequest className="h-4 w-4 opacity-70" />
              <span>New Arch PRs</span>
            </a>
          </DropdownMenuItem>
        </>
      );
    }

    return null;
  };

  const renderMaintenanceLinks = () => {
    if (!packageInfo.unmaintained) return null;

    return (
      <>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getMaintenanceIssuesUrl(packageInfo.githubUrl ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <CircleDot className="h-4 w-4 opacity-70" />
            <span>Maintenance Issues</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getMaintenancePRSearchUrl(packageInfo.githubUrl ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GitPullRequest className="h-4 w-4 opacity-70" />
            <span>Stale PRs</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getContributorsActivityUrl(packageInfo.githubUrl ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GitPullRequest className="h-4 w-4 opacity-70" />
            <span>Contributor Activity</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getActiveForksUrl(packageInfo.githubUrl ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GitPullRequest className="h-4 w-4 opacity-70" />
            <span>Most Active Forks</span>
          </a>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-card/50 dark:bg-card/30 gap-1.5">
          <ExternalLink className="h-3 w-3 opacity-50" />
          <span className="text-muted-foreground text-xs">Explore More</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end">
          {renderMaintenanceLinks()}
          {renderNewArchLinks()}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
