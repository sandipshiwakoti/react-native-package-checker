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
import { NewArchFilter, PackageInfo } from '../../types';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { prepareFileExportData } from '../../lib/file-export';
import { ExportButton } from '../../components/ExportButton';

export default function CheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Record<string, PackageInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [tempArchFilters, setTempArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);
  const [tempMaintenanceFilter, setTempMaintenanceFilter] = useState(false);
  const fileExportData = prepareFileExportData(results);

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

  useEffect(() => {
    const checkPackages = async () => {
      try {
        const archResponse = await fetch('/api/libraries/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ packages }),
        });

        if (!archResponse.ok) {
          throw new Error('Failed to check new architecture support');
        }

        const archData = await archResponse.json();

        const infoResponse = await fetch('/api/package-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ packages }),
        });

        if (!infoResponse.ok) {
          throw new Error('Failed to fetch package information');
        }

        const infoData = await infoResponse.json();

        const mergedResults = packages.reduce<Record<string, PackageInfo>>((acc, pkg) => {
          if (infoData[pkg]) {
            acc[pkg] = {
              ...(infoData[pkg] || {
                npmUrl: `https://www.npmjs.com/package/${pkg}`,
                notInDirectory: true,
                error: 'Package not found in React Native Directory',
              }),
              newArchitecture: archData[pkg]?.newArchitecture,
              unmaintained: archData[pkg]?.unmaintained,
              error: archData[pkg]?.error,
            };
          }
          return acc;
        }, {});

        setResults(mergedResults);
      } catch (e) {
        console.error('API Error:', e);
        setError(
          e instanceof Error
            ? `Failed to check packages: ${e.message}`
            : 'Connection failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (packages.length > 0) {
      checkPackages();
    }
  }, [packages]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="pt-4 pb-2 border-b mb-2">
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
              <ExportButton data={fileExportData} />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[160px] justify-between font-normal items-center"
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Filter className="h-4 w-4 opacity-50" />
                      {activeArchFilters.length === 0 && !activeMaintenanceFilter
                        ? 'Filter'
                        : `${activeArchFilters.length + (activeMaintenanceFilter ? 1 : 0)} filter${
                            activeArchFilters.length + (activeMaintenanceFilter ? 1 : 0) > 1
                              ? 's'
                              : ''
                          } selected`}
                    </div>
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
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">Checking packages...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <PackageResults
            data={results}
            activeArchFilters={activeArchFilters}
            showUnmaintained={activeMaintenanceFilter}
          />
        )}
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
