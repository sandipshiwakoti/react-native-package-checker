import React, { useEffect, useMemo } from 'react';
import DebounceControl from 'debounce-control';
import { Trash2 } from 'lucide-react';
import { AlertCircle, Archive, CheckCircle, XCircle } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { DirectoryPackageItem } from '@/app/check/_components/directory-package-item';
import { EmptyListFallback } from '@/components/common/empy-list-fallback';
import { FilterButton } from '@/components/common/filter-button';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { Pagination } from '@/components/common/pagination';
import { SearchBar } from '@/components/common/search-bar';
import { SortControl } from '@/components/common/sort-control';
import { ViewToggleButton } from '@/components/common/view-toggle-button';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { useFilter } from '@/contexts/filter-context';
import { NewArchSupportStatus, PackageInfo } from '@/types';

interface DirectoryPackagesTabContentProps {
  data: Record<string, PackageInfo> | undefined;
}

const newArchChipConfig = {
  supported: { icon: CheckCircle, label: 'Supported', variant: 'green' },
  unsupported: { icon: XCircle, label: 'Unsupported', variant: 'red' },
  untested: { icon: AlertCircle, label: 'Untested', variant: 'yellow' },
} as const;

const DirectoryPackagesTabContent = ({ data }: DirectoryPackagesTabContentProps) => {
  const {
    activeFilter,
    activeArchFilters,
    setActiveArchFilters,
    activeMaintenanceFilter,
    setActiveMaintenanceFilter,
  } = useFilter();
  const [searchText, setSearchText] = useQueryState('directory_q', {
    defaultValue: '',
  });
  const [viewMode, setViewMode] = useQueryState<'list' | 'grid'>('directory_view', {
    defaultValue: 'list',
    parse: value => (value === 'grid' ? 'grid' : 'list'),
  });
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: 1,
    parse: Number,
  });
  const [sortBy, setSortBy] = useQueryState<'name' | 'stars' | 'updated'>('sort', {
    defaultValue: 'name',
    parse: value =>
      ['name', 'stars', 'updated'].includes(value)
        ? (value as 'name' | 'stars' | 'updated')
        : 'name',
  });
  const [sortOrder, setSortOrder] = useQueryState<'asc' | 'desc'>('order', {
    defaultValue: 'asc',
    parse: value => (value === 'desc' ? 'desc' : 'asc'),
  });
  const [itemsPerPage, setItemsPerPage] = useQueryState('limit', {
    defaultValue: 10,
    parse: value => (value === 'all' ? -1 : Number(value) || 10),
    serialize: value => (value === -1 ? 'all' : String(value)),
  });

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
            <SortControl
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={value => {
                setSortBy(value);
                setCurrentPage(1);
              }}
              onSortOrderChange={setSortOrder}
              className="text-muted-foreground hover:text-foreground"
            />
            <ViewToggleButton
              viewMode={viewMode}
              onChange={setViewMode}
              className="text-muted-foreground hover:text-foreground hidden lg:flex"
            />
          </div>
        </div>
      </div>
      {(activeArchFilters.length > 0 || activeMaintenanceFilter) && (
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
          {activeArchFilters.map(filter => {
            const config = newArchChipConfig[filter as keyof typeof newArchChipConfig];

            return (
              <Chip
                key={filter}
                icon={config.icon}
                label={config.label}
                variant={config.variant}
                onRemove={() => setActiveArchFilters(activeArchFilters.filter(f => f !== filter))}
              />
            );
          })}
          {activeMaintenanceFilter && (
            <Chip
              icon={Archive}
              label="Unmaintained"
              variant="amber"
              onRemove={() => setActiveMaintenanceFilter(false)}
            />
          )}
          <Button
            variant="ghost"
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
          <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'lg:grid-cols-2' : ''} gap-5`}>
            {paginatedResults.map(([name, packageInfo]) => (
              <DirectoryPackageItem key={name} packageInfo={packageInfo} name={name} />
            ))}
          </div>
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
