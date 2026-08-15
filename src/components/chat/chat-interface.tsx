'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Lock,
  Menu,
  MoreHorizontal,
  Settings,
} from 'lucide-react';

import { EditableTitle } from '@/components/chat/editable-title';
import { MarkdownRenderer } from '@/components/chat/markdown-renderer';
import { SavyRedirectCTA } from '@/components/chat/savy-redirect-cta';

import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { CountryFlag } from '@/components/ui/country-flag';

import {
  SAVY_COUNTRIES,
  type SavyCountry,
} from '@/lib/constants';

import { getSuggestionsForCountry } from '@/lib/suggestions';

import type { SessionSummary } from '@/hooks/use-chat-sessions';

/* =========================================================
   TYPES
========================================================= */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  userId: string;

  initialSessionId?: string;

  selectedSavy?: SavyCountry;

  onSessionCreated?: (
    session: SessionSummary
  ) => void;

  onTitleChange?: (
    id: string,
    title: string
  ) => void;

  onOpenSidebar?: () => void;

  isAdmin?: boolean;

  onSwitchSavy?: (
    code: string
  ) => void;

  onAssistantComplete?: () => void;
}

/* =========================================================
   FETCH WITH RETRY
========================================================= */

async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 2
): Promise<Response> {
  let lastError: Error | null =
    null;

  for (
    let attempt = 0;
    attempt < maxRetries;
    attempt++
  ) {
    try {
      const response =
        await fetch(
          url,
          options
        );

      if (
        !response.ok &&
        response.status >= 500
      ) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      return response;
    } catch (
      error
    ) {
      lastError =
        error as Error;

      if (
        attempt <
        maxRetries - 1
      ) {
        const delayMs =
          100 *
          Math.pow(
            2,
            attempt
          );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delayMs
            )
        );
      }
    }
  }

  throw (
    lastError ||
    new Error(
      'Failed to fetch after retries'
    )
  );
}

/* =========================================================
   SAVY HELPERS
========================================================= */

function getSavyDisplayName(
  savy: SavyCountry
) {
  if (
    savy.code === 'MY'
  ) {
    return 'Savy Malaysia';
  }

  return savy.savyName;
}

function getSavyVideoSrc(
  savy: SavyCountry
) {
  switch (
    savy.code
  ) {
    case 'MY':
      return '/savy-my.mp4';

    case 'SG':
      return '/savy-sg.mp4';

    case 'HK':
      return '/savy-hk.mp4';

    case 'TH':
      return '/savy-th.mp4';

    default:
      return null;
  }
}

function getCountryBadgeCode(
  savy: SavyCountry
) {
  if (
    savy.code ===
    'MY_WK'
  ) {
    return 'MY';
  }

  return savy.code;
}

/* =========================================================
   SAVY AVATAR

   small:
   - assistant chat message
   - typing indicator

   large:
   - welcome screen

   Video is zoomed so only the head / face is visible.
========================================================= */

