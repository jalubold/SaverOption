"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { DESCRIPTION_MAX, normalizeWebsite } from "@/components/promote/validation";
import { getForUser, isLocked, updateProfile, type ListingLinks } from "@/lib/server/submissions";
import { getUser, storageAdmin } from "@/lib/server/supabase";

/**
 * Advertiser edits to their own listing. The user comes from the session and
 * every query is scoped to it; payment and review fields can't be changed here.
 */

export type EditState = { ok?: boolean; message?: string; errors?: Record<string, string> } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LINK_FIELDS = ["pricing", "docs", "x", "linkedin"] as const;
const LINK_HOSTS: Partial<Record<(typeof LINK_FIELDS)[number], RegExp>> = {
  x: /(^|\.)(x|twitter)\.com$/i,
  linkedin: /(^|\.)linkedin\.com$/i,
};

function refresh(id: string, slug: string | null) {
  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard");
  if (slug) {
    revalidatePath(`/listings/${slug}`);
    revalidatePath("/listings");
    revalidatePath("/");
  }
}

export async function saveListingAction(_prev: EditState, form: FormData): Promise<EditState> {
  const user = await getUser();
  if (!user) return { message: "Your session has expired. Log in again." };
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return { message: "Listing not found." };
  const current = await getForUser(id, user.id);
  if (!current) return { message: "Listing not found." };

  const errors: Record<string, string> = {};
  const update: Parameters<typeof updateProfile>[2] = {};

  if (!isLocked(current)) {
    const name = String(form.get("productName") ?? "").trim();
    if (name.length < 2 || name.length > 80) errors.productName = "Use 2–80 characters.";
    else update.productName = name;
    const site = normalizeWebsite(String(form.get("website") ?? ""));
    if (!site || site.length > 300) errors.website = "Enter a valid website, like https://yourproduct.com.";
    else update.website = site;
  }

  const description = String(form.get("description") ?? "").trim();
  if (description.length > DESCRIPTION_MAX) errors.description = `Keep it under ${DESCRIPTION_MAX} characters.`;
  else update.description = description || null;

  const links: ListingLinks = {};
  for (const field of LINK_FIELDS) {
    const raw = String(form.get(`link_${field}`) ?? "").trim();
    if (!raw) continue;
    const url = normalizeWebsite(raw);
    const hostOk = url && (!LINK_HOSTS[field] || LINK_HOSTS[field]!.test(new URL(url).hostname));
    if (!url || url.length > 300 || !hostOk) errors[`link_${field}`] = field === "x" ? "Enter an x.com profile URL." : field === "linkedin" ? "Enter a linkedin.com URL." : "Enter a valid URL.";
    else links[field] = url;
  }
  update.links = links;

  if (Object.keys(errors).length) return { errors, message: "Check the highlighted fields." };
  const saved = await updateProfile(id, user.id, update);
  if (!saved) return { message: "Listing not found." };
  refresh(id, saved.review_status === "published" ? saved.slug : null);
  return { ok: true, message: "Saved." };
}

const LOGO_TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/png": { ext: "png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/webp": { ext: "webp", magic: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
};
const LOGO_MAX_BYTES = 512 * 1024;
const BUCKET = "listing-logos";

export async function uploadLogoAction(_prev: EditState, form: FormData): Promise<EditState> {
  const user = await getUser();
  if (!user) return { message: "Your session has expired. Log in again." };
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return { message: "Listing not found." };
  const current = await getForUser(id, user.id);
  if (!current) return { message: "Listing not found." };
  const storage = storageAdmin();
  if (!storage) return { message: "Logo upload isn't available right now." };

  const file = form.get("logo");
  if (!(file instanceof File) || file.size === 0) return { errors: { logo: "Choose an image to upload." } };
  if (file.size > LOGO_MAX_BYTES) return { errors: { logo: "Use an image under 512 KB." } };
  const type = LOGO_TYPES[file.type];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!type || !type.magic(bytes)) return { errors: { logo: "Use a PNG, JPG or WebP image." } };

  const path = `${id}/${randomUUID()}.${type.ext}`;
  const { error } = await storage.storage.from(BUCKET).upload(path, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("[logo] upload failed:", error.message);
    return { message: "Upload failed. Please try again." };
  }
  const publicUrl = storage.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const saved = await updateProfile(id, user.id, { logoUrl: publicUrl });
  if (!saved) return { message: "Listing not found." };

  // Remove the previous file from our bucket (best effort).
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const old = current.logo_url?.includes(marker) ? current.logo_url.split(marker)[1] : null;
  if (old && old.startsWith(`${id}/`)) await storage.storage.from(BUCKET).remove([old]).catch(() => {});

  refresh(id, saved.review_status === "published" ? saved.slug : null);
  return { ok: true, message: "Logo updated." };
}
