-- Saver Option Business: software spending management for companies.
--
-- Access model (same as the advertiser tables): the app reads and writes these
-- tables from the server only, over the Postgres connection, and checks the
-- signed-in user's workspace membership and role in code on every request.
-- RLS is enabled with no policies and the API roles have no privileges, so the
-- public anon key that ships to browsers can't read or write any of it.
--
-- Tenancy is also enforced by the schema: every child row carries workspace_id,
-- and cross-references use composite foreign keys (workspace_id, id), so a row
-- can never point at a department, person, software or subscription that
-- belongs to another workspace — whatever ids a request supplies.
--
-- Money is stored as integer minor units (cents for USD, yen for JPY) next to
-- an ISO 4217 currency code. Amounts in different currencies are never added
-- together: there is no exchange-rate source.

create extension if not exists pgcrypto;

-- ─── Workspaces ──────────────────────────────────────────────────────────────

create table if not exists public.biz_workspaces (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null check (char_length(name) between 2 and 80),
  industry                 text check (char_length(industry) <= 80),
  company_size             text check (company_size in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  website                  text check (website ~ '^https?://' and char_length(website) <= 300),
  logo_url                 text check (logo_url ~ '^https://' and char_length(logo_url) <= 500),
  contact_name             text check (char_length(contact_name) <= 120),
  contact_email            text check (char_length(contact_email) <= 254),
  contact_phone            text check (char_length(contact_phone) <= 40),
  default_currency         char(3) not null default 'USD' check (default_currency ~ '^[A-Z]{3}$'),
  time_zone                text not null default 'UTC' check (char_length(time_zone) between 1 and 64),
  fiscal_year_start        smallint not null default 1 check (fiscal_year_start between 1 and 12),
  date_format              text not null default 'MMM d, yyyy'
                             check (date_format in ('MMM d, yyyy', 'd MMM yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy')),
  -- Default renewal reminder windows, in days before the renewal date.
  reminder_days            integer[] not null default '{30,14,7}'
                             check (cardinality(reminder_days) <= 6 and 0 < all (reminder_days) and 366 > all (reminder_days)),
  notify_in_app            boolean not null default true,
  -- Stored for when an email provider is configured; nothing is emailed until then.
  notify_email             boolean not null default false,
  -- Fictional sample workspace created on request; never mixed with a real workspace's records.
  is_demo                  boolean not null default false,
  onboarding_completed_at  timestamptz,
  created_by               uuid references auth.users (id) on delete set null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ─── Departments and people ──────────────────────────────────────────────────

create table if not exists public.biz_departments (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 60),
  archived_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (workspace_id, id)
);
create unique index if not exists biz_departments_name_idx on public.biz_departments (workspace_id, lower(name)) where archived_at is null;

-- The team directory: everyone who can own software or hold a seat. A person may
-- also be an app user (user_id), but most seat holders never sign in.
create table if not exists public.biz_people (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null references public.biz_workspaces (id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 120),
  email          text check (email = lower(email) and char_length(email) <= 254 and email like '%_@_%'),
  title          text check (char_length(title) <= 80),
  department_id  uuid,
  user_id        uuid references auth.users (id) on delete set null,
  status         text not null default 'active' check (status in ('active', 'inactive')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, department_id) references public.biz_departments (workspace_id, id) on delete set null (department_id)
);
create unique index if not exists biz_people_email_idx on public.biz_people (workspace_id, email) where email is not null;
create unique index if not exists biz_people_user_idx on public.biz_people (workspace_id, user_id) where user_id is not null;

-- ─── Members (app access) and invitations ────────────────────────────────────

create table if not exists public.biz_memberships (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  role          text not null check (role in ('owner', 'admin', 'finance', 'member', 'viewer')),
  person_id     uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (workspace_id, user_id),
  foreign key (workspace_id, person_id) references public.biz_people (workspace_id, id) on delete set null (person_id)
);
create index if not exists biz_memberships_user_idx on public.biz_memberships (user_id);

-- Access granted to an email address. Nothing is emailed (no email provider is
-- configured): the person signs in with Google using that address and accepts.
create table if not exists public.biz_invitations (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  email         text not null check (email = lower(email) and char_length(email) <= 254 and email like '%_@_%'),
  role          text not null check (role in ('admin', 'finance', 'member', 'viewer')),
  invited_by    uuid references auth.users (id) on delete set null,
  accepted_at   timestamptz,
  accepted_by   uuid references auth.users (id) on delete set null,
  revoked_at    timestamptz,
  created_at    timestamptz not null default now()
);
create unique index if not exists biz_invitations_open_idx on public.biz_invitations (workspace_id, email) where accepted_at is null and revoked_at is null;
create index if not exists biz_invitations_email_idx on public.biz_invitations (email) where accepted_at is null and revoked_at is null;

-- ─── Vendors and software inventory ──────────────────────────────────────────

create table if not exists public.biz_vendors (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 80),
  website       text check (website ~ '^https?://' and char_length(website) <= 300),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (workspace_id, id)
);
create unique index if not exists biz_vendors_name_idx on public.biz_vendors (workspace_id, lower(name));

