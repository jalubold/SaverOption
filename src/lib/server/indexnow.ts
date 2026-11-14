import { siteConfig } from "@/config/site";
import { parseSent, pickIndexNowUrls, serializeSent } from "@/lib/indexnow-pick";
import { db, dbConfigured } from "@/lib/server/db";
import { INDEXNOW_SENT_KEY, getSettings, saveSettings } from "@/lib/server/settings";
import { siteUrls } from "@/lib/site-urls";

/**
 * IndexNow (Bing, Yandex, Seznam, Naver…): tells search engines which pages
 * changed, so new and updated deals are crawled within hours instead of weeks.
 * Bing's index also feeds ChatGPT search and Copilot. The key is public by
 * design: it's served at /<key>.txt (public/) so engines can confirm the site.
 */
export const INDEXNOW_KEY = "55c265383b56b634821a100e6503a700";

/**
 * Once per production deployment (whichever server starts first): submits only
 * the pages that are new or changed since the last submission (see
 * pickIndexNowUrls) — everything the first time. List pages go out when a deal
 * in them changed, and a deployment that changed no content submits nothing,
 * so search engines aren't asked to recrawl (and re-render) unchanged pages
 * after every deployment.
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

  const lastDate = (await getSettings()).get("indexnow_at")?.slice(0, 10);
  // What was submitted last time, per URL (read on its own: getSettings leaves this value out).
  const [stored] = await db()<{ value: string }[]>`select value from app_settings where key = ${INDEXNOW_SENT_KEY}`;
  const sent = parseSent(stored?.value);
  const all = await siteUrls();
  const urls = pickIndexNowUrls(all, { sent, lastDate }).slice(0, 10_000);
  if (!urls.length) {
    // Nothing new: remember the current URLs so the next deployment compares against them.
    if (!sent) await saveSettings({ [INDEXNOW_SENT_KEY]: serializeSent(all) });
    console.log("[indexnow] no new or changed pages to submit");
    return;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(siteConfig.url).host, key: INDEXNOW_KEY, keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`, urlList: urls }),
    signal: AbortSignal.timeout(10_000),
  });
  if (res.ok) {
    await saveSettings({ indexnow_at: new Date().toISOString(), [INDEXNOW_SENT_KEY]: serializeSent(all) });
    console.log(`[indexnow] submitted ${urls.length} URLs (${res.status})`);
  } else {
    console.error(`[indexnow] submission refused (${res.status})`);
  }
}
