"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

/**
 * Motion for the public Business landing page. Everything here animates only
 * transform/opacity (or a CSS variable read by them), runs only with a fine
 * pointer where it follows the mouse, and stands still under
 * prefers-reduced-motion — the server-rendered page is complete without it.
 */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/** Sets --px/--py (0–100%) on the element as the pointer moves over it, for a light that follows the cursor. */
export function PointerLight({ className, children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
        el.dataset.lit = "";
      });
    };
    const onLeave = () => delete el.dataset.lit;
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Tilts its content a few degrees towards the pointer (tracked across the
 * window, eased) and shifts `[data-depth]` children for parallax.
 */
export function PointerTilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    let raf = 0;
    let target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      el.style.setProperty("--tx", cur.x.toFixed(4));
      el.style.setProperty("--ty", cur.y.toFixed(4));
      if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1…1 from the element's centre, eased so the edges of the screen don't over-rotate.
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 1.4)));
      target = { x: nx, y: ny };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target = { x: 0, y: 0 };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return (
    <div ref={ref} className={cn("lx-tilt", className)} style={{ "--max": `${max}deg` } as CSSProperties}>
      {children}
    </div>
  );
}

/** A number that counts up from zero the first time it's on screen. The server renders the final value. */
export function CountUp({ value, prefix = "", suffix = "", decimals = 0, duration = 1600, delay = 0, className }: { value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) => `${prefix}${new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v)}${suffix}`;
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !("IntersectionObserver" in window)) return;
    let raf = 0;
    let timer = 0;
    el.textContent = fmt(0);
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = fmt(value * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = fmt(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefix, suffix, decimals, duration, delay]);
  return (
    <span ref={ref} className={cn("tabular", className)}>
      {fmt(value)}
    </span>
  );
}

/**
 * Sets --p (0→1) on the element as it scrolls through the viewport: 0 when
 * its top reaches `start` (fraction of the viewport height from the top), 1
 * when its bottom reaches `end`. Without JavaScript --p stays at 1.
 */
export function ScrollScrub({ children, className, start = 0.85, end = 0.45, as: Tag = "div", style }: { children: ReactNode; className?: string; start?: number; end?: number; as?: "div" | "section" | "ol" | "p"; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start;
      const to = vh * end;
      // Progress over the distance the element travels from "top at start" to "bottom at end".
      const total = r.height + (from - to);
      const p = Math.max(0, Math.min(1, (from - r.top) / (total || 1)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [start, end]);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** A paragraph whose words light up one after another as it scrolls into place. */
export function ScrollWords({ text, accent = [], className }: { text: string; accent?: string[]; className?: string }) {
  const words = text.split(/\s+/);
  return (
    <ScrollScrub as="p" className={cn("lx-words", className)} start={0.9} end={0.55} style={{ "--n": words.length } as CSSProperties}>
      {words.map((w, i) => (
        <span key={i} className={cn("lx-word", accent.includes(w.replace(/[^\w]/g, "")) && "lx-word-accent")} style={{ "--i": i } as CSSProperties}>
          {w}{" "}
        </span>
      ))}
    </ScrollScrub>
  );
}

/** Nudges its child a few pixels towards the pointer while hovered. */
export function Magnetic({ children, className, strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${Math.max(-10, Math.min(10, x))}px, ${Math.max(-8, Math.min(8, y))}px, 0)`;
    };
    const onLeave = () => (el.style.transform = "");
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={cn("lx-magnetic", className)}>
      {children}
    </div>
  );
}

export interface StoryItem {
  id: string;
  icon: IconProps["name"];
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: string[];
  visual: ReactNode;
}

/**
 * Feature storytelling: on large screens the copy scrolls on the left while a
 * sticky panel on the right swaps to that feature's visual (replaying its
 * charts each time it arrives). On smaller screens each visual sits under its copy.
 */
export function FeatureStory({ items }: { items: StoryItem[] }) {
  const [active, setActive] = useState(0);
  const [runs, setRuns] = useState<number[]>(() => items.map(() => 0));
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  // -1 so the first step's arrival also replays its charts (they drew once, off screen, on load).
  const current = useRef(-1);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(() => items.map(() => 1));
  // Fit each visual into the sticky panel (tall ones scale down on short screens).
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const measure = () =>
      setScales(
        panels.current.map((inner) => {
          const box = inner?.parentElement;
          if (!inner || !box) return 1;
          const h = inner.scrollHeight;
          return h > 0 ? Math.min(1, (box.clientHeight - 8) / h) : 1;
        }),
      );
    const ro = new ResizeObserver(measure);
    for (const p of panels.current) if (p) ro.observe(p);
    if (panels.current[0]?.parentElement) ro.observe(panels.current[0].parentElement);
    measure();
    return () => ro.disconnect();
  }, [runs]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.step);
          if (i === current.current) continue;
          current.current = i;
          setActive(i);
          // Remounting the visual replays its chart animations as it arrives.
          if (!reduced()) setRuns((r) => r.map((n, j) => (j === i ? n + 1 : n)));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const s of steps.current) if (s) io.observe(s);
    return () => io.disconnect();
  }, []);
  return (
    <div className="relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
      <ol className="relative min-w-0">
        <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 hidden w-px bg-line lg:block" />
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-6 hidden w-px origin-top bg-linear-to-b from-accent via-accent to-transparent transition-[height] duration-700 ease-out lg:block"
          style={{ height: `calc(${((active + 1) / items.length) * 100}% - 3rem)` }}
        />
        {items.map((it, i) => (
          <li
            key={it.id}
            id={it.id}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-step={i}
            data-active={active === i ? "" : undefined}
            className="lx-step relative scroll-mt-24 py-10 lg:min-h-[78vh] lg:py-[18vh] lg:pl-16 lg:last:min-h-[60vh]"
          >
            <span aria-hidden="true" className="lx-step-dot absolute left-0 top-[calc(18vh+0.25rem)] hidden size-10 items-center justify-center rounded-full border border-line-strong bg-bg lg:flex">
              <Icon name={it.icon} size={17} />
            </span>
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              <span className="tabular text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
              {it.eyebrow}
            </p>
            <h3 className="display mt-5 text-[2.3rem] sm:text-[3rem]">{it.title}</h3>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{it.body}</p>
            <ul className="mt-6 space-y-3">
              {it.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[14.5px] leading-snug text-fg/90">
                  <span aria-hidden="true" className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                    <Icon name="check" size={12} strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="so-reveal so-scroll-viz mt-10 lg:hidden">{it.visual}</div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="sticky top-[12vh] h-[76vh]">
          <div aria-hidden="true" className="lx-story-glow pointer-events-none absolute inset-[8%] -z-10 rounded-full blur-[90px]" />
          {items.map((it, i) => (
            <div key={`${it.id}-${runs[i]}`} className="lx-story-panel absolute inset-0 flex items-center justify-center" data-active={active === i ? "" : undefined} aria-hidden={active === i ? undefined : true}>
              <div
                ref={(el) => {
                  panels.current[i] = el;
                }}
                className="w-full origin-center"
                style={scales[i] < 1 ? { transform: `scale(${scales[i].toFixed(3)})` } : undefined}
              >
                {it.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
