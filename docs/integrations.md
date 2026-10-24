# Integrations (Saver Option Business)

What connects to Saver Option Business today, and what doesn't yet. The in-app page `/business/integrations` shows the same list to users.

| Integration | Status | Where | Configuration |
| --- | --- | --- | --- |
| Google sign-in (Supabase Auth) | Available | `/business/login`, `/auth/callback` | Supabase Google provider; see `BUSINESS_SETUP.md` |
| CSV import | Available | `/business/subscriptions/import` | None |
| CSV / JSON export | Available | Subscriptions, Reports, Settings → Export | None |
| Remote MCP server for AI clients | Available; no client verified yet | `/mcp`, `/business/settings/mcp` | None (uses Google sign-in); see `mcp.md` |
| Saver Option Deals catalog | Built in | `/business/deals`, savings findings | None |
| In-app renewal reminders | Available | Notifications | Daily run needs `CRON_SECRET` (optional) |
| AI Savings Assistant | Requires configuration | `/business/assistant` | `ANTHROPIC_API_KEY` (server-only) |
| Email reminders and invitations | Not available yet | — | Needs an email provider (e.g. Resend or Postmark) with a server-only key |
| Accounting / expense tools | Not available yet | — | — |
| Card or bank feeds | Not available yet | — | — |
| SSO / usage data | Not available yet | — | Seat usage is assigned or reported, never measured |
| Exchange rates | Not available yet | — | Totals stay per currency |

## CSV import

- Parsing and mapping: `src/lib/business/csv-import.ts` (pure, unit-tested). Detects `,` `;` and tab, handles BOM, CRLF and quoted fields with line breaks; auto-maps headers by synonyms.
- Server: `src/lib/server/business/import.ts`. Each row is turned into the subscription form's field names and validated with the same `readSubscriptionInput` / `readSoftwareInput` rules as the web forms.
- Duplicates: same normalised software + plan + interval + currency within the file or against non-archived subscriptions. Duplicates are skipped and linked; nothing is overwritten.
- Commit: one transaction with an advisory lock on workspace + file hash; per-row idempotency keys derived from workspace, file hash and line, so a double submit or re-import creates nothing twice. The job, counts, mapping and capped messages go to `biz_import_jobs`; created rows get `source = 'csv_import'` and `last_verified_on = null`.
- Permissions: `records.manage` (owner, admin, finance) on both preview and commit.

## Saver Option Deals

`src/lib/server/business/deals.ts` reads the existing catalog (`src/lib/catalog.ts`, `src/content/*`) and returns only live listings, with fields the listing doesn't state returned as `null`. Outbound links use the existing tracked route `/go/<slug>`, disclosed on `/disclosure`. `src/lib/server/business/alternatives.ts` compares a workspace's tool with catalog alternatives; cost differences are returned only when both prices are comparable (currently never, with the reason given).

## Exchange rates (European Central Bank)

Headline totals (the dashboard hero and the subscriptions summary) are shown in the workspace's default currency. Amounts in other currencies are converted with the ECB's daily euro reference rates (`https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml`, free, no key, published on working days around 16:00 CET), and the converted amounts, the rate and its date are shown underneath.

- Fetched server-side in `src/lib/server/business/fx.ts`, cached six hours (Next data cache plus an in-memory last good copy). Nothing about the workspace is sent.
- Parsing and conversion are pure functions in `src/lib/business/fx.ts` (unit-tested), using each currency's minor units.
- If the file can't be fetched, or a currency has no ECB rate, the totals fall back to per-currency figures. Lists, charts, reports, exports and MCP tool results stay per currency.
- `FX_RATES_URL` overrides the source (the E2E suite points it at a local mock).

## Adding an integration

Follow the existing pattern: a server-only module under `src/lib/server/business/` that checks its configuration and degrades gracefully, scoped by `BizContext`, with secrets in server-only environment variables. Don't show a "Connect" button until the integration works end to end.
