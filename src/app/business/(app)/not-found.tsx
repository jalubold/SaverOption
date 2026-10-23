import Link from "next/link";
import { buttonClass } from "@/components/ui/primitives";

/** Unknown ids — including records that belong to another workspace — land here. */
export default function BusinessNotFound() {
  return (
    <div className="biz-card mx-auto max-w-lg px-6 py-10 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-faint">Not found</p>
      <h1 className="mt-1 text-[18px] font-semibold">That record isn&apos;t in this workspace</h1>
      <p className="mt-2 text-[14px] text-muted">It may have been removed, or it belongs to a workspace you&apos;re not working in right now.</p>
      <div className="mt-5 flex justify-center">
        <Link href="/business/dashboard" className={buttonClass("primary", "sm")}>
          Back to the overview
        </Link>
      </div>
    </div>
  );
}
