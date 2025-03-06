import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  className,
  containerClassName,
}: SearchBarProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-[250px] min-w-[120px] pl-9 pr-3 rounded-md border bg-background text-sm h-10',
          className
        )}
      />
    </div>
  );
}
