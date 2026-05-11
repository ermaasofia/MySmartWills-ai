'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { SavyCountry } from '@/lib/constants';
import { getReferencesForCountry } from '@/lib/references';

interface PlanData {
  marital_status: string | null;
  spouse_name: string | null;
  dependents_count: number;
  preferred_executor: string | null;
  preferred_guardian: string | null;
  religion: string | null;
  has_existing_will: boolean | null;
}

interface ChatContextPanelProps {
  activeSavy: SavyCountry;
  /** Bumped by the parent every time an assistant stream completes — triggers plan re-fetch */
  refreshKey: number;
  sessionTitle: string;
}

const NOT_CHOSEN = 'Not yet chosen';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function ChatContextPanel({ activeSavy, refreshKey, sessionTitle }: ChatContextPanelProps) {
  const refs = getReferencesForCountry(activeSavy.code);
  const [plan, setPlan] = useState<PlanData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/user/plan', { cache: 'no-store' });
        if (!res.ok) return;
        const { plan: data } = await res.json();
        if (!cancelled) setPlan(data);
      } catch {
        /* swallow — non-critical */
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const dependents = plan
    ? plan.dependents_count > 0
      ? `${plan.dependents_count} ${plan.dependents_count === 1 ? 'person' : 'people'}`
      : NOT_CHOSEN
    : NOT_CHOSEN;

  const rows: Array<[string, string]> = [
    ['Jurisdiction', `${activeSavy.flag} ${activeSavy.name}`],
    ['Marital status', plan?.marital_status ? capitalize(plan.marital_status) : NOT_CHOSEN],
    ['Dependents', dependents],
    ['Executor', plan?.preferred_executor ?? NOT_CHOSEN],
    ['Guardian', plan?.preferred_guardian ?? NOT_CHOSEN],
  ];

  if (plan?.religion) {
    rows.splice(1, 0, ['Religion', capitalize(plan.religion)]);
  }

  const handleExport = useCallback(() => {
    const lines: string[] = [];
    lines.push(`# Will planning prep sheet`);
    lines.push('');
    lines.push(`Session: ${sessionTitle}`);
    lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
    lines.push('');
    lines.push(`## Your plan so far`);
    rows.forEach(([k, v]) => lines.push(`- **${k}:** ${v}`));
    lines.push('');
    lines.push(`## Statutes to take to your solicitor`);
    refs.forEach((r) => {
      lines.push(`- **${r.title}** (${r.statute}) — ${r.description}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartwills-prep-${activeSavy.code.toLowerCase()}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [rows, refs, sessionTitle, activeSavy.code]);

  return (
    <aside className="hidden lg:flex w-[320px] shrink-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--raised-1)]">
      <div className="p-5">
        {/* Your plan so far */}
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--accent)]">
          // YOUR PLAN SO FAR
        </div>
        <div className="rounded-[10px] border border-[var(--border)] bg-white/[0.03] p-4">
          {rows.map(([k, v], i) => {
            const isPlaceholder = v === NOT_CHOSEN;
            return (
              <div
                key={k}
                className="flex items-center justify-between py-2 text-[13px]"
                style={{
                  borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border)',
                }}
              >
                <span className="text-white/55">{k}</span>
                <span
                  className={
                    isPlaceholder
                      ? 'font-mono text-[12px] text-white/35'
                      : 'font-medium text-[#ededed]'
                  }
                >
                  {v}
                </span>
              </div>
            );
          })}
          <button
            onClick={handleExport}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-[#ededed] transition-colors hover:bg-white/[0.08]"
          >
            Export prep sheet
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
