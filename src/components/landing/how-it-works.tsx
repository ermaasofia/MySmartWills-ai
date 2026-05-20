import { Reveal } from './reveal';

const STEPS = [
  {
    n: '01',
    t: 'Pick your country',
    d: 'We’ll set up the conversation using the rules and laws where you live.',
    hint: 'Malaysia, Singapore, Australia — and 9 more',
  },
  {
    n: '02',
    t: 'Tell us about your family',
    d: 'Share your situation in your own words. We’ll ask the right follow-ups — no legal language needed.',
    hint: 'Married, two kids, own a home? Just say so',
  },
  {
    n: '03',
    t: 'Walk away with a plan',
    d: 'Take a clear summary to your lawyer, or write your will directly on one of our trusted platforms.',
    hint: 'A summary you can use anywhere',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <div className="mb-5 text-[13px] uppercase tracking-[2px] text-[var(--accent)]">
            How it works
          </div>
          <h2
            className="m-0 max-w-[700px] font-medium leading-[1.05]"
            style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
          >
            Three steps. One afternoon.<br />Your family, looked after.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative min-h-[240px] rounded-[10px] border border-[var(--border)] bg-[#0a0a0a] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-[14px] uppercase tracking-[2px] text-white/45">Step {s.n}</div>
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </div>
                <div
                  className="mb-2.5 text-[23px] font-medium"
                  style={{ letterSpacing: '-0.2px' }}
                >
                  {s.t}
                </div>
                <div className="mb-5 text-[15px] leading-[1.55] text-white/60">{s.d}</div>
                <div className="rounded-[5px] bg-white/[0.03] px-3 py-2 text-[14px] italic text-white/55">
                  {s.hint}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
