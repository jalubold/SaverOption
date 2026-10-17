/**
 * Site & brand configuration — the single source of truth for identity.
 *
 * The brand name is a working placeholder. Change it here (or via the
 * NEXT_PUBLIC_BRAND_* env vars) and it propagates to the header, footer,
 * metadata, Open Graph images, JSON-LD and legal copy. No component
 * should hardcode a brand string.
 */

export type BrandLogo =
  | { kind: "mark" } // built-in geometric mark, tinted with the accent color
  | { kind: "image"; src: string; width: number; height: number; alt?: string };

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  defaultCurrency: string;
  logo: BrandLogo;
  theme: {
    /** Primary accent (buttons, links, focus rings). */
    accent: string;
    /** Accent used in dark mode — usually a lighter tint. */
    accentDark: string;
    /** Text color drawn on top of the accent. */
    accentContrast: string;
  };
  contactEmail: string;
  social: { label: string; href: string }[];
  /**
   * Set to false once real, verified offers replace the demo catalog.
   * While true, a site-wide notice explains that listings are sample data.
   */
  demoMode: boolean;
}

const env = process.env;

export const siteConfig: SiteConfig = {
  name: env.NEXT_PUBLIC_BRAND_NAME || "Savestack",
  tagline: env.NEXT_PUBLIC_BRAND_TAGLINE || "Pay less for the software you rely on.",
  description:
    "Discover software deals, free credits, startup perks, student discounts and open-source alternatives — each one linked to the original provider.",
  url: (env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",
  defaultCurrency: "USD",
  logo: { kind: "mark" },
  theme: {
    accent: "#0b7a5c",
    accentDark: "#3ccf9e",
    accentContrast: "#ffffff",
  },
  contactEmail: "hello@example.com",
  social: [],
  demoMode: true,
};

export const mainNav = [
  { label: "All deals", href: "/deals" },
  { label: "Categories", href: "/categories" },
  { label: "Free credits", href: "/categories/free-credits" },
  { label: "Startup perks", href: "/categories/startup-perks" },
] as const;
