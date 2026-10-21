-- Saver Option: advertiser listings, payments, review and analytics.
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to re-run.
--
-- Access model: the app reads and writes these tables from the server only, over
-- the Postgres connection (POSTGRES_URL), and enforces ownership and admin rights
-- in code. Row Level Security is enabled on every table so the public anon key
-- (which ships to browsers) cannot read or write anything except an advertiser's
-- own rows, read-only. Payment, review and publication columns are never
-- writable through the API.

create extension if not exists pgcrypto;

-- ─── Advertiser profile ──────────────────────────────────────────────────────

create table if not exists public.advertiser_profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- ─── Submissions (one per listing) ───────────────────────────────────────────

create table if not exists public.submissions (
  id                      uuid primary key default gen_random_uuid(),
  -- Client-generated key so a double click or refresh can't create a second row.
  idempotency_key         text not null unique check (char_length(idempotency_key) between 16 and 64),
  user_id                 uuid references auth.users (id) on delete set null,

  -- Essential details collected before checkout.
  product_name            text not null check (char_length(product_name) between 2 and 80),
  website                 text not null check (website ~ '^https?://' and char_length(website) <= 300),
  contact_email           text not null check (char_length(contact_email) <= 254),
  description             text check (char_length(description) <= 600),

  -- Profile completed after checkout.
  logo_url                text check (char_length(logo_url) <= 500),
  links                   jsonb not null default '{}'::jsonb,

  -- Plan and price as validated by the server at creation (never from the browser).
  plan                    text not null check (plan in ('1m', '3m', '1y')),
  price_cents             integer not null check (price_cents > 0),
  currency                text not null default 'USD' check (currency = 'USD'),

  -- Payment state, set only from verified Lemon Squeezy webhooks.
  payment_status          text not null default 'awaiting_payment'
                            check (payment_status in ('awaiting_payment', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  paid_at                 timestamptz,

  -- Review/publication state, set only by admins (payment moves draft → pending_review).
  review_status           text not null default 'draft'
                            check (review_status in ('draft', 'pending_review', 'approved', 'rejected', 'published')),
  review_notes            text check (char_length(review_notes) <= 2000),
  reviewed_at             timestamptz,
  slug                    text unique check (slug ~ '^[a-z0-9-]{2,90}$'),
  listing_starts_at       timestamptz,
  listing_ends_at         timestamptz,
  constraint listing_window check (listing_ends_at is null or listing_starts_at is null or listing_ends_at > listing_starts_at),

  -- Hosted checkout currently associated with this submission.
  checkout_id             text,
  checkout_url            text,
  checkout_plan           text check (checkout_plan in ('1m', '3m', '1y')),
  checkout_test_mode      boolean,
  checkout_created_at     timestamptz,

  -- Single-use claim token (sha256 hex) that links a paid submission to an account.
  claim_token_hash        text,
  claim_token_expires_at  timestamptz,
  claimed_at              timestamptz,

  profile_started_at      timestamptz,
  profile_completed_at    timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists submissions_user_idx on public.submissions (user_id);
create index if not exists submissions_status_idx on public.submissions (payment_status, review_status);
create index if not exists submissions_published_idx on public.submissions (listing_ends_at) where review_status = 'published';

-- ─── Orders (Lemon Squeezy) ──────────────────────────────────────────────────

create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  submission_id        uuid not null references public.submissions (id) on delete restrict,
  provider             text not null default 'lemonsqueezy' check (provider = 'lemonsqueezy'),
  provider_order_id    text not null unique,
  order_identifier     text,
  order_number         bigint,
  variant_id           text not null,
  plan                 text not null check (plan in ('1m', '3m', '1y')),
  status               text not null check (status in ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  currency             text not null,
  subtotal_cents       integer not null default 0,
  tax_cents            integer not null default 0,
  total_cents          integer not null default 0,
  refunded_cents       integer not null default 0,
  test_mode            boolean not null default false,
  provider_updated_at  timestamptz,
  paid_at              timestamptz,
  refunded_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_submission_idx on public.orders (submission_id);

-- Every webhook delivery we processed, keyed by a hash of its raw body, so retries
-- and duplicates are ignored. Holds no payload or personal data.
create table if not exists public.webhook_events (
  id            text primary key,
  event_name    text not null,
  received_at   timestamptz not null default now()
);

-- ─── Listing performance (published listings only) ───────────────────────────

create table if not exists public.listing_events (
  id             bigint generated always as identity primary key,
  submission_id  uuid not null references public.submissions (id) on delete cascade,
  type           text not null check (type in ('view', 'click')),
  day            date not null default (now() at time zone 'utc')::date,
  -- One-way daily hash of IP + user agent, so one visitor counts once per type per day.
  visitor_hash   text not null,
  created_at     timestamptz not null default now(),
  unique (submission_id, type, day, visitor_hash)
);

create index if not exists listing_events_lookup_idx on public.listing_events (submission_id, day);

-- ─── Conversion funnel ───────────────────────────────────────────────────────

create table if not exists public.funnel_events (
  id             bigint generated always as identity primary key,
  name           text not null check (name in (
                   'promote_page_viewed', 'listing_form_started', 'listing_details_submitted', 'plan_selected',
                   'checkout_started', 'checkout_returned', 'payment_succeeded', 'payment_failed',
                   'account_signup_started', 'account_created', 'profile_completion_started', 'profile_completed')),
  -- Anonymous random browser id; no personal data.
  session_id     text check (char_length(session_id) <= 64),
  submission_id  uuid references public.submissions (id) on delete set null,
  -- name + submission (or session) — each step counts once per submission/session.
  dedupe_key     text not null unique,
  created_at     timestamptz not null default now()
);

create index if not exists funnel_events_name_idx on public.funnel_events (name, created_at);

-- ─── Row Level Security ──────────────────────────────────────────────────────

alter table public.advertiser_profiles enable row level security;
alter table public.submissions        enable row level security;
alter table public.orders             enable row level security;
alter table public.webhook_events     enable row level security;
alter table public.listing_events     enable row level security;
alter table public.funnel_events      enable row level security;

-- Advertisers may read (never write) their own profile, submissions and orders.
-- No other policies exist, so every other API access is denied.
drop policy if exists "own profile" on public.advertiser_profiles;
create policy "own profile" on public.advertiser_profiles
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "own submissions" on public.submissions;
create policy "own submissions" on public.submissions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders
  for select to authenticated using (
    exists (select 1 from public.submissions s where s.id = orders.submission_id and s.user_id = auth.uid())
  );

-- Table privileges: the API roles get read access only where a policy allows it, and
-- secret columns (claim token, idempotency key, checkout URL) aren't readable at all.
revoke all on public.advertiser_profiles, public.submissions, public.orders, public.webhook_events,
  public.listing_events, public.funnel_events from anon, authenticated;
grant select on public.advertiser_profiles, public.orders to authenticated;
grant select (id, user_id, product_name, website, contact_email, description, logo_url, links, plan, price_cents,
  currency, payment_status, paid_at, review_status, review_notes, reviewed_at, slug, listing_starts_at,
  listing_ends_at, profile_completed_at, created_at, updated_at) on public.submissions to authenticated;

-- ─── Logo storage ────────────────────────────────────────────────────────────

-- Public-read bucket; uploads happen server-side only (no insert policy for users).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-logos', 'listing-logos', true, 524288, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
