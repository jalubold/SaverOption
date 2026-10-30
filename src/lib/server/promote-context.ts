import { getPlan } from "@/config/listing-plans";
import type { FlowMode, PromoteContext } from "@/components/promote/flow-types";
import { isPaid } from "@/lib/listing-status";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { checkoutChoice, plansFor, providerNames } from "@/lib/server/listing-checkout";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { getUser, isAdmin } from "@/lib/server/supabase";

/** What the promote form needs: checkout mode for this visitor, plus any submission this browser started. */
export async function loadPromoteContext({ fresh = false }: { fresh?: boolean } = {}): Promise<PromoteContext> {
  const user = await getUser();
  const { mode, provider } = await checkoutChoice({ admin: isAdmin(user) });
  const plans = await plansFor(provider);
  const ctx: PromoteContext = {
    mode: (mode === "live" || mode === "test" ? mode : "closed") as FlowMode,
    provider: providerNames[provider],
    resume: null,
    paidId: null,
    signedIn: Boolean(user),
    plans,
  };
  if (!dbConfigured() || fresh) return ctx;
  try {
    const sub = await getSubmissionByClaim(await readClaimCookie());
    if (sub && isPaid(sub.payment_status) && !sub.user_id) ctx.paidId = sub.id;
    else if (sub && !sub.user_id && !isPaid(sub.payment_status)) {
      ctx.resume = {
        submissionId: sub.id,
        idempotencyKey: sub.idempotency_key,
        details: { productName: sub.product_name, website: sub.website, email: sub.contact_email, description: sub.description ?? "" },
        planId: getPlan(sub.plan)?.id ?? "3m",
      };
    }
  } catch (err) {
    console.error("[promote] context lookup failed:", err instanceof Error ? err.message : err);
  }
  return ctx;
}
