import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Social and link-preview images (Open Graph / X), one design for every page
 * type: the brand mark, a small eyebrow, the page's own title and a detail line.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

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
    ogSize,
  );
}
