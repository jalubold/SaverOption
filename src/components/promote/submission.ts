import { siteConfig } from "@/config/site";
import { formatPlanRate, type ListingPlan } from "@/config/listing-plans";
import { normalizeWebsite, type PromoteDetails } from "@/components/promote/validation";

/**
 * Email fallback while online checkout is closed (or not configured): the listing
 * request is composed as an email the founder sends from their own email app.
 */

export interface ListingEmail {
  to: string;
  subject: string;
  body: string;
  /** URL-encoded mailto: link. */
  href: string;
}

export function buildListingEmail(details: PromoteDetails, plan: ListingPlan, reference?: string): ListingEmail {
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
    ...(details.description?.trim() ? [`- Description: ${details.description.trim()}`] : []),
    ...(reference ? [`- Submission reference: ${reference}`] : []),
    "",
    "Selected Listing Plan",
    `- Plan: ${plan.name} subscription`,
    `- Price: ${formatPlanRate(plan)}`,
    "",
    "Please let me know the next steps to complete my listing.",
    "",
    "Thank you!",
  ].join("\r\n");
  // encodeURIComponent (not URLSearchParams) so spaces become %20, which every mail client decodes.
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { to, subject, body, href };
}
