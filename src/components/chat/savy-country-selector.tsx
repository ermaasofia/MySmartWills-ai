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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SavyCountrySelector({ onSelect }: SavyCountrySelectorProps) {
  const [tappedCode, setTappedCode] = useState<string | null>(null);

  const handleTap = (country: SavyCountry) => {
    if (!country.isActive || tappedCode) return;
    setTappedCode(country.code);
    setTimeout(() => onSelect(country), 300);
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto bg-[#0a0a0a] text-[#ededed]">
      {/* Ambient gradients matching landing hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, var(--accent-soft) 0%, transparent 50%), radial-gradient(ellipse at 0% 60%, rgba(255,255,255,0.04) 0%, transparent 50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative text-center mb-10"
      >
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
          // CHOOSE YOUR SAVY
        </div>
        <h2
          className="m-0 font-medium leading-[1.05]"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.025em' }}
        >
          Pick a jurisdiction <br className="hidden sm:block" />
          <span style={{ color: 'var(--accent)' }}>to begin</span>.
        </h2>
        <p className="mt-3 text-sm text-white/55">
          Each Savy is trained on local statutes and inheritance rules.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-[640px]"
      >
        {SAVY_COUNTRIES.map((country) => {
          const isActive = country.isActive;
          const isTapped = tappedCode === country.code;

          return (
            <motion.button
              key={country.code}
              variants={item}
              whileHover={isActive ? { y: -2 } : undefined}
              whileTap={isActive ? { scale: 0.97 } : undefined}
              animate={isTapped ? { scale: [1, 1.08, 1] } : undefined}
              transition={isTapped ? { duration: 0.25 } : { type: 'spring', stiffness: 320, damping: 22 }}
              onClick={() => handleTap(country)}
              disabled={!isActive}
              className={`group relative flex flex-col items-center gap-2 rounded-[12px] border border-[var(--border)] bg-white/[0.02] p-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                isActive
                  ? 'cursor-pointer hover:bg-white/[0.05]'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full text-2xl sm:text-3xl transition-all ${
                  isActive
                    ? 'bg-white/[0.06] grayscale-0 group-hover:bg-white/[0.1]'
                    : 'bg-white/[0.03] grayscale opacity-70'
                }`}
              >
                {country.flag}
              </div>

              <span className="text-xs sm:text-sm font-medium leading-tight text-center">
                {country.savyName}
              </span>

              {!isActive && (
                <span className="font-mono text-[9px] uppercase tracking-[1px] text-white/40">
                  Coming soon
                </span>
              )}

              {isActive && (
                <span className="font-mono text-[10px] uppercase tracking-[1px] text-white/35">
                  {country.code}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
