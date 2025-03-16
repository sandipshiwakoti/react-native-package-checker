import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Archive, CheckCircle, ChevronDown, Filter, X, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFilter } from '@/contexts/filter-context';
import { NewArchFilter } from '@/types';

export function FilterButton() {
  const {
    setActiveFilter,
    activeArchFilters,
    setActiveArchFilters,
    activeMaintenanceFilter,
    setActiveMaintenanceFilter,
  } = useFilter();

  const [open, setOpen] = useState(false);
  const [tempArchFilters, setTempArchFilters] = useState<NewArchFilter[]>([]);
  const [tempMaintenanceFilter, setTempMaintenanceFilter] = useState(false);

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

  const totalActiveFilters = activeArchFilters.length + (activeMaintenanceFilter ? 1 : 0);

  const clearFilters = () => {
    setActiveFilter(null);
    setActiveArchFilters([]);
    setActiveMaintenanceFilter(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[120px] sm:min-w-[160px] justify-between font-normal items-center relative"
        >
          <div className="flex flex-row gap-2 items-center">
            <Filter className="h-4 w-4" />
            {totalActiveFilters === 0
              ? 'Filter'
              : `${totalActiveFilters} filter${totalActiveFilters > 1 ? 's' : ''} selected`}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Filters</span>
            <X
              className="h-4 w-4 cursor-pointer hover:text-gray-600"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">New Architecture Support</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="supported"
                  checked={tempArchFilters.includes('supported')}
                  onCheckedChange={checked => handleArchFilterChange(!!checked, 'supported')}
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
                  onCheckedChange={checked => handleArchFilterChange(!!checked, 'unsupported')}
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
                  onCheckedChange={checked => handleArchFilterChange(!!checked, 'untested')}
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

          <div className="flex flex-col gap-2 pt-2 border-t">
            <div className="text-sm text-muted-foreground">Maintenance Status</div>
            <div className="flex flex-col gap-2">
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
                clearFilters();
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
                setActiveFilter(null);
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
  );
}
