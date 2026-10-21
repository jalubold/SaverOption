import { headers } from "next/headers";
import { siteConfig } from "@/config/site";

/**
 * Absolute origin of the current request (so redirects work on preview
 * deployments too), falling back to the configured site URL.
 */
export async function requestOrigin(): Promise<string> {
  // Production links (checkout redirects, receipt emails) always use the real domain.
  if (process.env.VERCEL_ENV === "production") return siteConfig.url;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
    return `${proto === "http" ? "http" : "https"}://${host}`;
  }
  return siteConfig.url;
}
