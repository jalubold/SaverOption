import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/** Private and redirect routes: never useful in search results or AI answers. */
const PRIVATE = ["/go/", "/api/", "/dashboard", "/admin", "/claim", "/auth/", "/login", "/signup", "/promote/success", "/listings/*/visit"];

/**
 * AI search and assistant crawlers, named so it's explicit they're welcome on
 * public pages. (A crawler named in its own group ignores the "*" group, so
 * that group repeats the private paths.)
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.prelaunch) {
    // Pre-launch builds should not be indexed.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
