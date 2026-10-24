"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { askAssistantAction, confirmAssistantChangeAction } from "@/app/business/actions/assistant";
import type { AssistantPreview } from "@/lib/server/business/assistant";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  toolsUsed?: { name: string; ok: boolean }[];
  previews?: (AssistantPreview & { state: "pending" | "saving" | "saved" | "discarded" | "failed"; result?: string; url?: string | null })[];
  refused?: boolean;
}

const toolLabels: Record<string, string> = {
  list_subscriptions: "subscriptions",
  get_subscription_details: "subscription details",
  get_spend_summary: "spend summary",
  get_upcoming_renewals: "upcoming renewals",
  get_spending_by_category: "spend by category",
  get_spending_by_vendor: "spend by vendor",
  find_duplicate_tools: "possible duplicates",
  get_savings_opportunities: "savings opportunities",
  analyze_saas_spending: "spending analysis",
  compare_software_alternatives: "alternatives",
  search_deals: "Saver Option deals",
  get_deal_details: "deal details",
  get_deals_for_my_software: "deals for your tools",
  generate_savings_report: "savings report",
  create_subscription: "new subscription (preview)",
  update_subscription: "subscription change (preview)",
};

/** Plain text with paragraphs, "- " bullets, **bold** and links; no HTML from the model is rendered. */
function RichText({ text }: { text: string }) {
  const inline = (s: string, key: string): ReactNode[] => {
    const parts = s.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
    return parts.map((p, i) => {
      if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={`${key}-${i}`}>{p.slice(2, -2)}</strong>;
      if (/^https?:\/\//.test(p)) {
        let href = p.replace(/[.,;:]+$/, "");
        const trail = p.slice(href.length);
        try {
          const u = new URL(href);
          if (typeof window !== "undefined" && u.origin === window.location.origin) href = u.pathname + u.search + u.hash;
        } catch {}
        return (
          <Fragment key={`${key}-${i}`}>
            {href.startsWith("/") ? (
              <Link href={href} className="text-accent-ink underline underline-offset-2">
                {href}
              </Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-accent-ink underline underline-offset-2">
                {href}
              </a>
            )}
            {trail}
          </Fragment>
        );
      }
      return <Fragment key={`${key}-${i}`}>{p}</Fragment>;
    });
  };
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {inline(b.replace(/^#+\s*/gm, ""), String(i))}
          </p>
        );
      })}
    </div>
  );
}

