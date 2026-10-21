"use client";

import { useState } from "react";
import { saveListingAction, uploadLogoAction, type EditState } from "@/app/dashboard/actions";
import { DESCRIPTION_MAX } from "@/components/promote/validation";
import { FieldError, FormField, FormMessage, inputClass, SubmitButton, useFormAction } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

export interface EditorListing {
  id: string;
  productName: string;
  website: string;
  description: string;
  links: { pricing?: string; docs?: string; x?: string; linkedin?: string };
  locked: boolean;
}

export function ListingEditor({ listing }: { listing: EditorListing }) {
  const { state, pending, onSubmit } = useFormAction<EditState>(saveListingAction, null);
  const [description, setDescription] = useState(listing.description);
  const e = state?.errors ?? {};

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <input type="hidden" name="id" value={listing.id} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Product name"
          name="productName"
          defaultValue={listing.productName}
          maxLength={80}
          disabled={listing.locked}
          error={e.productName}
          hint={listing.locked ? "Locked after approval. Email us to change it." : undefined}
        />
        <FormField
          label="Website"
          name="website"
          type="url"
          inputMode="url"
          defaultValue={listing.website}
          disabled={listing.locked}
          error={e.website}
          hint={listing.locked ? "Locked after approval. Email us to change it." : undefined}
        />
      </div>

      <div>
        <label htmlFor="f-description" className="flex items-baseline justify-between text-[13px] font-medium text-fg">
          <span>Description</span>
          <span className="tabular text-[11px] font-normal text-faint">
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </label>
        <textarea
          id="f-description"
          name="description"
          rows={4}
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          maxLength={DESCRIPTION_MAX}
          aria-invalid={Boolean(e.description)}
          placeholder="What it does, who it's for, and what makes it worth a look."
          className={cn(inputClass(e.description), "h-auto resize-y py-2.5")}
        />
        {e.description ? (
          <FieldError>{e.description}</FieldError>
        ) : (
          <p className="mt-1 text-[12px] text-faint">At least 40 characters before your listing can be published.</p>
        )}
      </div>

      <fieldset>
        <legend className="text-[13px] font-medium text-fg">
          Links <span className="font-normal text-faint">(optional)</span>
        </legend>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField label="Pricing page" name="link_pricing" type="url" inputMode="url" defaultValue={listing.links.pricing} placeholder="https://…/pricing" error={e.link_pricing} className="mt-2" />
          <FormField label="Docs" name="link_docs" type="url" inputMode="url" defaultValue={listing.links.docs} placeholder="https://docs.…" error={e.link_docs} className="mt-2" />
          <FormField label="X (Twitter)" name="link_x" type="url" inputMode="url" defaultValue={listing.links.x} placeholder="https://x.com/…" error={e.link_x} className="mt-2" />
          <FormField label="LinkedIn" name="link_linkedin" type="url" inputMode="url" defaultValue={listing.links.linkedin} placeholder="https://linkedin.com/company/…" error={e.link_linkedin} className="mt-2" />
        </div>
      </fieldset>

      <FormMessage tone={state?.ok ? "success" : "error"}>{state?.message}</FormMessage>
      <SubmitButton pending={pending} pendingLabel="Saving…" size="md">
        Save changes
      </SubmitButton>
    </form>
  );
}

export function LogoUploader({ id, logoUrl, enabled }: { id: string; logoUrl: string | null; enabled: boolean }) {
  const { state, pending, onSubmit } = useFormAction<EditState>(uploadLogoAction, null);
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? logoUrl;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <input type="hidden" name="id" value={id} />
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview / uploaded logo
          <img src={shown} alt="Logo preview" className="size-full object-contain" />
        ) : (
          <Icon name="image" size={24} className="text-[#98a2b3]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {enabled ? (
          <>
            <label htmlFor="f-logo" className="block text-[13px] font-medium text-fg">
              {logoUrl ? "Replace logo" : "Upload logo"}
            </label>
            <input
              id="f-logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
              className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-line-strong file:bg-subtle file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg"
            />
            <p className="mt-1 text-[12px] text-faint">Square PNG, JPG or WebP, under 512 KB.</p>
            <FieldError>{state?.errors?.logo}</FieldError>
            <div className="mt-3 space-y-3">
              <FormMessage tone={state?.ok ? "success" : "error"}>{state?.message}</FormMessage>
              <SubmitButton pending={pending} pendingLabel="Uploading…" size="sm" variant="secondary">
                Upload
              </SubmitButton>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Logo upload isn&apos;t available yet. Email us your logo and we&apos;ll add it.</p>
        )}
      </div>
    </form>
  );
}
