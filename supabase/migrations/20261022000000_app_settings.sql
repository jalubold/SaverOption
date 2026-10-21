-- Saver Option: settings the app configures itself (e.g. the Lemon Squeezy store,
-- variants and webhook signing secret found by the admin "Connect" button).
-- Server-only: RLS on with no policies, and no privileges for the API roles.

create table if not exists public.app_settings (
  key         text primary key check (key ~ '^[a-z0-9_]{1,64}$'),
  value       text not null,
  updated_at  timestamptz not null default now()
);

alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;
