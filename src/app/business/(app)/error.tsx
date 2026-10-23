"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/primitives";

/** Unexpected errors inside the business app. Nothing about the error is shown beyond its reference. */
export default function BusinessError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="biz-card mx-auto max-w-lg px-6 py-10 text-center">
      <h1 className="text-[18px] font-semibold">This page couldn&apos;t load</h1>
      <p className="mt-2 text-[14px] text-muted">Something went wrong on our side. Your data is safe — try again, or go back to the overview.</p>
      {error.digest && <p className="mt-2 text-[12px] text-faint">Reference: {error.digest}</p>}
      <div className="mt-5 flex justify-center gap-2">
        <button type="button" onClick={reset} className={buttonClass("primary", "sm")}>
          Try again
        </button>
        <Link href="/business/dashboard" className={buttonClass("secondary", "sm")}>
          Overview
        </Link>
      </div>
    </div>
  );
}
