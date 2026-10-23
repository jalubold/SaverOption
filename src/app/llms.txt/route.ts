import { llmsTxt } from "@/lib/llms";

export const revalidate = 3600;

/** llmstxt.org summary of the site for AI assistants. */
export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
