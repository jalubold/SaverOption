import { siteConfig } from "@/config/site";
import type { ListingPlan } from "@/config/listing-plans";
import { normalizeWebsite, type PromoteDetails } from "@/components/promote/validation";

/**
 * Temporary manual submission: the listing request is composed as an email the
 * founder sends from their own email app. Nothing is sent from the site.
 * Replace this module with a checkout call once online payments are available.
 */

export interface ListingEmail {
  to: string;
  subject: string;
  body: string;
  /** URL-encoded mailto: link. */
  href: string;
}

export function formatPlanPrice(plan: ListingPlan): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(plan.price);
}

export function buildListingEmail(details: PromoteDetails, plan: ListingPlan): ListingEmail {
  const to = siteConfig.listingsEmail;
  const subject = `${siteConfig.name} — SaaS Deal Listing Submission`;
  const website = normalizeWebsite(details.website) ?? details.website.trim();
  const body = [
    `Hi ${siteConfig.name} team,`,
    "",
    "I'd like to submit my SaaS product for a deal listing.",
    "",
    "Product Details",
    `- Product Name: ${details.productName.trim()}`,
    `- Product Website: ${website}`,
    `- Contact Email: ${details.email.trim()}`,
    "",
    "Selected Listing Plan",
    `- Plan: ${plan.name} (${plan.days}-day listing)`,
    `- Price: ${formatPlanPrice(plan)}`,
    "",
    "Please let me know the next steps to complete my listing.",
    "",
    "Thank you!",
  ].join("\r\n");
  // encodeURIComponent (not URLSearchParams) so spaces become %20, which every mail client decodes.
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { to, subject, body, href };
}
