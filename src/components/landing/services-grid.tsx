import { Reveal } from './reveal';

const SERVICES = [
  {
    k: 'guidance',
    t: 'Will guidance',
    d: 'Jurisdiction-aware answers to anything — executors, beneficiaries, witness rules, probate. As many turns as you need.',
    p: 'free',
  },
  {
    k: 'prep_export',
    t: 'Lawyer prep export',
    d: 'A structured prep sheet you can hand your solicitor. Less billable time. Better questions.',
    p: 'free',
  },
  {
    k: 'handoff',
    t: 'Ecosystem handoff',
    d: "When you're ready to draft, seamless pass to smartwills.com.my, .sg, .hk or WasiatKu — no re-entry.",
    p: 'integrated',
  },
] as const;

export function ServicesGrid() {
  return (
    <section id="services" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <div className="mb-12 max-w-[700px]">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // SERVICES
            </div>
            <h2
              className="m-0 font-medium leading-[1.05]"
              style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
            >
              Three surfaces. One workflow.
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.k} delay={i * 80}>
              <div className="flex h-full flex-col rounded-[10px] border border-[var(--border)] bg-white/[0.02] p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--accent)]">.{s.k}</div>
                  <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[1px] text-white/45">
                    {s.p}
                  </span>
                </div>
                <div
                  className="mb-2.5 text-[20px] font-medium"
                  style={{ letterSpacing: '-0.2px' }}
                >
                  {s.t}
                </div>
                <div className="flex-1 text-[13px] leading-[1.55] text-white/60">{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
