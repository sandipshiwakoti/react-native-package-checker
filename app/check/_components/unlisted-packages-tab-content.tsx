import React, { useMemo, useState } from 'react';
import DebounceControl from 'debounce-control';
import { AlertCircle, Package2 } from 'lucide-react';

import UnlistedPackageItem from '@/app/check/_components/unlisted-package-item';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyListFallback } from '@/components/empy-list-fallback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
        <DebounceControl
          value={searchText}
          onDebouncedChange={setSearchText}
          delay={300}
          render={({ value, onChange }) => (
            <SearchBar value={value} onChange={onChange} placeholder="Search packages" />
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
