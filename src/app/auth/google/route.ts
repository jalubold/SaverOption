import { NextResponse, type NextRequest } from "next/server";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { readFunnelSession } from "@/lib/server/funnel-session";
import { clientIp, rateLimit } from "@/lib/server/mcp/rate-limit";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { safeNext } from "@/lib/safe-next";

/**
 * Finishes Google sign-in started with Google's button on our own page: the ID token Google gave
 * the page, with the nonce the page made, is checked by Supabase and becomes the session cookie.
 * Only our own pages may call this (another site can't sign a visitor in to someone else's account).
 */
export async function POST(req: NextRequest) {
  const no = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
  if (!sameSite(req)) return no(403, "forbidden");
  if (!authConfigured()) return no(503, "unavailable");
  const limit = await rateLimit(`google-signin:${clientIp(req.headers)}`, 20, 60);
  if (!limit.ok) return no(429, "slow_down");

  let body: { credential?: unknown; nonce?: unknown; next?: unknown };
  try {
    body = await req.json();
  } catch {
    return no(400, "bad_request");
  }
  const credential = typeof body.credential === "string" ? body.credential : "";
  const nonce = typeof body.nonce === "string" ? body.nonce : "";
  if (!/^[\w-]+\.[\w-]+\.[\w-]*$/.test(credential) || credential.length > 8192 || !/^[a-f0-9]{64}$/.test(nonce)) return no(400, "bad_request");
  const next = safeNext(body.next);

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: "google", token: credential, nonce });
  if (error || !data.user) {
    console.error("[auth] google id token sign-in failed:", error?.code ?? error?.status ?? "no user");
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
