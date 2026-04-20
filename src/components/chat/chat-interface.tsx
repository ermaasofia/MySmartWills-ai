'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditableTitle } from '@/components/chat/editable-title';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { SAVY_COUNTRIES, type SavyCountry } from '@/lib/constants';
import { Menu, RotateCcw, Settings } from 'lucide-react';
import { MarkdownRenderer } from '@/components/chat/markdown-renderer';
import { SavyRedirectCTA } from '@/components/chat/savy-redirect-cta';
import { SessionSummary } from '@/hooks/use-chat-sessions';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  userId: string;
  initialSessionId?: string;
  /** Pre-selected Savy country from the selector screen */
  selectedSavy?: SavyCountry;
  /** Called when a brand-new session is created so the sidebar list updates */
  onSessionCreated?: (session: SessionSummary) => void;
  /** Called when the session title is renamed so the sidebar list updates */
  onTitleChange?: (id: string, title: string) => void;
  /** Opens the mobile sidebar drawer */
  onOpenSidebar?: () => void;
  /** Whether the user is an admin */
  isAdmin?: boolean;
  /** Called when the user clicks a cross-Savy redirect CTA. Receives the target Savy code. */
  onSwitchSavy?: (code: string) => void;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-foreground/60 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex gap-4 justify-end"
      >
        <motion.div
          className="max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm bg-primary text-primary-foreground"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex gap-3 justify-start items-start"
    >
      <div className="max-w-[85%] min-w-0">
        <div className="text-sm text-foreground">
          <MarkdownRenderer content={message.content} />
        </div>
      </div>
    </motion.div>
  );
}

export function ChatInterface({
  userId,
  initialSessionId,
  selectedSavy,
  onSessionCreated,
  onTitleChange,
  onOpenSidebar,
  isAdmin = false,
  onSwitchSavy,
}: ChatInterfaceProps) {
  const router = useRouter();

  // Country comes from the Savy selector (prop) or from loading a session
  const fallbackCountry = SAVY_COUNTRIES[0]; // Malaysia
  const [activeSavy, setActiveSavy] = useState<SavyCountry>(selectedSavy ?? fallbackCountry);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionTitle, setSessionTitle] = useState('New Chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );

  // Map of assistant message ID -> target Savy code when the AI emits a [REDIRECT:CODE] marker
  const [redirectTargets, setRedirectTargets] = useState<Map<string, string>>(new Map());

  const scrollRef = useRef<HTMLDivElement>(null);
  // Tracks which session is currently loaded - used to skip redundant fetches
  const loadedSessionRef = useRef<string | null>(initialSessionId ?? null);

  // Load history when an existing session is provided
  useEffect(() => {
    if (!initialSessionId) {
      setMessages([]);
      setSessionTitle('New Chat');
      setCurrentSessionId(null);
      loadedSessionRef.current = null;
      return;
    }

    // Already loaded or streaming into this session - skip re-fetch
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

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  //  Rename session title 
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

  // Send message 
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

          // Tell the sidebar about the new session
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
    [isLoading, messages, activeSavy, currentSessionId, router, onSessionCreated, userId],
  );

  // New chat 
  const handleNewChat = () => {
    setMessages([]);
    setSessionTitle('New Chat');
    setCurrentSessionId(null);
    router.replace('/chat', { scroll: false });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-border/60 bg-background/90 backdrop-blur-md z-10 shrink-0">
        {/* Hamburger - mobile only */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-1.5 rounded hover:bg-muted transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Session title (editable once a session exists) */}
        <div className="flex-1 min-w-0">
          {currentSessionId ? (
            <EditableTitle title={sessionTitle} onSave={handleTitleSave} />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">New Chat</span>
          )}
        </div>

        {/* Country badge (read-only) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium shrink-0">
          <span>{activeSavy.flag}</span>
          <span className="hidden sm:inline">{activeSavy.savyName}</span>
          <span className="sm:hidden">{activeSavy.code}</span>
        </div>

        {/* Admin AI Settings button */}
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 shrink-0"
            aria-label="AI Settings"
          >
            <Link href={`/admin/ai-instructions?country=${activeSavy.code}`}>
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">AI Settings</span>
            </Link>
          </Button>
        )}

        {/* New chat button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewChat}
          disabled={messages.length === 0}
          className="gap-1.5 shrink-0"
          aria-label="New chat"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">New</span>
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-6 relative"
      >
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px]" />
        </div>

        <div className="relative container mx-auto max-w-3xl py-4 sm:py-8 space-y-4 sm:space-y-6">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-muted-foreground animate-pulse">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center text-center py-20 sm:py-28 gap-3"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">Hi, I&apos;m {activeSavy.savyName}!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask me anything about will planning in <strong>{activeSavy.name}</strong>.
              </p>
            </motion.div>
          ) : null}

          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => {
              const targetCode =
                message.role === 'assistant' ? redirectTargets.get(message.id) : undefined;
              const targetSavy = targetCode
                ? SAVY_COUNTRIES.find((c) => c.code === targetCode)
                : undefined;
              const showCTA = !!targetSavy && !!onSwitchSavy;
              return (
                <React.Fragment key={message.id}>
                  <ChatMessage message={message} isLatest={index === messages.length - 1} />
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

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="px-1 py-1 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Thinking</span>
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-4 bg-background/90 backdrop-blur-md border-t border-border/40 z-10">
        <div className="container mx-auto max-w-3xl">
          <PromptBox
            placeholder={`Ask about will planning in ${activeSavy.name}...`}
            onSend={handleSend}
            isLoading={isLoading}
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
            AI SmartWills provides general guidance only. Consult a legal professional for specific advice.
          </p>
        </div>
      </div>
    </div>
  );
}

