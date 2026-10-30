import { NextResponse } from "next/server";
import { latestMacRelease, MAC_LATEST_URL } from "@/lib/server/desktop-release";

/**
 * saveroption.com/business/download/mac: the newest Saver Option Business for Mac .dmg,
 * downloaded straight away. The file itself is served from the release storage behind it;
 * visitors only see a download starting.
 */
export async function GET() {
  const lookup = await latestMacRelease();
  const file = lookup.state === "ready" ? lookup.release.url : MAC_LATEST_URL;
  const res = NextResponse.redirect(file, 302);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return res;
}
