# MCP server (Saver Option Business)

One remote MCP server lets AI clients use a workspace's Saver Option Business data with the person's permission. It calls the same services as the web app and never bypasses the permission model. Tool reference: `mcp-tools.md`. User-facing docs: `/business/docs/mcp`.

## Endpoint and transport

- URL: `https://<host>/mcp` (`src/app/mcp/route.ts`). Intended production endpoint: `https://www.saveroption.com/mcp`. URLs in metadata are derived from the request host, so preview deployments and local servers describe themselves correctly (HTTPS is forced except on localhost).
- Streamable HTTP, stateless, JSON responses. `POST` carries one JSON-RPC message (batches of up to 20 are accepted for older clients); notifications get `202` with no body. `GET` and `DELETE` return `405` (no server-initiated stream, no sessions). CORS is open because auth is a bearer token, not cookies.
- Protocol versions: `2025-11-25`, `2025-06-18`, `2025-03-26`; an unknown requested version gets the latest. Capabilities: `tools` only (`resources/list` and `prompts/list` return empty lists).
- Methods: `initialize`, `ping`, `tools/list`, `tools/call`. Implementation: `src/lib/server/mcp/server.ts`.

## Authorization

The server is its own OAuth 2.1 authorization server (`src/lib/server/mcp/oauth.ts`).

| Endpoint | Purpose |
| --- | --- |
| `GET /.well-known/oauth-protected-resource` and `/.well-known/oauth-protected-resource/mcp` | RFC 9728 metadata: `resource` = the MCP URL, `authorization_servers` = [issuer], `scopes_supported` |
| `GET /.well-known/oauth-authorization-server` | RFC 8414 metadata: endpoints, `code_challenge_methods_supported: ["S256"]`, grant types, auth methods `none`/`client_secret_post`/`client_secret_basic`, `authorization_response_iss_parameter_supported` |
| `POST /oauth/register` | RFC 7591 dynamic client registration (JSON). Redirect URIs: HTTPS, or HTTP on `localhost`/`127.0.0.1`/`[::1]`; no fragments. Grant types `authorization_code` (+ `refresh_token`); response type `code`. Confidential clients get a secret once |
| `GET /business/oauth/authorize` | Validates the request, stores it in a 10-minute HttpOnly cookie (`so_oauth_req`, path `/business/oauth`) and redirects to the consent page, via Google sign-in if needed |
| `/business/oauth/consent` | Consent page and server actions: choose one workspace and "Read only" or "Read and change"; Allow returns `code`, `state` and `iss`; Cancel returns `error=access_denied` |
| `POST /oauth/token` | `authorization_code` (PKCE verifier required, optional `resource` must equal the MCP URL) and `refresh_token`; form-encoded (JSON tolerated) |
| `POST /oauth/revoke` | RFC 7009: revoking either token ends the connection; unknown tokens return 200 |

Flow details:

- Unauthenticated `POST /mcp` → `401` with `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/mcp", scope="business.read business.write"`; invalid tokens add `error="invalid_token"`.
- Errors before the redirect URI is validated (unknown client, unregistered redirect) are shown on the consent page and never redirected. Later errors (missing PKCE, bad scope, wrong `resource`) redirect with `error`, `state` and `iss`.
- Redirect matching is exact, except loopback HTTP redirects, which match on any port with `localhost` and `127.0.0.1` treated alike (RFC 8252 §7.3).
- Scopes: `business.read`, `business.write` (and `offline_access` is accepted and ignored — refresh tokens are always issued). Write is granted only when requested, chosen on the consent screen and allowed by the person's role at consent time; the role is checked again on every call.
- One active grant per person × workspace × client: reconnecting updates its scopes.

### Tokens

| Item | Lifetime | Storage | Notes |
| --- | --- | --- | --- |
| Authorization code | 10 minutes | SHA-256 | Single use. A replay revokes the grant and every token issued under it |
| Access token (`soat_…`) | 1 hour | SHA-256 | Bearer header only |
| Refresh token (`sort_…`) | 30 days | SHA-256 | Rotates on every use. Presenting a spent one revokes the grant (`invalid_grant`) |
| Client secret (`socs_…`) | No expiry | SHA-256 | Only for confidential clients |

Revocation and reuse detection run outside the failing transaction, so they persist even though the request fails.

## Per-request checks

