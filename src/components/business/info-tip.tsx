"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * A small ⓘ that explains a figure on tap or hover, instead of a paragraph on the page. The
 * explanation opens under the nearest positioned ancestor (a card), across its width, so it
 * never runs off the screen on a phone.
 */
export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <span ref={ref} className="inline-flex" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-expanded={open}
        // Opens on hover and on tap/click (a click after hovering keeps it open); closes on a click
        // elsewhere, Escape or moving away.
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        onMouseEnter={() => setOpen(true)}
        className="inline-flex size-5 items-center justify-center rounded-full text-faint hover:bg-subtle hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        data-info-tip
      >
        <Icon name="info" size={13} />
      </button>
      {open && (
        <span role="tooltip" className="absolute inset-x-2 top-[calc(100%-0.25rem)] z-30 rounded-xl border border-line bg-surface px-3 py-2.5 text-left text-[12.5px] font-normal leading-relaxed text-muted shadow-[0_12px_32px_-12px_rgb(0_0_0/0.3)]">
          {children}
        </span>
      )}
    </span>
  );
}
