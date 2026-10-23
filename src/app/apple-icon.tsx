import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon on iOS, and the logo in the Organization structured data. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(180deg, ${siteConfig.theme.accent} 0%, ${siteConfig.theme.accentDeep} 100%)`,
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
          <path
            d="M7 7h9l8 8a2 2 0 0 1 0 2.8l-6.2 6.2a2 2 0 0 1-2.8 0L7 16V7"
            fill="none"
            stroke="#fff"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
