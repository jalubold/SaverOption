//! Saver Option Business for Mac: a window onto https://www.saveroption.com/business.
//!
//! The app shows the live site, so it's always current and every feature works
//! as on the web. What it adds is desktop behaviour:
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
//! The site's pages get no access to Tauri APIs: no capability covers remote URLs.

use tauri::webview::{DownloadEvent, NewWindowResponse};
use tauri::{AppHandle, Manager, Url, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_opener::OpenerExt;

const ORIGIN: &str = "https://www.saveroption.com";
const SCHEME: &str = "saveroption-business";
/// WebKit's own user agent plus a token the site uses to recognise the app
/// (it sends Google sign-in through the browser and hides "Download for Mac").
const USER_AGENT: &str =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) SaverOptionBusinessDesktop/0.1.0";

/// Links that open a new window (target="_blank") stay in the app as ordinary
/// navigations; the navigation rules below then decide where they open.
const LINKS_SCRIPT: &str = r#"
document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[target='_blank']") : null;
  if (!link || !link.href) return;
  event.preventDefault();
  window.location.href = link.href;
}, true);
"#;

/// Pages shown in the app window: Saver Option itself and the app's own splash page.
fn in_app(url: &Url) -> bool {
  match url.scheme() {
    "tauri" | "about" => true,
    "https" => matches!(url.host_str(), Some("www.saveroption.com") | Some("saveroption.com")),
    // The splash page on platforms that serve the app over http(s)://tauri.localhost.
    "http" => url.host_str() == Some("tauri.localhost"),
    _ => false,
  }
}

fn open_outside(app: &AppHandle, url: &Url) {
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_window_state::Builder::new().build())
    .setup(|app| {
      let nav = app.handle().clone();
      let popups = app.handle().clone();
      WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title("Saver Option Business")
        .inner_size(1280.0, 820.0)
        .min_inner_size(900.0, 600.0)
        .user_agent(USER_AGENT)
        .initialization_script(LINKS_SCRIPT)
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
        })
        .build()?;

      let links = app.handle().clone();
      app.deep_link().on_open_url(move |event| handle_links(&links, event.urls()));
      // Launched by a sign-in link while the app wasn't running.
      if let Ok(Some(urls)) = app.deep_link().get_current() {
        handle_links(app.handle(), urls);
      }
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
}
