# Saver Option Business for Mac

A Mac app (Tauri 2, in `desktop/`) that shows the live Saver Option Business in its own window.
Download page: https://www.saveroption.com/business/download

## How it works

- **The live site in a window.** The app opens `https://www.saveroption.com/business/dashboard`
  (after a small local start page that also handles being offline). Every feature is the web
  version, so updates to the site need no new app version.
- **Navigation rules** (`desktop/src-tauri/src/lib.rs`): saveroption.com pages stay in the window;
  everything else — other sites, Google sign-in, Creem checkout and billing portal, `mailto:` —
  opens in the default browser or mail app. `target="_blank"` links and `window.open` follow the
  same rules.
- **Google sign-in** (Google doesn't allow sign-in inside apps' web views):
  1. The app adds `SaverOptionBusinessDesktop/<version>` to its user agent. `signInWithGoogleAction`
     sees it and adds `desktop=1` to the OAuth return URL.
  2. The Supabase/Google page opens in the browser. Back on `/auth/callback?…&desktop=1` in the
     browser, the callback doesn't sign the browser in; it shows a page that opens
     `saveroption-business://auth/callback?code=…&next=…`.
  3. The app receives that link and loads `https://www.saveroption.com/auth/callback?code=…` in its
     window, which exchanges the code. Only the app's window holds the PKCE verifier from step 1,
     so the code is useless anywhere else.
  The Supabase Auth redirect allow-list must accept `/auth/callback` with query parameters (it
  already does for web sign-in; `&desktop=1` is one more parameter).
- **Downloads** (CSV/JSON exports) are saved to the Downloads folder.
- **Mac window and menus** (0.2.0):
  - No separate title bar: the traffic lights sit in a 56 px strip at the top of the sidebar
    (as tall as the top bar). The app adds `html.desktop-app` to every page before it's drawn;
    the site's `desktop-app:` Tailwind variant leaves that room (sidebar strip, drawer, and the
    top bar or public header on narrower windows). Elements with `data-tauri-drag-region`
    drag the window.
  - The window opens hidden on a dark background and shows once its first page is drawn, so
    there's no white flash. It remembers its size and position, and reopens on the last page.
  - Menu bar: Edit (copy/paste), View → Reload (⌘R) and full screen, Go → Back/Forward (⌘[ / ⌘],
    and a two-finger swipe) and the main pages on ⌘1–⌘9, ⌘, for Settings, Help → docs, and
    Check for Updates…. Go-menu pages are opened in-app through a `so:desktop-navigate` event the
    app shell handles (`DesktopMenuLinks`), falling back to loading the page.
  - **Updates:** on launch (at most once a day) and from Check for Updates…, the app reads
    `/api/desktop/latest` and, when a newer version is out, offers to open the download page.
    Installing stays a normal download; automatic installs would need a separate update-signing
    key kept as a GitHub Actions secret.
- **Permissions:** the site's pages get exactly two Tauri permissions — start dragging the window
  and double-click to zoom (`capabilities/remote-window-drag.json`). Nothing else.
- Inside the app, the site hides "Download" in the Business header and shows a note on the
  sign-in page that Google opens in the browser.

## Building and releasing

`.github/workflows/desktop.yml` runs on every push to `main` that changes `desktop/` (or by hand
from the Actions tab). On a macOS runner it runs the Rust tests, builds a universal app, signs it
ad hoc, makes `Saver-Option-Business-mac.dmg` and publishes the GitHub release `desktop-v<version>`
(the version in `desktop/src-tauri/tauri.conf.json`; bump it for a new release — rebuilding the
same version replaces that release's files). `/business/download` reads the newest `desktop-v*`
release from the GitHub API (cached 15 minutes).

Type-checking the Mac-only code on Linux works with a stub C compiler (`cargo check` doesn't
link): `CC_aarch64_apple_darwin=<stub that writes empty objects> AR_aarch64_apple_darwin=ar cargo
check --target aarch64-apple-darwin`.

Locally on a Mac: `cd desktop && npm ci && npx tauri build --bundles app` (Rust and Xcode command
line tools needed). App icons are generated from `desktop/icon-source.svg` → `icon-source.png`
with `npm run icons`.

## Not signed by Apple yet

Without an Apple Developer ID the app is signed ad hoc, so the first time macOS says it can't
verify the developer; people allow it in **System Settings → Privacy & Security → Open Anyway**
(the download page says so). With an Apple Developer Program membership the build can sign with a
Developer ID certificate and notarize, which removes that step; the certificate and Apple ID
credentials then go into the repository's GitHub Actions secrets — never into the code or a chat.
