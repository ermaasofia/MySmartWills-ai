import { Reveal } from './reveal';

const FEATURES = [
  { k: '01', t: 'Knows your country', d: 'Pick where you live, and we’ll guide you using the laws that apply to your family. 12 countries supported.' },
  { k: '02', t: 'Private and secure', d: 'Your conversations stay between you and us. We will never share or sell your data.' },
  { k: '03', t: 'Wasiat and Faraid', d: 'For Muslim families, we help with Wasiat and Faraid alongside regular will planning.' },
  { k: '04', t: 'The hard parts, simplified', d: 'We’ll walk you through choosing executors, witnesses, and who inherits what — step by step.' },
  { k: '05', t: 'Comes back when you do', d: 'Life changes, and your plan can too. Come back any time and pick up where you left off.' },
  { k: '06', t: 'Ready for your lawyer', d: 'Walk into your lawyer’s office prepared. Bring a clear summary so they focus on what matters most.' },
] as const;

export function FeaturesMatrix() {
  return (
    <section id="features" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
      <div className="grid grid-cols-1 gap-15 lg:grid-cols-[300px_1fr] lg:gap-[60px]">
        <Reveal>
          <div className="lg:sticky lg:top-[100px]">
            <div className="mb-5 text-[13px] uppercase tracking-[2px] text-[var(--accent)]">
              What we do
            </div>
            <h2
              className="m-0 font-medium leading-[1.05]"
              style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
            >
              Made to look after<br />the people you love.
            </h2>
            <p className="mt-5 text-[17px] leading-[1.55] text-white/60">
              Every answer is based on your country&apos;s laws. We&apos;re honest about what we know &mdash; and what needs a lawyer&apos;s eye.
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
                  <div className="mb-3.5 text-[13px] tracking-[2px] text-[var(--accent)]">
                    {f.k}
                  </div>
                  <div className="mb-2 text-[19px] font-medium">{f.t}</div>
                  <div className="text-[15px] leading-[1.55] text-white/60">{f.d}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
