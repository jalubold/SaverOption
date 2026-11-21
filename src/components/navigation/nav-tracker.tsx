"use client";

import { useEffect } from "react";
import { rememberNavigation } from "@/lib/load-recovery";

/**
 * Notes each internal link the visitor follows (before Next.js handles the click), so that if the
 * navigation fails to load the next page's code, the error screen can open that page in full instead
 * (see src/lib/load-recovery.ts). Renders nothing.
 */
export function NavTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      rememberNavigation(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
