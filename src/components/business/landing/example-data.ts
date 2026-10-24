import { formatMoney, groupMonthly, monthlyEquivalent, seatSummary, summarizeSpend, type SubscriptionCalc } from "@/lib/business/calc";
import { billingIntervalLabels } from "@/lib/business/constants";

/**
 * Example data for the public landing and sign-in previews: a fictional
 * company's software, with sample prices (not vendor quotes). Every figure is
 * derived with the same calculation layer the app uses.
 */

export type ExampleSub = SubscriptionCalc & {
  name: string;
  logo: string | null;
  category: string;
  department: string;
  /** Days until the next renewal, relative to "today" in the preview. */
  renewsIn: number;
  /** Days until the cancellation deadline, for auto-renewing plans that have one. */
  cancelBy?: number;
};

export const logoSrc = (slug: string) => `/logos/business/${slug}.svg`;

export const usd = (minor: number) => formatMoney(Math.round(minor), "USD", { whole: true });

type Seed = Pick<ExampleSub, "id" | "name" | "priceMinor" | "billingInterval" | "category" | "department" | "renewsIn"> & Partial<ExampleSub> & { slug: string };

const sub = ({ slug, ...e }: Seed): ExampleSub => ({
  currency: "USD",
  customIntervalCount: null,
  customIntervalUnit: null,
  pricingModel: "flat",
  purchasedSeats: null,
  status: "active",
  archived: false,
  nextRenewalDate: null,
  namedSeats: 0,
  reportedAssignedSeats: null,
  logo: logoSrc(slug),
  ...e,
});

export const exampleSubs: ExampleSub[] = [
  sub({ id: "aws", slug: "aws", name: "AWS", priceMinor: 184_000, billingInterval: "monthly", category: "Infrastructure", department: "Engineering", renewsIn: 9 }),
  sub({ id: "hubspot", slug: "hubspot", name: "HubSpot", priceMinor: 270_000, billingInterval: "quarterly", category: "Sales & marketing", department: "Sales", renewsIn: 32, cancelBy: 3 }),
  sub({ id: "gws", slug: "google-workspace", name: "Google Workspace", priceMinor: 70_000, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 50, namedSeats: 50, category: "Collaboration", department: "Company-wide", renewsIn: 26 }),
  sub({ id: "datadog", slug: "datadog", name: "Datadog", priceMinor: 62_000, billingInterval: "monthly", category: "Infrastructure", department: "Engineering", renewsIn: 11 }),
  sub({ id: "notion", slug: "notion", name: "Notion", priceMinor: 50_000, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 50, namedSeats: 41, category: "Collaboration", department: "Company-wide", renewsIn: 14 }),
  sub({ id: "github", slug: "github", name: "GitHub", priceMinor: 42_000, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 20, namedSeats: 18, category: "Developer tools", department: "Engineering", renewsIn: 17 }),
  sub({ id: "slack", slug: "slack", name: "Slack", priceMinor: 39_375, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 45, namedSeats: 38, category: "Collaboration", department: "Company-wide", renewsIn: 6 }),
  sub({ id: "mailchimp", slug: "mailchimp", name: "Mailchimp", priceMinor: 35_000, billingInterval: "monthly", category: "Sales & marketing", department: "Marketing", renewsIn: 24 }),
  sub({ id: "linear", slug: "linear", name: "Linear", priceMinor: 20_000, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 20, namedSeats: 16, category: "Developer tools", department: "Engineering", renewsIn: 3 }),
  sub({ id: "zoom", slug: "zoom", name: "Zoom", priceMinor: 225_000, billingInterval: "yearly", pricingModel: "per_seat", purchasedSeats: 15, namedSeats: 9, category: "Collaboration", department: "Company-wide", renewsIn: 52 }),
  sub({ id: "figma", slug: "figma", name: "Figma", priceMinor: 216_000, billingInterval: "yearly", pricingModel: "per_seat", purchasedSeats: 12, namedSeats: 8, category: "Design", department: "Product", renewsIn: 21 }),
  sub({ id: "confluence", slug: "confluence", name: "Confluence", priceMinor: 9_000, billingInterval: "monthly", pricingModel: "per_seat", purchasedSeats: 15, namedSeats: 12, category: "Collaboration", department: "Engineering", renewsIn: 28 }),
];

export const byId = (id: string) => exampleSubs.find((s) => s.id === id)!;

