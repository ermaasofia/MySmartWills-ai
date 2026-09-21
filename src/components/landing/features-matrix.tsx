'use client';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe2,
  LockKeyhole,
  HeartHandshake,
  FileCheck2,
  Bot,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  Shield,
} from 'lucide-react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function FeaturesMatrix() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [activeBatch, setActiveBatch] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !boardRef.current) return;

      const tileElements = gsap.utils.toArray<HTMLElement>('.board-tile');
      if (!tileElements.length) return;

      // Curated balanced shuffle for a symmetric 3-step reveal across the board
      const curatedOrder = [
        0, 3, 8, 11,   // Step 1: 4 outer corner cards (01, 02, 03, 04)
        1, 2, 9, 10,   // Step 2: Top & bottom inner icons (Global Laws, 256-Bit AES, Court Ready, Zero Jargon)
        4, 5, 6, 7,    // Step 3: Center row flanks (Family First, 15 Mins, Legal Will, AI Copilot)
      ];

      // Reorder tiles according to curated balanced shuffle
      const orderedTiles = curatedOrder.map((idx) => tileElements[idx]).filter(Boolean);
      const remainingTiles = tileElements.filter((t) => !orderedTiles.includes(t));
      const allShuffled = [...orderedTiles, ...remainingTiles];

      const batchSize = 4;
      const batches: HTMLElement[][] = [];
      for (let i = 0; i < allShuffled.length; i += batchSize) {
        batches.push(allShuffled.slice(i, i + batchSize));
      }

      // Initial State: Center badge is visible. All outer tiles start hidden in 3D perspective
      tileElements.forEach((el, i) => {
        gsap.set(el, {
          opacity: 0,
          scale: 0.58,
          rotateY: i % 2 === 0 ? 80 : -80,
          rotateX: i % 3 === 0 ? 35 : -35,
          transformPerspective: 900,
          transformOrigin: '50% 50% -40px',
        });
      });

      // Pinned timeline driving step-by-step batch reveals
      const totalScrollDistance = batches.length * 450;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(
              batches.length,
              Math.floor(self.progress * (batches.length + 0.3))
            );
            setActiveBatch(step);
          },
        },
      });

      // Step-by-Step Batch Reveal (4 tiles per scroll tick)
      batches.forEach((batch, bIndex) => {
        tl.to(
          batch,
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'back.out(1.7)',
          },
          bIndex === 0 ? '+=0.15' : '+=0.35'
        );
      });

      // Brief hold so user enjoys the complete board before smooth unpinning
      tl.to({}, { duration: 0.5 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-what-we-do"
      className="relative w-full h-screen min-h-[720px] max-h-[1020px] bg-[#050508] text-white flex flex-col justify-center items-center py-6 md:py-8 overflow-hidden select-none"
    >
      {/* Background Space Ambience */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(210, 25, 45, 0.1) 0%, rgba(130, 10, 20, 0.04) 40%, transparent 70%)',
        }}
      />
      <span className="pointer-events-none absolute left-[10%] top-[25%] h-1 w-1 rounded-full bg-white opacity-60 animate-pulse" />
      <span className="pointer-events-none absolute right-[15%] top-[15%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_8px_#ff3b47] animate-pulse" />
      <span className="pointer-events-none absolute right-[30%] bottom-[20%] h-1 w-1 rounded-full bg-white opacity-40" />
      <span className="pointer-events-none absolute left-[20%] bottom-[15%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_10px_#ff3b47]" />

      {/* Header */}
      <div className="relative z-10 text-center px-4 mb-4 md:mb-6 flex-shrink-0">
        <span className="text-xs font-bold tracking-widest text-[#ff3847] uppercase inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#d11a2a]/10 border border-[#d11a2a]/25 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47] animate-pulse" />
          WHAT WE DO
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
          Made to look after{' '}
          <span className="text-[#ff3847] drop-shadow-[0_0_25px_rgba(255,56,71,0.7)]">the people you love.</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8e8e9c] max-w-lg mx-auto">
          Scroll to explore our Scrabble tile architecture — engineered for clarity, security, and peace of mind.
        </p>

        {/* Scroll Progress Step Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeBatch >= step
                ? 'w-6 bg-[#ff3847] shadow-[0_0_8px_rgba(255,56,71,0.6)]'
                : 'w-2 bg-white/20'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Board Grid (Bento / Scrabble Layout) */}
      <div
        ref={boardRef}
        className="relative z-10 max-w-5xl w-full px-4 sm:px-6 grid grid-cols-12 gap-2.5 sm:gap-3 md:gap-3.5 items-stretch"
        style={{ perspective: 1200 }}
      >
        {/* =========================================================
            ROW 1: (4 + 2 + 2 + 4 = 12 cols)
        ========================================================== */}

        {/* Tile 0: Feature 01 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-4 sm:p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#ff3847] bg-[#d11a2a]/10 px-2 py-0.5 rounded-md border border-[#d11a2a]/25">
              01
            </span>
            <span className="text-[10px] font-bold text-[#6e6e7c] uppercase tracking-widest flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-[#ff4d5a]" /> Jurisdiction
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-white leading-tight">
              Knows your country
            </h4>
            <p className="text-[11px] md:text-xs text-[#8e8e9c] mt-0.5 leading-snug line-clamp-2">
              Adapts dynamically to local probate rules and legal requirements.
            </p>
          </div>
        </div>

        {/* Tile 1: Icon Tile (Globe) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <Globe2 className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Global Laws</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Cross-Border</span>
        </div>

        {/* Tile 2: Icon Tile (Shield/Lock) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <LockKeyhole className="w-5 h-5 text-[#ff4d5a]" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Encrypted Vault</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Bank-Grade</span>
        </div>

        {/* Tile 3: Feature 02 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-4 sm:p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#ff3847] bg-[#d11a2a]/10 px-2 py-0.5 rounded-md border border-[#d11a2a]/25">
              02
            </span>
            <span className="text-[10px] font-bold text-[#6e6e7c] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff4d5a]" /> Confidential
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-white leading-tight">
              Private and secure
            </h4>
            <p className="text-[11px] md:text-xs text-[#8e8e9c] mt-0.5 leading-snug line-clamp-2">
              End-to-end encrypted storage ensures only you and your heirs have access.
            </p>
          </div>
        </div>

        {/* =========================================================
            ROW 2: (2 + 2 + 4 [CENTER] + 2 + 2 = 12 cols)
        ========================================================== */}

        {/* Tile 4: Icon Tile (Handshake) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <HeartHandshake className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Family First</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Next of Kin</span>
        </div>

        {/* Tile 5: Bento Stat (15 Mins) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="flex items-center gap-1 text-[#ff3847] mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-base font-extrabold tracking-tight">15 Mins</span>
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Swift Setup</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Zero Friction</span>
        </div>

        {/* CENTER ISLAND: Wide rounded pill card (ALWAYS VISIBLE - NOT A .board-tile) */}
        <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-[#0c0d14] via-[#0c0d14] to-[#1a0a0c] rounded-3xl border-2 border-[#ff3847]/30 p-4 sm:p-5 shadow-[0_12px_36px_rgba(255,56,71,0.15)] flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[92px] md:min-h-[104px]">
          {/* Subtle glowing center badge */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#d11a2a]/15 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#e01a2c] to-[#960d17] text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(224,26,44,0.5)] mb-1.5">
            <Shield className="w-3 h-3 text-white fill-white/20" /> CORE PROMISE
          </div>
          <h3 className="font-sans font-black text-sm sm:text-base md:text-[17px] text-white tracking-tight leading-tight uppercase">
            DESIGNED TO PROTECT <span className="text-[#ff3847] drop-shadow-[0_0_20px_rgba(255,56,71,0.7)]">YOUR LOVED ONES</span>
          </h3>
          <span className="text-[10px] text-[#8e8e9c] font-medium mt-0.5">
            100% Legal Certainty &bull; Effortless Protection
          </span>
        </div>

        {/* Tile 6: Icon Tile (Document) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <FileCheck2 className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Legal Will</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Official Format</span>
        </div>

        {/* Tile 7: Icon Tile (AI/Robot) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <Bot className="w-5 h-5 text-[#ff4d5a]" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">AI Copilot</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Active 24/7</span>
        </div>

        {/* =========================================================
            ROW 3: (4 + 2 + 2 + 4 = 12 cols)
        ========================================================== */}

        {/* Tile 8: Feature 03 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-4 sm:p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#ff3847] bg-[#d11a2a]/10 px-2 py-0.5 rounded-md border border-[#d11a2a]/25">
              03
            </span>
            <span className="text-[10px] font-bold text-[#6e6e7c] uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d5a]" /> Clarity
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-white leading-tight">
              Clear guidance
            </h4>
            <p className="text-[11px] md:text-xs text-[#8e8e9c] mt-0.5 leading-snug line-clamp-2">
              Plain explanations without confusing legalese so you always understand.
            </p>
          </div>
        </div>

        {/* Tile 9: Icon Tile (Seal) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] flex items-center justify-center mb-1.5 border border-[#d11a2a]/30">
            <Award className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Court Ready</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Verified Seal</span>
        </div>

        {/* Tile 10: Bento Stat (Zero Jargon) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center gap-1 text-[#ff3847] mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-base font-extrabold tracking-tight">Zero Jargon</span>
          </div>
          <span className="text-[11px] font-bold text-white leading-none">Plain English</span>
          <span className="text-[9px] text-[#6e6e7c] font-medium mt-0.5">Easy Guidance</span>
        </div>

        {/* Tile 11: Feature 04 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-[#0c0d14]/90 rounded-2xl border border-white/[0.12] p-4 sm:p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between hover:border-[#ff3847]/40 hover:shadow-[0_12px_35px_rgba(209,26,42,0.2)] transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#ff3847] bg-[#d11a2a]/10 px-2 py-0.5 rounded-md border border-[#d11a2a]/25">
              04
            </span>
            <span className="text-[10px] font-bold text-[#6e6e7c] uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d5a]" /> Structure
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-white leading-tight">
              The hard parts simplified
            </h4>
            <p className="text-[11px] md:text-xs text-[#8e8e9c] mt-0.5 leading-snug line-clamp-2">
              Step-by-step allocations for executors, guardians, and estate division.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Alias export to support both naming conventions seamlessly
export { FeaturesMatrix as WhatWeDoBoard };