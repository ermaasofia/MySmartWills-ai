'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VideoIntroProps {
  onComplete: () => void;
}

export function VideoIntro({ onComplete }: VideoIntroProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Safety fallback: skip after 7s if video fails to load or autoplay is blocked
    timerRef.current = setTimeout(onComplete, 7000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          onComplete();
        }}
      >
        <source src="/intro.mp4" type="video/mp4" />
        <source src="/intro.webm" type="video/webm" />
      </video>
    </motion.div>
  );
}
