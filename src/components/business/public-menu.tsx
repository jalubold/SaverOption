"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

/** The public Business header's links on screens too narrow for the inline nav. */
export function PublicMobileMenu({ links, signedIn }: { links: { href: string; label: string }[]; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="business-public-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
      >
        <Icon name={open ? "x" : "menu"} size={19} />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open && (
        <nav id="business-public-menu" aria-label="Business" className="absolute right-0 top-full z-50 mt-2 w-[min(80vw,260px)] rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)]">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex rounded-lg px-3 py-2.5 text-[14.5px] font-medium text-fg hover:bg-subtle">
                  {l.label}
                </Link>
              </li>
            ))}
            {!signedIn && (
              <li className="mt-1 border-t border-line pt-1">
                <Link href="/business/login" onClick={() => setOpen(false)} className="flex rounded-lg px-3 py-2.5 text-[14.5px] font-medium text-fg hover:bg-subtle">
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
