import { clearClaimCookie, readClaimCookie } from "@/lib/server/claim";
import { claimSubmission } from "@/lib/server/submissions";

/**
 * Claims the submission behind this browser's claim cookie for `user` and
 * returns where to send them next. Used by /claim and by the login/signup
 * actions (so they can redirect straight to the result).
 */
export async function claimDestination(user: { id: string; email: string; emailConfirmed: boolean }): Promise<string> {
  const claim = await readClaimCookie();
  if (!claim) return "/dashboard";
  if (!user.emailConfirmed) return "/login?error=verify&next=/claim";

  const { result, submissionId } = await claimSubmission(claim, user);
  switch (result) {
    case "claimed":
    case "already_yours":
      await clearClaimCookie();
      return `/dashboard/listings/${submissionId}?welcome=1`;
    case "unpaid":
      // Payment not verified yet: wait on the status page; the cookie stays for later.
      return `/promote/success?s=${submissionId}`;
    case "taken":
      await clearClaimCookie();
      return "/dashboard?claim=taken";
    default:
      await clearClaimCookie();
      return "/dashboard?claim=invalid";
  }
}
