import Image from 'next/image';
import Link from 'next/link';

interface SmartWillsBrandProps {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
}

export function SmartWillsBrand({
  size = 'md',
  centered = false,
  className = '',
}: SmartWillsBrandProps) {
  const sizes = {
    sm: {
      icon: 'h-[40px] w-[40px]',
      text: 'text-[19px]',
      gap: 'gap-2.5',
    },

    md: {
      icon: 'h-[48px] w-[48px]',
      text: 'text-[26px]',
      gap: 'gap-3',
    },

    lg: {
      icon: 'h-[56px] w-[56px]',
      text: 'text-[30px]',
      gap: 'gap-3.5',
    },
  };

  const currentSize = sizes[size];

  return (
    <Link
      href="/"
      aria-label="SmartWills.Ai Home"
      className={`
        group
        flex
        items-center
        ${currentSize.gap}
        ${centered ? 'justify-center' : ''}
        no-underline
        ${className}
      `}
    >
      <Image
        src="/icon.png"
        alt="SmartWills logo"
        width={64}
        height={64}
        priority
        className={`
          ${currentSize.icon}
          shrink-0
          object-contain
          transition-transform
          duration-300
          group-hover:scale-[1.03]
        `}
      />

      <span
        className={`
          ${currentSize.text}
          whitespace-nowrap
          font-serif
          font-semibold
          tracking-[-0.04em]
          text-[#171717]
        `}
      >
        SmartWills.Ai
      </span>
    </Link>
  );
}