"use client";

import { useActionState } from "react";
import { deactivateCodesAction, importCodesAction, type CodesState } from "@/app/admin/codes/actions";
import { FormMessage, inputClass, SubmitButton } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

const label = "block text-[13px] font-medium text-fg";
const hint = "mt-1 text-[12px] text-faint";

function ListInputs({ placeholder }: { placeholder: string }) {
  return (
    <>
      <div>
        <label className={label} htmlFor={`${placeholder}-file`}>
          CSV or text file
        </label>
        <input id={`${placeholder}-file`} type="file" name="file" accept=".csv,.txt,text/csv,text/plain" className={cn(inputClass(false, "h-auto py-2 text-[14px] file:mr-3 file:rounded-md file:border-0 file:bg-subtle file:px-3 file:py-1 file:text-fg"))} />
        <p className={hint}>One code per line (the first column of a CSV). A &quot;code&quot; header row is skipped. Up to 1 MB per file.</p>
      </div>
      <div>
        <label className={label} htmlFor={`${placeholder}-list`}>
          Or paste the codes
        </label>
        <textarea id={`${placeholder}-list`} name="list" rows={5} spellCheck={false} placeholder={placeholder} className={inputClass(false, "h-auto py-2 font-mono text-[13px]")} />
      </div>
    </>
  );
}

/** Adds codes from the CSV uploaded to AppSumo. Re-importing the same file changes nothing. */
export function ImportCodesForm() {
  const [state, action, pending] = useActionState<CodesState, FormData>(importCodesAction, null);
  return (
    <form action={action} className="grid gap-4">
      <ListInputs placeholder="SOB-XXXX-XXXX-XXXX" />
      <div>
        <label className={label} htmlFor="batch">
          Batch name <span className="font-normal text-faint">(optional)</span>
        </label>
        <input id="batch" name="batch" maxLength={80} placeholder="e.g. AppSumo launch, Nov 2026" className={inputClass(false, "h-10 text-[14px]")} />
      </div>
      <div>
        <SubmitButton pending={pending} pendingLabel="Importing…" size="md">
          <Icon name="file" size={15} /> Import codes
        </SubmitButton>
      </div>
      {state && <FormMessage tone={state.ok ? "success" : "error"}>{state.message}</FormMessage>}
    </form>
  );
}

/** Deactivates refunded or withdrawn codes: they can't be redeemed and stop giving access. */
export function DeactivateCodesForm() {
  const [state, action, pending] = useActionState<CodesState, FormData>(deactivateCodesAction, null);
  return (
    <form action={action} className="grid gap-4">
      <ListInputs placeholder="Codes refunded or deleted on AppSumo" />
      <div>
        <label className={label} htmlFor="note">
          Reason <span className="font-normal text-faint">(optional)</span>
        </label>
        <input id="note" name="note" maxLength={200} placeholder="e.g. Refunded on AppSumo" className={inputClass(false, "h-10 text-[14px]")} />
      </div>
      <label className="flex items-start gap-2 text-[13px] text-muted">
        <input type="checkbox" name="confirm" value="yes" className="mt-0.5 size-4 accent-[var(--color-danger,#e5484d)]" />
        <span>Deactivate these codes. A workspace that redeemed one loses the plan it gave; this can&apos;t be undone here.</span>
      </label>
      <div>
        <SubmitButton pending={pending} pendingLabel="Deactivating…" size="md" variant="secondary">
          Deactivate codes
        </SubmitButton>
      </div>
      {state && <FormMessage tone={state.ok ? "success" : "error"}>{state.message}</FormMessage>}
    </form>
  );
}
