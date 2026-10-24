-- Saver Option Business, part 2: where each subscription came from, CSV import
-- history, MCP connections (OAuth 2.1 for remote AI clients) and saved reports.
-- Like the rest of biz_*, these tables are read and written only by the server.

-- ─── Subscription provenance ─────────────────────────────────────────────────

alter table public.biz_subscriptions add column if not exists source text not null default 'manual';
alter table public.biz_subscriptions add column if not exists last_verified_on date;
alter table public.biz_subscriptions add column if not exists import_job_id uuid;
do $$ begin
  alter table public.biz_subscriptions add constraint biz_subscriptions_source check (source in ('manual', 'csv_import', 'mcp', 'assistant', 'demo'));
exception when duplicate_object then null;
end $$;
update public.biz_subscriptions s set source = 'demo' from public.biz_workspaces w where w.id = s.workspace_id and w.is_demo and s.source = 'manual';

-- ─── CSV imports ─────────────────────────────────────────────────────────────

create table if not exists public.biz_import_jobs (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null references public.biz_workspaces (id) on delete cascade,
  file_name      text check (char_length(file_name) <= 200),
  -- The file's SHA-256, so importing the same file again can be recognised.
  file_sha256    text not null check (file_sha256 ~ '^[0-9a-f]{64}$'),
  row_count      integer not null default 0 check (row_count >= 0),
  created_count  integer not null default 0 check (created_count >= 0),
  skipped_count  integer not null default 0 check (skipped_count >= 0),
  failed_count   integer not null default 0 check (failed_count >= 0),
  -- Which CSV column fed which field, and per-row problems (capped in the app).
  mapping        jsonb not null default '{}'::jsonb,
  issues         jsonb not null default '[]'::jsonb,
  created_by     uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  unique (workspace_id, id)
);
create index if not exists biz_import_jobs_ws_idx on public.biz_import_jobs (workspace_id, created_at desc);
create index if not exists biz_import_jobs_hash_idx on public.biz_import_jobs (workspace_id, file_sha256);

do $$ begin
  alter table public.biz_subscriptions add constraint biz_subscriptions_import_job_fk
    foreign key (workspace_id, import_job_id) references public.biz_import_jobs (workspace_id, id) on delete set null (import_job_id);
exception when duplicate_object then null;
end $$;

-- ─── MCP: OAuth 2.1 authorization for remote AI clients ──────────────────────

-- Clients register themselves (RFC 7591 dynamic client registration). Public
-- clients (no secret) are the norm; PKCE S256 is required for every flow.
create table if not exists public.biz_oauth_clients (
  id                          text primary key check (char_length(id) between 16 and 80),
  client_name                 text check (char_length(client_name) <= 200),
  client_uri                  text check (char_length(client_uri) <= 500),
  redirect_uris               text[] not null check (cardinality(redirect_uris) between 1 and 10),
  token_endpoint_auth_method  text not null default 'none' check (token_endpoint_auth_method in ('none', 'client_secret_post', 'client_secret_basic')),
  client_secret_hash          text check (client_secret_hash ~ '^[0-9a-f]{64}$'),
  software_id                 text check (char_length(software_id) <= 200),
  software_version            text check (char_length(software_version) <= 100),
  created_at                  timestamptz not null default now(),
  last_used_at                timestamptz,
  constraint biz_oauth_clients_secret check ((token_endpoint_auth_method = 'none') = (client_secret_hash is null))
);

-- A connection: one person's consent for one client to reach one workspace with
-- the scopes they chose. Revoking it ends every token issued under it.
create table if not exists public.biz_oauth_grants (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  client_id     text not null references public.biz_oauth_clients (id) on delete cascade,
  scopes        text[] not null check (cardinality(scopes) between 1 and 5),
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz,
  unique (workspace_id, id)
);
create index if not exists biz_oauth_grants_ws_idx on public.biz_oauth_grants (workspace_id, created_at desc);
create index if not exists biz_oauth_grants_user_idx on public.biz_oauth_grants (user_id);

-- Authorization codes and tokens are stored only as SHA-256 hashes.
create table if not exists public.biz_oauth_codes (
  code_hash       text primary key check (code_hash ~ '^[0-9a-f]{64}$'),
  grant_id        uuid not null references public.biz_oauth_grants (id) on delete cascade,
  redirect_uri    text not null check (char_length(redirect_uri) <= 500),
  code_challenge  text not null check (char_length(code_challenge) between 43 and 128),
  resource        text check (char_length(resource) <= 500),
  expires_at      timestamptz not null,
  used_at         timestamptz
);

create table if not exists public.biz_oauth_tokens (
  token_hash   text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  grant_id     uuid not null references public.biz_oauth_grants (id) on delete cascade,
  kind         text not null check (kind in ('access', 'refresh')),
  expires_at   timestamptz not null,
  -- Set when a refresh token is exchanged; reusing it afterwards revokes the grant.
  used_at      timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists biz_oauth_tokens_grant_idx on public.biz_oauth_tokens (grant_id);

-- ─── Saved reports ───────────────────────────────────────────────────────────

create table if not exists public.biz_reports (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.biz_workspaces (id) on delete cascade,
  kind          text not null check (kind in ('savings')),
  title         text not null check (char_length(title) between 1 and 200),
  -- A snapshot of the figures when it was generated (they don't change later).
  content       jsonb not null,
  source        text not null default 'app' check (source in ('app', 'mcp')),
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (workspace_id, id)
);
create index if not exists biz_reports_ws_idx on public.biz_reports (workspace_id, created_at desc);

-- ─── Lock the tables to the server ───────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['biz_import_jobs', 'biz_oauth_clients', 'biz_oauth_grants', 'biz_oauth_codes', 'biz_oauth_tokens', 'biz_reports'] loop
    execute format('alter table public.%I enable row level security', t);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;
