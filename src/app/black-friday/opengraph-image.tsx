import { siteConfig } from "@/config/site";
import { getCampaign, getCampaignOffers } from "@/lib/catalog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `Black Friday software deals on ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const c = getCampaign("black-friday");
  if (!c) return ogImage({ title: siteConfig.tagline });
  const offers = await getCampaignOffers("black-friday");
  return ogImage({
    eyebrow: offers.length ? `${offers.length} deal${offers.length === 1 ? "" : "s"} · Cyber Monday 30 Nov` : "Black Friday 27 Nov · Cyber Monday 30 Nov",
    title: c.title,
    detail: "From each provider's own announcement, with dates and terms.",
    colors: c.color,
  });
}
