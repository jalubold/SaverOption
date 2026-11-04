"use client";

import { useState } from "react";
import { cn } from "@/components/ui/primitives";
import { APPEARANCE_COOKIE, type Appearance } from "@/lib/business/appearance";

const options: { value: Appearance; label: string }[] = [
  { value: "system", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/** A tiny window in one look, as macOS System Settings draws its Appearance choices. */
function Thumb({ look }: { look: "light" | "dark" }) {
  const c =
    look === "light"
      ? { side: "#e6e6ea", body: "#ffffff", line: "#d9d9de", bar: "#8453ed" }
      : { side: "#262628", body: "#2c2c2e", line: "#48484c", bar: "#9169f5" };
  return (
    <span className="absolute inset-0 flex" style={{ background: c.body }}>
      <span className="flex w-[30%] flex-col gap-1 p-1.5" style={{ background: c.side }}>
        <span className="h-1 w-3/4 rounded-full" style={{ background: c.bar }} />
        <span className="h-1 w-1/2 rounded-full" style={{ background: c.line }} />
        <span className="h-1 w-2/3 rounded-full" style={{ background: c.line }} />
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-2">
        <span className="h-1.5 w-1/2 rounded-full" style={{ background: c.line }} />
        <span className="h-4 rounded" style={{ background: c.side }} />
        <span className="h-1 w-2/3 rounded-full" style={{ background: c.line }} />
      </span>
    </span>
  );
}

/** Saves the choice for this browser and shows it at once (no cookie = follow the device). */
function apply(v: Appearance) {
  document.cookie = v === "system" ? `${APPEARANCE_COOKIE}=; path=/; max-age=0; samesite=lax` : `${APPEARANCE_COOKIE}=${v}; path=/; max-age=31536000; samesite=lax`;
  const root = document.documentElement;
  if (v === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", v);
}

/**
 * Light, dark, or Auto (follows the device, the default). Saved for this browser in a cookie, which
 * the app reads before it paints; the change shows at once.
 */
export function AppearancePicker({ initial }: { initial: Appearance }) {
  const [value, setValue] = useState<Appearance>(initial);
  const pick = (v: Appearance) => {
    setValue(v);
    apply(v);
  };
  return (
    <div role="radiogroup" aria-label="Appearance" className="grid max-w-md grid-cols-3 gap-4" data-appearance>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => pick(o.value)}
            className="group flex flex-col items-center gap-2 text-[12.5px] outline-none"
            data-appearance-option={o.value}
          >
            <span
              className={cn(
                "relative block aspect-[16/10] w-full overflow-hidden rounded-lg ring-1 ring-[var(--mac-hairline)] transition-shadow",
                on ? "shadow-[0_0_0_3px_var(--accent)]" : "group-hover:shadow-[0_0_0_3px_var(--mac-select)]",
                "group-focus-visible:shadow-[0_0_0_3px_var(--accent)]",
              )}
            >
              {o.value === "system" ? (
                <>
                  <Thumb look="light" />
                  <span className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">
                    <Thumb look="dark" />
                  </span>
                </>
              ) : (
                <Thumb look={o.value} />
              )}
            </span>
            <span className={cn(on ? "font-semibold text-fg" : "text-muted")}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
