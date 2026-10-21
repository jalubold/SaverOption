# Advertiser listings: setup and operations

Paid "Promote your SaaS" listings. A founder submits a product, pays once through Lemon Squeezy, creates an account and completes a profile. An admin then reviews and publishes it. Everything below the payment provider is provider-agnostic: only `src/lib/server/lemonsqueezy.ts` and `src/app/api/webhooks/lemonsqueezy` know about Lemon Squeezy.

## Advertiser flow

1. **`/promote`**: the founder enters the product name, website, work email and an optional description. No account is needed.
2. **Plan**: 1 Month $9.99, 3 Months $19.99 or 1 Year $49.99, all one-time payments. An order summary is shown, then **Continue to Checkout — $X**.
3. **Saving and checkout**:
   - The server saves the submission (`awaiting_payment`, keyed by an idempotency key from the tab).
   - It sets an httpOnly claim cookie.
   - It creates a Lemon Squeezy hosted checkout. The variant comes from env and the price from `src/config/listing-plans.ts`. `submission_id` goes in custom data.
4. **Cancel**: going back to `/promote` resumes the saved submission at the plan step. A checkout under 23h old for the same plan is reused.
5. **Webhook**: `order_created` is signature-checked. It marks the submission `paid` and moves review to `pending_review`. Nothing is approved or published automatically.
6. **`/promote/success`**:
   - Shows only the status verified in the database, and only to the browser that started checkout.
   - Shows a pending poller until the webhook arrives.
   - When paid it shows "Your listing submission is received!" with **Create Account** / **Log in**.
7. **Account**:
   - Supabase email/password, with email confirmation and password reset.
   - The paid submission is claimed with the single-use claim token: from the cookie, or from the "Manage your listing" button in the Lemon Squeezy receipt (`/claim?s=…&t=…`), which works on any device for 30 days after payment.
8. **`/dashboard`**:
   - Summary counts.
   - Listings with payment, review and publication status shown separately.
   - Listing page: edit details and links, upload a logo, see missing fields, review feedback, dates, payments, views, clicks and CTR.
9. **`/admin`** (emails in `ADMIN_EMAILS`):
   - Filter by payment and review status.
   - Approve, or reject with notes.
   - Publish with start/expiry dates (the default expiry is the plan length).
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
4. **Authentication → Providers → Email**: keep **Confirm email** on.
5. **Authentication → SMTP**: set up a custom SMTP sender (for example Resend). Supabase's built-in mailer only delivers to project members and is heavily rate-limited, so real advertisers won't get confirmation or reset emails without it.

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
| `LEMONSQUEEZY_VARIANT_ID_MONTHLY` / `_QUARTERLY` / `_YEARLY` | server | Optional. Matched automatically by price ($9.99 / $19.99 / $49.99). Env values override what Connect found. |
| `LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED` | server | Leave it `false` until Lemon Squeezy approves in writing. |

Redeploy after changing variables. The `NEXT_PUBLIC_*` values are read at build time.

**Checkout modes** (`checkoutMode()` in `src/lib/server/lemonsqueezy.ts`):

| Situation | Mode |
| --- | --- |
| Lemon Squeezy variables missing | Closed. The submission is saved if a database is configured, and the founder is offered an email button. |
| Production, flag `false` | Closed for visitors. Admins who are logged in get **test mode**. |
| Preview or development deployments | Test mode (no real charges). |
| Flag `true` | Live checkout, only after approval. |

## 3. Lemon Squeezy

1. Use **Test mode** (toggle at the bottom left of the dashboard) for everything until approval.
2. **Products → New product** "Saver Option listing", with three **single payment** variants (not subscriptions):
   - "1 Month": $9.99
   - "3 Months": $19.99
   - "1 Year": $49.99

   Keep these prices identical to `src/config/listing-plans.ts`, and publish the product. The Lemon Squeezy API can't create products, so this step is manual.
3. **Settings → API → create a key** (test mode), and add it in Vercel as `LEMONSQUEEZY_API_KEY`, type Sensitive. Redeploy.
4. Log in at **`/admin/setup`** with an `ADMIN_EMAILS` account and click **Connect Lemon Squeezy automatically**. It:
   - finds the store;
   - matches the three variants by price;
   - creates (or updates) the webhook `https://www.saveroption.com/api/webhooks/lemonsqueezy` for `order_created` and `order_refunded`, with a generated signing secret.

   Everything is saved in the server-only `app_settings` table. Run it again after switching to a live key; the same secret is reused.
5. Refunds are made in Lemon Squeezy. The `order_refunded` webhook updates the status, and a refunded listing disappears from public pages. There are no automatic refunds.

> **Blocker:** Lemon Squeezy's prohibited-products list includes advertising on websites, newsletters and social media, and marketplaces. Ask their support whether paid SaaS directory listings are allowed and get the answer in writing before setting `LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED=true`. If they decline, only `lemonsqueezy.ts` and the webhook route need replacing (for example with Stripe or Paddle). Submissions, claims, dashboard, admin and analytics stay as they are.

## 4. Test checklist (Lemon Squeezy test mode, on a preview deployment or as an admin)

- [ ] `/promote`: fill in the details, change the plan, go back with **Edit**. Nothing is lost.
- [ ] **Continue to Checkout** opens the Lemon Squeezy test checkout for the right plan and price. The submission appears in `/admin` as *Awaiting payment*.
- [ ] Close the checkout and go back to `/promote`: it shows "Welcome back" with your details at the plan step.
- [ ] Pay with test card `4242 4242 4242 4242`. The success page shows "Confirming your payment" until the webhook arrives, then "received!".
- [ ] Lemon Squeezy → Webhooks → recent deliveries show `200`. A resent delivery returns `{"result":"duplicate"}`.
- [ ] **Create Account** (email prefilled) → confirmation email → link → the listing is in `/dashboard`.
- [ ] Repeat with **Log in** for an existing account. Open the receipt email's "Manage your listing" on another device.
- [ ] Edit the description (at least 40 characters) and upload a logo. "Ready to publish" turns green.
- [ ] Another account can't open your listing URL. A used or expired claim link is refused.
- [ ] As admin: approve, then publish. The listing shows at `/listings` and on the homepage labelled Sponsored.
- [ ] View the listing and click **Visit**. The dashboard shows 1 view and 1 click.
- [ ] Refund the test order. The status becomes *Refunded* and the listing leaves public pages.
- [ ] `/admin/metrics` shows the funnel, and test orders are not counted as revenue.
- [ ] In production with the flag `false` and logged out, `/promote` offers **Submit listing** with no checkout.

An automated version of this flow (41 checks against local Postgres with mocked Lemon Squeezy and Supabase Auth) was run before release.
