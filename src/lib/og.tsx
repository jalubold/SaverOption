import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Social and link-preview images (Open Graph / X), one design for every page
 * type: the brand mark, a small eyebrow, the page's own title and a detail line.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Share images for deals, products, categories and collections are drawn on request (not at build,
 * which would make each deployment much larger), and drawing one costs far more CPU than serving a
 * page. Next.js sends them with max-age=0, so every crawler and link preview drew the image again.
 * s-maxage lets Vercel's CDN keep each one for the same 12 hours the pages keep (a deal's image only
 * changes when it ends), and serve the old one while it draws the next in the background.
 * Browsers still revalidate (max-age=0). This is CDN caching, not ISR, so it adds no ISR writes.
 */
export const OG_CACHE_CONTROL = "public, max-age=0, s-maxage=43200, stale-while-revalidate=86400";

/**
 * For a slug that isn't in the catalog: a plain 404 (drawing nothing) instead of a generic image,
 * like the page itself. The CDN keeps it for an hour so the same bad URL doesn't run the function again.
 */
export function ogNotFound(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=3600" },
  });
}

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function ogImage({
  eyebrow,
  title,
  detail,
  colors,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  /** Gradient for the accent bar and glow; the brand accent by default. */
  colors?: { from: string; to: string };
}): ImageResponse {
  const from = colors?.from ?? siteConfig.theme.accent;
  const to = colors?.to ?? siteConfig.theme.accentDeep;
  const heading = clip(title, 110);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0c0e12",
          backgroundImage: `radial-gradient(circle at 92% 0%, ${from}66 0%, transparent 45%)`,
          color: "#f7f7f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(180deg, ${siteConfig.theme.accent} 0%, ${siteConfig.theme.accentDeep} 100%)`,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 32 32">
              <path d="M7 7h9l8 8a2 2 0 0 1 0 2.8l-6.2 6.2a2 2 0 0 1-2.8 0L7 16V7" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="#fff" />
            </svg>
          </div>
          <div style={{ fontSize: 36, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {eyebrow && (
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              {clip(eyebrow, 60)}
            </div>
          )}
          <div style={{ fontSize: heading.length > 60 ? 56 : 66, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1040 }}>
            {heading}
          </div>
          {detail && <div style={{ fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.65)", maxWidth: 1040 }}>{clip(detail, 140)}</div>}
        </div>
        <div style={{ height: 8, width: 160, backgroundImage: `linear-gradient(90deg, ${from}, ${to})`, borderRadius: 4 }} />
      </div>
    ),
    { ...ogSize, headers: { "cache-control": OG_CACHE_CONTROL } },
  );
}
