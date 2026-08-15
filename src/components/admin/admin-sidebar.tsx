'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  LogOut,
  X,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ai-instructions', label: 'AI Instructions', icon: Bot },
];

interface AdminSidebarProps {
  userEmail: string;
  isSidebarOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ userEmail, isSidebarOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-between px-3 py-3 shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="AI SmartWills"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm">SmartWills</span>
            <span className="text-[10px] font-medium bg-primary/15 text-primary rounded-full px-2 py-0.5">
              Admin
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded hover:bg-sidebar-accent text-muted-foreground"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent',
                active && 'bg-sidebar-accent text-foreground',
                !active && 'text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-2 pt-2 pb-3 space-y-0.5">
        <Link
          href="/chat"
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm
            hover:bg-sidebar-accent transition-colors text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Chat
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
            hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
            {(userEmail[0] ?? '?').toUpperCase()}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-medium truncate">{userEmail}</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
          <LogOut className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
  );

  return (
    <>
      <aside className="hidden md:flex shrink-0">{sidebarContent}</aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
