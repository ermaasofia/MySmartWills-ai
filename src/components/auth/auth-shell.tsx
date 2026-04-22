import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Footer line under the card, e.g. "Don't have an account? Sign up" */
  footer?: ReactNode;
  /** Optional error banner shown above the card */
  error?: string;
}

export function AuthShell({ title, description, children, footer, error }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0a] text-[#ededed]">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-[4px] font-mono text-[11px] font-bold text-[#0a0a0a]"
              style={{ background: 'linear-gradient(135deg, var(--accent), #ededed)' }}
            >
              sw
            </span>
            <span className="text-sm font-semibold">SmartWills</span>
            <span className="rounded-[3px] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/50">
              .ai
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/45 hover:text-white/80"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: 'rgba(190, 24, 93, 0.10)' }}
        />
      </div>

      {/* Card */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // {title.toLowerCase().replace(/\s+/g, '_')}
            </div>
            <h1 className="text-[26px] font-medium tracking-[-0.02em] text-[#ededed] sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-white/55">{description}</p>
          </div>

          {error && (
            <div className="mb-4 rounded-[10px] border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 backdrop-blur-xl sm:p-7">
            {children}
          </div>

          {footer && (
            <p className="mt-6 text-center text-sm text-white/55">{footer}</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-5">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-2 font-mono text-[11px] text-white/40 sm:flex-row sm:justify-between">
          <span>© 2026 SmartWills.ai</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/70">privacy</Link>
            <Link href="/terms" className="hover:text-white/70">terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
