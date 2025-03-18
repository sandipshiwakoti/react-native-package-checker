import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SortToggleButtonProps {
  sortOrder: 'asc' | 'desc';
  sortBy: 'name' | 'stars' | 'updated';
  onChange: (order: 'asc' | 'desc') => void;
  className?: string;
}

export const SortToggleButton = ({
  sortOrder,
  sortBy,
  onChange,
  className,
}: SortToggleButtonProps) => {
  const getSortLabel = () => {
    switch (sortBy) {
      case 'stars':
        return 'GitHub stars';
      case 'updated':
        return 'last updated';
      default:
        return 'name';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={className}
          >
            {sortOrder === 'asc' ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Sort by {getSortLabel()} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
