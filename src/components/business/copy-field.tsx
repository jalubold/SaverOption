"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

/** A read-only value (a URL) with a copy button; selects the text if the clipboard is unavailable. */
export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-stretch overflow-hidden rounded-[10px] border border-line-strong">
      <code aria-label={label} className="flex min-w-0 flex-1 select-all items-center overflow-x-auto whitespace-nowrap px-3 py-2 font-mono text-[13px] text-fg">
        {value}
      </code>
      <button
        type="button"
        onClick={async (e) => {
          const box = e.currentTarget.previousElementSibling;
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            if (box) window.getSelection()?.selectAllChildren(box);
          }
        }}
        className="inline-flex shrink-0 items-center gap-1.5 border-l border-line-strong bg-subtle px-3 text-[13px] font-medium text-fg hover:text-accent-ink"
      >
        <Icon name={copied ? "check" : "copy"} size={14} />
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
