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
      <Button variant="outline" size="icon" className="h-9 w-9 border-foreground/20 hover:bg-accent hover:border-foreground/40">
        <Sun className="h-4 w-4 text-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 border-foreground/20 hover:bg-accent hover:border-foreground/40"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
