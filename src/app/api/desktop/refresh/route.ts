import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { DESKTOP_RELEASE_TAG, latestMacRelease } from "@/lib/server/desktop-release";

/**
 * Called by .github/workflows/desktop.yml right after it publishes a release, so the
 * download page and the app's update check show the new version at once instead of
 * within 15 minutes. It only re-reads the public release list, and only clears the cache
 * when that list has really changed, so calling it needs no secret.
 */
export async function POST() {
  const [live, cached] = await Promise.all([latestMacRelease({ fresh: true }), latestMacRelease()]);
  if (live.state !== "ready") return NextResponse.json({ version: null, refreshed: false }, { status: 503 });
  const stale =
    cached.state !== "ready" ||
    cached.release.version !== live.release.version ||
    cached.release.sizeBytes !== live.release.sizeBytes ||
    cached.release.publishedAt !== live.release.publishedAt;
  // expire 0: the next visit renders with the new release rather than one last stale copy.
  if (stale) revalidateTag(DESKTOP_RELEASE_TAG, { expire: 0 });
  return NextResponse.json({ version: live.release.version, refreshed: stale });
}
