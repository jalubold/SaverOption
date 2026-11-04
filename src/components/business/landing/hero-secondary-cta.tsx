"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { isDesktopApp } from "@/lib/desktop";

const noop = () => () => {};

/**
 * A Mac, decided in the browser (the page is built ahead, so the server can't know). No touch points,
 * because iPads asking for the desktop site say "Macintosh" too; and not the Mac app itself.
 */
function onMac(): boolean {
  const ua = navigator.userAgent;
  return /Macintosh/.test(ua) && navigator.maxTouchPoints === 0 && !isDesktopApp(ua);
}

/**
 * The hero's second button: on a Mac, "Get the Mac app" (to the download page, to look before
 * downloading); everywhere else, and inside the Mac app, "Explore features".
 */
export function HeroSecondaryCta({ className }: { className?: string }) {
  const mac = useSyncExternalStore(noop, onMac, () => false);
  return mac ? (
    <Link href="/business/download" className={buttonClass("secondary", "lg", className)} data-hero-mac-app>
      <Icon name="laptop" size={16} /> Get the Mac app
    </Link>
  ) : (
    <Link href="#features" className={buttonClass("secondary", "lg", className)}>
      Explore features
    </Link>
  );
}
