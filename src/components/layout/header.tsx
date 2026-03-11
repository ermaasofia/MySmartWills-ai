"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const heroMuted = !scrolled ? "text-white/60" : "text-muted-foreground";
  const heroMutedHover = !scrolled
    ? "text-white/60 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
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
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
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
                className={`nav-link-underline relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
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
          className="hidden lg:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ThemeToggle variant={scrolled ? 'default' : 'hero'} />
          {isLoggedIn ? (
            <Link href="/chat">
              <button className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
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
                className={`text-sm font-medium transition-colors px-4 py-2 ${heroMutedHover}`}
              >
                Sign In
              </Link>
              <Link href="/signup">
                <button className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
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

      {/* Mobile Menu — Slide from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-border z-50 lg:hidden flex flex-col"
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
      </AnimatePresence>
    </header>
  );
}
