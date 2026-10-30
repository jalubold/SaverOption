"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { getPromoteContext } from "@/app/promote/actions";
import type { ListingPlan } from "@/config/listing-plans";
import type { PromoteContext } from "@/components/promote/flow-types";
import { PromoteFlow } from "@/components/promote/promote-flow";
import { TrafficPill } from "@/components/promote/traffic-pill";
import { Icon } from "@/components/ui/icon";

/**
 * "Promote your SaaS" popup. The provider renders the dialog once; any
 * PromoteTrigger below it opens it. The form shows straight away; the visitor's
 * details (signed in, a saved or paid submission, checkout mode) are fetched in
 * the background, starting on hover, so cached pages stay static.
 */

const OpenContext = createContext<{ open: () => void; prefetch: () => void } | null>(null);

/** Until the server answers. Checkout itself always re-checks on the server. */
const fallbackContext: PromoteContext = { mode: "live", resume: null, paidId: null, signedIn: false };

/** `plans` carry the current prices for sale, read by the (cached) root layout. */
export function PromoteProvider({ plans, children }: { plans: ListingPlan[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // The form mounts on first open (not on every page), then stays mounted so typed details are kept.
  const [opened, setOpened] = useState(false);
  const [ctx, setCtx] = useState<PromoteContext | null>(null);
  const requested = useRef(false);

  const prefetch = useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    getPromoteContext().then(setCtx, () => {
      requested.current = false; // try again next time
    });
  }, []);

  const value = useMemo(
    () => ({
      prefetch,
      open: () => {
        prefetch();
        setOpened(true);
        setOpen(true);
      },
    }),
    [prefetch],
  );

  return (
    <OpenContext.Provider value={value}>
      {children}
      <PromoteModal open={open} plans={plans} ctx={opened ? (ctx ?? fallbackContext) : null} onClose={() => setOpen(false)} />
    </OpenContext.Provider>
  );
}

/** Opens the popup. Falls back to the /promote page if there's no provider (or JS hasn't loaded). */
export function PromoteTrigger({ className, onOpen, children }: { className?: string; onOpen?: () => void; children: ReactNode }) {
  const modal = useContext(OpenContext);
  return (
    <a
      href="/promote"
      onPointerEnter={modal?.prefetch}
      onFocus={modal?.prefetch}
      onClick={(e) => {
        if (!modal || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        modal.open();
        onOpen?.();
      }}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </a>
  );
}

function PromoteModal({ open, plans, ctx, onClose }: { open: boolean; plans: ListingPlan[]; ctx: PromoteContext | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
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
        {ctx && <PromoteFlow mode={ctx.mode} provider={ctx.provider} plans={ctx.plans ?? plans} resume={ctx.resume} paidId={ctx.paidId} signedIn={ctx.signedIn} titleId={titleId} />}
      </div>
    </dialog>
  );
}
