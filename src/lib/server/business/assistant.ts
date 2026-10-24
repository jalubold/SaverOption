import Anthropic from "@anthropic-ai/sdk";
import type { BetaContentBlock, BetaMessageParam, BetaTool, BetaToolResultBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { can } from "@/lib/business/permissions";
import { BizError, type BizContext } from "@/lib/server/business/context";
import { SCOPE_READ, SCOPE_WRITE, type ServerUrls } from "@/lib/server/mcp/oauth";
import { rateLimit } from "@/lib/server/mcp/rate-limit";
import { callTool, toolsFor, type ToolContext } from "@/lib/server/mcp/tools";

/**
 * The in-app AI Savings Assistant: Claude answers questions about the
 * workspace by calling the same tools the MCP server exposes, with the signed-in
 * member's permissions. Tools that change records only ever run as a preview
 * here; saving happens when the person presses Confirm in the app
 * (confirmAssistantChange), never from the model's own call.
 *
 * Needs ANTHROPIC_API_KEY (server-only). The conversation lives in the browser
 * tab and is sent back with each question; nothing is stored on the server.
 */

export const ASSISTANT_MODEL = "claude-opus-5-5";
const MAX_STEPS = 8;
const MAX_HISTORY_CHARS = 400_000;
const MAX_MESSAGES = 80;
const WRITE_TOOLS = new Set(["create_subscription", "update_subscription"]);

export function assistantConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM = `You are the savings assistant inside Saver Option Business, a software-spend management app. You help one company workspace understand its software subscriptions and spend less.

Use the tools to get facts; never answer a question about the workspace's numbers from memory or by guessing. Tools return only this workspace's data.

When you give figures:
- Show the numbers and how they were calculated (e.g. "$1,200/yr = $100/mo × 12").
- Say what each figure is based on, using the tool's basis: actual (recorded payments), normalized estimate (prices converted to a monthly or annual equivalent — a run-rate, not cash spent) or projection (renewals at current prices).
- Keep currencies separate. Never add or convert amounts in different currencies.
- Potential savings are estimates, not guaranteed and not realized. Only call savings realized when the tool reports them as realized.
- Seat usage is assigned or reported by the team, never measured. Don't call a license unused unless seats_in_use data shows it.
- Similar names or categories don't prove two tools are duplicates; ask whether they serve the same purpose.
- For deals, use only what search_deals / get_deal_details return; if nothing matches, say no matching offer is listed. Never invent prices, discounts, expiry dates or product capabilities.
- Link to the relevant subscription, savings item or deal page using the URLs the tools return.

Changing records: create_subscription and update_subscription only produce a preview here. After calling one, summarize the interpreted details and warnings and tell the user to review and press Confirm under your message to save it. Ask for missing details (price, billing interval, renewal date) instead of guessing. You cannot cancel, renew or buy anything at a vendor, and nothing you do moves money.

Be concise and practical: lead with the answer, then the supporting numbers, then the next step. Use short paragraphs or bullet lists; no tables wider than four columns.`;

export interface AssistantPreview {
  id: string;
  tool: "create_subscription" | "update_subscription";
  args: Record<string, unknown>;
  interpreted: unknown;
  warnings: string[];
}

export interface AssistantTurn {
  text: string;
  toolsUsed: { name: string; ok: boolean }[];
  previews: AssistantPreview[];
  refused: boolean;
  stoppedEarly: boolean;
}

const ALLOWED_BLOCKS = new Set(["text", "tool_use", "tool_result", "thinking", "redacted_thinking", "fallback"]);

/** The browser sends the conversation back; accept only plain user/assistant turns of known block types. */
export function sanitizeHistory(raw: unknown): BetaMessageParam[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.length > MAX_MESSAGES) throw new BizError("invalid", "This conversation is too long. Start a new one.");
  if (JSON.stringify(raw).length > MAX_HISTORY_CHARS) throw new BizError("invalid", "This conversation is too long. Start a new one.");
  for (const m of raw) {
    if (typeof m !== "object" || m === null) throw new BizError("invalid", "The conversation couldn't be continued. Start a new one.");
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") throw new BizError("invalid", "The conversation couldn't be continued. Start a new one.");
    if (typeof content === "string") continue;
    if (!Array.isArray(content) || content.some((b) => typeof b !== "object" || b === null || !ALLOWED_BLOCKS.has((b as { type?: string }).type ?? "")))
      throw new BizError("invalid", "The conversation couldn't be continued. Start a new one.");
  }
  return raw as BetaMessageParam[];
}

function toolContext(ctx: BizContext, urls: ServerUrls): ToolContext {
  const write = can(ctx.role, "records.manage") || can(ctx.role, "records.manage_own");
  return { biz: ctx, scopes: write ? [SCOPE_READ, SCOPE_WRITE] : [SCOPE_READ], grantId: `assistant:${ctx.user.id}`, urls, source: "assistant" };
}

