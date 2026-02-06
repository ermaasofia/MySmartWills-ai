'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 border border-neutral-400 dark:border-neutral-500 hover:bg-accent">
        <Sun className="h-[1.1rem] w-[1.1rem] text-black dark:text-white" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 border border-neutral-400 dark:border-neutral-500 hover:bg-accent"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.1rem] w-[1.1rem] text-white" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] text-black" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
