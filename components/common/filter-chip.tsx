import { LucideIcon, X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  icon: LucideIcon;
  variant: 'green' | 'red' | 'yellow' | 'amber';
  onRemove: () => void;
}

export function FilterChip({ label, icon: Icon, variant, onRemove }: FilterChipProps) {
  const iconColors = {
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    amber: 'text-amber-500',
  };

  return (
    <div className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1">
      <Icon className={`h-3 w-3 ${iconColors[variant]}`} />
      {label}
      <X className="h-3 w-3 cursor-pointer hover:text-gray-900" onClick={onRemove} />
    </div>
  );
}
