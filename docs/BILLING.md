# Saver Option Business — plans, free trial and Creem billing

How the business model is implemented, how to set up Creem, and how to test it.

## The model

| | What you get | Price |
| --- | --- | --- |
| **Free trial** | Everything (Business limits) for 7 days. No card. One per account. | Free |
| **Pro** | All Saver Option Business features: inventory, subscriptions, licenses and seats, renewals and reminders, analytics, reports and exports, savings opportunities and deals, CSV import, AI clients over MCP, the AI Savings Assistant (when configured). Up to 5 members by default. | $29/month or $290/year by default |
| **Business** | Everything in Pro, unlimited members by default. | $49/month or $490/year by default (set the final prices in Creem) |
| **Self-Hosted / White-Label** | Arranged directly — contact button to `BUSINESS_CONTACT_EMAIL`, no checkout. | — |

There is no free plan after the trial. Owners and admins can upgrade at any time during the trial (header button, trial banner, sidebar card, Plan & billing). The pricing on the landing page and in Plan & billing has a Monthly / Yearly switch; the saving badge ("-17%") is computed from the prices shown — twelve monthly payments against the yearly price. Plans differ only in the member limit (people who can sign in, counting open invitations) — no features are invented for a tier. Limits are set with `BILLING_PRO_MEMBER_LIMIT` / `BILLING_BUSINESS_MEMBER_LIMIT`.

The **demo workspace** (fictional sample data, one per account) isn't billed, so anyone can try the product.

## What Creem supports, and how it's used

Checked against Creem's official TypeScript SDK (npm `creem` 1.13, `@creem_io/nextjs` 0.6) because docs.creem.io wasn't reachable from the build environment:

| Need | Creem capability used |
| --- | --- |
| Checkout (monthly and yearly) | `POST /v1/checkouts` with `product_id`, `request_id`, `success_url`, `customer.email`, `metadata`. One recurring product per plan × interval. |
| Finding the plan products | `GET /v1/products/search?status=active`: a recurring product billed `every-month` / `every-year` whose name contains "Pro" or "Business" (not both). Several matches for the same plan and interval pick none. `CREEM_PRODUCT_*` pins one. A subscription's plan is read from its product the same way, so subscribers on an older product keep their plan. |
| Prices shown before checkout | `GET /v1/products/{id}`: `price` (cents), `currency`, `billing_period` (`every-month` / `every-year`), `tax_mode`, `trial_period_days`, `trial_price`. |
| Confirming a return from checkout | `GET /v1/checkouts?checkout_id=…` (server key) — the redirect's query string is never trusted. |
| Subscription state | `GET /v1/subscriptions?subscription_id=…`; statuses `active`, `trialing`, `past_due`, `unpaid`, `paused`, `scheduled_cancel`, `canceled`. |
| Cancellation | `POST /v1/subscriptions/{id}/cancel` with `{ "mode": "scheduled" }` — ends at the close of the paid period. |
| Customer portal | `POST /v1/customers/billing` `{ customer_id }` → `customer_portal_link` (payment method, invoices). |
| Webhooks | `checkout.completed`, `subscription.active` / `trialing` / `paid` / `update` / `scheduled_cancel` / `canceled` / `past_due` / `unpaid` / `paused` / `expired`, `refund.created`, `dispute.created`. Envelope `{ id, eventType, created_at, object }`. |
| Webhook signatures | Standard Webhooks (`webhook-id`, `webhook-timestamp`, `webhook-signature: v1,<base64 HMAC-SHA256 of "id.timestamp.body">`, 5-minute tolerance) or the `creem-signature` header (hex HMAC-SHA256 of the raw body). Both are verified with `CREEM_WEBHOOK_SECRET`. |

**Trials in Creem are a product setting** (`trial_period_days`) and Creem collects a payment method at checkout for them. The requirement here is a 7-day trial for every eligible new customer, so the trial is run by the app instead — no card, server-side timestamps — and the Creem products should be created **without** a Creem trial (otherwise people would get a second one). If a product does have a Creem trial, the confirmation page says so (length, price, that Creem asks for a payment method, and when the first full charge happens) and `trialing` subscriptions get access.

## Access rules (server-side)

`src/lib/business/billing.ts` (`resolveAccess`) decides, on every page, server action, MCP tool call and report export:

