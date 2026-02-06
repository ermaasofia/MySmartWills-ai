'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CountrySelector } from '@/components/chat/country-selector';
import { COUNTRIES } from '@/lib/constants';
import { Send, RotateCcw } from 'lucide-react';
import { Country } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  userId: string;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-foreground/60 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function ChatMessage({
  message,
  isLatest,
}: {
  message: Message;
  isLatest: boolean;
}) {
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
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // AI response - no box, just plain text
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

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to AI SmartWills. I'm here to help you understand will planning in ${selectedCountry.name}. Feel free to ask me any questions about estate planning, beneficiaries, executors, or the legal requirements in your jurisdiction.`,
      },
    ]);
  }, [selectedCountry.name]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '56px';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '56px';
      }

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            countryCode: selectedCountry.code,
            countryName: selectedCountry.name,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
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
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + chunk }
                    : m
                )
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
    [input, isLoading, messages, selectedCountry, userId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to AI SmartWills. I'm here to help you understand will planning in ${selectedCountry.name}. Feel free to ask me any questions about estate planning, beneficiaries, executors, or the legal requirements in your jurisdiction.`,
      },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col max-h-[calc(100vh-73px)] relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
      </div>

      {/* Country Selector Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 px-6 py-3 bg-background/80 backdrop-blur-xl z-10"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Jurisdiction:</span>
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            disabled={messages.length <= 1}
            className="gap-2 hover:bg-primary/10"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 relative z-10"
      >
        <div className="container mx-auto max-w-3xl py-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="px-1 py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Thinking
                    </span>
                    <TypingDots />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-border/50 px-6 py-4 bg-background/80 backdrop-blur-xl z-10"
      >
        <form
          onSubmit={handleSubmit}
          className="container mx-auto max-w-3xl"
        >
          <motion.div
            className={cn(
              'relative rounded-2xl border transition-all duration-300',
              isFocused
                ? 'border-primary/50 shadow-lg shadow-primary/5'
                : 'border-border/50 bg-muted/30'
            )}
          >
            {/* Animated border glow */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, var(--primary) 50%, transparent)',
                    opacity: 0.1,
                  }}
                />
              )}
            </AnimatePresence>

            <div className="flex items-end gap-3 p-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={`Ask about will planning in ${selectedCountry.name}...`}
                className={cn(
                  'flex-1 resize-none bg-transparent px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground/50',
                  'focus:outline-none',
                  'min-h-[56px] max-h-[200px]'
                )}
                disabled={isLoading}
                style={{ height: '56px' }}
              />

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'h-11 w-11 rounded-xl transition-all duration-300',
                    input.trim()
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    </motion.div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            AI SmartWills provides general guidance only. Consult a legal
            professional for specific advice.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
