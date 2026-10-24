"use server";

import { revalidatePath } from "next/cache";
import { isUuid, type FormState } from "@/lib/business/form";
import { BizError, runAction } from "@/lib/server/business/context";
import { disconnect } from "@/lib/server/mcp/connections";

/** Ends an AI client connection: its tokens stop working on the next request. */
export async function disconnectClientAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("grantId");
    if (!isUuid(id)) throw new BizError("invalid", "Choose a connection to disconnect.");
    await disconnect(ctx, id);
    revalidatePath("/business/settings/mcp");
    return { ok: true, message: "Disconnected. That AI client can no longer reach this workspace." };
  }, { billing: "open" });
}
