import { calendarFeed } from "@/lib/server/business/calendar";
import { dbConfigured } from "@/lib/server/db";

/**
 * A member's calendar feed (/api/business/calendar/<token>.ics), fetched by Google Calendar,
 * Outlook or Apple Calendar. The token is the only credential, so an unknown one gets the
 * same plain 404 as a malformed one. The user agent says which calendar app is fetching it.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/business/calendar/[token]">) {
  const { token } = await ctx.params;
  const feed = dbConfigured() ? await calendarFeed(token.replace(/\.ics$/, ""), { userAgent: request.headers.get("user-agent") }) : null;
  if (!feed) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(feed, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="saver-option-renewals.ics"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
