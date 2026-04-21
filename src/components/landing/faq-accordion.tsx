'use client';

import { useState } from 'react';
import { Reveal } from './reveal';

const FAQ = [
  {
    q: 'Is the guidance considered legal advice?',
    a: "No. SmartWills.ai provides general information. For binding legal advice, consult a qualified solicitor — we'll generate a prep sheet to take to them.",
  },
  {
    q: 'Which countries are supported?',
    a: 'Malaysia, Singapore, Hong Kong, China, Taiwan, Indonesia, Thailand, Australia, New Zealand, Brunei, Vietnam, Philippines. Switch anytime.',
  },
  {
    q: 'Is my conversation private and secure?',
    a: 'Yes. End-to-end encrypted. We never sell your data, share with third parties, or train on your conversations.',
  },
  {
    q: 'Can I use SmartWills for Islamic wills (Wasiat)?',
    a: 'Yes. For Malaysian Muslim users, the assistant handles Wasiat and Faraid. For document drafting we hand off to WasiatKu (wasiatku.com.my).',
  },
  {
    q: 'Is SmartWills free?',
    a: 'The AI assistant is free. Drafting the actual document happens on ecosystem platforms (smartwills.com.my/.sg/.hk or MySmartWills), each with its own pricing.',
  },
  {
    q: 'What happens to my conversation history?',
    a: 'Saved under your account so you can revisit your plan as life changes. Delete anytime.',
  },
] as const;

export function FaqAccordion() {
  return (
    <section id="faq" className="border-t border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto max-w-[960px] px-8 py-[120px]">
        <Reveal>
          <div className="mb-12">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // FAQ
            </div>
            <h2
              className="m-0 text-[44px] font-medium leading-[1.05]"
              style={{ letterSpacing: '-0.025em' }}
            >
              Honest answers<br />before you begin.
            </h2>
          </div>
        </Reveal>
        <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} last={i === FAQ.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, last }: { q: string; a: string; last: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-6 py-5 text-left text-[#ededed]"
      >
        <span className="text-base font-medium">
          <span className="mr-3 font-mono text-[11px] text-[var(--accent)]">Q</span>
          {q}
        </span>
        <span
          className="font-mono text-sm transition-transform duration-200"
          style={{
            color: open ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 240 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height 280ms cubic-bezier(.2,.7,.2,1), opacity 200ms',
        }}
      >
        <p className="m-0 px-6 pb-6 pl-12 text-sm leading-[1.6] text-white/65">{a}</p>
      </div>
    </div>
  );
}
