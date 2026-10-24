import { cn } from "@/components/ui/primitives";

/**
 * A software mark in a small white tile, or a coloured monogram when there's
 * no logo. Works in server and client components (no hooks).
 */

const monoColors = ["#7c3aec", "#2a78d6", "#1baf7a", "#eb6834", "#d55181", "#0f766e", "#b45309", "#4f46e5", "#be123c", "#0369a1"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function SoftwareLogo({ name, src, size = 28, className }: { name: string; src?: string | null; size?: number; className?: string }) {
  const radius = Math.round(size * 0.28);
  if (src) {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center border border-line bg-white", className)}
        style={{ width: size, height: size, borderRadius: radius }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small local SVG marks */}
        <img src={src} alt="" width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} className="object-contain" style={{ width: size * 0.62, height: size * 0.62 }} loading="lazy" decoding="async" />
      </span>
    );
  }
  const letters = name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const color = monoColors[hash(name.toLowerCase()) % monoColors.length];
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.max(9, Math.round(size * 0.38)),
        backgroundImage: `linear-gradient(160deg, ${color}, color-mix(in oklab, ${color} 70%, black))`,
      }}
    >
      {letters || "?"}
    </span>
  );
}

/** Logo + name, for table cells and lists. */
export function SoftwareName({ name, src, sub, size = 28, className }: { name: string; src?: string | null; sub?: React.ReactNode; size?: number; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <SoftwareLogo name={name} src={src} size={size} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-fg">{name}</span>
        {sub && <span className="block truncate text-[12px] text-faint">{sub}</span>}
      </span>
    </span>
  );
}

/** Overlapping row of logos ("+3" when there are more). */
export function LogoStack({ items, max = 5, size = 24 }: { items: { name: string; src?: string | null }[]; max?: number; size?: number }) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <span className="inline-flex items-center">
      {shown.map((it, i) => (
        <span key={`${it.name}-${i}`} className={cn("rounded-[8px] ring-2 ring-surface", i > 0 && "-ml-1.5")} title={it.name}>
          <SoftwareLogo name={it.name} src={it.src} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span className="-ml-1.5 inline-flex items-center justify-center rounded-[8px] bg-subtle text-[10.5px] font-semibold text-muted ring-2 ring-surface" style={{ width: size, height: size }}>
          +{rest}
        </span>
      )}
    </span>
  );
}
