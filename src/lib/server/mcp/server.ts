import { contextForMember } from "@/lib/server/business/context";
import { json } from "@/lib/server/mcp/http";
import { serverUrls, touchGrant, verifyAccessToken, type VerifiedToken } from "@/lib/server/mcp/oauth";
import { clientIp, rateLimit } from "@/lib/server/mcp/rate-limit";
import { callTool, toolsFor, type ToolContext } from "@/lib/server/mcp/tools";

/**
 * The remote MCP endpoint (Streamable HTTP transport, stateless): each POST
 * carries JSON-RPC messages and gets a JSON response. No server-initiated
 * stream is offered (GET returns 405), which the transport allows.
 */

const SUPPORTED_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];
const SERVER_INFO = { name: "saver-option-business", title: "Saver Option Business", version: "1.0.0" };
const MAX_BODY = 1_000_000;

const INSTRUCTIONS = [
  "Tools for one Saver Option Business workspace: software subscriptions, spending, renewals, savings opportunities and Saver Option deals.",
  "Amounts are per currency and never converted or added across currencies.",
  "Each financial result says its basis: actual (recorded payments), normalized_estimate (prices as monthly/annual equivalents) or projection (renewals at current prices). Say which when you report a figure, and show the numbers behind a recommendation.",
  "Potential savings are estimates, separate from realized savings. Seat usage is assigned or reported, never measured — don't call a license unused without seats_in_use data.",
  "create_subscription and update_subscription return a preview first; show it and call again with confirm: true only after the user agrees. Nothing here cancels, renews or buys anything at a vendor.",
].join(" ");

type Id = string | number | null;
interface RpcMessage {
  jsonrpc?: string;
  id?: Id;
  method?: string;
  params?: Record<string, unknown>;
}

const rpcError = (id: Id, code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });
const rpcResult = (id: Id, result: unknown) => ({ jsonrpc: "2.0", id, result });

function unauthorized(req: Request, error?: "invalid_token"): Response {
  const urls = serverUrls(req.url);
  const params = [`resource_metadata="${urls.resourceMetadata}"`, `scope="business.read business.write"`];
  if (error) params.push(`error="${error}"`, `error_description="The access token is missing, expired or revoked."`);
  return json({ jsonrpc: "2.0", id: null, error: { code: -32001, message: "Authentication required. Connect your Saver Option Business workspace." } }, 401, { "WWW-Authenticate": `Bearer ${params.join(", ")}` });
}

async function handleMessage(msg: RpcMessage, ctx: ToolContext, token: VerifiedToken): Promise<object | null> {
  const id: Id = msg.id ?? null;
  const isRequest = msg.id !== undefined && msg.id !== null;
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return isRequest ? rpcError(id, -32600, "Invalid request.") : null;
  if (!isRequest) return null; // notifications (initialized, cancelled, …) need no reply
  switch (msg.method) {
    case "initialize": {
      const requested = typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : SUPPORTED_VERSIONS[0];
      return rpcResult(id, {
        protocolVersion: SUPPORTED_VERSIONS.includes(requested) ? requested : SUPPORTED_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: `${INSTRUCTIONS} Connected workspace: ${ctx.biz.workspace.name} (your role: ${ctx.biz.role}; access: ${token.scopes.join(", ")}).`,
      });
    }
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, {
        tools: toolsFor(token.scopes).map((t) => ({
          name: t.name,
          title: t.title,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: { title: t.title, readOnlyHint: !t.write && t.name !== "generate_savings_report", destructiveHint: false, idempotentHint: !t.write, openWorldHint: false },
        })),
      });
    case "tools/call": {
      const name = msg.params?.name;
      if (typeof name !== "string") return rpcError(id, -32602, "params.name is required.");
      const started = Date.now();
      const out = await callTool(ctx, name, msg.params?.arguments);
      console.info(JSON.stringify({ mcp: "tools/call", tool: name, ok: out.ok, ms: Date.now() - started, ws: ctx.biz.workspace.id.slice(0, 8), grant: token.grantId.slice(0, 8) }));
      if (!out.ok) return rpcResult(id, { content: [{ type: "text", text: out.message }], isError: true });
      return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(out.result, null, 1) }], structuredContent: out.result });
    }
    case "resources/list":
      return rpcResult(id, { resources: [] });
    case "prompts/list":
      return rpcResult(id, { prompts: [] });
    default:
      return rpcError(id, -32601, `Method not found: ${msg.method}`);
  }
}

export async function handleMcpPost(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization");
  const bearer = auth?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!bearer) {
    const limit = await rateLimit(`mcp-anon:${clientIp(req.headers)}`, 120, 60);
    if (!limit.ok) return json({ error: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfter) });
    return unauthorized(req);
  }
  const token = await verifyAccessToken(bearer);
  if (!token) return unauthorized(req, "invalid_token");
  const limit = await rateLimit(`mcp:${token.grantId}`, 120, 60);
  if (!limit.ok) return json(rpcError(null, -32029, "Too many requests from this connection. Wait a minute and try again."), 429, { "Retry-After": String(limit.retryAfter) });
  // The person's membership and role are looked up on every request.
  const biz = await contextForMember(token.userId, token.workspaceId);
  if (!biz) return unauthorized(req, "invalid_token");
  await touchGrant(token);

  const text = await req.text();
  if (text.length > MAX_BODY) return json(rpcError(null, -32600, "Request too large."), 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(rpcError(null, -32700, "Parse error: the body must be JSON-RPC 2.0."), 400);
  }
  const ctx: ToolContext = { biz, scopes: token.scopes, grantId: token.grantId, urls: serverUrls(req.url) };
  const messages = Array.isArray(body) ? body.slice(0, 20) : [body];
  const replies: object[] = [];
  for (const m of messages) {
    const r = await handleMessage((m ?? {}) as RpcMessage, ctx, token);
    if (r) replies.push(r);
  }
  if (replies.length === 0) return new Response(null, { status: 202, headers: { "Access-Control-Allow-Origin": "*" } });
  return json(Array.isArray(body) ? replies : replies[0]);
}
