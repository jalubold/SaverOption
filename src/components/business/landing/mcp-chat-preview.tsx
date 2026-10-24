import type { CSSProperties } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { annualTotal, monthlyTotal, summary, topVendors, usd } from "./example-data";

/**
 * An illustrative conversation for the public MCP page: Claude (the client
 * tested with this server, see mcp-clients.ts) answering from the Saver Option
 * tools, with the landing page's example company. Our own styling, not a copy
 * of Claude's interface; every figure comes from example-data.
 */

const CLAUDE_LOGO = "/logos/business/claude.svg";
const top = topVendors.slice(0, 5);
const max = top[0]?.value || 1;
const pct = (v: number) => Math.round((v / (monthlyTotal || 1)) * 100);
const topShare = pct(top.reduce((t, r) => t + r.value, 0));
const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Claude-style "working" indicator that settles into a check once the answer is in. */
function Step({ label, d }: { label: string; d: number }) {
  return (
    <p className="so-rise flex items-center gap-2.5" style={at(d)}>
      <span aria-hidden="true" className="relative size-5 shrink-0">
        <svg viewBox="0 0 20 20" className="so-step-spinner absolute inset-0 text-[#d97757]">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <circle key={i} cx={10 + Math.cos(a) * 7} cy={10 + Math.sin(a) * 7} r={1.15 + (i / 8) * 0.6} fill="currentColor" opacity={0.35 + (i / 8) * 0.65} />;
          })}
        </svg>
        <span className="so-step-done absolute inset-0 flex items-center justify-center rounded-full bg-[#1baf7a]/15 text-[#0c7350]">
          <Icon name="check" size={12} />
        </span>
      </span>
      <em className="font-serif text-[14px] text-fg">{label}</em>
    </p>
  );
}

export function McpChatPreview({ className }: { className?: string }) {
  return (
    <div className={cn("theme-light overflow-hidden rounded-[20px] border border-line bg-bg text-fg shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.04)]", className)}>
      <h3 className="sr-only">An illustrative conversation in Claude with Saver Option connected</h3>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <SoftwareLogo name="Claude" src={CLAUDE_LOGO} size={28} />
          <span className="truncate text-[13.5px] font-semibold text-heading">Claude</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1baf7a]/12 px-2.5 py-1 text-[11.5px] font-medium text-[#0c7350]">
          <span className="viz-live size-1.5 rounded-full bg-[#1baf7a]" />
          Saver Option · Read only
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="so-rise flex justify-end" style={at(400)}>
          <p className="max-w-[88%] rounded-2xl bg-subtle px-4 py-3 text-[14px] leading-snug text-fg">What&apos;s our monthly software spend, and which 5 subscriptions cost the most?</p>
        </div>

        <p className="so-rise flex items-center gap-1 text-[12.5px] text-faint" style={at(800)}>
          Used Saver Option integration, loaded tools <Icon name="chevron-right" size={13} />
        </p>
        <Step label="Ranking subscriptions by cost" d={1050} />

        <div className="so-rise space-y-4" style={at(2500)}>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-subtle px-3.5 py-3">
              <p className="text-[11.5px] text-muted">Monthly run-rate (Oct 2026)</p>
              <p className="tabular mt-0.5 text-[20px] font-semibold tracking-tight text-heading sm:text-[22px]">{usd(monthlyTotal)}</p>
            </div>
            <div className="rounded-xl bg-subtle px-3.5 py-3">
              <p className="text-[11.5px] text-muted">Active subscriptions</p>
              <p className="tabular mt-0.5 text-[20px] font-semibold tracking-tight text-heading sm:text-[22px]">{summary.activeCount}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Top 5 subscriptions · monthly equivalent</p>
            <ol className="mt-1.5 divide-y divide-line">
              {top.map((r, i) => (
                <li key={r.label} className="grid grid-cols-[1rem_minmax(0,7.5rem)_minmax(0,1fr)_auto] items-center gap-2.5 py-2 text-[13px] sm:grid-cols-[1rem_minmax(0,9rem)_minmax(0,1fr)_auto]">
                  <span className="tabular text-faint">{i + 1}</span>
                  <span className="truncate font-medium text-fg">{r.label}</span>
                  <span className="h-1.5 rounded-full bg-subtle">
                    <span className="viz-grow-x block h-full rounded-full bg-[#3c64b1]" style={{ width: `${(r.value / max) * 100}%`, "--i": i + 36 } as CSSProperties} />
                  </span>
                  <span className="tabular whitespace-nowrap text-right font-medium text-fg">{r.display}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2.5 font-serif text-[14.5px] leading-relaxed text-fg">
            <p>Here&apos;s the breakdown from your Saver Option data:</p>
            <p>
              <strong className="font-semibold">Monthly run-rate:</strong> {usd(monthlyTotal)}/mo across {summary.activeCount} active subscriptions — {usd(annualTotal)}/yr annualized.
              That&apos;s each plan&apos;s price as a monthly equivalent (a normalized estimate), not cash spent.
            </p>
            <p>
              <strong className="font-semibold">Top 5 by cost:</strong> {top[0].label} leads at {top[0].display} ({pct(top[0].value)}% of the total); together the five make up{" "}
              {topShare}%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
