'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EditableTitle } from '@/components/chat/editable-title';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { SAVY_COUNTRIES, type SavyCountry } from '@/lib/constants';
import { Menu, Settings, Lock, MoreHorizontal } from 'lucide-react';
import { MarkdownRenderer } from '@/components/chat/markdown-renderer';
import { SavyRedirectCTA } from '@/components/chat/savy-redirect-cta';
import { SessionSummary } from '@/hooks/use-chat-sessions';
import { getSuggestionsForCountry } from '@/lib/suggestions';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  userId: string;
  initialSessionId?: string;
  selectedSavy?: SavyCountry;
  onSessionCreated?: (session: SessionSummary) => void;
  onTitleChange?: (id: string, title: string) => void;
  onOpenSidebar?: () => void;
  isAdmin?: boolean;
  onSwitchSavy?: (code: string) => void;
  /** Bumped by the parent each time an assistant stream finishes — triggers plan panel re-fetch */
  onAssistantComplete?: () => void;
}

function SwAvatar() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] font-mono text-[10px] font-bold text-[#0a0a0a]"
      style={{ background: 'linear-gradient(135deg, var(--accent), #ededed)' }}
    >
      sw
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          style={{
            animation: 'sw-pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex justify-end"
      >
        <div
          className="max-w-[78%] px-4 py-2.5 text-sm leading-relaxed text-[#0a0a0a]"
          style={{
            background: 'var(--accent)',
            borderRadius: '14px 14px 2px 14px',
          }}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      <SwAvatar />
      <div
        className="max-w-[82%] min-w-0 border border-[var(--border)] bg-white/[0.05] px-4 py-3 text-sm text-[#ededed]"
        style={{ borderRadius: '14px 14px 14px 2px' }}
      >
        <MarkdownRenderer content={message.content} />
      </div>
    </motion.div>
  );
}

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
  const router = useRouter();
  void _userId;

  const fallbackCountry = SAVY_COUNTRIES[0];
  const [activeSavy, setActiveSavy] = useState<SavyCountry>(selectedSavy ?? fallbackCountry);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionTitle, setSessionTitle] = useState('New Chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );

  const [redirectTargets, setRedirectTargets] = useState<Map<string, string>>(new Map());

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadedSessionRef = useRef<string | null>(initialSessionId ?? null);

  useEffect(() => {
    if (!initialSessionId) {
      setMessages([]);
      setSessionTitle('New Chat');
      setCurrentSessionId(null);
      loadedSessionRef.current = null;
      return;
    }

    if (initialSessionId === loadedSessionRef.current) return;
    loadedSessionRef.current = initialSessionId;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`/api/chat/sessions/${initialSessionId}`);
        if (!res.ok) return;
        const { session, messages: dbMessages } = await res.json();

        const match = SAVY_COUNTRIES.find((c) => c.code === session.country_code);
        if (match) setActiveSavy(match);
        setSessionTitle(session.title);
        setCurrentSessionId(initialSessionId);

        setMessages(
          dbMessages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        );
      } catch (err) {
        console.error('Failed to load session history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [initialSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleTitleSave = useCallback(
    async (newTitle: string) => {
      if (!currentSessionId) return;
      setSessionTitle(newTitle);
      onTitleChange?.(currentSessionId, newTitle);
      await fetch(`/api/chat/sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
    },
    [currentSessionId, onTitleChange],
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            countryCode: activeSavy.code,
            countryName: activeSavy.name,
            sessionId: currentSessionId ?? undefined,
          }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const returnedSessionId = response.headers.get('X-Session-Id');
        if (returnedSessionId && returnedSessionId !== currentSessionId) {
          setCurrentSessionId(returnedSessionId);
          loadedSessionRef.current = returnedSessionId;
          router.replace(`/chat?session=${returnedSessionId}`, { scroll: false });

          const autoTitle = text.trim().slice(0, 80);
          setSessionTitle(autoTitle);
          onSessionCreated?.({
            id: returnedSessionId,
            title: autoTitle,
            country_code: activeSavy.code,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (reader) {
          let done = false;
          let fullContent = '';
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              fullContent += chunk;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: m.content + chunk } : m,
                ),
              );
            }
          }

          const markerMatch = fullContent.match(/\[REDIRECT:\s*([A-Z_]+)\s*\]/i);
          if (markerMatch) {
            const targetCode = markerMatch[1].toUpperCase();
            const targetSavy = SAVY_COUNTRIES.find((c) => c.code === targetCode && c.isActive);
            if (targetSavy && targetCode !== activeSavy.code) {
              const cleanedContent = fullContent.replace(/\[REDIRECT:\s*[A-Z_]+\s*\]/gi, '').trim();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: cleanedContent } : m,
                ),
              );
              setRedirectTargets((prev) => {
                const next = new Map(prev);
                next.set(assistantMessage.id, targetCode);
                return next;
              });
            }
          }
        }

        onAssistantComplete?.();
      } catch (error) {
        console.error('Chat error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I apologize, but I encountered an error. Please try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
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
    ],
  );

  const suggestions = getSuggestionsForCountry(activeSavy.code);
  const showSuggestions = messages.length === 0 && !isLoadingHistory;

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 shrink-0">
        <button
          onClick={onOpenSidebar}
          className="md:hidden rounded p-1.5 text-white/60 hover:bg-white/[0.06]"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          {currentSessionId ? (
            <EditableTitle title={sessionTitle} onSave={handleTitleSave} />
          ) : (
            <span className="text-sm font-medium text-[#ededed]">New conversation</span>
          )}
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-white/45">
            <span>{activeSavy.flag}</span>
            <span>{activeSavy.savyName}</span>
            <span className="text-white/25">·</span>
            <Lock className="h-2.5 w-2.5" />
            <span>End-to-end encrypted</span>
          </div>
        </div>

        {isAdmin && (
          <Link
            href={`/admin/ai-instructions?country=${activeSavy.code}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/[0.05]"
            aria-label="AI Settings"
          >
            <Settings className="h-3.5 w-3.5" />
            AI Settings
          </Link>
        )}

        <button
          className="rounded-[6px] p-1.5 text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/80"
          aria-label="More"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl py-6 sm:py-10 space-y-5">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-white/45 animate-pulse">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center text-center py-12 sm:py-16 gap-3"
            >
              <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--accent)]">
                // {activeSavy.code}
              </div>
              <h2 className="text-2xl sm:text-[28px] font-medium text-[#ededed] tracking-[-0.02em]">
                Hi, I&apos;m {activeSavy.savyName}.
              </h2>
              <p className="text-sm text-white/55 max-w-md">
                Ask me anything about will planning in {activeSavy.name}. I&apos;ll guide
                you to a prep sheet you can take to a solicitor.
              </p>
            </motion.div>
          ) : null}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => {
              const targetCode =
                message.role === 'assistant' ? redirectTargets.get(message.id) : undefined;
              const targetSavy = targetCode
                ? SAVY_COUNTRIES.find((c) => c.code === targetCode)
                : undefined;
              const showCTA = !!targetSavy && !!onSwitchSavy;
              return (
                <React.Fragment key={message.id}>
                  <ChatMessage message={message} />
                  <AnimatePresence>
                    {showCTA && targetSavy && (
                      <SavyRedirectCTA
                        key={`cta-${message.id}`}
                        target={targetSavy}
                        onNavigate={() => onSwitchSavy!(targetSavy.code)}
                        onDismiss={() =>
                          setRedirectTargets((prev) => {
                            const next = new Map(prev);
                            next.delete(message.id);
                            return next;
                          })
                        }
                      />
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3"
              >
                <SwAvatar />
                <div
                  className="border border-[var(--border)] bg-white/[0.05] px-4 py-3"
                  style={{ borderRadius: '14px 14px 14px 2px' }}
                >
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[#0a0a0a] px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl">
          {showSuggestions && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={isLoading}
                  className="rounded-[8px] border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-[#ededed] disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <PromptBox
            placeholder={`Message ${activeSavy.savyName}...`}
            onSend={handleSend}
            isLoading={isLoading}
          />

          <p className="mt-2.5 text-center font-mono text-[10px] tracking-[0.5px] text-white/35">
            SmartWills.ai provides general guidance only. For binding advice, consult a
            licensed solicitor.
          </p>
        </div>
      </div>
    </div>
  );
}
