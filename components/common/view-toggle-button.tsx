import { LayoutGrid, LayoutList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewToggleButtonProps {
  viewMode: 'list' | 'grid';
  onChange: (mode: 'list' | 'grid') => void;
  className?: string;
}

export const ViewToggleButton = ({ viewMode, onChange, className }: ViewToggleButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onChange(viewMode === 'list' ? 'grid' : 'list')}
            className={className}
          >
            {viewMode === 'list' ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <LayoutList className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-35">
          Toggle {viewMode === 'list' ? 'grid' : 'list'} view
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
