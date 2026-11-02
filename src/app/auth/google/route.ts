import { NextResponse, type NextRequest } from "next/server";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { exchangeGoogleCode, googlePopupAvailable, recordGooglePopupFailure, switchGooglePopupOff } from "@/lib/server/google-identity";
import { readFunnelSession } from "@/lib/server/funnel-session";
import { clientIp, rateLimit } from "@/lib/server/mcp/rate-limit";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { safeNext } from "@/lib/safe-next";

/**
 * Finishes Google sign-in started on our own page. Normally the page sends the one-time code from
 * Google's popup, which is swapped at Google (with the client secret) for an ID token. Pages opened
 * before that change may still send Google's ID token with the nonce they made. Either way Supabase
 * checks the token and it becomes the session cookie. Only our own pages may call this (another site
 * can't sign a visitor in to someone else's account): same-origin only, and the code path also needs
 * the X-Requested-With header Google recommends, which other sites can't set without a CORS preflight.
 */
/** Whether the button should open Google's popup right now (pages built ahead can't know). */
export async function GET() {
  return NextResponse.json({ popup: await googlePopupAvailable() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const no = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
  if (!sameSite(req)) return no(403, "forbidden");
  if (!authConfigured()) return no(503, "unavailable");
  const limit = await rateLimit(`google-signin:${clientIp(req.headers)}`, 20, 60);
  if (!limit.ok) return no(429, "slow_down");

  let body: { code?: unknown; credential?: unknown; nonce?: unknown; next?: unknown };
  try {
    body = await req.json();
  } catch {
    return no(400, "bad_request");
  }
  const next = safeNext(body.next);

  let token: string;
  let nonce: string | undefined;
  if (typeof body.code === "string") {
    if (req.headers.get("x-requested-with") !== "XmlHttpRequest") return no(403, "forbidden");
    if (!/^[\w/.~+=%-]{10,1024}$/.test(body.code)) {
      await recordGooglePopupFailure(`Our check: the code from Google didn't look like one (${body.code.length} characters)`);
      return no(400, "bad_request");
    }
    const swapped = await exchangeGoogleCode(body.code);
    if ("reason" in swapped) {
      // Anything but a passing hiccup means the popup can't work as set up: switch it off so people
      // choose their account once (the redirect), and say why on /admin/setup.
      await recordGooglePopupFailure(swapped.reason);
      if (!swapped.transient) await switchGooglePopupOff(swapped.reason);
      return no(401, "google");
    }
    token = swapped.token;
  } else {
    const credential = typeof body.credential === "string" ? body.credential : "";
    nonce = typeof body.nonce === "string" ? body.nonce : "";
    if (!/^[\w-]+\.[\w-]+\.[\w-]*$/.test(credential) || credential.length > 8192 || !/^[a-f0-9]{64}$/.test(nonce)) return no(400, "bad_request");
    token = credential;
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithIdToken(nonce ? { provider: "google", token, nonce } : { provider: "google", token });
  if (error || !data.user) {
    console.error("[auth] google id token sign-in failed:", error?.code ?? error?.status ?? "no user", error?.message?.slice(0, 120) ?? "");
    // Supabase refusing a popup token (this client isn't in its Client IDs, Google is off there) won't change on
    // a retry: switch the popup off so sign-in takes the one redirect, and say why on /admin/setup.
    // One person's own refusal (banned, sign-ups closed, too many tries) leaves the popup on for everyone else.
    const personal = /banned|signup|sign-up|sign up|not allowed|rate|too many/i.test(`${error?.code ?? ""} ${error?.message ?? ""}`);
    if (!nonce) await recordGooglePopupFailure(`Supabase: ${error?.message || error?.code || "no user"}`);
    if (!nonce && error && (error.status ?? 400) < 500 && !personal) await switchGooglePopupOff(`Supabase: ${error.message || error.code || "refused"}`);
    return no(401, "google");
  }

  // Saver Option (not Business): the same sign-up events as the redirect flow records.
  if (!next.startsWith("/business") && dbConfigured()) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      const submissionId = claim && !claim.user_id ? claim.id : null;
      const sessionId = await readFunnelSession();
      await recordFunnelEvent("account_signup_started", { submissionId, sessionId });
      const created = data.user.created_at ? new Date(data.user.created_at).getTime() : 0;
      if (Date.now() - created < 10 * 60_000) await recordFunnelEvent("account_created", { submissionId, sessionId });
    } catch {}
  }
  return NextResponse.json({ next }, { headers: { "Cache-Control": "no-store" } });
}

function sameSite(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = req.headers.get("origin");
  if (!origin) return site === "same-origin";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
