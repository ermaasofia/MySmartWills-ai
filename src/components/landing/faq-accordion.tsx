'use client';

import { useState } from 'react';
import { Reveal } from './reveal';

const FAQ = [
  {
    q: 'Is the guidance considered legal advice?',
    a: "No. SmartWills.ai gives you general information to help you understand your options. For binding legal advice, please speak with a qualified lawyer — we'll prepare a clear summary you can bring to them.",
  },
  {
    q: 'Which countries are supported?',
    a: 'Malaysia, Singapore, Hong Kong, China, Taiwan, Indonesia, Thailand, Australia, New Zealand, Brunei, Vietnam, Philippines. Switch anytime.',
  },
  {
    q: 'Is my conversation private and secure?',
    a: 'Yes. Your conversations stay private and secure. We will never sell your data, share it with third parties, or use it to train our AI.',
  },
  {
    q: 'Can I use SmartWills for Islamic wills (Wasiat)?',
    a: 'Yes. For Malaysian Muslim families, our assistant helps with Wasiat and Faraid. When you’re ready to draft the document, we’ll guide you to WasiatKu (wasiatku.com.my).',
  },
  {
    q: 'Is SmartWills free?',
    a: 'Yes — the AI assistant is completely free to use. Writing the actual will document happens on our trusted platforms (smartwills.com.my, .sg, .hk, or MySmartWills), each with its own pricing.',
  },
  {
    q: 'What happens to my conversation history?',
    a: 'Your conversations are saved in your account so you can come back any time as life changes. You can delete them whenever you want.',
  },
] as const;

export function FaqAccordion() {
  return (
    <section id="faq" className="border-t border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <div className="mb-12">
            <div className="mb-5 text-[11px] uppercase tracking-[2px] text-[var(--accent)]">
              Common questions
            </div>
            <h2
              className="m-0 font-medium leading-[1.05]"
              style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
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
        <span className="text-base font-medium">{q}</span>
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
