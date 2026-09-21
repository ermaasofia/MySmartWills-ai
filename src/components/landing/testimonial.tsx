'use client';

import { useState } from 'react';
import {
  Quote,
  MapPin,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import { Reveal } from './reveal';

const STORIES = [
  {
    quote:
      'The answers were specific to Hong Kong — not generic advice. When I eventually met with my lawyer, I already knew the exact right questions to ask.',
    author: 'David Cheung',
    location: 'Hong Kong',
    role: 'Family Planner • 2 Children',
    tag: 'Hong Kong Jurisdiction',
  },
  {
    quote:
      'SmartWills helped me organise all our family assets across Malaysia and Singapore without feeling overwhelmed. The step-by-step guidance is exceptional.',
    author: 'Sarah Tan',
    location: 'Singapore / Malaysia',
    role: 'Business Owner • Property Owner',
    tag: 'Cross-Border Estate',
  },
  {
    quote:
      'I was able to complete my will planning in under 30 minutes. Savy explained the difficult legal terms in simple Malay and English.',
    author: 'Ahmad Faiz',
    location: 'Kuala Lumpur, Malaysia',
    role: 'Father of 3 • First-time Will Maker',
    tag: 'Wasiat & Estate Planning',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is the guidance considered legal advice?',
    a: 'No. SmartWills.ai provides general legal information and smart planning guidance to help you understand the will-planning process and organise your assets clearly before final execution.',
  },
  {
    q: 'Which countries are supported?',
    a: 'SmartWills.ai supports 12 APAC jurisdictions including Malaysia, Singapore, Hong Kong, Thailand, Australia, New Zealand, Brunei, Vietnam, Indonesia, Philippines, China, and Taiwan.',
  },
  {
    q: 'Is my conversation private and secure?',
    a: 'Yes. All records and conversations are protected with enterprise-grade encryption. Your personal data is never shared with third parties.',
  },
  {
    q: 'Can I save my progress and continue later?',
    a: 'Yes. Your progress is saved automatically to your account so you can pause anytime and return whenever you are ready.',
  },
  {
    q: 'How does SmartWills assist before seeing a lawyer?',
    a: 'SmartWills helps you identify all assets, assign guardians, appoint executors, and generate a clear structured summary, saving you significant time and legal consultation fees.',
  },
  {
    q: 'What happens to my conversation history?',
    a: 'Your sessions are safely retained in your personal dashboard so Savy can remember your estate structure and provide relevant continuity.',
  },
];

export function Testimonial() {
  const [activeStory, setActiveStory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const current = STORIES[activeStory];

  return (
    <section id="feedback-faq" className="bg-[#050508] border-t border-white/[0.08] py-16 lg:py-24 text-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">

        {/* TOP SECTION HEADER */}
        <Reveal>
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff3847]">
                Feedback & Answers
              </span>
            </div>
            <h2
              className="font-serif font-medium text-white tracking-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.15 }}
            >
              Real experiences, <span className="text-[#ff3847] drop-shadow-[0_0_25px_rgba(255,56,71,0.7)]">honest answers.</span>
            </h2>
            <p className="mt-3 text-[14px] text-[#8e8e9c] leading-relaxed">
              Read how families plan their legacy with SmartWills, and explore answers to common questions.
            </p>
          </div>
        </Reveal>

        {/* 2-COLUMN SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* ==========================================
              LEFT COLUMN: CUSTOMER STORY / TESTIMONIAL
          ========================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Reveal delay={40}>
              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#0c0d14]/85 p-7 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                {/* AMBIENT BACKGROUND GLOW */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#d11a2a]/[0.08] blur-3xl" />

                {/* BADGE & RATING */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d11a2a]/10 text-[10px] font-bold tracking-wider uppercase text-[#ff3847] border border-[#d11a2a]/25">
                    <Sparkles size={12} />
                    Customer Story
                  </span>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>

                {/* QUOTE ICON */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                  <Quote size={18} strokeWidth={2} />
                </div>

                {/* QUOTE TEXT */}
                <blockquote className="m-0 font-serif text-[18px] sm:text-[20px] font-medium leading-[1.5] text-white min-h-[120px]">
                  “{current.quote}”
                </blockquote>

                {/* DIVIDER */}
                <div className="my-6 h-[1px] w-full bg-white/[0.08]" />

                {/* AUTHOR INFO */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="m-0 text-[15px] font-bold text-white">
                      {current.author}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#8e8e9c] font-medium">
                      {current.role}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[#ff3847] font-semibold">
                      <MapPin size={12} strokeWidth={2} />
                      {current.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 text-[9.5px] font-bold text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified User
                  </div>
                </div>

                {/* STORY SWITCHER TABS */}
                <div className="mt-7 flex items-center gap-2 pt-4 border-t border-white/[0.08]">
                  <span className="text-[10px] font-bold text-[#6e6e7c] uppercase tracking-wider mr-1">
                    Stories:
                  </span>
                  {STORIES.map((s, idx) => (
                    <button
                      key={s.author}
                      onClick={() => setActiveStory(idx)}
                      className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-all ${activeStory === idx
                        ? 'bg-gradient-to-r from-[#e01a2c] to-[#960d17] text-white shadow-[0_0_10px_rgba(224,26,44,0.4)]'
                        : 'bg-white/[0.06] text-[#8e8e9c] hover:bg-white/[0.1]'
                        }`}
                    >
                      {s.author.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ==========================================
              RIGHT COLUMN: FAQ ACCORDION
          ========================================== */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <div className="rounded-[24px] border border-white/[0.12] bg-[#0c0d14]/85 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">

                {/* ACCORDION HEADER */}
                <div className="bg-[#0a0b12] border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-[#ff4d5a]" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-white">
                      Frequently Asked Questions
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#6e6e7c]">
                    {FAQ_ITEMS.length} Questions
                  </span>
                </div>

                {/* ACCORDION ITEMS */}
                <div className="divide-y divide-white/[0.06]">
                  {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={item.q}
                        className={`transition-colors duration-200 ${isOpen ? 'bg-[#d11a2a]/[0.04]' : 'bg-transparent hover:bg-white/[0.03]'
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="font-mono text-[11px] font-bold text-[#ff3847]/70 w-5">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[13.5px] sm:text-[14.5px] font-semibold text-white">
                              {item.q}
                            </span>
                          </div>

                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[#0c0d14] text-[#8e8e9c] transition-transform duration-200 ${isOpen ? 'rotate-180 border-[#ff3847]/40 text-[#ff3847] bg-[#d11a2a]/10' : ''
                              }`}
                          >
                            <ChevronDown size={14} strokeWidth={2.2} />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-0 text-[13px] leading-[1.7] text-[#b0b0be]">
                            <p className="m-0 pl-9 border-l-2 border-[#ff3847]/30">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
}