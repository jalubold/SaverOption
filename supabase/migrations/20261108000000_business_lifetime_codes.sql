-- Saver Option Business: lifetime access from AppSumo codes. A buyer gets a
-- code from AppSumo and redeems it on /business/redeem: one code gives a
-- workspace Pro for life, a second code on the same workspace gives Business.
--
-- Only a SHA-256 hash of each code is stored, so a database export or log never
-- reveals codes that haven't been redeemed yet; code_hint (the last four
-- characters) is kept for support. Codes are imported by an admin on
-- /admin/codes and deactivated there when AppSumo refunds or withdraws them.
-- Like the rest of biz_*, this table is read and written only by the server.

create table if not exists public.biz_lifetime_codes (
  code_sha256   text primary key check (code_sha256 ~ '^[0-9a-f]{64}$'),
  code_hint     text not null check (char_length(code_hint) between 1 and 8),
  source        text not null default 'appsumo' check (source in ('appsumo')),
  batch         text check (char_length(batch) <= 80),
  imported_at   timestamptz not null default now(),
  -- Set once, when the code is redeemed. A code stays used even if its workspace is deleted.
  workspace_id  uuid references public.biz_workspaces (id) on delete set null,
  redeemed_by   uuid,
  redeemed_at   timestamptz,
  -- Deactivated codes can't be redeemed and no longer give access.
  revoked_at    timestamptz,
  revoke_note   text check (char_length(revoke_note) <= 200),
  check (redeemed_at is null or redeemed_by is not null)
);

create index if not exists biz_lifetime_codes_ws_idx
  on public.biz_lifetime_codes (workspace_id)
  where redeemed_at is not null and revoked_at is null;

do $$
begin
  alter table public.biz_lifetime_codes enable row level security;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.biz_lifetime_codes from anon, authenticated;
  end if;
end $$;
