"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The row the view switch sits in. When it doesn't fit (phones), it scrolls sideways out to the
 * screen's edges, and the current view is brought into view whenever the page changes.
 */
export function ViewTabsRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    const on = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!on) return;
    const n = nav.getBoundingClientRect();
    const r = on.getBoundingClientRect();
    if (r.left >= n.left && r.right <= n.right) return;
    nav.scrollLeft += r.left - n.left - (n.width - r.width) / 2;
  });
  return (
    <nav ref={ref} aria-label="Views" className="no-scrollbar mb-4 overflow-x-auto max-sm:-mx-4 max-sm:px-4" data-view-tabs>
      {children}
    </nav>
  );
}
