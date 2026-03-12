'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useChatSessions, SessionSummary } from '@/hooks/use-chat-sessions';

interface ChatShellProps {
  userId: string;
  userName: string;
  userEmail: string;
  initialSessionId?: string;
  isAdmin?: boolean;
}

/**
 * Top-level client shell that:
 *  - owns the mobile sidebar open/close state
 *  - owns the session list (via useChatSessions)
 *  - connects sidebar ↔ chat interface via callbacks
 *
 * Rendered as a full-viewport two-column layout (sidebar + chat area).
 */
export function ChatShell({
  userId,
  userName,
  userEmail,
  initialSessionId,
  isAdmin = false,
}: ChatShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );

  const { sessions, addSession, updateSessionTitle, removeSession } =
    useChatSessions();

  useEffect(() => {
    document.documentElement.classList.add('overflow-locked');
    document.body.classList.add('overflow-locked');
    return () => {
      document.documentElement.classList.remove('overflow-locked');
      document.body.classList.remove('overflow-locked');
    };
  }, []);

  // ── Sidebar callbacks ──────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    router.replace('/chat', { scroll: false });
  }, [router]);

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      router.replace(`/chat?session=${id}`, { scroll: false });
    },
    [router],
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      await removeSession(id);
      // If deleting the active session, reset to new chat
      if (id === activeSessionId) {
        setActiveSessionId(null);
        router.replace('/chat', { scroll: false });
      }
    },
    [activeSessionId, removeSession, router],
  );

  // ── Interface callbacks ────────────────────────────────────────────────────
  const handleSessionCreated = useCallback(
    (session: SessionSummary) => {
      setActiveSessionId(session.id);
      addSession(session);
    },
    [addSession],
  );

  const handleTitleChange = useCallback(
    (id: string, title: string) => {
      updateSessionTitle(id, title);
    },
    [updateSessionTitle],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Left sidebar ──────────────────────────────────────────────── */}
      <ChatSidebar
        userName={userName}
        userEmail={userEmail}
        currentSessionId={activeSessionId}
        sessions={sessions}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* ── Main chat area ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatInterface
          userId={userId}
          initialSessionId={activeSessionId ?? undefined}
          onSessionCreated={handleSessionCreated}
          onTitleChange={handleTitleChange}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
