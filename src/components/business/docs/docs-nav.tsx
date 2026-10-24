"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/primitives";

export interface NavItem {
  href: string;
  label: string;
  group: string;
}

function NavList({ path, items, groups }: { path: string; items: NavItem[]; groups: string[] }) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">{group}</p>
          <ul className="space-y-0.5">
            {items
              .filter((d) => d.group === group)
              .map((d) => {
                const on = path === d.href;
                return (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      aria-current={on ? "page" : undefined}
                      className={cn("block rounded-lg px-2 py-1.5 text-[13.5px] transition-colors", on ? "bg-accent-soft font-medium text-accent-ink" : "text-muted hover:bg-subtle hover:text-fg")}
                    >
                      {d.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Side navigation on large screens; a collapsible menu above the page on small
 * ones. Items come from the server, so the docs content isn't shipped to the browser.
 */
export function DocsNav({ items, groups }: { items: NavItem[]; groups: string[] }) {
  const path = usePathname() ?? "";
  const current = items.find((d) => d.href === path);
  return (
    <>
      <details className="group rounded-xl border border-line bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-[14px] font-medium text-fg [&::-webkit-details-marker]:hidden">
          <span>
            <span className="text-faint">Docs · </span>
            {current?.label ?? "Contents"}
          </span>
          <span aria-hidden="true" className="text-faint transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <nav aria-label="Documentation" className="border-t border-line px-2 py-3">
          <NavList path={path} items={items} groups={groups} />
        </nav>
      </details>
      <nav aria-label="Documentation" className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6 lg:block">
        <NavList path={path} items={items} groups={groups} />
      </nav>
    </>
  );
}
