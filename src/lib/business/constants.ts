/**
 * Saver Option Business: shared vocabulary (statuses, categories, roles) with
 * their labels. Pure module, no imports, so it runs in Node tests as-is.
 */

export const BILLING_INTERVALS = ["monthly", "quarterly", "yearly", "custom"] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const INTERVAL_UNITS = ["day", "week", "month", "year"] as const;
export type IntervalUnit = (typeof INTERVAL_UNITS)[number];

export const billingIntervalLabels: Record<BillingInterval, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  custom: "Custom",
};

export const SUBSCRIPTION_STATUSES = ["active", "trial", "paused", "cancelled", "expired"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  active: "Active",
  trial: "Trial",
  paused: "Paused",
  cancelled: "Cancelled",
  expired: "Expired",
};

export const PRICING_MODELS = ["flat", "per_seat"] as const;
export type PricingModel = (typeof PRICING_MODELS)[number];

export const pricingModelLabels: Record<PricingModel, string> = {
  flat: "Flat price",
  per_seat: "Per seat",
};

export const RENEWAL_DECISIONS = ["undecided", "renew", "renegotiate", "cancel"] as const;
export type RenewalDecision = (typeof RENEWAL_DECISIONS)[number];

export const renewalDecisionLabels: Record<RenewalDecision, string> = {
  undecided: "Not decided",
  renew: "Renew",
  renegotiate: "Renegotiate",
  cancel: "Cancel",
};

export const RENEWAL_OUTCOMES = ["renewed", "renegotiated", "cancelled"] as const;
export type RenewalOutcome = (typeof RENEWAL_OUTCOMES)[number];

export const SOFTWARE_STATUSES = ["active", "evaluating", "deprecated", "archived"] as const;
export type SoftwareStatus = (typeof SOFTWARE_STATUSES)[number];

export const softwareStatusLabels: Record<SoftwareStatus, string> = {
  active: "Active",
  evaluating: "Evaluating",
  deprecated: "Deprecated",
  archived: "Archived",
};

export const SOFTWARE_CATEGORIES = [
  "communication",
  "video_meetings",
  "project_management",
  "documentation",
  "design",
  "development",
  "cloud_hosting",
  "ai",
  "crm_sales",
  "marketing",
  "customer_support",
  "analytics",
  "finance_accounting",
  "hr_people",
  "security",
  "storage",
  "productivity",
  "other",
] as const;
export type SoftwareCategory = (typeof SOFTWARE_CATEGORIES)[number];

export const categoryLabels: Record<SoftwareCategory, string> = {
  communication: "Team chat",
  video_meetings: "Video meetings",
  project_management: "Project management",
  documentation: "Docs & knowledge base",
  design: "Design",
  development: "Developer tools",
  cloud_hosting: "Cloud & hosting",
  ai: "AI tools",
  crm_sales: "CRM & sales",
  marketing: "Marketing",
  customer_support: "Customer support",
  analytics: "Analytics",
  finance_accounting: "Finance & accounting",
  hr_people: "HR & people",
  security: "Security & identity",
  storage: "File storage",
  productivity: "Office & productivity",
  other: "Other",
};

/**
 * Categories where two active tools usually do the same job, so a second one is
 * worth a look. Left out on purpose: developer tools, cloud, AI, security,
 * marketing and "other", where teams commonly run several tools by design.
 */
export const OVERLAP_PRONE_CATEGORIES: ReadonlySet<SoftwareCategory> = new Set([
  "communication",
  "video_meetings",
  "project_management",
  "documentation",
  "design",
  "crm_sales",
  "customer_support",
  "analytics",
  "finance_accounting",
  "hr_people",
  "storage",
  "productivity",
]);

export const ROLES = ["owner", "admin", "finance", "member", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const roleLabels: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  finance: "Finance",
  member: "Member",
  viewer: "Read-only",
};

export const roleDescriptions: Record<Role, string> = {
  owner: "Full access, including workspace settings and members.",
  admin: "Manages settings, members, departments and every software record.",
  finance: "Manages subscriptions, payments, renewals, reports and savings.",
  member: "Sees the workspace and edits the software and subscriptions they own.",
  viewer: "Sees the workspace without changing anything.",
};

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const;

export const DATE_FORMATS = ["MMM d, yyyy", "d MMM yyyy", "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy"] as const;
export type DateFormat = (typeof DATE_FORMATS)[number];

export const OPPORTUNITY_TYPES = [
  "unused_licenses",
  "underutilized_licenses",
  "overlapping_software",
  "expensive_subscription",
  "annual_billing",
  "software_alternative",
  "renewal_review",
  "marketplace_deal",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const opportunityTypeLabels: Record<OpportunityType, string> = {
  unused_licenses: "Unused licenses",
  underutilized_licenses: "Underutilized licenses",
  overlapping_software: "Potential overlap",
  expensive_subscription: "High-cost subscription",
  annual_billing: "Annual billing",
  software_alternative: "Alternative software",
  renewal_review: "Renewal review",
  marketplace_deal: "Saver Option deal",
};

export const OPPORTUNITY_STATUSES = ["open", "reviewed", "dismissed", "actioned", "resolved"] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

/** The Spend Detective's recommendation states (stored values unchanged). "Realized" is shown on top of "Accepted" once a confirmed saving exists. */
export const opportunityStatusLabels: Record<OpportunityStatus, string> = {
  open: "New",
  reviewed: "Reviewing",
  dismissed: "Dismissed",
  actioned: "Accepted",
  resolved: "No longer detected",
};

export type Confidence = "low" | "medium" | "high";

/** A reasonable set of currencies for the pickers; any ISO 4217 code is accepted by the server. */
export const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "SGD", "IDR", "INR", "JPY", "CHF", "SEK", "NZD", "BRL", "MXN", "ZAR", "AED"] as const;
