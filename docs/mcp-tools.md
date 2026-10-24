# MCP tools

The registry is `tools` in `src/lib/server/mcp/tools.ts`; the public docs page `/business/docs/mcp` renders it directly. This file mirrors it for reviewers — if they differ, the code wins. Every tool's `inputSchema` is an object with `additionalProperties: false`; the server validates arguments with the same schema (`src/lib/business/schema.ts`).

Conventions in results:

- Money is `{ amount: "123.45", currency: "USD", display: "$123.45" }`, per currency, never converted.
- Financial results include a `basis`: `actual` (recorded payments), `normalized_estimate` (prices as monthly/annual equivalents), `projection` (renewals at current prices), or the potential/realized savings basis.
- Records include a `url` into the app. Payment-method labels are never returned.
- `tools/list` hides write tools on read-only connections. Annotations: read tools `readOnlyHint: true`; `generate_savings_report` and write tools `readOnlyHint: false`; all `destructiveHint: false`, `openWorldHint: false`.

## Read tools (`business.read`)

| Tool | Inputs (* required) | Returns |
| --- | --- | --- |
| `list_subscriptions` | `status` (live\|active\|trial\|paused\|cancelled\|expired\|all; default live), `search`, `category`, `department`, `vendor`, `billing_interval`, `currency`, `include_archived`, `sort` (cost\|renewal\|name), `limit` (1–100, default 25), `offset` | `total`, `has_more`, subscriptions with price, monthly/annual equivalents, renewal, seats, owner, department, source |
| `get_subscription_details` | `subscription_id`* | The subscription, renewal decision/reviewer/notes, notes, price history, last 12 recorded payments, open opportunities for it |
| `get_spend_summary` | `currency` | Run-rate monthly/annualized per currency, active/trial counts, missing prices/dates, recorded payments last 30/365 days (actual), renewals in 30 days, license totals, potential vs realized savings |
| `get_upcoming_renewals` | `days` (1–365, default 30), `include_cancellation_deadlines` (default true) | Renewals with expected amount, auto-renew, deadline and decision; deadlines in the window; projected totals per currency |
| `get_spending_by_category` | `currency`, `limit` (1–50) | Monthly equivalent, share and count per category, per currency |
| `get_spending_by_vendor` | `currency`, `limit` (1–50) | The same per vendor |
| `find_duplicate_tools` | — | Possible duplicate software records with reasons, and open "potential overlap" findings, with a caution that they need confirming |
| `get_savings_opportunities` | `status` (open\|new\|reviewing\|accepted\|dismissed\|no_longer_detected\|all; default open = new + reviewing), `type`, `limit` (1–50) | Findings with evidence, estimate (or null), confidence, recommended action, status, `realized` flag; potential total (each subscription once) and realized total, separately |
| `analyze_saas_spending` | — | Per currency: run-rate, five largest and their share, top-5 concentration; rule-based insights with evidence; needs-attention items; top opportunities; data-quality gaps; guidance on stating estimates |
| `compare_software_alternatives` | `subscription_id` or `software_id`, `limit` (1–10) | Current cost (normalized estimate), catalog alternatives with functional notes and pricing evidence only where stated, related deals, a general migration checklist; cost difference null with a reason unless comparable |
| `search_deals` | `query`, `category` (deals category slug or software category), `offer_type`, `limit` (1–50), `offset` | Live Saver Option listings; discount/price/expiry null unless the listing states them; verification status; deal page and tracked outbound URLs |
| `get_deal_details` | `deal_id`* (ID or slug) | Full listing: terms, eligibility, redemption, expiry, verification method/date, source page; unknown IDs are an error |
| `get_deals_for_my_software` | — | Listings for the workspace's own tools, tools with no listing (with the reason), and same-category listings |
| `generate_savings_report` | `title`, `renewal_days` (7–365, default 90) | The report (spend, potential by type with evidence, realized, renewals, data quality, method). Saved with a link for roles with `data.export`; otherwise returned unsaved |

## Write tools (`business.write`)

Both preview by default and save only with `confirm: true`. They need a connection approved with "Read and change" and a role that can change the record (owner/admin/finance; members only records they own for updates).

| Tool | Inputs (* required) | Behaviour |
| --- | --- | --- |
| `create_subscription` | `software_name`*, `vendor`, `category`, `website`, `plan`, `price` (decimal string, per billing period), `currency`, `billing_interval`, `custom_interval_count`, `custom_interval_unit`, `pricing_model`, `seats_purchased`, `seats_in_use`, `start_date`, `next_renewal_date`, `auto_renew`, `cancellation_deadline`, `contract_end_date`, `status`, `department` (existing name), `owner` (existing name or email), `notes`, `confirm` | Preview: interpreted values (matched or new software, price, monthly equivalent, dates, seats) and warnings (already has a live subscription, no price, no renewal date, new software). Confirm: creates via `createSubscription` with `source = 'mcp'`; an identical retried call returns `already_created` |
| `update_subscription` | `subscription_id`*, any of the fields above except software identity, `confirm` | Preview: before/after for each changed field, warnings (status change doesn't cancel at the vendor; no changes). Confirm: saves via `updateSubscription`. Archived records must be restored in the app first |

Validation of write values uses the web forms' rules (amounts per currency, date order, seats, per-seat needs purchased seats, card numbers refused). Departments and owners must already exist; unknown names return an error listing what exists.

## Not exposed

No tool deletes or archives records, manages members, changes settings, records payments or savings decisions, cancels/renews/buys anything, or runs queries. Add a tool only when its service is implemented and covered by the MCP end-to-end suite.
