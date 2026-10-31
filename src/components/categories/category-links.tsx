import Link from "next/link";
import { CollectionGrid } from "@/components/categories/collection-tile";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { categoryPath, type DealsBase } from "@/lib/deals-paths";
import type { Category, Product } from "@/lib/types";

type CategoryWithCount = Category & { count: number; products: Product[] };

/** Compact pill links for quick access (hero, empty states). */
export function CategoryChips({ categories, className, base = "/deals" }: { categories: Category[]; className?: string; base?: DealsBase }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={categoryPath(c.slug, base)}
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

/** Category tiles with descriptions, live offer counts and product logos. Busiest categories lead as wide tiles. */
export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  const ordered = [...categories].sort((a, b) => b.count - a.count).slice(0, 2);
  const rest = categories.filter((c) => !ordered.includes(c));
  return (
    <CollectionGrid items={[...ordered, ...rest].map((c) => ({ ...c, href: `/categories/${c.slug}` }))} />
  );
}
