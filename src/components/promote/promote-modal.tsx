"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { getPromoteContext } from "@/app/promote/actions";
import type { PromoteContext } from "@/components/promote/flow-types";
import { PromoteFlow } from "@/components/promote/promote-flow";
import { TrafficPill } from "@/components/promote/traffic-pill";
import { Icon } from "@/components/ui/icon";

/**
 * "Promote your SaaS" popup. The provider renders the dialog once; any
 * PromoteTrigger below it opens it. The checkout mode and any saved submission
 * are fetched from the server when it opens, so cached pages stay static.
 */

const OpenContext = createContext<(() => void) | null>(null);

export function PromoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  return (
    <OpenContext.Provider value={openModal}>
      {children}
      <PromoteModal open={open} onClose={() => setOpen(false)} />
    </OpenContext.Provider>
  );
}

/** Opens the popup. Falls back to the /promote page if there's no provider (or JS hasn't loaded). */
export function PromoteTrigger({ className, onOpen, children }: { className?: string; onOpen?: () => void; children: ReactNode }) {
  const open = useContext(OpenContext);
  return (
    <a
      href="/promote"
      onClick={(e) => {
        if (!open || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        open();
        onOpen?.();
      }}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </a>
  );
}

function PromoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [ctx, setCtx] = useState<PromoteContext | null>(null);
  const [failed, setFailed] = useState(false);
  const pathname = usePathname();

  // Any navigation (a link inside, or "already paid" → status page) closes the popup.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Drive the native dialog: it traps focus, handles Escape and restores focus to the trigger on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Load the visitor's checkout mode (and any saved submission) the first time it opens.
  useEffect(() => {
    if (!open || ctx) return;
    let cancelled = false;
    getPromoteContext()
      .then((c) => !cancelled && setCtx(c))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [open, ctx]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      className="theme-dark m-auto w-[calc(100%-1.5rem)] max-w-xl overflow-visible bg-transparent p-0 text-fg backdrop:bg-black/65 backdrop:backdrop-blur-sm sm:w-[calc(100%-3rem)]"
    >
      <div className="hero-glow relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[20px] border border-line bg-bg p-5 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          <Icon name="x" size={18} />
          <span className="sr-only">Close</span>
        </button>
        <div className="mb-3">
          <TrafficPill />
        </div>
        {ctx ? (
          // Stays mounted between openings, so typed details are kept.
          <PromoteFlow mode={ctx.mode} resume={ctx.resume} paidId={ctx.paidId} titleId={titleId} />
        ) : failed ? (
          <div>
            <h2 id={titleId} className="display pr-10 text-[1.75rem]">
              Promote your <em className="accent">SaaS</em>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Couldn&apos;t load the form.{" "}
              <a href="/promote" className="font-medium text-accent-ink underline underline-offset-2">
                Open it on its own page
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center" aria-live="polite">
            <h2 id={titleId} className="sr-only">
              Promote your SaaS
            </h2>
            <span aria-hidden="true" className="size-6 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
            <span className="sr-only">Loading…</span>
          </div>
        )}
      </div>
    </dialog>
  );
}
