'use client';

import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PackageResults } from '@/components/package-results';
import { PackageUploadModal } from '@/components/package-upload-modal';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Archive,
  CheckCircle,
  ChevronDown,
  Filter,
  Package2,
  UploadIcon,
  X,
  XCircle,
} from 'lucide-react';
import { NewArchFilter } from '../../types';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo } from 'react';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [tempArchFilters, setTempArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);
  const [tempMaintenanceFilter, setTempMaintenanceFilter] = useState(false);

  const packages = useMemo(() => {
    const packagesParam = searchParams?.get('packages');
    return packagesParam?.split(',').filter(Boolean) || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeArchFilters]);

  const handleArchFilterChange = useCallback((checked: boolean, value: NewArchFilter) => {
    setTempArchFilters(prev => {
      const filtered = prev.filter(f => f !== value);
      if (checked) {
        filtered.push(value);
      }
      return filtered;
    });
  }, []);

  useEffect(() => {
    if (open) {
      setTempArchFilters(activeArchFilters);
      setTempMaintenanceFilter(activeMaintenanceFilter);
    }
  }, [open, activeArchFilters, activeMaintenanceFilter]);

  if (packages.length === 0) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="py-6 border-b mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Package Analysis</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground">
                  {packages.length} package{packages.length > 1 ? 's' : ''} selected
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(true)}
                  className="text-sm text-muted-foreground hover:text-foreground gap-2"
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload Packages
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                  activeArchFilters.length > 0 ? 'bg-muted' : 'text-muted-foreground'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {activeArchFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setActiveArchFilters([])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[300px] justify-between',
                      activeArchFilters.length === 0 && !activeMaintenanceFilter
                        ? 'text-gray-400 hover:text-gray-400'
                        : ''
                    )}
                  >
                    {activeArchFilters.length === 0 && !activeMaintenanceFilter
                      ? 'Select filters'
                      : `${activeArchFilters.length + (activeMaintenanceFilter ? 1 : 0)} filter${
                          activeArchFilters.length + (activeMaintenanceFilter ? 1 : 0) > 1
                            ? 's'
                            : ''
                        } selected`}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Filters</span>
                      <X
                        className="h-4 w-4 cursor-pointer hover:text-gray-600"
                        onClick={() => setOpen(false)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">New Architecture Support</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="supported"
                            checked={tempArchFilters.includes('supported')}
                            onCheckedChange={checked =>
                              handleArchFilterChange(!!checked, 'supported')
                            }
                          />
                          <label
                            htmlFor="supported"
                            className="flex items-center gap-2 text-sm font-medium leading-none"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Supported</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="unsupported"
                            checked={tempArchFilters.includes('unsupported')}
                            onCheckedChange={checked =>
                              handleArchFilterChange(!!checked, 'unsupported')
                            }
                          />
                          <label
                            htmlFor="unsupported"
                            className="flex items-center gap-2 text-sm font-medium leading-none"
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Unsupported</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="untested"
                            checked={tempArchFilters.includes('untested')}
                            onCheckedChange={checked =>
                              handleArchFilterChange(!!checked, 'untested')
                            }
                          />
                          <label
                            htmlFor="untested"
                            className="flex items-center gap-2 text-sm font-medium leading-none"
                          >
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <span>Untested</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="text-sm text-muted-foreground">Maintenance Status</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="unmaintained"
                            checked={tempMaintenanceFilter}
                            onCheckedChange={checked => setTempMaintenanceFilter(!!checked)}
                          />
                          <label
                            htmlFor="unmaintained"
                            className="flex items-center gap-2 text-sm font-medium leading-none"
                          >
                            <Archive className="h-4 w-4 text-amber-500" />
                            <span>Unmaintained</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveArchFilters([]);
                          setActiveMaintenanceFilter(false);
                          setOpen(false);
                        }}
                        className="w-20"
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveArchFilters(tempArchFilters);
                          setActiveMaintenanceFilter(tempMaintenanceFilter);
                          setOpen(false);
                        }}
                        className="w-20"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <PackageResults
          packages={packages}
          activeArchFilters={activeArchFilters}
          showUnmaintained={activeMaintenanceFilter}
        />
        <PackageUploadModal
          open={showPreview}
          onOpenChange={setShowPreview}
          defaultPackages={packages}
          onAnalyze={selectedPackages => {
            setShowPreview(false);
            if (selectedPackages.length > 0) {
              router.push(`/check?packages=${selectedPackages.join(',')}`);
            } else {
              router.push('/');
            }
          }}
        />
      </div>
    </div>
  );
}
