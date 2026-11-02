"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui/primitives";

/**
 * A bottom sheet, the way phone apps show menus and options: it slides up from the bottom
 * edge over a dimmed page, and closes on the backdrop, Escape, a swipe down on its top
 * strip, or the page changing. The page behind it doesn't scroll while it's open.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  ...rest
}: {
  open: boolean;
  onClose: () => void;
  /** Shown at the top of the sheet (and read out as its name). */
  title?: string;
  children: ReactNode;
  /** Pinned under the scrolling content (a Done button). */
  footer?: ReactNode;
  className?: string;
} & { [data: `data-${string}`]: string | boolean | undefined }) {
  const id = useId();
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    // Focus the sheet so keyboard and screen-reader users land in it.
    panel.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = before;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const onStart = (y: number) => {
    start.current = y;
  };
  const onMove = (y: number) => {
    if (start.current === null) return;
    setDrag(Math.max(0, y - start.current));
  };
  const onEnd = () => {
    if (start.current === null) return;
    start.current = null;
    if (drag > 72) onClose();
    setDrag(0);
  };

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="presentation">
      <button type="button" aria-label="Close" tabIndex={-1} className="sheet-backdrop absolute inset-0 bg-black/45" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? id : undefined}
        aria-label={title ? undefined : "Options"}
        tabIndex={-1}
        className={cn(
          "sheet-panel absolute inset-x-0 bottom-0 mx-auto flex max-h-[min(88dvh,720px)] w-full max-w-lg flex-col rounded-t-[22px] border border-b-0 border-line bg-surface text-fg shadow-[0_-18px_50px_-20px_rgb(0_0_0/0.45)] outline-none",
          className,
        )}
        style={drag ? { transform: `translateY(${drag}px)`, transition: "none" } : undefined}
        {...rest}
      >
        <div
          className="shrink-0 cursor-grab touch-none select-none px-5 pb-1 pt-2.5"
          onTouchStart={(e) => onStart(e.touches[0].clientY)}
          onTouchMove={(e) => onMove(e.touches[0].clientY)}
          onTouchEnd={onEnd}
          onTouchCancel={onEnd}
        >
          <span aria-hidden="true" className="mx-auto block h-[5px] w-10 rounded-full bg-line-strong" />
          {title && (
            <p id={id} className="mt-3 text-center text-[15px] font-semibold text-fg">
              {title}
            </p>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-1">{children}</div>
        {footer && <div className="shrink-0 border-t border-line px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">{footer}</div>}
        {!footer && <div aria-hidden="true" className="h-[env(safe-area-inset-bottom)] shrink-0" />}
      </div>
    </div>,
    document.body,
  );
}

/** True on phone-width screens (under 640px), where menus open as bottom sheets. False on the server. */
export function usePhone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 639.98px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 639.98px)").matches,
    () => false,
  );
}
