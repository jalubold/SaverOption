import postgres from "postgres";

/**
 * Postgres (Supabase) client for server code only. Uses the pooled connection
 * string the Vercel Supabase integration sets (POSTGRES_URL). Every advertiser
 * feature checks `dbConfigured()` first and degrades gracefully without it.
 */

function connectionString(): string | null {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || null;
}

export function dbConfigured(): boolean {
  return connectionString() !== null;
}

const globalForDb = globalThis as unknown as { __saverOptionSql?: postgres.Sql };

export function db(): postgres.Sql {
  if (globalForDb.__saverOptionSql) return globalForDb.__saverOptionSql;
  const raw = connectionString();
  if (!raw) throw new Error("Database is not configured (POSTGRES_URL)");
  const url = new URL(raw);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  // Query-string extras some providers append (e.g. `supa=`, `pgbouncer=`) would be sent
  // to the server as startup parameters, so drop them and set SSL explicitly.
  url.search = "";
  const sql = postgres(url.toString(), {
    // Supabase's transaction pooler doesn't support prepared statements.
    prepare: false,
    ssl: local ? false : "require",
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    // Calendar dates (`date` columns) stay as "YYYY-MM-DD" strings instead of becoming UTC-midnight Dates.
    types: { date: { to: 1082, from: [1082], serialize: (x: string) => x, parse: (x: string) => x } },
  });
  globalForDb.__saverOptionSql = sql;
  return sql;
}
