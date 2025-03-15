import React, { useEffect, useMemo, useState } from 'react';
import DebounceControl from 'debounce-control';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { AlertCircle, Archive, CheckCircle, XCircle } from 'lucide-react';

import { DirectoryPackageItem } from '@/app/check/_components/directory-package-item';
import { EmptyListFallback } from '@/components/common/empy-list-fallback';
import { FilterButton } from '@/components/common/filter-button';
import { FilterChip } from '@/components/common/filter-chip';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { Pagination } from '@/components/common/pagination';
import { SearchBar } from '@/components/common/search-bar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useFilter } from '@/contexts/filter-context';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface DirectoryPackagesTabContentProps {
  data: Record<string, PackageInfo> | undefined;
}

const DirectoryPackagesTabContent = ({ data }: DirectoryPackagesTabContentProps) => {
  const {
    activeFilter,
    activeArchFilters,
    setActiveArchFilters,
    activeMaintenanceFilter,
    setActiveMaintenanceFilter,
  } = useFilter();

  const chipConfig = {
    supported: { icon: CheckCircle, label: 'Supported', variant: 'green' },
    unsupported: { icon: XCircle, label: 'Unsupported', variant: 'red' },
    untested: { icon: AlertCircle, label: 'Untested', variant: 'yellow' },
  } as const;

  useEffect(() => {
    if (
      activeFilter === 'supported' ||
      activeFilter === 'unsupported' ||
      activeFilter === 'untested'
    ) {
      setActiveArchFilters([activeFilter]);
    } else if (activeFilter === 'unmaintained') {
      setActiveMaintenanceFilter(true);
    }
  }, [activeFilter, setActiveArchFilters, setActiveMaintenanceFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchText, setSearchText] = useState('');

  const { paginatedResults, totalPages, totalCount } = useMemo(() => {
    if (!data) return { paginatedResults: [], totalPages: 0, totalCount: 0 };

    // Filter by architecture and maintenance status
    const filteredByStatus = Object.entries(data).filter(([_, packageInfo]) => {
      if (activeArchFilters.length === 0 && !activeMaintenanceFilter) return true;

      if (activeArchFilters.length === 0 && activeMaintenanceFilter) {
        return packageInfo.unmaintained;
      }

      if (activeArchFilters.length > 0 && !activeMaintenanceFilter) {
        return activeArchFilters.some(filter => {
          switch (filter) {
            case 'supported':
              return packageInfo.newArchitecture === NewArchSupportStatus.Supported;
            case 'unsupported':
              return packageInfo.newArchitecture === NewArchSupportStatus.Unsupported;
            case 'untested':
              return packageInfo.newArchitecture === NewArchSupportStatus.Untested;
            default:
              return false;
          }
        });
      }

      return (
        packageInfo.unmaintained ||
        activeArchFilters.some(filter => {
          switch (filter) {
            case 'supported':
              return packageInfo.newArchitecture === NewArchSupportStatus.Supported;
            case 'unsupported':
              return packageInfo.newArchitecture === NewArchSupportStatus.Unsupported;
            case 'untested':
              return packageInfo.newArchitecture === NewArchSupportStatus.Untested;
            default:
              return false;
          }
        })
      );
    });

    // Filter by directory status and search query
    const filteredResults = filteredByStatus.filter(
      ([name, packageInfo]) =>
        !packageInfo.notInDirectory &&
        (!searchText || name.toLowerCase().includes(searchText.toLowerCase()))
    );

    // Sort results
    const sortedResults = [...filteredResults].sort(([aName, aStatus], [bName, bStatus]) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;

      switch (sortBy) {
        case 'stars':
          return (
            multiplier *
            ((aStatus.github?.stargazers_count || 0) - (bStatus.github?.stargazers_count || 0))
          );
        case 'updated':
          return (
            multiplier *
            (new Date(aStatus.github?.updated_at || 0).getTime() -
              new Date(bStatus.github?.updated_at || 0).getTime())
          );
        default:
          return multiplier * aName.localeCompare(bName);
      }
    });

    // Paginate results
    if (itemsPerPage === -1) {
      return {
        paginatedResults: sortedResults,
        totalPages: 1,
        totalCount: sortedResults.length,
      };
    }

    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedResults = sortedResults.slice(start, start + itemsPerPage);

    return {
      paginatedResults,
      totalPages,
      totalCount: sortedResults.length,
    };
  }, [
    data,
    activeArchFilters,
    activeMaintenanceFilter,
    searchText,
    sortBy,
    sortOrder,
    itemsPerPage,
    currentPage,
  ]);

  return (
    <>
      <div className="flex flex-col gap-3 flex-wrap md:flex-row md:items-start md:justify-between py-2 mb-2 sticky top-0 bg-background z-10">
        <div>
          <HeadingWithInfo
            title="Directory Packages"
            tooltip="Packages listed in the official React Native directory"
            variant="small"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Found {totalCount} directory packages
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DebounceControl
            value={searchText}
            onDebouncedChange={value => {
              setSearchText(value);
              setCurrentPage(1);
            }}
            delay={300}
            render={({ value, onChange }) => (
              <SearchBar
                value={value}
                onChange={onChange}
                placeholder="Search packages"
                containerClassName="flex-1"
                className="w-full"
              />
            )}
          />
          <div className="flex items-center gap-2">
            <FilterButton />
            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'stars' | 'updated') => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] sm:w-[160px]">
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
      </div>
      {(activeArchFilters.length > 0 || activeMaintenanceFilter) && (
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
          {activeArchFilters.map(filter => {
            const config = chipConfig[filter as keyof typeof chipConfig];

            return (
              <FilterChip
                key={filter}
                icon={config.icon}
                label={config.label}
                variant={config.variant}
                onRemove={() => setActiveArchFilters(activeArchFilters.filter(f => f !== filter))}
              />
            );
          })}
          {activeMaintenanceFilter && (
            <FilterChip
              icon={Archive}
              label="Unmaintained"
              variant="amber"
              onRemove={() => setActiveMaintenanceFilter(false)}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-6 px-2 gap-1"
            onClick={() => {
              setActiveArchFilters([]);
              setActiveMaintenanceFilter(false);
            }}
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
      {totalCount > 0 ? (
        <div>
          {paginatedResults.map(([name, packageInfo]) => (
            <DirectoryPackageItem key={name} packageInfo={packageInfo} name={name} />
          ))}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <EmptyListFallback
          title="No packages found"
          message="Try adjusting your filters or searching with different keywords."
        />
      )}
    </>
  );
};

export default DirectoryPackagesTabContent;
