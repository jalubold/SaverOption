import type { CSSProperties, ReactNode } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { exampleSubs, potentialAnnual, pricePerPeriod, renewalsIn30, seated, usd } from "./example-data";

/**
 * An illustrative conversation for the public MCP page: an AI assistant
 * answering from the Saver Option tools, with the landing page's example
 * company. Every figure comes from example-data, never typed in by hand.
 */

const renewing = exampleSubs
  .filter((s) => s.renewsIn <= 30)
  .sort((a, b) => (b.priceMinor ?? 0) - (a.priceMinor ?? 0))
  .slice(0, 3);
const deadline = exampleSubs.find((s) => s.cancelBy !== undefined && s.cancelBy <= 30);
const unused = [...seated]
  .filter((x) => (x.seats.unusedMonthly ?? 0) > 0)
  .sort((a, b) => (b.seats.unusedMonthly ?? 0) - (a.seats.unusedMonthly ?? 0))
  .slice(0, 2);

function UserBubble({ children, d }: { children: ReactNode; d: number }) {
  return (
    <div className="so-rise flex justify-end" style={{ "--d": `${d}ms` } as CSSProperties}>
      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[13.5px] leading-snug text-white shadow-[0_10px_24px_-14px_rgb(124_58_236/0.9)]">{children}</p>
    </div>
  );
}

function ToolChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-2 py-0.5 font-mono text-[11px] text-muted">
      <Icon name="code" size={11} className="text-accent-ink" />
      {name}
    </span>
  );
}

function AssistantBubble({ tools, children, d }: { tools: string[]; children: ReactNode; d: number }) {
  return (
    <div className="so-rise flex gap-2.5" style={{ "--d": `${d}ms` } as CSSProperties}>
      <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
        <Icon name="sparkles" size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-faint">
          Used Saver Option {tools.map((t) => <ToolChip key={t} name={t} />)}
        </p>
        <div className="mt-2 rounded-2xl rounded-tl-md border border-line bg-surface px-3.5 py-3 text-[13.5px] leading-relaxed text-fg shadow-[var(--shadow-card)]">{children}</div>
      </div>
    </div>
  );
}

export function McpChatPreview({ className }: { className?: string }) {
  return (
    <div className={cn("theme-light overflow-hidden rounded-[20px] border border-line bg-bg text-fg shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.04)]", className)}>
      <h3 className="sr-only">An example conversation</h3>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
            <Icon name="sparkles" size={14} />
          </span>
          <span className="truncate text-[13.5px] font-semibold text-heading">Your AI assistant</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1baf7a]/12 px-2.5 py-1 text-[11.5px] font-medium text-[#0c7350]">
          <span className="viz-live size-1.5 rounded-full bg-[#1baf7a]" />
          Saver Option · Read only
        </span>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <UserBubble d={500}>Which subscriptions renew in the next 30 days?</UserBubble>
        <AssistantBubble tools={["get_upcoming_renewals"]} d={750}>
          <p>
            <strong className="font-semibold">{renewalsIn30} subscriptions</strong> renew in the next 30 days. The largest, at their current prices (a projection):
          </p>
          <ul className="mt-2.5 divide-y divide-line rounded-xl border border-line">
            {renewing.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5 px-3 py-2">
                <SoftwareLogo name={s.name} src={s.logo} size={24} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{s.name}</span>
                <span className="tabular whitespace-nowrap text-[13px] font-semibold">{pricePerPeriod(s)}</span>
                <span className="w-14 whitespace-nowrap text-right text-[11.5px] text-faint">in {s.renewsIn}d</span>
              </li>
            ))}
          </ul>
          {deadline && (
            <p className="mt-2.5 text-[13px] text-muted">
              Heads-up: <strong className="font-semibold text-fg">{deadline.name}</strong>&apos;s cancellation deadline is in {deadline.cancelBy} days — after that the next period ({pricePerPeriod(deadline)}) is
              charged.
            </p>
          )}
        </AssistantBubble>
        <UserBubble d={1000}>Where are we paying for seats nobody uses?</UserBubble>
        <AssistantBubble tools={["get_savings_opportunities"]} d={1250}>
          <p>
            Unassigned seats on per-seat plans come to about <strong className="font-semibold">{usd(potentialAnnual)}/yr</strong> — an estimate from your recorded prices and seat
            assignments, not a guaranteed saving.
          </p>
          <ul className="mt-2 space-y-1.5">
            {unused.map(({ s, seats }) => (
              <li key={s.id} className="flex items-center gap-2 text-[13px]">
                <SoftwareLogo name={s.name} src={s.logo} size={20} />
                <span className="min-w-0 flex-1">
                  <strong className="font-semibold">{s.name}</strong>{" "}
                  <span className="text-muted">
                    · {seats.available} of {seats.purchased} seats unassigned
                  </span>
                </span>
                <span className="tabular whitespace-nowrap font-semibold">≈ {usd((seats.unusedMonthly ?? 0) * 12)}/yr</span>
              </li>
            ))}
          </ul>
        </AssistantBubble>
      </div>
    </div>
  );
}
