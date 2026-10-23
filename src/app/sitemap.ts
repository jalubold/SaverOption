import type { MetadataRoute } from "next";
import { siteUrls } from "@/lib/site-urls";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return siteUrls();
}
