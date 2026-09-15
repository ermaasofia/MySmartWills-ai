'use client';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe2,
  LockKeyhole,
  HeartHandshake,
  ListChecks,
  RefreshCcw,
  FileCheck2,
  Bot,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  Shield,
  BadgeCheck,
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

      // Deterministically group or pseudo-shuffle for balanced reveals across the board
      // A curated shuffle pattern ensures tiles pop evenly across all 4 quadrants in each step
      const curatedOrder = [
        0, 3, 9, 14,   // Step 1: Top-left, top-right, bottom-left, bottom-right
        1, 6, 8, 13,   // Step 2: Inner icons, center flanks
        2, 5, 11, 15,  // Step 3: Top inner, mid-bottom flanks
        4, 7, 10, 12,  // Step 4: Remaining completing tiles
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

      // Pinned timeline driving step-by-step batch reveals matching "The Line Up"
      const totalScrollDistance = batches.length * 400; // ~1600px scroll lock

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
      className="relative w-full h-screen min-h-[720px] max-h-[1020px] bg-[#faf8f5] text-[#1a1a1a] flex flex-col justify-center items-center py-6 md:py-8 overflow-hidden select-none"
    >
      {/* Background Subtle Scrabble Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#1a1a1a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center px-4 mb-4 md:mb-6 flex-shrink-0">
        <span className="text-xs font-bold tracking-widest text-[#a42025] uppercase inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-red-50 border border-red-100/80 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#a42025] animate-pulse" />
          WHAT WE DO
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1a1a1a] leading-tight">
          Made to look after{' '}
          <span className="text-[#a42025]">the people you love.</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Scroll to explore our Scrabble tile architecture — engineered for clarity, security, and peace of mind.
        </p>

        {/* Scroll Progress Step Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeBatch >= step
                  ? 'w-6 bg-[#a42025]'
                  : 'w-2 bg-gray-300'
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
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-4.5 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              01
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-[#a42025]" /> Jurisdiction
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-[#1a1a1a] leading-tight">
              Knows your country
            </h4>
            <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Adapts dynamically to local probate rules and legal requirements.
            </p>
          </div>
        </div>

        {/* Tile 1: Icon Tile (Globe) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <Globe2 className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Global Laws</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Cross-Border</span>
        </div>

        {/* Tile 2: Icon Tile (Shield/Lock) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <LockKeyhole className="w-5 h-5 text-[#a42025]" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">256-Bit AES</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Encrypted Vault</span>
        </div>

        {/* Tile 3: Feature 02 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-4.5 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              02
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a42025]" /> Confidential
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-[#1a1a1a] leading-tight">
              Private and secure
            </h4>
            <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
              End-to-end encrypted storage ensures only you and your heirs have access.
            </p>
          </div>
        </div>

        {/* =========================================================
            ROW 2: (2 + 2 + 4 [CENTER] + 2 + 2 = 12 cols)
        ========================================================== */}

        {/* Tile 4: Icon Tile (Handshake) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <HeartHandshake className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Family First</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Next of Kin</span>
        </div>

        {/* Tile 5: Bento Stat (15 Mins) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="flex items-center gap-1 text-[#a42025] mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-base font-extrabold tracking-tight">15 Mins</span>
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Swift Setup</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Zero Friction</span>
        </div>

        {/* CENTER ISLAND: Wide rounded pill card (ALWAYS VISIBLE - NOT A .board-tile) */}
        <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-white via-white to-red-50/40 rounded-3xl border-2 border-[#a42025]/30 p-4 sm:p-5 shadow-[0_12px_36px_rgba(164,32,37,0.12)] flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[92px] md:min-h-[104px]">
          {/* Subtle glowing center badge */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#a42025]/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#a42025] text-white text-[10px] font-black uppercase tracking-widest shadow-xs mb-1.5">
            <Shield className="w-3 h-3 text-white fill-white/20" /> CORE PROMISE
          </div>
          <h3 className="font-serif font-black text-sm sm:text-base md:text-[17px] text-[#1a1a1a] tracking-tight leading-tight uppercase">
            DESIGNED TO PROTECT <span className="text-[#a42025]">YOUR LOVED ONES</span>
          </h3>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">
            100% Legal Certainty &bull; Effortless Protection
          </span>
        </div>

        {/* Tile 6: Icon Tile (Document) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <FileCheck2 className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Legal Will</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Official Format</span>
        </div>

        {/* Tile 7: Icon Tile (AI/Robot) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[88px] md:min-h-[100px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <Bot className="w-5 h-5 text-[#a42025]" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">AI Copilot</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Active 24/7</span>
        </div>

        {/* =========================================================
            ROW 3: (4 + 2 + 2 + 4 = 12 cols)
        ========================================================== */}

        {/* Tile 8: Feature 03 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-4.5 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              03
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#a42025]" /> Clarity
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-[#1a1a1a] leading-tight">
              Clear guidance
            </h4>
            <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Plain explanations without confusing legalese so you always understand.
            </p>
          </div>
        </div>

        {/* Tile 9: Icon Tile (Seal) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#a42025] flex items-center justify-center mb-1.5 shadow-inner">
            <Award className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Court Ready</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Verified Seal</span>
        </div>

        {/* Tile 10: Bento Stat (Zero Jargon) */}
        <div className="board-tile col-span-6 sm:col-span-3 md:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center gap-1 text-[#a42025] mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-base font-extrabold tracking-tight">Zero Jargon</span>
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Plain English</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Easy Guidance</span>
        </div>

        {/* Tile 11: Feature 04 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-4.5 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[92px] md:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              04
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#a42025]" /> Structure
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-[15px] text-[#1a1a1a] leading-tight">
              The hard parts simplified
            </h4>
            <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Step-by-step allocations for executors, guardians, and estate division.
            </p>
          </div>
        </div>

        {/* =========================================================
            ROW 4: (3 + 3 + 3 + 3 = 12 cols)
        ========================================================== */}

        {/* Tile 12: Feature 05 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[90px] md:min-h-[100px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              05
            </span>
            <RefreshCcw className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a1a1a] leading-tight">
              Come back anytime
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Automatic saves allow you to pause and resume smoothly.
            </p>
          </div>
        </div>

        {/* Tile 13: Feature 07 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[90px] md:min-h-[100px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              07
            </span>
            <Bot className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a1a1a] leading-tight">
              Always-on assistant
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Contextual AI answers your exact estate questions in seconds.
            </p>
          </div>
        </div>

        {/* Tile 14: Feature 06 */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col justify-between hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[90px] md:min-h-[100px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#a42025] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              06
            </span>
            <FileCheck2 className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a1a1a] leading-tight">
              Clear will summary
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
              Review every clause in clean layout before finalizing.
            </p>
          </div>
        </div>

        {/* Tile 15: Bento Badge (100% Valid) */}
        <div className="board-tile col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] border-b-2 border-b-gray-200 flex flex-col items-center justify-center text-center hover:border-[#a42025]/40 hover:shadow-md transition-all duration-300 min-h-[90px] md:min-h-[100px]">
          <div className="flex items-center gap-1.5 text-[#a42025] mb-0.5">
            <BadgeCheck className="w-4 h-4" />
            <span className="text-sm font-extrabold tracking-tight">100% Valid</span>
          </div>
          <span className="text-[11px] font-bold text-[#1a1a1a] leading-none">Binding Legal Will</span>
          <span className="text-[9px] text-gray-400 font-medium mt-0.5">Signature-Ready PDF</span>
        </div>
      </div>
    </section>
  );
}

// Alias export to support both naming conventions seamlessly
export { FeaturesMatrix as WhatWeDoBoard };