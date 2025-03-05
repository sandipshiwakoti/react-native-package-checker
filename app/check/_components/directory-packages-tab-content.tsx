import React, { useMemo, useState } from 'react';
import DebounceControl from 'debounce-control';
import { ArrowUpDown, Package2 } from 'lucide-react';

import { DirectoryPackageItem } from '@/app/check/_components/directory-package-item';
import { FilterButton } from '@/components/common/filter-button';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { Pagination } from '@/components/common/pagination';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyListFallback } from '@/components/empy-list-fallback';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { NewArchFilter, NewArchSupportStatus, PackageInfo } from '@/types';

interface DirectoryPackagesTabContentProps {
  data: Record<string, PackageInfo> | undefined;
}

const DirectoryPackagesTabContent = ({ data }: DirectoryPackagesTabContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchText, setSearchText] = useState('');
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);

  const { paginatedResults, totalPages, totalCount } = useMemo(() => {
    if (!data) return { paginatedResults: [], totalPages: 0, totalCount: 0 };

    // Filter by architecture and maintenance status
    const filteredByStatus = Object.entries(data).filter(([_, packageInfo]) => {
      if (activeArchFilters.length === 0 && !activeMaintenanceFilter) return true;

      const matchesArchFilter =
        activeArchFilters.length === 0 ||
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
        });

      const matchesMaintenanceFilter = !activeMaintenanceFilter || packageInfo.unmaintained;

      return matchesArchFilter && matchesMaintenanceFilter;
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
      <div className="flex items-center justify-between py-2 sticky top-0 bg-white z-10">
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
        <div className="flex items-center gap-3">
          <DebounceControl
            value={searchText}
            onDebouncedChange={value => {
              setSearchText(value);
              setCurrentPage(1);
            }}
            delay={300}
            render={({ value, onChange }) => (
              <SearchBar value={value} onChange={onChange} placeholder="Search packages" />
            )}
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
          message="No packages match the selected filters. Try changing the filters or checking more packages."
          Icon={Package2}
        />
      )}
    </>
  );
};

export default DirectoryPackagesTabContent;
