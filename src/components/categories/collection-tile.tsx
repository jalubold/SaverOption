import Link from "next/link";
import type { CSSProperties } from "react";
import { ProductLogo } from "@/components/offers/product-logo";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import type { IconName, Product } from "@/lib/types";

export interface Collection {
  href: string;
  name: string;
  description: string;
  icon: IconName;
  color: { from: string; to: string };
  count: number;
  products: Product[];
}

/** Bento grid of collection tiles: the first `featured` tiles are wide and dark, the rest sit in four columns. */
export function CollectionGrid({
  items,
  eyebrow,
  featured = 2,
}: {
  items: Collection[];
  /** Small label above each name, e.g. "Saver Option for". */
  eyebrow?: string;
  featured?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item, i) => (
        <li key={item.href} className={cn(i < featured && "col-span-2")}>
          <CollectionTile item={item} eyebrow={eyebrow} featured={i < featured} />
        </li>
      ))}
    </ul>
  );
}

export function CollectionTile({ item, eyebrow, featured = false }: { item: Collection; eyebrow?: string; featured?: boolean }) {
  const shown = item.products.slice(0, featured ? 5 : 3);
  const more = item.products.length - shown.length;

  return (
    <Link
      href={item.href}
      style={{ "--tile-from": item.color.from, "--tile-to": item.color.to } as CSSProperties}
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
          <Icon name={item.icon} size={featured ? 22 : 19} />
        </span>
        <span className="tabular whitespace-nowrap rounded-full border border-line bg-subtle px-2.5 py-1 text-[11px] font-medium text-muted">
          {item.count === 0 ? (
            "Soon"
          ) : (
            <>
              {item.count}
              {/* Narrow two-column tiles show just the number. */}
              <span className={featured ? undefined : "sr-only sm:not-sr-only"}> {item.count === 1 ? "offer" : "offers"}</span>
            </>
          )}
        </span>
      </span>

      {eyebrow && (
        <span className="relative mt-5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-faint sm:tracking-[0.12em]">
          {eyebrow}
        </span>
      )}
      <span
        className={cn(
          "display relative block",
          eyebrow ? "mt-1" : "mt-5",
          featured ? "text-[2.25rem] sm:text-[2.75rem]" : "text-[1.6rem] sm:text-[1.9rem]",
        )}
      >
        {item.name}
      </span>
      <span
        className={cn(
          "relative mt-2 text-[13px] leading-snug text-muted",
          featured ? "block max-w-sm sm:text-[14px]" : "hidden sm:line-clamp-2",
        )}
      >
        {item.description}
      </span>

      <span className="relative mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="flex items-center gap-1.5">
          {shown.map((p, i) => (
            // Narrow two-column tiles on phones show one logo fewer.
            <span key={p.id} className={cn("flex", !featured && i === 2 && "hidden sm:flex")}>
              <ProductLogo product={p} size="xs" />
            </span>
          ))}
          {!featured && item.products.length > 2 && (
            <span className="tabular ml-0.5 text-[11px] font-medium text-faint sm:hidden">+{item.products.length - 2}</span>
          )}
          {more > 0 && (
            <span className={cn("tabular ml-0.5 text-[11px] font-medium text-faint", !featured && "hidden sm:inline")}>+{more}</span>
          )}
        </span>
        <span
          className={cn(
            featured ? "inline-flex" : "hidden sm:inline-flex",
            "size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-transparent group-hover:bg-[var(--tile-to)] group-hover:text-white",
          )}
        >
          <Icon name="arrow-right" size={15} />
        </span>
      </span>
    </Link>
  );
}
