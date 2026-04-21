import { COUNTRIES } from '@/lib/constants';
import { Reveal } from './reveal';

export function CountriesGrid() {
  return (
    <section id="countries" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1280px] px-8 py-[120px]">
        <Reveal>
          <div className="mb-12 max-w-[700px]">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // JURISDICTIONS
            </div>
            <h2
              className="m-0 text-[44px] font-medium leading-[1.05]"
              style={{ letterSpacing: '-0.025em' }}
            >
              Twelve countries.<br />One assistant.
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-[10px] border border-[var(--border)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map((c, i) => (
            <Reveal key={c.code} delay={i * 30}>
              <div className="flex flex-col gap-1 border-r border-b border-[var(--border)] p-5 last:border-r-0">
                <span className="text-[28px]">{c.flag}</span>
                <div className="mt-1 text-sm font-medium">{c.name}</div>
                <div className="font-mono text-[11px] text-white/45">{c.locale}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