function show(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object" && v !== null && "display" in v) return String((v as { display: unknown }).display) + ("per" in v ? ` ${String((v as { per: unknown }).per).toLowerCase()}` : "");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function PreviewCard({ p, onConfirm, onDiscard }: { p: NonNullable<ChatMessage["previews"]>[number]; onConfirm: () => void; onDiscard: () => void }) {
  const i = (p.interpreted ?? {}) as Record<string, unknown>;
  const rows: [string, unknown][] =
    p.tool === "create_subscription"
      ? [
          ["Software", (i.software as { name?: string; existing?: boolean })?.name ? `${(i.software as { name: string }).name}${(i.software as { existing?: boolean }).existing ? "" : " (new to the inventory)"}` : null],
          ["Plan", i.plan],
          ["Price", i.price],
          ["Monthly equivalent", i.monthly_equivalent],
          ["Next renewal", i.next_renewal_date],
          ["Auto-renews", i.auto_renew],
          ["Seats purchased", i.seats_purchased],
          ["Department", i.department],
          ["Owner", i.owner],
        ]
      : Object.entries((i.changes ?? {}) as Record<string, { before: unknown; after: unknown }>).map(([k, v]) => [k.replace(/_/g, " "), `${show(v.before)} → ${show(v.after)}`]);
  return (
    <div className="mt-3 rounded-xl border border-accent/30 bg-accent-soft/30 p-3.5">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-fg">
        <Icon name="pen" size={14} className="text-accent-ink" />
        {p.tool === "create_subscription" ? "Add this subscription?" : `Update ${show((i.subscription as { software?: string })?.software)}?`}
      </p>
      <dl className="mt-2 grid gap-x-4 gap-y-1 text-[12.5px] sm:grid-cols-2">
        {rows
          .filter(([, v]) => v !== null && v !== undefined && v !== "")
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-line/60 py-0.5">
              <dt className="text-faint">{k}</dt>
              <dd className="text-right font-medium text-fg">{show(v)}</dd>
            </div>
          ))}
      </dl>
      {p.warnings.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-[12px] text-warn">
          {p.warnings.map((w) => (
            <li key={w} className="flex gap-1.5">
              <Icon name="alert" size={13} className="mt-0.5 shrink-0" />
              {w}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {p.state === "pending" || p.state === "failed" ? (
          <>
            <button type="button" onClick={onConfirm} className={buttonClass("primary", "sm")}>
              Confirm and save
            </button>
            <button type="button" onClick={onDiscard} className={buttonClass("secondary", "sm")}>
              Discard
            </button>
          </>
        ) : p.state === "saving" ? (
          <span className="text-[12.5px] text-muted">Saving…</span>
        ) : p.state === "saved" ? (
          <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[color-mix(in_oklab,var(--success)_75%,black)]">
            <Icon name="check" size={14} /> {p.result}
            {p.url && (
              <Link href={new URL(p.url).pathname} className="ml-1 text-accent-ink underline underline-offset-2">
                Open
              </Link>
            )}
          </span>
        ) : (
          <span className="text-[12.5px] text-faint">Discarded — nothing was saved.</span>
        )}
        {p.state === "failed" && <span className="text-[12.5px] text-danger">{p.result}</span>}
      </div>
    </div>
  );
}

export function AssistantChat({ workspaceId, suggestions, canWrite }: { workspaceId: string; suggestions: string[]; canWrite: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<unknown[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || pending) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setPending(true);
    const res = await askAssistantAction({ workspaceId, history, question: q }).catch(() => ({ ok: false as const, error: "The assistant couldn't be reached. Check your connection and try again." }));
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setHistory(res.history);
    setMessages((m) => [...m, { role: "assistant", text: res.turn.text, toolsUsed: res.turn.toolsUsed, refused: res.turn.refused, previews: res.turn.previews.map((p) => ({ ...p, state: "pending" as const })) }]);
  }

  function setPreview(msgIndex: number, id: string, patch: Partial<NonNullable<ChatMessage["previews"]>[number]>) {
    setMessages((all) => all.map((m, i) => (i === msgIndex ? { ...m, previews: m.previews?.map((p) => (p.id === id ? { ...p, ...patch } : p)) } : m)));
  }

  async function confirm(msgIndex: number, p: NonNullable<ChatMessage["previews"]>[number]) {
    setPreview(msgIndex, p.id, { state: "saving" });
    const res = await confirmAssistantChangeAction({ workspaceId, tool: p.tool, args: p.args }).catch(() => ({ ok: false as const, error: "Couldn't save. Try again." }));
    if (!res.ok) return setPreview(msgIndex, p.id, { state: "failed", result: res.error });
    setPreview(msgIndex, p.id, { state: "saved", result: res.summary, url: res.url });
    // Tell the model on the next turn what the person did.
    setHistory((h) => [...h, { role: "user", content: `[In the app, I confirmed the previewed change: ${res.summary}]` }]);
  }

  function discard(msgIndex: number, p: NonNullable<ChatMessage["previews"]>[number]) {
    setPreview(msgIndex, p.id, { state: "discarded" });
    setHistory((h) => [...h, { role: "user", content: "[In the app, I discarded the previewed change. Nothing was saved.]" }]);
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line-strong p-5">
            <p className="text-[14px] font-medium text-fg">Ask about your software spending</p>
            <p className="mt-1 text-[13px] text-muted">
              The assistant looks up this workspace&apos;s records with the same tools AI clients use over MCP, shows the numbers behind each answer and says whether they&apos;re actual, estimated or projected.
              {canWrite ? " It can prepare new or changed subscription records for you to confirm." : " Your role is read-only, so it won't prepare changes."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-[12.5px] text-fg hover:border-accent hover:bg-accent-soft/40">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[14px] text-accent-fg">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <span aria-hidden="true" className="icon-tile mt-0.5 size-8 shrink-0 rounded-[10px]">
                <Icon name="sparkles" size={15} />
              </span>
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[14px] leading-relaxed text-fg">
                <RichText text={m.text} />
                {m.previews?.map((p) => (
                  <PreviewCard key={p.id} p={p} onConfirm={() => confirm(i, p)} onDiscard={() => discard(i, p)} />
                ))}
                {m.toolsUsed && m.toolsUsed.length > 0 && (
                  <p className="mt-3 border-t border-line pt-2 text-[11.5px] text-faint">
                    Looked up: {[...new Set(m.toolsUsed.map((t) => toolLabels[t.name] ?? t.name))].join(", ")}
                  </p>
                )}
              </div>
            </div>
          ),
        )}
        {pending && (
          <div className="flex items-center gap-3 text-[13px] text-muted" role="status">
            <span aria-hidden="true" className="icon-tile size-8 rounded-[10px]">
              <Icon name="sparkles" size={15} />
            </span>
            <span className="flex items-center gap-1">
              Looking at your workspace
              <span className="inline-flex gap-0.5">
                <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                <span className="size-1 animate-bounce rounded-full bg-current" />
              </span>
            </span>
          </div>
        )}
        {error && <p className="rounded-xl border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[13px] text-danger">{error}</p>}
        <div ref={end} />
      </div>

      <form
        className="sticky bottom-0 mt-5 border-t border-line bg-bg/95 pb-1 pt-3 backdrop-blur"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
      >
        <label htmlFor="assistant-q" className="sr-only">
          Ask the assistant
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="assistant-q"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(input);
              }
            }}
            rows={2}
            maxLength={2000}
            placeholder="e.g. Which subscriptions renew next month?"
            className="min-h-[44px] flex-1 resize-y rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-[14px] outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
          <button type="submit" disabled={pending || !input.trim()} className={cn(buttonClass("primary", "md"), "h-11")}>
            Ask
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-faint">
          <span>AI can make mistakes — check figures against the linked records. Questions and the data the tools return are sent to Anthropic to generate answers.</span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setHistory([]);
                setError(null);
              }}
              className="font-medium text-muted hover:text-fg"
            >
              New conversation
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
