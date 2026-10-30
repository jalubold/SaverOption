import type { CSSProperties } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Icon } from "@/components/ui/icon";
import { seatSummary } from "@/lib/business/calc";
import { byId, pricePerPeriod, usd } from "./example-data";

/**
 * Two example notifications floating beside the hero's app picture (large screens only),
 * on the Business landing and download pages, inside their PointerTilt.
 */
export function HeroFloaters() {
  const slack = byId("slack");
  const notion = byId("notion");
  const notionSeats = seatSummary(notion);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      <div className="so-rise absolute -right-8 -top-14" style={{ "--d": "1300ms" } as CSSProperties}>
        <div data-depth style={{ "--depth": "-34px" } as CSSProperties}>
          <div
            className="so-float flex w-64 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <span className="relative">
              <SoftwareLogo name={slack.name} src={slack.logo} size={36} />
              <span className="viz-live absolute -right-1 -top-1 size-2.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-white">
                {slack.name} renews in {slack.renewsIn} days
              </span>
              <span className="block text-[11.5px] text-white/60">{pricePerPeriod(slack)} · Example reminder</span>
            </span>
          </div>
        </div>
      </div>
      <div className="so-rise absolute -left-12 bottom-28" style={{ "--d": "1550ms" } as CSSProperties}>
        <div data-depth style={{ "--depth": "40px" } as CSSProperties}>
          <div
            className="so-float flex w-72 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
            style={{ "--d": "-3s" } as CSSProperties}
          >
            <span
              className="icon-tile size-9 shrink-0 rounded-[11px]"
              style={
                {
                  "--tile-from": "#22b07d",
                  "--tile-to": "#047857",
                } as CSSProperties
              }
            >
              <Icon name="piggy" size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-white">
                {notionSeats.available} unused {notion.name} seats
              </span>
              <span className="block text-[11.5px] text-white/60">≈ {usd((notionSeats.unusedMonthly ?? 0) * 12)}/yr potential · Example</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
