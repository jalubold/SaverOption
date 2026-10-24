# Security (Saver Option Business)

Company software spend is treated as confidential business information. This document describes the controls that exist in the code.

## Authentication

- Google sign-in through Supabase Auth. Scopes are the basic profile only (`openid`, `email`, `profile`); no Gmail, Drive or Calendar access, and Google access tokens aren't stored.
- Sessions are Supabase cookies, refreshed in `src/proxy.ts` for `/business/*`. Sign-out supports "everywhere" (`scope=global`).
- Post-sign-in redirects (`next`) are limited to `/business/…` paths (`safeBusinessNext`), so they can't send users elsewhere.

## Authorization and tenant isolation

- Every page, server action and MCP request resolves a `BizContext`: a verified identity plus an actual membership row for one workspace, with its current role. See `architecture.md`.
- Every query is scoped by `ctx.workspace.id`. IDs from URLs, forms or tool arguments that belong to another workspace read as "not found".
- The schema enforces tenancy too: composite foreign keys `(workspace_id, id)`, RLS enabled with no policies, privileges revoked from `anon` and `authenticated`. The public anon key can't read or write business data.
- Server actions check that the posted `workspaceId` matches the session's current workspace. Next.js validates the action's origin.
- Capabilities are checked on the server (`assertCan`, `canEditRecord`); hiding a control is never the only protection.

## Input handling

- All fields are validated server-side (`src/lib/business/form.ts`) with length, format and range limits, plus database check constraints.
- CSV imports reuse the same field validation, accept text files up to 1 MB / 2,000 rows (gzip uploads are size-checked while decompressing), store no file contents, and redact card-like digit runs from stored row messages.
- CSV exports prefix cells that a spreadsheet would treat as formulas.
- Payment methods are labels; anything that looks like a card number is rejected. No card data is stored anywhere.
- MCP tool arguments are validated against a strict JSON-schema subset (`src/lib/business/schema.ts`): unknown fields are rejected, enums and formats checked. No tool accepts SQL, code or file paths.

## MCP and OAuth

- OAuth 2.1 authorization code flow with PKCE S256 only; dynamic client registration with redirect URIs restricted to HTTPS or loopback HTTP; exact redirect matching (port-agnostic only for loopback).
- The consent screen names the client as self-declared, shows the redirect host (with a warning for loopback), and lets the person choose one workspace and the access level. Errors before the redirect URI is trusted are shown on Saver Option, never redirected.
- Codes, access tokens, refresh tokens and client secrets are stored only as SHA-256 hashes. Codes are single-use (a replay revokes the connection); refresh tokens rotate (reusing a spent one revokes the connection).
- Access tokens last 1 hour, refresh tokens 30 days. Tokens are accepted only in the `Authorization` header.
- Role and membership are re-checked on every request; removing a member or lowering a role takes effect on the next call. Write tools need both the `business.write` scope and a role that can change records.
- Write tools preview first and save only with `confirm: true`. Nothing can cancel, renew or buy subscriptions or move money.
- Connections can be revoked by the person, by owners/admins (Settings → AI clients), or through RFC 7009 revocation.
- Rate limits: 120 requests/minute per connection; per-IP limits on unauthenticated MCP requests, client registration and the token endpoint (shared through Upstash when configured, otherwise per instance).
- Logs record the tool name, outcome, duration and truncated workspace/connection IDs — never arguments, tokens or results.
- Tools return only what a question needs; payment-method labels aren't returned.

## Audit log

`biz_activity` records significant changes with the actor: records created, changed and archived, seats, renewals, payments, savings decisions, members and roles, imports, report generation, and MCP connect/disconnect. Records created over MCP are marked with `source = 'mcp'`.

## Data lifecycle

- Owners can export the workspace (JSON) and delete it; deletion cascades to every business table.
- A member who leaves loses access immediately; their name remains in the audit log.
- The privacy policy (`/privacy`) describes the business data, cookies (`so_biz_ws` workspace cookie, the session cookie, and a 10-minute `so_oauth_req` cookie during MCP consent) and retention.

## Secrets

Secrets live only in Vercel environment variables, never with a `NEXT_PUBLIC_` prefix (except the Supabase URL and anon key, which are public by design). No secret is logged or returned by any endpoint. See `deployment.md` for the list.
