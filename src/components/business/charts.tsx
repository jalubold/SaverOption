"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { formatMoney } from "@/lib/business/calc";
import { SoftwareLogo } from "@/components/business/software-logo";
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
  "--series-5": "#e87ba4",
  "--series-6": "#6250d6",
  "--viz-other": "#c3c2b7",
  "--viz-grid": "#e1e0d9",
  "--viz-axis": "#c3c2b7",
  "--viz-muted": "#898781",
} as CSSProperties;

export const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)", "var(--series-5)", "var(--series-6)"];

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
  /** Show a software logo (or monogram) before the label; null = monogram. */
  logo?: string | null;
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
            <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg">
              {r.logo !== undefined && <SoftwareLogo name={r.label} src={r.logo} size={22} />}
              <span className="min-w-0 truncate">
                {r.label}
                {r.sub && <span className="ml-1.5 text-faint">{r.sub}</span>}
              </span>
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
              <div className={cn("mt-1.5 h-2 rounded-r-[4px] bg-subtle/70", r.logo !== undefined ? "ml-[30px] w-[calc(100%-30px)]" : "w-full")} aria-hidden="true">
                <div
                  className="viz-grow-x h-full rounded-r-[4px] transition-[filter]"
                  style={{
                    "--i": i,
                    width: r.value > 0 ? `${Math.max(1.5, (r.value / max) * 100)}%` : 0,
                    backgroundImage: "linear-gradient(90deg, color-mix(in oklab, var(--accent) 70%, white), var(--accent))",
                    filter: hover === i ? "brightness(1.12)" : undefined,
                  } as CSSProperties}
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
      <div className="viz-grow-x relative flex h-6 w-full gap-[2px]" role="img" aria-label={`${caption}: ${parts.map((p) => `${p.label} ${p.display}`).join(", ")}`}>
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
export function TrendChart({ points, caption, currency, height = 200 }: { points: TrendPoint[]; caption: string; currency: string; height?: number }) {
  const formatTick = (v: number) => formatMoney(v, currency, { compact: true, whole: true });
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  // Drawn at the container's real width so the axis labels stay readable on phones.
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w > 0) setW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = height;
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
  }, [points, H, W]);
  if (points.length === 0) return null;
  // Monotone curve: smooth between months without overshooting the recorded values.
  const line = monotonePath(points.map((p, i) => [x(i), y(p.value)]));
  const area = `${line} L${x(points.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const last = points.length - 1;
  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };
  const labelEvery = Math.ceil(points.length / (W < 420 ? 4 : 6));
  return (
    <div ref={wrap} style={vizVars} className="relative">
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
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
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
        <path d={area} fill={`url(#${gradientId})`} className="viz-fade" />
        <path d={line} pathLength={1} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="viz-draw" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="var(--viz-axis)" strokeWidth="1" />}
        <circle cx={x(hover ?? last)} cy={y(points[hover ?? last].value)} r="4.5" fill="var(--accent)" stroke="#ffffff" strokeWidth="2" className="viz-fade" style={{ "--d": "1300ms" } as CSSProperties} />
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

