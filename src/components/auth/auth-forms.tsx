"use client";

import { useFormStatus } from "react-dom";
import { signInWithGoogleAction } from "@/app/auth/actions";
import { GoogleLogo } from "@/components/brand/google-logo";

/** The only way to sign in: new and returning users use the same button. */
export function GoogleButton({ next, label = "Continue with Google", disabled = false }: { next: string; label?: string; disabled?: boolean }) {
  return (
    <form action={signInWithGoogleAction}>
      <input type="hidden" name="next" value={next} />
      <GoogleSubmit label={label} disabled={disabled} />
    </form>
  );
}

function GoogleSubmit({ label, disabled }: { label: string; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#1f1f1f]" />
          Opening Google…
        </>
      ) : (
        <>
          <GoogleLogo />
          {label}
        </>
      )}
    </button>
  );
}

