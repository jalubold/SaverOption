/** Light or dark for the business app: the device's setting, or the person's own choice (per browser). */
export type Appearance = "system" | "light" | "dark";

/** Holds "light" or "dark"; no cookie means follow the device. */
export const APPEARANCE_COOKIE = "so_theme";

/**
 * Runs before the page shows: puts the saved choice on <html data-theme> so the first paint is in the
 * right look (no flash). With no choice, the CSS follows prefers-color-scheme.
 */
export const appearanceScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${APPEARANCE_COOKIE}=(light|dark)/),d=document.documentElement;if(m)d.setAttribute("data-theme",m[1]);else d.removeAttribute("data-theme")}catch(e){}})();`;
