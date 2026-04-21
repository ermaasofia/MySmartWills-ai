import { Reveal } from './reveal';

const FEATURES = [
  { k: 'jurisdiction', t: 'Country-aware', d: 'Auto-indexes to local statute the moment you pick your country. 12 supported today.' },
  { k: 'privacy', t: 'End-to-end encrypted', d: 'Your conversations never leave your account. We never train on your data.' },
  { k: 'faraid', t: 'Faraid-ready', d: 'For Muslim users, we handle Wasiat requirements alongside conventional wills.' },
  { k: 'executors', t: 'Executor workflows', d: 'Walk through executor selection, witness rules, and beneficiary designations.' },
  { k: 'revisit', t: 'Stateful history', d: 'Your estate plan evolves as life does. Come back and pick up where you left off.' },
  { k: 'handoff', t: 'Lawyer-ready output', d: 'Export a prep document to hand your solicitor so you only pay for the work that matters.' },
] as const;

export function FeaturesMatrix() {
  return (
    <section id="features" className="mx-auto max-w-[1280px] px-8 py-[120px]">
      <div className="grid grid-cols-1 gap-15 lg:grid-cols-[300px_1fr] lg:gap-[60px]">
        <Reveal>
          <div className="lg:sticky lg:top-[100px]">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // FEATURES
            </div>
            <h2
              className="m-0 text-[44px] font-medium leading-[1.05]"
              style={{ letterSpacing: '-0.025em' }}
            >
              Engineered for<br />legal precision.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.55] text-white/60">
              Every answer is grounded in a specific country&apos;s statute. We cite. We disclaim. We don&apos;t guess.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 overflow-hidden rounded-[10px] border border-[var(--border)] sm:grid-cols-2">
          {FEATURES.map((f, i) => {
            const isRightCol = (i + 1) % 2 === 0;
            const isLastRow = i >= 4;
            return (
              <Reveal key={f.k} delay={i * 50}>
                <div
                  className="min-h-[180px] p-7"
                  style={{
                    borderRight: !isRightCol ? '1px solid var(--border)' : undefined,
                    borderBottom: !isLastRow ? '1px solid var(--border)' : undefined,
                  }}
                >
                  <div className="mb-3.5 font-mono text-[11px] text-[var(--accent)]">
                    .{f.k}
                  </div>
                  <div className="mb-2 text-[17px] font-medium">{f.t}</div>
                  <div className="text-[13px] leading-[1.55] text-white/60">{f.d}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
