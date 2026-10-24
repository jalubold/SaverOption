import Link from "next/link";
import { AssistantChat } from "@/components/business/assistant/assistant-chat";
import { Card, InlineNote, PageHeader } from "@/components/business/ui";
import { can } from "@/lib/business/permissions";
import { assistantConfigured } from "@/lib/server/business/assistant";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "AI Savings Assistant" };
// A question can take several tool calls; give the server action room to finish.
export const maxDuration = 120;

const suggestions = [
  "How much are we spending on software every month?",
  "Which subscriptions are renewing next month?",
  "Which five subscriptions cost the most?",
  "Do we have tools with overlapping functionality?",
  "Where should we start to reduce our software budget?",
  "Are there relevant deals on Saver Option for our tools?",
];

export default async function AssistantPage() {
  const ctx = await requireBizContext("/business/assistant");
  const configured = assistantConfigured();
  const canWrite = can(ctx.role, "records.manage") || can(ctx.role, "records.manage_own");
  return (
    <>
      <PageHeader
        title="AI Savings Assistant"
        description="Ask about your subscriptions, renewals, spending and savings in plain language. Answers come from this workspace's records, with the numbers and how they were calculated."
      />
      {configured ? (
        <AssistantChat workspaceId={ctx.workspace.id} suggestions={suggestions} canWrite={canWrite} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card title="Not set up on this site yet">
            <p className="text-[14px] leading-relaxed text-muted">
              The assistant uses Anthropic&apos;s Claude API. A site administrator needs to add an <code className="text-[13px]">ANTHROPIC_API_KEY</code> to the server environment before it
              can answer questions. Nothing is simulated in the meantime.
            </p>
            <div className="mt-4">
              <InlineNote title="Use your own AI client instead">
                You can already ask Claude or another MCP-compatible AI client about this workspace by connecting it in{" "}
                <Link href="/business/settings/mcp" className="underline underline-offset-2">
                  AI clients (MCP)
                </Link>
                .
              </InlineNote>
            </div>
          </Card>
          <Card title="What it will do">
            <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-muted">
              {suggestions.slice(0, 4).map((s) => (
                <li key={s}>{s}</li>
              ))}
              <li>Prepare new or changed subscription records — saved only when you press Confirm.</li>
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}
