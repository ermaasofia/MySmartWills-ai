import Link from 'next/link';
import { Reveal } from './reveal';
import { ApacGlobe } from './apac-globe';

const STATS = [
  ['12', 'countries'],
  ['100%', 'private'],
  ['24/7', 'available'],
  ['Free', 'to use'],
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, var(--accent-soft) 0%, transparent 50%), radial-gradient(ellipse at 0% 60%, rgba(255,255,255,0.04) 0%, transparent 50%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-16 pb-20 sm:px-6 lg:grid-cols-[1fr_560px] lg:gap-20 lg:px-8 lg:py-20 lg:pb-[120px]">
        <div>
          <Reveal>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-[5px] text-[12px] text-white/70">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)',
                }}
              />
              <span>Now helping families in Australia</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="m-0 font-medium leading-[1.02]"
              style={{
                fontSize: 'clamp(44px, 5.2vw, 72px)',
                letterSpacing: '-0.035em',
              }}
            >
              Plan your will,<br />
              <span style={{ color: 'var(--accent)' }}>protect</span> your family.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-[500px] text-[17px] leading-[1.55] text-white/65">
              Ask anything about your will, your family&apos;s inheritance, or
              what happens to your home and savings. Get clear answers based
              on your country&apos;s laws — no legal jargon, no appointments.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-2.5">
              <Link
                href="/signup"
                className="rounded-[8px] bg-[#ededed] px-[18px] py-3 text-sm font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                Start for free →
              </Link>
              <Link
                href="#how"
                className="rounded-[8px] border border-[var(--border)] bg-white/[0.04] px-[18px] py-3 text-sm font-medium text-[#ededed] transition-colors hover:bg-white/[0.06]"
              >
                See how it works
              </Link>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[12px] text-white/55 sm:gap-8">
              {STATS.map(([k, v]) => (
                <div key={k}>
                  <span className="block text-[18px] font-medium text-[#ededed]">
                    {k}
                  </span>
                  {v}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <ApacGlobe />
        </Reveal>
      </div>
    </section>
  );
}
