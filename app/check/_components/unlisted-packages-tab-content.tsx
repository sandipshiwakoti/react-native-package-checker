import React, { useMemo, useState } from 'react';
import DebounceControl from 'debounce-control';

import UnlistedPackageItem from '@/app/check/_components/unlisted-package-item';
import { EmptyListFallback } from '@/components/common/empy-list-fallback';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { SearchBar } from '@/components/common/search-bar';
import { ViewToggleButton } from '@/components/common/view-toggle-button';
import { PackageInfo } from '@/types';

interface UnlistedPackagesTabContentProps {
  data: Record<string, PackageInfo> | undefined;
}

const UnlistedPackagesTabContent = ({ data }: UnlistedPackagesTabContentProps) => {
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const unlistedPackages = useMemo(
    () =>
      Object.entries(data ?? []).filter(
        ([name, status]) =>
          status.notInDirectory &&
          (!searchText || name.toLowerCase().includes(searchText.toLowerCase()))
      ),
    [data, searchText]
  );

  return (
    <>
      <div className="flex flex-col gap-3 flex-wrap md:flex-row md:items-start md:justify-between py-2 mb-2 sticky top-0 bg-background z-10">
        <div>
          <HeadingWithInfo
            title="Unlisted Packages"
            tooltip="Packages not found in the official React Native directory"
            variant="small"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Found {unlistedPackages.length} unlisted{' '}
            {unlistedPackages.length === 1 ? 'package' : 'packages'}
          </p>
        </div>
        <div className="flex justify-between gap-3">
          <DebounceControl
            value={searchText}
            onDebouncedChange={setSearchText}
            delay={300}
            render={({ value, onChange }) => (
              <SearchBar
                value={value}
                onChange={onChange}
                placeholder="Search packages"
                className="w-full flex-2"
              />
            )}
          />
          <ViewToggleButton
            viewMode={viewMode}
            onChange={setViewMode}
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          />
        </div>
      </div>
      {unlistedPackages.length > 0 ? (
        <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'sm:grid-cols-2' : ''} gap-5`}>
          {unlistedPackages.map(([name, packageInfo]) => (
            <UnlistedPackageItem key={name} packageInfo={packageInfo} name={name} />
          ))}
        </div>
      ) : (
        <EmptyListFallback
          title="No packages found"
          message="Try searching with different keywords."
        />
      )}
    </>
  );
};

export default UnlistedPackagesTabContent;
