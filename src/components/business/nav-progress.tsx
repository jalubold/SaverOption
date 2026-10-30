"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * A thin bar at the top of the app while the next page is on its way, instead of a full-page
 * skeleton: the current page stays on screen until the next one is ready, as in a native app.
 * The bar shows only if the wait passes ~150 ms, so cached and prefetched pages switch without
 * any flicker.
 */

const START = "so:navigate";

/** For navigations that don't come from a link click (e.g. router.push in Quick jump). */
export function startNavigation(): void {
  window.dispatchEvent(new Event(START));
}

/** Clicks that lead to another page of this site (not downloads, new tabs or the current URL). */
function isPageLink(event: MouseEvent): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return false;
  const to = new URL(link.href, window.location.href);
  if (to.origin !== window.location.origin || /\/export$/.test(to.pathname)) return false;
  return to.pathname !== window.location.pathname || to.search !== window.location.search;
}

export function NavProgress() {
  const url = `${usePathname()}?${useSearchParams()}`;
  // The URL a navigation started from: still on it → waiting; moved on → the next page is on screen.
  const [from, setFrom] = useState<string | null>(null);
  const phase = from === null ? "idle" : from === url ? "busy" : "done";

  useEffect(() => {
    const begin = () => setFrom(url);
    const onClick = (event: MouseEvent) => {
      if (isPageLink(event)) begin();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener(START, begin);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START, begin);
    };
  }, [url]);

  useEffect(() => {
    if (phase === "idle") return;
    // "done" fades out; a navigation that never lands (e.g. an error) gives up after a while.
    const t = setTimeout(() => setFrom(null), phase === "done" ? 400 : 15_000);
    return () => clearTimeout(t);
  }, [phase]);

  return <div aria-hidden="true" className="so-nav-progress" data-phase={phase} data-nav-progress />;
}

/**
 * Saver Option Business for Mac: its Go menu and ⌘1–⌘9 send `so:desktop-navigate` with a path,
 * opened here like a sidebar click (the app loads the page itself when nothing takes the event).
 */
export function DesktopMenuLinks() {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const go = (event: Event) => {
      const href = (event as CustomEvent<unknown>).detail;
      if (typeof href !== "string" || !href.startsWith("/business/")) return;
      event.preventDefault();
      if (href === path) return;
      startNavigation();
      router.push(href);
    };
    window.addEventListener("so:desktop-navigate", go);
    return () => window.removeEventListener("so:desktop-navigate", go);
  }, [router, path]);
  return null;
}
