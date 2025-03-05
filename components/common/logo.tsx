import Image from 'next/image';

interface LogoProps {
  variant?: 'vertical' | 'horizontal';
  size?: 'small' | 'large';
}

export function Logo({ variant = 'horizontal', size = 'small' }: LogoProps) {
  const logoSize = size === 'large' ? 'w-[140px] h-[140px]' : 'w-[80px] h-[80px]';
  const textSize = size === 'large' ? 'text-3xl' : 'text-2xl';

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : ''} items-center gap-1.5`}>
      <div className={`relative ${logoSize}`}>
        <Image
          src="/logo.svg"
          alt="React Native Package Checker Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div
        className={`flex ${variant === 'horizontal' ? 'flex-col' : 'flex-row items-end gap-2'} -space-y-1`}
      >
        <span className={`font-display ${textSize} font-extrabold tracking-tight text-slate-800`}>
          React Native
        </span>
        <span className={`font-display ${textSize} font-extrabold tracking-tight text-slate-800`}>
          Package Checker
        </span>
      </div>
    </div>
  );
}
