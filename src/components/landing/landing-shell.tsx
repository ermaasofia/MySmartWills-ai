'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { VideoIntro } from './video-intro';

const SESSION_KEY = 'sw-intro-seen';

export function LandingShell({ children }: { children: React.ReactNode }) {
  // Start false — set true only on client after checking sessionStorage (prevents SSR flash)
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setShowIntro(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setShowIntro(false);
    document.body.style.overflow = '';
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && <VideoIntro key="intro" onComplete={handleComplete} />}
      </AnimatePresence>
      {children}
    </>
  );
}
