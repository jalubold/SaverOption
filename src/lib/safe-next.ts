/** Post-auth redirect target: same-site paths only, so links can't bounce users to another site. */
export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value.length > 300 ? fallback : value;
}
