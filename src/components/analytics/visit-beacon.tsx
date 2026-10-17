"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sends one anonymous page-view beacon per navigation. No cookies, no identifiers on the client. */
export function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/visit");
      else void fetch("/api/visit", { method: "POST", keepalive: true });
    } catch {
      // Counting is best-effort; never affect the page.
    }
  }, [pathname]);
  return null;
}
