"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/components/ui/primitives";
import { viewCookie, type ListView } from "@/lib/business/list-view";

function remember(name: string, view: ListView) {
  document.cookie = `${viewCookie(name)}=${view}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * List or cards (the default) for a list page (Subscriptions, Software). The choice is remembered in a cookie,
 * so it stays when the tab, the filters or the page change.
 */
export function ViewToggle({ name, value }: { name: "subscriptions" | "software"; value: ListView }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const pick = (v: ListView) => {
    if (v === value) return;
    remember(name, v);
    const url = new URL(window.location.href);
    const hadParam = url.searchParams.has("view");
    url.searchParams.delete("view");
    startTransition(() => {
      if (hadParam) router.replace(`${url.pathname}${url.search}`, { scroll: false });
      router.refresh();
    });
  };
  return (
    <div role="group" aria-label="View" aria-busy={pending} className="inline-flex h-9 shrink-0 items-center rounded-[9px] border border-line-strong bg-surface p-0.5" data-view-toggle>
      {(
        [
          ["list", "List", <ListIcon key="l" />],
          ["cards", "Cards", <CardsIcon key="c" />],
        ] as const
      ).map(([v, label, icon]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => pick(v)}
          title={label}
          className={cn(
            "inline-flex h-full items-center gap-1.5 rounded-[7px] px-2.5 text-[12.5px] font-medium transition-colors",
            value === v ? "bg-subtle text-fg shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted hover:text-fg",
          )}
          data-view={v}
        >
          {icon}
          <span className="max-sm:sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </svg>
  );
}

function CardsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}
