# Advertiser listings: setup and operations

Paid "Promote your SaaS" listings, sold as subscriptions. A founder submits a product, subscribes through Dodo Payments (or Lemon Squeezy, see below), creates an account and completes a profile. An admin then reviews and publishes it. Everything below the payment provider is provider-agnostic: only `src/lib/server/dodo.ts` + `dodo-events.ts` + `src/app/api/webhooks/dodo`, and `src/lib/server/lemonsqueezy.ts` + `src/app/api/webhooks/lemonsqueezy`, know about a provider. `src/lib/server/listing-checkout.ts` picks one per checkout: **once `DODO_PAYMENTS_API_KEY` is set, every new checkout is Dodo's** (it opens when all three products check out, live with a live key or test where test payments are allowed; until then the form saves the submission and offers email, never Lemon Squeezy). Without a Dodo key, Lemon Squeezy works as before. A subscription keeps renewing with the provider it started with (`submissions.billing_provider`), and both webhooks stay active.

## Advertiser flow

1. **"Promote your SaaS"** opens a one-screen popup (also available at `/promote`). The founder enters the product name, website, work email and an optional description, and picks a plan, with no account needed.
2. **Plan**: Monthly, Quarterly (every 3 months) or Yearly subscription, at the prices set on the Lemon Squeezy variants (read by **Connect**; defaults in `src/config/listing-plans.ts` until then). Cancel anytime. A summary is shown, then **Continue to Checkout — $X/month**.
3. **Saving and checkout**:
   - The server saves the submission (`awaiting_payment`, keyed by an idempotency key from the tab).
   - It sets an httpOnly claim cookie.
   - It creates a Lemon Squeezy hosted checkout for the plan's subscription variant. `submission_id` goes in custom data, which Lemon Squeezy also attaches to the subscription's webhooks.
4. **Cancel**: going back to `/promote` resumes the saved submission at the plan step. A checkout under 23h old for the same plan is reused.
5. **Webhooks** (all signature-checked):
   - `order_created` (the first payment) marks the submission `paid` and moves review to `pending_review`. Nothing is approved or published automatically.
   - `subscription_*` events record the subscription's status and its next renewal or end date. The listing's **paid-through** date is the next renewal plus 2 days of grace while active, or the end date once cancelled. A failed or paused subscription gets no more time until a payment succeeds.
   - `subscription_payment_*` events record renewal payments as orders of kind `renewal`, so revenue includes them. Only the first order decides whether the listing is paid for.
6. **`/promote/success`**:
   - Shows only the status verified in the database, and only to the browser that started checkout.
   - Shows a pending poller until the webhook arrives.
   - When paid it shows "Your listing submission is received!" with **Create Account** / **Log in**.
7. **Account**:
   - "Continue with Google" (Supabase Auth). It is one button for new and returning advertisers.
   - The paid submission is claimed with the single-use claim token: from the cookie, or from the "Manage your listing" button in the Lemon Squeezy receipt (`/claim?s=…&t=…`), which works on any device for 30 days after payment.
8. **`/dashboard`**:
   - Summary counts.
   - Listings with payment, review and publication status shown separately.
   - Listing page: edit details and links, upload a logo, see missing fields, review feedback, dates, payments, views, clicks and CTR.
   - **Subscription** panel: plan, status, next renewal (or end date), and **Manage subscription**, which opens Lemon Squeezy's customer portal (update card, switch plan, cancel) through `/dashboard/listings/<id>/billing`.
9. **`/admin`** (emails in `ADMIN_EMAILS`):
   - Filter by payment and review status.
   - Approve, or reject with notes.
   - Publish with a start date. A subscription listing then stays live as long as it's paid for, and renewals and cancellations move its end date automatically. (Older one-time listings use the plan length.)
   - Unpublish.
   - `/admin/metrics` shows funnel counts, conversion rates and revenue from verified non-test orders.
10. **Public**:
    - Published, paid, in-window listings appear at `/listings`, `/listings/<slug>` and in the homepage "Sponsored listings" section, always labelled **Sponsored**.
    - Views are counted by a beacon on the listing page. Outbound clicks go through `/listings/<slug>/visit`.
    - Both are counted once per visitor per day, excluding bots.

