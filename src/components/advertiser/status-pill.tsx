import { cn } from "@/components/ui/primitives";
import { listingLabels, paymentLabels, statusTone, type ListingState, type PaymentStatus } from "@/lib/listing-status";

const tones = {
  good: "border-success/35 bg-success/10 text-success",
  wait: "border-warn/35 bg-warn-soft text-warn",
  bad: "border-danger/35 bg-danger/10 text-danger",
  neutral: "border-line-strong bg-subtle text-muted",
} as const;

export function StatusPill({ tone, children, className }: { tone: keyof typeof tones; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[12px] font-medium", tones[tone], className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function PaymentPill({ status }: { status: PaymentStatus }) {
  return <StatusPill tone={statusTone(status)}>{paymentLabels[status]}</StatusPill>;
}

export function ListingPill({ state }: { state: ListingState }) {
  return <StatusPill tone={statusTone(state)}>{listingLabels[state]}</StatusPill>;
}

export function TestModeBadge() {
  return (
    <span className="inline-flex items-center rounded-md border border-warn/40 bg-warn-soft px-1.5 py-px text-[11px] font-medium text-warn">
      Test mode
    </span>
  );
}
