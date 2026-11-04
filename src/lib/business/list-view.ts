/** How a list page shows its records: rows (the list) or a grid of cards. */
export type ListView = "list" | "cards";

/** The cookie that remembers a person's choice of view for a list page. */
export const viewCookie = (name: string) => `so_view_${name}`;

/** The view a page shows: what the URL asks for, else the remembered choice, else cards. */
export function pickView(param: string | string[] | undefined, remembered: string | undefined): ListView {
  const p = typeof param === "string" ? param : null;
  if (p === "cards" || p === "grid") return "cards";
  if (p === "list" || p === "table") return "list";
  return remembered === "list" ? "list" : "cards";
}
