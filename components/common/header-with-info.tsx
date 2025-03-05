import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const variants = {
  default: {
    container: 'flex items-center gap-2',
    title: 'text-xl font-semibold',
    icon: 'h-5 w-5',
  },
  small: {
    container: 'flex items-center gap-1.5',
    title: 'text-md font-semibold',
    icon: 'h-4 w-4',
  },
} as const;

interface HeadingWithInfoProps {
  title: string;
  tooltip: string;
  icon?: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
}

export function HeadingWithInfo({
  title,
  tooltip,
  icon,
  variant = 'default',
  className,
  titleClassName,
  iconClassName,
}: HeadingWithInfoProps) {
  const styles = variants[variant];

  return (
    <div className={className || styles.container}>
      <h2 className={titleClassName || styles.title}>{title}</h2>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className={iconClassName}>
            {icon || (
              <AlertCircle
                className={`${styles.icon} text-muted-foreground/50 hover:text-muted-foreground`}
              />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-popover-foreground text-xs">{tooltip}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
