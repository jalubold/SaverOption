"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { planLabels } from "@/lib/business/billing";
import { isUuid, type FormState } from "@/lib/business/form";
import { BizError, businessReady, getBizSession, WORKSPACE_COOKIE } from "@/lib/server/business/context";
import { redeemLifetimeCode } from "@/lib/server/business/lifetime";

/**
 * Redeems a lifetime (AppSumo) code on /business/redeem. The workspace comes
 * from the form, so this doesn't require it to be the one currently open;
 * redeemLifetimeCode checks the membership and role on the server.
 */
export async function redeemCodeAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    if (!businessReady()) return { error: "Saver Option Business isn't available right now." };
    const { user } = await getBizSession();
    if (!user) return { error: "Your session has expired. Sign in again to continue." };
    const target = form.get("target");
    if (!isUuid(target)) return { error: "Choose the workspace to apply the code to." };
    const code = form.get("code");
    const r = await redeemLifetimeCode(user, target, typeof code === "string" ? code : "");
    // Open the workspace the code went to.
    (await cookies()).set(WORKSPACE_COOKIE, target, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    revalidatePath("/business", "layout");
    return { ok: true, message: `${r.workspaceName} now has ${planLabels[r.plan]} for life.`, redirectTo: "/business/settings/billing?redeemed=1" };
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof BizError) return { error: err.message };
    console.error("[lifetime] redeem failed:", err instanceof Error ? err.message : err);
    return { error: "Something went wrong and the code wasn't applied. Please try again." };
  }
}
