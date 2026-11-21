/**
 * Recovering from pages whose code couldn't be downloaded. On a patchy mobile connection (or with a
 * page built by an older deployment) a client-side navigation can fail to load the next page's
 * JavaScript ("ChunkLoadError"), and the error screens used to stop there. A full page load of the
 * page the visitor was going to fixes it, so the error boundaries do that once, automatically.
 */

const LAST_NAV_KEY = "so-last-nav";
const RECOVERED_KEY = "so-recovered";

/** Code or data that couldn't be downloaded, as browsers and the bundler report it. */
export function isLoadError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null;
  const text = `${e?.name ?? ""} ${e?.message ?? ""}`;
  return /ChunkLoadError|Failed to load chunk|Loading chunk|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(text);
}

/** Notes which internal link was just followed, so a failed navigation can retry it in full. */
export function rememberNavigation(href: string): void {
  try {
    sessionStorage.setItem(LAST_NAV_KEY, JSON.stringify({ href, at: Date.now() }));
  } catch {
    // Storage blocked (private mode): recovery then reloads the current page instead.
  }
}

/**
 * Loads the page the visitor was going to (the link followed in the last 20 seconds, or else this
 * page) from scratch. Returns false, doing nothing, when that was already tried for the same page in
 * the last minute, so an error that a reload doesn't fix shows its screen instead of looping.
 */
export function recoverWithFullLoad(): boolean {
  try {
    const now = Date.now();
    const here = location.pathname + location.search + location.hash;
    const last = read(LAST_NAV_KEY);
    const target = last && now - last.at < 20_000 ? last.href : here;
    const previous = read(RECOVERED_KEY);
    if (previous && previous.href === target && now - previous.at < 60_000) return false;
    sessionStorage.setItem(RECOVERED_KEY, JSON.stringify({ href: target, at: now }));
    sessionStorage.removeItem(LAST_NAV_KEY);
    if (target === here) location.reload();
    else location.assign(target);
    return true;
  } catch {
    return false;
  }
}

function read(key: string): { href: string; at: number } | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  const value = JSON.parse(raw) as { href?: unknown; at?: unknown };
  return typeof value.href === "string" && typeof value.at === "number" ? { href: value.href, at: value.at } : null;
}
