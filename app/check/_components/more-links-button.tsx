import { ChevronDown, CircleDot, ExternalLink, GitPullRequest } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getMaintenanceIssuesUrl,
  getMaintenancePRSearchUrl,
  getNewArchIssueSearchUrl,
  getNewArchPRSearchUrl,
} from '@/lib/helpers';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface MoreLinksButtonProps {
  packageInfo: PackageInfo;
}

export const MoreLinksButton = ({ packageInfo }: MoreLinksButtonProps) => {
  if (!packageInfo.githubUrl) return null;

  const renderNewArchLinks = () => {
    if (
      packageInfo.newArchitecture !== NewArchSupportStatus.Untested &&
      packageInfo.newArchitecture !== NewArchSupportStatus.Unsupported
    ) {
      return null;
    }

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
            <span>New Architecture Issues</span>
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
            <span>New Architecture PRs</span>
          </a>
        </DropdownMenuItem>
      </>
    );
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
            <span>Maintenance Status</span>
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
      </>
    );
  };

  const hasLinks =
    packageInfo.newArchitecture === NewArchSupportStatus.Untested ||
    packageInfo.newArchitecture === NewArchSupportStatus.Unsupported ||
    packageInfo.unmaintained;

  if (!hasLinks) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-card/50 dark:bg-card/30 gap-1.5">
          <ExternalLink className="h-3 w-3 opacity-50" />
          <span className="text-muted-foreground text-xs">More Links</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/50 dark:bg-card/30 min-w-[200px]">
        {renderNewArchLinks()}
        {renderMaintenanceLinks()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
