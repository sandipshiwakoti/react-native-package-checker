import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { NewArchFilter } from '@/types';

interface FilterContextType {
  activeFilter: string | null;
  setActiveFilter: (_filter: string | null) => void;
  activeTab: string;
  setActiveTab: (_tab: string) => void;
  activeArchFilters: NewArchFilter[];
  setActiveArchFilters: (_filters: NewArchFilter[]) => void;
  activeMaintenanceFilter: boolean;
  setActiveMaintenanceFilter: (_value: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeArchFilters, setActiveArchFilters] = useState<NewArchFilter[]>([]);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');

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
  }, [activeFilter]);

  useEffect(() => {
    if (activeArchFilters.length > 0 || activeMaintenanceFilter) {
      setActiveFilter(null);
    }
  }, [activeArchFilters, activeMaintenanceFilter]);

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
