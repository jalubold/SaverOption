import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { subscriptionPortalUrl } from "@/lib/server/lemonsqueezy";
import { subscriptionIdFor } from "@/lib/server/submissions";
import { getUser } from "@/lib/server/supabase";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * "Manage subscription": sends the listing's owner to Lemon Squeezy's customer
 * portal, where they update their card, switch plan or cancel. The portal link
 * is signed and short-lived, so it's fetched fresh on every visit.
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

  const subscriptionId = await subscriptionIdFor(id.toLowerCase(), user.id);
  const portal = subscriptionId ? await subscriptionPortalUrl(subscriptionId) : null;
  return go(portal ?? new URL(`/dashboard/listings/${id}?billing=unavailable`, origin));
}
