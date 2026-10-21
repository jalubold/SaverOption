"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { listingPlans, type ListingPlan } from "@/config/listing-plans";
import { emptyDetails, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * "Promote your SaaS" — UI-only prototype of the paid deal-listing flow.
 * One compact form (details + plan). Everything lives in local state:
 * nothing is saved, sent or charged. Real checkout can replace the
 * "Coming soon" view later without changing the form.
 */

type View = "form" | "soon";

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
  const soonHeadingRef = useRef<HTMLHeadingElement>(null);
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

  // Announce the "Coming soon" message by moving focus to it.
  useEffect(() => {
    if (view === "soon") soonHeadingRef.current?.focus();
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
    if (!planId) {
      dialogRef.current?.querySelector<HTMLInputElement>('input[name="plan"]')?.focus();
      return;
    }
    setView("soon");
  }

  function update(field: keyof PromoteDetails, value: string) {
    setDetails((d) => ({ ...d, [field]: value }));
    // Clear a field's message as soon as it becomes valid.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateDetails({ ...details, [field]: value })[field] }));
  }

  const plan = listingPlans.find((p) => p.id === planId);

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
            <h2 id={titleId} className="display pr-10 text-[1.75rem] sm:text-[2.1rem]">
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
          </form>
        ) : (
          <div>
            <span className="icon-tile size-11">
              <Icon name="clock" size={20} />
            </span>
            <h2 id={titleId} ref={soonHeadingRef} tabIndex={-1} className="display mt-4 pr-10 text-[1.75rem] outline-none sm:text-[2.1rem]">
              Coming <em className="accent">soon</em>
            </h2>
            <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">
              We&apos;re preparing self-serve deal listings for {siteConfig.name}. Leave your details and we&apos;ll let you know
              when submissions open.
            </p>
            {plan && (
              <p className="mt-4 rounded-xl border border-line bg-subtle px-4 py-3 text-sm text-muted">
                <span className="font-medium text-fg">{details.productName.trim()}</span> · {plan.name} · {formatPrice(plan)}
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-faint">
              Nothing has been submitted or charged, and the details you entered haven&apos;t been sent or saved.
            </p>
            <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass("primary", "lg", "mt-5 w-full")}>
              Close
            </button>
          </div>
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
      <span className="tabular mt-0.5 text-[1.35rem] font-semibold leading-tight tracking-tight text-heading">{formatPrice(plan)}</span>
      <span className="flex items-center gap-1 text-[11px] text-faint">
        {selected && <Icon name="check" size={11} className="text-accent-ink" />}
        {plan.days} days
      </span>
    </label>
  );
}

function formatPrice(plan: ListingPlan) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(plan.price);
}
