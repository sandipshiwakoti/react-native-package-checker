import {
  ChevronDown,
  CircleDot,
  ExternalLink,
  GitFork,
  GitPullRequest,
  Package,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { externalUrls } from '@/config/urls';
import {
  getActiveForksUrl,
  getContributorsActivityUrl,
  getMaintenanceIssuesUrl,
  getMaintenancePRSearchUrl,
  getNewArchIssueSearchUrl,
  getNewArchMergedPRSearchUrl,
  getNewArchPRSearchUrl,
  getReadmeUrl,
} from '@/lib/helpers';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface MoreLinksButtonProps {
  name: string;
  packageInfo: PackageInfo;
}

export const MoreLinksButton = ({ name, packageInfo }: MoreLinksButtonProps) => {
  if (!packageInfo.githubUrl) return null;

  const renderNewArchLinks = () => {
    if (packageInfo.newArchitecture === NewArchSupportStatus.Supported) {
      return (
        <>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getNewArchMergedPRSearchUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GitPullRequest className="h-4 w-4 opacity-70" />
              <span>New Arch Merged PRs</span>
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
              <span>New Arch Open Issues</span>
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
              <span>New Arch Open PRs</span>
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
            <span>Maintenance Open Issues</span>
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
            <Users className="h-4 w-4 opacity-70" />
            <span>Contributors Activity</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getActiveForksUrl(packageInfo.githubUrl ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GitFork className="h-4 w-4 opacity-70" />
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
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={externalUrls.tools.bundlephobia.package(name, packageInfo.version)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4 opacity-70" />
              <span>Bundle Size Analysis</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getReadmeUrl(packageInfo.githubUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <CircleDot className="h-4 w-4 opacity-70" />
              <span>Documentation</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
