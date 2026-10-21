import { NextResponse, type NextRequest } from "next/server";
import { parseClaim, readClaimCookie, writeClaimCookie } from "@/lib/server/claim";
import { claimDestination } from "@/lib/server/claim-flow";
import { dbConfigured } from "@/lib/server/db";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { getUser } from "@/lib/server/supabase";

/**
 * Adds a paid submission to the signed-in account. The proof is a claim token —
 * from this browser's cookie (set at checkout) or from the receipt email link
 * (`/claim?s=…&t=…`) — never the email address typed into the form.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const go = (path: string) => {
    const res = NextResponse.redirect(new URL(path, origin));
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Referrer-Policy", "no-referrer");
    return res;
  };
  if (!dbConfigured()) return go("/dashboard");

  // Receipt link: keep the token in a cookie and drop it from the address bar.
  const s = request.nextUrl.searchParams.get("s");
  const t = request.nextUrl.searchParams.get("t");
  if (s || t) {
    const fromLink = parseClaim(`${s}.${t}`);
    const sub = fromLink ? await getSubmissionByClaim(fromLink) : null;
    if (!sub) return go((await getUser()) ? "/dashboard?claim=invalid" : "/login?error=claim");
    await writeClaimCookie(sub.id, fromLink!.token);
    return go("/claim");
  }

  const user = await getUser();
  if (!(await readClaimCookie())) return go(user ? "/dashboard" : "/login?next=/dashboard");
  if (!user) return go("/signup?next=/claim");
  return go(await claimDestination(user));
}
