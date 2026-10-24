# Database schema (Saver Option Business)

Migrations: `supabase/migrations/20261024000000_business.sql` (core) and `20261025000000_business_import_mcp.sql` (provenance, CSV imports, MCP OAuth, saved reports). The advertiser tables (`advertiser_profiles`, `submissions`, `orders`, …) are described in `ADVERTISER_SETUP.md`.

## Tenant boundaries

- Every business table except the OAuth client registry carries `workspace_id` referencing `biz_workspaces (id) on delete cascade`. Deleting a workspace deletes all of its data.
- Tables that others reference declare `unique (workspace_id, id)`. Cross-references use **composite foreign keys** `(workspace_id, x_id) → (workspace_id, id)`, so a row can't point at another workspace's department, person, software, subscription or import job, whatever a request supplies. Optional references use `on delete set null (column)`.
- RLS is enabled on every `biz_*` table with **no policies**, and all privileges are revoked from `anon` and `authenticated`. Only the server (the `POSTGRES_URL` role) can read or write.
- Application queries always filter by the workspace from the authorized context.

## Tables

| Table | Purpose | Notes |
| --- | --- | --- |
| `biz_workspaces` | A company's workspace | Default currency, time zone, date format, fiscal year start, reminder defaults, `is_demo` |
| `biz_memberships` | App access: user × workspace × role | Roles `owner`, `admin`, `finance`, `member`, `viewer`; optional link to the person directory |
| `biz_invitations` | Access granted to an email address | No email is sent; accepted on sign-in |
| `biz_departments`, `biz_people` | Departments and the team directory (seat holders, owners) | People mostly never sign in |
| `biz_vendors` | Vendors | Unique name per workspace |
| `biz_software` | Software inventory | Category, status (`active`/`evaluating`/`deprecated`/`archived`), optional `catalog_product_id` link to the deals catalog |
| `biz_subscriptions` | Paid plans | Price in minor units + currency, pricing model, billing interval (custom interval count/unit), dates, auto-renew, status, seats, payment-method label, owner/department, renewal decision/reviewer/notes, reminder overrides, `idempotency_key`, `source` (`manual`, `csv_import`, `mcp`, `demo`), `last_verified_on`, `import_job_id`, `archived_at` |
| `biz_cost_history` | Price and terms over time | Feeds the monthly run-rate trend |
| `biz_payments` | Recorded spend (actual) | `manual` or from a recorded renewal |
| `biz_renewal_events` | Renewal outcomes | Renewed / renegotiated / cancelled |
| `biz_seat_assignments` | Named seats | Released seats keep history |
| `biz_reminders` | One row per reminder created | Prevents duplicates across the app and cron paths |
| `biz_notifications` | In-app notifications per user | Links limited to `/business/…` |
| `biz_savings_opportunities` | Spend Detective findings | Stable `rule_key` per finding; status `open`/`reviewed`/`dismissed`/`actioned`/`resolved` (shown as New/Reviewing/Dismissed/Accepted/No longer detected) |
| `biz_realized_savings` | Confirmed savings | Amount, recurrence, evidence |
| `biz_activity` | Audit log | Actor id and name, action, entity, summary, details JSON |
| `biz_import_jobs` | CSV import history | File SHA-256, counts, column mapping, up to 200 row messages (card-like digit runs redacted); never whole rows |
| `biz_oauth_clients` | MCP clients registered via RFC 7591 | Public (`none`) or confidential; secrets stored as SHA-256 |
| `biz_oauth_grants` | A connection: user × workspace × client × scopes | `revoked_at` ends all its tokens |
| `biz_oauth_codes` | Authorization codes | SHA-256 only, 10-minute expiry, PKCE challenge, single use |
| `biz_oauth_tokens` | Access (1 h) and refresh (30 d) tokens | SHA-256 only; `used_at` marks a rotated refresh token |
| `biz_reports` | Saved savings report snapshots | `content` JSON, `source` `app` or `mcp` |

## Integrity rules worth knowing

- Money columns are `bigint` minor units with range checks; currencies match `^[A-Z]{3}$`.
- `biz_subscriptions` checks that custom intervals have both count and unit, and that reported seats don't exceed purchased seats.
- `idempotency_key` is globally unique: a double submit (web form, CSV row or confirmed MCP call) can't create a second subscription.
- Payment methods are short labels; the app rejects anything that looks like a card number. No card data is stored.
- Dates are `date` columns, read as `YYYY-MM-DD` strings (see `src/lib/server/db.ts`).

## Migrations

`scripts/migrate.mjs` applies each file in `supabase/migrations` once, recorded in `public.schema_migrations`, under an advisory lock. It runs before `next build`; a failed migration fails the build and the previous deployment stays live. Migrations are written to be re-runnable (`if not exists`, guarded constraint creation).
