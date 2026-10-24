# Deployment, local development and tests

## Deploying

- Production is Vercel. Pushing to `main` builds and deploys.
- `npm run build` runs `node scripts/migrate.mjs && next build`. The migration script applies each unapplied file in `supabase/migrations/` (recorded in `public.schema_migrations`, under an advisory lock, over the pooled connection). **A failed migration fails the build**, so the previous deployment stays live. Without a database URL (or with `SKIP_DB_MIGRATIONS=1`) migrations are skipped.
- `vercel.json` schedules `/api/cron/business-reminders` daily (`17 7 * * *`).
- After deploying, check the commit status (Vercel reports to GitHub) and open `/business`, `/business/docs/mcp` and `/.well-known/oauth-authorization-server`.

## Environment variables

Never commit values. Server-only variables must not use the `NEXT_PUBLIC_` prefix.

| Variable | Scope | Needed for |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, sitemap, absolute deal links |
| `POSTGRES_URL` | server | Postgres (set by the Vercel Supabase integration). `DATABASE_URL` is accepted too |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase Auth (Google sign-in). The anon key can't read business data |
| `CRON_SECRET` | server, optional | Daily reminder run; without it the cron route answers 503 and reminders are still created when the app is opened |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | server, optional | Visitor counts; shared MCP/OAuth rate-limit windows (otherwise per instance) |
| `ANTHROPIC_API_KEY` | server, optional | The in-app AI Savings Assistant; without it the assistant says it isn't configured |

The advertiser features use further variables (Lemon Squeezy, service role key, admin emails); see `.env.example` and `ADVERTISER_SETUP.md`. The MCP server needs no extra variables — it uses the database and Google sign-in.

Supabase's Google provider must be enabled for sign-in (and therefore for MCP consent) to work; see `BUSINESS_SETUP.md`.

## Local development

1. Node 22+, a local Postgres 15+ (16 is what the test harness uses).
2. Copy `.env.example` to `.env.local`; set `POSTGRES_URL=postgres://…@localhost:5432/<db>` and the Supabase values (a Supabase project, or a local GoTrue-compatible mock for automated tests).
3. `npm install`, then `npm run db:migrate` to apply migrations.
4. `npm run dev` and open `http://localhost:3000/business`.

Locally, OAuth metadata and the MCP URL use `http://localhost:<port>`; everywhere else HTTPS is forced.

## Tests

- **Unit**: `npm test` runs Node's built-in test runner over `src/lib/business/*.test.ts` — calculations, savings rules, utilization history, duplicates, CSV parsing/mapping, insights and the MCP schema validator.
- **Type check and lint**: `npm run typecheck`, `npm run lint`.
- **End-to-end** (harness kept outside the repo; runs against `next start` with a local Postgres and a mock of Supabase Auth's Google flow, driven by Playwright):
  - Business suite — 66 checks: sign-in, onboarding, CRUD, seats, renewals, savings, reports vs dashboard, CSV exports, and authorization (cross-workspace IDs, role restrictions, replayed server actions from a lower role).
  - CSV import — 34 checks: template, mapping, preview with duplicates/errors/warnings, commit counts and amounts, provenance, re-import idempotency, dashboard update, file validation, role enforcement on preview and commit, cross-workspace replay.
  - MCP — 75 checks, using the **official MCP TypeScript SDK client** for discovery → dynamic client registration → PKCE authorization → token exchange → `initialize` → `tools/list` → tool calls; plus DCR validation, redirect and PKCE errors, consent deny, every tool, preview/confirm writes and idempotency, workspace isolation, read-only scope, role downgrade, refresh rotation and reuse detection, code replay, expiry, RFC 7009 revocation, disconnect from Settings, member removal, and JSON-RPC error codes.
  - AI Savings Assistant — 16 checks against a local mock of the Anthropic Messages API (the real API isn't called in tests): request shape (model, server-side fallback, effort), the tool registry offered per role, answers quoting tool figures, write tools forced to preview even when the model asks to save, Confirm/Discard, audit entry, refusal handling, conversation reset.
  - Page rendering — 83 renders of every business and docs page at 1440px and 390px with no horizontal scroll and no page or server errors.
  - Deals and advertiser suite — 57 checks.
  - Page renders at 1440px and 390px with overflow checks for every business page.
- **AI client compatibility** is tested manually per client; results live in `src/lib/business/mcp-clients.ts` (all four targets "Not yet tested" as of 2026-10-24). See `mcp.md` for the checklist.
