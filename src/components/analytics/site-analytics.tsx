"use client";

import { Analytics } from "@vercel/analytics/next";
import { isAutomatedBrowser } from "@/lib/bot-guard";

/**
 * Vercel Web Analytics, without visits from automated browsers (navigator.webdriver), which scrapers
 * use while claiming to be an ordinary Chrome. Keeps the public traffic figures (/stats and the
 * "visitors today" counts advertisers see) about people.
 */
export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (isAutomatedBrowser() ? null : event)} />;
}