function SavyAvatar({
  savy,
  size = 'small',
  showCountryBadge = false,
}: {
  savy: SavyCountry;
  size?: 'small' | 'large';
  showCountryBadge?: boolean;
}) {
  const videoSrc =
    getSavyVideoSrc(
      savy
    );

  const isLarge =
    size === 'large';

  return (
    <div
      className="
        relative
        shrink-0
      "
    >
      {/* =====================================
          AVATAR
      ===================================== */}

      <div
        className={
          isLarge
            ? `
                relative
                h-[96px]
                w-[96px]
                overflow-hidden
                rounded-full

                border
                border-[#a42025]/15

                bg-[#a42025]/[0.05]

                shadow-[0_12px_32px_rgba(164,32,37,0.14)]

                ring-4
                ring-white
              `
            : `
                relative
                h-8
                w-8
                overflow-hidden
                rounded-full

                border
                border-[#a42025]/15

                bg-[#a42025]/[0.06]

                shadow-[0_4px_12px_rgba(164,32,37,0.10)]
              `
        }
      >
        {/* FALLBACK */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center

            text-[9px]
            font-bold
            text-[#a42025]
          "
        >
          S
        </div>

        {/* VIDEO */}

        {videoSrc && (
          <video
            key={
              videoSrc
            }
            src={
              videoSrc
            }
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={
              getSavyDisplayName(
                savy
              )
            }
            className="
              pointer-events-none
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
            style={{
              /*
               * IMPORTANT:
               * Zoom video to display
               * Savy's HEAD ONLY.
               *
               * Increase 2.25 -> 2.4
               * if you want more zoom.
               */
              transform:
                isLarge
                  ? 'scale(2.15)'
                  : 'scale(2.0)',

              transformOrigin:
                '50% 1%',

              objectPosition:
                '50% 3%',
            }}
          />
        )}
      </div>

      {/* =====================================
          COUNTRY BADGE
      ===================================== */}

      {showCountryBadge && (
        <div
          className="
            absolute
            -bottom-1
            -right-3

            flex
            h-[26px]
            items-center
            gap-1.5

            rounded-full

            border
            border-[#e9e9e9]

            bg-white

            px-2.5

            shadow-[0_5px_16px_rgba(0,0,0,0.09)]
          "
        >
          <CountryFlag
            code={
              savy.code
            }
            name={
              savy.name
            }
            className="
              h-3
              w-[18px]
              rounded-[2px]
              object-cover
            "
          />

          <span
            className="
              text-[8px]
              font-bold
              uppercase
              tracking-[0.06em]
              text-[#a42025]
            "
          >
            {getCountryBadgeCode(
              savy
            )}
          </span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TYPING DOTS
========================================================= */

function TypingDots() {
  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
    >
      {[0, 1, 2].map(
        (i) => (
          <span
            key={i}
            className="
              block
              h-1.5
              w-1.5
              rounded-full
              bg-[#a42025]
            "
            style={{
              animation:
                'sw-pulse 1.2s ease-in-out infinite',

              animationDelay:
                `${i * 0.18}s`,
            }}
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

function ChatMessage({
  message,
  activeSavy,
}: {
  message: Message;
  activeSavy: SavyCountry;
}) {
  const isUser =
    message.role ===
    'user';

  /* =======================================================
     USER MESSAGE
  ======================================================= */

  if (isUser) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
          ease: 'easeOut',
        }}
        className="
          flex
          justify-end
        "
      >
        <div
          className="
            max-w-[78%]

            rounded-[16px_16px_4px_16px]

            bg-[#a42025]

            px-4
            py-3

            text-[13px]
            leading-[1.65]
            text-white

            shadow-[0_6px_18px_rgba(164,32,37,0.12)]

            sm:text-[14px]
          "
        >
          <p
            className="
              m-0
              whitespace-pre-wrap
              break-words
            "
          >
            {message.content}
          </p>
        </div>
      </motion.div>
    );
  }

  /* =======================================================
     ASSISTANT MESSAGE
  ======================================================= */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      className="
        flex
        items-start
        gap-3
      "
    >
      <SavyAvatar
        savy={
          activeSavy
        }
        size="small"
      />

      <div
        className="
          min-w-0
          max-w-[84%]

          rounded-[4px_16px_16px_16px]

          border
          border-[#e7e7e7]

          bg-white

          px-4
          py-3

          text-[13px]
          leading-[1.7]
          text-[#333333]

          shadow-[0_5px_20px_rgba(0,0,0,0.035)]

          sm:text-[14px]
        "
      >
        <MarkdownRenderer
          content={
            message.content
          }
        />
      </div>
    </motion.div>
  );
}

/* =========================================================
   CHAT INTERFACE
========================================================= */

export function ChatInterface({
  userId: _userId,
  initialSessionId,
  selectedSavy,
  onSessionCreated,
  onTitleChange,
  onOpenSidebar,
  isAdmin = false,
  onSwitchSavy,
  onAssistantComplete,
}: ChatInterfaceProps) {
  const router =
    useRouter();

  void _userId;

  /* =======================================================
     STATE
  ======================================================= */

  const fallbackCountry =
    SAVY_COUNTRIES[0];

  const [
    activeSavy,
    setActiveSavy,
  ] =
    useState<SavyCountry>(
      selectedSavy ??
        fallbackCountry
    );

  const [
    messages,
    setMessages,
  ] =
    useState<Message[]>(
      []
    );

  const [
    sessionTitle,
    setSessionTitle,
  ] =
    useState(
      'New Chat'
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    isLoadingHistory,
    setIsLoadingHistory,
  ] =
    useState(false);

  const [
    currentSessionId,
    setCurrentSessionId,
  ] =
    useState<
      string | null
    >(
      initialSessionId ??
        null
    );

  const [
    redirectTargets,
    setRedirectTargets,
  ] =
    useState<
      Map<
        string,
        string
      >
    >(
      new Map()
    );

  /* =======================================================
     REFS
  ======================================================= */

  const scrollRef =
    useRef<HTMLDivElement>(
      null
    );

  const loadedSessionRef =
    useRef<string | null>(
      initialSessionId ??
        null
    );

  const pendingSessionRef =
    useRef<string | null>(
      null
    );

  const isLoadingRef =
    useRef(false);

  /* =======================================================
     KEEP LOADING REF UPDATED
  ======================================================= */

  useEffect(() => {
    isLoadingRef.current =
      isLoading;
  }, [isLoading]);

  /* =======================================================
     LOAD SESSION HISTORY
  ======================================================= */

  useEffect(() => {
    if (
      !initialSessionId
    ) {
      setMessages([]);
      setSessionTitle(
        'New Chat'
      );
      setCurrentSessionId(
        null
      );

      loadedSessionRef.current =
        null;

      pendingSessionRef.current =
        null;

      return;
    }

    if (
      initialSessionId ===
      loadedSessionRef.current
    ) {
      return;
    }

    if (
      isLoadingRef.current
    ) {
      pendingSessionRef.current =
        initialSessionId;

      return;
    }

    loadedSessionRef.current =
      initialSessionId;

    pendingSessionRef.current =
      null;

    const loadId =
      initialSessionId;

    let cancelled =
      false;

    const loadHistory =
      async () => {
        setIsLoadingHistory(
          true
        );

        try {
          const res =
            await fetchWithRetry(
              `/api/chat/sessions/${loadId}`
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !res.ok
          ) {
            setMessages(
              []
            );

            setActiveSavy(
              fallbackCountry
            );

            setSessionTitle(
              'New Chat'
            );

            setCurrentSessionId(
              null
            );

            if (
              loadedSessionRef.current ===
              loadId
            ) {
              loadedSessionRef.current =
                null;
            }

            return;
          }

          const {
            session,
            messages:
              dbMessages,
          } =
            await res.json();

          if (
            cancelled
          ) {
            return;
          }

          const match =
            SAVY_COUNTRIES.find(
              (
                country
              ) =>
                country.code ===
                session.country_code
            );

          if (
            match
          ) {
            setActiveSavy(
              match
            );
          }

          setSessionTitle(
            session.title
          );

          setCurrentSessionId(
            loadId
          );

          setMessages(
            dbMessages.map(
              (
                message: {
                  id: string;
                  role: string;
                  content: string;
                }
              ) => ({
                id:
                  message.id,

                role:
                  message.role as
                    | 'user'
                    | 'assistant',

                content:
                  message.content,
              })
            )
          );
        } catch (
          err
        ) {
          console.error(
            'Failed to load session history:',
            err
          );
        } finally {
          if (
            !cancelled
          ) {
            setIsLoadingHistory(
              false
            );
          }
        }
      };

    void loadHistory();

    return () => {
      cancelled =
        true;
    };
  }, [
    initialSessionId,
    fallbackCountry,
    isLoading,
  ]);

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    if (
      scrollRef.current
    ) {
      scrollRef.current.scrollTo(
        {
          top:
            scrollRef.current
              .scrollHeight,

          behavior:
            'smooth',
        }
      );
    }
  }, [messages]);

  /* =======================================================
     TITLE SAVE
  ======================================================= */

  const handleTitleSave =
    useCallback(
      async (
        newTitle: string
      ) => {
        if (
          !currentSessionId
        ) {
          return;
        }

        setSessionTitle(
          newTitle
        );

        onTitleChange?.(
          currentSessionId,
          newTitle
        );

        try {
          await fetchWithRetry(
            `/api/chat/sessions/${currentSessionId}`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    title:
                      newTitle,
                  }
                ),
            }
          );
        } catch (
          err
        ) {
          console.error(
            'Failed to save title:',
            err
          );
        }
      },
      [
        currentSessionId,
        onTitleChange,
      ]
    );

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend =
    useCallback(
      async (
        text: string
      ) => {
        if (
          !text.trim() ||
          isLoading
        ) {
          return;
        }

        /* =====================================
           USER MESSAGE
        ===================================== */

        const userMessage: Message =
          {
            id:
              Date.now().toString(),

            role:
              'user',

            content:
              text.trim(),
          };

        const newMessages =
          [
            ...messages,
            userMessage,
          ];

        setMessages(
          newMessages
        );

        setIsLoading(
          true
        );

        try {
          /* =================================
             CHAT REQUEST
          ================================= */

          const response =
            await fetchWithRetry(
              '/api/chat',
              {
                method:
                  'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body:
                  JSON.stringify(
                    {
                      messages:
                        newMessages.map(
                          (
                            message
                          ) => ({
                            role:
                              message.role,

                            content:
                              message.content,
                          })
                        ),

                      countryCode:
                        activeSavy.code,

                      countryName:
                        activeSavy.name,

                      sessionId:
                        currentSessionId ??
                        undefined,
                    }
                  ),
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              'Failed to get response'
            );
          }

          /* =================================
             SESSION
          ================================= */

          const returnedSessionId =
            response.headers.get(
              'X-Session-Id'
            );

          if (
            returnedSessionId &&
            returnedSessionId !==
              currentSessionId
          ) {
            setCurrentSessionId(
              returnedSessionId
            );

            loadedSessionRef.current =
              returnedSessionId;

            router.replace(
              `/chat?session=${returnedSessionId}`,
              {
                scroll:
                  false,
              }
            );

            const autoTitle =
              text
                .trim()
                .slice(
                  0,
                  80
                );

            setSessionTitle(
              autoTitle
            );

            onSessionCreated?.(
              {
                id:
                  returnedSessionId,

                title:
                  autoTitle,

                country_code:
                  activeSavy.code,

                created_at:
                  new Date().toISOString(),

                updated_at:
                  new Date().toISOString(),
              }
            );
          }

          /* =================================
             STREAM
          ================================= */

          const reader =
            response.body?.getReader();

          const decoder =
            new TextDecoder();

          const assistantMessage: Message =
            {
              id:
                (
                  Date.now() +
                  1
                ).toString(),

              role:
                'assistant',

              content:
                '',
            };

          setMessages(
            (
              previous
            ) => [
              ...previous,
              assistantMessage,
            ]
          );

          let fullContent =
            '';

          if (
            reader
          ) {
            let done =
              false;

            while (
              !done
            ) {
              const {
                value,
                done:
                  readerDone,
              } =
                await reader.read();

              done =
                readerDone;

              if (
                value
              ) {
                const chunk =
                  decoder.decode(
                    value,
                    {
                      stream:
                        true,
                    }
                  );

                fullContent +=
                  chunk;

                const updatedText =
                  fullContent;

                setMessages(
                  (
                    previous
                  ) =>
                    previous.map(
                      (
                        message
                      ) =>
                        message.id ===
                        assistantMessage.id
                          ? {
                              ...message,
                              content:
                                updatedText,
                            }
                          : message
                    )
                );
              }
            }

            const remaining =
              decoder.decode();

            if (
              remaining
            ) {
              fullContent +=
                remaining;

              const finalContent =
                fullContent;

              setMessages(
                (
                  previous
                ) =>
                  previous.map(
                    (
                      message
                    ) =>
                      message.id ===
                      assistantMessage.id
                        ? {
                            ...message,
                            content:
                              finalContent,
                          }
                        : message
                  )
              );
            }
          }

          /* =================================
             REDIRECT MARKER
          ================================= */

          const markerMatch =
            fullContent.match(
              /\[REDIRECT:\s*([A-Z_]+)\s*\]/i
            );

          if (
            markerMatch
          ) {
            const targetCode =
              markerMatch[1].toUpperCase();

            const targetSavy =
              SAVY_COUNTRIES.find(
                (
                  country
                ) =>
                  country.code ===
                    targetCode &&
                  country.isActive
              );

            if (
              targetSavy &&
              targetCode !==
                activeSavy.code
            ) {
              const cleanedContent =
                fullContent
                  .replace(
                    /\[REDIRECT:\s*[A-Z_]+\s*\]/gi,
                    ''
                  )
                  .trim();

              setMessages(
                (
                  previous
                ) =>
                  previous.map(
                    (
                      message
                    ) =>
                      message.id ===
                      assistantMessage.id
                        ? {
                            ...message,
                            content:
                              cleanedContent,
                          }
                        : message
                  )
              );

              setRedirectTargets(
                (
                  previous
                ) => {
                  const next =
                    new Map(
                      previous
                    );

                  next.set(
                    assistantMessage.id,
                    targetCode
                  );

                  return next;
                }
              );
            }
          }

          /* =================================
             BACKGROUND INFORMATION EXTRACTION
          ================================= */

          try {
            const sessionIdForExtract =
              returnedSessionId ||
              currentSessionId;

            if (
              sessionIdForExtract
            ) {
              fetchWithRetry(
                '/api/extract-information',
                {
                  method:
                    'POST',

                  headers: {
                    'Content-Type':
                      'application/json',
                  },

                  body:
                    JSON.stringify(
                      {
                        sessionId:
                          sessionIdForExtract,

                        message:
                          userMessage.content,

                        countryCode:
                          activeSavy.code,
                      }
                    ),
                }
              ).catch(
                (
                  error
                ) =>
                  console.warn(
                    'extract-information failed:',
                    error
                  )
              );
            }
          } catch (
            error
          ) {
            console.warn(
              'Failed to initiate extract-information:',
              error
            );
          }

          onAssistantComplete?.();
        } catch (
          error
        ) {
          console.error(
            'Chat error:',
            error
          );

          setMessages(
            (
              previous
            ) => [
              ...previous,
              {
                id:
                  (
                    Date.now() +
                    1
                  ).toString(),

                role:
                  'assistant',

                content:
                  'I apologize, but I encountered an error. Please try again.',
              },
            ]
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [
        isLoading,
        messages,
        activeSavy,
        currentSessionId,
        router,
        onSessionCreated,
        onAssistantComplete,
      ]
    );

  /* =======================================================
     SUGGESTIONS
  ======================================================= */

  const suggestions =
    getSuggestionsForCountry(
      activeSavy.code
    );

  const showSuggestions =
    messages.length ===
      0 &&
    !isLoadingHistory;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        flex
        min-h-0
        flex-1
        flex-col
        bg-white
        text-[#171717]
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-3

          border-b
          border-[#eeeeee]

          bg-white/95

          px-4
          py-3

          backdrop-blur-xl

          sm:px-5
        "
      >
        {/* =====================================
            MOBILE MENU
        ===================================== */}

        <button
          type="button"
          onClick={
            onOpenSidebar
          }
          className="
            rounded-[8px]
            p-2
            text-[#777777]

            transition-all

            hover:bg-[#f3f3f3]
            hover:text-[#171717]

            md:hidden
          "
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* =====================================
            TITLE
        ===================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          {currentSessionId ? (
            <EditableTitle
              title={
                sessionTitle
              }
              onSave={
                handleTitleSave
              }
            />
          ) : (
            <span
              className="
                text-[14px]
                font-semibold
                text-[#222222]
              "
            >
              New conversation
            </span>
          )}

          {/* =================================
              SAVY INFORMATION
          ================================= */}

          <div
            className="
              mt-1
              flex
              items-center
              gap-2

              text-[9px]
              font-medium
              text-[#888888]
            "
          >
            <CountryFlag
              code={
                activeSavy.code
              }
              name={
                activeSavy.name
              }
              className="
                h-3
                w-[18px]
                rounded-[2px]
                object-cover
              "
            />

            <span>
              {getSavyDisplayName(
                activeSavy
              )}
            </span>

            <span
              className="
                text-[#cccccc]
              "
            >
              ·
            </span>

            <Lock
              className="
                h-2.5
                w-2.5
                text-[#999999]
              "
            />

            <span>
              Private conversation
            </span>
          </div>
        </div>

        {/* =====================================
            ADMIN SETTINGS
        ===================================== */}

        {isAdmin && (
          <Link
            href={`/admin/ai-instructions?country=${activeSavy.code}`}
            className="
              hidden
              items-center
              gap-1.5

              rounded-[8px]

              border
              border-[#e2e2e2]

              bg-white

              px-2.5
              py-1.5

              text-[10px]
              font-medium
              text-[#555555]

              transition-all

              hover:border-[#a42025]/30
              hover:bg-[#a42025]/[0.05]
              hover:text-[#a42025]

              sm:inline-flex
            "
            aria-label="AI Settings"
          >
            <Settings className="h-3.5 w-3.5" />

            AI Settings
          </Link>
        )}

        {/* =====================================
            MORE
        ===================================== */}

        <button
          type="button"
          className="
            rounded-[8px]
            p-2
            text-[#999999]

            transition-all

            hover:bg-[#f3f3f3]
            hover:text-[#333333]
          "
          aria-label="More"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div
        ref={
          scrollRef
        }
        className="
          flex-1
          overflow-y-auto
          bg-white

          px-4

          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            max-w-3xl
            space-y-5

            py-6

            sm:py-10
          "
        >
          {/* =============================================
              LOADING HISTORY
          ============================================= */}

          {isLoadingHistory ? (
            <div
              className="
                flex
                items-center
                justify-center
                py-24
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[12px]
                  text-[#999999]
                "
              >
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full

                    border-2
                    border-[#a42025]/15
                    border-t-[#a42025]
                  "
                />

                Loading conversation...
              </div>
            </div>
          ) : messages.length ===
            0 ? (
            /* ===========================================
               EMPTY CHAT / WELCOME
            =========================================== */

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="
                flex
                flex-col
                items-center

                py-12

                text-center

                sm:py-16
              "
            >
              {/* =====================================
                  SAVY HEAD AVATAR
              ===================================== */}

              <SavyAvatar
                savy={
                  activeSavy
                }
                size="large"
                showCountryBadge
              />

              {/* =====================================
                  WELCOME TEXT
              ===================================== */}

              <div
                className="
                  mt-5
                "
              >
                <h2
                  className="
                    m-0

                    font-serif

                    text-[27px]
                    font-semibold

                    tracking-[-0.04em]

                    text-[#171717]

                    sm:text-[31px]
                  "
                >
                  Hi, I&apos;m{' '}

                  <span
                    className="
                      text-[#a42025]
                    "
                  >
                    {getSavyDisplayName(
                      activeSavy
                    )}
                  </span>

                  .
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-[470px]

                    px-3

                    text-[13px]
                    leading-[1.75]
                    text-[#7a7a7a]
                  "
                >
                  Ask me anything
                  about will planning
                  in{' '}
                  {activeSavy.name}.
                  I&apos;ll guide you
                  through the
                  information needed
                  for your will plan.
                </p>
              </div>

              {/* =====================================
                  COUNTRY BADGE
              ===================================== */}

              <div
                className="
                  mt-5

                  flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-[#e6e6e6]

                  bg-white

                  px-3.5
                  py-1.5

                  shadow-[0_4px_14px_rgba(0,0,0,0.035)]
                "
              >
                <CountryFlag
                  code={
                    activeSavy.code
                  }
                  name={
                    activeSavy.name
                  }
                  className="
                    h-3.5
                    w-5
                    rounded-[2px]
                    object-cover
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase

                    tracking-[0.13em]

                    text-[#666666]
                  "
                >
                  {activeSavy.name}
                </span>
              </div>
            </motion.div>
          ) : null}

          {/* =============================================
              MESSAGE LIST
          ============================================= */}

          <AnimatePresence
            mode="popLayout"
          >
            {messages.map(
              (
                message
              ) => {
                const targetCode =
                  message.role ===
                  'assistant'
                    ? redirectTargets.get(
                        message.id
                      )
                    : undefined;

                const targetSavy =
                  targetCode
                    ? SAVY_COUNTRIES.find(
                        (
                          country
                        ) =>
                          country.code ===
                          targetCode
                      )
                    : undefined;

                const showCTA =
                  !!targetSavy &&
                  !!onSwitchSavy;

                return (
                  <React.Fragment
                    key={
                      message.id
                    }
                  >
                    <ChatMessage
                      message={
                        message
                      }
                      activeSavy={
                        activeSavy
                      }
                    />

                    <AnimatePresence>
                      {showCTA &&
                        targetSavy && (
                          <SavyRedirectCTA
                            key={`cta-${message.id}`}
                            target={
                              targetSavy
                            }
                            onNavigate={() =>
                              onSwitchSavy!(
                                targetSavy.code
                              )
                            }
                            onDismiss={() =>
                              setRedirectTargets(
                                (
                                  previous
                                ) => {
                                  const next =
                                    new Map(
                                      previous
                                    );

                                  next.delete(
                                    message.id
                                  );

                                  return next;
                                }
                              )
                            }
                          />
                        )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              }
            )}
          </AnimatePresence>

          {/* =============================================
              ASSISTANT TYPING
          ============================================= */}

          <AnimatePresence>
            {isLoading &&
              messages[
                messages.length -
                  1
              ]?.role ===
                'user' && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <SavyAvatar
                    savy={
                      activeSavy
                    }
                    size="small"
                  />

                  <div
                    className="
                      rounded-[4px_16px_16px_16px]

                      border
                      border-[#e7e7e7]

                      bg-white

                      px-4
                      py-3.5

                      shadow-[0_5px_20px_rgba(0,0,0,0.035)]
                    "
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      {/* ==================================================
          INPUT AREA
      ================================================== */}

      <div
        className="
          shrink-0

          border-t
          border-[#eeeeee]

          bg-white

          px-4

          pb-[max(1rem,env(safe-area-inset-bottom))]
          pt-3

          sm:px-6
          sm:pt-4
        "
      >
        <div
          className="
            mx-auto
            max-w-3xl
          "
        >
          {/* =============================================
              SUGGESTIONS
          ============================================= */}

          {showSuggestions && (
            <div
              className="
                mb-3
                flex
                flex-wrap
                gap-2
              "
            >
              {suggestions.map(
                (
                  suggestion
                ) => (
                  <button
                    key={
                      suggestion
                    }
                    type="button"
                    onClick={() =>
                      handleSend(
                        suggestion
                      )
                    }
                    disabled={
                      isLoading
                    }
                    className="
                      rounded-[9px]

                      border
                      border-[#e4e4e4]

                      bg-white

                      px-3
                      py-1.5

                      text-[10px]
                      font-medium
                      text-[#666666]

                      shadow-[0_2px_7px_rgba(0,0,0,0.02)]

                      transition-all

                      hover:border-[#a42025]/25
                      hover:bg-[#a42025]/[0.05]
                      hover:text-[#a42025]

                      disabled:opacity-40
                    "
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          )}

          {/* =============================================
              PROMPT BOX
          ============================================= */}

          <PromptBox
            placeholder={`Message ${getSavyDisplayName(
              activeSavy
            )}...`}
            onSend={
              handleSend
            }
            isLoading={
              isLoading
            }
          />

          {/* =============================================
              DISCLAIMER
          ============================================= */}

          <p
            className="
              mb-0
              mt-2.5

              text-center
              text-[9px]
              leading-[1.5]

              tracking-[0.01em]

              text-[#aaaaaa]
            "
          >
            SmartWills.ai provides
            general guidance only. For
            binding advice, consult a
            licensed solicitor.
          </p>
        </div>
      </div>
    </div>
  );
}