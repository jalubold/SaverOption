//! Saver Option Business for Mac: a window onto https://www.saveroption.com/business.
//!
//! The app shows the live site, so it's always current and every feature works
//! as on the web. What it adds is a Mac app around it:
//! - A window without a separate title bar: the traffic lights sit over the
//!   app's own sidebar, which the site leaves room for (`html.desktop-app`).
//!   The window opens only once its first page is drawn, on a dark background,
//!   so there's no white flash.
//! - A Mac menu bar: ⌘1–⌘9 for the main pages, ⌘, for Settings, ⌘[ / ⌘] and a
//!   two-finger swipe for back/forward, ⌘R to reload, the usual Edit and Window
//!   menus, and Check for Updates…
//! - It reopens on the page you were on last.
//! - Saver Option pages open in the window; anything else (other sites, Google
//!   sign-in, payment, mailto links) opens in the default browser or mail app.
//! - Google doesn't allow sign-in inside embedded web views, so "Continue with
//!   Google" opens the browser. Once signed in there, the site sends the one-time
//!   sign-in code back through a `saveroption-business://` link, and the app
//!   finishes the sign-in in its own window (only this window holds the PKCE
//!   verifier the code needs, so the code is useless to anything else).
//! - Downloads (CSV and JSON exports) are saved to the Downloads folder.
//! - The window remembers its size and position.
//!
//! The site's pages get one Tauri permission only: dragging the window by its
//! top area (`capabilities/window-drag.json`).

mod menu;
mod update;

use std::path::PathBuf;

use tauri::webview::{DownloadEvent, NewWindowResponse, PageLoadEvent};
use tauri::window::Color;
use tauri::{AppHandle, Manager, Runtime, Url, WebviewUrl, WebviewWindow, WebviewWindowBuilder};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_window_state::StateFlags;

pub(crate) const ORIGIN: &str = "https://www.saveroption.com";
const SCHEME: &str = "saveroption-business";
/// WebKit's own user agent plus a token the site uses to recognise the app
/// (it sends Google sign-in through the browser and hides "Download for Mac").
const USER_AGENT: &str = concat!(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) SaverOptionBusinessDesktop/",
  env!("CARGO_PKG_VERSION")
);

/// Runs at the start of every page:
/// - marks the page as shown in the app (`html.desktop-app`), so the site can
///   leave room for the traffic lights before anything is drawn;
/// - keeps links that open a new window (target="_blank") in the app as ordinary
///   navigations, which the navigation rules below then route.
const PAGE_SCRIPT: &str = r#"
(function () {
  const mark = () => document.documentElement && document.documentElement.classList.add("desktop-app");
  if (document.documentElement) mark();
  else new MutationObserver((_, observer) => { if (document.documentElement) { mark(); observer.disconnect(); } }).observe(document, { childList: true });
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[target='_blank']") : null;
    if (!link || !link.href) return;
    event.preventDefault();
    window.location.href = link.href;
  }, true);
})();
"#;

/// Pages shown in the app window: Saver Option itself and the app's own start page.
fn in_app(url: &Url) -> bool {
  match url.scheme() {
    "tauri" | "about" => true,
    "https" => matches!(url.host_str(), Some("www.saveroption.com") | Some("saveroption.com")),
    // The start page on platforms that serve the app over http(s)://tauri.localhost.
    "http" => url.host_str() == Some("tauri.localhost"),
    _ => false,
  }
}

pub(crate) fn open_outside<R: Runtime>(app: &AppHandle<R>, url: &Url) {
  if matches!(url.scheme(), "https" | "http" | "mailto") {
    let _ = app.opener().open_url(url.as_str(), None::<&str>);
  }
}

/// Turns `saveroption-business://auth/callback?code=…&next=…` into the site's
/// own callback URL, keeping only the parameters the callback reads.
fn sign_in_target(link: &Url) -> Option<Url> {
  if link.scheme() != SCHEME || link.host_str() != Some("auth") || link.path() != "/callback" {
    return None;
  }
  let mut target = Url::parse(&format!("{ORIGIN}/auth/callback")).ok()?;
  {
    let mut query = target.query_pairs_mut();
    for (key, value) in link.query_pairs() {
      match key.as_ref() {
        "code" | "error" | "error_description" => {
          query.append_pair(&key, &value);
        }
        "next" if value.starts_with("/business") => {
          query.append_pair("next", &value);
        }
        _ => {}
      }
    }
  }
  Some(target)
}

