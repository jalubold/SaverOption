import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { accent } = siteConfig.theme;
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
          background: "#f8f8f6",
          color: "#16181a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: accent }} />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, maxWidth: 950 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#565b60" }}>
            Software deals · Free credits · Startup perks · Student discounts
          </div>
        </div>
        <div style={{ height: 8, width: 160, background: accent, borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