const periodShort = { monthly: "mo", quarterly: "qtr", yearly: "yr", custom: "period" } as const;

/** "$2,700/qtr": the price per billing period, as recorded. */
export const pricePerPeriod = (s: ExampleSub) => `${usd(s.priceMinor ?? 0)}/${periodShort[s.billingInterval]}`;
export const monthlyOf = (s: ExampleSub) => monthlyEquivalent(s) ?? 0;
export const intervalLabel = (s: ExampleSub) => billingIntervalLabels[s.billingInterval];

export const summary = summarizeSpend(exampleSubs, "2026-10-23");
export const monthlyTotal = summary.monthly.USD ?? 0;
export const annualTotal = summary.annualized.USD ?? 0;

/** Example run-rate for the last 12 months, in dollars, ending at the current total. */
export const runRateTrend = [5480, 5520, 5610, 5650, 5790, 5840, 5960, 6040, 6110, 6190, 6300, Math.round(monthlyTotal / 100)];

function grouped(key: (s: ExampleSub) => string) {
  return [...groupMonthly(exampleSubs, key).entries()]
    .map(([label, t]) => ({ label, value: t.USD ?? 0, display: `${usd(t.USD ?? 0)}/mo` }))
    .sort((a, b) => b.value - a.value);
}

export const byCategory = grouped((s) => s.category);
export const byDepartment = grouped((s) => s.department);

export const topVendors = [...exampleSubs]
  .sort((a, b) => monthlyOf(b) - monthlyOf(a))
  .map((s) => ({ label: s.name, value: monthlyOf(s), display: `${usd(monthlyOf(s))}/mo`, logo: s.logo }));

export const seated = exampleSubs
  .filter((s) => s.purchasedSeats)
  .map((s) => ({ s, seats: seatSummary(s) }))
  .sort((a, b) => (a.seats.utilization ?? 0) - (b.seats.utilization ?? 0));

export const seatTotals = seated.reduce(
  (t, { seats }) => ({ purchased: t.purchased + (seats.purchased ?? 0), assigned: t.assigned + seats.assigned, unusedMonthly: t.unusedMonthly + (seats.unusedMonthly ?? 0) }),
  { purchased: 0, assigned: 0, unusedMonthly: 0 },
);
export const seatUtilization = seatTotals.purchased ? (seatTotals.assigned / seatTotals.purchased) * 100 : null;

/** Potential savings from unused per-seat licenses — an estimate, not a guarantee. */
export const potentialAnnual = seatTotals.unusedMonthly * 12;

export const renewalsIn30 = exampleSubs.filter((s) => s.renewsIn <= 30).length;

export interface TimelineEntry {
  id: string;
  name: string;
  logo: string | null;
  daysLeft: number;
  amount: string;
  kind: "renewal" | "deadline";
}

export const timeline: TimelineEntry[] = exampleSubs.flatMap((s) => {
  const out: TimelineEntry[] = [];
  if (s.renewsIn <= 30) out.push({ id: s.id, name: s.name, logo: s.logo, daysLeft: s.renewsIn, amount: pricePerPeriod(s), kind: "renewal" });
  if (s.cancelBy !== undefined && s.cancelBy <= 30) out.push({ id: s.id, name: s.name, logo: s.logo, daysLeft: s.cancelBy, amount: pricePerPeriod(s), kind: "deadline" });
  return out;
});

/** Logos for "track the tools you already pay for" rows (what the product can record — not customers or integrations). */
export const trackable: { name: string; src: string }[] = [
  ["Slack", "slack"],
  ["Notion", "notion"],
  ["Figma", "figma"],
  ["AWS", "aws"],
  ["Google Workspace", "google-workspace"],
  ["GitHub", "github"],
  ["Zoom", "zoom"],
  ["HubSpot", "hubspot"],
  ["Salesforce", "salesforce"],
  ["Jira", "jira"],
  ["Linear", "linear"],
  ["Asana", "asana"],
  ["Miro", "miro"],
  ["Datadog", "datadog"],
  ["Stripe", "stripe"],
  ["OpenAI", "openai"],
  ["Dropbox", "dropbox"],
  ["Adobe", "adobe"],
  ["Microsoft Teams", "microsoft-teams"],
  ["Zendesk", "zendesk"],
  ["Intercom", "intercom"],
  ["1Password", "1password"],
  ["Vercel", "vercel"],
  ["Airtable", "airtable"],
].map(([name, slug]) => ({ name, src: logoSrc(slug) }));
