import { Reveal } from './reveal';

const STATS = [
  ['12', 'countries'],
  ['5', 'trusted platforms'],
  ['100%', 'private'],
] as const;

export function AboutSection() {
  return (
    <section id="about" className="border-t border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-8 lg:py-[100px]">
        <Reveal>
          <div>
            <div className="mb-5 text-[13px] uppercase tracking-[2px] text-[var(--accent)]">
              About us
            </div>
            <h2
              className="m-0 font-medium leading-[1.05]"
              style={{ fontSize: 'clamp(28px, 4.4vw, 40px)', letterSpacing: '-0.025em' }}
            >
              Part of the<br />SmartWills family.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <p className="m-0 text-[19px] leading-[1.55] text-white/75">
              SmartWills.ai is where your will journey begins. We&apos;re part of
              a trusted family of will services helping people across Asia plan
              for what matters most. Our assistant speaks in plain language,
              follows your country&apos;s laws, and when you&apos;re ready to
              write your will, we&apos;ll guide you to the right place.
            </p>
            <div className="mt-9 grid grid-cols-3 gap-2 sm:gap-3">
              {STATS.map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-[10px] border border-[var(--border)] bg-[#0a0a0a] p-3 sm:p-5"
                >
                  <div
                    className="text-[25px] font-medium text-[var(--accent)] sm:text-[28px]"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {k}
                  </div>
                  <div className="mt-1 text-[13px] uppercase tracking-[1.5px] text-white/55 sm:text-[14px]">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
