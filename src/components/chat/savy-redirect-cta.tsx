'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SavyCountry } from '@/lib/constants';

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
      className="mt-3 ml-0 max-w-[85%] rounded-lg border border-border bg-muted/50 p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">
            {target.flag} Mungkin {target.savyName} lebih sesuai?
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{target.name}</p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigate}
        className="mt-2.5 h-7 text-xs gap-1.5"
      >
        Pergi ke {target.savyName}
        <ArrowRight className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}
