"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { listingPlans, type ListingPlan } from "@/config/listing-plans";
import { buildListingEmail, formatPlanPrice } from "@/components/promote/submission";
import { emptyDetails, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * "Promote your SaaS" — listing request form (details + plan).
 * For now, Continue opens the visitor's email app with the submission
 * pre-filled (see ./submission.ts); nothing is saved, sent from the site
 * or charged. A real checkout can replace `buildListingEmail` later.
 */

type View = "form" | "email";

const PromoteContext = createContext<(() => void) | null>(null);

/** Renders the modal once and lets any trigger below it open it. */
export function PromoteSaasProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  return (
    <PromoteContext.Provider value={openModal}>
      {children}
      <PromoteSaasModal open={open} onClose={() => setOpen(false)} />
    </PromoteContext.Provider>
  );
}

/** Opens the modal. Pass `className` to style it as a button or a menu item. */
export function PromoteSaasTrigger({
  className,
  onOpen,
  children,
}: {
  className?: string;
  /** Called after the modal opens, e.g. to close a menu. */
  onOpen?: () => void;
  children: ReactNode;
}) {
  const open = useContext(PromoteContext);
  return (
    <button
      type="button"
      onClick={() => {
        open?.();
        onOpen?.();
      }}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </button>
  );
}

function PromoteSaasModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailHeadingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const descId = useId();
  const planErrorId = useId();

  const [view, setView] = useState<View>("form");
  const [details, setDetails] = useState<PromoteDetails>(emptyDetails);
  const [errors, setErrors] = useState<PromoteErrors>({});
  const [planId, setPlanId] = useState<ListingPlan["id"] | null>(null);
  const [planError, setPlanError] = useState(false);

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

  // Announce the follow-up message by moving focus to it.
  useEffect(() => {
    if (view === "email") emailHeadingRef.current?.focus();
  }, [view]);

  function handleClosed() {
    document.documentElement.style.overflow = "";
    // Entered details and the chosen plan are kept in case the modal is reopened.
    setView("form");
    onClose();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateDetails(details);
    setErrors(found);
    setPlanError(!planId);
    const first = (Object.keys(found) as (keyof PromoteDetails)[])[0];
    if (first) {
      dialogRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const chosen = listingPlans.find((p) => p.id === planId);
    if (!chosen) {
      dialogRef.current?.querySelector<HTMLInputElement>('input[name="plan"]')?.focus();
      return;
    }
    // Hand off to the visitor's email app; the follow-up view covers devices without one.
    window.location.href = buildListingEmail(details, chosen).href;
    setView("email");
  }

  function update(field: keyof PromoteDetails, value: string) {
    setDetails((d) => ({ ...d, [field]: value }));
    // Clear a field's message as soon as it becomes valid.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateDetails({ ...details, [field]: value })[field] }));
  }

  const plan = listingPlans.find((p) => p.id === planId);
  const email = plan ? buildListingEmail(details, plan) : null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClose={handleClosed}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      className="theme-dark m-auto w-[calc(100%-1.5rem)] max-w-lg overflow-visible bg-transparent p-0 text-fg backdrop:bg-black/65 backdrop:backdrop-blur-sm sm:w-[calc(100%-3rem)]"
    >
      <div className="hero-glow relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[20px] border border-line bg-bg p-5 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          <Icon name="x" size={18} />
          <span className="sr-only">Close</span>
        </button>

        {view === "form" ? (
          <form noValidate onSubmit={submit}>
            <TrafficPill open={open} onNavigate={() => dialogRef.current?.close()} />
            <h2 id={titleId} className="display mt-3 pr-10 text-[1.75rem] sm:text-[2.1rem]">
              Promote your SaaS on <em className="accent">{siteConfig.name}</em>
            </h2>
            <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">
              Reach people looking for their next favourite tool. List your software deal in just a few steps.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Product name"
                name="productName"
                value={details.productName}
                error={errors.productName}
                onChange={(v) => update("productName", v)}
                placeholder="e.g. Acme Analytics"
                autoComplete="organization"
                maxLength={80}
              />
              <Field
                label="Product website"
                name="website"
                type="url"
                inputMode="url"
                value={details.website}
                error={errors.website}
                onChange={(v) => update("website", v)}
                placeholder="https://yourproduct.com"
                autoComplete="url"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  inputMode="email"
                  value={details.email}
                  error={errors.email}
                  onChange={(v) => update("email", v)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <fieldset className="mt-5" aria-describedby={planError ? planErrorId : undefined}>
              <legend className="text-[13px] font-medium text-fg">Listing plan</legend>
              <div className="mt-1.5 grid grid-cols-3 gap-2 pt-2">
                {listingPlans.map((p) => (
                  <PlanOption
                    key={p.id}
                    plan={p}
                    selected={p.id === planId}
                    onSelect={() => {
                      setPlanId(p.id);
                      setPlanError(false);
                    }}
                  />
                ))}
              </div>
              {planError && (
                <p id={planErrorId} className="mt-2 flex items-center gap-1.5 text-[13px] text-danger">
                  <Icon name="alert" size={14} /> Select a plan to continue.
                </p>
              )}
              <p className="mt-2 text-xs text-faint">Each plan lists one deal.</p>
            </fieldset>

            <button type="submit" className={buttonClass("primary", "lg", "mt-5 w-full")}>
              Continue
              <Icon name="arrow-right" size={16} />
            </button>
            <p className="mt-2.5 text-center text-xs leading-relaxed text-faint">
              Your email app will open with your submission details. We&apos;ll guide you through the next steps.
            </p>
          </form>
        ) : (
          email && <EmailFallback email={email} headingRef={emailHeadingRef} titleId={titleId} descId={descId} onEdit={() => setView("form")} onClose={() => dialogRef.current?.close()} />
        )}
      </div>
    </dialog>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  ...input
}: {
  label: string;
  name: keyof PromoteDetails;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: "text" | "url" | "email";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "url" | "email";
  maxLength?: number;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "mt-1 h-10 w-full rounded-[10px] border bg-surface px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
          error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
        )}
        {...input}
      />
      {error && (
        <p id={errorId} className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-danger">
          <Icon name="alert" size={13} className="mt-px" /> {error}
        </p>
      )}
    </div>
  );
}

