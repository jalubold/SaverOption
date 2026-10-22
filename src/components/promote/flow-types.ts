import type { ListingPlan, ListingPlanId } from "@/config/listing-plans";
import type { PromoteDetails } from "@/components/promote/validation";

/** Shared between the server (which decides) and the promote form (which renders). */
export type FlowMode = "live" | "test" | "closed";

export interface ResumeData {
  submissionId: string;
  /** The saved submission's key, so continuing from another tab updates it instead of creating another. */
  idempotencyKey: string;
  details: PromoteDetails;
  planId: ListingPlanId;
}

export interface PromoteContext {
  mode: FlowMode;
  /** An unpaid submission this browser started (cancelled checkout). */
  resume: ResumeData | null;
  /** A paid submission this browser started that isn't in an account yet. */
  paidId: string | null;
  signedIn: boolean;
  /** Current plans and prices, fresher than a cached page's. */
  plans?: ListingPlan[];
}
