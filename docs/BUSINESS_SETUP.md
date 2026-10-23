# Saver Option Business — setup and reference

Saver Option Business (`/business`) is the software-spend management product that sits next to the deals marketplace (`/deals`). Companies sign in with Google, create a workspace, and track subscriptions, renewals, licenses, recorded spend and savings opportunities.

It runs on the same infrastructure as the advertiser features: **Supabase Auth** (Google sign-in) and **Supabase Postgres**, read and written only from the server. No new service is needed.

## Routes

| Route | What it is |
| --- | --- |
| `/business` | Public landing page |
| `/business/login`, `/business/signup` | Continue with Google (the only sign-in method) |
| `/business/onboarding` | Create a workspace → company details → first subscription → dashboard. Also accepts access invitations and opens the demo workspace |
| `/business/dashboard` | Overview: KPIs, charts, renewals, highest-cost software, savings, activity, needs attention |
| `/business/subscriptions` (`/new`, `/:id`, `/:id/edit`, `/export`) | Subscription list with filters, bulk actions and CSV export; the Add Software flow; details; edit |
| `/business/software` (`/new`, `/:id`, `/:id/edit`) | Software inventory (with or without a paid subscription), potential duplicates |
| `/business/licenses` (`/:id`) | Seats: purchased, in use, available, utilization, unused cost; assign, reassign, release |
| `/business/renewals` | Upcoming, calendar, requires attention, history |
| `/business/savings` | Savings opportunities, decisions, confirmed (realized) savings |
| `/business/reports` (`/export`) | Reports with date range, currency, category, department and vendor filters; CSV exports; audit log |
| `/business/team` | Members and roles, access by email, people directory |
| `/business/settings` (`/company`, `/departments`, `/notifications`, `/preferences`, `/export`) | Account, workspace settings, data export (JSON), demo reset, delete workspace |
| `/business/notifications`, `/business/search` | In-app notifications; workspace search |
| `/api/cron/business-reminders` | Daily reminder run (needs `CRON_SECRET`) |

Every page under `/business` except the landing and sign-in pages requires a signed-in user with a membership in the current workspace. Signed-out visitors go to `/business/login?next=…`; signed-in users without a workspace go to `/business/onboarding`. The `next` value is limited to `/business/…` paths, so it can't redirect anywhere else.

## Google sign-in

Business sign-in reuses the existing Supabase Google provider and the existing callback, `/auth/callback`. If advertiser sign-in already works, **business sign-in needs no extra configuration**.

If Google isn't set up yet:

1. **Google Cloud Console** → create a project → **Google Auth Platform**:
   - Branding: app name "Saver Option", support email, authorized domain `saveroption.com`.
   - Audience: External → **Publish app**. The default scopes (`openid`, `email`, `profile`) don't need Google verification.
   - Clients → Create client → **Web application**:
     - Authorized JavaScript origin: `https://www.saveroption.com`
     - Authorized redirect URI: the **Callback URL shown on Supabase's Google provider page** (`https://<project-ref>.supabase.co/auth/v1/callback`). Copy it from Supabase rather than typing it.
2. **Supabase → Authentication → Sign In / Providers → Google**: enable it and paste the Client ID and Client Secret.
3. **Supabase → Authentication → URL Configuration → Redirect URLs** must include:
   - `https://www.saveroption.com/auth/callback`
   - `https://*-aa-6e10.vercel.app/**` (preview deployments)
   - `http://localhost:3000/auth/callback` (local development)

Saver Option asks Google only for the basic profile: name, email address and profile picture. It doesn't request Gmail, Drive, Calendar or any other scope, and it doesn't store Google access tokens. Until the Google provider is switched on, the sign-in pages say so and the button is disabled; nothing simulates a successful sign-in.

What's handled: starting OAuth (`signInWithGoogleAction`), the callback and session cookie (`/auth/callback`), session refresh on every `/business` request (`src/proxy.ts`), sign-out and "sign out everywhere" (`/auth/sign-out`, `scope=global`), cancelled consent (`?error=cancelled`), failed sign-in (`?error=google`), and expired sessions (pages redirect to sign-in; form submissions show "Your session has expired" and keep what was typed).

## Environment variables

Nothing new is required: Business uses `POSTGRES_URL`, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, which are already set.

| Variable | Scope | Notes |
| --- | --- | --- |
| `CRON_SECRET` | **server only** | Optional. Enables the daily reminder run: Vercel Cron calls `/api/cron/business-reminders` (see `vercel.json`) with `Authorization: Bearer <CRON_SECRET>`. Without it the route answers 503 and reminders are still created whenever someone opens the app. |

## Database

`npm run build` applies `supabase/migrations/20261024000000_business.sql` automatically (see `scripts/migrate.mjs`). It creates the `biz_*` tables:

- `biz_workspaces`, `biz_memberships` (app access with a role), `biz_invitations`, `biz_departments`, `biz_people` (the team directory — seat holders and owners, most of whom never sign in), `biz_vendors`, `biz_software`
- `biz_subscriptions`, `biz_cost_history` (price and terms over time), `biz_payments` (recorded spend), `biz_renewal_events`, `biz_seat_assignments`
- `biz_reminders`, `biz_notifications`, `biz_savings_opportunities`, `biz_realized_savings`, `biz_activity` (audit log)

Security model:

