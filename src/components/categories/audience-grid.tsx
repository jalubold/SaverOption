import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ProductLogo } from "@/components/offers/product-logo";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import type { CSSProperties } from "react";
import type { Audience, Product } from "@/lib/types";

type AudienceCard = Audience & { count: number; products: Product[] };

/** The first collections get wide, dark feature cards; the rest sit in a 4-column grid. */
const FEATURED = 2;

/** "Saver Option for …" collection cards, laid out as a bento grid. */
export function AudienceGrid({ audiences }: { audiences: AudienceCard[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {audiences.map((a, i) => (
        <li key={a.slug} className={cn(i < FEATURED && "col-span-2")}>
          <AudienceTile audience={a} featured={i < FEATURED} />
        </li>
      ))}
    </ul>
  );
}

function AudienceTile({ audience: a, featured }: { audience: AudienceCard; featured: boolean }) {
  const shown = a.products.slice(0, featured ? 5 : 3);
  const more = a.products.length - shown.length;

  return (
    <Link
      href={`/for/${a.slug}`}
      style={{ "--tile-from": a.color.from, "--tile-to": a.color.to } as CSSProperties}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-line p-4 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--tile-from)_45%,transparent)] hover:shadow-[var(--shadow-card-hover)] sm:p-5",
        featured ? "theme-dark hero-glow bg-bg sm:p-6" : "bg-surface",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-[var(--tile-from)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
      />

      <span className="relative flex items-start justify-between gap-3">
        <span className={cn("icon-tile", featured ? "size-12" : "size-10 sm:size-11")}>
          <Icon name={a.icon} size={featured ? 22 : 19} />
        </span>
        <span className="tabular whitespace-nowrap rounded-full border border-line bg-subtle px-2.5 py-1 text-[11px] font-medium text-muted">
          {a.count === 0 ? (
            "Soon"
          ) : (
            <>
              {a.count}
              {/* Narrow two-column tiles show just the number. */}
              <span className={featured ? undefined : "sr-only sm:not-sr-only"}> {a.count === 1 ? "offer" : "offers"}</span>
            </>
          )}
        </span>
      </span>

      <span className="relative mt-5 block text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.12em] text-faint">
        {siteConfig.name} for
      </span>
      <span
        className={cn(
          "display relative mt-1 block",
          featured ? "text-[2.25rem] sm:text-[2.75rem]" : "text-[1.6rem] sm:text-[1.9rem]",
        )}
      >
        {a.name}
      </span>
      <span
        className={cn(
          "relative mt-2 text-[13px] leading-snug text-muted",
          featured ? "block max-w-sm sm:text-[14px]" : "hidden sm:line-clamp-2",
        )}
      >
        {a.description}
      </span>

      <span className="relative mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="flex items-center gap-1.5">
          {shown.map((p, i) => (
            // Narrow two-column tiles on phones show one logo fewer.
            <span key={p.id} className={cn("flex", !featured && i === 2 && "hidden sm:flex")}>
              <ProductLogo product={p} size="xs" />
            </span>
          ))}
          {!featured && a.products.length > 2 && (
            <span className="tabular ml-0.5 text-[11px] font-medium text-faint sm:hidden">+{a.products.length - 2}</span>
          )}
          {more > 0 && (
            <span className={cn("tabular ml-0.5 text-[11px] font-medium text-faint", !featured && "hidden sm:inline")}>+{more}</span>
          )}
        </span>
        <span className={cn(featured ? "inline-flex" : "hidden sm:inline-flex", "size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-transparent group-hover:bg-[var(--tile-to)] group-hover:text-white")}>
          <Icon name="arrow-right" size={15} />
        </span>
      </span>
    </Link>
  );
}
