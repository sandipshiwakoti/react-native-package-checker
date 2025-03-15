import { LucideIcon, X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  icon: LucideIcon;
  variant: 'green' | 'red' | 'yellow' | 'amber';
  onRemove: () => void;
}

export function FilterChip({ label, icon: Icon, variant, onRemove }: FilterChipProps) {
  const chipStyles = {
    green: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    red: 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    amber: 'bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const iconColors = {
    green: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-amber-600 dark:text-amber-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div
      className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1 ${chipStyles[variant]}`}
    >
      <Icon className={`h-3 w-3 ${iconColors[variant]}`} />
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
