"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { actionContext, BizError } from "@/lib/server/business/context";
import { askAssistant, confirmAssistantChange, type AssistantTurn } from "@/lib/server/business/assistant";
import { urlsFromHeaders } from "@/lib/server/mcp/pending";

type Failure = { ok: false; error: string };

function failure(err: unknown): Failure {
  unstable_rethrow(err);
  if (err instanceof BizError) return { ok: false, error: err.message };
  console.error("[assistant] action failed:", err instanceof Error ? err.message : err);
  return { ok: false, error: "Something went wrong. Nothing was changed. Try again." };
}

function workspaceForm(workspaceId: unknown): FormData {
  const f = new FormData();
  f.set("workspaceId", typeof workspaceId === "string" ? workspaceId : "");
  return f;
}

/** One question to the assistant. The conversation comes from and goes back to the browser tab. */
export async function askAssistantAction(input: { workspaceId: string; history: unknown; question: string }): Promise<{ ok: true; history: unknown[]; turn: AssistantTurn } | Failure> {
  try {
    const ctx = await actionContext(workspaceForm(input?.workspaceId));
    const { history, turn } = await askAssistant(ctx, await urlsFromHeaders(), input?.history, typeof input?.question === "string" ? input.question : "");
    return { ok: true, history, turn };
  } catch (err) {
    return failure(err);
  }
}

/** Saves a previewed change after the person pressed Confirm. */
export async function confirmAssistantChangeAction(input: { workspaceId: string; tool: string; args: unknown }): Promise<{ ok: true; summary: string; url: string | null } | Failure> {
  try {
    const ctx = await actionContext(workspaceForm(input?.workspaceId));
    const res = await confirmAssistantChange(ctx, await urlsFromHeaders(), String(input?.tool ?? ""), input?.args);
    revalidatePath("/business", "layout");
    return { ok: true, ...res };
  } catch (err) {
    return failure(err);
  }
}
