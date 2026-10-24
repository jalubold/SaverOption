"use client";

import { useEffect, type ReactNode } from "react";

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

/**
 * Reveals `.so-reveal` sections once as they scroll into view, and holds the
 * chart animations inside `.so-scroll-viz` until then. Only content still
 * below the fold is hidden, and only after hydration, so without JavaScript
 * (or with reduced motion) everything is simply shown.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".so-reveal, .so-scroll-viz")).filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    const show = (el: HTMLElement) => {
      el.classList.remove("is-pending");
      el.classList.add("is-in");
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of els) {
      el.classList.add("is-pending");
      io.observe(el);
    }
    // Printing shows everything.
    const reveal = () => els.forEach(show);
    window.addEventListener("beforeprint", reveal);
    return () => {
      io.disconnect();
      window.removeEventListener("beforeprint", reveal);
      els.forEach((el) => el.classList.remove("is-pending", "is-in"));
    };
  }, []);
  return null;
}
