"use server";

import { getPlan } from "@/config/listing-plans";
import type { PromoteContext } from "@/components/promote/flow-types";
import { buildListingEmail } from "@/components/promote/submission";
import { normalizeWebsite, validateDetails, type PromoteDetails, type PromoteErrors } from "@/components/promote/validation";
import { CLAIM_TTL_DAYS, claimTokenMatches, newClaimToken, readClaimCookie, writeClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { ensureFunnelSession } from "@/lib/server/funnel-session";
import { checkoutMode, createCheckout, getListingPlans, LemonSqueezyError } from "@/lib/server/lemonsqueezy";
import { requestOrigin } from "@/lib/server/origin";
import { recordCheckout, reusableCheckout, setClaimToken, upsertPendingSubmission } from "@/lib/server/submissions";
import { loadPromoteContext } from "@/lib/server/promote-context";
import { getUser, isAdmin } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";

export type StartCheckoutResult =
  | { kind: "redirect"; url: string; testMode: boolean }
  /** Online checkout is closed: the submission is saved (if a database exists) and email is offered. */
  | { kind: "closed"; saved: boolean; reference: string | null; mailto: string }
  | { kind: "paid"; submissionId: string }
  /** The key belongs to an already-paid submission for a different product: retry with a new key. */
  | { kind: "rekey" }
  | { kind: "invalid"; errors: PromoteErrors }
  | { kind: "error"; message: string };

const KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;

/**
 * Saves the pending submission and sends the visitor to Lemon Squeezy's hosted
 * checkout. Everything that matters is decided here on the server: the details
 * are re-validated, and the price and variant come from the connected Lemon Squeezy plans.
 */
export async function startCheckout(input: {
  details: PromoteDetails;
  planId: string;
  idempotencyKey: string;
  /** Hidden field humans leave empty. */
  company?: string;
}): Promise<StartCheckoutResult> {
  const plan = getPlan(input.planId, await getListingPlans());
  if (!plan) return { kind: "error", message: "Choose a listing plan." };
  if (input.company) return { kind: "error", message: "Something went wrong. Please try again." };
  const details: PromoteDetails = {
    productName: String(input.details?.productName ?? "").trim().slice(0, 80),
    website: String(input.details?.website ?? "").trim().slice(0, 300),
    email: String(input.details?.email ?? "").trim().toLowerCase().slice(0, 254),
    description: String(input.details?.description ?? "").trim().slice(0, 600),
  };
  const errors = validateDetails(details);
  if (Object.keys(errors).length) return { kind: "invalid", errors };
  const website = normalizeWebsite(details.website)!;

  if (!dbConfigured()) {
    return { kind: "closed", saved: false, reference: null, mailto: buildListingEmail(details, plan).href };
  }
  if (!KEY_RE.test(input.idempotencyKey ?? "")) return { kind: "error", message: "Please reload the page and try again." };

  try {
    const result = await upsertPendingSubmission(
      { productName: details.productName, website, email: details.email, description: details.description || null },
      plan,
      input.idempotencyKey,
    );
    if (!result) return { kind: "error", message: "We couldn't save your submission. Please try again." };
    const sub = result.submission;
    if ("locked" in result) {
      const same = sub.product_name === details.productName && sub.website === website;
      return same ? { kind: "paid", submissionId: sub.id } : { kind: "rekey" };
    }

    const sessionId = await ensureFunnelSession();

    // Keep this browser's claim token if it still holds one, so every receipt link for this submission works.
    const cookie = await readClaimCookie();
    const ownsCookie = cookie?.submissionId === sub.id && claimTokenMatches(cookie.token, sub.claim_token_hash);
    const claim = ownsCookie
      ? { token: cookie.token, hash: sub.claim_token_hash!, expiresAt: new Date(Date.now() + CLAIM_TTL_DAYS * 86400_000) }
      : newClaimToken();

    const mode = await checkoutMode({ admin: isAdmin(await getUser()) });
    if (mode !== "live" && mode !== "test") {
      await setClaimToken(sub.id, claim);
      await writeClaimCookie(sub.id, claim.token);
      const reference = sub.id.slice(0, 8).toUpperCase();
      return { kind: "closed", saved: true, reference, mailto: buildListingEmail(details, plan, reference).href };
    }

    const testMode = mode === "test";
    // Reuse a recent checkout for the same plan if this browser started it.
    const reuse = ownsCookie ? reusableCheckout(sub, plan, testMode) : null;
    if (reuse) {
      await recordFunnelEvent("checkout_started", { submissionId: sub.id, sessionId });
      return { kind: "redirect", url: reuse, testMode };
    }

    const origin = await requestOrigin();
    const checkout = await createCheckout({
      plan,
      submissionId: sub.id,
      email: details.email,
      testMode,
      redirectUrl: `${origin}/promote/success?s=${sub.id}`,
      receiptLinkUrl: `${origin}/claim?s=${sub.id}&t=${claim.token}`,
    });
    await recordCheckout(sub.id, { id: checkout.id, url: checkout.url, plan: plan.id, testMode }, claim);
    await writeClaimCookie(sub.id, claim.token);
    await recordFunnelEvent("checkout_started", { submissionId: sub.id, sessionId });
    return { kind: "redirect", url: checkout.url, testMode };
  } catch (err) {
    console.error("[promote] checkout failed:", err instanceof Error ? err.message : err);
    return {
      kind: "error",
      message:
        err instanceof LemonSqueezyError
          ? "Checkout is temporarily unavailable. Your details are saved — please try again in a moment."
          : "Something went wrong saving your submission. Please try again.",
    };
  }
}

/** Called when the promote popup opens: checkout mode for this visitor and any submission to resume. */
export async function getPromoteContext(): Promise<PromoteContext> {
  return loadPromoteContext();
}
