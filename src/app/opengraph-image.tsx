import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { accent, accentDeep } = siteConfig.theme;
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
          backgroundImage: `radial-gradient(circle at 92% 0%, ${accent}66 0%, transparent 45%)`,
          color: "#f7f7f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundImage: `linear-gradient(180deg, ${accent} 0%, ${accentDeep} 100%)`,
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.06, letterSpacing: -2, maxWidth: 980 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)" }}>
            Software deals · Free credits · Startup perks · Student discounts
          </div>
        </div>
        <div style={{ height: 8, width: 160, backgroundImage: `linear-gradient(90deg, ${accent}, ${accentDeep})`, borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
