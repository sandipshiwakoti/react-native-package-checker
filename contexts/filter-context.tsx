import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';

import { NewArchFilter } from '@/types';

interface FilterContextType {
  activeFilter: string | null;
  setActiveFilter: (_filter: string | null) => void;
  activeTab: string;
  setActiveTab: (_tab: 'directory' | 'unlisted') => void;
  activeArchFilters: NewArchFilter[];
  setActiveArchFilters: (_filters: NewArchFilter[]) => void;
  activeMaintenanceFilter: boolean;
  setActiveMaintenanceFilter: (_value: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeArchFilters, setActiveArchFilters] = useQueryState<NewArchFilter[] | null>('arch', {
    defaultValue: [],
    parse: (value): NewArchFilter[] | null => {
      const filters = value ? value.split(',') : [];
      return filters.filter((f): f is NewArchFilter =>
        ['supported', 'unsupported', 'untested'].includes(f)
      );
    },
    serialize: (value): string => (value?.length ? value.join(',') : (null as unknown as string)),
  });
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useQueryState<boolean>(
    'maintenance',
    {
      defaultValue: false,
      parse: (value): boolean => value === 'true',
    }
  );
  const [activeTab, setActiveTab] = useQueryState<'directory' | 'unlisted'>('tab', {
    defaultValue: 'directory',
    parse: value => (value as 'directory' | 'unlisted') || 'directory',
  });

  useEffect(() => {
    if (activeFilter) {
      if (
        activeFilter === 'supported' ||
        activeFilter === 'unsupported' ||
        activeFilter === 'untested'
      ) {
        setActiveArchFilters([activeFilter]);
        setActiveMaintenanceFilter(false);
      } else if (activeFilter === 'unmaintained') {
        setActiveArchFilters([]);
        setActiveMaintenanceFilter(true);
      }
    }
  }, [activeFilter, setActiveArchFilters, setActiveMaintenanceFilter]);

  useEffect(() => {
    if (activeArchFilters.length > 0 || activeMaintenanceFilter) {
      setActiveFilter(null);
    }
  }, [activeArchFilters, activeMaintenanceFilter, setActiveFilter]);

  return (
    <FilterContext.Provider
      value={{
        activeFilter,
        setActiveFilter,
        activeArchFilters,
        setActiveArchFilters,
        activeMaintenanceFilter,
        setActiveMaintenanceFilter,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
