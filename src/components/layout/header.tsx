"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLenis } from "@/components/providers/lenis-provider";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Countries", href: "#countries" },
  { label: "FAQ", href: "#faq" },
];

interface HeaderProps {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Hero is always dark (DarkVeil), so force light text when not scrolled
  const heroText = !scrolled ? "text-white" : "text-foreground";
  const heroMutedHover = !scrolled
    ? "text-white/60 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  const lenis = useLenis();

  /* ─── Scroll-progress linked to hero section ─── */
  // 0 = at top of page (hero fully visible)
  // 1 = hero fully scrolled off screen
  // Navbar morphs in perfect sync with hero scroll progress.
  const scrollProgress = useMotionValue(0);

  // Store hero section height — measured from DOM
  const heroHeightRef = useRef(0);

  // Measure hero section height on mount + resize
  useEffect(() => {
    const measure = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        heroHeightRef.current = heroEl.offsetHeight;
      }
    };
    // Measure after layout paint
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Header geometry — all derived from scrollProgress (0→1)
  // Morph window: starts at 30%, finishes at 80% of hero scroll.
  // This means the navbar is fully morphed BEFORE the hero ends,
  // so there's no snappy change at the section boundary.
  //
  // Multi-point eased curve: slow start → accelerate → slow finish
  // Creates a natural ease-in-out feel instead of linear interpolation.
  const points = [0, 0.3, 0.45, 0.55, 0.65, 0.8, 1];

  const headerTop = useTransform(scrollProgress, points,
    [0, 0, 2, 8, 13, 16, 16], { clamp: true });
  const headerWidth = useTransform(scrollProgress, points,
    ["100%", "100%", "98%", "94%", "90%", "88%", "88%"], { clamp: true });
  const headerMaxWidth = useTransform(scrollProgress, points,
    [9999, 9999, 5000, 2000, 1100, 1024, 1024], { clamp: true });
  // Radius leads ahead — rounds corners early BEFORE width shrinks noticeably,
  // so you never see a sharp-cornered shrinking rectangle.
  const headerRadius = useTransform(scrollProgress, points,
    [0, 0, 14, 18, 20, 20, 20], { clamp: true });
  const headerPY = useTransform(scrollProgress, points,
    [20, 20, 18, 14, 11, 10, 10], { clamp: true });
  const glassOpacity = useTransform(scrollProgress, points,
    [0, 0, 0.15, 0.5, 0.85, 1, 1], { clamp: true });
  const logoScale = useTransform(scrollProgress, points,
    [1, 1, 0.97, 0.92, 0.87, 0.85, 0.85], { clamp: true });

  // Sync Lenis scroll position → scrollProgress (0→1 based on hero height)
  useEffect(() => {
    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => {
        const heroH = heroHeightRef.current || window.innerHeight;
        // Clamp progress to 0–1 based on how far through the hero we've scrolled
        const progress = Math.min(1, Math.max(0, scroll / heroH));
        scrollProgress.set(progress);
        setScrolled(progress > 0.1);
      };
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    } else {
      // Fallback: native scroll before Lenis initializes
      const handleScroll = () => {
        const heroH = heroHeightRef.current || window.innerHeight;
        const progress = Math.min(1, Math.max(0, window.scrollY / heroH));
        scrollProgress.set(progress);
        setScrolled(progress > 0.1);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis, scrollProgress]);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["features", "how-it-works", "countries", "faq"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(href);
      } else {
        const id = href.replace("#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileMenuOpen(false);
    },
    [lenis]
  );

  return (
    <motion.header
      style={{
        position: "fixed",
        left: "50%",
        x: "-50%",
        zIndex: 50,
        top: headerTop,
        width: headerWidth,
        maxWidth: headerMaxWidth,
        borderRadius: headerRadius,
        paddingTop: headerPY,
        paddingBottom: headerPY,
      }}
    >
      {/* Glass background — fades in progressively as user scrolls */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-background/70 backdrop-blur-2xl border border-border/50 shadow-lg shadow-black/5 pointer-events-none"
        style={{ opacity: glassOpacity, borderRadius: headerRadius }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6">
        {/* Logo — smoothly scales down when floating */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ scale: logoScale, transformOrigin: "left center" }}
        >
          <Link
            href="/"
            className={`flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight ${heroText}`}
          >
            <Image
              src="/logo.png"
              alt="AI SmartWills"
              width={32}
              height={32}
              priority
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
            />
            <span className="hidden sm:inline">AI SmartWills</span>
          </Link>
        </motion.div>

        {/* Desktop Nav — Center */}
        <nav className="hidden lg:flex items-center gap-0 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            >
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`nav-link-underline relative px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
                  activeSection === link.href.replace("#", "")
                    ? `${heroText} active`
                    : heroMutedHover
                }`}
              >
                {link.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Right — CTA + Theme Toggle */}
        <motion.div
          className="hidden lg:flex items-center gap-2.5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ThemeToggle variant={scrolled ? 'default' : 'hero'} />
          {isLoggedIn ? (
            <Link href="/chat">
              <button className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
                scrolled
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-white text-black hover:bg-white/90"
              }`}>
                Chat with AI
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors px-3 py-1.5 ${heroMutedHover}`}
              >
                Sign In
              </Link>
              <Link href="/signup">
                <button className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  scrolled
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-white text-black hover:bg-white/90"
                }`}>
                  Get Started Free
                </button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle variant={scrolled ? 'default' : 'hero'} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-accent' : 'hover:bg-white/10'}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`h-5 w-5 ${heroText}`} />
            ) : (
              <Menu className={`h-5 w-5 ${heroText}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — Portaled to body to escape header transforms */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                {/* Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-border z-[70] lg:hidden flex flex-col"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-semibold">Menu</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="flex flex-col p-4 gap-1">
                    {NAV_LINKS.map((link, i) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeSection === link.href.replace("#", "")
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </a>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="mt-auto p-4 border-t border-border flex flex-col gap-3">
                    {isLoggedIn ? (
                      <Link
                        href="/chat"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <button className="w-full bg-foreground text-background rounded-full px-5 py-3 text-sm font-medium">
                          Chat with AI
                        </button>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block"
                        >
                          <button className="w-full border border-border rounded-full px-5 py-3 text-sm font-medium hover:bg-accent transition-colors">
                            Sign In
                          </button>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block"
                        >
                          <button className="w-full bg-foreground text-background rounded-full px-5 py-3 text-sm font-medium">
                            Get Started Free
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.header>
  );
}
