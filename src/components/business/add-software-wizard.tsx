"use client";

import { useEffect, useMemo, useState } from "react";
import { addSoftwareAction } from "@/app/business/actions/records";
import { annualized, formatMoney, monthlyEquivalent, nextPeriodDate, parseMoney, type CostTerms } from "@/lib/business/calc";
import {
  BILLING_INTERVALS,
  billingIntervalLabels,
  categoryLabels,
  COMMON_CURRENCIES,
  INTERVAL_UNITS,
  SOFTWARE_CATEGORIES,
  type BillingInterval,
  type IntervalUnit,
  type PricingModel,
  type SoftwareCategory,
} from "@/lib/business/constants";
import { ActionForm, CheckboxField, SelectField, Submit, TextAreaField, TextField, useBizForm, useIdempotencyKey } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

export interface WizardSoftware {
  id: string;
  name: string;
  vendorName: string | null;
  category: SoftwareCategory;
}
export interface WizardPerson {
  id: string;
  name: string;
  departmentName: string | null;
}

const steps = ["Software", "Subscription", "Ownership", "Licenses", "Review"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

/** Which step each server field error belongs to, so the wizard can jump back to it. */
const fieldStep: Record<string, Step> = {
  softwareId: 0, sw_name: 0, sw_vendorName: 0, sw_category: 0, sw_website: 0, sw_description: 0,
  planName: 1, price: 1, currency: 1, billingInterval: 1, customIntervalCount: 1, customIntervalUnit: 1, pricingModel: 1,
  startDate: 1, nextRenewalDate: 1, cancellationDeadline: 1, status: 1, paymentMethod: 1, annualPriceOption: 1,
  ownerPersonId: 2, departmentId: 2, sw_businessPurpose: 2,
  purchasedSeats: 3, reportedAssignedSeats: 3, seatPersonIds: 3,
};

export function AddSoftwareWizard(props: {
  workspaceId: string;
  software: WizardSoftware[];
  people: WizardPerson[];
  departments: { id: string; name: string }[];
  defaultCurrency: string;
  defaultOwnerId: string | null;
  today: string;
  initialSoftwareId?: string | null;
  initialMode?: "new" | "existing";
  softwareOnly?: boolean;
  after?: "app" | "onboarding";
}) {
  return (
    <ActionForm action={addSoftwareAction} workspaceId={props.workspaceId} showMessages={false}>
      <WizardBody {...props} />
    </ActionForm>
  );
}

function WizardBody({
  software,
  people,
  departments,
  defaultCurrency,
  defaultOwnerId,
  today,
  initialSoftwareId,
  initialMode,
  softwareOnly: initialSoftwareOnly = false,
  after = "app",
}: Parameters<typeof AddSoftwareWizard>[0]) {
  const { state } = useBizForm();
  const key = useIdempotencyKey();
  const [step, setStep] = useState<Step>(0);
  const [mode, setMode] = useState<"new" | "existing">(initialMode ?? (initialSoftwareId ? "existing" : software.length ? "existing" : "new"));
  const [query, setQuery] = useState("");
  const [softwareId, setSoftwareId] = useState<string>(initialSoftwareId ?? "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SoftwareCategory>("other");
  const [softwareOnly, setSoftwareOnly] = useState(initialSoftwareOnly);
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency);
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [customCount, setCustomCount] = useState("6");
  const [customUnit, setCustomUnit] = useState<IntervalUnit>("month");
  const [model, setModel] = useState<PricingModel>("flat");
  const [startDate, setStartDate] = useState(today);
  const [renewal, setRenewal] = useState("");
  const [renewalTouched, setRenewalTouched] = useState(false);
  const [status, setStatus] = useState<"active" | "trial">("active");
  const [autoRenew, setAutoRenew] = useState(true);
  const [ownerId, setOwnerId] = useState(defaultOwnerId ?? "");
  const [departmentId, setDepartmentId] = useState("");
  const [seats, setSeats] = useState("");
  const [inUse, setInUse] = useState("");
  const [named, setNamed] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const terms: CostTerms = {
    priceMinor: (() => {
      const v = parseMoney(price, currency);
      return v === null || Number.isNaN(v) ? null : v;
    })(),
    currency,
    billingInterval: interval,
    customIntervalCount: interval === "custom" ? Number(customCount) || null : null,
    customIntervalUnit: interval === "custom" ? customUnit : null,
    pricingModel: model,
    purchasedSeats: seats ? Number(seats) : null,
  };

  // Suggest the next renewal from the start date until someone edits it.
  useEffect(() => {
    if (renewalTouched || !startDate || (interval === "custom" && !Number(customCount))) return;
    let next = nextPeriodDate(startDate, terms);
    while (next < today) next = nextPeriodDate(next, terms);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived default that stays editable
    setRenewal(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, interval, customCount, customUnit, renewalTouched, today]);

  // Server field errors: go back to the first step that has one.
  useEffect(() => {
    const errs = Object.keys(state.fieldErrors ?? {});
    if (errs.length === 0) return;
    const first = Math.min(...errs.map((f) => fieldStep[f] ?? 4)) as Step;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to the server's validation result
    setStep(first);
  }, [state.fieldErrors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return software.filter((s) => !q || s.name.toLowerCase().includes(q) || s.vendorName?.toLowerCase().includes(q)).slice(0, 50);
  }, [software, query]);
  const selected = software.find((s) => s.id === softwareId);
  const duplicate = mode === "new" && name.trim() && software.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
  const visibleSteps: Step[] = softwareOnly ? [0, 2, 4] : [0, 1, 2, 3, 4];
  const pos = visibleSteps.indexOf(step);

  const validate = (s: Step): string | null => {
    if (s === 0) {
      if (mode === "existing" && !softwareId) return "Choose a software record, or create a new one.";
      if (mode === "new" && !name.trim()) return "Enter the software's name.";
      if (duplicate) return `${name.trim()} is already in your inventory — choose it from the list instead.`;
      if (softwareOnly && mode === "existing") return "That software is already in your inventory. Untick “No paid subscription” to add one.";
    }
    if (s === 1) {
      if (price && terms.priceMinor === null) return "Enter the price as a number, like 49 or 1,299.50.";
      if (interval === "custom" && !(Number(customCount) >= 1)) return "Enter how long one billing period is.";
      if (renewal && startDate && renewal < startDate) return "The next renewal can't be before the start date.";
    }
    if (s === 3) {
      if (model === "per_seat" && !seats) return "Per-seat pricing needs the number of purchased seats.";
      if (seats && inUse && Number(inUse) > Number(seats)) return "Seats in use can't be more than the seats purchased.";
      if (seats && named.length > Number(seats)) return `You picked ${named.length} people for ${seats} seats.`;
    }
    return null;
  };
  const go = (to: Step) => {
    if (visibleSteps.indexOf(to) > pos) {
      for (const s of visibleSteps.slice(0, visibleSteps.indexOf(to))) {
        const err = validate(s);
        if (err) {
          setStep(s);
          setLocalError(err);
          return;
        }
      }
    }
    setLocalError(null);
    setStep(to);
  };
  const next = () => go(visibleSteps[Math.min(pos + 1, visibleSteps.length - 1)]);
  const back = () => go(visibleSteps[Math.max(pos - 1, 0)]);

  const monthly = monthlyEquivalent(terms);
  const year = annualized(terms);
  const personName = (id: string) => people.find((p) => p.id === id)?.name ?? "—";

  return (
    <div className="biz-card overflow-hidden">
      <input type="hidden" name="idempotencyKey" value={key} />
      <input type="hidden" name="softwareMode" value={mode} />
      <input type="hidden" name="after" value={after} />
      {softwareOnly && <input type="hidden" name="softwareOnly" value="on" />}
      <ol className="flex overflow-x-auto border-b border-line bg-subtle/60 px-2 text-[12.5px]">
        {visibleSteps.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => go(s)}
              aria-current={s === step ? "step" : undefined}
              className={cn("flex items-center gap-2 whitespace-nowrap px-3 py-3 font-medium", s === step ? "text-fg" : "text-faint hover:text-fg")}
            >
              <span className={cn("flex size-5 items-center justify-center rounded-full text-[11px]", s === step ? "bg-accent text-accent-fg" : i < pos ? "bg-accent-soft text-accent-ink" : "bg-line text-muted")}>
                {i < pos ? <Icon name="check" size={11} /> : i + 1}
              </span>
              {steps[s]}
            </button>
          </li>
        ))}
      </ol>

      <div className="p-4 sm:p-6">
        {/* Step 1: software */}
        <div hidden={step !== 0} className="space-y-4">
          <div className="seg" role="tablist" aria-label="Software">
            <button type="button" role="tab" aria-selected={mode === "existing"} className="seg-item" onClick={() => setMode("existing")} disabled={software.length === 0}>
              From inventory
            </button>
            <button type="button" role="tab" aria-selected={mode === "new"} className="seg-item" onClick={() => setMode("new")}>
              New software
            </button>
          </div>
          {mode === "existing" ? (
            <div>
              <label htmlFor="wiz-search" className="block text-[13px] font-medium">
                Search your inventory
              </label>
              <input id="wiz-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or vendor" className="mt-1.5 h-10 w-full rounded-[10px] border border-line-strong bg-bg px-3 text-[14px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/20" />
              <input type="hidden" name="softwareId" value={softwareId} />
              <ul className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-line" role="listbox" aria-label="Software">
                {filtered.length === 0 && <li className="px-3 py-3 text-[13px] text-faint">No matches. Create it as new software instead.</li>}
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={s.id === softwareId}
                      onClick={() => setSoftwareId(s.id)}
                      className={cn("flex w-full items-center justify-between gap-2 border-b border-line px-3 py-2.5 text-left text-[13.5px] last:border-0", s.id === softwareId ? "bg-accent-soft" : "hover:bg-subtle")}
                    >
                      <span>
                        <span className="font-medium">{s.name}</span>
                        <span className="ml-2 text-faint">{[s.vendorName, categoryLabels[s.category]].filter(Boolean).join(" · ")}</span>
                      </span>
                      {s.id === softwareId && <Icon name="check" size={15} className="text-accent-ink" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Software name" name="sw_name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Slack" maxLength={80} required />
              <TextField label="Vendor" name="sw_vendorName" optional placeholder="e.g. Salesforce" maxLength={80} />
              <SelectField label="Category" name="sw_category" value={category} onChange={(e) => setCategory(e.target.value as SoftwareCategory)} options={SOFTWARE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] }))} />
              <TextField label="Website" name="sw_website" optional placeholder="https://" maxLength={300} />
              <TextAreaField label="Description" name="sw_description" optional className="sm:col-span-2" maxLength={1000} rows={2} />
              {duplicate && <p className="text-[12.5px] text-warn sm:col-span-2">{duplicate.name} is already in your inventory — choose it under “From inventory”.</p>}
            </div>
          )}
          <CheckboxField
            label="No paid subscription yet"
            name="_softwareOnly"
            checked={softwareOnly}
            onChange={(e) => setSoftwareOnly(e.target.checked)}
            hint="Add it to the inventory only — for free tools, tools you're evaluating, or ones paid for elsewhere."
          />
        </div>

        {/* Step 2: subscription details */}
        <div hidden={step !== 1 || softwareOnly} className="grid gap-4 sm:grid-cols-2">
          <TextField label="Plan" name="planName" optional value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="e.g. Business" maxLength={80} />
          <SelectField label="Status" name="status" value={status} onChange={(e) => setStatus(e.target.value as "active" | "trial")} options={[{ value: "active", label: "Active" }, { value: "trial", label: "Trial" }]} />
          <div className="grid grid-cols-[1fr_7rem] gap-2">
            <TextField label="Price per billing period" name="price" optional inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" hint="The total you pay each period. Leave empty if unknown." />
            <SelectField label="Currency" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[...new Set([defaultCurrency, ...COMMON_CURRENCIES])].map((c) => ({ value: c, label: c }))} />
          </div>
          <SelectField label="Billing interval" name="billingInterval" value={interval} onChange={(e) => setInterval(e.target.value as BillingInterval)} options={BILLING_INTERVALS.map((b) => ({ value: b, label: billingIntervalLabels[b] }))} />
          {interval === "custom" && (
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:max-w-sm">
              <TextField label="Every" name="customIntervalCount" inputMode="numeric" value={customCount} onChange={(e) => setCustomCount(e.target.value)} />
              <SelectField label="Unit" name="customIntervalUnit" value={customUnit} onChange={(e) => setCustomUnit(e.target.value as IntervalUnit)} options={INTERVAL_UNITS.map((u) => ({ value: u, label: `${u}s` }))} />
            </div>
          )}
          <SelectField
            label="Pricing model"
            name="pricingModel"
            value={model}
            onChange={(e) => setModel(e.target.value as PricingModel)}
            options={[{ value: "flat", label: "Flat price" }, { value: "per_seat", label: "Per seat (price covers all purchased seats)" }]}
            hint="Per-seat pricing lets Saver Option work out the cost of unused seats."
          />
          <TextField label="Start date" name="startDate" type="date" optional value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <TextField
            label={status === "trial" ? "Trial ends / first charge" : "Next renewal date"}
            name="nextRenewalDate"
            type="date"
            optional
            value={renewal}
            onChange={(e) => {
              setRenewal(e.target.value);
              setRenewalTouched(true);
            }}
            hint={renewalTouched ? undefined : "Suggested from the start date and interval."}
          />
          <TextField label="Cancellation deadline" name="cancellationDeadline" type="date" optional hint="Last day to cancel before the next charge, if the contract has one." />
          <TextField label="Payment method" name="paymentMethod" optional placeholder="e.g. Company Visa ••4242" maxLength={60} hint="A label only — never a card number." />
          {/* Always sent, so unticking is saved as "false" (an unticked checkbox sends nothing). */}
          <input type="hidden" name="autoRenew" value={autoRenew ? "true" : "false"} />
          <CheckboxField label="Renews automatically" name="_autoRenew" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="sm:col-span-2" />
        </div>

        {/* Step 3: ownership */}
        <div hidden={step !== 2} className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Owner" name="ownerPersonId" optional value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="No owner" options={people.map((p) => ({ value: p.id, label: p.departmentName ? `${p.name} · ${p.departmentName}` : p.name }))} hint="Who decides on renewals and seats." />
          <SelectField label="Department" name="departmentId" optional value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder="No department" options={departments.map((d) => ({ value: d.id, label: d.name }))} hint={departments.length ? undefined : "Add departments in Settings → Departments."} />
          {mode === "new" ? (
            <TextAreaField label="Business purpose" name="sw_businessPurpose" optional className="sm:col-span-2" rows={2} maxLength={500} placeholder="What the team uses it for" />
          ) : (
            <p className="text-[12.5px] text-faint sm:col-span-2">The software&apos;s business purpose is kept on its inventory record.</p>
          )}
        </div>

        {/* Step 4: licenses */}
        <div hidden={step !== 3 || softwareOnly} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Purchased seats" name="purchasedSeats" optional inputMode="numeric" value={seats} onChange={(e) => setSeats(e.target.value.replace(/\D/g, ""))} hint="Leave empty if the plan isn't licensed per person." />
            <TextField label="Seats in use (reported)" name="reportedAssignedSeats" optional inputMode="numeric" value={inUse} onChange={(e) => setInUse(e.target.value.replace(/\D/g, ""))} hint="A count from the vendor's admin page, if you don't assign seats by name." />
          </div>
          {people.length > 0 && (
            <fieldset>
              <legend className="text-[13px] font-medium">Assign seats to people <span className="font-normal text-faint">(optional)</span></legend>
              <div className="mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-line p-2 sm:grid-cols-2">
                {people.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-subtle">
                    <input
                      type="checkbox"
                      name="seatPersonIds"
                      value={p.id}
                      checked={named.includes(p.id)}
                      onChange={(e) => setNamed((n) => (e.target.checked ? [...n, p.id] : n.filter((x) => x !== p.id)))}
                      className="size-4 accent-[var(--accent)]"
                    />
                    {p.name}
                    {p.departmentName && <span className="text-faint">· {p.departmentName}</span>}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-[12px] text-faint">{named.length} selected{seats ? ` of ${seats} seats` : ""}.</p>
            </fieldset>
          )}
        </div>

        {/* Step 5: review */}
        <div hidden={step !== 4}>
          <dl className="grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
            <Row label="Software" value={mode === "existing" ? (selected?.name ?? "—") : `${name || "—"} (new)`} />
            {softwareOnly ? (
              <Row label="Subscription" value="None — inventory record only" />
            ) : (
              <>
                <Row label="Plan" value={plan || "—"} />
                <Row label="Price" value={terms.priceMinor !== null ? `${formatMoney(terms.priceMinor, currency)} · ${interval === "custom" ? `every ${customCount} ${customUnit}s` : billingIntervalLabels[interval].toLowerCase()}` : "Not entered"} />
                <Row label="Monthly equivalent" value={monthly !== null ? formatMoney(Math.round(monthly), currency) : "—"} />
                <Row label="Annualized recurring cost" value={year !== null ? formatMoney(Math.round(year), currency) : "—"} />
                <Row label="Status" value={status === "trial" ? "Trial" : "Active"} />
                <Row label="Next renewal" value={renewal || "Not set"} />
                <Row label="Seats" value={seats ? `${seats} purchased · ${Math.max(named.length, Number(inUse) || 0)} in use` : "Not tracked"} />
              </>
            )}
            <Row label="Owner" value={ownerId ? personName(ownerId) : "No owner"} />
            <Row label="Department" value={departments.find((d) => d.id === departmentId)?.name ?? "No department"} />
          </dl>
          {!softwareOnly && terms.priceMinor === null && (
            <p className="mt-4 text-[12.5px] text-warn">No price entered: this subscription is left out of spending totals until you add one.</p>
          )}
        </div>

        {(localError || state.error) && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-[13.5px]">
            <Icon name="alert" size={15} className="mt-0.5 text-danger" /> {localError ?? state.error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" onClick={back} disabled={pos === 0} className={buttonClass("secondary", "md")}>
            <Icon name="arrow-left" size={14} /> Back
          </button>
          {step === 4 ? (
            <Submit pendingLabel="Saving…">{softwareOnly ? "Add to inventory" : "Save subscription"}</Submit>
          ) : (
            <button type="button" onClick={next} className={buttonClass("primary", "md")}>
              Continue <Icon name="arrow-right" size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] text-faint">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
