"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { isPlan, isPlanInterval } from "@/lib/business/billing";
import type { FormState } from "@/lib/business/form";
import { billingPortalUrl, cancelAtPeriodEnd, startCheckout } from "@/lib/server/business/billing";
import { actionContext, assertCan, BizError, runAction } from "@/lib/server/business/context";
import { requestOrigin } from "@/lib/server/origin";

/**
 * Billing actions. Each re-checks the session, the workspace and the role on
 * the server; prices come from Creem, never from the form. They stay available
 * when the trial or subscription has ended (that's when they're needed).
 */

function failure(err: unknown): FormState {
  unstable_rethrow(err);
  if (err instanceof BizError) return { error: err.message };
  console.error("[billing] action failed:", err instanceof Error ? err.message : err);
  return { error: "Something went wrong. Nothing was charged or changed. Please try again." };
}

/** Creates the Creem checkout for the plan shown on the confirmation page and sends the browser there. */
export async function startCheckoutAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    const ctx = await actionContext(form, { billing: "open" });
    const plan = form.get("plan");
    const interval = form.get("interval");
    if (!isPlan(plan) || !isPlanInterval(interval)) return { error: "Choose a plan and billing interval." };
    const url = await startCheckout(ctx, plan, interval, await requestOrigin());
    return { ok: true, message: "Opening Creem's secure checkout…", externalUrl: url };
  } catch (err) {
    return failure(err);
  }
}

/** Opens Creem's customer portal (payment method, invoices, cancellation). */
export async function openBillingPortalAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    const ctx = await actionContext(form, { billing: "open" });
    return { ok: true, message: "Opening Creem's billing portal…", externalUrl: await billingPortalUrl(ctx) };
  } catch (err) {
    return failure(err);
  }
}

/** Cancels at the end of the paid period, after the person ticked the confirmation. */
export async function cancelSubscriptionAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(
    form,
    async (ctx) => {
      assertCan(ctx, "billing.manage", "Only owners and admins can cancel the subscription.");
      if (form.get("confirm") !== "yes") return { error: "Tick the box to confirm the cancellation." };
      await cancelAtPeriodEnd(ctx);
      revalidatePath("/business", "layout");
      return { ok: true, message: "Your subscription is set to end at the close of the paid period. You keep access until then." };
    },
    { billing: "open" },
  );
}
