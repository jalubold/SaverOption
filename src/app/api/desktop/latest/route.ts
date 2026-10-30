import { NextResponse } from "next/server";
import { latestMacRelease } from "@/lib/server/desktop-release";
import { absoluteUrl } from "@/lib/seo";

/**
 * The newest Saver Option Business for Mac version, for the app's "Check for Updates…"
 * (desktop/src-tauri/src/update.rs). `version` is null when it can't be read.
 */
export const revalidate = 900;

export async function GET() {
  const lookup = await latestMacRelease();
  const release = lookup.state === "ready" ? lookup.release : null;
  return NextResponse.json({
    version: release?.version ?? null,
    page: absoluteUrl("/business/download"),
    url: release?.url ?? null,
  });
}
