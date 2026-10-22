import Link from "next/link";
import { formatPlanRate, listingPlans, withPrices } from "@/config/listing-plans";
import { DashboardShell, fmtDate, Panel } from "@/components/advertiser/dashboard-shell";
import { ConnectLemonSqueezy } from "@/components/advertiser/setup-forms";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { db, dbConfigured } from "@/lib/server/db";
import { checkoutMode, liveCheckoutEnabled, lsApiKey, lsCatalog, webhookSecret } from "@/lib/server/lemonsqueezy";
import { getSettings } from "@/lib/server/settings";
import { authConfigured, googleSignInEnabled, requireAdmin, storageAdmin } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

// The Connect action calls the Lemon Squeezy API several times; give it room beyond the default.
export const maxDuration = 60;

export const metadata = pageMetadata({ title: "Setup", description: "Integration status.", path: "/admin/setup", noIndex: true });

const modeText = {
  live: "Live checkout (real payments)",
  test: "Test checkout (no real charges)",
  disabled: "Closed: submissions are saved, no payment taken",
  unconfigured: "Closed: Lemon Squeezy not connected yet",
} as const;

/** Integration checklist for admins: what's connected, what's missing, and the one-click Lemon Squeezy setup. */
export default async function AdminSetupPage() {
  const user = await requireAdmin();
  let migrations: string[] | null = null;
  if (dbConfigured()) {
    try {
      migrations = (await db()<{ name: string }[]>`select name from schema_migrations order by name`).map((r) => r.name);
    } catch {
      migrations = null;
    }
  }
  const [catalog, secret, saved, visitorMode, adminMode, google] = await Promise.all([
    lsCatalog(),
    webhookSecret(),
    getSettings(),
    checkoutMode({ admin: false }),
    checkoutMode({ admin: true }),
    googleSignInEnabled(),
  ]);
  const hasKey = Boolean(lsApiKey());
  const variantsOk = listingPlans.every((p) => catalog.variants[p.id]);
  const plans = withPrices(catalog.prices);
  const lsReady = hasKey && Boolean(catalog.storeId) && variantsOk && Boolean(secret);
  const setupAt = saved.get("ls_setup_at");
  const upgradeError = saved.get("ls_upgrade_error");

  return (
    <DashboardShell email={user.email} admin section="setup">
      <h1 className="display text-[2.4rem] sm:text-[3rem]">
        Integration <em className="accent">setup</em>
      </h1>
      <p className="mt-1 text-[15px] text-muted">What&apos;s connected and what still needs a step from you. Secrets are never shown here.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Database & accounts (Supabase)">
          <ul className="space-y-3">
            <Check ok={dbConfigured()} label="Database connected" hint="Vercel → Storage → Supabase → Connect to this project." />
            <Check
              ok={Boolean(migrations?.length)}
              label="Tables created"
              hint="Created automatically on the next deploy after the database is connected."
              detail={migrations?.length ? `${migrations.length} migration${migrations.length === 1 ? "" : "s"} applied` : undefined}
            />
            <Check ok={authConfigured()} label="Accounts (Supabase Auth)" hint="Set by the Supabase integration." />
            <Check ok={storageAdmin() !== null} label="Logo uploads (Storage)" hint="Needs SUPABASE_SERVICE_ROLE_KEY (set by the integration)." />
            <Check
              ok={google}
              label="Google sign-in"
              detail={google ? "Advertisers sign in with Google; no emails needed." : undefined}
              hint="Supabase → Authentication → Sign In / Providers → Google: turn it on and paste the Client ID and Secret from Google Cloud. Until then, nobody can sign in."
            />
          </ul>
        </Panel>

        <Panel title="Payments (Lemon Squeezy)">
          <ul className="space-y-3">
            <Check ok={hasKey} label="API key" hint="Add LEMONSQUEEZY_API_KEY in Vercel (test-mode key for now), then redeploy." />
            <Check ok={Boolean(catalog.storeId)} label="Store" detail={saved.get("ls_store_name") ?? (catalog.storeId ? `#${catalog.storeId}` : undefined)} />
            <Check
              ok={variantsOk}
              label="Subscription plans"
              detail={
                variantsOk
                  ? `${saved.get("ls_product_name") ? `"${saved.get("ls_product_name")}": ` : ""}${plans.map((p) => `${p.name} ${formatPlanRate(p)} → #${catalog.variants[p.id]}`).join(" · ")}`
                  : undefined
              }
              hint="One subscription product with variants billed every month, every 3 months and every year. Prices are read from Lemon Squeezy."
            />
            <Check
              ok={Boolean(secret)}
              label="Webhook"
              detail={saved.get("ls_webhook_url") ? `${saved.get("ls_webhook_url")}${saved.get("ls_webhook_test_mode") === "true" ? " (test mode)" : ""}` : undefined}
            />
          </ul>
          <div className="mt-5 border-t border-line pt-5">
            {upgradeError && !variantsOk && (
              <p className="mb-3 rounded-lg border border-warn/40 bg-warn-soft px-3 py-2 text-[13px] text-fg">
                Automatic switch to the subscription plans didn&apos;t work: {upgradeError}
              </p>
            )}
            <ConnectLemonSqueezy connected={lsReady} disabled={!hasKey || !dbConfigured()} />
            {setupAt && <p className="mt-2 text-xs text-faint">Last connected {fmtDate(new Date(setupAt))}.</p>}
          </div>
        </Panel>

        <Panel title="Checkout status" className="lg:col-span-2">
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Visitors</dt>
              <dd className="mt-1 text-fg">{modeText[visitorMode]}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">You (admin)</dt>
              <dd className="mt-1 text-fg">{modeText[adminMode]}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Live payments</dt>
              <dd className="mt-1 text-fg">
                {liveCheckoutEnabled() ? "On" : "Off: waiting for Lemon Squeezy's written approval"}
              </dd>
            </div>
          </dl>
          <Link href="/promote" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink hover:underline">
            Try the flow <Icon name="arrow-right" size={14} />
          </Link>
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Check({ ok, label, hint, detail }: { ok: boolean | null; label: string; hint?: string; detail?: string }) {
  return (
    <li className="flex gap-3">
      <span
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          ok === true ? "bg-success/15 text-success" : ok === false ? "bg-warn-soft text-warn" : "bg-subtle text-muted",
        )}
      >
        <Icon name={ok === true ? "check" : ok === false ? "alert" : "info"} size={12} />
      </span>
      <span className="min-w-0 text-sm">
        <span className="font-medium text-fg">{label}</span>
        {detail && <span className="block text-[13px] text-muted [overflow-wrap:anywhere]">{detail}</span>}
        {ok !== true && hint && <span className="block text-[13px] leading-snug text-faint">{hint}</span>}
      </span>
    </li>
  );
}
