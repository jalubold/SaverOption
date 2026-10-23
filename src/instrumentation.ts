/**
 * Runs once when a server instance starts, in production only:
 *  - a site still connected to the old one-time Lemon Squeezy product reconnects
 *    itself to the subscription plans (see upgradeLegacyCatalog);
 *  - the first server of a new deployment tells IndexNow which pages changed.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.VERCEL_ENV !== "production") return;
  const [{ upgradeLegacyCatalog }, { submitIndexNow }] = await Promise.all([
    import("@/lib/server/lemonsqueezy-setup"),
    import("@/lib/server/indexnow"),
  ]);
  // Never hold up start-up for long; a checkout retries the reconnect, the next deployment the submission.
  const timeout = new Promise<false>((done) => setTimeout(() => done(false), 20_000));
  await Promise.all([
    Promise.race([upgradeLegacyCatalog(), timeout]).catch((err: unknown) => {
      console.error("[ls-setup] automatic reconnect failed:", err instanceof Error ? err.message : err);
    }),
    Promise.race([submitIndexNow(), timeout]).catch((err: unknown) => {
      console.error("[indexnow] submission failed:", err instanceof Error ? err.message : err);
    }),
  ]);
}
