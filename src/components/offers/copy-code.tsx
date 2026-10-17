"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

/** Promo code with a copy button. Falls back to selecting the text if the clipboard is unavailable. */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const box = e.currentTarget.previousElementSibling;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (box) window.getSelection()?.selectAllChildren(box);
    }
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-[10px] border border-dashed border-line-strong">
      <code className="flex flex-1 select-all items-center px-3 font-mono text-sm font-semibold tracking-wider text-fg">{code}</code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 border-l border-dashed border-line-strong bg-subtle px-3 text-[13px] font-medium text-fg hover:text-accent-ink"
      >
        <Icon name={copied ? "check" : "tag"} size={14} />
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
