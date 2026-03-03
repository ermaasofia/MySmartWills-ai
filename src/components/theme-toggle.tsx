'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function ThemeToggle({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isHero = variant === 'hero';
  const btnClass = isHero
    ? "h-9 w-9 border border-white/30 hover:bg-white/10 bg-transparent"
    : "h-9 w-9 border border-neutral-400 dark:border-neutral-500 hover:bg-accent";
  const iconClass = "h-[1.1rem] w-[1.1rem]";
  const heroIconColor = "text-white";

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={btnClass}>
        <Sun className={`${iconClass} ${isHero ? heroIconColor : "text-black dark:text-white"}`} />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={btnClass}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className={`${iconClass} ${isHero ? heroIconColor : "text-white"}`} />
      ) : (
        <Moon className={`${iconClass} ${isHero ? heroIconColor : "text-black"}`} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