## 1. Supabase

1. Add it from **Vercel → project → Storage → Supabase → Connect**. This sets the env vars for you.
2. **Tables are created automatically.** `npm run build` runs `scripts/migrate.mjs` first.
   - It applies each file in `supabase/migrations/` once, records it in `schema_migrations`, and uses a lock so parallel builds don't collide.
   - A failing migration fails the build, so the previous deployment stays live.
   - Without a database configured it does nothing.
   - To run it by hand: `npm run db:migrate`.
   - Tables: `advertiser_profiles`, `submissions`, `orders`, `webhook_events`, `listing_events`, `funnel_events`, with check constraints and indexes.
   - **RLS on every table.**
     - Advertisers may only `select` their own profile, submissions and orders.
     - Secret columns (claim token hash, idempotency key, checkout URL) are not readable through the API.
     - The API roles have no insert, update or delete privileges at all.
     - All writes happen server-side over `POSTGRES_URL`.
   - A public-read Storage bucket `listing-logos`. It accepts PNG/JPEG/WebP up to 512 KB, and uploads happen server-side only.
3. **Authentication → URL configuration**:
   - Site URL: `https://www.saveroption.com`
   - Redirect URLs:
     - `https://www.saveroption.com/auth/callback`
     - `https://*-aa-6e10.vercel.app/**` (previews)
     - `http://localhost:3000/auth/callback`
4. **Sign-in is with Google** (one button for new and returning advertisers; no confirmation or reset emails, so no SMTP setup is needed).
   - Google Cloud Console → create a project.
   - **Google Auth Platform → Branding**: app name "Saver Option", support email, authorized domain `saveroption.com`.
   - **Audience**: External, then **Publish app**. The basic email and profile scopes don't need Google verification.
   - **Clients → Create client → Web application**:
     - Authorized JavaScript origin: `https://www.saveroption.com`
     - Authorized redirect URI: the **Callback URL** shown on Supabase's Google provider page (`https://<project-ref>.supabase.co/auth/v1/callback`).
   - Supabase → **Authentication → Sign In / Providers → Google**: enable it, paste the Client ID and Client Secret, then save.
   - `/admin/setup` shows **Google sign-in ✓** once it's on. Google is the only way to sign in.
   - An existing email/password account with the same Gmail address is linked automatically, and keeps admin rights.

## 2. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Scope | Notes |
| --- | --- | --- |
| `POSTGRES_URL` | server | Pooled connection string, set by the Supabase integration. `DATABASE_URL` also works. |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Set by the integration. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Set by the integration. Used for Auth only. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` also works. |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Logo uploads. Never prefix with `NEXT_PUBLIC_`. |
| `ADMIN_EMAILS` | server | Comma-separated. The account must have a confirmed email. |
| `LEMONSQUEEZY_API_KEY` | **server only** | Lemon Squeezy → Settings → API. **The only Lemon Squeezy variable you need.** |
| `LEMONSQUEEZY_STORE_ID` | server | Optional. Found automatically by **/admin/setup → Connect**; set it only if the key can see several stores. |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | **server only** | Optional. Generated and registered automatically by Connect. |
| `LEMONSQUEEZY_VARIANT_ID_MONTHLY` / `_QUARTERLY` / `_YEARLY` | server | Optional. Matched automatically by billing interval (every month / 3 months / year). Env values override what Connect found. |
| `LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED` | server | Leave it `false` until Lemon Squeezy approves in writing. |
| `DODO_PAYMENTS_API_KEY` | **server only** | Dodo → Developer → API Keys. A restricted key is enough: Checkout sessions **write**, Customers **write** (customer portal links), Products, Subscriptions and Payments **read**; everything else none. Test or live is read from its prefix (`dodo_test_` / `dodo_live_`). |
| `DODO_PAYMENTS_WEBHOOK_KEY` | **server only** | The signing secret of the webhook endpoint `https://www.saveroption.com/api/webhooks/dodo` (Payment, Subscription and Refund events). |
| `DODO_PRODUCT_ID_MONTHLY` / `_QUARTERLY` / `_YEARLY` | server | The three subscription products (USD, billed every month / every 3 months / every year). The site shows their prices. |
| `DODO_PAYMENTS_ENVIRONMENT` | server | Optional: `test_mode` or `live_mode`, only if the key's prefix doesn't say. |

