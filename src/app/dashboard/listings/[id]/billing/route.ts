import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { dodoPortalUrl } from "@/lib/server/dodo";
import { subscriptionPortalUrl } from "@/lib/server/lemonsqueezy";
import { subscriptionFor } from "@/lib/server/submissions";
import { getUser } from "@/lib/server/supabase";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * "Manage subscription": sends the listing's owner to their payment provider's
 * customer portal (Dodo Payments or Lemon Squeezy), where they update their card or
 * cancel. Portal links are signed and short-lived, so one is made on every visit.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/dashboard/listings/[id]/billing">) {
  const { id } = await ctx.params;
  const origin = request.nextUrl.origin;
  const go = (url: string | URL) => {
    const res = NextResponse.redirect(url, 303);
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Referrer-Policy", "no-referrer");
    return res;
  };
  if (!UUID.test(id) || !dbConfigured()) return go(new URL("/dashboard", origin));
  const user = await getUser();
  if (!user) return go(new URL(`/login?next=${encodeURIComponent(`/dashboard/listings/${id}`)}`, origin));

  const sub = await subscriptionFor(id.toLowerCase(), user.id);
  const portal =
    sub?.provider === "dodo"
      ? sub.customerId
        ? await dodoPortalUrl(sub.customerId, `${origin}/dashboard/listings/${id}`)
        : null
      : sub?.subscriptionId
        ? await subscriptionPortalUrl(sub.subscriptionId)
        : null;
  return go(portal ?? new URL(`/dashboard/listings/${id}?billing=unavailable`, origin));
}
