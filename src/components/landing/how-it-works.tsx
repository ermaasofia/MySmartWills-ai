import { Reveal } from './reveal';

const STEPS = [
  {
    n: '01',
    t: 'Pick a jurisdiction',
    d: "The assistant reloads with your country's probate rules, witness requirements and inheritance defaults.",
    code: 'jurisdiction → SG',
  },
  {
    n: '02',
    t: 'Ask in plain English',
    d: "Describe your situation. We'll ask follow-ups. No legal vocabulary required.",
    code: 'input → "married, 1 kid, HDB flat"',
  },
  {
    n: '03',
    t: 'Leave with a plan',
    d: 'Export a prep sheet for your solicitor — or use it to write your own will on smartwills.com.sg.',
    code: 'output → prep.pdf',
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
            // FLOW
          </div>
          <h2
            className="m-0 max-w-[700px] font-medium leading-[1.05]"
            style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
          >
            Three steps. One afternoon. Your estate sorted.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative min-h-[240px] rounded-[10px] border border-[var(--border)] bg-[#0a0a0a] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="font-mono text-[12px] text-white/45">step_{s.n}</div>
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </div>
                <div
                  className="mb-2.5 text-[20px] font-medium"
                  style={{ letterSpacing: '-0.2px' }}
                >
                  {s.t}
                </div>
                <div className="mb-5 text-[13px] leading-[1.55] text-white/60">{s.d}</div>
                <div className="rounded-[5px] border border-[var(--border)] bg-white/[0.03] px-2.5 py-2 font-mono text-[11px] text-white/70">
                  {s.code}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
