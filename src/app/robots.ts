import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.prelaunch) {
    // Pre-launch builds should not be indexed.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/api/", "/dashboard", "/admin", "/claim", "/auth/", "/login", "/signup", "/reset-password", "/update-password", "/promote/success", "/listings/*/visit"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
