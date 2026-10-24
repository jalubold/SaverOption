"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/business/form";
import { assertCan, runAction } from "@/lib/server/business/context";
import { buildSavingsReport, saveSavingsReport } from "@/lib/server/business/savings-report";

/** Saves a dated savings report snapshot and opens it. */
export async function generateSavingsReportAction(_prev: FormState, form: FormData): Promise<FormState> {
  let id = "";
  const state = await runAction(form, async (ctx) => {
    assertCan(ctx, "data.export", "Your role can't save reports.");
    id = await saveSavingsReport(ctx, await buildSavingsReport(ctx), "app");
    return { ok: true };
  });
  if (state.ok && id) redirect(`/business/reports/saved/${id}`);
  return state;
}