1. Bearer token → `verifyAccessToken` (not revoked, not expired, grant not revoked).
2. Rate limit: 120 requests/minute per grant (`429` with `Retry-After`). Unauthenticated requests: 120/minute per IP. Registration: 20/hour per IP. Token endpoint: 60/minute per IP.
3. `contextForMember(userId, workspaceId)`: the membership must still exist; the current role is used. Otherwise `401 invalid_token`.
4. `tools/call`: the tool must exist and, for write tools, the grant must have `business.write`; arguments are validated against the tool's published schema; the tool runs with the context.
5. A `console.info` line records tool, ok, duration and truncated workspace/grant IDs — never arguments or results.

## Errors

| Code | When |
| --- | --- |
| HTTP 401 + JSON-RPC `-32001` | Missing, invalid, expired or revoked token; membership removed |
| HTTP 429 + `-32029` | Connection rate limit |
| `-32700` | Body isn't JSON |
| `-32600` | Not a JSON-RPC 2.0 request, or body over 1 MB |
| `-32601` | Unknown method |
| `-32602` | `tools/call` without `params.name` |
| `-32603` / HTTP 500 | Unexpected failure (details logged, not returned) |
| HTTP 503 + `-32002` | Business backend not configured |
| Tool result with `isError: true` | Unknown tool, invalid arguments, read-only connection, role not allowed, record not found, validation failures. Messages are safe to show |

## Writes and confirmation

`create_subscription` and `update_subscription` return `status: "confirmation_required"` with the interpreted values (or a before/after diff) and warnings unless called with `confirm: true`. A confirmed create uses an idempotency key derived from the grant, the arguments and the date, so a retried call returns `already_created`. Writes go through `createSubscription` / `updateSubscription` (same validation as the web forms), set `source = 'mcp'`, and are audited. No tool deletes records, cancels or buys anything, or touches vendor accounts.

## Connections UI

`/business/settings/mcp` shows the server URL, the compatibility matrix, the connections (owners/admins see everyone's; others their own) with access level, connected and last-used dates, and **Disconnect** (`revokeGrantById`, audited as `mcp.disconnected`). Connecting is audited as `mcp.connected`.

`/business/mcp` is the public page for the MCP server (linked as "AI & MCP" in the Business header and listed in the sitemap): the server URL for the current host, an illustrative conversation built from the landing page's example data, each client's status straight from `mcp-clients.ts`, how to connect, example questions with the tool each one uses, the safety model, the tool list from `toolsFor()`, and an FAQ. It never shows a client as working unless `mcp-clients.ts` says it was tested.

## Client compatibility

Source of truth: `src/lib/business/mcp-clients.ts` (rendered in the app and docs). Matrix last reviewed: **2026-10-24**.

| Client | Status | Last verified | Tested surface | Read tools | Write tools |
| --- | --- | --- | --- | --- | --- |
| Claude (Anthropic) | Verified | 2026-10-24 | Custom connector on claude.ai, used from Claude Code on the web | Verified (sign-in; `list_subscriptions`, `get_spend_summary`, `get_upcoming_renewals`, `search_deals` returned the workspace's data) | On a "Read and change" connection, previewed and confirmed |
| ChatGPT (OpenAI) | Verified | 2026-10-24 | Connected by the Saver Option team to the production server | Verified (sign-in and the read tools) | On a "Read and change" connection, previewed and confirmed |
| Gemini (Google) | Verified | 2026-10-24 | Connected by the Saver Option team to the production server | Verified (sign-in and the read tools) | On a "Read and change" connection, previewed and confirmed |
| Grok (xAI) | Verified | 2026-10-24 | Connected by the Saver Option team to the production server | Verified (sign-in and the read tools) | On a "Read and change" connection, previewed and confirmed |

What each vendor documents (with links) is stored in `mcp-clients.ts`. Don't publish client-specific setup steps until a client is verified.

Protocol conformance was tested with the official MCP TypeScript SDK client, which completed discovery → dynamic registration → PKCE authorization → token exchange → `initialize` → `tools/list` → tool calls against this server (see `deployment.md`, Tests). That verifies the server against the reference client, not compatibility with any specific AI product.

### How to verify a client

1. In the client, add a custom connector / remote MCP server with the production URL.
2. Complete sign-in: Google, consent screen (pick a test workspace, "Read and change").
3. Ask for the subscriptions list (`list_subscriptions`) and the spend summary (`get_spend_summary`); compare with the dashboard.
4. Ask it to add a subscription: check a preview is shown first (`create_subscription` with `confirm: false`), then confirm and check the record (source "Added by an AI client (MCP)").
5. Disconnect in Settings → AI clients; the next request from the client must fail and ask to reconnect.
6. Note the client surface, plan and date, then update `status`, `lastVerified`, `testedSurface`, `readTools`, `writeTools` and `limitations` in `src/lib/business/mcp-clients.ts`. Only then add step-by-step instructions to the docs page for that client.
