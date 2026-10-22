"use client";

import { adminAction, type AdminState } from "@/app/admin/actions";
import { FormMessage, inputClass, SubmitButton, useFormAction } from "@/components/ui/form";
import { cn } from "@/components/ui/primitives";

export function ReviewForm({ id, notes, canApprove, canReject }: { id: string; notes: string; canApprove: boolean; canReject: boolean }) {
  const { state, pending, onSubmit } = useFormAction<AdminState>(adminAction, null);
  return (
    <form
      onSubmit={(e) => {
        // Which button was pressed decides the intent.
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        e.currentTarget.querySelector<HTMLInputElement>('input[name="intent"]')!.value = submitter?.value ?? "notes";
        onSubmit(e);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intent" defaultValue="notes" />
      <label htmlFor="admin-notes" className="block text-[13px] font-medium text-fg">
        Review notes <span className="font-normal text-faint">(shown to the advertiser)</span>
      </label>
      <textarea id="admin-notes" name="notes" rows={4} defaultValue={notes} maxLength={2000} className={cn(inputClass(), "h-auto resize-y py-2.5")} />
      <FormMessage tone={state?.ok ? "success" : "error"}>{state?.message}</FormMessage>
      <div className="flex flex-wrap gap-2">
        <SubmitButton pending={pending} pendingLabel="Saving…" size="sm" value="approve" disabled={!canApprove}>
          Approve
        </SubmitButton>
        <SubmitButton pending={pending} pendingLabel="Saving…" size="sm" variant="secondary" value="reject" disabled={!canReject}>
          Reject
        </SubmitButton>
        <SubmitButton pending={pending} pendingLabel="Saving…" size="sm" variant="ghost" value="notes">
          Save notes only
        </SubmitButton>
      </div>
    </form>
  );
}

export function PublishForm({
  id,
  startsAt,
  endsAt,
  paidThrough,
  published,
  canPublish,
}: {
  id: string;
  startsAt: string;
  endsAt: string;
  /** Set for subscription listings: the end date follows the subscription. */
  paidThrough: string | null;
  published: boolean;
  canPublish: boolean;
}) {
  const { state, pending, onSubmit } = useFormAction<AdminState>(adminAction, null);
  return (
    <form
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        e.currentTarget.querySelector<HTMLInputElement>('input[name="intent"]')!.value = submitter?.value ?? "publish";
        onSubmit(e);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intent" defaultValue="publish" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="admin-start" className="block text-[13px] font-medium text-fg">
            Starts (UTC)
          </label>
          <input id="admin-start" name="startsAt" type="date" defaultValue={startsAt} className={inputClass()} />
        </div>
        {!paidThrough && (
          <div>
            <label htmlFor="admin-end" className="block text-[13px] font-medium text-fg">
              Expires (UTC)
            </label>
            <input id="admin-end" name="endsAt" type="date" defaultValue={endsAt} className={inputClass()} />
          </div>
        )}
      </div>
      <p className="text-[12px] text-faint">
        {paidThrough
          ? `Stays live while the subscription is paid (currently through ${paidThrough}); renewals and cancellations update it automatically.`
          : "Leave expiry empty to use the plan length from the start date."}
      </p>
      <FormMessage tone={state?.ok ? "success" : "error"}>{state?.message}</FormMessage>
      <div className="flex flex-wrap gap-2">
        <SubmitButton pending={pending} pendingLabel="Saving…" size="sm" value="publish" disabled={!canPublish}>
          {published ? "Update dates" : "Publish"}
        </SubmitButton>
        {published && (
          <SubmitButton pending={pending} pendingLabel="Saving…" size="sm" variant="secondary" value="unpublish">
            Unpublish
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