- **Server-only access.** RLS is enabled with no policies and the `anon`/`authenticated` roles have no privileges, so the public anon key can't read or write any business data.
- **Authorization in code, on every request.** `src/lib/server/business/context.ts` verifies the Supabase session (authentication) and then looks up the user's membership and role for the workspace (authorization). Every query filters by that workspace id; ids from URLs or forms that belong to another workspace read as "not found".
- **Tenancy in the schema too.** Child rows carry `workspace_id`, and cross-references use composite foreign keys `(workspace_id, id)`, so a row can't point at another workspace's department, person, software or subscription whatever a request supplies.
- **Server-side validation** of every field (`src/lib/business/form.ts`), check constraints in the database, idempotency keys on the Add Software form (a double submit can't create two subscriptions), and transactions wherever several rows are written together.
- **Audit log** (`biz_activity`) for every significant change.
- Payment methods are short labels; anything that looks like a card number is rejected.

### Roles

| Role | Can |
| --- | --- |
| Owner | Everything, including deleting the workspace |
| Admin | Workspace settings, members (except owners and other admins), departments, people, every record, spend and savings |
| Finance | Software and subscription records, payments, renewal outcomes, reports, savings |
| Member | View the workspace; edit the software and subscriptions they own (owner = their directory entry) |
| Read-only | View only |

The rules live in `src/lib/business/permissions.ts` and are checked by the server actions; the UI only uses them to hide controls.

### Access by email (no email is sent)

There's no email provider configured, so Saver Option never sends invitation or reminder emails. An owner or admin gives an email address a role on **Team**; that person signs in with Google using exactly that address and accepts on the onboarding page. To add real invitation and reminder emails later, configure an email provider (for example Resend or Postmark) with a server-only API key and send from `src/lib/server/business/team.ts` and `reminders.ts`.

## How the numbers are calculated

All pages use `src/lib/business/calc.ts` (unit-tested in `calc.test.ts`):

- **Monthly equivalent** = price per billing period ÷ months in the period (monthly 1, quarterly 3, yearly 12; custom: days × 12/365, weeks × 7 × 12/365, months as entered, years × 12).
- **Annualized recurring cost** = monthly equivalent × 12. It's a run-rate, not money spent; **actual expenditure** is only what's recorded as payments.
- Only **active**, non-archived subscriptions count towards recurring cost. Trials, paused, cancelled and expired don't. A missing price is "unknown", never zero, and is reported as such.
- **Currencies are never added together.** Totals are shown per currency; there's no exchange-rate source.
- **Seats in use** = the larger of named seat assignments and the count someone reported. Utilization = in use ÷ purchased × 100 (no division by zero when no seats are purchased). The cost of unused seats is only estimated for per-seat pricing with a known price. Actual product usage is never claimed: there's no usage integration.
- The **monthly trend** is the recurring run-rate at each month's end, from start dates, end dates and recorded price changes.
- **Potential savings** count each subscription once (its largest estimate), so overlapping findings aren't double-counted. **Realized savings** exist only when someone confirms them with an amount; their first-year value is one-time as entered, monthly × 12, or yearly as entered.

The dashboard and reports are built from the same model (`src/lib/server/business/analytics.ts`), so their totals match.

### Savings rules (`src/lib/business/savings.ts`, tested in `savings.test.ts`)

1. **Unused licenses** — per-seat plans with seats not in use; estimate = unused seats × cost per seat.
2. **Underutilized licenses** — flat-priced plans under 60% utilization; no estimate (the price doesn't scale with seats).
3. **Potential overlap** — two or more active tools in a category where one usually does the job (team chat, video meetings, project management, docs, design, CRM, support, analytics, finance, HR, storage, office); flagged for review, never as confirmed duplicates.
4. **High-cost subscription** — 20% or more of a currency's recurring cost (with at least 3 priced subscriptions); no estimate.
5. **Annual billing** — monthly plans: an estimate only when an annual price was recorded; otherwise a prompt to check for the 5 largest monthly plans per currency after 90 days.
6. **Alternative software** — open-source products in the Saver Option catalog that cover the same job; no estimate.
7. **Renewal review** — quarterly or longer renewals within 45 days with no decision.
8. **Saver Option deal** — one live listing from the deals catalog per tool the team uses (discounts, credits, startup programs, lifetime licences, free plans; student offers and trials are left out); no estimate (eligibility varies).

Findings are stored with a rule key, so re-running the rules updates them instead of duplicating them, dismissals stick, and findings the rules no longer see are marked "No longer detected".

## Reminders and notifications

Reminder windows default to 30, 14 and 7 days before each renewal (and before cancellation deadlines on auto-renewing plans), set in **Settings → Notifications** and overridable per subscription. They're created as in-app notifications for every member:

- whenever someone opens the business app (at most every few minutes per workspace), and
- daily via Vercel Cron when `CRON_SECRET` is set.

`biz_reminders` records each reminder once, so no path can create a duplicate.

## Demo workspace

"Explore the demo" creates a separate workspace, "Northwind Studio (demo)", flagged `is_demo`, with a fictional company's departments, people, subscriptions, seats, renewals and payments. Prices are sample figures, not vendor quotes. Every page shows a demo banner; it can be reset from Settings. Demo data is never added to a real workspace.

## Not included yet

- CSV import of subscriptions, file attachments and PDF export.
- Exchange rates (totals stay per currency).
- Usage integrations (SSO or vendor APIs), so seat usage is assigned or reported, not measured.
- Email delivery (see above).

## Testing

- `npm test` runs the unit tests (Node's built-in runner) for calculations, savings rules, permissions, utilization history and duplicate detection.
- The end-to-end suite runs against `next start` with a local Postgres and a mock of Supabase Auth's Google flow. It covers sign-in, onboarding, CRUD, seats, renewals, savings, reports versus the dashboard, CSV exports, and authorization: cross-workspace ids, role restrictions, and replayed server actions from a lower role.
- **Real Google OAuth can only be verified on the deployed site with the Google provider switched on.** After deploying, sign in at `/business/login` with a Google account, create a workspace, sign out, and sign back in.
