import { siteConfig } from "@/config/site";
import { queryOffers } from "@/lib/catalog";
import { parseDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of the newest offers, for feed readers, aggregators and crawlers. */
export async function GET() {
  const { offers } = await queryOffers({ sort: "newest" });
  const items = offers.slice(0, 50).map((o) => {
    const url = absoluteUrl(`/deals/${o.slug}`);
    return [
      "<item>",
      `<title>${esc(o.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${parseDate(o.publishedAt).toUTCString()}</pubDate>`,
      `<description>${esc(o.summary)}</description>`,
      ...o.categoryList.map((c) => `<category>${esc(c.name)}</category>`),
      "</item>",
    ].join("");
  });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${esc(`${siteConfig.name}: new software deals`)}</title>`,
    `<link>${siteConfig.url}</link>`,
    `<description>${esc(siteConfig.description)}</description>`,
    "<language>en</language>",
    `<atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>`,
    offers[0] ? `<lastBuildDate>${parseDate(offers.map((o) => o.updatedAt).sort().at(-1)!).toUTCString()}</lastBuildDate>` : "",
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
