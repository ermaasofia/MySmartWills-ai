'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SessionSummary {
  id: string;
  title: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

// Exponential backoff retry helper
async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on 429 if we've already retried once (server is rate limiting)
      if (response.status === 429 && attempt > 0) {
        return response;
      }
      
      if (!response.ok && response.status >= 500) {
        // Retry on server errors
        throw new Error(`Server error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms
        const delayMs = 100 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries');
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetchWithRetry('/api/chat/sessions');
      if (!res.ok) {
        if (res.status === 429) {
          console.warn('Sessions list rate limited');
        }
        return;
      }
      const { sessions: data } = await res.json();
      setSessions(data ?? []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const addSession = useCallback((session: SessionSummary) => {
    setSessions((prev) => {
      // Put newest first, remove duplicate if already there
      const filtered = prev.filter((s) => s.id !== session.id);
      return [session, ...filtered];
    });
  }, []);

  const updateSessionTitle = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s)),
    );
  }, []);

  const removeSession = useCallback(
    async (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      try {
        await fetchWithRetry(`/api/chat/sessions/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to delete session:', err);
        // Re-fetch to restore correct state on error
        fetchSessions();
      }
    },
    [fetchSessions],
  );

  return {
    sessions,
    isLoading,
    refetch: fetchSessions,
    addSession,
    updateSessionTitle,
    removeSession,
  };
}
