'use client';

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { useRouter } from 'next/navigation';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatContextPanel } from '@/components/chat/chat-context-panel';
import { SavyCountrySelector } from '@/components/chat/savy-country-selector';

import {
  useChatSessions,
  SessionSummary,
} from '@/hooks/use-chat-sessions';

import {
  SAVY_COUNTRIES,
  type SavyCountry,
} from '@/lib/constants';

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

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const [
    activeSessionId,
    setActiveSessionId,
  ] = useState<string | null>(
    initialSessionId ?? null
  );

  const [
    selectedSavy,
    setSelectedSavy,
  ] = useState<SavyCountry | null>(
    null
  );

  const [, setSessionTitle] =
    useState('New Chat');

  const [
    planRefreshKey,
    setPlanRefreshKey,
  ] = useState(0);

  const {
    sessions,
    addSession,
    updateSessionTitle,
    removeSession,
  } = useChatSessions();

  /* ======================================================
     LOCK PAGE SCROLL
  ====================================================== */

  useEffect(() => {
    document.documentElement.classList.add(
      'overflow-locked'
    );

    document.body.classList.add(
      'overflow-locked'
    );

    return () => {
      document.documentElement.classList.remove(
        'overflow-locked'
      );

      document.body.classList.remove(
        'overflow-locked'
      );
    };
  }, []);

  /* ======================================================
     SYNC ACTIVE SESSION WITH URL
  ====================================================== */

  useEffect(() => {
    if (
      initialSessionId &&
      initialSessionId !== activeSessionId
    ) {
      setActiveSessionId(
        initialSessionId
      );
    }
  }, [
    initialSessionId,
    activeSessionId,
  ]);

  /* ======================================================
     NEW CHAT
  ====================================================== */

  const handleNewChat =
    useCallback(() => {
      setActiveSessionId(null);
      setSelectedSavy(null);
      setSessionTitle('New Chat');

      router.replace('/chat', {
        scroll: false,
      });
    }, [router]);

  /* ======================================================
     SELECT SESSION
  ====================================================== */

  const handleSelectSession =
    useCallback(
      (id: string) => {
        setActiveSessionId(id);

        const session =
          sessions.find(
            (s) => s.id === id
          );

        if (session) {
          const match =
            SAVY_COUNTRIES.find(
              (c) =>
                c.code ===
                session.country_code
            );

          if (match) {
            setSelectedSavy(match);
          }

          setSessionTitle(
            session.title
          );
        }

        router.replace(
          `/chat?session=${id}`,
          {
            scroll: false,
          }
        );
      },
      [router, sessions]
    );

  /* ======================================================
     DELETE SESSION
  ====================================================== */

  const handleDeleteSession =
    useCallback(
      async (id: string) => {
        await removeSession(id);

        if (
          id === activeSessionId
        ) {
          setActiveSessionId(null);
          setSelectedSavy(null);
          setSessionTitle(
            'New Chat'
          );

          router.replace('/chat', {
            scroll: false,
          });
        }
      },
      [
        activeSessionId,
        removeSession,
        router,
      ]
    );

  /* ======================================================
     SESSION CREATED
  ====================================================== */

  const handleSessionCreated =
    useCallback(
      (
        session: SessionSummary
      ) => {
        setActiveSessionId(
          session.id
        );

        setSessionTitle(
          session.title
        );

        addSession(session);
      },
      [addSession]
    );

  /* ======================================================
     TITLE CHANGE
  ====================================================== */

  const handleTitleChange =
    useCallback(
      (
        id: string,
        title: string
      ) => {
        setSessionTitle(title);

        updateSessionTitle(
          id,
          title
        );
      },
      [updateSessionTitle]
    );

  /* ======================================================
     COUNTRY SELECT
  ====================================================== */

  const handleCountrySelect =
    useCallback(
      (
        country: SavyCountry
      ) => {
        setSelectedSavy(country);
      },
      []
    );

  /* ======================================================
     SWITCH SAVY
  ====================================================== */

  const handleSwitchSavy =
    useCallback(
      (code: string) => {
        const target =
          SAVY_COUNTRIES.find(
            (c) =>
              c.code === code &&
              c.isActive
          );

        if (target) {
          setActiveSessionId(null);
          setSelectedSavy(target);
          setSessionTitle(
            'New Chat'
          );

          router.replace(
            '/chat',
            {
              scroll: false,
            }
          );
        }
      },
      [router]
    );

  /* ======================================================
     ASSISTANT COMPLETE
  ====================================================== */

  const handleAssistantComplete =
    useCallback(() => {
      setPlanRefreshKey(
        (key) => key + 1
      );
    }, []);

  /* ======================================================
     ACTIVE SESSION
  ====================================================== */

  const activeSession =
    useMemo(
      () =>
        sessions.find(
          (s) =>
            s.id ===
            activeSessionId
        ) ?? null,
      [
        activeSessionId,
        sessions,
      ]
    );

  /* ======================================================
     RESOLVE SAVY
  ====================================================== */

  const resolvedSelectedSavy =
    useMemo(() => {
      if (selectedSavy) {
        return selectedSavy;
      }

      if (!activeSession) {
        return null;
      }

      return (
        SAVY_COUNTRIES.find(
          (c) =>
            c.code ===
            activeSession.country_code
        ) ?? null
      );
    }, [
      activeSession,
      selectedSavy,
    ]);

  const showSelector =
    !activeSessionId &&
    !resolvedSelectedSavy;

  const filteredSessions =
    resolvedSelectedSavy
      ? sessions.filter(
          (s) =>
            s.country_code ===
            resolvedSelectedSavy.code
        )
      : sessions;

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div
      className="
        flex
        h-dvh
        overflow-hidden
        bg-white
        text-[#171717]
      "
    >
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <ChatSidebar
        userName={userName}
        userEmail={userEmail}
        currentSessionId={
          activeSessionId
        }
        sessions={
          filteredSessions
        }
        isSidebarOpen={
          isSidebarOpen
        }
        onClose={() =>
          setIsSidebarOpen(
            false
          )
        }
        onNewChat={
          handleNewChat
        }
        onSelectSession={
          handleSelectSession
        }
        onDeleteSession={
          handleDeleteSession
        }
        activeSavy={
          resolvedSelectedSavy
        }
        onSelectSavy={
          handleSwitchSavy
        }
      />

      {/* ==================================================
          MAIN WORKSPACE
      ================================================== */}

      <main
        className="
          relative
          flex
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-white
          lg:border-l
          lg:border-[#eeeeee]
        "
      >
        {/* Subtle background decoration */}
        {showSelector && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                left-1/2
                top-[-220px]
                h-[520px]
                w-[820px]
                -translate-x-1/2
                rounded-full
                bg-[#ef1111]/[0.025]
                blur-[130px]
              "
            />

            <div
              className="
                absolute
                bottom-[-220px]
                right-[-180px]
                h-[420px]
                w-[420px]
                rounded-full
                bg-[#ef1111]/[0.015]
                blur-[120px]
              "
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {showSelector ? (
            /* =============================================
               COUNTRY SELECTOR
            ============================================= */

            <motion.div
              key="selector"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                relative
                z-10
                flex
                min-h-0
                flex-1
                flex-col
              "
            >
              <SavyCountrySelector
                onSelect={
                  handleCountrySelect
                }
              />
            </motion.div>
          ) : (
            /* =============================================
               CHAT
            ============================================= */

            <motion.div
              key="chat"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="
                relative
                z-10
                flex
                min-h-0
                flex-1
                flex-col
                bg-white
              "
            >
              <ChatInterface
                /*
                  Key on Savy only.

                  Do NOT use activeSessionId here because
                  it would remount this component when a
                  session is created and could interrupt
                  the assistant stream.
                */
                key={
                  resolvedSelectedSavy
                    ?.code ??
                  'none'
                }
                userId={userId}
                initialSessionId={
                  activeSessionId ??
                  undefined
                }
                selectedSavy={
                  resolvedSelectedSavy ??
                  undefined
                }
                onSessionCreated={
                  handleSessionCreated
                }
                onTitleChange={
                  handleTitleChange
                }
                onOpenSidebar={() =>
                  setIsSidebarOpen(
                    true
                  )
                }
                isAdmin={
                  isAdmin
                }
                onSwitchSavy={
                  handleSwitchSavy
                }
                onAssistantComplete={
                  handleAssistantComplete
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ==================================================
          RIGHT CONTEXT PANEL
      ================================================== */}

      {!showSelector &&
        resolvedSelectedSavy && (
          <ChatContextPanel
            activeSavy={
              resolvedSelectedSavy
            }
            refreshKey={
              planRefreshKey
            }
            sessionId={
              activeSessionId ??
              undefined
            }
          />
        )}
    </div>
  );
}