'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  MessageSquare,
  LogOut,
  X,
  Sparkles,
  Settings,
  Crown,
  ChevronUp,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionSummary } from '@/hooks/use-chat-sessions';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  /** Authenticated user metadata */
  userName: string;
  userEmail: string;
  /** Currently active session (for highlight) */
  currentSessionId: string | null;
  /** Session list from useChatSessions hook */
  sessions: SessionSummary[];
  isSidebarOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

/** Group sessions by relative date label */
function groupSessionsByDate(sessions: SessionSummary[]): { label: string; items: SessionSummary[] }[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
  const last7Start = new Date(todayStart.getTime() - 6 * 86_400_000);
  const last30Start = new Date(todayStart.getTime() - 29 * 86_400_000);

  const buckets: Record<string, SessionSummary[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    Older: [],
  };

  for (const s of sessions) {
    const d = new Date(s.updated_at);
    if (d >= todayStart) buckets['Today'].push(s);
    else if (d >= yesterdayStart) buckets['Yesterday'].push(s);
    else if (d >= last7Start) buckets['Previous 7 Days'].push(s);
    else if (d >= last30Start) buckets['Previous 30 Days'].push(s);
    else buckets['Older'].push(s);
  }

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

/**
 * Reusable sidebar component — mirrors ChatGPT's left panel.
 * Controlled: parent manages open/close state for mobile responsiveness.
 */
export function ChatSidebar({
  userName,
  userEmail,
  currentSessionId,
  sessions,
  isSidebarOpen,
  onClose,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const grouped = groupSessionsByDate(sessions);

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border">
      {/* ── Top: logo + close (mobile) ─────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-3 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="AI SmartWills"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="text-sm">AI SmartWills</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded hover:bg-sidebar-accent text-muted-foreground"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── New Chat button ─────────────────────────────────────── */}
      <div className="px-2 mb-1 shrink-0">
        <button
          onClick={() => { onNewChat(); onClose(); }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
            hover:bg-sidebar-accent transition-colors group"
        >
          <Plus className="h-4 w-4 shrink-0" />
          New Chat
        </button>
      </div>

      {/* ── Session list ────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 space-y-4 py-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          grouped.map(({ label, items }) => (
            <div key={label}>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {label}
              </p>
              <ul className="space-y-0.5">
                {items.map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={session.id === currentSessionId}
                    onSelect={() => { onSelectSession(session.id); onClose(); }}
                    onDelete={() => onDeleteSession(session.id)}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* ── Bottom: upgrade + user info ─────────────────────────── */}
      <div className="shrink-0 border-t border-sidebar-border px-2 pt-2 pb-3 space-y-0.5">
        {/* Upgrade Plan */}
        <button
          disabled
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm
            hover:bg-sidebar-accent transition-colors opacity-60 cursor-not-allowed"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-yellow-500" />
          Upgrade Plan
          <span className="ml-auto text-[10px] bg-muted rounded-full px-1.5 py-0.5">Soon</span>
        </button>

        {/* Theme */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="text-sm text-muted-foreground flex-1">Theme</span>
          <ThemeToggle />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                hover:bg-muted transition-colors group"
            >
              <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                {(userName[0] ?? userEmail[0] ?? '?').toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-medium truncate">{userName || 'User'}</p>
              </div>
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/upgrade')}>
              <Crown className="h-4 w-4 mr-2 text-amber-500" />
              Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: always visible ───────────────────────────────── */}
      <aside className="hidden md:flex shrink-0">{sidebarContent}</aside>

      {/* ── Mobile: slide-over with backdrop ─────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
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

// ─── Reusable session list item ─────────────────────────────────────────────

interface SessionItemProps {
  session: SessionSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
        className={cn(
          'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left cursor-pointer',
          'hover:bg-sidebar-accent transition-colors group',
          isActive && 'bg-sidebar-accent font-medium',
        )}
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="flex-1 truncate text-xs">{session.title}</span>
        <button
          type="button"
          aria-label="Delete conversation"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            'shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-destructive/15 hover:text-destructive text-muted-foreground',
          )}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </li>
  );
}
