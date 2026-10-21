// Applies supabase/migrations/*.sql to the configured database before each build,
// each file once (recorded in public.schema_migrations). Skips when no database
// is configured, so local builds and deploys without Supabase are unaffected.
// A failed migration fails the build, leaving the previous deployment live.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const raw = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;
if (!raw || process.env.SKIP_DB_MIGRATIONS === "1") {
  console.log("[migrate] no database configured, skipping");
  process.exit(0);
}

const url = new URL(raw);
const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
url.search = "";
// Works over Supabase's transaction pooler: no prepared statements, and the lock is
// transaction-scoped so concurrent builds apply each file exactly once.
const sql = postgres(url.toString(), { ssl: local ? false : "require", max: 1, prepare: false, connect_timeout: 15, onnotice: () => {} });
const LOCK = 7_272_027;
const dir = join(process.cwd(), "supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

try {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${LOCK})`;
    await tx`create table if not exists public.schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
    await tx`alter table public.schema_migrations enable row level security`;
    await tx.unsafe(`do $$ begin
      if exists (select 1 from pg_roles where rolname = 'anon') then
        revoke all on public.schema_migrations from anon, authenticated;
      end if;
    end $$`);
  });
  let applied = 0;
  for (const file of files) {
    await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(${LOCK})`;
      const [done] = await tx`select 1 from public.schema_migrations where name = ${file}`;
      if (done) return;
      await tx.unsafe(readFileSync(join(dir, file), "utf8"));
      await tx`insert into public.schema_migrations (name) values (${file})`;
      applied++;
      console.log(`[migrate] applied ${file}`);
    });
  }
  console.log(`[migrate] database up to date (${applied} applied, ${files.length} total)`);
  await sql.end();
} catch (err) {
  console.error("[migrate] failed:", err instanceof Error ? err.message : err);
  await sql.end({ timeout: 1 }).catch(() => {});
  process.exit(1);
}
