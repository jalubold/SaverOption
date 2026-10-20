import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "software-deals",
    name: "Software Deals",
    description: "Discounts and promotions across desktop, web and developer software.",
    intro:
      "Price cuts, promotional pricing and bundles on the software teams and individuals use every day. Each listing links to the provider so you can confirm current terms before you buy.",
    icon: "tag",
    color: { from: "#4f8dff", to: "#1d4fd8" },
    order: 1,
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "Offers on AI assistants, model APIs, and AI-powered creative tools.",
    intro:
      "Credits, trials and discounts on AI products — from model APIs and coding assistants to transcription, writing and video tools.",
    icon: "sparkles",
    color: { from: "#9b6bff", to: "#5b21d6" },
    order: 2,
  },
  {
    slug: "saas-discounts",
    name: "SaaS Discounts",
    description: "Reduced pricing on subscription software for teams and businesses.",
    intro:
      "Subscription software adds up quickly. These are reduced-price plans, annual-billing discounts and first-year promotions on SaaS products.",
    icon: "cloud",
    color: { from: "#22c3e6", to: "#0e7490" },
    order: 3,
  },
  {
    slug: "lifetime-deals",
    name: "Lifetime Deals",
    description: "Pay once instead of a recurring subscription.",
    intro:
      "One-time purchases that replace a recurring subscription. Lifetime deals often come with plan limits or exclude future features — read the terms on each listing before buying.",
    icon: "infinity",
    color: { from: "#ffbe3d", to: "#c27a06" },
    order: 4,
  },
  {
    slug: "free-credits",
    name: "Free Credits",
    description: "Usage credits for cloud, API and infrastructure providers.",
    intro:
      "Usage credits from cloud, API and infrastructure providers. Credits usually expire after a fixed period and may require a payment method on file.",
    icon: "coins",
    color: { from: "#22c58b", to: "#047857" },
    order: 5,
  },
  {
    slug: "free-trials",
    name: "Free Trials",
    description: "Extended or no-card trials so you can evaluate properly.",
    intro:
      "Trials that run longer than the default or skip the credit card requirement, giving you time to evaluate a tool with real work.",
    icon: "clock",
    color: { from: "#ff5c7a", to: "#c81e4a" },
    order: 6,
  },
  {
    slug: "student-discounts",
    name: "Student Discounts",
    description: "Free or reduced plans for students and educators.",
    intro:
      "Free and discounted plans for students, educators and academic institutions. Most require verification with a school email address or student ID.",
    icon: "graduation",
    color: { from: "#7b7ff7", to: "#4338ca" },
    order: 7,
  },
  {
    slug: "startup-perks",
    name: "Startup Perks",
    description: "Programs offering credits and discounts to early-stage companies.",
    intro:
      "Startup programs that provide credits, discounts or extended plans to early-stage companies. Eligibility often depends on funding stage, company age or accelerator membership.",
    icon: "rocket",
    color: { from: "#ff9a4d", to: "#e4570f" },
    order: 8,
  },
  {
    slug: "open-source",
    name: "Open-Source Alternatives",
    description: "Free, self-hostable alternatives to paid software.",
    intro:
      "Open-source projects you can self-host for free as an alternative to a paid subscription. Many also offer a paid managed cloud version.",
    icon: "code",
    color: { from: "#8fd14f", to: "#4d8a12" },
    order: 9,
  },
  {
    slug: "exclusive",
    name: "Exclusive Offers",
    description: "Offers arranged specifically for this site's readers.",
    intro:
      "Offers arranged directly with software providers for readers of this site. Exclusive offers are clearly marked, and we disclose any commercial relationship on each listing.",
    icon: "star",
    color: { from: "#e15cf5", to: "#a21caf" },
    order: 10,
  },
];
