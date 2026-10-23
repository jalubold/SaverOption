"use client";

import { useState } from "react";
import {
  addPaymentAction,
  archiveSoftwareAction,
  archiveSubscriptionsAction,
  assignSeatsAction,
  deletePaymentAction,
  reassignSeatAction,
  recordRenewalAction,
  releaseSeatAction,
  renewalDecisionAction,
} from "@/app/business/actions/records";
import { minorToInput } from "@/lib/business/calc";
import { RENEWAL_DECISIONS, renewalDecisionLabels, type RenewalDecision } from "@/lib/business/constants";
import { ActionForm, CheckboxField, ConfirmSubmit, SelectField, Submit, TextAreaField, TextField } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";

/**
 * Small forms shared by the subscription, software, license and renewal pages.
 * Each posts to a server action that re-checks the user's role and workspace.
 */

export interface PersonOption {
  id: string;
  name: string;
  departmentName?: string | null;
}

const personOptions = (people: PersonOption[]) => people.map((p) => ({ value: p.id, label: p.departmentName ? `${p.name} · ${p.departmentName}` : p.name }));

/** Archive or restore one subscription (with a confirmation for archiving). */
export function ArchiveSubscriptionButton({ workspaceId, id, archived, name }: { workspaceId: string; id: string; archived: boolean; name: string }) {
  return (
    <ActionForm action={archiveSubscriptionsAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="ids" value={id} />
      {archived ? (
        <>
          <input type="hidden" name="restore" value="1" />
          <Submit variant="secondary" size="sm" pendingLabel="Restoring…">
            Restore
          </Submit>
        </>
      ) : (
        <ConfirmSubmit
          title={`Archive the ${name} subscription?`}
          body="It's kept for history but left out of every total, reminder and savings rule. Its seat assignments are released. You can restore it later."
          confirmLabel="Archive"
        >
          <Icon name="archive" size={14} /> Archive
        </ConfirmSubmit>
      )}
    </ActionForm>
  );
}

export function ArchiveSoftwareButton({ workspaceId, id, archived, name }: { workspaceId: string; id: string; archived: boolean; name: string }) {
  return (
    <ActionForm action={archiveSoftwareAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="id" value={id} />
      {archived ? (
        <>
          <input type="hidden" name="restore" value="1" />
          <Submit variant="secondary" size="sm" pendingLabel="Restoring…">
            Restore
          </Submit>
        </>
      ) : (
        <ConfirmSubmit title={`Archive ${name}?`} body="Archived software is hidden from the inventory and totals. Its subscriptions must be archived, cancelled or expired first." confirmLabel="Archive">
          <Icon name="archive" size={14} /> Archive
        </ConfirmSubmit>
      )}
    </ActionForm>
  );
}

/** Renewal decision, renewal owner and notes for a subscription's next renewal. */
export function RenewalDecisionForm({
  workspaceId,
  subscriptionId,
  decision,
  ownerPersonId,
  notes,
  people,
}: {
  workspaceId: string;
  subscriptionId: string;
  decision: RenewalDecision;
  ownerPersonId: string | null;
  notes: string | null;
  people: PersonOption[];
}) {
  return (
    <ActionForm action={renewalDecisionAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={subscriptionId} />
      <SelectField label="Decision" name="decision" defaultValue={decision} options={RENEWAL_DECISIONS.map((d) => ({ value: d, label: renewalDecisionLabels[d] }))} />
      <SelectField label="Renewal owner" name="renewalOwnerPersonId" optional defaultValue={ownerPersonId ?? ""} placeholder="No renewal owner" options={personOptions(people)} />
      <TextAreaField label="Internal notes" name="renewalNotes" optional defaultValue={notes ?? ""} rows={2} maxLength={2000} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Submit size="sm" pendingLabel="Saving…">
          Save decision
        </Submit>
      </div>
    </ActionForm>
  );
}

/**
 * Records the outcome at the current renewal date: renewed (optionally with the
 * payment), renegotiated (with the new price) or cancelled.
 */
export function RecordRenewalForm({
  workspaceId,
  subscriptionId,
  renewalDate,
  suggestedNext,
  priceMinor,
  currency,
  today,
}: {
  workspaceId: string;
  subscriptionId: string;
  renewalDate: string;
  suggestedNext: string;
  priceMinor: number | null;
  currency: string;
  today: string;
}) {
  const [outcome, setOutcome] = useState<"renewed" | "renegotiated" | "cancelled">("renewed");
  return (
    <ActionForm action={recordRenewalAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={subscriptionId} />
      <input type="hidden" name="currency" value={currency} />
      <SelectField
        label={`Outcome of the ${renewalDate} renewal`}
        name="outcome"
        value={outcome}
        onChange={(e) => setOutcome(e.target.value as typeof outcome)}
        options={[
          { value: "renewed", label: "Renewed at the same price" },
          { value: "renegotiated", label: "Renewed at a new price" },
          { value: "cancelled", label: "Cancelled" },
        ]}
        className="sm:col-span-2"
      />
      {outcome !== "cancelled" && (
        <>
          <TextField label={`Amount (${currency})`} name="amount" inputMode="decimal" defaultValue={minorToInput(priceMinor, currency)} optional={outcome === "renewed"} hint={outcome === "renegotiated" ? "Becomes the subscription's new price." : undefined} />
          <TextField label="Next renewal date" name="newRenewalDate" type="date" defaultValue={suggestedNext} />
          <CheckboxField label="Record this as a payment" name="recordPayment" defaultChecked hint="Adds the amount to recorded spend (actual expenditure)." />
          <TextField label="Paid on" name="paidOn" type="date" defaultValue={renewalDate <= today ? renewalDate : today} optional />
        </>
      )}
      <TextAreaField label="Notes" name="notes" optional rows={2} maxLength={1000} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Submit size="sm" pendingLabel="Recording…">
          Record outcome
        </Submit>
      </div>
    </ActionForm>
  );
}

export function PaymentForm({ workspaceId, subscriptionId, currency, today, defaultAmount }: { workspaceId: string; subscriptionId: string; currency: string; today: string; defaultAmount: number | null }) {
  return (
    <ActionForm action={addPaymentAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-3">
      <input type="hidden" name="id" value={subscriptionId} />
      <input type="hidden" name="currency" value={currency} />
      <TextField label={`Amount (${currency})`} name="amount" inputMode="decimal" defaultValue={minorToInput(defaultAmount, currency)} required />
      <TextField label="Paid on" name="paidOn" type="date" defaultValue={today} max={today} required />
      <TextField label="Reference" name="reference" optional placeholder="Invoice number" maxLength={120} />
      <div className="sm:col-span-3">
        <Submit size="sm" pendingLabel="Saving…">
          Record payment
        </Submit>
      </div>
    </ActionForm>
  );
}

export function DeletePaymentButton({ workspaceId, paymentId }: { workspaceId: string; paymentId: string }) {
  return (
    <ActionForm action={deletePaymentAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="paymentId" value={paymentId} />
      <ConfirmSubmit title="Remove this payment?" body="It will no longer count as recorded spend." confirmLabel="Remove" variant="ghost">
        <Icon name="trash" size={14} />
        <span className="sr-only">Remove payment</span>
      </ConfirmSubmit>
    </ActionForm>
  );
}

/** Give seats to people from the directory, or to someone new. */
export function AssignSeatsForm({ workspaceId, subscriptionId, people, free }: { workspaceId: string; subscriptionId: string; people: PersonOption[]; free: number | null }) {
  const [showNew, setShowNew] = useState(people.length === 0);
  return (
    <ActionForm action={assignSeatsAction} workspaceId={workspaceId} className="space-y-3">
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      {people.length > 0 && (
        <fieldset>
          <legend className="text-[13px] font-medium">
            People without a seat {free !== null && <span className="font-normal text-faint">· {free} free</span>}
          </legend>
          <div className="mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-line p-2 sm:grid-cols-2">
            {people.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-subtle">
                <input type="checkbox" name="personIds" value={p.id} className="size-4 accent-[var(--accent)]" />
                {p.name}
                {p.departmentName && <span className="text-faint">· {p.departmentName}</span>}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {showNew ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="New person's name" name="newPersonName" optional maxLength={120} />
          <TextField label="Email" name="newPersonEmail" type="email" optional maxLength={254} />
        </div>
      ) : (
        <button type="button" className="text-[13px] text-accent-ink underline underline-offset-2" onClick={() => setShowNew(true)}>
          Someone not in the directory?
        </button>
      )}
      <TextField label="Note" name="note" optional maxLength={200} placeholder="e.g. Contractor until March" />
      <Submit size="sm" pendingLabel="Assigning…">
        Assign seats
      </Submit>
    </ActionForm>
  );
}

export function ReleaseSeatButton({ workspaceId, assignmentId, personName }: { workspaceId: string; assignmentId: string; personName: string }) {
  return (
    <ActionForm action={releaseSeatAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <ConfirmSubmit title={`Release ${personName}'s seat?`} body="The seat becomes available to assign to someone else." confirmLabel="Release" danger={false}>
        Release
      </ConfirmSubmit>
    </ActionForm>
  );
}

export function ReassignSeatForm({ workspaceId, assignmentId, people }: { workspaceId: string; assignmentId: string; people: PersonOption[] }) {
  if (people.length === 0) return null;
  return (
    <ActionForm action={reassignSeatAction} workspaceId={workspaceId} className="flex items-end gap-2">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <SelectField label="Reassign to" name="toPersonId" placeholder="Choose…" options={personOptions(people)} className="min-w-44" />
      <Submit size="sm" variant="secondary" pendingLabel="Moving…">
        Move
      </Submit>
    </ActionForm>
  );
}
