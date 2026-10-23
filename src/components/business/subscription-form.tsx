"use client";

import { useState } from "react";
import { updateSubscriptionAction } from "@/app/business/actions/records";
import { minorToInput } from "@/lib/business/calc";
import {
  BILLING_INTERVALS,
  billingIntervalLabels,
  COMMON_CURRENCIES,
  INTERVAL_UNITS,
  SUBSCRIPTION_STATUSES,
  subscriptionStatusLabels,
  type BillingInterval,
  type IntervalUnit,
  type PricingModel,
  type SubscriptionStatus,
} from "@/lib/business/constants";
import { ActionForm, SelectField, Submit, TextAreaField, TextField } from "@/components/business/forms";
import { LinkButton } from "@/components/business/ui";

export interface SubscriptionFormValues {
  id: string;
  planName: string | null;
  priceMinor: number | null;
  currency: string;
  pricingModel: PricingModel;
  billingInterval: BillingInterval;
  customIntervalCount: number | null;
  customIntervalUnit: IntervalUnit | null;
  startDate: string | null;
  nextRenewalDate: string | null;
  autoRenew: boolean;
  cancellationDeadline: string | null;
  contractEndDate: string | null;
  status: SubscriptionStatus;
  endedOn: string | null;
  purchasedSeats: number | null;
  reportedAssignedSeats: number | null;
  paymentMethod: string | null;
  /** The subscription's own owner and department (not ones inherited from the software). */
  ownerPersonId: string | null;
  departmentId: string | null;
  contractReference: string | null;
  contractNotes: string | null;
  notes: string | null;
  annualPriceOptionMinor: number | null;
  reminderDays: number[] | null;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-[14px] font-semibold text-fg">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Edit every field of a subscription; the server validates and records price changes in the cost history. */
export function SubscriptionForm({
  workspaceId,
  values: v,
  people,
  departments,
  inheritedOwner,
  inheritedDepartment,
  defaultReminderDays,
}: {
  workspaceId: string;
  values: SubscriptionFormValues;
  people: { id: string; name: string; departmentName: string | null }[];
  departments: { id: string; name: string }[];
  inheritedOwner: string | null;
  inheritedDepartment: string | null;
  defaultReminderDays: number[];
}) {
  const [interval, setInterval] = useState<BillingInterval>(v.billingInterval);
  const [status, setStatus] = useState<SubscriptionStatus>(v.status);
  const [currency, setCurrency] = useState(v.currency);
  const [autoRenew, setAutoRenew] = useState(v.autoRenew);
  const ending = status === "cancelled" || status === "expired";
  const currencies = [...new Set([v.currency, ...COMMON_CURRENCIES])];

  return (
    <ActionForm action={updateSubscriptionAction} workspaceId={workspaceId} className="biz-card space-y-6 p-4 sm:p-6">
      <input type="hidden" name="id" value={v.id} />
      <Section title="Plan and price">
        <TextField label="Plan" name="planName" optional defaultValue={v.planName ?? ""} maxLength={80} />
        <SelectField
          label="Status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
          options={SUBSCRIPTION_STATUSES.map((s) => ({ value: s, label: subscriptionStatusLabels[s] }))}
          hint="Only active subscriptions count towards recurring cost."
        />
        <div className="grid grid-cols-[1fr_7rem] gap-2">
          <TextField label="Price per billing period" name="price" optional inputMode="decimal" defaultValue={minorToInput(v.priceMinor, v.currency)} hint="The total for one period. Empty = unknown." />
          <SelectField label="Currency" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={currencies.map((c) => ({ value: c, label: c }))} />
        </div>
        <SelectField
          label="Pricing model"
          name="pricingModel"
          defaultValue={v.pricingModel}
          options={[
            { value: "flat", label: "Flat price" },
            { value: "per_seat", label: "Per seat (price covers all purchased seats)" },
          ]}
        />
        <SelectField label="Billing interval" name="billingInterval" value={interval} onChange={(e) => setInterval(e.target.value as BillingInterval)} options={BILLING_INTERVALS.map((b) => ({ value: b, label: billingIntervalLabels[b] }))} />
        {interval === "custom" ? (
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Every" name="customIntervalCount" inputMode="numeric" defaultValue={v.customIntervalCount ?? 6} />
            <SelectField label="Unit" name="customIntervalUnit" defaultValue={v.customIntervalUnit ?? "month"} options={INTERVAL_UNITS.map((u) => ({ value: u, label: `${u}s` }))} />
          </div>
        ) : (
          <div />
        )}
        {interval === "monthly" && (
          <TextField
            label={`Annual price option (${currency})`}
            name="annualPriceOption"
            optional
            inputMode="decimal"
            defaultValue={minorToInput(v.annualPriceOptionMinor, v.currency)}
            hint="The vendor's price for a year, if you know it — used to compare with monthly billing."
          />
        )}
        <TextField label="Payment method" name="paymentMethod" optional defaultValue={v.paymentMethod ?? ""} maxLength={60} hint="A label like “Company Visa ••4242” — never a card number." />
      </Section>

      <Section title="Dates and renewal">
        <TextField label="Start date" name="startDate" type="date" optional defaultValue={v.startDate ?? ""} />
        <TextField label={status === "trial" ? "Trial ends / first charge" : "Next renewal date"} name="nextRenewalDate" type="date" optional defaultValue={v.nextRenewalDate ?? ""} />
        <TextField label="Cancellation deadline" name="cancellationDeadline" type="date" optional defaultValue={v.cancellationDeadline ?? ""} hint="Last day to cancel before the next charge." />
        <TextField label="Contract end date" name="contractEndDate" type="date" optional defaultValue={v.contractEndDate ?? ""} />
        {ending && <TextField label="Ended on" name="endedOn" type="date" optional defaultValue={v.endedOn ?? ""} hint="Leave empty to use today." />}
        <TextField
          label="Reminder days"
          name="reminderDays"
          optional
          defaultValue={v.reminderDays?.join(", ") ?? ""}
          placeholder={defaultReminderDays.length ? defaultReminderDays.join(", ") : "e.g. 30, 14, 7"}
          hint={`Days before renewal to remind the team. Empty uses the workspace default (${defaultReminderDays.length ? defaultReminderDays.join(", ") : "off"}).`}
        />
        <div className="sm:col-span-2">
          {/* Always submitted, so unticking really turns auto-renewal off. */}
          <input type="hidden" name="autoRenew" value={autoRenew && !ending ? "true" : "false"} />
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={autoRenew && !ending} disabled={ending} onChange={(e) => setAutoRenew(e.target.checked)} className="mt-0.5 size-4 accent-[var(--accent)]" />
            <span>
              <span className="text-[13.5px] font-medium text-fg">Renews automatically</span>
              {ending && <span className="block text-[12px] text-faint">Cancelled and expired subscriptions don&apos;t renew.</span>}
            </span>
          </label>
        </div>
      </Section>

      <Section title="Seats">
        <TextField label="Purchased seats" name="purchasedSeats" optional inputMode="numeric" defaultValue={v.purchasedSeats ?? ""} hint="Required for per-seat pricing." />
        <TextField label="Seats in use (reported)" name="reportedAssignedSeats" optional inputMode="numeric" defaultValue={v.reportedAssignedSeats ?? ""} hint="A count from the vendor's admin page, when seats aren't assigned by name." />
      </Section>

      <Section title="Ownership">
        <SelectField
          label="Owner"
          name="ownerPersonId"
          optional
          defaultValue={v.ownerPersonId ?? ""}
          placeholder={inheritedOwner ? `Same as the software (${inheritedOwner})` : "No owner"}
          options={people.map((p) => ({ value: p.id, label: p.departmentName ? `${p.name} · ${p.departmentName}` : p.name }))}
        />
        <SelectField
          label="Department"
          name="departmentId"
          optional
          defaultValue={v.departmentId ?? ""}
          placeholder={inheritedDepartment ? `Same as the software (${inheritedDepartment})` : "No department"}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
      </Section>

      <Section title="Contract and notes">
        <TextField label="Contract reference" name="contractReference" optional defaultValue={v.contractReference ?? ""} maxLength={120} placeholder="e.g. PO-2026-014" />
        <div />
        <TextAreaField label="Contract notes" name="contractNotes" optional defaultValue={v.contractNotes ?? ""} maxLength={2000} className="sm:col-span-2" />
        <TextAreaField label="Notes" name="notes" optional defaultValue={v.notes ?? ""} maxLength={4000} className="sm:col-span-2" />
      </Section>

      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Submit pendingLabel="Saving…">Save changes</Submit>
        <LinkButton href={`/business/subscriptions/${v.id}`} size="md">
          Cancel
        </LinkButton>
      </div>
    </ActionForm>
  );
}
