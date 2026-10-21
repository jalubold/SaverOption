/** Essential details collected before checkout. Shared by the browser form and the server. */
export interface PromoteDetails {
  productName: string;
  website: string;
  email: string;
  /** Optional short description. */
  description: string;
}

export type PromoteErrors = Partial<Record<keyof PromoteDetails, string>>;

export const emptyDetails: PromoteDetails = { productName: "", website: "", email: "", description: "" };

export const DESCRIPTION_MAX = 600;

/** Accepts "example.com" as well as full URLs; returns null when it isn't a public http(s) address. */
export function normalizeWebsite(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    // Needs a dotted hostname such as "example.com"; rejects "localhost" and bare words.
    if (!/^[^.\s]+(\.[^.\s]+)+$/.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateDetails(d: PromoteDetails): PromoteErrors {
  const errors: PromoteErrors = {};
  const name = d.productName.trim();
  if (!name) errors.productName = "Enter your product's name.";
  else if (name.length < 2) errors.productName = "Product name must be at least 2 characters.";
  else if (name.length > 80) errors.productName = "Keep the product name under 80 characters.";

  if (!d.website.trim()) errors.website = "Enter your product's website.";
  else if (!normalizeWebsite(d.website)) errors.website = "Enter a valid website, like https://yourproduct.com.";

  const email = d.email.trim();
  if (!email) errors.email = "Enter your work email.";
  else if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Enter a valid email address, like you@company.com.";

  if ((d.description ?? "").trim().length > DESCRIPTION_MAX) errors.description = `Keep the description under ${DESCRIPTION_MAX} characters.`;

  return errors;
}
