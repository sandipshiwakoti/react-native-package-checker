import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type SortByValue = 'name' | 'stars' | 'updated';

interface SortControlProps {
  sortBy: SortByValue;
  sortOrder: 'asc' | 'desc';
  onSortByChange: (value: SortByValue) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  className?: string;
}

export const SortControl = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  className,
}: SortControlProps) => {
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
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[120px] sm:w-[160px]">
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
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
            Sort by {getSortLabel()} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