create table if not exists public.biz_software (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.biz_workspaces (id) on delete cascade,
  vendor_id           uuid,
  name                text not null check (char_length(name) between 1 and 80),
  category            text not null default 'other' check (category in (
                        'communication', 'video_meetings', 'project_management', 'documentation', 'design', 'development',
                        'cloud_hosting', 'ai', 'crm_sales', 'marketing', 'customer_support', 'analytics', 'finance_accounting',
                        'hr_people', 'security', 'storage', 'productivity', 'other')),
  description         text check (char_length(description) <= 1000),
  business_purpose    text check (char_length(business_purpose) <= 500),
  website             text check (website ~ '^https?://' and char_length(website) <= 300),
  owner_person_id     uuid,
  department_id       uuid,
  status              text not null default 'active' check (status in ('active', 'evaluating', 'deprecated', 'archived')),
  notes               text check (char_length(notes) <= 4000),
  -- Matching product in the Saver Option deals catalog (src/content/products.ts), when one exists.
  catalog_product_id  text check (char_length(catalog_product_id) <= 80),
  created_by          uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, vendor_id) references public.biz_vendors (workspace_id, id) on delete set null (vendor_id),
  foreign key (workspace_id, owner_person_id) references public.biz_people (workspace_id, id) on delete set null (owner_person_id),
  foreign key (workspace_id, department_id) references public.biz_departments (workspace_id, id) on delete set null (department_id)
);
create unique index if not exists biz_software_name_idx on public.biz_software (workspace_id, lower(name)) where status <> 'archived';
create index if not exists biz_software_vendor_idx on public.biz_software (workspace_id, vendor_id);

-- ─── Subscriptions ───────────────────────────────────────────────────────────

