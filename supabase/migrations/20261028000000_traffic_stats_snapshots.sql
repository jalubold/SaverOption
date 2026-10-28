-- Saver Option: the last good /stats numbers for each range and filter set, so the
-- page keeps showing them (labelled with when they were fetched) while Vercel's Web
-- Analytics API is rate limiting or unavailable. Server-only: RLS on with no
-- policies, and no privileges for the API roles.

create table if not exists public.traffic_stats_snapshots (
  query_key   text primary key check (query_key ~ '^[0-9a-f]{64}$'),
  stats       jsonb not null,
  fetched_at  timestamptz not null
);

create index if not exists traffic_stats_snapshots_fetched_at on public.traffic_stats_snapshots (fetched_at);

alter table public.traffic_stats_snapshots enable row level security;
revoke all on public.traffic_stats_snapshots from anon, authenticated;
