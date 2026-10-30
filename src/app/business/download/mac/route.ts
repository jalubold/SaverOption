import { NextResponse } from "next/server";
import { MAC_LATEST_URL } from "@/lib/server/desktop-release";

/**
 * saveroption.com/business/download/mac: the newest Saver Option Business for Mac .dmg,
 * downloaded straight away. The file itself is served from the release storage behind it,
 * which always resolves to the newest release (no cached version lookup in between);
 * visitors only see a download starting.
 */
export function GET() {
  const res = NextResponse.redirect(MAC_LATEST_URL, 302);
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=3600");
  return res;
}
