/**
 * The latest Saver Option Business for Mac build, read from the repository's
 * GitHub releases (published by .github/workflows/desktop.yml). Cached for 15
 * minutes; the download page falls back to the releases list if GitHub can't
 * be reached.
 */

const REPO = "jalubold/SaverOption";
/** The fixed-name copy of the universal .dmg that every desktop release carries. */
export const MAC_ASSET = "Saver-Option-Business-mac.dmg";
export const RELEASES_URL = `https://github.com/${REPO}/releases`;

export interface MacRelease {
  version: string;
  publishedAt: string;
  sizeBytes: number;
  url: string;
  notesUrl: string;
}

export type MacReleaseLookup = { state: "ready"; release: MacRelease } | { state: "none" } | { state: "unknown" };

interface GhRelease {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string;
  html_url?: string;
  assets?: { name?: string; size?: number; browser_download_url?: string }[];
}

export async function latestMacRelease(): Promise<MacReleaseLookup> {
  // Overridable for local testing against a mock.
  const api = (process.env.DESKTOP_RELEASE_API_URL || "https://api.github.com").replace(/\/$/, "");
  try {
    const res = await fetch(`${api}/repos/${REPO}/releases?per_page=20`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "saveroption.com" },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { state: "unknown" };
    const releases = (await res.json()) as GhRelease[];
    for (const r of releases) {
      if (r.draft || r.prerelease || !r.tag_name?.startsWith("desktop-v")) continue;
      const asset = r.assets?.find((a) => a.name === MAC_ASSET && a.browser_download_url);
      if (!asset?.browser_download_url) continue;
      return {
        state: "ready",
        release: {
          version: r.tag_name.slice("desktop-v".length),
          publishedAt: r.published_at ?? "",
          sizeBytes: asset.size ?? 0,
          url: asset.browser_download_url,
          notesUrl: r.html_url ?? RELEASES_URL,
        },
      };
    }
    return { state: "none" };
  } catch {
    return { state: "unknown" };
  }
}
