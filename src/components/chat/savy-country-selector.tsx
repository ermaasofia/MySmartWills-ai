'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SAVY_COUNTRIES, type SavyCountry } from '@/lib/constants';

interface SavyCountrySelectorProps {
  onSelect: (country: SavyCountry) => void;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SavyCountrySelector({ onSelect }: SavyCountrySelectorProps) {
  const [tappedCode, setTappedCode] = useState<string | null>(null);

  const handleTap = (country: SavyCountry) => {
    if (!country.isActive || tappedCode) return;
    setTappedCode(country.code);
    // Small delay for the pulse animation to play before transitioning
    setTimeout(() => onSelect(country), 300);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-crimson)]">
          Choose Your Savy
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Select your country to get started
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 max-w-xl"
      >
        {SAVY_COUNTRIES.map((country) => {
          const isActive = country.isActive;
          const isTapped = tappedCode === country.code;

          return (
            <motion.button
              key={country.code}
              variants={item}
              whileHover={isActive ? { scale: 1.08 } : undefined}
              whileTap={isActive ? { scale: 0.95 } : undefined}
              animate={isTapped ? { scale: [1, 1.12, 1] } : undefined}
              transition={isTapped ? { duration: 0.25 } : { type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => handleTap(country)}
              disabled={!isActive}
              className={`flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl p-2 transition-colors ${
                isActive
                  ? 'cursor-pointer hover:bg-muted/50'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              {/* Circular flag */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-2 transition-colors ${
                  isActive
                    ? 'border-border bg-muted/30 shadow-sm'
                    : 'border-border/50 bg-muted/10'
                }`}
              >
                {country.flag}
              </div>

              {/* Label */}
              <span className="text-xs sm:text-sm font-medium leading-tight text-center">
                {country.savyName}
              </span>

              {/* Coming Soon badge */}
              {!isActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
