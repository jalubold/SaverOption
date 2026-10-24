"use client";

import type { ReactNode } from "react";

/**
 * Tracks the pointer over `.so-spot` cards inside it, so their spotlight
 * (a soft accent glow, see globals.css) follows the cursor. One listener for
 * the whole group; the cards themselves can stay server components.
 */
export function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const card = (e.target as HTMLElement).closest<HTMLElement>(".so-spot");
        if (!card || !e.currentTarget.contains(card)) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/** Drifting colour blooms for dark hero bands (decorative). */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className ? `so-aurora ${className}` : "so-aurora"}>
      <span />
      <span />
      <span />
    </div>
  );
}
