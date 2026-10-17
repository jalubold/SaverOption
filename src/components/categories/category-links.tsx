import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import type { Category } from "@/lib/types";

type CategoryWithCount = Category & { count: number };

/** Compact pill links for quick access (hero, empty states). */
export function CategoryChips({ categories, className }: { categories: Category[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/categories/${c.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <Icon name={c.icon} size={14} className="text-accent" />
            {c.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Category tiles with descriptions and live offer counts. */
export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/categories/${c.slug}`}
            className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
              <Icon name={c.icon} size={18} />
            </span>
            <span className="mt-3 text-sm font-semibold text-fg group-hover:text-accent-ink">{c.name}</span>
            <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{c.description}</span>
            <span className="tabular mt-auto pt-3 text-xs text-faint">
              {c.count === 0 ? "No active offers" : `${c.count} active ${c.count === 1 ? "offer" : "offers"}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
