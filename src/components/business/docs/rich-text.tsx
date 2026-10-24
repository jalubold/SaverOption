import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Inline text for the docs: [label](href), `code` and **bold** — enough for
 * guides without a Markdown dependency. Internal links use next/link.
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;

export function RichText({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const key = `t${i++}`;
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(
        href.startsWith("/") ? (
          <Link key={key} href={href}>
            {m[1]}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">
            {m[1]}
          </a>
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(
        <code key={key} className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">
          {m[3]}
        </code>,
      );
    } else {
      out.push(
        <strong key={key} className="font-semibold text-fg">
          {m[4]}
        </strong>,
      );
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[“”"'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