function textOf(content: BetaContentBlock[]): string {
  return content
    .filter((b): b is Extract<BetaContentBlock, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n\n")
    .trim();
}

export async function askAssistant(ctx: BizContext, urls: ServerUrls, rawHistory: unknown, question: string): Promise<{ history: BetaMessageParam[]; turn: AssistantTurn }> {
  if (!assistantConfigured()) throw new BizError("unavailable", "The AI assistant isn't set up on this site yet.");
  const q = question.trim().slice(0, 2000);
  if (!q) throw new BizError("invalid", "Type a question first.");
  const limit = await rateLimit(`assistant:${ctx.user.id}`, 40, 3600);
  if (!limit.ok) throw new BizError("unavailable", "You've asked a lot of questions in the last hour. Try again a little later.");

  const tc = toolContext(ctx, urls);
  const defs = toolsFor(tc.scopes);
  const tools: BetaTool[] = defs.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema as unknown as BetaTool.InputSchema }));
  const messages: BetaMessageParam[] = [...sanitizeHistory(rawHistory), { role: "user", content: q }];
  const turn: AssistantTurn = { text: "", toolsUsed: [], previews: [], refused: false, stoppedEarly: false };
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const workspaceNote = `Workspace: ${ctx.workspace.name}. Default currency: ${ctx.workspace.defaultCurrency}. Today: ${ctx.today}. The user's role: ${ctx.role}${tc.scopes.includes(SCOPE_WRITE) ? "" : " (read-only: you can't preview changes)"}.`;

  try {
    for (let step = 0; step < MAX_STEPS; step++) {
      const res = await client.beta.messages.create({
        model: ASSISTANT_MODEL,
        max_tokens: 16000,
        // Server-side fallback: if a safety classifier declines, the API re-runs the request on a fallback model.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "medium" },
        system: [
          { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
          { type: "text", text: workspaceNote },
        ],
        tools,
        messages,
      });
      messages.push({ role: "assistant", content: res.content });
      const text = textOf(res.content);
      if (text) turn.text = turn.text ? `${turn.text}\n\n${text}` : text;
      if (res.stop_reason === "refusal") {
        turn.refused = true;
        break;
      }
      if (res.stop_reason === "pause_turn") continue;
      const uses = res.content.filter((b): b is Extract<BetaContentBlock, { type: "tool_use" }> => b.type === "tool_use");
      if (res.stop_reason !== "tool_use" || uses.length === 0) break;
      const results: BetaToolResultBlockParam[] = [];
      for (const u of uses) {
        const input = (typeof u.input === "object" && u.input !== null ? u.input : {}) as Record<string, unknown>;
        const isWrite = WRITE_TOOLS.has(u.name);
        // Writes run as previews only; the person confirms in the app.
        const args = isWrite ? { ...input, confirm: false } : input;
        const out = await callTool(tc, u.name, args);
        turn.toolsUsed.push({ name: u.name, ok: out.ok });
        if (isWrite && out.ok) {
          const r = out.result as { status?: string; interpreted?: unknown; warnings?: string[] };
          if (r.status === "confirmation_required") {
            const { confirm: _c, ...rest } = input;
            turn.previews.push({ id: u.id, tool: u.name as AssistantPreview["tool"], args: rest, interpreted: r.interpreted, warnings: r.warnings ?? [] });
          }
        }
        results.push({ type: "tool_result", tool_use_id: u.id, content: out.ok ? JSON.stringify(out.result) : out.message, is_error: !out.ok });
      }
      messages.push({ role: "user", content: results });
      if (step === MAX_STEPS - 1) turn.stoppedEarly = true;
    }
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      console.error("[assistant] API credentials rejected");
      throw new BizError("unavailable", "The AI assistant isn't available right now (its API key was rejected). An administrator needs to check the configuration.");
    }
    if (err instanceof Anthropic.RateLimitError) throw new BizError("unavailable", "The AI assistant is busy. Try again in a minute.");
    if (err instanceof Anthropic.BadRequestError) {
      console.error("[assistant] request rejected:", err.message.slice(0, 300));
      throw new BizError("invalid", "The assistant couldn't continue this conversation. Start a new one.");
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`[assistant] API error ${err.status}`);
      throw new BizError("unavailable", "The AI assistant isn't responding right now. Try again shortly.");
    }
    throw err;
  }
  if (!turn.text) turn.text = turn.refused ? "I can't help with that request." : turn.stoppedEarly ? "I looked up several things but ran out of steps before finishing. Ask me to continue, or narrow the question." : "Done.";
  console.info(JSON.stringify({ assistant: "turn", ws: ctx.workspace.id.slice(0, 8), tools: turn.toolsUsed.map((t) => t.name), previews: turn.previews.length, refused: turn.refused }));
  return { history: messages, turn };
}

/** Saves a change the assistant previewed, after the person pressed Confirm. Same validation and permissions as MCP. */
export async function confirmAssistantChange(ctx: BizContext, urls: ServerUrls, tool: string, args: unknown): Promise<{ summary: string; url: string | null }> {
  if (!WRITE_TOOLS.has(tool)) throw new BizError("invalid", "That change can't be confirmed here.");
  if (typeof args !== "object" || args === null || Array.isArray(args)) throw new BizError("invalid", "That change is no longer valid. Ask the assistant again.");
  const tc = toolContext(ctx, urls);
  const out = await callTool(tc, tool, { ...(args as Record<string, unknown>), confirm: true });
  if (!out.ok) throw new BizError("invalid", out.message);
  const r = out.result as { status?: string; url?: string; subscription?: { software?: string; plan?: string | null } };
  const name = [r.subscription?.software, r.subscription?.plan].filter(Boolean).join(" · ") || "the subscription";
  const summary =
    r.status === "created" ? `Added ${name}.` : r.status === "already_created" ? `${name} was already added.` : r.status === "updated" ? `Updated ${name}.` : r.status === "unchanged" ? `Nothing changed for ${name}.` : "Saved.";
  return { summary, url: r.url ?? null };
}