create table if not exists public.biz_subscriptions (
  id                         uuid primary key default gen_random_uuid(),
  workspace_id               uuid not null references public.biz_workspaces (id) on delete cascade,
  software_id                uuid not null,
  -- Client-generated key so a double click or a resubmitted form can't create a second row.
  idempotency_key            text unique check (char_length(idempotency_key) between 16 and 64),
  plan_name                  text check (char_length(plan_name) <= 80),
  -- What one billing period costs in total. Null when the price isn't known yet.
  price_minor                bigint check (price_minor >= 0 and price_minor < 10000000000000),
  currency                   char(3) not null check (currency ~ '^[A-Z]{3}$'),
  -- per_seat: the price covers purchased_seats seats, so cost per seat = price / seats.
  pricing_model              text not null default 'flat' check (pricing_model in ('flat', 'per_seat')),
  billing_interval           text not null check (billing_interval in ('monthly', 'quarterly', 'yearly', 'custom')),
  custom_interval_count      integer check (custom_interval_count between 1 and 120),
  custom_interval_unit       text check (custom_interval_unit in ('day', 'week', 'month', 'year')),
  start_date                 date,
  next_renewal_date          date,
  auto_renew                 boolean not null default true,
  cancellation_deadline      date,
  contract_end_date          date,
  status                     text not null default 'active' check (status in ('active', 'trial', 'paused', 'cancelled', 'expired')),
  ended_on                   date,
  purchased_seats            integer check (purchased_seats between 0 and 1000000),
  -- Seats in use as reported by someone (e.g. from the vendor's admin page), when seats aren't assigned by name.
  reported_assigned_seats    integer check (reported_assigned_seats between 0 and 1000000),
  -- A short label such as "Company Visa ••4242". Never a full card number (checked in the app).
  payment_method             text check (char_length(payment_method) <= 60),
  owner_person_id            uuid,
  department_id              uuid,
  contract_reference         text check (char_length(contract_reference) <= 120),
  contract_notes             text check (char_length(contract_notes) <= 2000),
  notes                      text check (char_length(notes) <= 4000),
  -- The vendor's price for a year, when known, to compare against monthly billing.
  annual_price_option_minor  bigint check (annual_price_option_minor >= 0 and annual_price_option_minor < 10000000000000),
  -- Reminder windows for this subscription; null uses the workspace default.
  reminder_days              integer[] check (reminder_days is null or (cardinality(reminder_days) <= 6 and 0 < all (reminder_days) and 366 > all (reminder_days))),
  renewal_decision           text not null default 'undecided' check (renewal_decision in ('undecided', 'renew', 'renegotiate', 'cancel')),
  renewal_owner_person_id    uuid,
  renewal_notes              text check (char_length(renewal_notes) <= 2000),
  archived_at                timestamptz,
  created_by                 uuid references auth.users (id) on delete set null,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  unique (workspace_id, id),
  constraint biz_subscriptions_custom_interval check ((billing_interval = 'custom') = (custom_interval_count is not null and custom_interval_unit is not null)),
  constraint biz_subscriptions_seats check (reported_assigned_seats is null or purchased_seats is null or reported_assigned_seats <= purchased_seats),
  foreign key (workspace_id, software_id) references public.biz_software (workspace_id, id),
  foreign key (workspace_id, owner_person_id) references public.biz_people (workspace_id, id) on delete set null (owner_person_id),
  foreign key (workspace_id, renewal_owner_person_id) references public.biz_people (workspace_id, id) on delete set null (renewal_owner_person_id),
  foreign key (workspace_id, department_id) references public.biz_departments (workspace_id, id) on delete set null (department_id)
);
create index if not exists biz_subscriptions_software_idx on public.biz_subscriptions (workspace_id, software_id);
create index if not exists biz_subscriptions_renewal_idx on public.biz_subscriptions (workspace_id, next_renewal_date) where archived_at is null;

-- Price and billing terms over time: one row when a subscription is created and
-- one whenever its price, currency, interval, pricing model or seat count changes.
create table if not exists public.biz_cost_history (
  id                     uuid primary key default gen_random_uuid(),
  workspace_id           uuid not null references public.biz_workspaces (id) on delete cascade,
  subscription_id        uuid not null,
  price_minor            bigint,
  currency               char(3) not null,
  pricing_model          text not null,
  billing_interval       text not null,
  custom_interval_count  integer,
  custom_interval_unit   text,
  purchased_seats        integer,
  effective_from         date not null,
  reason                 text check (char_length(reason) <= 200),
  recorded_by            uuid references auth.users (id) on delete set null,
  recorded_at            timestamptz not null default now(),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade
);
create index if not exists biz_cost_history_sub_idx on public.biz_cost_history (subscription_id, effective_from);

-- Money actually paid, as recorded by the team (a renewal marked paid, or an invoice entered by hand).
create table if not exists public.biz_payments (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.biz_workspaces (id) on delete cascade,
  subscription_id  uuid not null,
  amount_minor     bigint not null check (amount_minor >= 0 and amount_minor < 10000000000000),
  currency         char(3) not null check (currency ~ '^[A-Z]{3}$'),
  paid_on          date not null,
  reference        text check (char_length(reference) <= 120),
  notes            text check (char_length(notes) <= 500),
  source           text not null default 'manual' check (source in ('manual', 'renewal')),
  created_by       uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade
);
create index if not exists biz_payments_ws_idx on public.biz_payments (workspace_id, paid_on);

-- What happened at each renewal date. One outcome per subscription and date.
create table if not exists public.biz_renewal_events (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.biz_workspaces (id) on delete cascade,
  subscription_id    uuid not null,
  renewal_date       date not null,
  outcome            text not null check (outcome in ('renewed', 'renegotiated', 'cancelled')),
  amount_minor       bigint check (amount_minor >= 0),
  currency           char(3) not null,
  new_renewal_date   date,
  payment_id         uuid references public.biz_payments (id) on delete set null,
  notes              text check (char_length(notes) <= 1000),
  decided_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  unique (subscription_id, renewal_date),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade
);

-- ─── Licenses ────────────────────────────────────────────────────────────────

create table if not exists public.biz_seat_assignments (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.biz_workspaces (id) on delete cascade,
  subscription_id  uuid not null,
  person_id        uuid not null,
  note             text check (char_length(note) <= 200),
  assigned_at      timestamptz not null default now(),
  assigned_by      uuid references auth.users (id) on delete set null,
  released_at      timestamptz,
  released_by      uuid references auth.users (id) on delete set null,
  constraint biz_seat_release check (released_at is null or released_at >= assigned_at),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade,
  foreign key (workspace_id, person_id) references public.biz_people (workspace_id, id) on delete cascade
);
create unique index if not exists biz_seat_active_idx on public.biz_seat_assignments (subscription_id, person_id) where released_at is null;
create index if not exists biz_seat_ws_idx on public.biz_seat_assignments (workspace_id, subscription_id);

-- ─── Reminders and notifications ─────────────────────────────────────────────

-- One row per reminder that fired, so the same reminder is never created twice.
create table if not exists public.biz_reminders (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.biz_workspaces (id) on delete cascade,
  subscription_id  uuid not null,
  kind             text not null check (kind in ('renewal', 'cancellation_deadline')),
  due_date         date not null,
  days_before      integer not null check (days_before between 0 and 365),
  created_at       timestamptz not null default now(),
  unique (subscription_id, kind, due_date, days_before),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade
);

create table if not exists public.biz_notifications (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  kind          text not null check (char_length(kind) <= 40),
  title         text not null check (char_length(title) <= 200),
  body          text check (char_length(body) <= 1000),
  link          text check (link ~ '^/business(/|$)' and char_length(link) <= 300),
  dedupe_key    text not null check (char_length(dedupe_key) <= 200),
  read_at       timestamptz,
  created_at    timestamptz not null default now(),
  unique (workspace_id, user_id, dedupe_key)
);
create index if not exists biz_notifications_user_idx on public.biz_notifications (user_id, workspace_id, created_at desc);

-- ─── Savings ─────────────────────────────────────────────────────────────────

-- Opportunities found by the rules in src/lib/business/savings.ts. rule_key identifies
-- the finding (e.g. "unused_licenses:<subscription>"), so re-running the rules updates
-- a finding instead of duplicating it, and a dismissal sticks.
create table if not exists public.biz_savings_opportunities (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.biz_workspaces (id) on delete cascade,
  rule_key            text not null check (char_length(rule_key) <= 200),
  type                text not null check (type in ('unused_licenses', 'underutilized_licenses', 'overlapping_software', 'expensive_subscription',
                        'annual_billing', 'software_alternative', 'renewal_review', 'marketplace_deal')),
  subscription_id     uuid,
  software_id         uuid,
  title               text not null check (char_length(title) <= 200),
  explanation         text not null check (char_length(explanation) <= 2000),
  evidence            jsonb not null default '[]'::jsonb,
  -- Estimated monthly saving; null when there's no verified price to base it on.
  est_monthly_minor   bigint check (est_monthly_minor >= 0),
  currency            char(3),
  confidence          text not null check (confidence in ('low', 'medium', 'high')),
  recommended_action  text not null check (char_length(recommended_action) <= 500),
  deal_slug           text check (char_length(deal_slug) <= 120),
  -- open → reviewed / dismissed / actioned by people; resolved when the rule no longer finds it.
  status              text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'actioned', 'resolved')),
  decision            text check (char_length(decision) <= 1000),
  reviewed_by         uuid references auth.users (id) on delete set null,
  reviewed_at         timestamptz,
  last_detected_at    timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (workspace_id, rule_key),
  unique (workspace_id, id),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete cascade,
  foreign key (workspace_id, software_id) references public.biz_software (workspace_id, id) on delete cascade
);

