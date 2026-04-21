'use client';

import { useEffect, useState } from 'react';
import { COUNTRIES } from '@/lib/constants';

const BOT_MESSAGES: Record<string, string> = {
  MY: "Under Malaysia's Wills Act 1959, you must be at least 18 and of sound mind. Two witnesses — neither of whom is a beneficiary — must sign in your presence. If you're Muslim, Wasiat rules apply alongside Faraid.",
  SG: "Under Singapore's Wills Act 1838, you must be at least 21 and of sound mind. Two independent witnesses — neither of whom is a beneficiary — must sign in your presence. I'll walk you through each requirement.",
  HK: "Under Hong Kong's Wills Ordinance (Cap. 30), you must be 18+ and of sound mind. Two witnesses must be present at the same time and sign in your presence. Beneficiaries cannot be witnesses.",
  CN: "China's Civil Code (Part VI) recognises notarised, holographic, and witnessed wills. For witnessed wills you need two unrelated, disinterested witnesses present throughout signing.",
  TW: "Taiwan recognises five will types under the Civil Code. The most common — holographic — must be entirely handwritten, dated, and signed by you. No witnesses needed.",
  ID: "Indonesia recognises notarial wills (akta wasiat) drawn up before a notary with two witnesses, plus closed (sealed) and holographic forms under the KUHPerdata.",
} as const;

const CHIP_COUNTRIES = COUNTRIES.slice(0, 6);

export function LiveChatCard() {
  const [country, setCountry] = useState('SG');
  const [typedIndex, setTypedIndex] = useState(0);
  const activeCountry = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
  const botMessage = BOT_MESSAGES[country] ?? BOT_MESSAGES.SG;

  useEffect(() => {
    setTypedIndex(0);
  }, [country]);

  useEffect(() => {
    const id = setInterval(() => {
      setTypedIndex((i) => (i >= botMessage.length ? i : i + 2));
    }, 18);
    return () => clearInterval(id);
  }, [botMessage]);

  return (
    <div
      className="overflow-hidden rounded-[14px] border border-[var(--border)] backdrop-blur-xl"
      style={{
        background: 'var(--surface)',
        boxShadow:
          '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* chat header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}
          />
          <span className="font-mono text-[12px] text-white/70">smartwills.ai/chat</span>
        </div>
        <div className="flex gap-1">
          {CHIP_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setCountry(c.code)}
              className="h-6 w-6 cursor-pointer rounded-[4px] border-0 text-[14px] transition-all"
              style={{
                background:
                  country === c.code ? 'rgba(255,255,255,0.12)' : 'transparent',
                filter:
                  country === c.code ? 'none' : 'grayscale(0.7) opacity(0.6)',
              }}
              aria-label={c.name}
            >
              {c.flag}
            </button>
          ))}
        </div>
      </div>

      {/* messages */}
      <div className="flex min-h-[380px] flex-col gap-3.5 p-5">
        <div className="font-mono text-[11px] tracking-[0.5px] text-white/40">
          ● jurisdiction_set {activeCountry.code} · {activeCountry.name} {activeCountry.flag}
        </div>
        <div
          className="self-end rounded-[12px_12px_2px_12px] px-3.5 py-2.5 text-sm leading-[1.4]"
          style={{
            maxWidth: '85%',
            background: 'var(--accent)',
            color: '#0a0a0a',
          }}
        >
          I&apos;m 34, married, one kid. What do I need to sign a valid will here?
        </div>
        <div className="flex max-w-[90%] gap-2.5 self-start">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] font-mono text-[10px] font-bold text-[#0a0a0a]"
            style={{ background: 'linear-gradient(135deg, var(--accent), #ededed)' }}
          >
            sw
          </div>
          <div
            className="rounded-[12px_12px_12px_2px] border border-[var(--border)] bg-white/[0.05] px-3.5 py-2.5 text-sm leading-[1.5] text-white/85"
          >
            {botMessage.slice(0, typedIndex)}
            {typedIndex < botMessage.length && (
              <span
                className="ml-0.5 inline-block h-3.5 w-[7px] align-middle"
                style={{
                  background: 'var(--accent)',
                  animation: 'sw-blink 0.8s infinite',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* input */}
      <div className="flex items-center gap-2.5 border-t border-[var(--border)] p-3">
        <span className="font-mono text-[12px] text-white/35">›</span>
        <input
          placeholder="Ask about executors, beneficiaries, probate…"
          className="flex-1 border-0 bg-transparent text-sm text-[#ededed] outline-none"
        />
        <div className="rounded-[4px] border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-white/35">
          ⏎
        </div>
      </div>
    </div>
  );
}
