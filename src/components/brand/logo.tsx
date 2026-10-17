import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/components/ui/primitives";

/** Built-in brand mark: a price tag on a glossy accent tile. Colors come from the theme tokens. */
export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="brand-mark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-deep)" }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#brand-mark-fill)" />
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1.5" />
      <path
        d="M9 9.5h7.6l6.9 6.9a1.6 1.6 0 0 1 0 2.2l-4.9 4.9a1.6 1.6 0 0 1-2.2 0L9.5 16.6V9.5"
        fill="rgb(255 255 255 / 0.16)"
        style={{ stroke: "var(--accent-contrast)" }}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="13.4" cy="13.4" r="1.6" style={{ fill: "var(--accent-contrast)" }} />
    </svg>
  );
}

export function Logo({ className, showName = true }: { className?: string; showName?: boolean }) {
  const { logo, name } = siteConfig;
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-md text-fg", className)}
      aria-label={`${name} home`}
    >
      {logo.kind === "image" ? (
        <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt ?? ""} priority />
      ) : (
        <BrandMark />
      )}
      {showName && <span className="whitespace-nowrap text-[16px] font-semibold tracking-tight">{name}</span>}
    </Link>
  );
}
