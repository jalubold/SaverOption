"use server";

import { revalidatePath } from "next/cache";
import { setupLemonSqueezy, type SetupResult } from "@/lib/server/lemonsqueezy-setup";
import { requestOrigin } from "@/lib/server/origin";
import { getUser, isAdmin } from "@/lib/server/supabase";

export type ConnectState = SetupResult | null;

/** Admin-only: finds the store and subscription variants and registers the webhook (see lemonsqueezy-setup.ts). */
export async function connectLemonSqueezyAction(_prev: ConnectState): Promise<ConnectState> {
  if (!isAdmin(await getUser())) return { ok: false, error: "Not allowed." };
  const result = await setupLemonSqueezy(await requestOrigin());
  // Prices come from Lemon Squeezy, so cached pages that show them are rebuilt.
  if (result.ok) revalidatePath("/", "layout");
  revalidatePath("/admin/setup");
  return result;
}
