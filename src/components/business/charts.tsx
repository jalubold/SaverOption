"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { formatMoney } from "@/lib/business/calc";
import { cn } from "@/components/ui/primitives";

/**
 * Charts for the business app, following the data-viz rules: thin marks with
 * 4px rounded data-ends, 2px lines, hairline grids, one hover tooltip per mark
 * (crosshair on the trend), legends for multi-series, text in text colours, and
 * a table view for every chart. Categorical slots 1–4 (blue, orange, aqua,
 * yellow) were validated for CVD separation on the white card surface; aqua and
 * yellow sit below 3:1 contrast, so their values are always labelled.
 */

const vizVars = {
  "--series-1": "#2a78d6",
  "--series-2": "#eb6834",
  "--series-3": "#1baf7a",
  "--series-4": "#eda100",
  "--viz-grid": "#e1e0d9",
  "--viz-axis": "#c3c2b7",
  "--viz-muted": "#898781",
} as CSSProperties;

export const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

function TableView({ caption, head, rows }: { caption: string; head: [string, string]; rows: [string, string][] }) {
  return (
    <details className="mt-3 text-[12.5px]">
      <summary className="cursor-pointer select-none text-faint hover:text-fg">View as table</summary>
      <table className="biz-table mt-2">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th>{head[0]}</th>
            <th className="num">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i}>
              <td>{a}</td>
              <td className="num">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export interface BarRow {
  label: string;
  value: number;
  display: string;
  sub?: string;
  href?: string;
}

/** Ranked horizontal bars (vendor, category, department…), one series in the brand accent. */
export function BarList({ rows, caption, valueHead = "Monthly", max: maxRows = 8 }: { rows: BarRow[]; caption: string; valueHead?: string; max?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = rows.slice(0, maxRows);
  const rest = rows.slice(maxRows);
  const total = rows.reduce((t, r) => t + r.value, 0);
  const max = Math.max(...shown.map((r) => r.value), 1);
  return (
    <div style={vizVars}>
      <ul className="space-y-2.5" aria-label={caption}>
        {shown.map((r, i) => {
          const share = total > 0 ? Math.round((r.value / total) * 100) : 0;
          const label = (
            <span className="min-w-0 truncate text-[13px] text-fg">
              {r.label}
              {r.sub && <span className="ml-1.5 text-faint">{r.sub}</span>}
            </span>
          );
          return (
            <li
              key={`${r.label}-${i}`}
              className="relative"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            >
              <div className="flex items-baseline justify-between gap-3">
                {r.href ? (
                  <Link href={r.href} className="min-w-0 truncate hover:underline underline-offset-2">
                    {label}
                  </Link>
                ) : (
                  label
                )}
                <span className="tabular shrink-0 text-[13px] font-medium text-fg">{r.display}</span>
              </div>
              <div className="mt-1 h-2 w-full" aria-hidden="true">
                <div
                  className="h-full rounded-r-[4px] transition-[filter]"
                  style={{ width: r.value > 0 ? `${Math.max(1.5, (r.value / max) * 100)}%` : 0, background: "var(--accent)", filter: hover === i ? "brightness(1.15)" : undefined }}
                />
              </div>
              {hover === i && (
                <div role="tooltip" className="pointer-events-none absolute -top-9 right-0 z-10 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] shadow-md">
                  <strong className="font-semibold text-fg">{r.display}</strong> <span className="text-muted">· {share}% of total</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {rest.length > 0 && <p className="mt-3 text-[12px] text-faint">+ {rest.length} more in the table view.</p>}
      <TableView caption={caption} head={["Name", valueHead]} rows={rows.map((r) => [r.label, r.display])} />
    </div>
  );
}

export interface Segment {
  label: string;
  value: number;
  display: string;
}

/** One 100% bar for a part-to-whole split (≤ 4 parts), with a labelled legend. */
export function StackedBar({ segments, caption }: { segments: Segment[]; caption: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const parts = segments.filter((s) => s.value > 0).slice(0, 4);
  const total = parts.reduce((t, s) => t + s.value, 0);
  if (total <= 0) return <p className="text-[13px] text-faint">No priced active subscriptions yet.</p>;
  return (
    <div style={vizVars}>
      <div className="relative flex h-6 w-full gap-[2px]" role="img" aria-label={`${caption}: ${parts.map((p) => `${p.label} ${p.display}`).join(", ")}`}>
        {parts.map((p, i) => (
          <div
            key={p.label}
            tabIndex={0}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className={cn("h-full outline-none first:rounded-l-[4px] last:rounded-r-[4px] focus-visible:ring-2 focus-visible:ring-fg", hover === i && "brightness-110")}
            style={{ width: `${(p.value / total) * 100}%`, background: SERIES[i] }}
          />
        ))}
        {hover !== null && (
          <div role="tooltip" className="pointer-events-none absolute -top-10 left-0 z-10 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] shadow-md">
            <strong className="font-semibold text-fg">{parts[hover].display}</strong>{" "}
            <span className="text-muted">
              · {parts[hover].label} · {Math.round((parts[hover].value / total) * 100)}%
            </span>
          </div>
        )}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-y-1.5 text-[12.5px]">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px]" style={{ background: SERIES[i] }} />
            <span className="text-muted">{p.label}</span>
            <span className="tabular ml-auto font-medium text-fg">
              {p.display} <span className="font-normal text-faint">({Math.round((p.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
      <TableView caption={caption} head={["Billing", "Monthly equivalent"]} rows={parts.map((p) => [p.label, p.display])} />
    </div>
  );
}

export interface TrendPoint {
  label: string;
  value: number;
  display: string;
}

/** Single-series trend (line + 10% area wash) with a snapping crosshair tooltip. */
export function TrendChart({ points, caption, currency }: { points: TrendPoint[]; caption: string; currency: string }) {
  const formatTick = (v: number) => formatMoney(v, currency, { compact: true, whole: true });
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const gradientId = useId();
  const W = 640;
  const H = 200;
  const pad = { l: 52, r: 16, t: 12, b: 26 };
  const { ticks, y, x } = useMemo(() => {
    const max = Math.max(...points.map((p) => p.value), 0);
    const step = niceStep(max / 3);
    const top = Math.max(step * 3, step);
    const ticks = [0, step, step * 2, step * 3].filter((t) => t <= top);
    const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / (top || 1));
    const x = (i: number) => pad.l + ((W - pad.l - pad.r) * i) / Math.max(points.length - 1, 1);
    return { ticks, y, x };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);
  if (points.length === 0) return null;
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const last = points.length - 1;
  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };
  const labelEvery = Math.ceil(points.length / 6);
  return (
    <div style={vizVars} className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`${caption}. Latest: ${points[last].display} (${points[last].label}).`}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? last) - 1));
          if (e.key === "ArrowRight") setHover((h) => Math.min(last, (h ?? -1) + 1));
        }}
        onBlur={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth="1" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--viz-muted)" className="tabular">
              {formatTick(t)}
            </text>
          </g>
        ))}
        {points.map((p, i) =>
          // Every nth month plus the last one, skipping a regular label that would crowd the last.
          (i % labelEvery === 0 && last - i >= labelEvery) || i === last || (labelEvery === 1 && i % labelEvery === 0) ? (
            <text key={p.label} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize="11" fill="var(--viz-muted)">
              {p.label}
            </text>
          ) : null,
        )}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />}
        <circle cx={x(hover ?? last)} cy={y(points[hover ?? last].value)} r="4.5" fill="var(--accent)" stroke="#ffffff" strokeWidth="2" />
      </svg>
      {hover !== null && (
        <div
          role="tooltip"
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] shadow-md"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <strong className="block font-semibold text-fg">{points[hover].display}</strong>
          <span className="text-muted">{points[hover].label}</span>
        </div>
      )}
      <TableView caption={caption} head={["Month", "Monthly run-rate"]} rows={points.map((p) => [p.label, p.display])} />
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