/** SVG path through points with monotone cubic interpolation (Fritsch–Carlson). */
function monotonePath(pts: [number, number][]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n < 3) return pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    slope.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1));
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  m.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / slope[i];
    const b = m[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * slope[i];
      m[i + 1] = t * b * slope[i];
    }
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const h = dx[i] / 3;
    d += ` C${(x0 + h).toFixed(1)},${(y0 + m[i] * h).toFixed(1)} ${(x1 - h).toFixed(1)},${(y1 - m[i + 1] * h).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

// ─── Donut: part-to-whole at a glance (≤ 6 segments, the rest folded into "Other") ─

export interface DonutSegment {
  label: string;
  value: number;
  display: string;
}

export function DonutChart({ segments, caption, centerLabel, centerValue, otherLabel = "Other" }: { segments: DonutSegment[]; caption: string; centerLabel: string; centerValue: string; otherLabel?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const sorted = segments.filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const parts: (DonutSegment & { color: string })[] = top.map((s, i) => ({ ...s, color: SERIES[i] }));
  if (rest.length) {
    const v = rest.reduce((t, s) => t + s.value, 0);
    parts.push({ label: `${otherLabel} (${rest.length})`, value: v, display: rest.length === 1 ? rest[0].display : "", color: "var(--viz-other)" });
  }
  const total = parts.reduce((t, s) => t + s.value, 0);
  if (total <= 0) return <p className="text-[13px] text-faint">No priced active subscriptions yet.</p>;
  const R = 70;
  const r = 50;
  const C = 90;
  const gap = parts.length > 1 ? 0.012 : 0; // fraction of the circle left as a surface gap between segments
  const starts = parts.map((_, i) => -0.25 + parts.slice(0, i).reduce((t, q) => t + q.value / total, 0));
  const arcs = parts.map((p, i) => {
    const frac = p.value / total;
    const start = starts[i];
    const a0 = (start + gap / 2) * 2 * Math.PI;
    const a1 = (start + frac - gap / 2) * 2 * Math.PI;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const pt = (rad: number, ang: number) => `${(C + rad * Math.cos(ang)).toFixed(2)},${(C + rad * Math.sin(ang)).toFixed(2)}`;
    const d = frac >= 0.999 ? `M${C - R},${C} a${R},${R} 0 1,0 ${R * 2},0 a${R},${R} 0 1,0 -${R * 2},0 M${C - r},${C} a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0` : `M${pt(R, a0)} A${R},${R} 0 ${large} 1 ${pt(R, a1)} L${pt(r, a1)} A${r},${r} 0 ${large} 0 ${pt(r, a0)} Z`;
    return { ...p, d, i };
  });
  const active = hover !== null ? parts[hover] : null;
  return (
    <div style={vizVars} className="@container">
      <div className="flex flex-col items-center gap-4 @md:flex-row">
        <div className="relative shrink-0">
          <svg viewBox="0 0 180 180" width="180" height="180" className="viz-sweep" role="img" aria-label={`${caption}: ${parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)}%`).join(", ")}`}>
            {arcs.map((a) => (
              <path
                key={a.label}
                d={a.d}
                fill={a.color}
                fillRule="evenodd"
                tabIndex={0}
                className="cursor-default outline-none transition-opacity"
                opacity={hover === null || hover === a.i ? 1 : 0.35}
                onPointerEnter={() => setHover(a.i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(a.i)}
                onBlur={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-faint">{active ? active.label : centerLabel}</span>
            <span className="tabular text-[15px] font-semibold text-heading">{active ? `${Math.round((active.value / total) * 100)}%` : centerValue}</span>
            {active?.display && <span className="tabular text-[11px] text-muted">{active.display}</span>}
          </div>
        </div>
        <ul className="w-full min-w-0 space-y-1.5 text-[12.5px]">
          {parts.map((p, i) => (
            <li key={p.label} className={cn("flex items-center gap-2 rounded-md px-1.5 py-0.5", hover === i && "bg-subtle")} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px]" style={{ background: p.color }} />
              <span className="min-w-0 truncate text-muted">{p.label}</span>
              <span className="tabular ml-auto whitespace-nowrap font-medium text-fg">
                {p.display} <span className="font-normal text-faint">{Math.round((p.value / total) * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Sparkline: a tile's trend at a glance ───────────────────────────────────

export function Sparkline({ values, label, tone = "accent", height = 36 }: { values: number[]; label: string; tone?: "accent" | "light"; height?: number }) {
  const id = useId();
  if (values.length < 2) return null;
  const W = 120;
  const H = height;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts: [number, number][] = values.map((v, i) => [(i / (values.length - 1)) * W, H - 3 - ((v - min) / span) * (H - 8)]);
  const line = monotonePath(pts);
  const color = tone === "light" ? "#ffffff" : "var(--accent)";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="viz-wipe block w-full" style={{ height: H }} role="img" aria-label={label}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={tone === "light" ? 0.35 : 0.25} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} className="viz-fade" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Radial gauge: one ratio against 100% ────────────────────────────────────

export function RadialGauge({ value, label, sub, size = 132 }: { value: number | null; label: string; sub?: string; size?: number }) {
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  const stroke = 12;
  const rad = (size - stroke) / 2;
  const circ = 2 * Math.PI * rad;
  // Three-quarter arc, opening at the bottom.
  const arc = circ * 0.75;
  const tone = value === null ? "var(--viz-other)" : v < 60 ? "#eda100" : "var(--accent)";
  return (
    <div style={vizVars} className="relative inline-flex" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[225deg]">
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="color-mix(in oklab, var(--accent) 12%, white)" strokeWidth={stroke} strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={rad}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeDasharray={`${(arc * v) / 100} ${circ}`}
          strokeLinecap="round"
          className="viz-gauge"
          style={{ "--so-circ": circ } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[1.6rem] font-semibold leading-none text-heading">{value === null ? "—" : `${Math.round(v)}%`}</span>
        {sub && <span className="mt-1 max-w-[80%] text-[11px] leading-tight text-faint">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Renewal timeline: the next weeks with each renewal's logo on its date ───

export interface TimelineItem {
  id: string;
  name: string;
  logo: string | null;
  date: string;
  dateLabel: string;
  daysLeft: number;
  amount: string | null;
  href: string;
  kind?: "renewal" | "deadline";
}

export function RenewalTimeline({ items, days, startLabel }: { items: TimelineItem[]; days: number; startLabel: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const shown = items.filter((i) => i.daysLeft >= 0 && i.daysLeft <= days).sort((a, b) => a.daysLeft - b.daysLeft);
  // Greedy lanes so logos that fall close together stack instead of overlapping.
  const lanes: number[] = [];
  const placed = shown.map((it) => {
    const pct = (it.daysLeft / days) * 100;
    let lane = lanes.findIndex((end) => pct - end >= 5.5);
    if (lane === -1) {
      lane = lanes.length < 3 ? lanes.length : lanes.indexOf(Math.min(...lanes));
      if (lane >= lanes.length) lanes.push(pct);
    }
    lanes[lane] = pct;
    return { ...it, pct, lane, key: `${it.id}-${it.kind ?? "renewal"}` };
  });
  const laneCount = Math.max(1, lanes.length);
  const weeks = Math.floor(days / 7);
  const active = placed.find((p) => p.key === hover) ?? null;
  const next = placed[0] ?? null;
  const readout = active ?? next;
  if (shown.length === 0) return <p className="text-[13px] text-faint">Nothing renews in the next {days} days.</p>;
  return (
    <div style={vizVars}>
      {/* Readout: the hovered (or next) item, outside the scroll area so it's never clipped. */}
      <p className="mb-3 flex min-h-5 flex-wrap items-center gap-x-1.5 text-[12.5px]" aria-live="polite">
        {readout && (
          <>
            <span className="text-faint">{active ? "" : "Next: "}</span>
            <strong className="font-semibold text-fg">{readout.name}</strong>
            <span className="text-muted">
              {readout.kind === "deadline" ? "cancel by" : "renews"} {readout.dateLabel} · {readout.daysLeft === 0 ? "today" : `in ${readout.daysLeft} day${readout.daysLeft === 1 ? "" : "s"}`}
            </span>
            {readout.amount && <span className="tabular font-medium text-fg">· {readout.amount}</span>}
          </>
        )}
      </p>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="relative min-w-[600px]" style={{ height: 34 + laneCount * 40 }}>
          {/* the window, with the first week shaded */}
          <div className="viz-grow-x absolute bottom-[22px] left-0 h-[3px] rounded-full bg-accent/25" style={{ width: `${(7 / days) * 100}%` }} />
          <div className="absolute inset-x-0 bottom-[22px] h-px bg-[var(--viz-axis)]" />
          {Array.from({ length: weeks + 1 }, (_, w) => {
            const pct = ((w * 7) / days) * 100;
            return (
              <div key={w} className={cn("absolute bottom-0 flex flex-col", w === 0 ? "items-start" : w === weeks && pct >= 99 ? "-translate-x-full items-end" : "-translate-x-1/2 items-center")} style={{ left: `${pct}%` }}>
                <span className="mb-1 h-2 w-px bg-[var(--viz-axis)]" />
                <span className="whitespace-nowrap text-[10.5px] text-[var(--viz-muted)]">{w === 0 ? startLabel : `+${w * 7}d`}</span>
              </div>
            );
          })}
          {placed.map((it, i) => (
            <Link
              key={it.key}
              href={it.href}
              className="group absolute -translate-x-1/2 rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ left: `${Math.min(97, Math.max(3, it.pct))}%`, bottom: 30 + it.lane * 40 }}
              onPointerEnter={() => setHover(it.key)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(it.key)}
              onBlur={() => setHover(null)}
              aria-label={`${it.name}: ${it.kind === "deadline" ? "cancellation deadline" : "renews"} ${it.dateLabel}${it.amount ? `, ${it.amount}` : ""}`}
            >
              <span
                style={{ "--i": i } as CSSProperties}
                className={cn(
                  "viz-pop block rounded-[10px] ring-2 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none",
                  it.kind === "deadline" ? "ring-[#eda100]" : it.daysLeft <= 7 ? "ring-accent" : "ring-surface",
                  hover !== null && hover !== it.key && "opacity-50",
                )}
              >
                <SoftwareLogo name={it.name} src={it.logo} size={30} />
              </span>
              <span aria-hidden="true" className="absolute left-1/2 top-full h-[6px] w-px -translate-x-1/2 bg-[var(--viz-axis)]" />
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-[3px] ring-2 ring-accent" /> Renews within 7 days
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-[3px] ring-2 ring-[#eda100]" /> Cancellation deadline
        </span>
        <span className="sm:hidden">Swipe the timeline to see all {days} days →</span>
      </p>
    </div>
  );
}
