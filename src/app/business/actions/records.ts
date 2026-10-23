"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RENEWAL_DECISIONS, RENEWAL_OUTCOMES } from "@/lib/business/constants";
import { FormReader, isUuid, stateFromErrors, type FormState } from "@/lib/business/form";
import { BizError, runAction } from "@/lib/server/business/context";
import {
  addPayment,
  bulkAssign,
  createSoftware,
  createSubscription,
  deletePayment,
  readSoftwareInput,
  readSubscriptionInput,
  recordRenewal,
  setRenewalDecision,
  setSoftwareArchived,
  setSubscriptionsArchived,
  updateSoftware,
  updateSubscription,
} from "@/lib/server/business/records";
import { db } from "@/lib/server/db";
import { assignSeats, createPerson, reassignSeat, releaseSeat } from "@/lib/server/business/team";

const refresh = () => revalidatePath("/business", "layout");

/**
 * The Add Software flow: an existing or new software record, optionally with a
 * subscription, ownership and seats — saved together in one transaction.
 */
export async function addSoftwareAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const mode = r.oneOf("softwareMode", ["existing", "new"] as const, { label: "Software", fallback: "new" });
    const softwareOnly = r.bool("softwareOnly");
    const after = form.get("after") === "onboarding" ? "onboarding" : "app";
    const key = r.idempotencyKey();
    if (!key) return { error: "This form expired. Reload the page and try again." };

    const newSoftware = mode === "new" ? readSoftwareInput(r, "sw_") : null;
    const softwareId = mode === "existing" ? r.id("softwareId", { label: "a software record", required: true }) : null;

    if (softwareOnly) {
      if (!newSoftware) return { error: "That software is already in your inventory. Add a subscription instead, or choose “New software”." };
      newSoftware.ownerPersonId ??= r.id("ownerPersonId", { label: "an owner" });
      newSoftware.departmentId ??= r.id("departmentId", { label: "a department" });
      if (!r.ok) return stateFromErrors(r);
      const id = await db().begin((sql) => createSoftware(sql, ctx, newSoftware));
      refresh();
      redirect(after === "onboarding" ? "/business/onboarding?step=done" : `/business/software/${id}?created=1`);
    }

    const input = readSubscriptionInput(r, { currency: ctx.workspace.defaultCurrency });
    if (newSoftware) {
      newSoftware.ownerPersonId ??= input.ownerPersonId;
      newSoftware.departmentId ??= input.departmentId;
    }
    const seatPersonIds = r.ids("seatPersonIds");
    if (!r.ok) return stateFromErrors(r);
    const res = await createSubscription(ctx, { softwareId, newSoftware, input, idempotencyKey: key, seatPersonIds });
    refresh();
    redirect(after === "onboarding" ? "/business/onboarding?step=done" : `/business/subscriptions/${res.id}?created=1`);
  });
}

export async function updateSubscriptionAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("id");
    if (!isUuid(id)) throw new BizError("not_found", "That subscription wasn't found.");
    const r = new FormReader(form);
    const input = readSubscriptionInput(r, { currency: ctx.workspace.defaultCurrency });
    if (!r.ok) return stateFromErrors(r);
    await updateSubscription(ctx, id, input);
    refresh();
    redirect(`/business/subscriptions/${id}?saved=1`);
  });
}

export async function archiveSubscriptionsAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const ids = new FormReader(form).ids("ids");
    const restore = form.get("restore") === "1";
    if (ids.length === 0) return { error: "Select at least one subscription." };
    const n = await setSubscriptionsArchived(ctx, ids, !restore);
    refresh();
    return { ok: true, message: `${n} subscription${n === 1 ? "" : "s"} ${restore ? "restored" : "archived"}.` };
  });
}

export async function bulkAssignAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const ids = r.ids("ids");
    const field = r.oneOf("field", ["departmentId", "ownerPersonId"] as const, { label: "Field" });
    const value = r.id("value", { label: field === "departmentId" ? "a department" : "an owner" });
    if (!r.ok) return stateFromErrors(r);
    if (ids.length === 0) return { error: "Select at least one subscription." };
    const n = await bulkAssign(ctx, ids, field === "departmentId" ? { departmentId: value } : { ownerPersonId: value });
    refresh();
    return { ok: true, message: `Updated ${n} subscription${n === 1 ? "" : "s"}.` };
  });
}

