import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";
import type { Category, CategorySlug, OfferView } from "@/lib/types";

/**
 * Questions and answers for category pages. Answers are built from the listed
 * offers themselves (counts, card requirements, end dates, verification), plus
 * one plain explainer per category, so they stay true as the catalog changes.
 * The same text is shown on the page and in FAQPage structured data.
 */

export interface FaqItem {
  q: string;
  a: string;
  /** Offers the answer names, linked under it on the page. */
  links?: { href: string; label: string }[];
}

const explainers: Partial<Record<CategorySlug, FaqItem>> = {
  "software-deals": {
    q: "Where do these software deals come from?",
    a: `From the software providers' own sites: pricing pages, program pages and announcements. ${siteConfig.name} doesn't sell the software; you claim each offer with the provider, under the provider's terms.`,
  },
  "ai-tools": {
    q: "Are free AI plans and credits limited?",
    a: "Yes. Free AI plans and credits come with usage limits, such as monthly credits, tokens or characters, and promotional pricing often ends on a set date. Each listing shows the limits and dates the provider states.",
  },
  "saas-discounts": {
    q: "How do SaaS discounts usually work?",
    a: "The common forms are a lower price for annual billing, a discounted first year, and programs for nonprofits or startups. Where the provider says what the price renews at, the listing shows it.",
  },
  "lifetime-deals": {
    q: "What does a lifetime software licence include?",
    a: "You pay once instead of a recurring subscription. Licences usually cover a set number of devices and a limited period of updates, and some exclude future features. Each listing shows what the licence covers, and the refund policy when the maker states one.",
  },
  "free-credits": {
    q: "Do free credits expire?",
    a: "Usually. Credits from cloud, API and infrastructure providers typically expire after a fixed period, and some need a payment method on file. Each listing shows the conditions the provider states.",
  },
  "free-trials": {
    q: "Does a free trial turn into a paid plan automatically?",
    a: "It depends on the provider. Trials that take a card can roll into a paid plan unless you cancel; trials without a card usually just end. Each listing shows the trial length and whether a card is required, as the provider states.",
  },
  "student-discounts": {
    q: "How do I prove I'm a student?",
    a: "Most student plans ask for a school email address or proof of enrolment, and some are also open to teachers. Each listing explains the provider's own verification steps and who is eligible.",
  },
  "startup-perks": {
    q: "Who qualifies for startup programs?",
    a: "Eligibility usually depends on funding stage, company age, revenue, or membership of a partner accelerator or VC. Most programs need an application. Each listing gives the provider's own criteria.",
  },
  "open-source": {
    q: "Is self-hosted open-source software really free?",
    a: "The software is free to download and run, but you provide the server and maintenance yourself. Many projects also sell a managed cloud version or paid features. Each listing names the licence and what the paid version adds.",
  },
  exclusive: {
    q: "What are exclusive offers?",
    a: `Offers arranged directly with software providers for ${siteConfig.name} readers. They're marked Exclusive, and any commercial relationship is disclosed on the listing.`,
  },
};

const names = (list: OfferView[], max = 5) => list.slice(0, max).map((o) => o.product.name);

function sentenceList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export function categoryFaq(category: Category, offers: OfferView[]): FaqItem[] {
  const items: FaqItem[] = [];
  const n = offers.length;
  const providers = new Set(offers.map((o) => o.provider.id)).size;
  const updated = offers.map((o) => o.updatedAt).sort().at(-1);

  items.push({
    q: `How many ${category.name.toLowerCase()} offers are listed?`,
    a:
      n === 0
        ? `There are no live ${category.name.toLowerCase()} offers right now. Expired offers are hidden from this page.`
        : `${n} live offer${n === 1 ? "" : "s"} from ${providers} provider${providers === 1 ? "" : "s"}${updated ? `, last updated ${formatDate(updated)}` : ""}. Expired offers are hidden from this page, and every listing links to the provider's own page.`,
  });

  const explainer = explainers[category.slug];
  if (explainer) items.push(explainer);

  const noCard = offers.filter((o) => o.requirements?.cardRequired === false);
  const card = offers.filter((o) => o.requirements?.cardRequired === true);
  if (noCard.length) {
    items.push({
      q: `Which ${category.name.toLowerCase()} offers don't need a credit card?`,
      a: `${noCard.length} say no credit card is needed, including ${sentenceList(names(noCard))}.${card.length ? ` ${card.length} say a card is required.` : ""} For the rest the provider doesn't say, so check the listing before you sign up.`,
      links: noCard.slice(0, 5).map((o) => ({ href: `/deals/${o.slug}`, label: o.title })),
    });
  }

  const ending = offers.filter((o) => o.expiresAt && !o.isExpired).sort((a, b) => a.expiresAt!.localeCompare(b.expiresAt!));
  if (ending.length) {
    items.push({
      q: `Which ${category.name.toLowerCase()} offers end soon?`,
      a: `${ending.length} have an end date set by the provider. The next to end: ${sentenceList(ending.slice(0, 3).map((o) => `${o.product.name} (${formatDate(o.expiresAt!)})`))}. Offers without an end date can still change at any time.`,
      links: ending.slice(0, 3).map((o) => ({ href: `/deals/${o.slug}`, label: o.title })),
    });
  }

  if (n) {
    const verified = offers.filter((o) => o.verification.status === "verified").length;
    items.push({
      q: "Are these offers verified?",
      a: `${verified} of ${n} ${verified === 1 ? "has" : "have"} been checked by our editors against the provider's own page and ${verified === 1 ? "is" : "are"} marked Verified with the date checked. The others are marked Unverified until an editor checks them. The provider's page always has the final terms.`,
    });
  }

  items.push({
    q: "How do I claim an offer?",
    a: "Open the listing to see who is eligible and the steps, then use View deal to go to the provider's page and claim it there. Some offers apply automatically; others need a code, an application or proof of eligibility, and the listing says which.",
  });

  return items;
}
