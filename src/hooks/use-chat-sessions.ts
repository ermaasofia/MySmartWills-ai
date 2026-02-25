'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SessionSummary {
  id: string;
  title: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      if (!res.ok) return;
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
        await fetch(`/api/chat/sessions/${id}`, { method: 'DELETE' });
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