export async function updateSoftwareAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("id");
    if (!isUuid(id)) throw new BizError("not_found", "That software record wasn't found.");
    const r = new FormReader(form);
    const input = readSoftwareInput(r);
    if (!r.ok) return stateFromErrors(r);
    await updateSoftware(ctx, id, input);
    refresh();
    redirect(`/business/software/${id}?saved=1`);
  });
}

export async function archiveSoftwareAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("id");
    if (!isUuid(id)) throw new BizError("not_found", "That software record wasn't found.");
    const restore = form.get("restore") === "1";
    await setSoftwareArchived(ctx, id, !restore);
    refresh();
    return { ok: true, message: restore ? "Software restored." : "Software archived." };
  });
}

export async function renewalDecisionAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "a subscription", required: true });
    const decision = r.oneOf("decision", RENEWAL_DECISIONS, { label: "Decision", fallback: "undecided" });
    const owner = r.id("renewalOwnerPersonId", { label: "a renewal owner" });
    const notes = r.text("renewalNotes", { label: "Notes", max: 2000, multiline: true });
    if (!r.ok || !id) return stateFromErrors(r);
    await setRenewalDecision(ctx, id, decision, owner, notes);
    refresh();
    return { ok: true, message: "Renewal decision saved." };
  });
}

export async function recordRenewalAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "a subscription", required: true });
    const outcome = r.oneOf("outcome", RENEWAL_OUTCOMES, { label: "Outcome" });
    const currency = r.currency("currency", ctx.workspace.defaultCurrency);
    const amountMinor = r.money("amount", currency, { label: "Amount" });
    const recordPayment = r.bool("recordPayment");
    const paidOn = r.date("paidOn", { label: "Payment date" });
    const newRenewalDate = r.date("newRenewalDate", { label: "Next renewal date" });
    const notes = r.text("notes", { label: "Notes", max: 1000, multiline: true });
    if (!r.ok || !id) return stateFromErrors(r);
    await recordRenewal(ctx, id, { outcome, amountMinor, recordPayment, paidOn, newRenewalDate, notes });
    refresh();
    return { ok: true, message: outcome === "cancelled" ? "Recorded as cancelled." : "Renewal recorded and the next renewal date updated." };
  });
}

export async function addPaymentAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "a subscription", required: true });
    const currency = r.currency("currency", ctx.workspace.defaultCurrency);
    const amountMinor = r.money("amount", currency, { label: "Amount", required: true });
    const paidOn = r.date("paidOn", { label: "Payment date", required: true });
    const reference = r.text("reference", { label: "Reference", max: 120 });
    const notes = r.text("notes", { label: "Notes", max: 500 });
    if (paidOn && paidOn > ctx.today) r.fail("paidOn", "Payments can't be in the future.");
    if (!r.ok || !id || amountMinor === null || !paidOn) return stateFromErrors(r);
    await addPayment(ctx, id, { amountMinor, paidOn, reference, notes });
    refresh();
    return { ok: true, message: "Payment recorded." };
  });
}

export async function deletePaymentAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("paymentId");
    if (!isUuid(id)) return { error: "That payment wasn't found." };
    await deletePayment(ctx, id);
    refresh();
    return { ok: true, message: "Payment removed." };
  });
}

export async function assignSeatsAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("subscriptionId", { label: "a subscription", required: true });
    let people = r.ids("personIds");
    const note = r.text("note", { label: "Note", max: 200 });
    // Optionally add a new person to the directory and give them the seat.
    const newName = r.text("newPersonName", { label: "Name", max: 120 });
    const newEmail = r.email("newPersonEmail", { label: "Email" });
    if (!r.ok || !id) return stateFromErrors(r);
    if (newName) people = [...people, await createPerson(ctx, { name: newName, email: newEmail, title: null, departmentId: null })];
    const n = await assignSeats(ctx, id, people, note);
    refresh();
    return { ok: true, message: `Assigned ${n} seat${n === 1 ? "" : "s"}.` };
  });
}

export async function releaseSeatAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("assignmentId");
    if (!isUuid(id)) return { error: "That seat wasn't found." };
    await releaseSeat(ctx, id);
    refresh();
    return { ok: true, message: "Seat released." };
  });
}

export async function reassignSeatAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("assignmentId", { label: "a seat", required: true });
    const to = r.id("toPersonId", { label: "a person", required: true });
    if (!r.ok || !id || !to) return stateFromErrors(r);
    await reassignSeat(ctx, id, to);
    refresh();
    return { ok: true, message: "Seat reassigned." };
  });
}
