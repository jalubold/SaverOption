"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/primitives";
import type { Point } from "@/lib/web-analytics";

const H = 240;
const PAD = { top: 12, right: 8, bottom: 26, left: 40 };

type Metric = "visitors" | "pageviews";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { notation: n >= 1000 ? "compact" : "standard" }).format(n);

function bucketLabel(iso: string, granularity: "hour" | "day", long = false) {
  const opts: Intl.DateTimeFormatOptions =
    granularity === "hour"
      ? long
        ? { weekday: "short", month: "short", day: "numeric", hour: "numeric" }
        : { hour: "numeric" }
      : long
        ? { weekday: "short", month: "short", day: "numeric" }
        : { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(new Date(iso));
}

/** Clean axis maximum: 1, 2 or 5 × 10^n at or above the data max. */
function niceMax(n: number) {
  if (n <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(n));
  return ([1, 2, 5, 10].find((m) => m * p >= n) ?? 10) * p;
}

/** Visitors or pageviews over time as columns, with a hover/focus tooltip and a table view. */
export function TrafficChart({ points, granularity }: { points: Point[]; granularity: "hour" | "day" }) {
  const [metric, setMetric] = useState<Metric>("visitors");
  const [active, setActive] = useState<number | null>(null);
  // Draw at the container's real width so axis text stays at its CSS size on phones.
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = niceMax(Math.max(...points.map((d) => d[metric]), 0));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / Math.max(points.length, 1);
  const barW = Math.min(24, Math.max(3, slot - 2)); // 2px surface gap between neighbours
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(points.length / Math.max(2, Math.floor(plotW / 64)));
  const point = active !== null ? points[active] : null;
  const unit = granularity === "hour" ? "Hourly" : "Daily";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{unit}, UTC</p>
        <div role="tablist" aria-label="Chart metric" className="inline-flex rounded-full border border-line bg-subtle p-0.5">
          {(["visitors", "pageviews"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={metric === m}
              onClick={() => setMetric(m)}
              className={cn(
                "h-8 rounded-full px-3.5 text-xs font-medium capitalize transition-colors",
                metric === m ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div ref={boxRef} className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`${unit} ${metric}`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end" className="fill-[var(--faint)] text-[11px] tabular">
                {fmt(t)}
              </text>
            </g>
          ))}
          {points.map((d, i) => {
            const cx = PAD.left + slot * i + slot / 2;
            const h = Math.max(0, plotH - (y(d[metric]) - PAD.top));
            const r = Math.min(4, barW / 2, h);
            const x0 = cx - barW / 2;
            const top = PAD.top + plotH - h;
            // Rounded data-end, square at the baseline.
            const path =
              h > 0
                ? `M${x0},${PAD.top + plotH} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + barW - r} Q${x0 + barW},${top} ${x0 + barW},${top + r} V${PAD.top + plotH} Z`
                : "";
            return (
              <g
                key={d.t}
                tabIndex={0}
                role="button"
                aria-label={`${bucketLabel(d.t, granularity, true)}: ${d.visitors} visitors, ${d.pageviews} pageviews`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              >
                {/* Hit target spans the whole slot, larger than the bar. */}
                <rect x={PAD.left + slot * i} y={PAD.top} width={slot} height={plotH} fill="transparent" />
                {path && <path d={path} fill="var(--accent)" opacity={active === null || active === i ? 1 : 0.45} />}
                {i % labelEvery === 0 && (
                  <text x={cx} y={H - 6} textAnchor="middle" className="fill-[var(--faint)] text-[11px]">
                    {bucketLabel(d.t, granularity)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {point && active !== null && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg"
            // Kept clear of the card edges so the tooltip never overflows on narrow screens.
            style={{ left: `${Math.min(85, Math.max(15, ((PAD.left + slot * active + slot / 2) / W) * 100))}%` }}
          >
            <p className="font-medium text-fg">{bucketLabel(point.t, granularity, true)}</p>
            <p className="tabular mt-0.5 whitespace-nowrap text-muted">
              <span className="font-medium text-fg">{point.visitors.toLocaleString("en-US")}</span> visitors ·{" "}
              <span className="font-medium text-fg">{point.pageviews.toLocaleString("en-US")}</span> pageviews
            </p>
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer py-1 text-xs font-medium text-muted hover:text-fg">View as table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line">
          <table className="tabular w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-subtle text-xs text-faint">
              <tr>
                <th className="px-3 py-2 font-medium">{granularity === "hour" ? "Hour" : "Date"}</th>
                <th className="px-3 py-2 text-right font-medium">Visitors</th>
                <th className="px-3 py-2 text-right font-medium">Pageviews</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((d) => (
                <tr key={d.t} className="border-t border-line">
                  <td className="px-3 py-1.5 text-muted">{bucketLabel(d.t, granularity, true)}</td>
                  <td className="px-3 py-1.5 text-right text-fg">{d.visitors.toLocaleString("en-US")}</td>
                  <td className="px-3 py-1.5 text-right text-fg">{d.pageviews.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
