import { withPrices, type ListingPlan } from "@/config/listing-plans";
import { dodoApiKey, dodoCheckoutMode, dodoPrices } from "@/lib/server/dodo";
import { checkoutMode, getListingPlans, type CheckoutMode } from "@/lib/server/lemonsqueezy";

/**
 * Which payment provider a listing checkout goes to. Once a Dodo Payments API key is set,
 * every new checkout is Dodo's: when Dodo can't take it yet (a product missing or billing
 * differently, a test key on production), the form saves the submission and offers email
 * instead of falling back to Lemon Squeezy, and /admin/setup says why. Without a Dodo key,
 * Lemon Squeezy works as before. Subscriptions keep renewing with the provider they started with.
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
  if (dodoApiKey()) return { provider: "dodo", mode: await dodoCheckoutMode({ admin }) };
  return { provider: "lemonsqueezy", mode: await checkoutMode({ admin }) };
}

/** The plans with the prices set at a provider (defaults where it has none). */
export async function plansFor(provider: ListingProvider): Promise<ListingPlan[]> {
  return provider === "dodo" ? withPrices(await dodoPrices()) : getListingPlans();
}

/** The plans as ordinary visitors buy them right now (what cached pages show). */
export async function listingPlansForSale(): Promise<ListingPlan[]> {
  return plansFor((await checkoutChoice()).provider);
}
