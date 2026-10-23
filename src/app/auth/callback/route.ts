import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { readFunnelSession } from "@/lib/server/funnel-session";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { safeNext } from "@/lib/safe-next";

const OTP_TYPES = new Set<EmailOtpType>(["signup", "email", "recovery", "invite", "magiclink", "email_change"]);

/**
 * Landing point after Google sign-in (and Supabase email links). Exchanges the
 * one-time code for a session cookie, then continues to `next`.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const business = next.startsWith("/business");
  // Google returns error=access_denied when someone cancels on the consent screen.
  const cancelled = url.searchParams.get("error") === "access_denied";
  const fail = NextResponse.redirect(
    new URL(business ? `/business/login?error=${cancelled ? "cancelled" : "google"}&next=${encodeURIComponent(next)}` : "/login?error=link", url.origin),
  );
  if (!authConfigured() || url.searchParams.get("error")) return fail;

  const supabase = await supabaseServer();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  let createdAt: string | undefined;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
    createdAt = data?.user?.created_at;
  }
  else if (tokenHash && type && OTP_TYPES.has(type)) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  if (!ok) return fail;

  // A user created in the last few minutes signed up just now.
  if (!business && createdAt && Date.now() - new Date(createdAt).getTime() < 10 * 60_000 && dbConfigured()) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      await recordFunnelEvent("account_created", { submissionId: claim && !claim.user_id ? claim.id : null, sessionId: await readFunnelSession() });
    } catch {}
  }

  const res = NextResponse.redirect(new URL(next, url.origin));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
