'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { SavyCountry } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';

interface SavyRedirectCTAProps {
  target: SavyCountry;
  onNavigate: () => void;
  onDismiss: () => void;
}

export function SavyRedirectCTA({ target, onNavigate, onDismiss }: SavyRedirectCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mt-3 ml-10 max-w-[85%] rounded-[10px] border border-[var(--border)] bg-white/[0.04] p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--accent)]">
            // SAVY HANDOFF
          </div>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-base font-medium leading-snug text-[#ededed]">
            <CountryFlag code={target.code} className="h-3 w-[18px] object-cover" />
            <span>Mungkin {target.savyName} lebih sesuai?</span>
          </p>
          <p className="mt-0.5 text-sm text-white/55">{target.name}</p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 text-white/40 transition-colors hover:text-white/80"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        onClick={onNavigate}
        className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[#ededed] transition-colors hover:bg-[var(--accent)] hover:text-[#0a0a0a]"
      >
        Pergi ke {target.savyName}
        <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
