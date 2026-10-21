"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { startCheckout } from "@/app/promote/actions";
import { formatPlanPrice, listingBenefits, listingPlans, type ListingPlanId } from "@/config/listing-plans";
import { DESCRIPTION_MAX, emptyDetails, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * Promote flow: essential details → plan + order summary → Lemon Squeezy checkout.
 * No account before checkout. The draft lives in sessionStorage so a refresh or a
 * cancelled checkout never loses it; an idempotency key stops duplicate submissions.
 */

export type FlowMode = "live" | "test" | "closed";

export interface ResumeData {
  submissionId: string;
  /** The saved submission's key, so continuing from another tab updates it instead of creating another. */
  idempotencyKey: string;
  details: PromoteDetails;
  planId: ListingPlanId;
}

const DRAFT_KEY = "so_promote_draft";
const IDEM_KEY = "so_promote_key";

function track(name: string) {
  fetch("/api/funnel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }), keepalive: true }).catch(() => {});
}

function newKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

type Closed = { saved: boolean; reference: string | null; mailto: string };

export function PromoteFlow({ mode, resume, fresh = false }: { mode: FlowMode; resume: ResumeData | null; fresh?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "plan">(resume ? "plan" : "details");
  const [details, setDetails] = useState<PromoteDetails>(resume?.details ?? emptyDetails);
  const [errors, setErrors] = useState<PromoteErrors>({});
  const [planId, setPlanId] = useState<ListingPlanId>(resume?.planId ?? "3m");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [closed, setClosed] = useState<Closed | null>(null);
  const [company, setCompany] = useState("");
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const plan = listingPlans.find((p) => p.id === planId)!;

  // Restore a draft (refresh, or back from checkout) unless the server handed us a saved submission.
  useEffect(() => {
    track("promote_page_viewed");
    try {
      if (fresh) {
        sessionStorage.removeItem(DRAFT_KEY);
        sessionStorage.setItem(IDEM_KEY, newKey());
      }
      if (resume) {
        sessionStorage.setItem(IDEM_KEY, resume.idempotencyKey);
        return;
      }
      if (!sessionStorage.getItem(IDEM_KEY)) sessionStorage.setItem(IDEM_KEY, newKey());
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as { details?: PromoteDetails; planId?: ListingPlanId };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from sessionStorage after mount
        if (d.details) setDetails({ ...emptyDetails, ...d.details });
        if (d.planId && listingPlans.some((p) => p.id === d.planId)) setPlanId(d.planId);
      }
    } catch {
      // Storage unavailable (private mode); the form still works, just without restore.
    }
  }, [resume, fresh]);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ details, planId }));
    } catch {}
  }, [details, planId]);

  function goTo(next: "details" | "plan") {
    setStep(next);
    setMessage(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function update(field: keyof PromoteDetails, value: string) {
    if (!started.current) {
      started.current = true;
      track("listing_form_started");
    }
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateDetails({ ...details, [field]: value })[field] }));
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    const found = validateDetails(details);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    track("listing_details_submitted");
    goTo("plan");
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage(null);
    track("plan_selected");
    let key = "";
    try {
      key = sessionStorage.getItem(IDEM_KEY) ?? "";
      if (!key) sessionStorage.setItem(IDEM_KEY, (key = newKey()));
    } catch {
      key = newKey();
    }
    try {
      let res = await startCheckout({ details, planId, idempotencyKey: key, company });
      if (res.kind === "rekey") {
        // This tab already paid for a different product: start a new submission.
        key = newKey();
        try {
          sessionStorage.setItem(IDEM_KEY, key);
        } catch {}
        res = await startCheckout({ details, planId, idempotencyKey: key, company });
      }
      switch (res.kind) {
        case "redirect":
          window.location.assign(res.url);
          return; // keep the loading state while the browser leaves
        case "paid":
          router.push(`/promote/success?s=${res.submissionId}`);
          return;
        case "closed":
          setClosed(res);
          break;
        case "invalid":
          setErrors(res.errors);
          goTo("details");
          break;
        case "error":
          setMessage(res.message);
          break;
        default:
          setMessage("Please reload the page and try again.");
      }
    } catch {
      setMessage("Couldn't reach the server. Check your connection and try again.");
    }
    setPending(false);
  }

  if (closed) return <ClosedState closed={closed} details={details} planId={planId} onEdit={() => setClosed(null)} />;

  return (
    <div ref={formRef} className="scroll-mt-24 rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
        Step {step === "details" ? 1 : 2} of 2 · {step === "details" ? "Your product" : "Your plan"}
      </p>
      {resume && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-subtle px-3 py-2 text-[13px] text-muted">
          <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent-ink" />
          Welcome back. Your details are saved, so pick up where you left off. You haven&apos;t been charged.
        </p>
      )}

      {step === "details" ? (
        <form noValidate onSubmit={submitDetails}>
          <h2 ref={headingRef} tabIndex={-1} className="display mt-2 text-[1.9rem] outline-none sm:text-[2.2rem]">
            Tell us about your <em className="accent">product</em>
          </h2>
          <p className="mt-1.5 text-sm text-muted">Three fields, no account needed. You can add the rest after checkout.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Product name" name="productName" value={details.productName} error={errors.productName} onChange={(v) => update("productName", v)} placeholder="e.g. Acme Analytics" autoComplete="organization" maxLength={80} />
            <Field label="Product website" name="website" type="url" inputMode="url" value={details.website} error={errors.website} onChange={(v) => update("website", v)} placeholder="https://yourproduct.com" autoComplete="url" />
            <div className="sm:col-span-2">
              <Field label="Work email" name="email" type="email" inputMode="email" value={details.email} error={errors.email} onChange={(v) => update("email", v)} placeholder="you@company.com" autoComplete="email" hint="We'll send your receipt and listing updates here." />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="Short description" optional name="description" value={details.description} error={errors.description} onChange={(v) => update("description", v)} placeholder="What does it do, and who is it for?" maxLength={DESCRIPTION_MAX} />
            </div>
          </div>

          <button type="submit" className={buttonClass("primary", "lg", "mt-6 w-full")}>
            Continue
            <Icon name="arrow-right" size={16} />
          </button>
        </form>
      ) : (
        <form noValidate onSubmit={checkout}>
          <h2 ref={headingRef} tabIndex={-1} className="display mt-2 text-[1.9rem] outline-none sm:text-[2.2rem]">
            Choose your <em className="accent">listing plan</em>
          </h2>
          <p className="mt-1.5 text-sm text-muted">One-time payment for a fixed listing period. No subscription, no renewal.</p>

          <fieldset className="mt-6">
            <legend className="sr-only">Listing plan</legend>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {listingPlans.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "relative flex cursor-pointer items-center justify-between gap-3 rounded-[14px] border p-4 transition-[border-color,box-shadow] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25 sm:flex-col sm:items-center sm:text-center",
                    p.id === planId ? "border-accent bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] shadow-[0_0_0_1px_var(--accent)]" : "border-line bg-subtle hover:border-line-strong",
                  )}
                >
                  <input type="radio" name="plan" value={p.id} checked={p.id === planId} onChange={() => setPlanId(p.id)} className="sr-only" />
                  {p.badge && (
                    <span className={cn("absolute -top-2.5 right-3 rounded-full px-2 py-px text-[11px] font-medium sm:left-1/2 sm:right-auto sm:-translate-x-1/2", p.id === planId ? "bg-accent text-[var(--accent-contrast)]" : "bg-accent-soft text-accent-ink")}>
                      {p.badge}
                    </span>
                  )}
                  <span className="flex items-center gap-2.5 sm:flex-col sm:gap-0.5">
                    <span className={cn("inline-flex size-5 items-center justify-center rounded-full border sm:hidden", p.id === planId ? "border-transparent bg-accent text-[var(--accent-contrast)]" : "border-line-strong")}>
                      {p.id === planId && <Icon name="check" size={12} />}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-fg">{p.name}</span>
                      <span className="block text-xs text-muted">{p.days}-day listing</span>
                    </span>
                  </span>
                  <span className="tabular text-[1.5rem] font-semibold tracking-tight text-heading sm:mt-2">{formatPlanPrice(p)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <ul className="mt-5 space-y-1.5 text-[13px] text-muted">
            {listingBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent-ink" />
                {b}
              </li>
            ))}
          </ul>

          {/* Order summary */}
          <dl className="mt-6 divide-y divide-line rounded-[14px] border border-line bg-subtle text-sm">
            <SummaryRow label="Product" value={details.productName.trim()} action={<button type="button" onClick={() => goTo("details")} className="text-xs font-medium text-accent-ink hover:underline">Edit</button>} />
            <SummaryRow label="Plan" value={plan.name} />
            <SummaryRow label="Listing duration" value={`${plan.days} days from publication`} />
            <SummaryRow label="Price" value={<span className="tabular font-semibold text-fg">{formatPlanPrice(plan)}</span>} />
          </dl>
          <p className="mt-2 text-xs text-faint">Applicable taxes, if any, are calculated by Lemon Squeezy at checkout. Your listing goes live after a quick review.</p>

          {/* Bots fill every field; people never see this one. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} className="hidden" aria-hidden="true" />

          {mode === "test" && (
            <p className="mt-4 rounded-lg border border-warn/40 bg-warn-soft px-3 py-2 text-xs text-fg">
              Test mode: checkout uses Lemon Squeezy test payments. No real money is charged.
            </p>
          )}
          {message && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-fg">
              <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-danger" /> {message}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={() => goTo("details")} disabled={pending} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
              <Icon name="arrow-left" size={16} /> Back
            </button>
            <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass("primary", "lg", "w-full disabled:opacity-80 sm:flex-1")}>
              {pending ? (
                <>
                  <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {mode === "closed" ? "Saving…" : "Opening secure checkout…"}
                </>
              ) : (
                <>
                  {mode === "closed" ? "Submit listing" : "Continue to Checkout"} — {formatPlanPrice(plan)}
                  <Icon name="arrow-right" size={16} />
                </>
              )}
            </button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-faint">
            <Icon name="shield" size={13} /> Secure payment by Lemon Squeezy. We never see your card details.
          </p>
        </form>
      )}
    </div>
  );
}

function SummaryRow({ label, value, action }: { label: string; value: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="flex min-w-0 items-center gap-3 text-right text-fg">
        <span className="truncate">{value}</span>
        {action}
      </dd>
    </div>
  );
}

function ClosedState({ closed, details, planId, onEdit }: { closed: Closed; details: PromoteDetails; planId: ListingPlanId; onEdit: () => void }) {
  const plan = listingPlans.find((p) => p.id === planId)!;
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-7">
      <span className="icon-tile size-11">
        <Icon name={closed.saved ? "check" : "mail"} size={20} />
      </span>
      <h2 className="display mt-4 text-[1.9rem] sm:text-[2.2rem]">
        {closed.saved ? (
          <>
            Submission <em className="accent">saved</em>
          </>
        ) : (
          <>
            Send us your <em className="accent">submission</em>
          </>
        )}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Online checkout isn&apos;t open yet.{" "}
        {closed.saved
          ? `We've saved ${details.productName.trim()} (${plan.name}, ${formatPlanPrice(plan)}) and will email you at ${details.email.trim()} when payments open. You haven't been charged.`
          : "Email us your details and we'll reply with the next steps. You haven't been charged."}
      </p>
      {closed.reference && (
        <p className="mt-3 text-sm text-muted">
          Reference: <span className="tabular font-mono font-medium text-fg">{closed.reference}</span>
        </p>
      )}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" onClick={onEdit} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
          <Icon name="arrow-left" size={16} /> Edit details
        </button>
        <a href={closed.mailto} className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
          <Icon name="mail" size={16} /> {closed.saved ? "Email us to speed things up" : "Email my submission"}
        </a>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: keyof PromoteDetails;
  value: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
};

function Field({ label, name, value, error, hint, onChange, type = "text", inputMode, ...input }: FieldProps & { type?: "text" | "url" | "email"; inputMode?: "url" | "email" }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "mt-1.5 h-11 w-full rounded-[10px] border bg-bg px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
          error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
        )}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-danger">
          <Icon name="alert" size={13} className="mt-px" /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({ label, name, value, error, optional, onChange, ...input }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[13px] font-medium text-fg">
        <span>
          {label} {optional && <span className="font-normal text-faint">(optional)</span>}
        </span>
        <span className="tabular text-[11px] font-normal text-faint">
          {value.length}/{input.maxLength}
        </span>
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1.5 w-full resize-y rounded-[10px] border bg-bg px-3 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
          error ? "border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
        )}
        placeholder={input.placeholder}
        maxLength={input.maxLength}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-danger">
          <Icon name="alert" size={13} className="mt-px" /> {error}
        </p>
      )}
    </div>
  );
}
