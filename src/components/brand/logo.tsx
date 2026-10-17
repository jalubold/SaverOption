import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/components/ui/primitives";

/** Built-in brand mark: a price tag folded into a rounded square. Tinted by the accent color. */
export function BrandMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path
        d="M9 9.5h7.6l6.9 6.9a1.6 1.6 0 0 1 0 2.2l-4.9 4.9a1.6 1.6 0 0 1-2.2 0L9.5 16.6V9.5"
        fill="none"
        stroke="var(--accent-contrast)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="13.4" cy="13.4" r="1.6" fill="var(--accent-contrast)" />
    </svg>
  );
}

export function Logo({ className, showName = true }: { className?: string; showName?: boolean }) {
  const { logo, name } = siteConfig;
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 rounded-md text-fg", className)}
      aria-label={`${name} home`}
    >
      {logo.kind === "image" ? (
        <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt ?? ""} priority />
      ) : (
        <BrandMark />
      )}
      {showName && <span className="text-[17px] font-semibold tracking-tight">{name}</span>}
    </Link>
  );
}
