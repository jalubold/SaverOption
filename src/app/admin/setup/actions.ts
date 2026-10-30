"use server";

import { revalidatePath, updateTag } from "next/cache";
import { DODO_PRODUCTS_TAG } from "@/lib/server/dodo";
import { setupLemonSqueezy, type SetupResult } from "@/lib/server/lemonsqueezy-setup";
import { requestOrigin } from "@/lib/server/origin";
import { getUser, isAdmin } from "@/lib/server/supabase";

export type ConnectState = SetupResult | null;

/** Admin-only: reads the Dodo products again now (after changing a price or billing period in Dodo). */
export async function recheckDodoAction(): Promise<void> {
  if (!isAdmin(await getUser())) return;
  updateTag(DODO_PRODUCTS_TAG);
  // The plans and prices shown across the site come from these products.
  revalidatePath("/", "layout");
}

/** Admin-only: finds the store and subscription variants and registers the webhook (see lemonsqueezy-setup.ts). */
export async function connectLemonSqueezyAction(_prev: ConnectState): Promise<ConnectState> {
  if (!isAdmin(await getUser())) return { ok: false, error: "Not allowed." };
  const result = await setupLemonSqueezy(await requestOrigin());
  // Prices come from Lemon Squeezy, so cached pages that show them are rebuilt.
  if (result.ok) revalidatePath("/", "layout");
  revalidatePath("/admin/setup");
  return result;
}
