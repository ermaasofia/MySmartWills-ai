'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CountrySelector } from '@/components/chat/country-selector';
import { EditableTitle } from '@/components/chat/editable-title';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { COUNTRIES } from '@/lib/constants';
import { Menu, RotateCcw } from 'lucide-react';
import { Country } from '@/types';
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
  /** Called when a brand-new session is created so the sidebar list updates */
  onSessionCreated?: (session: SessionSummary) => void;
  /** Called when the session title is renamed so the sidebar list updates */
  onTitleChange?: (id: string, title: string) => void;
  /** Opens the mobile sidebar drawer */
  onOpenSidebar?: () => void;
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
          className="max-w-[85%] rounded-2xl px-5 py-3 shadow-sm bg-primary text-primary-foreground"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex gap-4 justify-start"
    >
      <div className="max-w-[85%] px-1 py-1">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

export function ChatInterface({
  userId,
  initialSessionId,
  onSessionCreated,
  onTitleChange,
  onOpenSidebar,
}: ChatInterfaceProps) {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionTitle, setSessionTitle] = useState('New Chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  // Tracks which session is currently loaded — used to skip redundant fetches
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

    // Already loaded or streaming into this session — skip re-fetch
    if (initialSessionId === loadedSessionRef.current) return;
    loadedSessionRef.current = initialSessionId;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`/api/chat/sessions/${initialSessionId}`);
        if (!res.ok) return;
        const { session, messages: dbMessages } = await res.json();

        const match = COUNTRIES.find((c) => c.code === session.country_code);
        if (match) setSelectedCountry(match);
        setSessionTitle(session.title);
        setCurrentSessionId(initialSessionId);

        setMessages(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dbMessages.map((m: any) => ({
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

  // â”€â”€ Auto-scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // â”€â”€ Rename session title â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Send message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            countryCode: selectedCountry.code,
            countryName: selectedCountry.name,
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
            country_code: selectedCountry.code,
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
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: m.content + chunk } : m,
                ),
              );
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
    [isLoading, messages, selectedCountry, currentSessionId, router, onSessionCreated, userId],
  );

  // â”€â”€ New chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleNewChat = () => {
    setMessages([]);
    setSessionTitle('New Chat');
    setCurrentSessionId(null);
    router.replace('/chat', { scroll: false });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-background">
      {/* â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-border/60 bg-background/90 backdrop-blur-md z-10 shrink-0">
        {/* Hamburger â€” mobile only */}
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

        {/* Jurisdiction selector */}
        <CountrySelector selectedCountry={selectedCountry} onSelect={setSelectedCountry} />

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

      {/* â”€â”€ Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-6 relative"
      >
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px] animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto max-w-3xl py-4 sm:py-8 space-y-4 sm:space-y-6">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-muted-foreground animate-pulse">Loading conversationâ€¦</p>
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center text-center py-20 sm:py-28 gap-3"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">Hi, Welcome to AI SmartWills!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask me anything about will planning in <strong>{selectedCountry.name}</strong>.
              </p>
            </motion.div>
          ) : null}

          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
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

      {/* â”€â”€ Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-4 bg-background/90 backdrop-blur-md border-t border-border/40 z-10">
        <div className="container mx-auto max-w-3xl">
          <PromptBox
            placeholder={`Ask about will planning in ${selectedCountry.name}â€¦`}
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

