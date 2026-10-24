-- Saver Option Business, part 3: the 7-day free trial and paid plans billed
-- through Creem. Access is decided on the server from these rows only; they
-- change from the app's own trial logic, verified Creem webhooks and server-side
-- Creem API calls — never from a browser redirect. No card data is stored:
-- Creem keeps it, and only Creem's customer and subscription IDs are kept here.
-- Like the rest of biz_*, these tables are read and written only by the server.

-- ─── One billing record per workspace ────────────────────────────────────────

create table if not exists public.biz_billing (
  workspace_id           uuid primary key references public.biz_workspaces (id) on delete cascade,
  -- The free trial (null when this workspace didn't get one).
  trial_started_at       timestamptz,
  trial_ends_at          timestamptz,
  -- The paid subscription as last confirmed by Creem.
  plan                   text check (plan in ('pro', 'business')),
  billing_interval       text check (billing_interval in ('month', 'year')),
  -- Creem's subscription status, as sent (unknown values never grant access).
  status                 text check (char_length(status) <= 40),
  creem_mode             text check (creem_mode in ('test', 'prod', 'sandbox')),
  creem_customer_id      text check (char_length(creem_customer_id) <= 100),
  creem_subscription_id  text unique check (char_length(creem_subscription_id) <= 100),
  creem_product_id       text check (char_length(creem_product_id) <= 100),
  price_minor            integer check (price_minor >= 0),
  currency               text check (currency ~ '^[A-Z]{3}$'),
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  canceled_at            timestamptz,
  ended_at               timestamptz,
  last_refund_at         timestamptz,
  -- When Creem last changed the subscription, so an older delivery never overwrites a newer one.
  synced_at              timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  check (trial_ends_at is null or trial_started_at is not null and trial_ends_at > trial_started_at)
);
create index if not exists biz_billing_customer_idx on public.biz_billing (creem_customer_id);

-- ─── Who has had a free trial ────────────────────────────────────────────────
-- One per account, kept when the workspace is deleted, so deleting and creating
-- workspaces doesn't restart it. The email is kept only as a SHA-256 hash.

create table if not exists public.biz_trial_claims (
  user_id       uuid primary key,
  email_sha256  text not null unique check (email_sha256 ~ '^[0-9a-f]{64}$'),
  workspace_id  uuid references public.biz_workspaces (id) on delete set null,
  started_at    timestamptz not null default now()
);

-- ─── Checkout sessions started from the app ──────────────────────────────────
-- The row id is sent to Creem as request_id; completing one never grants access
-- by itself (the subscription it creates does, once Creem confirms it).

create table if not exists public.biz_billing_checkouts (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.biz_workspaces (id) on delete cascade,
  user_id            uuid not null,
  plan               text not null check (plan in ('pro', 'business')),
  billing_interval   text not null check (billing_interval in ('month', 'year')),
  creem_product_id   text not null check (char_length(creem_product_id) <= 100),
  creem_checkout_id  text unique check (char_length(creem_checkout_id) <= 100),
  status             text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at         timestamptz not null default now(),
  completed_at       timestamptz
);
create index if not exists biz_billing_checkouts_ws_idx on public.biz_billing_checkouts (workspace_id, created_at desc);

-- ─── Webhook deliveries already handled (idempotency + audit) ───────────────

create table if not exists public.biz_billing_events (
  id            text primary key check (char_length(id) <= 200),
  event_type    text not null check (char_length(event_type) <= 80),
  mode          text check (char_length(mode) <= 20),
  workspace_id  uuid references public.biz_workspaces (id) on delete set null,
  object_id     text check (char_length(object_id) <= 100),
  -- applied | ignored | stale, and why (no customer details are kept here).
  result        text not null check (result in ('applied', 'ignored', 'stale')),
  note          text check (char_length(note) <= 300),
  event_at      timestamptz,
  received_at   timestamptz not null default now()
);
create index if not exists biz_billing_events_ws_idx on public.biz_billing_events (workspace_id, received_at desc);

-- ─── Existing workspaces start their free trial now ─────────────────────────
-- (The demo workspace is sample data for trying the product and isn't billed.)

insert into public.biz_billing (workspace_id, trial_started_at, trial_ends_at)
select w.id, now(), now() + interval '7 days' from public.biz_workspaces w where not w.is_demo
on conflict (workspace_id) do nothing;

insert into public.biz_trial_claims (user_id, email_sha256, workspace_id, started_at)
select distinct on (u.id) u.id, encode(sha256(convert_to(lower(u.email), 'UTF8')), 'hex'), w.id, now()
from public.biz_workspaces w join auth.users u on u.id = w.created_by
where not w.is_demo and u.email is not null
order by u.id, w.created_at
on conflict do nothing;

-- ─── Lock the tables to the server ───────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['biz_billing', 'biz_trial_claims', 'biz_billing_checkouts', 'biz_billing_events'] loop
    execute format('alter table public.%I enable row level security', t);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;
