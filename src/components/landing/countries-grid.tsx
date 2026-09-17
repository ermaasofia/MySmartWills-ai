'use client';

import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  Globe2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  MapPin,
} from 'lucide-react';

import { CountryFlag } from '@/components/ui/country-flag';
import { Reveal } from './reveal';

// All 12 Countries mapped directly to C1.jpeg through C12.jpeg
const COUNTRIES_12 = [
  {
    code: 'MY',
    name: 'Malaysia',
    image: '/flags/C13.jpeg',
    flagSvg: 'MY',
    language: 'Malay / English',
    jurisdiction: 'Wills Act 1959 / Wasiat',
    featured: true,
  },
  {
    code: 'SG',
    name: 'Singapore',
    image: '/flags/C2.jpeg',
    flagSvg: 'SG',
    language: 'English',
    jurisdiction: 'Wills Act (Cap. 352)',
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    image: '/flags/C3.jpeg',
    flagSvg: 'HK',
    language: 'Chinese / English',
    jurisdiction: 'Wills Ordinance (Cap. 30)',
  },
  {
    code: 'CN',
    name: 'China',
    image: '/flags/C4.jpeg',
    flagSvg: 'CN',
    language: 'Chinese',
    jurisdiction: 'Civil Code Book VI',
  },
  {
    code: 'TW',
    name: 'Taiwan',
    image: '/flags/C5.jpeg',
    flagSvg: 'TW',
    language: 'Chinese',
    jurisdiction: 'Civil Code Part V',
  },
  {
    code: 'ID',
    name: 'Indonesia',
    image: '/flags/C6.jpeg',
    flagSvg: 'ID',
    language: 'Indonesian',
    jurisdiction: 'Civil Code / KHI',
  },
  {
    code: 'TH',
    name: 'Thailand',
    image: '/flags/C7.jpeg',
    flagSvg: 'TH',
    language: 'Thai',
    jurisdiction: 'Civil & Commercial Code',
  },
  {
    code: 'AU',
    name: 'Australia',
    image: '/flags/C8.jpeg',
    flagSvg: 'AU',
    language: 'English',
    jurisdiction: 'Succession Act Framework',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    image: '/flags/C9.jpeg',
    flagSvg: 'NZ',
    language: 'English',
    jurisdiction: 'Wills Act 2007',
  },
  {
    code: 'BN',
    name: 'Brunei',
    image: '/flags/C10.jpeg',
    flagSvg: 'BN',
    language: 'Malay / English',
    jurisdiction: 'Wills Act (Cap. 193)',
  },
  {
    code: 'VN',
    name: 'Vietnam',
    image: '/flags/C11.jpeg',
    flagSvg: 'VN',
    language: 'Vietnamese',
    jurisdiction: 'Civil Code (Succession)',
  },
  {
    code: 'PH',
    name: 'Philippines',
    image: '/flags/C1.jpeg',
    flagSvg: 'PH',
    language: 'Filipino / English',
    jurisdiction: 'Civil Code Book III',
  },
];

