import Script from "next/script";

/** GA4 measurement ID, or null when unset or malformed. */
export function googleAnalyticsId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

/**
 * Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Client-side navigations are tracked by GA4's enhanced measurement (history
 * changes), so no manual page_view events are sent.
 */
export function GoogleAnalytics() {
  const id = googleAnalyticsId();
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
