"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/business/form";
import { assertCan, runAction } from "@/lib/server/business/context";
import { displayCurrency } from "@/lib/server/business/display-currency";
import { getSubscriptions } from "@/lib/server/business/data";
import { buildSavingsReport, saveSavingsReport } from "@/lib/server/business/savings-report";

/** Saves a dated savings report snapshot and opens it. */
export async function generateSavingsReportAction(_prev: FormState, form: FormData): Promise<FormState> {
  let id = "";
  const state = await runAction(form, async (ctx) => {
    assertCan(ctx, "data.export", "Your role can't save reports.");
    // Saved from the app: amounts in the workspace currency, like the pages it's generated from.
    const display = await displayCurrency(ctx, (await getSubscriptions(ctx.workspace.id)).map((s) => s.currency));
    id = await saveSavingsReport(ctx, await buildSavingsReport(ctx, { display }), "app");
    return { ok: true };
  });
  if (state.ok && id) redirect(`/business/reports/saved/${id}`);
  return state;
}
