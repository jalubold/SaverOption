import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Instrument_Serif } from "next/font/google";
import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { VisitBeacon } from "@/components/analytics/visit-beacon";
import { SiteFooter } from "@/components/layout/site-footer";
import { PromoteProvider } from "@/components/promote/promote-modal";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getListingPlans } from "@/lib/server/lemonsqueezy";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    // What people search for, then the brand (the tagline is on the page itself).
    default: `${siteConfig.name}: software deals, free credits and startup perks`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  // Keep pre-launch builds out of search indexes.
  robots: siteConfig.prelaunch ? { index: false, follow: false } : undefined,
  // Search engine "HTML tag" verification: the content value of the tag each one gives you.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
    yandex: process.env.YANDEX_SITE_VERIFICATION?.trim() || undefined,
    other: process.env.BING_SITE_VERIFICATION?.trim() ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION.trim() } : undefined,
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${siteConfig.name}: new software deals` }] },
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
};

const brandVars = {
  "--brand-accent": siteConfig.theme.accent,
  "--brand-accent-deep": siteConfig.theme.accentDeep,
  "--brand-accent-on-dark": siteConfig.theme.accentOnDark,
  "--brand-accent-contrast": siteConfig.theme.accentContrast,
} as CSSProperties;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Current prices for the promote popup; cached pages are rebuilt when Lemon Squeezy is (re)connected.
  const plans = await getListingPlans();
  return (
    <html lang={siteConfig.locale} style={brandVars} className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <PromoteProvider plans={plans}>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </PromoteProvider>
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <VisitBeacon />
        <Analytics />
      </body>
    </html>
  );
}