fn handle_links(app: &AppHandle, links: Vec<Url>) {
  let Some(window) = app.get_webview_window("main") else { return };
  for link in links {
    if let Some(target) = sign_in_target(&link) {
      let _ = window.navigate(target);
      let _ = window.unminimize();
      let _ = window.show();
      let _ = window.set_focus();
    }
  }
}

/// The page to reopen next time: any Saver Option Business page except sign-in steps.
fn resumable(url: &Url) -> Option<String> {
  let saver_option = matches!(url.host_str(), Some("www.saveroption.com") | Some("saveroption.com"));
  let path = url.path();
  let skip = ["/business/login", "/business/signup", "/business/oauth"]
    .iter()
    .any(|p| path.starts_with(p));
  if url.scheme() != "https" || !saver_option || !path.starts_with("/business/") || skip {
    return None;
  }
  Some(match url.query() {
    Some(q) => format!("{path}?{q}"),
    None => path.to_string(),
  })
}

fn last_page_file(app: &AppHandle) -> Option<PathBuf> {
  app.path().app_data_dir().ok().map(|dir| dir.join("last-page"))
}

fn remember_page(window: &WebviewWindow) {
  let (Ok(url), Some(file)) = (window.url(), last_page_file(window.app_handle())) else {
    return;
  };
  if let Some(page) = resumable(&url) {
    if let Some(dir) = file.parent() {
      let _ = std::fs::create_dir_all(dir);
    }
    let _ = std::fs::write(file, page);
  }
}

/// Tells the start page where to go: the last page, validated again when read back.
fn start_script(app: &AppHandle) -> String {
  let saved = last_page_file(app)
    .and_then(|f| std::fs::read_to_string(f).ok())
    .unwrap_or_default();
  let page = Url::parse(&format!("{ORIGIN}{}", saved.trim()))
    .ok()
    .and_then(|u| resumable(&u))
    .unwrap_or_default();
  let value = serde_json::to_string(&page).unwrap_or_else(|_| "\"\"".into());
  format!("if (location.protocol === 'tauri:' || location.hostname === 'tauri.localhost') window.__SO_RESUME__ = {value};")
}

