import { Sparkline } from "@/components/business/charts";
import { LogoStack } from "@/components/business/software-logo";
import { byId, monthlyTotal, runRateTrend, trackable, usd } from "./example-data";
import { AppWindow, ExampleLabel, SubRow } from "./preview-parts";
import { IconTile } from "./sections";

/** The right-hand side of /business/login and /business/signup: what you get, with a small example preview. */
export function SignInAside() {
  const points = [
    { icon: "calendar" as const, tone: "violet" as const, text: "In-app reminders before renewals and cancellation deadlines" },
    { icon: "key" as const, tone: "aqua" as const, text: "Seats purchased versus assigned, and what unused seats cost" },
    { icon: "piggy" as const, tone: "orange" as const, text: "Savings opportunities with the evidence behind each one" },
  ];
  return (
    <aside aria-labelledby="signin-aside-heading" className="min-w-0">
      <div className="flex flex-wrap items-center gap-3">
        <LogoStack items={trackable.slice(0, 6)} max={6} size={30} />
        <span className="text-[13px] text-muted">Slack, Figma, AWS — and anything else you pay for</span>
      </div>
      <h2 id="signin-aside-heading" className="display mt-6 text-[2.2rem] sm:text-[2.8rem]">
        Your software spend, <em className="accent">in one place.</em>
      </h2>
      <ul className="mt-6 space-y-3.5">
        {points.map((p) => (
          <li key={p.text} className="flex items-center gap-3 text-[15px] text-fg">
            <IconTile icon={p.icon} tone={p.tone} size={34} />
            {p.text}
          </li>
        ))}
      </ul>
      <AppWindow path="/business/dashboard" className="mt-8 hidden sm:block">
        <div className="p-4">
          <ExampleLabel className="mb-3" />
          <div className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="biz-card px-3.5 py-3">
              <p className="text-[11.5px] font-medium text-muted">Monthly software spend</p>
              <p className="tabular mt-1 text-[1.3rem] font-semibold leading-tight tracking-tight text-heading">{usd(monthlyTotal)}</p>
              <div className="mt-1">
                <Sparkline values={runRateTrend} label="Example: monthly run-rate over the last 12 months, rising" />
              </div>
            </div>
            <div className="biz-card px-3.5 py-1">
              <ul className="divide-y divide-line">
                {["linear", "slack", "figma"].map((id) => (
                  <SubRow key={id} s={byId(id)} compact />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AppWindow>
    </aside>
  );
}
