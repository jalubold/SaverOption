import { NextResponse } from "next/server";
import { templateCsv } from "@/lib/business/csv-import";

/** The import template: column names only, so nothing in it can be imported as real data by mistake. */
export function GET() {
  return new NextResponse(templateCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="saver-option-subscriptions-template.csv"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