/// Two-finger swipe left/right for back and forward, as in Safari.
fn enable_swipe_navigation(window: &WebviewWindow) {
  #[cfg(target_os = "macos")]
  let _ = window.with_webview(|webview| unsafe {
    let view: &objc2_web_kit::WKWebView = &*webview.inner().cast::<objc2_web_kit::WKWebView>();
    view.setAllowsBackForwardNavigationGestures(true);
  });
  #[cfg(not(target_os = "macos"))]
  let _ = window;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_dialog::init())
    // Size, position and full-screen state are restored; the window still opens hidden until drawn.
    .plugin(
      tauri_plugin_window_state::Builder::new()
        .with_state_flags(StateFlags::all() & !StateFlags::VISIBLE)
        .build(),
    )
    .menu(menu::build)
    .on_menu_event(menu::handle)
    .setup(|app| {
      let nav = app.handle().clone();
      let popups = app.handle().clone();
      let builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title("Saver Option Business")
        .inner_size(1280.0, 820.0)
        .min_inner_size(900.0, 600.0)
        .visible(false)
        .background_color(Color(12, 14, 18, 255))
        .user_agent(USER_AGENT)
        .initialization_script(PAGE_SCRIPT)
        .initialization_script(start_script(app.handle()))
        .on_page_load(|window, payload| {
          if payload.event() == PageLoadEvent::Finished {
            let _ = window.show();
            remember_page(&window);
          }
        })
        // Moving between pages in the app changes the title (no page load), so remember the page then too.
        .on_document_title_changed(|window, _title| remember_page(&window))
        .on_navigation(move |url| {
          if in_app(url) {
            return true;
          }
          open_outside(&nav, url);
          false
        })
        .on_new_window(move |url, _features| {
          // window.open: Saver Option pages replace the current one, others go to the browser.
          if in_app(&url) {
            if let Some(window) = popups.get_webview_window("main") {
              let _ = window.navigate(url);
            }
          } else {
            open_outside(&popups, &url);
          }
          NewWindowResponse::Deny
        })
        .on_download(|_webview, event| {
          // Exports go to the Downloads folder (WebKit picks a unique file name there).
          if let DownloadEvent::Finished { url, success: false, .. } = event {
            eprintln!("download failed: {url}");
          }
          true
        });
      // The traffic lights sit over the page, centred in the 56 px strip the site leaves at the top of its sidebar (as tall as its top bar).
      #[cfg(target_os = "macos")]
      let builder = builder
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .hidden_title(true)
        .traffic_light_position(tauri::LogicalPosition::new(14.0, 22.0));
      let window = builder.build()?;
      enable_swipe_navigation(&window);

      let links = app.handle().clone();
      app.deep_link().on_open_url(move |event| handle_links(&links, event.urls()));
      // Launched by a sign-in link while the app wasn't running.
      if let Ok(Some(urls)) = app.deep_link().get_current() {
        handle_links(app.handle(), urls);
      }
      update::check_in_background(app.handle().clone());
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running Saver Option Business");
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn keeps_saver_option_in_the_window() {
    assert!(in_app(&Url::parse("https://www.saveroption.com/business/dashboard").unwrap()));
    assert!(in_app(&Url::parse("tauri://localhost/index.html").unwrap()));
    assert!(!in_app(&Url::parse("https://abc.supabase.co/auth/v1/authorize").unwrap()));
    assert!(!in_app(&Url::parse("https://www.creem.io/checkout/x").unwrap()));
    assert!(!in_app(&Url::parse("http://www.saveroption.com/business").unwrap()));
    assert!(!in_app(&Url::parse("https://saveroption.com.evil.example/").unwrap()));
    assert!(!in_app(&Url::parse("mailto:hello@example.com").unwrap()));
  }

  #[test]
  fn sign_in_links_map_to_the_site_callback() {
    let link = Url::parse("saveroption-business://auth/callback?code=abc&next=%2Fbusiness%2Fdashboard&extra=1").unwrap();
    assert_eq!(
      sign_in_target(&link).unwrap().as_str(),
      "https://www.saveroption.com/auth/callback?code=abc&next=%2Fbusiness%2Fdashboard"
    );
    let cancelled = Url::parse("saveroption-business://auth/callback?error=access_denied&next=%2Fbusiness").unwrap();
    assert_eq!(
      sign_in_target(&cancelled).unwrap().as_str(),
      "https://www.saveroption.com/auth/callback?error=access_denied&next=%2Fbusiness"
    );
    // Only Business pages as the destination, and only the callback link.
    let offsite = Url::parse("saveroption-business://auth/callback?code=abc&next=https://evil.example").unwrap();
    assert_eq!(
      sign_in_target(&offsite).unwrap().as_str(),
      "https://www.saveroption.com/auth/callback?code=abc"
    );
    assert!(sign_in_target(&Url::parse("saveroption-business://other/path?code=abc").unwrap()).is_none());
    assert!(sign_in_target(&Url::parse("https://www.saveroption.com/auth/callback?code=abc").unwrap()).is_none());
  }

  #[test]
  fn reopens_business_pages_but_not_sign_in_steps() {
    let page = |u: &str| resumable(&Url::parse(u).unwrap());
    assert_eq!(
      page("https://www.saveroption.com/business/renewals"),
      Some("/business/renewals".into())
    );
    assert_eq!(
      page("https://www.saveroption.com/business/subscriptions?status=active"),
      Some("/business/subscriptions?status=active".into())
    );
    assert_eq!(page("https://www.saveroption.com/business/login?next=%2Fbusiness"), None);
    assert_eq!(page("https://www.saveroption.com/business/oauth/consent"), None);
    assert_eq!(page("https://www.saveroption.com/business"), None);
    assert_eq!(page("https://www.saveroption.com/deals"), None);
    assert_eq!(page("https://evil.example/business/renewals"), None);
    assert_eq!(page("tauri://localhost/index.html"), None);
  }
}
