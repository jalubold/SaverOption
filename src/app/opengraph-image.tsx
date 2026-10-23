import { siteConfig } from "@/config/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return ogImage({ title: siteConfig.tagline, detail: "Software deals · Free credits · Startup perks · Student discounts" });
}
