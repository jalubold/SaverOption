import { siteConfig } from "@/config/site";
import { db, dbConfigured } from "@/lib/server/db";
import { getSettings, saveSettings } from "@/lib/server/settings";
import { siteUrls } from "@/lib/site-urls";

/**
 * IndexNow (Bing, Yandex, Seznam, Naver…): tells search engines which pages
 * changed, so new and updated deals are crawled within hours instead of weeks.
 * Bing's index also feeds ChatGPT search and Copilot. The key is public by
 * design: it's served at /<key>.txt (public/) so engines can confirm the site.
 */
export const INDEXNOW_KEY = "55c265383b56b634821a100e6503a700";

/**
 * Once per production deployment (whichever server starts first): submits the
 * pages that changed since the last submission — everything the first time —
 * plus the list pages, which change whenever a deal does.
 */
export async function submitIndexNow(): Promise<void> {
  const deployment = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA;
  if (process.env.VERCEL_ENV !== "production" || !deployment || !dbConfigured() || !siteConfig.url.startsWith("https://")) return;

  // Claim this deployment atomically, so parallel cold starts submit once.
  const claimed = await db()`
    insert into app_settings (key, value) values ('indexnow_deployment', ${deployment})
    on conflict (key) do update set value = excluded.value, updated_at = now()
      where app_settings.value is distinct from excluded.value
    returning key`;
  if (!claimed.length) return;

  const last = (await getSettings()).get("indexnow_at")?.slice(0, 10);
  const isList = (url: string) => {
    const path = new URL(url).pathname;
    return path === "/" || path === "/deals" || path === "/categories" || path.startsWith("/categories/") || path.startsWith("/for/");
  };
  const urls = (await siteUrls())
    .filter((u) => !last || isList(u.url) || (u.lastModified !== undefined && u.lastModified >= last))
    .map((u) => u.url)
    .slice(0, 10_000);
  if (!urls.length) return;

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(siteConfig.url).host, key: INDEXNOW_KEY, keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`, urlList: urls }),
    signal: AbortSignal.timeout(10_000),
  });
  if (res.ok) {
    await saveSettings({ indexnow_at: new Date().toISOString() });
    console.log(`[indexnow] submitted ${urls.length} URLs (${res.status})`);
  } else {
    console.error(`[indexnow] submission refused (${res.status})`);
  }
}