/** Compact radio card: name, price and length, with the plan's badge on the top edge. */
function PlanOption({ plan, selected, onSelect }: { plan: ListingPlan; selected: boolean; onSelect: () => void }) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center rounded-xl border bg-surface px-2 pb-2.5 pt-3.5 text-center transition-[border-color,box-shadow] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25",
        selected
          ? "border-accent bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] shadow-[0_0_0_1px_var(--accent)]"
          : "border-line hover:border-line-strong",
      )}
    >
      <input type="radio" name="plan" value={plan.id} checked={selected} onChange={onSelect} className="sr-only" />
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-px text-[11px] font-medium leading-4",
            selected ? "bg-accent text-[var(--accent-contrast)]" : "bg-accent-soft text-accent-ink",
          )}
        >
          {plan.badge}
        </span>
      )}
      <span className={cn("text-[12px] font-medium", selected ? "text-fg" : "text-muted")}>{plan.name}</span>
      <span className="tabular mt-0.5 text-[1.35rem] font-semibold leading-tight tracking-tight text-heading">{formatPlanPrice(plan)}</span>
      <span className="flex items-center gap-1 text-[11px] text-faint">
        {selected && <Icon name="check" size={11} className="text-accent-ink" />}
        {plan.days} days
      </span>
    </label>
  );
}

const countFormat = new Intl.NumberFormat("en-US");

/**
 * "N visitors today" pill linking to /stats. Uses the same public counter as the homepage
 * (/api/stats); without a measured figure it still links to the stats page.
 */
function TrafficPill({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const [visitors, setVisitors] = useState<number | null>(null);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { visitorsToday: number | null } | null) => !cancelled && setVisitors(s?.visitorsToday ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Link
      href="/stats"
      onClick={onNavigate}
      className="group inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface pl-2.5 pr-3 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <span aria-hidden="true" className="relative inline-flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c58b] opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-[#22c58b]" />
      </span>
      {visitors !== null ? (
        <span>
          <strong className="tabular font-semibold text-fg">{countFormat.format(visitors)}</strong> visitors today
        </span>
      ) : (
        <span>See live traffic stats</span>
      )}
      <Icon name="arrow-up-right" size={12} className="text-faint transition-colors group-hover:text-fg" />
    </Link>
  );
}

/** Shown after Continue: confirms the hand-off and offers a manual route if no email app opened. */
function EmailFallback({
  email,
  headingRef,
  titleId,
  descId,
  onEdit,
  onClose,
}: {
  email: ReturnType<typeof buildListingEmail>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  titleId: string;
  descId: string;
  onEdit: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<"address" | "message" | null>(null);

  async function copy(kind: "address" | "message") {
    const text = kind === "address" ? email.to : `To: ${email.to}\nSubject: ${email.subject}\n\n${email.body.replace(/\r\n/g, "\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div>
      <span className="icon-tile size-11">
        <Icon name="mail" size={20} />
      </span>
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className="display mt-4 pr-10 text-[1.75rem] outline-none sm:text-[2.1rem]">
        Check your <em className="accent">email app</em>
      </h2>
      <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">
        We&apos;ve opened a draft with your submission details. Send it, and we&apos;ll reply with the next steps to complete
        your listing. Nothing is sent or charged until you send that email.
      </p>

      <div className="mt-4 rounded-xl border border-line bg-subtle p-4 text-sm">
        <p className="font-medium text-fg">Email app didn&apos;t open?</p>
        <p className="mt-1 leading-relaxed text-muted">
          Email your submission to{" "}
          <a href={email.href} className="font-medium text-accent-ink underline underline-offset-2 [overflow-wrap:anywhere]">
            {email.to}
          </a>{" "}
          with the subject &ldquo;{email.subject}&rdquo;.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copy("address")} className={buttonClass("secondary", "sm")}>
            <Icon name={copied === "address" ? "check" : "mail"} size={13} />
            {copied === "address" ? "Address copied" : "Copy address"}
          </button>
          <button type="button" onClick={() => copy("message")} className={buttonClass("secondary", "sm")}>
            <Icon name={copied === "message" ? "check" : "file"} size={13} />
            {copied === "message" ? "Message copied" : "Copy message"}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? `${copied === "address" ? "Address" : "Message"} copied to clipboard` : ""}
        </p>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" onClick={onEdit} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
          <Icon name="arrow-left" size={16} />
          Edit details
        </button>
        <button type="button" onClick={onClose} className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
          Done
        </button>
      </div>
    </div>
  );
}