Redeploy after changing variables. The `NEXT_PUBLIC_*` values are read at build time.

**Checkout modes** (`checkoutMode()` in `src/lib/server/lemonsqueezy.ts`):

| Situation | Mode |
| --- | --- |
| Lemon Squeezy variables missing | Closed. The submission is saved if a database is configured, and the founder is offered an email button. |
| Production, flag `false` | Closed for visitors. Admins who are logged in get **test mode**. |
| Preview or development deployments | Test mode (no real charges). |
| Flag `true` | Live checkout, only after approval. |

## 3. Dodo Payments (new checkouts)

1. Work in **Test Mode** first (the Live Mode switch in Dodo's sidebar off). Keys, products and webhooks belong to the mode they're made in.
2. Create the three subscription products (USD): every month, every 3 months, every year, at the plan prices.
3. Create the restricted API key (permissions above) and the webhook endpoint, and add the five variables to Vercel (Production, Sensitive). Redeploy.
4. **`/admin/setup` → Listing payments (Dodo Payments)** shows the mode, the webhook URL and each product with its price and billing period. Checkout only goes to Dodo when all three are ✓ (a product that bills differently from its plan blocks it, so the price shown is always the price charged).
5. With a **test key** on production, admins check out with Dodo test payments; visitors get the saved-submission + email form (no test payments, and no Lemon Squeezy). Preview deployments use test payments for everyone.
6. **Going live:** once Dodo's account verification is done, switch to Live Mode, repeat steps 2–3 there, and replace the five values in Vercel with the live ones (`dodo_live_…`). Live checkout starts with the live key; there's no separate flag.

> **Check with Dodo first:** Dodo's merchant acceptance policy doesn't mention advertising or directory listings specifically, but lists manual (non-automated) digital services and marketplace models among restricted categories, and every listing here is reviewed by hand. Describe the product accurately ("paid sponsored listings on a software deals directory, reviewed before publishing") during verification, and ask support to confirm it's accepted before taking live payments.

How Dodo events are applied (`src/lib/server/dodo-events.ts`): signatures are checked per Standard Webhooks; the delivery id (`webhook-id`) makes retries apply once. `payment.succeeded` / `payment.failed` record orders keyed by the payment id; the first successful one marks the listing paid and queues it for review, later ones are renewals. `subscription.*` events set the status (`on_hold` → past due, `cancel_at_next_billing_date` → cancelled until the end of the period) and how long the listing stays live; an event that arrives before its payment answers 500 so Dodo retries it. `refund.succeeded` updates the order (a refund of the first payment cancels the listing). Events for other products are ignored.

## 4. Lemon Squeezy

1. Use **Test mode** (toggle at the bottom left of the dashboard) for everything until approval.
2. **Products → New product** "Subscription", with three **subscription** variants:
   - Monthly: repeat payment every 1 month
   - Quarterly: every 3 months
   - Yearly: every 1 year (or 12 months)

   Set any prices you like and publish the product; the site reads the prices from these variants. The Lemon Squeezy API can't create products, so this step is manual. An older one-time product can stay in the store; it's ignored.
3. **Settings → API → create a key** (test mode), and add it in Vercel as `LEMONSQUEEZY_API_KEY`, type Sensitive. Redeploy.
4. Log in at **`/admin/setup`** with an `ADMIN_EMAILS` account and click **Connect Lemon Squeezy automatically**. It:
   - finds the store;
   - matches the three subscription variants by billing interval and saves their prices. When a product is named like "Subscription", all three must come from it (other products, such as an older listing product, are ignored); otherwise one product that has all three is preferred;
   - creates (or updates) the webhook `https://www.saveroption.com/api/webhooks/lemonsqueezy` for orders, subscription changes and subscription payments, with a generated signing secret.

   A site that was connected to the old one-time product switches itself over: in production, the first server to start (or the first checkout) runs the same Connect step once, keeping the store, webhook URL and secret. Until it succeeds the old one-time variants are never sold, and any error shows on `/admin/setup`.

   Everything is saved in the server-only `app_settings` table, and cached pages are refreshed with the new prices. Run it again after changing prices, after switching to a live key, or after turning live checkout on (that registers the live-mode webhook); the same secret is reused.
5. Refunds are made in Lemon Squeezy (Orders → the order → Refund), following the policy on `/terms#refunds`:
   - **Declined listing:** refund the first payment in full **and cancel the subscription** (Subscriptions → the subscription → Cancel), so it doesn't renew.
   - **Cancelled before going live:** a partial refund of the first payment minus Lemon Squeezy's processing fee, and cancel the subscription. The site treats a partial refund as a cancellation, so the listing can't be published.
   - **Live listing:** no refund, including renewals. Advertisers cancel from their dashboard; the listing stays live until the end of the paid period.

   The webhooks update the status automatically. There are no automatic refunds or cancellations.

> **Blocker:** Lemon Squeezy's prohibited-products list includes advertising on websites, newsletters and social media, and marketplaces. Ask their support whether paid SaaS directory listings are allowed and get the answer in writing before setting `LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED=true`. If they decline, only `lemonsqueezy.ts` and the webhook route need replacing (for example with Stripe or Paddle). Submissions, claims, dashboard, admin and analytics stay as they are.

## 5. Test checklist (Lemon Squeezy test mode, on a preview deployment or as an admin)

- [ ] `/promote`: fill in the details, change the plan, go back with **Edit**. Nothing is lost.
- [ ] **Continue to Checkout** opens the Lemon Squeezy test checkout for the right plan and price, on the "Subscription" product. A checkout opened before the last Connect is never reused. The submission appears in `/admin` as *Awaiting payment*.
- [ ] Close the checkout and go back to `/promote`: your details and plan are still filled in.
- [ ] Pay with test card `4242 4242 4242 4242`. The success page shows "Confirming your payment" until the webhook arrives, then "received!".
- [ ] Lemon Squeezy → Webhooks → recent deliveries show `200`. A resent delivery returns `{"result":"duplicate"}`.
- [ ] **Create Account** (email prefilled) → confirmation email → link → the listing is in `/dashboard`.
- [ ] Repeat with **Log in** for an existing account. Open the receipt email's "Manage your listing" on another device.
- [ ] Edit the description (at least 40 characters) and upload a logo. "Ready to publish" turns green.
- [ ] Another account can't open your listing URL. A used or expired claim link is refused.
- [ ] As admin: approve, then publish. The listing shows at `/listings` and on the homepage labelled Sponsored.
- [ ] View the listing and click **Visit**. The dashboard shows 1 view and 1 click.
- [ ] **Manage subscription** in the dashboard opens Lemon Squeezy's portal. Cancel there: the dashboard shows *Subscription cancelled* with the end date, and the listing stays live until then.
- [ ] Refund the test order. The status becomes *Refunded* and the listing leaves public pages.
- [ ] `/admin/metrics` shows the funnel, and test orders are not counted as revenue.
- [ ] In production with the flag `false` and logged out, `/promote` offers **Submit listing** with no checkout.

An automated version of this flow (checks against local Postgres with mocked Lemon Squeezy and Supabase Auth, including renewals, cancellation and expiry) was run before release. The Dodo path has its own automated suite (mocked Dodo API and signed webhooks: checkout session, payment linking, retries and duplicates, renewals, on hold, cancellation, refunds, customer portal, and the production test-key gate). A real purchase in Dodo's test mode is still the final check: **Continue to Checkout** opens Dodo's test checkout, a test card completes it, the webhook endpoint's deliveries in Dodo show `200`, and the listing shows *Paid* with **Manage subscription** opening Dodo's portal.
