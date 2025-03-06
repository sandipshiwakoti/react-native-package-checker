import React, { useMemo, useState } from 'react';
import DebounceControl from 'debounce-control';
import { Package2 } from 'lucide-react';

import UnlistedPackageItem from '@/app/check/_components/unlisted-package-item';
import { HeadingWithInfo } from '@/components/common/header-with-info';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyListFallback } from '@/components/empy-list-fallback';
import { PackageInfo } from '@/types';

interface UnlistedPackagesTabContentProps {
  data: Record<string, PackageInfo> | undefined;
}

const UnlistedPackagesTabContent = ({ data }: UnlistedPackagesTabContentProps) => {
  const [searchText, setSearchText] = useState('');

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
      <div className="flex flex-col gap-3 flex-wrap md:flex-row md:items-start md:justify-between py-2 mb-2 sticky top-0 bg-white z-10">
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
        <DebounceControl
          value={searchText}
          onDebouncedChange={setSearchText}
          delay={300}
          render={({ value, onChange }) => (
            <SearchBar
              value={value}
              onChange={onChange}
              placeholder="Search packages"
              className="w-full"
            />
          )}
        />
      </div>
      {unlistedPackages.length > 0 ? (
        <div className="space-y-6">
          {unlistedPackages.map(([name, packageInfo]) => (
            <UnlistedPackageItem key={name} packageInfo={packageInfo} name={name} />
          ))}
        </div>
      ) : (
        <EmptyListFallback message="No packages match the selected filters" Icon={Package2} />
      )}
    </>
  );
};

export default UnlistedPackagesTabContent;