- **Trial** — `trial_ends_at` in the future → access.
- **Subscription** — `active` or `trialing` → access. `scheduled_cancel`, `canceled` and `past_due` → access until `current_period_end`. `unpaid`, `paused`, `expired` or anything unknown → none.
- Otherwise **locked**. Settings, members, Plan & billing, security, AI client connections, the full JSON export and the subscriptions CSV stay available; software records, reports, the dashboard, the assistant and MCP tools are paused. Nothing is deleted.

Trial rules: a trial starts when a workspace is created, if neither the user ID nor the (hashed) email address has had one (`biz_trial_claims`, kept when a workspace is deleted). Signing out, a new device or a refresh changes nothing — the dates are in the database. Workspaces that existed before billing got a 7-day trial starting when the migration ran.

## Lifecycle

| Creem event / call | Effect |
| --- | --- |
| Checkout started (app) | `biz_billing_checkouts` row (`pending`); its id is Creem's `request_id` and is in the metadata with the workspace id. No access change. |
| `checkout.completed` | Checkout row → `completed`; the expanded (or API-read) subscription is applied. |
| `subscription.active` / `paid` / `update` / `trialing` | Status, plan (from the product ID), price, period dates saved → access. |
| `subscription.past_due` / `unpaid` | "Payment failed" banner; access until the period end (`past_due`) or none (`unpaid`). |
| `subscription.scheduled_cancel` / `canceled` | "Subscription ending" banner; access until the period end. |
| `subscription.expired` / `paused` | No access. |
| `refund.created` / `dispute.created` | Recorded; access still follows the subscription's status. |
| Return to `/business/settings/billing?checkout=…` | Server asks Creem's API about that checkout (this workspace's only) and applies what Creem reports. |

Safety checks on every event: signature first; each event id applied once (`biz_billing_events`, same transaction as the change — a failure rolls both back and returns 500 so Creem retries); test-mode objects are ignored in production and vice versa; the workspace comes from the subscription already linked to it, else the metadata the server set — a subscription linked to one workspace can't be moved to another; older updates never overwrite newer ones; a running subscription isn't replaced by a different one that has ended; products this deployment doesn't sell give no plan access.

## Setting up Creem

1. In Creem (start in **test mode**), create recurring products **without a trial**, named with "Pro" or "Business":
   - "Saver Option Pro" — every month, $29
   - "Saver Option Pro yearly" — every year, e.g. $290
   - "Saver Option Business" — every month, e.g. $49–99
   - "Saver Option Business yearly" — every year, e.g. $490
   Any you skip simply isn't offered (e.g. no yearly product → no yearly checkout for that plan).
2. Developers → API keys: copy the (test) API key.
3. Developers → Webhooks: add `https://<your-domain>/api/webhooks/creem` and copy the signing secret.
4. In Vercel → Project → Settings → Environment Variables (server-only, never `NEXT_PUBLIC_`): `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`, and `CREEM_TEST_MODE=true` for test mode. Product IDs aren't needed (set `CREEM_PRODUCT_*` only to pin one). Optional: `BUSINESS_CONTACT_EMAIL`, member limits, list prices (see `.env.example`).
5. Redeploy, then open `/admin/setup` → "Saver Option Business plans (Creem)": each plan shows the product it uses, its Creem price and "Ready". New or changed products in Creem are picked up within 10 minutes.
6. For live payments: switch Creem to live mode, create the same products there, replace the key and webhook secret, and set `CREEM_TEST_MODE=false` (or remove it).

Until steps 1–5 are done, the plan cards show the list prices (monthly and yearly) with "Online checkout isn't available yet" and a contact link — nothing pretends to take payment. Once checkout is live, the switch and the prices follow the Creem products: a plan without a usable yearly product says yearly isn't available. Trials still run and end.

## Testing

- **Automated** (no real payments): unit tests for the access rules, trial timing, signature verification (both schemes, tampering, stale timestamps) and payload parsing (`npm test`); the end-to-end suite runs the real app against a local mock of the Creem API and posts signed webhooks: trial start, repeat-trial refusal, expiry and locking (pages, actions, MCP, exports), what stays open, checkout disclosure and creation, activation, renewal, payment failure, scheduled cancellation, expiry, refunds, invalid signatures, duplicate and out-of-order events, cross-workspace and role checks, and the UI states.
- **With Creem's test mode** (manual, after setup): subscribe from Plan & billing with a test card from Creem's test-mode docs; check the webhook deliveries in Creem's dashboard and that the plan shows as active; open Manage billing; cancel and check the "ending" state; then check expiry/renewal with Creem's test tools where available. The real Creem flow has **not** been exercised from this repository, because no Creem credentials were available while it was built.
