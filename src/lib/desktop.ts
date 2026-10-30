/**
 * Saver Option Business for Mac (desktop/ in the repository) shows this site in
 * an app window. It adds DESKTOP_UA_TOKEN to its user agent so the site can
 * tell: Google sign-in then runs in the browser and returns to the app through
 * a DESKTOP_SCHEME link, and "Download for Mac" is hidden inside the app.
 */
export const DESKTOP_UA_TOKEN = "SaverOptionBusinessDesktop/";
export const DESKTOP_SCHEME = "saveroption-business";

export function isDesktopApp(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent?.includes(DESKTOP_UA_TOKEN));
}
