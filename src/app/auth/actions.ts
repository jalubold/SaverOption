"use server";

import { redirect } from "next/navigation";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { readFunnelSession } from "@/lib/server/funnel-session";
import { requestOrigin } from "@/lib/server/origin";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { safeNext } from "@/lib/safe-next";

/**
 * Accounts on Supabase Auth, signed in with Google only: one button for new and
 * returning users. Google sends the user back through /auth/callback.
 */

/** Starts Google sign-in and comes back to `next`. */
export async function signInWithGoogleAction(form: FormData): Promise<void> {
  if (!authConfigured()) redirect("/login?error=unavailable");
  const next = safeNext(form.get("next"));
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${await requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    console.error("[auth] google start failed:", error?.code ?? error?.status ?? "no url");
    redirect("/login?error=google");
  }
  if (dbConfigured()) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      await recordFunnelEvent("account_signup_started", { submissionId: claim && !claim.user_id ? claim.id : null, sessionId: await readFunnelSession() });
    } catch {}
  }
  redirect(data.url);
}
