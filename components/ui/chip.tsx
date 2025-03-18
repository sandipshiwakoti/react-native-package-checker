import { LucideIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  variant: 'green' | 'red' | 'yellow' | 'amber' | 'blue' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  href?: string;
}

const variantStyles = {
  green: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  red: 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  amber: 'bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  blue: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100/70 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  slate: 'bg-slate-100/70 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-xs px-3 py-1.5',
};

export function Chip({ label, icon: Icon, variant, size = 'sm', onRemove, href }: ChipProps) {
  const content = (
    <>
      {Icon && <Icon className={cn('shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
        </button>
      )}
    </>
  );

  const className = cn(
    'flex items-center gap-1.5 rounded-lg font-normal transition-colors',
    variantStyles[variant],
    sizeStyles[size],
    href && 'hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
