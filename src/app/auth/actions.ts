"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDesktopApp } from "@/lib/desktop";
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
  const next = safeNext(form.get("next"));
  // Saver Option Business has its own sign-in page; errors go back there.
  const loginPage = next.startsWith("/business") ? `/business/login?next=${encodeURIComponent(next)}&` : "/login?";
  if (!authConfigured()) redirect(`${loginPage}error=unavailable`);
  const supabase = await supabaseServer();
  // From the Mac app, Google runs in the browser (it doesn't allow sign-in inside apps' web views);
  // the callback then hands the code back to the app, which holds the PKCE verifier.
  const desktop = isDesktopApp((await headers()).get("user-agent"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${await requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}${desktop ? "&desktop=1" : ""}`,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    console.error("[auth] google start failed:", error?.code ?? error?.status ?? "no url");
    redirect(`${loginPage}error=google`);
  }
  if (dbConfigured() && !next.startsWith("/business")) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      await recordFunnelEvent("account_signup_started", { submissionId: claim && !claim.user_id ? claim.id : null, sessionId: await readFunnelSession() });
    } catch {}
  }
  redirect(data.url);
}
