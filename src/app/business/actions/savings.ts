"use server";

import { revalidatePath } from "next/cache";
import { FormReader, isUuid, stateFromErrors, type FormState } from "@/lib/business/form";
import { runAction } from "@/lib/server/business/context";
import { deleteRealizedSaving, recordRealizedSaving, setOpportunityStatus } from "@/lib/server/business/savings-sync";

const refresh = () => revalidatePath("/business", "layout");

/** Review, dismiss, reopen or record a decision on a savings opportunity. */
export async function setOpportunityStatusAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "an opportunity", required: true });
    const status = r.oneOf("status", ["reviewed", "dismissed", "open", "actioned"] as const, { label: "Status" });
    const decision = r.text("decision", { label: "Decision", max: 1000, multiline: true });
    if (status === "actioned" && !decision) r.fail("decision", "Describe the decision you made.");
    if (!r.ok || !id) return stateFromErrors(r);
    await setOpportunityStatus(ctx, id, status, decision);
    refresh();
    const done = { reviewed: "Marked as reviewed.", dismissed: "Dismissed.", open: "Reopened.", actioned: "Decision recorded." }[status];
    return { ok: true, message: done };
  });
}

/** Records a saving someone confirmed actually happened, with the amount they supply. */
export async function recordRealizedSavingAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const opportunityId = r.id("opportunityId", { label: "an opportunity" });
    const subscriptionId = r.id("subscriptionId", { label: "a subscription" });
    const currency = r.currency("currency", ctx.workspace.defaultCurrency);
    const amountMinor = r.money("amount", currency, { label: "Amount", required: true });
    if (amountMinor === 0) r.fail("amount", "Enter the amount saved.");
    const recurrence = r.oneOf("recurrence", ["one_time", "monthly", "yearly"] as const, { label: "Recurrence", fallback: "yearly" });
    const description = r.requiredText("description", { label: "Description", max: 500, min: 2 });
    const evidence = r.text("evidence", { label: "Evidence", max: 1000, multiline: true });
    const confirmedOn = r.date("confirmedOn", { label: "Confirmed on", required: true });
    if (confirmedOn && confirmedOn > ctx.today) r.fail("confirmedOn", "A confirmed saving can't be dated in the future.");
    if (!r.ok || amountMinor === null || !confirmedOn) return stateFromErrors(r);
    await recordRealizedSaving(ctx, { opportunityId, subscriptionId, amountMinor, currency, recurrence, description, evidence, confirmedOn });
    refresh();
    return { ok: true, message: "Saving confirmed and added to realized savings." };
  });
}

export async function deleteRealizedSavingAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("id");
    if (!isUuid(id)) return { error: "That saving wasn't found." };
    await deleteRealizedSaving(ctx, id);
    refresh();
    return { ok: true, message: "Confirmed saving removed." };
  });
}
