import { siteConfig } from "@/config/site";
import { getAudiences, getCatalogStats, getCategories, queryOffers } from "@/lib/catalog";
import { expiryLabel, formatDate, headlineValue, summarizePrice } from "@/lib/format";
import { claimMethodLabels, offerTypeLabels } from "@/lib/labels";
import { absoluteUrl } from "@/lib/seo";
import type { OfferView } from "@/lib/types";

/**
 * /llms.txt and /llms-full.txt (llmstxt.org): the site in plain Markdown for AI
 * assistants and answer engines — what it is, how listings are sourced, and the
 * live offers with their key facts and links. Built from the same catalog as the pages.
 */

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

function verificationText(o: OfferView): string {
  if (o.verification.status === "verified") return `Verified by our editors${o.verification.checkedAt ? ` on ${formatDate(o.verification.checkedAt)}` : ""}`;
  return "Unverified (taken from the provider's site; not yet checked by an editor)";
}

const ABOUT = (offers: number, products: number, updated?: string) =>
  [
    `${siteConfig.name} is a directory of software offers: discounts, free credits, free trials, student and startup programs, lifetime licences and open-source alternatives.`,
    `It lists ${offers} live offers from ${products} products${updated ? `, last updated ${formatDate(updated)}` : ""}. Every listing links to the provider's own page, which has the final terms; ${siteConfig.name} doesn't sell the software.`,
    `Each listing says whether an editor has checked it against the provider's page ("Verified", with the date) or not yet ("Unverified"). Sponsored listings and affiliate links are always labelled; editorial picks are never paid for.`,
  ].join(" ");

export async function llmsTxt(): Promise<string> {
  const [stats, categories, audiences, { offers }] = await Promise.all([
    getCatalogStats(),
    getCategories(),
    getAudiences(),
    queryOffers({ sort: "newest" }),
  ]);
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    ABOUT(stats.offers, stats.products, stats.lastUpdated),
    "",
    "## Categories",
    "",
    ...categories.filter((c) => c.count > 0).map((c) => `- [${c.name}](${absoluteUrl(`/categories/${c.slug}`)}): ${c.description} (${c.count} offers)`),
    "",
    "## Collections",
    "",
    ...audiences.filter((a) => a.count > 0).map((a) => `- [Software deals for ${a.name}](${absoluteUrl(`/for/${a.slug}`)}): ${a.description} (${a.count} offers)`),
    "",
    "## Newest offers",
    "",
    ...offers.slice(0, 40).map((o) => `- [${oneLine(o.title)}](${absoluteUrl(`/deals/${o.slug}`)}): ${oneLine(o.summary)}`),
    "",
    "## Optional",
    "",
    `- [Every live offer with its key facts](${absoluteUrl("/llms-full.txt")})`,
    `- [Search all deals](${absoluteUrl("/deals")})`,
    `- [About and how listings are checked](${absoluteUrl("/about")})`,
    `- [Disclosure: sponsored and affiliate links](${absoluteUrl("/disclosure")})`,
    `- [RSS feed of new offers](${absoluteUrl("/feed.xml")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ];
  return lines.join("\n");
}

function offerBlock(o: OfferView): string {
  const value = headlineValue(o);
  const price = summarizePrice(o.pricing);
  const expiry = expiryLabel(o);
  const facts = [
    `- Product: ${o.product.name} by ${o.provider.name} (${o.product.website})`,
    `- Type: ${offerTypeLabels[o.type]}; categories: ${o.categoryList.map((c) => c.name).join(", ")}`,
    value && `- Value: ${value}`,
    price?.current && `- Price: ${[price.current, price.was && `instead of ${price.was}`, price.note].filter(Boolean).join(", ")}`,
    `- How to claim: ${claimMethodLabels[o.claim.method].label}${o.claim.code ? ` (code ${o.claim.code})` : ""}${o.claim.note ? `. ${oneLine(o.claim.note)}` : ""}`,
    o.eligibility.length > 0 && `- Who it's for: ${o.eligibility.map(oneLine).join("; ")}`,
    o.terms.length > 0 && `- Key terms: ${o.terms.map(oneLine).join("; ")}`,
    o.regions && `- Regions: ${o.regions.scope === "global" ? "Worldwide" : "Limited"}${o.regions.note ? ` (${oneLine(o.regions.note)})` : ""}`,
    `- Ends: ${expiry ?? "No end date stated by the provider"}`,
    `- Status: ${verificationText(o)}; updated ${formatDate(o.updatedAt)}`,
    `- Provider's page: ${o.links.officialUrl}`,
    `- Listing: ${absoluteUrl(`/deals/${o.slug}`)}`,
  ].filter(Boolean);
  return [`### ${oneLine(o.title)}`, "", oneLine(o.summary), "", ...facts].join("\n");
}

export async function llmsFullTxt(): Promise<string> {
  const [stats, categories, { offers }] = await Promise.all([getCatalogStats(), getCategories(), queryOffers({ sort: "newest" })]);
  const sections = categories
    .filter((c) => c.count > 0)
    .map((c) => {
      // Each offer appears once, under its first category.
      const list = offers.filter((o) => o.categoryList[0]?.slug === c.slug);
      return list.length ? [`## ${c.name}`, "", oneLine(c.intro), "", ...list.map(offerBlock).flatMap((b) => [b, ""])].join("\n") : null;
    })
    .filter(Boolean);
  return [`# ${siteConfig.name}: every live offer`, "", `> ${siteConfig.description}`, "", ABOUT(stats.offers, stats.products, stats.lastUpdated), "", ...sections].join("\n");
}
