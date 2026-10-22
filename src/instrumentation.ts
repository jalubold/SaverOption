/**
 * Runs once when a server instance starts. A production site still connected to
 * the old one-time Lemon Squeezy product reconnects itself to the subscription
 * plans here (see upgradeLegacyCatalog), so the first visitor already sees them.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.VERCEL_ENV !== "production") return;
  const { upgradeLegacyCatalog } = await import("@/lib/server/lemonsqueezy-setup");
  // Never hold up start-up for long; a checkout retries it.
  const timeout = new Promise<false>((done) => setTimeout(() => done(false), 20_000));
  await Promise.race([upgradeLegacyCatalog(), timeout]).catch((err: unknown) => {
    console.error("[ls-setup] automatic reconnect failed:", err instanceof Error ? err.message : err);
  });
}
