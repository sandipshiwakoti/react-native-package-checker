import Image from 'next/image';

import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'vertical' | 'horizontal';
  size?: 'small' | 'large';
}

export function Logo({ variant = 'horizontal', size = 'small' }: LogoProps) {
  const logoSize =
    size === 'large'
      ? 'w-[100px] h-[100px] sm:w-[140px] sm:h-[140px]'
      : 'w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]';
  const textSize = size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={cn('flex items-center gap-1.5', variant === 'vertical' ? 'flex-col' : '')}>
      <div className={cn('relative', logoSize)}>
        <Image
          src="/logo.svg"
          alt="React Native Package Checker Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div>
        <span
          className={cn(
            'font-display font-extrabold tracking-tight leading-3 whitespace-nowrap',
            textSize,
            variant === 'vertical' ? 'inline-block' : 'block translate-y-0.5'
          )}
        >
          React Native
        </span>
        <span
          className={cn(
            'font-display font-extrabold tracking-tight leading-none whitespace-nowrap',
            textSize,
            variant === 'vertical' ? 'ml-2' : 'block -translate-y-0.5'
          )}
        >
          Package Checker
        </span>
      </div>
    </div>
  );
}
