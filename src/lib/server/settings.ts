import { db, dbConfigured } from "@/lib/server/db";

/**
 * Configuration the app sets up itself and keeps in the database (server-only
 * table), such as the Lemon Squeezy store, variants and webhook secret found by
 * the admin "Connect" button. Environment variables always take precedence.
 */

const TTL_MS = 30_000;
let cache: { at: number; values: Map<string, string> } | null = null;

export async function getSettings(): Promise<Map<string, string>> {
  if (!dbConfigured()) return new Map();
  if (cache && Date.now() - cache.at < TTL_MS) return cache.values;
  let values = new Map<string, string>();
  try {
    const rows = await db()<{ key: string; value: string }[]>`select key, value from app_settings`;
    values = new Map(rows.map((r) => [r.key, r.value]));
  } catch {
    // Table not there yet (migrations pending): behave as if nothing is configured.
  }
  cache = { at: Date.now(), values };
  return values;
}

export async function saveSettings(values: Record<string, string | null>): Promise<void> {
  await db().begin(async (tx) => {
    for (const [key, value] of Object.entries(values)) {
      if (value === null) await tx`delete from app_settings where key = ${key}`;
      else
        await tx`insert into app_settings (key, value) values (${key}, ${value})
          on conflict (key) do update set value = excluded.value, updated_at = now()`;
    }
  });
  cache = null;
}
