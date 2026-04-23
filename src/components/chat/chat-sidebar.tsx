'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MessageSquare, LogOut, X, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionSummary } from '@/hooks/use-chat-sessions';
import { SAVY_COUNTRIES, type SavyCountry } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  userName: string;
  userEmail: string;
  currentSessionId: string | null;
  sessions: SessionSummary[];
  isSidebarOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  /** Currently active Savy (highlighted in the jurisdiction grid). null when on selector screen. */
  activeSavy: SavyCountry | null;
  /** Switch to a different Savy from inside the chat */
  onSelectSavy: (code: string) => void;
}

function groupSessionsByDate(
  sessions: SessionSummary[],
): { label: string; items: SessionSummary[] }[] {
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

function SwLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 px-1 transition-opacity hover:opacity-80"
    >
      <Image
        src="/logo.png"
        alt="SmartWills"
        width={28}
        height={28}
        className="rounded-[4px]"
      />
      <span className="text-sm font-medium text-[#ededed]">SmartWills</span>
    </Link>
  );
}

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
  activeSavy,
  onSelectSavy,
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
    <div className="flex h-full w-[260px] flex-col border-r border-[var(--border)] bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 pt-4 pb-3 shrink-0">
        <SwLogo />
        <button
          onClick={onClose}
          className="md:hidden rounded p-1.5 text-white/55 transition-colors hover:bg-white/[0.06]"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* New conversation */}
      <div className="px-3 pb-4 shrink-0">
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="flex w-full items-center rounded-[8px] bg-[#ededed] px-3 py-2.5 text-sm font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New conversation
          </span>
        </button>
      </div>

      {/* Jurisdiction grid */}
      <div className="px-3 pb-4 shrink-0">
        <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[1.5px] text-white/45">
          Jurisdiction
        </div>
        <div className="grid grid-cols-4 gap-1 rounded-[10px] border border-[var(--border)] p-1">
          {SAVY_COUNTRIES.map((c) => {
            const isActive = activeSavy?.code === c.code;
            const isAvailable = c.isActive;
            return (
              <button
                key={c.code}
                onClick={() => isAvailable && onSelectSavy(c.code)}
                disabled={!isAvailable}
                title={`${c.savyName} — ${c.name}`}
                aria-label={c.savyName}
                className={cn(
                  'flex h-8 items-center justify-center rounded-[6px] text-base transition-all',
                  isActive
                    ? 'bg-white/[0.12]'
                    : isAvailable
                      ? 'opacity-70 grayscale-[40%] hover:bg-white/[0.05] hover:grayscale-0 hover:opacity-100'
                      : 'cursor-not-allowed opacity-30 grayscale',
                )}
              >
                {c.flag}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-1.5 px-1 font-mono text-[11px] text-white/55">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}
          />
          Active: {activeSavy ? activeSavy.savyName : 'Pick a Savy'}
        </div>
      </div>

      {/* Conversations */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 pb-2"
      >
        <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[1.5px] text-white/45">
          Conversations
        </div>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <MessageSquare className="h-7 w-7 text-white/15" />
            <p className="text-xs text-white/40">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(({ label, items }) => (
              <div key={label}>
                <p className="px-1 py-1 font-mono text-[10px] uppercase tracking-[1px] text-white/35">
                  {label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onSelect={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                      onDelete={() => onDeleteSession(session.id)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="shrink-0 border-t border-[var(--border)] px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-[8px] px-2 py-2 text-left transition-colors hover:bg-white/[0.05]">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#0a0a0a]"
                style={{ background: 'var(--accent)' }}
              >
                {(userName[0] ?? userEmail[0] ?? '?').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#ededed]">
                  {userName || 'User'}
                </p>
                <p className="text-[11px] text-white/45">Free plan</p>
              </div>
              <Settings className="h-3.5 w-3.5 shrink-0 text-white/45" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          'group flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-2 py-2 text-left transition-colors',
          isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]',
        )}
      >
        <span
          className={cn(
            'flex-1 truncate text-[13px]',
            isActive ? 'font-medium text-[#ededed]' : 'text-white/75',
          )}
        >
          {session.title}
        </span>
        <button
          type="button"
          aria-label="Delete conversation"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 rounded p-1 text-white/30 opacity-0 transition-opacity hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </li>
  );
}
