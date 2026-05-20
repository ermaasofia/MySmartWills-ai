import { COUNTRIES } from '@/lib/constants';
import { Reveal } from './reveal';
import { CountryFlag } from '@/components/ui/country-flag';

export function CountriesGrid() {
  return (
    <section id="countries" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <div className="mb-12 max-w-[700px]">
            <div className="mb-5 text-[13px] uppercase tracking-[2px] text-[var(--accent)]">
              Countries we cover
            </div>
            <h2
              className="m-0 font-medium leading-[1.05]"
              style={{ fontSize: 'clamp(30px, 4.8vw, 44px)', letterSpacing: '-0.025em' }}
            >
              Twelve countries.<br />One assistant.
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-[10px] border border-[var(--border)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map((c, i) => (
            <Reveal key={c.code} delay={i * 30}>
              <div className="flex flex-col gap-1 border-r border-b border-[var(--border)] p-5 last:border-r-0">
                <CountryFlag code={c.code} name={c.name} className="h-7 w-10 object-cover" />
                <div className="mt-1 text-base font-medium">{c.name}</div>
                <div className="text-[13px] text-white/45">{c.language}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
