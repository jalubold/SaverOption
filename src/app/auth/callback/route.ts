import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { DESKTOP_SCHEME, isDesktopApp } from "@/lib/desktop";
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
  // Sign-in started in the Mac app ran in the browser: send the code back to the app, which
  // finishes it (only the app's window has the PKCE verifier, so the code is useless here).
  if (url.searchParams.get("desktop") === "1" && !isDesktopApp(request.headers.get("user-agent"))) return desktopHandoff(url);
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

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** A page in the browser that opens Saver Option Business for Mac with the sign-in result. */
function desktopHandoff(url: URL): NextResponse {
  const back = new URLSearchParams();
  for (const key of ["code", "error", "error_description"]) {
    const v = url.searchParams.get(key);
    if (v) back.set(key, v.slice(0, 500));
  }
  const next = safeNext(url.searchParams.get("next"));
  if (next.startsWith("/business")) back.set("next", next);
  const link = `${DESKTOP_SCHEME}://auth/callback?${back}`;
  const failed = Boolean(url.searchParams.get("error")) || !url.searchParams.get("code");
  const title = failed ? "Sign-in didn't finish" : "Return to Saver Option Business";
  const body = failed
    ? "Google sign-in was cancelled or didn't finish. Go back to the app to try again."
    : "Your browser will ask to open Saver Option Business. Allow it to finish signing in. You can close this tab afterwards.";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)} · Saver Option</title>
<style>
:root{color-scheme:dark}html,body{height:100%;margin:0}
body{display:flex;align-items:center;justify-content:center;background:#0c0e12;color:#e7e9ee;font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;padding:24px;box-sizing:border-box}
main{max-width:420px}h1{font-size:20px;margin:18px 0 6px}p{color:#9aa0ac;margin:0}
a.button{display:inline-block;margin-top:22px;padding:11px 20px;border-radius:12px;background:linear-gradient(#7c3aec,#4803bd);color:#fff;font-weight:600;text-decoration:none;border:1px solid rgb(255 255 255 / .18)}
</style></head>
<body><main>
<svg width="56" height="56" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aec"/><stop offset="1" stop-color="#4803bd"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><path d="M9.5 9.5h7.1l6.9 6.9a1.6 1.6 0 0 1 0 2.2l-4.9 4.9a1.6 1.6 0 0 1-2.2 0L9.5 16.6Z" fill="rgb(255 255 255 / .16)" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><circle cx="13.4" cy="13.4" r="1.6" fill="#fff"/></svg>
<h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p>
<a class="button" href="${escapeHtml(link)}" data-desktop-handoff>Open Saver Option Business</a>
</main><script>window.location.href = ${JSON.stringify(link).replace(/</g, "\\u003c")};</script></body></html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex" },
  });
}
