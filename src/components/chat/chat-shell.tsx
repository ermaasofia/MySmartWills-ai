'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatContextPanel } from '@/components/chat/chat-context-panel';
import { SavyCountrySelector } from '@/components/chat/savy-country-selector';
import { useChatSessions, SessionSummary } from '@/hooks/use-chat-sessions';
import { SAVY_COUNTRIES, type SavyCountry } from '@/lib/constants';

interface ChatShellProps {
  userId: string;
  userName: string;
  userEmail: string;
  initialSessionId?: string;
  isAdmin?: boolean;
}

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
  const [selectedSavy, setSelectedSavy] = useState<SavyCountry | null>(null);
  const [sessionTitle, setSessionTitle] = useState('New Chat');
  const [planRefreshKey, setPlanRefreshKey] = useState(0);

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

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setSelectedSavy(null);
    setSessionTitle('New Chat');
    router.replace('/chat', { scroll: false });
  }, [router]);

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      const session = sessions.find((s) => s.id === id);
      if (session) {
        const match = SAVY_COUNTRIES.find((c) => c.code === session.country_code);
        if (match) setSelectedSavy(match);
        setSessionTitle(session.title);
      }
      router.replace(`/chat?session=${id}`, { scroll: false });
    },
    [router, sessions],
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      await removeSession(id);
      if (id === activeSessionId) {
        setActiveSessionId(null);
        setSelectedSavy(null);
        setSessionTitle('New Chat');
        router.replace('/chat', { scroll: false });
      }
    },
    [activeSessionId, removeSession, router],
  );

  const handleSessionCreated = useCallback(
    (session: SessionSummary) => {
      setActiveSessionId(session.id);
      setSessionTitle(session.title);
      addSession(session);
    },
    [addSession],
  );

  const handleTitleChange = useCallback(
    (id: string, title: string) => {
      setSessionTitle(title);
      updateSessionTitle(id, title);
    },
    [updateSessionTitle],
  );

  const handleCountrySelect = useCallback((country: SavyCountry) => {
    setSelectedSavy(country);
  }, []);

  const handleSwitchSavy = useCallback(
    (code: string) => {
      const target = SAVY_COUNTRIES.find((c) => c.code === code && c.isActive);
      if (target) {
        setActiveSessionId(null);
        setSelectedSavy(target);
        setSessionTitle('New Chat');
        router.replace('/chat', { scroll: false });
      }
    },
    [router],
  );

  const handleAssistantComplete = useCallback(() => {
    setPlanRefreshKey((k) => k + 1);
  }, []);

  const showSelector = !activeSessionId && !selectedSavy;

  const filteredSessions = selectedSavy
    ? sessions.filter((s) => s.country_code === selectedSavy.code)
    : sessions;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        userName={userName}
        userEmail={userEmail}
        currentSessionId={activeSessionId}
        sessions={filteredSessions}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        activeSavy={selectedSavy}
        onSelectSavy={handleSwitchSavy}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {showSelector ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <SavyCountrySelector onSelect={handleCountrySelect} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ChatInterface
                key={selectedSavy?.code ?? 'none'}
                userId={userId}
                initialSessionId={activeSessionId ?? undefined}
                selectedSavy={selectedSavy ?? undefined}
                onSessionCreated={handleSessionCreated}
                onTitleChange={handleTitleChange}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                isAdmin={isAdmin}
                onSwitchSavy={handleSwitchSavy}
                onAssistantComplete={handleAssistantComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!showSelector && selectedSavy && (
        <ChatContextPanel
          activeSavy={selectedSavy}
          refreshKey={planRefreshKey}
          sessionTitle={sessionTitle}
        />
      )}
    </div>
  );
}
