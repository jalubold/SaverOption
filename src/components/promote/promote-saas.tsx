"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { listingPlans, type ListingPlan } from "@/config/listing-plans";
import { emptyDetails, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * "Promote your SaaS" — UI-only prototype of the paid deal-listing flow.
 * Everything lives in local state: nothing is saved, sent or charged.
 * Real submission, auth and checkout can replace `onCheckout` later.
 */

type Step = "details" | "plan" | "soon";

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const descId = useId();

  const [step, setStep] = useState<Step>("details");
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

  // Move focus to the step heading so screen readers announce the new step.
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (moved) headingRef.current?.focus();
  }, [step, moved]);

  function goTo(next: Step) {
    setMoved(true);
    setStep(next);
  }

  function handleClosed() {
    document.documentElement.style.overflow = "";
    // Entered details are kept for the session in case the modal is reopened; the step starts over.
    setStep("details");
    setMoved(false);
    setPlanError(false);
    onClose();
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    const found = validateDetails(details);
    setErrors(found);
    const first = (Object.keys(found) as (keyof PromoteDetails)[])[0];
    if (first) {
      dialogRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    goTo("plan");
  }

  function submitPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!planId) {
      setPlanError(true);
      return;
    }
    goTo("soon");
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
      <div className="hero-glow relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[20px] border border-line bg-bg p-5 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          <Icon name="x" size={18} />
          <span className="sr-only">Close</span>
        </button>

        <StepIndicator step={step} />

        {step === "details" && (
          <form noValidate onSubmit={submitDetails}>
            <h2 id={titleId} ref={headingRef} tabIndex={-1} className="display mt-4 pr-10 text-[2rem] outline-none sm:text-[2.4rem]">
              Promote your SaaS on <em className="accent">{siteConfig.name}</em>
            </h2>
            <p id={descId} className="mt-2 text-[15px] leading-relaxed text-muted">
              Reach people looking for their next favourite tool. List your software deal in just a few steps.
            </p>

            <div className="mt-6 space-y-4">
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

            <button type="submit" className={buttonClass("primary", "lg", "mt-6 w-full")}>
              Continue
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        )}

        {step === "plan" && (
          <form noValidate onSubmit={submitPlan}>
            <h2 id={titleId} ref={headingRef} tabIndex={-1} className="display mt-4 pr-10 text-[2rem] outline-none sm:text-[2.4rem]">
              Choose a <em className="accent">listing plan</em>
            </h2>
            <p id={descId} className="mt-2 text-[15px] leading-relaxed text-muted">
              Each plan lists one deal for <span className="font-medium text-fg">{details.productName.trim()}</span>.
            </p>

            <fieldset className="mt-6" aria-describedby={planError ? "plan-error" : undefined}>
              <legend className="sr-only">Listing plan</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {listingPlans.map((p) => (
                  <PlanCard
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
                <p id="plan-error" role="alert" className="mt-3 flex items-center gap-1.5 text-[13px] text-danger">
                  <Icon name="alert" size={14} /> Select a plan to continue.
                </p>
              )}
            </fieldset>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => goTo("details")} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
                <Icon name="arrow-left" size={16} />
                Back
              </button>
              <button type="submit" className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
                Continue to Checkout
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </form>
        )}

        {step === "soon" && (
          <div>
            <span className="icon-tile mt-4 size-12">
              <Icon name="clock" size={22} />
            </span>
            <h2 id={titleId} ref={headingRef} tabIndex={-1} className="display mt-4 pr-10 text-[2rem] outline-none sm:text-[2.4rem]">
              Coming <em className="accent">soon</em>
            </h2>
            <p id={descId} className="mt-2 text-[15px] leading-relaxed text-muted">
              We&apos;re preparing self-serve deal listings for {siteConfig.name}. Leave your details and we&apos;ll let you know
              when submissions open.
            </p>
            {plan && (
              <p className="mt-4 rounded-xl border border-line bg-subtle px-4 py-3 text-sm text-muted">
                Selected: <span className="font-medium text-fg">{plan.name}</span> · {formatPrice(plan)} · {plan.days}-day listing
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-faint">
              Nothing has been submitted or charged, and the details you entered haven&apos;t been sent or saved.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => goTo("plan")} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
                <Icon name="arrow-left" size={16} />
                Back
              </button>
              <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "plan", label: "Plan" },
  { id: "soon", label: "Checkout" },
];

function StepIndicator({ step }: { step: Step }) {
  const current = STEPS.findIndex((s) => s.id === step);
  return (
    <ol className="flex items-center gap-2 pr-10 text-[11px] font-medium uppercase tracking-wider text-faint">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2" aria-current={i === current ? "step" : undefined}>
          {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-line-strong" />}
          <span
            className={cn(
              "inline-flex size-5 items-center justify-center rounded-full border text-[10px] tabular",
              i < current && "border-transparent bg-accent text-[var(--accent-contrast)]",
              i === current && "border-accent text-accent-ink",
              i > current && "border-line-strong",
            )}
          >
            {i < current ? <Icon name="check" size={11} /> : i + 1}
          </span>
          {/* Phones show only the current step's label. */}
          <span className={cn(i === current ? "text-fg" : "hidden sm:inline")}>{s.label}</span>
        </li>
      ))}
    </ol>
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
      <label htmlFor={id} className="block text-sm font-medium text-fg">
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
          "mt-1.5 h-11 w-full rounded-[10px] border bg-surface px-3.5 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
          error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
        )}
        {...input}
      />
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
          <Icon name="alert" size={14} /> {error}
        </p>
      )}
    </div>
  );
}

function PlanCard({ plan, selected, onSelect }: { plan: ListingPlan; selected: boolean; onSelect: () => void }) {
  return (
    // Phones: a compact row (check, name + length, price). Wider screens: a vertical card.
    <label
      className={cn(
        "relative grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-[14px] border bg-surface p-4 transition-[border-color,box-shadow] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25 sm:flex sm:flex-col sm:items-stretch",
        selected ? "border-accent shadow-[0_0_0_1px_var(--accent)]" : "border-line hover:border-line-strong",
      )}
    >
      <input type="radio" name="plan" value={plan.id} checked={selected} onChange={onSelect} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center rounded-full border sm:absolute sm:right-4 sm:top-4",
          selected ? "border-transparent bg-accent text-[var(--accent-contrast)]" : "border-line-strong",
        )}
      >
        {selected && <Icon name="check" size={12} />}
      </span>
      <span className="min-w-0 sm:pr-7">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-fg">{plan.name}</span>
          {plan.badge && (
            <span className="inline-flex rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink sm:hidden">
              {plan.badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px] text-muted sm:hidden">{plan.days}-day listing</span>
      </span>
      <span className="tabular text-[1.5rem] font-semibold leading-none tracking-tight text-heading sm:mt-3 sm:text-[1.75rem]">
        {formatPrice(plan)}
      </span>
      <span className="mt-1.5 hidden text-[13px] text-muted sm:block">{plan.days}-day listing</span>
      {plan.badge && (
        <span className="mt-3 hidden w-fit rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink sm:inline-flex">
          {plan.badge}
        </span>
      )}
    </label>
  );
}

function formatPrice(plan: ListingPlan) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(plan.price);
}
