import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PromoteFlow } from "@/components/promote/promote-flow";
import { TrafficPill } from "@/components/promote/traffic-pill";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/primitives";
import { getListingPlans } from "@/lib/server/lemonsqueezy";
import { loadPromoteContext } from "@/lib/server/promote-context";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Promote your SaaS",
  description: `List your software on ${siteConfig.name}. Monthly, quarterly or yearly subscription, cancel anytime. Reviewed before it goes live.`,
  path: "/promote",
});

const steps = [
  { icon: "pen" as const, title: "Add your product", body: "Name, website and email. No account needed yet." },
  { icon: "credit-card" as const, title: "Subscribe", body: "Secure checkout by Lemon Squeezy. Cancel anytime." },
  { icon: "user" as const, title: "Finish your profile", body: "Sign in with Google to add a logo, links and details." },
  { icon: "check" as const, title: "We review it", body: "Your listing goes live once it's approved." },
];

export default async function PromotePage(props: PageProps<"/promote">) {
  const fresh = (await props.searchParams).new === "1";
  // Coming back from a cancelled checkout: pick up the saved submission this browser started.
  const [ctx, plans] = await Promise.all([loadPromoteContext({ fresh }), getListingPlans()]);

  return (
    <div className="theme-dark bg-bg text-fg">
      <section className="hero-glow border-b border-line">
        {/* Phones: intro → form → how it works. Desktop: intro and steps on the left, form on the right. */}
        <Container className="grid gap-8 pb-14 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0 lg:pb-20">
          <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
            <TrafficPill />
            <h1 className="display mt-5 text-[2.6rem] sm:text-[3.6rem]">
              Promote your SaaS on <em className="accent">{siteConfig.name}</em>
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted">
              Put your product in front of people looking for software and deals. Subscribe monthly, quarterly or yearly
              and cancel anytime — every listing is reviewed before it goes live.
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[20px] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
              <PromoteFlow mode={ctx.mode} plans={plans} resume={ctx.resume} paidId={ctx.paidId} signedIn={ctx.signedIn} fresh={fresh} heading={false} />
            </div>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint lg:sr-only">How it works</h2>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-1 xl:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3 rounded-[14px] border border-line bg-surface/60 p-4">
                  <span className="icon-tile size-9 shrink-0">
                    <Icon name={s.icon} size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-fg">
                      <span className="tabular text-faint">{i + 1}.</span> {s.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-sm text-muted">
              Already paid?{" "}
              <Link href="/dashboard" className="font-medium text-accent-ink underline-offset-2 hover:underline">
                Go to your dashboard
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
