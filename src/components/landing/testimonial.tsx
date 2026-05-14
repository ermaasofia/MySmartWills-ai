import { Reveal } from './reveal';
import { PhotoSlot } from './photo-slot';

export function Testimonial() {
  return (
    <section className="mx-auto max-w-[1280px] px-8 py-[120px]">
      <Reveal>
        <div className="grid grid-cols-1 items-center gap-12 rounded-[14px] border border-[var(--border)] bg-white/[0.02] p-12 md:grid-cols-[1fr_240px]">
          <div>
            <div className="mb-4 text-[11px] uppercase tracking-[2px] text-[var(--accent)]">
              A customer story
            </div>
            <div
              className="text-[26px] font-normal leading-[1.4]"
              style={{ letterSpacing: '-0.01em' }}
            >
              &ldquo;The answers were specific to Hong Kong — not generic
              advice. When I eventually met with my lawyer, I already knew
              the right questions to ask.&rdquo;
            </div>
            <div className="mt-6 text-sm text-white/65">
              <strong className="text-[#ededed]">Mei Yin C.</strong> · Hong Kong
            </div>
          </div>
          <PhotoSlot
            label="family · hong kong"
            ratio="1 / 1"
            className="rounded-[10px]"
          />
        </div>
      </Reveal>
    </section>
  );
}
