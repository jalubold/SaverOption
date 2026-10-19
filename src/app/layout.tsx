import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Instrument_Serif } from "next/font/google";
import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { GoogleTagManagerNoScript, GoogleTagManagerScript } from "@/components/analytics/google-tag-manager";
import { VisitBeacon } from "@/components/analytics/visit-beacon";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteJsonLd } from "@/lib/seo";
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
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.locale} style={brandVars} className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <GoogleTagManagerScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <GoogleTagManagerNoScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={websiteJsonLd()} />
        <VisitBeacon />
      </body>
    </html>
  );
}
