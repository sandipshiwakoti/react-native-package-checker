import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

interface EmptyListFallbackProps {
  message: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export const EmptyListFallback = ({ message, Icon }: EmptyListFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="sm:text-lg font-medium mb-2">No packages found</h3>
      {message ? <p className="text-sm text-muted-foreground text-center">{message}</p> : null}
    </div>
  );
};
