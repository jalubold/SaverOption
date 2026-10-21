"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { startCheckout } from "@/app/promote/actions";
import { formatPlanPrice, listingBenefits, listingPlans, type ListingPlanId } from "@/config/listing-plans";
import type { FlowMode, ResumeData } from "@/components/promote/flow-types";
import { DESCRIPTION_MAX, emptyDetails, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * Promote form: details and plan on one screen, then Lemon Squeezy checkout.
 * No account before checkout. The draft lives in sessionStorage so a refresh or
 * a cancelled checkout never loses it; an idempotency key stops duplicate submissions.
 */

export type { FlowMode, ResumeData } from "@/components/promote/flow-types";

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

export function PromoteFlow({
  mode,
  resume,
  paidId = null,
  signedIn = false,
  fresh = false,
  titleId,
  heading = true,
}: {
  mode: FlowMode;
  resume: ResumeData | null;
  /** A paid submission from this browser that still needs an account. */
  paidId?: string | null;
  signedIn?: boolean;
  fresh?: boolean;
  /** Id for the heading, so a dialog can point aria-labelledby at it. */
  titleId?: string;
  /** Show the form's own heading (the page has its own). */
  heading?: boolean;
}) {
  const router = useRouter();
  const [details, setDetails] = useState<PromoteDetails>(resume?.details ?? emptyDetails);
  const [errors, setErrors] = useState<PromoteErrors>({});
  const [planId, setPlanId] = useState<ListingPlanId>(resume?.planId ?? "3m");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [closed, setClosed] = useState<Closed | null>(null);
  const [showPaid, setShowPaid] = useState(Boolean(paidId));
  const [company, setCompany] = useState("");
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
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

  function startTracking() {
    if (!started.current) {
      started.current = true;
      track("listing_form_started");
    }
  }

  function update(field: keyof PromoteDetails, value: string) {
    startTracking();
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateDetails({ ...details, [field]: value })[field] }));
  }

  function startOver() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem(IDEM_KEY, newKey());
    } catch {}
    setDetails(emptyDetails);
    setShowPaid(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    const found = validateDetails(details);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setPending(true);
    setMessage(null);
    track("listing_details_submitted");
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

  if (showPaid && paidId) {
    return (
      <div>
        <span className="icon-tile size-11">
          <Icon name="check" size={20} />
        </span>
        <h2 id={titleId} className="display mt-4 pr-10 text-[1.9rem] sm:text-[2.2rem]">
          You&apos;ve already <em className="accent">paid</em>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">Your listing submission is in. Sign in to finish your listing profile.</p>
        <a href={`/promote/success?s=${paidId}`} className={buttonClass("primary", "lg", "mt-6 w-full")}>
          Continue <Icon name="arrow-right" size={16} />
        </a>
        <button type="button" onClick={startOver} className="mt-4 block w-full text-center text-sm font-medium text-accent-ink underline-offset-2 hover:underline">
          Submit another product
        </button>
      </div>
    );
  }

  if (closed) return <ClosedState closed={closed} details={details} planId={planId} titleId={titleId} onEdit={() => setClosed(null)} />;

  return (
    <form ref={formRef} noValidate onSubmit={submit}>
      {heading && (
        <>
          <h2 id={titleId} className="display pr-10 text-[1.75rem] sm:text-[2.1rem]">
            Promote your <em className="accent">SaaS</em>
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">Pay once for a fixed listing period. Reviewed before it goes live. No account needed to start.</p>
        </>
      )}

      <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", heading ? "mt-5" : "")}>
        <Field label="Product name" name="productName" value={details.productName} error={errors.productName} onChange={(v) => update("productName", v)} placeholder="e.g. Acme Analytics" autoComplete="organization" maxLength={80} />
        <Field label="Website" name="website" type="url" inputMode="url" value={details.website} error={errors.website} onChange={(v) => update("website", v)} placeholder="https://yourproduct.com" autoComplete="url" />
        <div className="sm:col-span-2">
          <Field label="Work email" name="email" type="email" inputMode="email" value={details.email} error={errors.email} onChange={(v) => update("email", v)} placeholder="you@company.com" autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Short description" optional name="description" value={details.description} error={errors.description} onChange={(v) => update("description", v)} placeholder="What does it do, and who is it for?" maxLength={DESCRIPTION_MAX} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-[13px] font-medium text-fg">Listing plan</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2 pt-2">
          {listingPlans.map((p) => (
            <label
              key={p.id}
              className={cn(
                "relative flex cursor-pointer flex-col items-center rounded-xl border px-1.5 pb-2.5 pt-3.5 text-center transition-[border-color,box-shadow] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25",
                p.id === planId ? "border-accent bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] shadow-[0_0_0_1px_var(--accent)]" : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={p.id === planId}
                onChange={() => {
                  startTracking();
                  setPlanId(p.id);
                }}
                className="sr-only"
              />
              {p.badge && (
                <span className={cn("absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-px text-[10px] font-medium leading-4 sm:text-[11px]", p.id === planId ? "bg-accent text-[var(--accent-contrast)]" : "bg-accent-soft text-accent-ink")}>
                  {p.badge}
                </span>
              )}
              <span className={cn("text-[12px] font-medium", p.id === planId ? "text-fg" : "text-muted")}>{p.name}</span>
              <span className="tabular mt-0.5 text-[1.15rem] font-semibold leading-tight tracking-tight text-heading sm:text-[1.3rem]">{formatPlanPrice(p)}</span>
              <span className="flex items-center gap-1 text-[11px] text-faint">
                {p.id === planId && <Icon name="check" size={11} className="text-accent-ink" />}
                {p.days} days
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <details className="group mt-3 text-[13px] text-muted">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-medium text-accent-ink hover:underline [&::-webkit-details-marker]:hidden">
          What&apos;s included <Icon name="arrow-right" size={12} className="transition-transform group-open:rotate-90" />
        </summary>
        <ul className="mt-2 space-y-1">
          {listingBenefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Icon name="check" size={13} className="mt-0.5 shrink-0 text-accent-ink" />
              {b}
            </li>
          ))}
        </ul>
      </details>

      {/* Bots fill every field; people never see this one. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} className="hidden" aria-hidden="true" />

      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="text-muted">
          {plan.name} · {plan.days}-day listing · one-time
        </span>
        <span className="tabular text-base font-semibold text-fg">{formatPlanPrice(plan)}</span>
      </div>

      {mode === "test" && (
        <p className="mt-3 rounded-lg border border-warn/40 bg-warn-soft px-3 py-2 text-xs text-fg">Test mode: checkout uses Lemon Squeezy test payments. No real money is charged.</p>
      )}
      {message && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-fg">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-danger" /> {message}
        </p>
      )}

      <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass("primary", "lg", "mt-4 w-full disabled:opacity-80")}>
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
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-faint">
        <Icon name="shield" size={13} />
        {mode === "closed" ? "Nothing is charged now." : "Secure payment by Lemon Squeezy. Taxes, if any, added at checkout."}
      </p>
      <p className="mt-1 text-center text-xs text-faint">
        By continuing you agree to our{" "}
        <Link href="/terms#sponsored-listings" className="underline underline-offset-2 hover:text-muted">
          terms
        </Link>
        , including the{" "}
        <Link href="/terms#refunds" className="underline underline-offset-2 hover:text-muted">
          refund policy
        </Link>
        .
      </p>
      <p className="mt-4 border-t border-line pt-3 text-center text-[13px] text-muted">
        Already advertising with us?{" "}
        <Link href="/dashboard" className="font-medium text-accent-ink underline-offset-2 hover:underline">
          {signedIn ? "Go to your dashboard" : "Sign in to your dashboard"} →
        </Link>
      </p>
    </form>
  );
}

function ClosedState({ closed, details, planId, titleId, onEdit }: { closed: Closed; details: PromoteDetails; planId: ListingPlanId; titleId?: string; onEdit: () => void }) {
  const plan = listingPlans.find((p) => p.id === planId)!;
  return (
    <div>
      <span className="icon-tile size-11">
        <Icon name={closed.saved ? "check" : "mail"} size={20} />
      </span>
      <h2 id={titleId} className="display mt-4 pr-10 text-[1.9rem] sm:text-[2.2rem]">
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
  optional?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
};

function Field({ label, name, value, error, onChange, type = "text", inputMode, ...input }: FieldProps & { type?: "text" | "url" | "email"; inputMode?: "url" | "email" }) {
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
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1 h-10 w-full rounded-[10px] border bg-surface px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
          error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
        )}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-danger">
          <Icon name="alert" size={13} className="mt-px" /> {error}
        </p>
      )}
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
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1 w-full resize-y rounded-[10px] border bg-surface px-3 py-2 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4",
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
