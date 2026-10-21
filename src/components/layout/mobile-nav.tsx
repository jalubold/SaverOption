"use client";

import Link from "next/link";
import { PromoteTrigger } from "@/components/promote/promote-modal";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";

export function MobileNav({ items }: { items: readonly { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Close when navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
      >
        <Icon name={open ? "x" : "menu"} size={20} />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open && (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="absolute inset-x-0 top-16 border-b border-line bg-surface px-4 pb-4 pt-2 shadow-sm"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-fg hover:bg-subtle"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* The header CTA is hidden on phones, so the menu offers it instead. */}
          <PromoteTrigger onOpen={() => setOpen(false)} className={buttonClass("primary", "md", "mt-2 w-full sm:hidden")}>
            Promote your SaaS
            <Icon name="arrow-up-right" size={14} />
          </PromoteTrigger>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg px-3 py-3 text-center text-sm font-medium text-muted hover:bg-subtle hover:text-fg sm:hidden"
          >
            Advertiser sign in
          </Link>
        </nav>
      )}
    </div>
  );
}
