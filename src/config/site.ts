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
    /** Primary accent — top of button gradients, focus rings, highlights. */
    accent: string;
    /** Deeper shade — bottom of button gradients and the purple panel. */
    accentDeep: string;
    /** Lighter tint for accent text on dark sections. */
    accentOnDark: string;
    /** Text color drawn on top of the accent. */
    accentContrast: string;
  };
  contactEmail: string;
  /** Where the Partnerships page CTAs send partnership enquiries. */
  partnershipsEmail: string;
  social: { label: string; href: string }[];
  /**
   * Pre-launch: keeps the site out of search indexes. Set to false when the
   * site goes live on its real domain.
   */
  prelaunch: boolean;
  /** Google Analytics 4 measurement ID (G-XXXXXXXXXX), loaded directly. Empty disables it. */
  googleAnalyticsId: string;
  /** Google Tag Manager container (GTM-XXXXXXX). Don't add a GA4 tag to it while googleAnalyticsId is set. Empty disables it. */
  googleTagManagerId: string;
  /** Shows the newsletter sign-up section on the homepage. */
  newsletter: boolean;
}

const env = process.env;

export const siteConfig: SiteConfig = {
  name: env.NEXT_PUBLIC_BRAND_NAME || "Saver Option",
  tagline: env.NEXT_PUBLIC_BRAND_TAGLINE || "The smarter option for paying less on software.",
  description:
    "Discover software deals, free credits, startup perks, student discounts and open-source alternatives — each one linked to the original provider.",
  url: (env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",
  defaultCurrency: "USD",
  logo: { kind: "mark" },
  theme: {
    accent: "#7c3aec",
    accentDeep: "#4803bd",
    accentOnDark: "#b99cff",
    accentContrast: "#ffffff",
  },
  contactEmail: "jalubold@gmail.com",
  partnershipsEmail: "jalubold@gmail.com",
  social: [],
  prelaunch: true,
  newsletter: false,
  googleAnalyticsId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-3TTH3ZZXJ3",
  googleTagManagerId: env.NEXT_PUBLIC_GTM_ID ?? "GTM-NLNXN6HT",
};

export const mainNav = [
  { label: "All deals", href: "/deals" },
  { label: "Categories", href: "/categories" },
  { label: "Free credits", href: "/categories/free-credits" },
  { label: "Startup perks", href: "/categories/startup-perks" },
] as const;
