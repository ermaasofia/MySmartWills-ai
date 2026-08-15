'use client';

import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  return (
    <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      <button
        onClick={onOpenSidebar}
        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold">Admin Panel</span>
    </header>
  );
}