-- Savings someone confirmed actually happened, with the amount they supplied.
create table if not exists public.biz_realized_savings (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.biz_workspaces (id) on delete cascade,
  opportunity_id   uuid,
  subscription_id  uuid,
  amount_minor     bigint not null check (amount_minor > 0 and amount_minor < 10000000000000),
  currency         char(3) not null check (currency ~ '^[A-Z]{3}$'),
  recurrence       text not null check (recurrence in ('one_time', 'monthly', 'yearly')),
  description      text not null check (char_length(description) between 2 and 500),
  evidence         text check (char_length(evidence) <= 1000),
  confirmed_on     date not null,
  confirmed_by     uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  foreign key (workspace_id, opportunity_id) references public.biz_savings_opportunities (workspace_id, id) on delete set null (opportunity_id),
  foreign key (workspace_id, subscription_id) references public.biz_subscriptions (workspace_id, id) on delete set null (subscription_id)
);

-- ─── Audit log ───────────────────────────────────────────────────────────────

create table if not exists public.biz_activity (
  id            bigint generated always as identity primary key,
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  actor_id      uuid references auth.users (id) on delete set null,
  actor_name    text check (char_length(actor_name) <= 120),
  action        text not null check (char_length(action) <= 60),
  entity_type   text check (char_length(entity_type) <= 40),
  entity_id     uuid,
  summary       text not null check (char_length(summary) <= 300),
  details       jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists biz_activity_ws_idx on public.biz_activity (workspace_id, created_at desc);
create index if not exists biz_activity_entity_idx on public.biz_activity (workspace_id, entity_id, created_at desc);

-- ─── Lock the tables to the server ───────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['biz_workspaces', 'biz_departments', 'biz_people', 'biz_memberships', 'biz_invitations', 'biz_vendors',
    'biz_software', 'biz_subscriptions', 'biz_cost_history', 'biz_payments', 'biz_renewal_events', 'biz_seat_assignments',
    'biz_reminders', 'biz_notifications', 'biz_savings_opportunities', 'biz_realized_savings', 'biz_activity'] loop
    execute format('alter table public.%I enable row level security', t);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;
