"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

export interface PanelRow {
  label: string;
  visitors: number;
  /** Adds this row as a filter; absent for rows that can't be filtered (e.g. "Others"). */
  href?: string;
  /** The row is the active filter for this dimension. */
  active?: boolean;
}

export interface PanelTab {
  id: string;
  label: string;
  /** Rows that came with the page. */
  rows?: PanelRow[];
  /** Or a URL the rows load from when the tab is first opened (saves analytics API calls). */
  src?: string;
  /** Or neither: the data is temporarily unavailable. */
  unavailable?: boolean;
  mono?: boolean;
}

type Loaded = { rows: PanelRow[] } | { failed: true };

/** A breakdown card with tabs (e.g. Devices · Browsers · OS). Clicking a row filters the whole dashboard. */
export function BreakdownPanel({ tabs }: { tabs: PanelTab[] }) {
  const [current, setCurrent] = useState(tabs[0].id);
  const [loaded, setLoaded] = useState<Record<string, Loaded>>({});
  const baseId = useId();
  const tab = tabs.find((t) => t.id === current) ?? tabs[0];
  const pending = tab.src !== undefined && !loaded[tab.src];
  useEffect(() => {
    const src = tab.src;
    if (!src || loaded[src]) return;
    let live = true;
    fetch(src)
      .then((r) => r.json())
      .then((d: { ok?: boolean; rows?: PanelRow[] }) => live && setLoaded((m) => ({ ...m, [src]: d.ok && d.rows ? { rows: d.rows } : { failed: true } })))
      .catch(() => live && setLoaded((m) => ({ ...m, [src]: { failed: true } })));
    return () => {
      live = false;
    };
  }, [tab.src, loaded]);
  const got = tab.src ? loaded[tab.src] : undefined;
  const rows = tab.rows ?? (got && "rows" in got ? got.rows : null);
  const unavailable = tab.unavailable || (got !== undefined && "failed" in got);
  const max = Math.max(...(rows ?? []).map((r) => r.visitors), 1);

  return (
    <section className="flex flex-col rounded-[18px] border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Breakdown" className="-ml-1 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${baseId}-${t.id}`}
              type="button"
              role="tab"
              aria-selected={t.id === tab.id}
              aria-controls={`${baseId}-panel`}
              onClick={() => setCurrent(t.id)}
              className={cn(
                "h-8 rounded-lg px-2.5 text-[13px] font-medium transition-colors",
                t.id === tab.id ? "bg-subtle text-fg" : "text-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Visitors</span>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${tab.id}`} className="mt-3">
        {pending ? (
          <p className="py-8 text-center text-sm text-muted" aria-live="polite">
            Loading…
          </p>
        ) : unavailable || !rows ? (
          <p className="py-8 text-center text-sm text-muted">Temporarily unavailable. It comes back once Vercel Web Analytics answers again.</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No data for this period.</p>
        ) : (
          <ul className="space-y-1">
            {rows.map((r) => {
              const inner = (
                <>
                  <span
                    aria-hidden="true"
                    className={cn("absolute inset-y-0 left-0 rounded-md", r.active ? "bg-accent/35" : "bg-accent/15")}
                    style={{ width: `${(r.visitors / max) * 100}%` }}
                  />
                  <span className={cn("relative min-w-0 truncate text-sm text-fg", tab.mono && "font-mono text-[13px]")}>{r.label}</span>
                  <span className="relative flex shrink-0 items-center gap-2">
                    {r.href && !r.active && (
                      <Icon name="search" size={12} className="text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                    <span className="tabular text-sm font-medium text-fg">{r.visitors.toLocaleString("en-US")}</span>
                  </span>
                </>
              );
              const cls = "group relative flex min-h-9 items-center justify-between gap-3 overflow-hidden rounded-md px-2.5 py-1.5";
              return (
                <li key={`${r.label}-${r.href ?? ""}`}>
                  {r.href ? (
                    <Link href={r.href} rel="nofollow" scroll={false} title={`Filter by ${r.label}`} className={cn(cls, "hover:bg-subtle")}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
