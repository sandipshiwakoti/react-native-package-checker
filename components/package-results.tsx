import { useState } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Archive,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  GitFork,
  Github,
  Package2,
  Star,
  XCircle,
} from 'lucide-react';
import { MessageCircle } from 'lucide-react';

import { FilterButton } from '@/components/filter-button';
import { Overview } from '@/components/overview';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { externalUrls } from '@/config/urls';
import { CORE_PACKAGES, NEW_ARCH_ISSUE_QUERY } from '@/constants';
import { useDebounce } from '@/hooks/use-debounce';
import { NewArchFilter, NewArchSupportStatus, PackageInfo } from '@/types';

interface PackageResultsProps {
  data?: Record<string, PackageInfo>;
  activeArchFilters: NewArchFilter[];
  setActiveArchFilters: (_filters: NewArchFilter[]) => void;
  activeMaintenanceFilter: boolean;
  setActiveMaintenanceFilter: (_value: boolean) => void;
  showUnmaintained: boolean;
}

export function PackageResults({
  data: results,
  activeArchFilters,
  setActiveArchFilters,
  activeMaintenanceFilter,
  setActiveMaintenanceFilter,
  showUnmaintained,
}: PackageResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [directorySearchInput, setDirectorySearchInput] = useState('');
  const [unlistedSearchInput, setUnlistedSearchInput] = useState('');
  const directorySearchQuery = useDebounce(directorySearchInput);
  const unlistedSearchQuery = useDebounce(unlistedSearchInput);

  const getFilteredResults = () => {
    if (!results) return [];

    return Object.entries(results).filter(([_, status]) => {
      if (activeArchFilters.length === 0 && !showUnmaintained) return true;

      const matchesArchFilter =
        activeArchFilters.length === 0 ||
        activeArchFilters.some(filter => {
          switch (filter) {
            case 'supported':
              return status.newArchitecture === NewArchSupportStatus.Supported;
            case 'unsupported':
              return status.newArchitecture === NewArchSupportStatus.Unsupported;
            case 'untested':
              return status.newArchitecture === NewArchSupportStatus.Untested;
            default:
              return false;
          }
        });

      const matchesMaintenanceFilter = !showUnmaintained || status.unmaintained;

      return matchesArchFilter && matchesMaintenanceFilter;
    });
  };

  const unlistedPackages = Object.entries(results ?? []).filter(
    ([name, status]) =>
      status.notInDirectory &&
      (!unlistedSearchQuery || name.toLowerCase().includes(unlistedSearchQuery.toLowerCase()))
  );

  const directoryPackages = getFilteredResults().filter(
    ([name, status]) =>
      !status.notInDirectory &&
      (!directorySearchQuery || name.toLowerCase().includes(directorySearchQuery.toLowerCase()))
  );

  const getSortedAndPaginatedResults = () => {
    const sortedResults = [...directoryPackages].sort(([aName, aStatus], [bName, bStatus]) => {
      switch (sortBy) {
        case 'stars':
          return sortOrder === 'asc'
            ? (aStatus.github?.stargazers_count || 0) - (bStatus.github?.stargazers_count || 0)
            : (bStatus.github?.stargazers_count || 0) - (aStatus.github?.stargazers_count || 0);
        case 'updated':
          return sortOrder === 'asc'
            ? new Date(aStatus.github?.updated_at || 0).getTime() -
                new Date(bStatus.github?.updated_at || 0).getTime()
            : new Date(bStatus.github?.updated_at || 0).getTime() -
                new Date(aStatus.github?.updated_at || 0).getTime();
        default:
          return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }
    });

    if (itemsPerPage === -1) {
      return { paginatedResults: sortedResults, totalPages: 1 };
    }

    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedResults = sortedResults.slice(start, start + itemsPerPage);

    return { paginatedResults, totalPages };
  };

  const getIssueSearchUrl = (repoUrl: string) => {
    const searchParams = new URLSearchParams({
      q: NEW_ARCH_ISSUE_QUERY,
    }).toString();
    return `${repoUrl}/issues?${searchParams}`;
  };

  const renderStatus = (status: PackageInfo) => {
    const archIcons = {
      [NewArchSupportStatus.Supported]: <CheckCircle className="h-4 w-4 text-green-500" />,
      [NewArchSupportStatus.Unsupported]: <XCircle className="h-4 w-4 text-red-500" />,
      [NewArchSupportStatus.Untested]: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/30">
          {archIcons[status.newArchitecture || NewArchSupportStatus.Untested]}
          <span className="text-sm">
            {status.newArchitecture === NewArchSupportStatus.Supported
              ? 'New Architecture Supported'
              : status.newArchitecture === NewArchSupportStatus.Unsupported
                ? 'New Architecture Unsupported'
                : 'New Architecture Untested'}
          </span>
          {(status.newArchitecture === NewArchSupportStatus.Unsupported ||
            status.newArchitecture === NewArchSupportStatus.Untested) &&
            status.githubUrl && (
              <a
                href={getIssueSearchUrl(status.githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:opacity-80 transition-colors ${
                  status.newArchitecture === NewArchSupportStatus.Unsupported
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
                title="View New Architecture related issues on GitHub"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
        </div>

        {status.error && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{status.error}</span>
          </div>
        )}
      </div>
    );
  };

  const renderEmptyList = (message?: string) => {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No packages found</h3>
        {message ? <p className="text-sm text-muted-foreground text-center">{message}</p> : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col space-y-6">
      <Overview results={results} />
      <div className="flex-1 py-2">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-popover-foreground text-xs">
                    Analysis results of React Native packages showing compatibility status and
                    metrics
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="directory" className="flex items-center gap-1.5">
              Directory Packages
            </TabsTrigger>
            <TabsTrigger value="unlisted" className="flex items-center gap-1.5">
              Unlisted Packages
            </TabsTrigger>
          </TabsList>
          <TabsContent value="directory" className="p-0 m-0">
            <div className="flex items-center justify-between py-2 sticky top-0 bg-white z-10">
              <div>
                <div className="flex flex-row gap-2 items-center">
                  <h2 className="text-md font-semibold">Directory Packages</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-popover-foreground text-xs">
                          Packages listed in the official React Native directory
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Found {directoryPackages.length} directory packages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SearchBar
                  value={directorySearchInput}
                  onChange={value => {
                    setDirectorySearchInput(value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search packages"
                />
                <FilterButton
                  activeArchFilters={activeArchFilters}
                  setActiveArchFilters={setActiveArchFilters}
                  activeMaintenanceFilter={activeMaintenanceFilter}
                  setActiveMaintenanceFilter={setActiveMaintenanceFilter}
                />
                <Select
                  value={sortBy}
                  onValueChange={(value: 'name' | 'stars' | 'updated') => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <span className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort by
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Package Name</SelectItem>
                    <SelectItem value="stars">GitHub Stars</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
            {directoryPackages.length > 0 ? (
              <div>
                {getSortedAndPaginatedResults().paginatedResults.map(([name, status]) => (
                  <div
                    key={name}
                    className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors mb-6"
                  >
                    <div className="flex items-start justify-between ">
                      <div className="flex flex-col gap-1">
                        {status.unmaintained && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-50 text-amber-700 w-fit">
                            <Archive className="h-4 w-4" />
                            <span className="text-sm">Package Unmaintained</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium relative group">{name}</h3>
                          <div className="flex items-center gap-1">
                            {status.githubUrl && (
                              <a
                                href={status.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                            {status.npmUrl && (
                              <a
                                href={status.npmUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Package2 className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {status.platforms?.ios && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              iOS
                            </span>
                          )}
                          {status.platforms?.android && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Android
                            </span>
                          )}
                          {status.platforms?.web && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Web
                            </span>
                          )}
                          {status.support?.hasTypes && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              TypeScript
                            </span>
                          )}
                          {status.support?.license && (
                            <a
                              href={status.support.licenseUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              {status.support.license}
                            </a>
                          )}
                        </div>
                        {status.github?.description && (
                          <p className="text-sm text-muted-foreground max-w-[600px] mb-1">
                            {status.github.description}
                            {status.alternatives && status.alternatives.length > 0 && (
                              <span className="block mt-2">
                                <span className="font-medium">Alternatives: </span>
                                {status.alternatives.map((alt, index) => (
                                  <a
                                    key={index}
                                    href={externalUrls.npm.package(alt)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                  >
                                    {alt}
                                    {index < (status.alternatives?.length ?? 0) - 1 ? ', ' : ''}
                                  </a>
                                ))}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {renderStatus(status)}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      {status.github && (
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                          <a
                            href={status.github.commits_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>
                              Updated {new Date(status.github.updated_at).toLocaleDateString()}
                            </span>
                          </a>
                          <a
                            href={status.github.stargazers_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <Star className="h-4 w-4" />
                            <span>{status.github.stargazers_count.toLocaleString()}</span>
                          </a>
                          <a
                            href={status.github.forks_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <GitFork className="h-4 w-4" />
                            <span>{status.github.forks_count.toLocaleString()}</span>
                          </a>
                          <a
                            href={status.github.watchers_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{status.github.watchers_count.toLocaleString()}</span>
                          </a>
                          <a
                            href={status.github.issues_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <AlertOctagon className="h-4 w-4" />
                            <span>{status.github.open_issues_count.toLocaleString()} issues</span>
                          </a>
                        </div>
                      )}
                      {status.score !== undefined && (
                        <div className="relative group">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border">
                            <span className="text-xs font-medium text-muted-foreground">
                              Score:
                            </span>
                            <div
                              className={`text-lg font-semibold ${
                                status.score > 75
                                  ? 'text-green-500'
                                  : status.score > 50
                                    ? 'text-blue-500'
                                    : status.score > 25
                                      ? 'text-amber-500'
                                      : 'text-red-500'
                              }`}
                            >
                              {status.score}/100
                            </div>
                          </div>
                          {status.matchingScoreModifiers &&
                            status.matchingScoreModifiers.length > 0 && (
                              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <div className="text-xs font-medium mb-2">Score Modifiers:</div>
                                <ul className="space-y-1">
                                  {status.matchingScoreModifiers.map((modifier, index) => (
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
                ))}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={value => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="-1">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {getSortedAndPaginatedResults().totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage(page =>
                          Math.min(getSortedAndPaginatedResults().totalPages, page + 1)
                        )
                      }
                      disabled={currentPage === getSortedAndPaginatedResults().totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              renderEmptyList(
                'No packages match the selected filters. Try changing the filters or checking more packages.'
              )
            )}
          </TabsContent>
          <TabsContent value="unlisted" className="p-0 m-0">
            <div className="flex items-center justify-between py-3 sticky top-0 backdrop-blur-sm bg-background/95 border-b z-10 -mx-6 px-6">
              <div>
                <div className="flex flex-row items-center gap-2">
                  <h2 className="text-md font-semibold">Unlisted Packages</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-popover-foreground text-xs">
                          Packages not found in the official React Native directory
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Found {unlistedPackages.length} unlisted{' '}
                  {unlistedPackages.length === 1 ? 'package' : 'packages'}
                </p>
              </div>
              <SearchBar
                value={unlistedSearchInput}
                onChange={value => setUnlistedSearchInput(value)}
                placeholder="Search packages"
              />
            </div>
            {unlistedPackages.length > 0 ? (
              <div className="space-y-6">
                {unlistedPackages.map(([name, status]) => (
                  <div
                    key={name}
                    className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">{name}</h3>
                          {CORE_PACKAGES.includes(name) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-popover-foreground text-xs">
                                    Core dependency required by React Native. Not listed in the
                                    directory but fully compatible with the New Architecture.
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <div className="flex items-center gap-1">
                            {status.githubUrl && (
                              <a
                                href={status.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                            {status.npmUrl && (
                              <a
                                href={status.npmUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Package2 className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {status.error && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">{status.error}</span>
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
                ))}
              </div>
            ) : (
              renderEmptyList('No packages match the selected filters')
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
