import type { Campaign } from "@/lib/types";

/**
 * Seasonal sales. An offer joins one through `campaigns` only when the provider itself runs it as part
 * of that sale (its own Black Friday announcement), with the terms and dates it published.
 */
export const campaigns: Campaign[] = [
  {
    slug: "black-friday",
    name: "Black Friday",
    year: 2026,
    // Friday 27 November 2026, from midnight US Eastern, through the end of Cyber Monday (30 November) in US Pacific.
    startsAt: "2026-11-27T00:00:00-05:00",
    endsAt: "2026-11-30T23:59:59-08:00",
    cyberMonday: "2026-11-30",
    showFrom: "2026-11-01",
    showUntil: "2026-12-02",
    title: "Black Friday 2026 software deals",
    description:
      "Black Friday and Cyber Monday 2026 deals on SaaS, AI, developer and creative software, taken from each provider's own announcement, with the discount, dates and terms.",
    intro:
      "Black Friday and Cyber Monday deals on the software you pay for: SaaS, AI tools, developer tools, design apps, hosting and more. Each one comes from the provider's own announcement and links to it, with the discount, start and end dates and the terms. Early deals are listed as soon as they're published.",
    color: { from: "#f2545b", to: "#ffb547" },
    faq: [
      {
        q: "When is Black Friday 2026?",
        a: "Black Friday is Friday 27 November 2026 and Cyber Monday is Monday 30 November 2026. Many software companies start earlier or run their sale through the following week; each listing shows the dates the provider gives.",
      },
      {
        q: "Where do these Black Friday deals come from?",
        a: "From the providers themselves: a deal is listed once the company publishes its Black Friday or Cyber Monday offer on its own site, and every listing links to that page. We don't carry over last year's deals or guess this year's.",
      },
      {
        q: "Are the deals verified?",
        a: "Each listing says how it was checked. \"Verified\" means an editor read the provider's live page on the date shown; \"Unverified\" means the details come from the provider's site but the live page wasn't opened, so confirm the terms there before you buy.",
      },
      {
        q: "Does the Black Friday price renew at the same rate?",
        a: "Usually not. Most Black Friday discounts apply to the first billing period or the first year, then the regular price applies. Where the provider states the renewal price or the length of the discount, it's shown on the listing.",
      },
      {
        q: "Can new deals still appear?",
        a: "Yes. Most companies announce their Black Friday sale during November, so the list grows as the day gets closer. Deals disappear from the list once their stated end date has passed.",
      },
    ],
  },
];
