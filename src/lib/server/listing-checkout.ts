import { withPrices, type ListingPlan } from "@/config/listing-plans";
import { dodoCheckoutMode, dodoPrices } from "@/lib/server/dodo";
import { checkoutMode, getListingPlans, type CheckoutMode } from "@/lib/server/lemonsqueezy";

/**
 * Which payment provider a listing checkout goes to. Dodo Payments takes every checkout
 * it can (live, or test where test payments are allowed); otherwise Lemon Squeezy works as
 * before. Subscriptions keep renewing with the provider they started with.
 */

export type ListingProvider = "dodo" | "lemonsqueezy";

export const providerNames: Record<ListingProvider, string> = {
  dodo: "Dodo Payments",
  lemonsqueezy: "Lemon Squeezy",
};

export interface CheckoutChoice {
  provider: ListingProvider;
  mode: CheckoutMode;
}

/** Where this visitor's checkout goes, and in which mode. */
export async function checkoutChoice({ admin = false }: { admin?: boolean } = {}): Promise<CheckoutChoice> {
  const dodo = await dodoCheckoutMode({ admin });
  if (dodo === "live" || dodo === "test") return { provider: "dodo", mode: dodo };
  const ls = await checkoutMode({ admin });
  if (ls === "live" || ls === "test") return { provider: "lemonsqueezy", mode: ls };
  // Nobody can check out right now: name the provider that's being set up.
  return dodo === "unconfigured" ? { provider: "lemonsqueezy", mode: ls } : { provider: "dodo", mode: dodo };
}

/** The plans with the prices set at a provider (defaults where it has none). */
export async function plansFor(provider: ListingProvider): Promise<ListingPlan[]> {
  return provider === "dodo" ? withPrices(await dodoPrices()) : getListingPlans();
}

/** The plans as ordinary visitors buy them right now (what cached pages show). */
export async function listingPlansForSale(): Promise<ListingPlan[]> {
  return plansFor((await checkoutChoice()).provider);
}
