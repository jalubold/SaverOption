import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.demoMode) {
    // Preview builds with sample content should not be indexed.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
