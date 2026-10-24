# Architecture

Saver Option is one Next.js application with two products:

- **Saver Option Deals** (`/`, `/deals`, `/categories`, `/products`, …): the public software-deals marketplace, plus advertiser listings (`/promote`, `/dashboard`, `/admin`).
- **Saver Option Business** (`/business`): software spend management for companies. It includes a remote MCP server (`/mcp`) for AI clients.

This document covers Business. See `ADVERTISER_SETUP.md` for the advertiser features and `BUSINESS_SETUP.md` for setup and calculation reference.

## Stack

| Layer | What |
| --- | --- |
| Framework | Next.js 16 App Router (React 19 Server Components, server actions, route handlers), TypeScript |
| Hosting | Vercel. Pushing to `main` deploys production |
| Auth | Supabase Auth with the Google provider (`@supabase/ssr` cookies). Google is the only sign-in method |
| Database | Supabase Postgres, accessed only from the server with `postgres` (postgres.js) over the pooled `POSTGRES_URL` |
| Cache / counters | Upstash Redis REST (optional): visitor counts, and shared rate-limit windows for MCP/OAuth |
| Deals catalog | Static content in `src/content/*.ts` (products, offers, categories) plus sponsored listings in Postgres |
| Styling | Tailwind CSS 4, tokens in `src/app/globals.css` |

No new service was added for Business. The browser never talks to Postgres: RLS is enabled on every `biz_*` table with no policies, and the `anon`/`authenticated` roles have no privileges.

## Code layout

| Path | Contents |
| --- | --- |
| `src/app/business/` | Public pages (landing, login, signup, onboarding, docs, OAuth consent) |
| `src/app/business/(app)/` | Signed-in app (route group with the app shell layout) |
| `src/app/business/actions/` | Server actions, one file per area |
| `src/app/mcp/route.ts` | Remote MCP endpoint |
| `src/app/oauth/*`, `src/app/.well-known/*`, `src/app/business/oauth/*` | OAuth 2.1 authorization server for MCP clients |
| `src/lib/business/` | Pure, unit-tested logic: calculations (`calc.ts`), permissions, savings rules, CSV import parsing, duplicate detection, insights, the MCP input-schema validator (`schema.ts`), the AI client matrix (`mcp-clients.ts`) |
| `src/lib/server/business/` | Server services: context and authorization, data loaders, record writes, analytics model, reports, imports, savings sync, deals/alternatives, reminders |
| `src/lib/server/mcp/` | OAuth, MCP protocol handling, tool registry, connections, rate limits |
| `src/components/business/` | UI components (charts, tables, forms, landing, docs) |
| `supabase/migrations/` | SQL migrations, applied by `scripts/migrate.mjs` before each build |

## Request flows

**Pages.** Every page under `/business/(app)` calls `requireBizContext(path)` (`src/lib/server/business/context.ts`). It verifies the Supabase session (authentication), then loads the user's membership for the current workspace (authorization). The workspace comes from the `so_biz_ws` cookie, falling back to the user's first workspace. No session redirects to `/business/login?next=…`; no workspace goes to `/business/onboarding`. Services receive the `BizContext` and scope every query to `ctx.workspace.id`.

**Server actions.** Forms post to server actions that wrap their body in `runAction(form, fn)`. It builds the same context without redirecting, checks that the posted `workspaceId` matches the current workspace (protecting against a workspace switched in another tab), and converts `BizError` into a message the form shows. Capabilities are checked with `assertCan(ctx, capability)` or record-level `canEditRecord`.

**MCP.** `POST /mcp` reads the bearer token and verifies it (`verifyAccessToken`). It then rebuilds the context from the token's user and workspace with `contextForMember` — the same membership and role lookup, done on every request. Tools validate their input against their published schema and call the same services as the web app. See `mcp.md`.

**Session refresh.** `src/proxy.ts` refreshes Supabase sessions on `/business/*` (and the advertiser pages) so expired access tokens are renewed before rendering.

**Background work.** `/api/cron/business-reminders` (Vercel Cron, daily, needs `CRON_SECRET`) creates renewal reminders. The app layout also runs a throttled reminder sync when someone opens it.

## Calculations

All figures come from `src/lib/business/calc.ts` (unit-tested):

- Money is stored in minor units (`bigint`) with an explicit ISO 4217 currency. Totals are kept per currency and never converted or added across currencies.
- Monthly equivalent = price per period ÷ months per period (monthly 1, quarterly 3, yearly 12, custom by its length). Annualized = monthly equivalent × 12. These are normalized estimates, not cash spent.
- Only active, non-archived subscriptions count towards recurring cost. A missing price is unknown, not zero.
- Seats in use = max(named assignments, reported count). Utilization = in use ÷ purchased. Usage is never measured.
- Potential savings are de-duplicated per subscription (largest estimate). Realized savings exist only when confirmed.

The dashboard, analytics, reports, savings reports and MCP tools all read the same spend model (`src/lib/server/business/analytics.ts`), so their totals agree.

## Roles

| Capability | Owner | Admin | Finance | Member | Read-only |
| --- | :-: | :-: | :-: | :-: | :-: |
| View the workspace | ✓ | ✓ | ✓ | ✓ | ✓ |
| Workspace settings (`workspace.manage`) | ✓ | ✓ | | | |
| Delete workspace, owners (`workspace.own`) | ✓ | | | | |
| Members and access (`members.manage`) | ✓ | ✓ | | | |
| Departments and people (`directory.manage`) | ✓ | ✓ | | | |
| Any software/subscription record (`records.manage`) | ✓ | ✓ | ✓ | | |
| Records they own (`records.manage_own`) | ✓ | ✓ | ✓ | ✓ | |
| Payments, renewal outcomes, savings decisions (`spend.manage`) | ✓ | ✓ | ✓ | | |
| CSV/JSON exports, saving reports (`data.export`) | ✓ | ✓ | ✓ | | |

Defined in `src/lib/business/permissions.ts`; the UI uses the same function only to decide which controls to show.

## Integrations status

See `integrations.md`. In short: CSV import, the MCP server, Google sign-in and the deals catalog exist; email delivery, accounting/bank/card feeds, SSO/usage data and exchange rates don't yet.
