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
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <Icon name={c.icon} size={14} className="text-accent-ink" />
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
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/categories/${c.slug}`}
            className="group flex h-full min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
              <Icon name={c.icon} size={19} />
            </span>
            <span className="mt-3 text-[15px] font-semibold leading-snug text-fg group-hover:text-accent-ink sm:mt-4">{c.name}</span>
            <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{c.description}</span>
            <span className="tabular mt-auto pt-4 text-[11px] font-medium uppercase tracking-wider text-faint">
              {c.count === 0 ? "No active offers" : `${c.count} active ${c.count === 1 ? "offer" : "offers"}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
