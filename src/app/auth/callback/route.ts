import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";
import { safeNext } from "@/lib/safe-next";

const OTP_TYPES = new Set<EmailOtpType>(["signup", "email", "recovery", "invite", "magiclink", "email_change"]);

/**
 * Landing point for links in Supabase emails (confirm signup, reset password).
 * Exchanges the one-time code for a session cookie, then continues to `next`.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const fail = NextResponse.redirect(new URL("/login?error=link", url.origin));
  if (!authConfigured() || url.searchParams.get("error")) return fail;

  const supabase = await supabaseServer();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type && OTP_TYPES.has(type)) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  if (!ok) return fail;

  const target = type === "recovery" ? "/update-password" : next;
  const res = NextResponse.redirect(new URL(target, url.origin));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
