import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

/** Layout pieces for the public /business landing page. */

export type TileTone = "violet" | "blue" | "aqua" | "orange" | "indigo" | "pink";

const tileTones: Record<TileTone, CSSProperties> = {
  violet: {},
  blue: { "--tile-from": "#2a78d6", "--tile-to": "#1b4f96" } as CSSProperties,
  aqua: { "--tile-from": "#1baf7a", "--tile-to": "#0c7350" } as CSSProperties,
  orange: { "--tile-from": "#eb6834", "--tile-to": "#b2441a" } as CSSProperties,
  indigo: { "--tile-from": "#6250d6", "--tile-to": "#3a2aa0" } as CSSProperties,
  pink: { "--tile-from": "#d9468f", "--tile-to": "#9b2263" } as CSSProperties,
};

const glows: Record<TileTone, string> = {
  violet: "rgb(124 58 236 / 0.24)",
  blue: "rgb(42 120 214 / 0.22)",
  aqua: "rgb(27 175 122 / 0.22)",
  orange: "rgb(235 104 52 / 0.22)",
  indigo: "rgb(98 80 214 / 0.24)",
  pink: "rgb(217 70 143 / 0.22)",
};

export function IconTile({ icon, tone = "violet", size = 40, className }: { icon: IconProps["name"]; tone?: TileTone; size?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("icon-tile shrink-0", className)} style={{ ...tileTones[tone], width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </span>
  );
}

/** One feature: copy with three bullets on one side, an example-data visual on the other. */
export function FeatureRow({
  id,
  icon,
  tone,
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip,
}: {
  id?: string;
  icon: IconProps["name"];
  tone: TileTone;
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: string[];
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <div id={id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn("so-reveal min-w-0", flip && "lg:order-2")}>
        <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-accent-ink">
          <IconTile icon={icon} tone={tone} size={38} />
          {eyebrow}
        </p>
        <h3 className="display mt-5 text-[2.1rem] sm:text-[2.7rem]">{title}</h3>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted">{body}</p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[14.5px] leading-snug text-fg">
              <span aria-hidden="true" className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <Icon name="check" size={12} strokeWidth={2.5} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("so-reveal so-scroll-viz relative isolate min-w-0", flip && "lg:order-1")}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 inset-y-10 -z-10 rounded-full blur-3xl" style={{ background: glows[tone] }} />
        {visual}
      </div>
    </div>
  );
}

/** FAQ as an accordion of native <details>, so it works without JavaScript. */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="so-reveal group rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow] open:border-accent/35 open:shadow-[0_18px_40px_-28px_rgb(124_58_236/0.5)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-[15.5px] font-medium text-heading [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform group-open:rotate-45 group-open:border-transparent group-open:bg-accent group-open:text-white">
              <Icon name="plus" size={14} />
            </span>
          </summary>
          <p className="-mt-1 px-5 pb-5 pr-14 text-[14.5px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
