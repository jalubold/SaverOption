"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAutomatedBrowser } from "@/lib/bot-guard";

/**
 * Sends one anonymous page-view beacon per navigation. No cookies, no identifiers on the client.
 * Automated browsers (navigator.webdriver) aren't counted.
 */
export function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (isAutomatedBrowser()) return;
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/visit");
      else void fetch("/api/visit", { method: "POST", keepalive: true });
    } catch {
      // Counting is best-effort; never affect the page.
    }
  }, [pathname]);
  return null;
}