export function CountriesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveredRef = useRef(false);

  // 4 sets of 12 items for unbreakable, seamless infinite wrapping
  const extendedCountries = [
    ...COUNTRIES_12,
    ...COUNTRIES_12,
    ...COUNTRIES_12,
    ...COUNTRIES_12,
  ];

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentX = 0;
    const pixelsPerSecond = 44; // Ultra smooth constant speed
    const cardStep = 210; // Tightened spacing so 5 cards are prominently in view across the line
    const oneSetWidth = COUNTRIES_12.length * cardStep;

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHoveredRef.current) {
        // Move smoothly towards the RIGHT
        currentX += pixelsPerSecond * delta;
        if (currentX >= oneSetWidth) {
          currentX -= oneSetWidth;
        }
      }

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const stageCenterX = containerRect.width / 2;
        const totalTrackWidth = extendedCountries.length * cardStep;

        cardRefs.current.forEach((cardEl, idx) => {
          if (!cardEl) return;

          // Compute absolute position along the conveyor
          const initialCardX = idx * cardStep;
          const posAlongTrack = initialCardX + currentX;

          // Wrap seamlessly relative to stage center
          let offsetFromCenter =
            ((posAlongTrack % totalTrackWidth) - totalTrackWidth / 2) %
            totalTrackWidth;
          while (offsetFromCenter < -totalTrackWidth / 2)
            offsetFromCenter += totalTrackWidth;
          while (offsetFromCenter > totalTrackWidth / 2)
            offsetFromCenter -= totalTrackWidth;

          // Normalized distance from center (-1.0 on outer left to +1.0 on outer right)
          const normX = offsetFromCenter / (stageCenterX * 0.82);
          const absNormX = Math.abs(normX);

          /* =========================================================================
             5-CARD CONCAVE 3D AMPHITHEATER ARC:
             - 5 prominent cards visible across the line (-2, -1, 0, +1, +2)
             - Center card (normX ~ 0): Behind Savy, recessed (translateZ ~ -170px, scale ~ 0.84).
             - Inner cards (normX ~ ±0.45): Inward tilt (rotateY ~ ±22deg, translateZ ~ -65px).
             - Outer cards (normX ~ ±0.9): Sharp inward curve (rotateY ~ ±44deg, translateZ ~ +110px).
             - Horizon cards (normX > 1.2): Slicing into foreground (rotateY ~ ±54deg, translateZ ~ +175px).
             ========================================================================= */

          // Progressive inward rotation (facing towards center)
          const rotateY = Math.max(-54, Math.min(54, normX * -44));

          // 3D Depth: center deep (-170px), sides pull forward (+170px)
          const translateZ = Math.pow(Math.min(1.4, absNormX), 1.35) * 310 - 170;

          // Parabolic vertical baseline
          const translateY = (1 - Math.pow(Math.min(1.2, absNormX), 1.5)) * 24;

          // Scale: center 0.84, outer 1.15
          const scale = Math.max(0.82, Math.min(1.16, 0.84 + Math.pow(Math.min(1.3, absNormX), 1.2) * 0.28));

          // Pass-behind opacity: smooth center dimming right behind Savy + outer horizon fade
          let opacity = Math.max(0, 1 - Math.pow(absNormX / 1.6, 4));
          if (absNormX < 0.16) {
            opacity *= 0.12 + (absNormX / 0.16) * 0.88;
          }

          // Z-index: Foreground cards layer above deeper background cards
          const zIndex = Math.round((translateZ + 250) * 10);

          const actualX = stageCenterX + offsetFromCenter - 94; // 94 = half card width (188/2)

          cardEl.style.transform = `translate3d(${actualX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
          cardEl.style.opacity = `${opacity}`;
          cardEl.style.zIndex = `${zIndex}`;
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [extendedCountries.length]);

  return (
    <section
      id="countries"
      className="relative overflow-hidden border-y border-[#eeeeee] bg-[#fafafa] py-14 sm:py-18 lg:py-20"
    >
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[950px] rounded-full bg-gradient-to-tr from-[#a42025]/[0.05] via-[#a42025]/[0.015] to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            HEADER (CENTERED EDITORIAL STYLE)
        ========================================== */}
        <Reveal>
          <div className="mb-6 flex flex-col items-center text-center md:mb-8">
            {/* LABEL */}
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#a42025]/15 bg-[#a42025]/[0.06] px-3.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a42025] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a42025]" />
              </span>

              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#a42025]">
                Multi-Jurisdiction Coverage
              </span>
            </div>

            {/* TITLE */}
            <h2
              className="m-0 font-serif font-medium leading-[1.05] tracking-[-0.035em] text-[#171717]"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
              }}
            >
              Twelve countries.{' '}
              <span className="text-[#a42025]">One assistant.</span>
            </h2>

            {/* SUBTITLE */}
            <p className="mt-3.5 max-w-[560px] text-[14px] leading-[1.65] text-[#666666] sm:text-[15px]">
              Choose your country and SmartWills.ai will adapt the experience
              based on your selected jurisdiction.
            </p>

            {/* LINK BUTTON */}
            <a
              href="/signup"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#a42025] transition-all hover:gap-2.5 hover:text-[#891b1f]"
            >
              <span>AI Legal Engine</span>
              <ArrowRight size={14} strokeWidth={2.2} />
            </a>
          </div>
        </Reveal>

        {/* ==========================================
            FEATURED MALAYSIA BAR (BELOW DESCRIPTION)
        ========================================== */}
        <Reveal delay={60}>
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-[16px] border border-[#a42025]/20 bg-[#a42025]/[0.04] p-4.5 shadow-[0_6px_25px_rgba(164,32,37,0.04)] sm:flex-row sm:items-center sm:px-6 sm:py-4">
            <div className="flex items-center gap-3.5">
              {/* FLAG */}
              <div className="flex h-11 w-14 items-center justify-center rounded-[10px] border border-[#a42025]/15 bg-white shadow-sm">
                <CountryFlag
                  code="MY"
                  name="Malaysia"
                  className="h-6 w-9 rounded-[2px] object-cover"
                />
              </div>

              {/* TEXT */}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="m-0 text-[16px] font-bold text-[#1f1f1f]">
                    Malaysia
                  </h3>

                  <span className="rounded-full bg-[#a42025] px-2.5 py-0.5 text-[8.5px] font-bold tracking-wider text-white uppercase shadow-sm">
                    Available
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-[#666666]">
                  <MapPin
                    size={13}
                    strokeWidth={1.8}
                    className="text-[#a42025]"
                  />
                  Malaysia • MY
                </div>
              </div>
            </div>

            {/* CTA BUTTON */}
            <a
              href="/signup?country=my"
              className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-[#a42025] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_6px_18px_rgba(164,32,37,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#891b1f] hover:shadow-[0_8px_22px_rgba(164,32,37,0.32)]"
            >
              Start with Malaysia
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>

      {/* ==========================================
          STAGE: 3D CONCAVE ARC + CENTER FOREGROUND SAVY
      ========================================== */}
      <div
        ref={containerRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onTouchStart={() => {
          isHoveredRef.current = true;
        }}
        onTouchEnd={() => {
          isHoveredRef.current = false;
        }}
        className="sw-3d-amphitheater-stage relative my-2 h-[370px] w-full overflow-hidden select-none sm:h-[400px] lg:h-[430px]"
      >
        {/* Soft edge gradient masks for horizon blending */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-30 w-12 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/80 to-transparent sm:w-24 lg:w-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 right-0 z-30 w-12 bg-gradient-to-l from-[#fafafa] via-[#fafafa]/80 to-transparent sm:w-24 lg:w-40"
        />

        {/* Ambient floor glow beneath the amphitheater arc */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-0 h-36 w-3/4 max-w-[700px] rounded-full bg-gradient-to-t from-[#a42025]/15 via-[#a42025]/[0.04] to-transparent blur-3xl"
        />

        {/* 3D Background Carousel Track (z-index 10) */}
        <div className="sw-3d-amphitheater-track absolute inset-0 h-full w-full">
          {extendedCountries.map((country, idx) => {
            const isHighlighted = country.featured;

            return (
              <div
                key={`${country.code}-${idx}`}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="sw-amphitheater-card absolute top-1/2 left-0 -mt-[135px] h-[270px] w-[188px] sm:-mt-[145px] sm:h-[285px] sm:w-[196px]"
              >
                <a
                  href={`/signup?country=${country.code.toLowerCase()}`}
                  className={`
                    group/card relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[18px] border bg-[#121216]
                    shadow-[0_14px_38px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out
                    ${isHighlighted
                      ? 'border-[#a42025]/75 ring-2 ring-[#a42025]/40 hover:border-[#a42025] hover:shadow-[0_22px_55px_rgba(164,32,37,0.5)]'
                      : 'border-white/15 hover:border-[#a42025]/70 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]'
                    }
                    hover:-translate-y-3 hover:scale-[1.05] hover:ring-2 hover:ring-[#a42025]/50
                  `}
                >
                  {/* Full-bleed Country Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={country.image}
                    alt={country.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/20 transition-opacity duration-300 group-hover/card:opacity-90" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between p-3 sm:p-3.5">
                    {/* Flag Pill */}
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 backdrop-blur-md transition-colors group-hover/card:border-white/40">
                      <CountryFlag
                        code={country.flagSvg}
                        name={country.name}
                        className="h-3 w-4.5 rounded-[2px] object-cover shadow-sm"
                      />
                      <span className="text-[10px] font-bold tracking-wider text-white">
                        {country.code}
                      </span>
                    </div>

                    {isHighlighted ? (
                      <span className="flex items-center gap-1 rounded-full bg-[#a42025] px-2 py-0.5 text-[8.5px] font-bold tracking-wider text-white uppercase shadow-md">
                        <CheckCircle2 size={10} strokeWidth={2.5} />
                        Featured
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[8.5px] font-medium tracking-wide text-white/90 backdrop-blur-md">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Bottom Metadata */}
                  <div className="relative z-10 mt-auto flex flex-col justify-end p-3 sm:p-3.5">
                    {/* Country Name */}
                    <h3 className="m-0 text-[15px] font-bold tracking-tight text-white drop-shadow-sm transition-colors group-hover/card:text-[#ff6b6b] sm:text-[16px] lg:text-[17px]">
                      {country.name}
                    </h3>

                    {/* Language */}
                    <p className="mt-0.5 text-[10.5px] font-medium text-white/75">
                      {country.language}
                    </p>

                    {/* Legal Framework Tag */}
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] px-2 py-1 backdrop-blur-md transition-colors group-hover/card:border-[#a42025]/50 group-hover/card:bg-black/60">
                      <span className="line-clamp-1 font-mono text-[9.5px] text-white/85">
                        {country.jurisdiction}
                      </span>
                      <ExternalLink
                        size={11}
                        className="shrink-0 text-white/60 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-white"
                      />
                    </div>
                  </div>

                  {/* Bottom Glowing Accent Line */}
                  <div
                    className={`
                      absolute bottom-0 left-0 h-[2.5px] transition-all duration-300
                      ${isHighlighted
                        ? 'w-full bg-[#a42025] shadow-[0_0_10px_#a42025]'
                        : 'w-0 bg-[#a42025] group-hover/card:w-full group-hover/card:shadow-[0_0_8px_#a42025]'
                      }
                    `}
                  />
                </a>
              </div>
            );
          })}
        </div>

        {/* ==========================================
            FOREGROUND CENTERED SAVY CHARACTER (Z-INDEX 20)
            Seamless Horizontal Edge-Dissolve Gradient Mask (No Sharp Borders)
        ========================================== */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center select-none"
        >
          {/* Background Scrim Container with Wider Horizontal Edge-Fade Mask */}
          <div
            className="relative flex h-[380px] w-[460px] sm:h-[410px] sm:w-[540px] lg:h-[440px] lg:w-[620px] flex-col items-center justify-center"
            style={{
              backgroundColor: '#fafafa',
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.4) 10%, black 25%, black 75%, rgba(0, 0, 0, 0.4) 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.4) 10%, black 25%, black 75%, rgba(0, 0, 0, 0.4) 90%, transparent 100%)',
            }}
          >
            {/* Savy Character Video Centered */}
            <div className="relative flex flex-col items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="sw-savy-video pointer-events-none max-h-[260px] w-auto object-contain sm:max-h-[285px] lg:max-h-[310px]"
                style={{
                  pointerEvents: 'none',
                  mixBlendMode: 'multiply',
                  backgroundColor: 'transparent',
                  filter: 'contrast(1.12) brightness(1.04)',
                }}
              >
                <source src="/flags/savy_vd.webm" type="video/webm" />
                <source src="/flags/vdsavy.mp4" type="video/mp4" />
                <source src="/flags/savy_vd.mp4" type="video/mp4" />
                <source src="/savy-my.mp4" type="video/mp4" />
                {/* Fallback image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/flags/savy_vd.png"
                  alt="Savy AI Assistant"
                  className="max-h-[260px] w-auto object-contain sm:max-h-[285px] lg:max-h-[310px]"
                  style={{ mixBlendMode: 'multiply', backgroundColor: 'transparent' }}
                />
              </video>

              {/* Soft contact ground shadow beneath Savy */}
              <div
                aria-hidden="true"
                className="absolute -bottom-1 h-3.5 w-36 rounded-full bg-black/15 blur-md sm:w-44 sm:blur-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM CALLOUT BAR
      ========================================== */}
      <div className="mx-auto mt-4 max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <Reveal delay={120}>
          <div className="flex flex-col items-start justify-between gap-4 rounded-[14px] border border-[#e8e8e8] bg-white p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:px-5 sm:py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#a42025]/[0.08] text-[#a42025]">
                <Globe2 size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="m-0 text-[12.5px] font-semibold text-[#1e1e1e]">
                  Need a specific cross-border or foreign jurisdiction?
                </p>
                <p className="mt-0.5 text-[10.5px] text-[#787878]">
                  SmartWills.ai supports multi-jurisdiction estate planning and Commonwealth reciprocal enforcement.
                </p>
              </div>
            </div>

            <a
              href="#feedback-faq"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#e0e0e0] bg-[#fafafa] px-3 py-1.5 text-[10.5px] font-semibold text-[#333333] transition-all hover:border-[#a42025]/30 hover:bg-[#a42025]/[0.06] hover:text-[#a42025]"
            >
              Explore Jurisdiction FAQs
              <ArrowRight size={12} strokeWidth={1.8} />
            </a>
          </div>
        </Reveal>
      </div>

      {/* ==========================================
          SCOPED STYLES: 3D AMPHITHEATER CONCAVE STAGE
      ========================================== */}
      <style>{`
        .sw-3d-amphitheater-stage {
          perspective: 880px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
        }

        .sw-3d-amphitheater-track {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .sw-amphitheater-card {
          transform-style: preserve-3d;
          will-change: transform, opacity;
          pointer-events: auto;
        }

        .sw-savy-video {
          mix-blend-mode: multiply !important;
          background-color: transparent !important;
          pointer-events: none !important;
          filter: contrast(1.12) brightness(1.04) !important;
          -webkit-filter: contrast(1.12) brightness(1.04) !important;
          will-change: filter, transform;
        }
      `}</style>
    </section>
  );
}
