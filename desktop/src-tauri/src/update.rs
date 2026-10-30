//! Tells people when a newer version of the app is out (the site itself is
//! always current). Reads `/api/desktop/latest` on saveroption.com: on launch at
//! most once a day, and from "Check for Updates…". A newer version offers to
//! open the download page; installing stays a normal download, since automatic
//! installs need a separate update-signing key.

use std::time::{Duration, SystemTime};

use tauri::{AppHandle, Manager, Runtime, Url};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

use crate::ORIGIN;

const DAY: Duration = Duration::from_secs(24 * 60 * 60);

struct Latest {
  version: String,
  page: String,
}

fn fetch_latest() -> Result<Option<Latest>, String> {
  let text = ureq::get(&format!("{ORIGIN}/api/desktop/latest"))
    .timeout(Duration::from_secs(10))
    .call()
    .map_err(|e| e.to_string())?
    .into_string()
    .map_err(|e| e.to_string())?;
  let body: serde_json::Value = serde_json::from_str(&text).map_err(|e| e.to_string())?;
  let Some(version) = body.get("version").and_then(|v| v.as_str()) else {
    return Ok(None);
  };
  let page = body.get("page").and_then(|v| v.as_str()).unwrap_or("").to_string();
  Ok(Some(Latest {
    version: version.to_string(),
    page,
  }))
}

/// Compares dotted version numbers ("0.10.0" > "0.9.3"); anything unparsable counts as not newer.
fn is_newer(candidate: &str, current: &str) -> bool {
  let parse = |v: &str| v.split('.').map(|p| p.parse::<u64>().ok()).collect::<Option<Vec<_>>>();
  match (parse(candidate), parse(current)) {
    (Some(a), Some(b)) => a > b,
    _ => false,
  }
}

fn stamp_file<R: Runtime>(app: &AppHandle<R>) -> Option<std::path::PathBuf> {
  app.path().app_data_dir().ok().map(|d| d.join("last-update-check"))
}

fn checked_recently<R: Runtime>(app: &AppHandle<R>) -> bool {
  stamp_file(app)
    .and_then(|f| std::fs::metadata(f).ok())
    .and_then(|m| m.modified().ok())
    .and_then(|t| SystemTime::now().duration_since(t).ok())
    .is_some_and(|age| age < DAY)
}

fn mark_checked<R: Runtime>(app: &AppHandle<R>) {
  if let Some(f) = stamp_file(app) {
    if let Some(dir) = f.parent() {
      let _ = std::fs::create_dir_all(dir);
    }
    let _ = std::fs::write(f, "");
  }
}

fn check<R: Runtime>(app: AppHandle<R>, manual: bool) {
  let current = app.package_info().version.to_string();
  let result = fetch_latest();
  mark_checked(&app);
  match result {
    Ok(Some(latest)) if is_newer(&latest.version, &current) => {
      let page = Url::parse(&latest.page)
        .ok()
        .filter(|u| u.scheme() == "https" && u.host_str() == Some("www.saveroption.com"));
      let page = page.unwrap_or_else(|| Url::parse(&format!("{ORIGIN}/business/download")).expect("valid URL"));
      let opener = app.clone();
      app
        .dialog()
        .message(format!(
          "Saver Option Business {} is available — you have {current}.\n\nDownload it now? Your workspace and settings stay as they are.",
          latest.version
        ))
        .title("A new version is available")
        .kind(MessageDialogKind::Info)
        .buttons(MessageDialogButtons::OkCancelCustom("Download".into(), "Later".into()))
        .show(move |download| {
          if download {
            crate::open_outside(&opener, &page);
          }
        });
    }
    Ok(_) if manual => app
      .dialog()
      .message(format!("Saver Option Business {current} is the latest version."))
      .title("You're up to date")
      .kind(MessageDialogKind::Info)
      .buttons(MessageDialogButtons::Ok)
      .show(|_| {}),
    Err(e) if manual => app
      .dialog()
      .message(format!("Couldn't check for updates right now. Please try again later.\n\n({e})"))
      .title("Check for Updates")
      .kind(MessageDialogKind::Warning)
      .buttons(MessageDialogButtons::Ok)
      .show(|_| {}),
    _ => {}
  }
}

/// On launch, a few seconds in and at most once a day.
pub fn check_in_background<R: Runtime>(app: AppHandle<R>) {
  if checked_recently(&app) {
    return;
  }
  std::thread::spawn(move || {
    std::thread::sleep(Duration::from_secs(8));
    check(app, false);
  });
}

/// From the menu: always answers, including "you're up to date".
pub fn check_now<R: Runtime>(app: AppHandle<R>) {
  std::thread::spawn(move || check(app, true));
}

#[cfg(test)]
mod tests {
  use super::is_newer;

  #[test]
  fn compares_versions_numerically() {
    assert!(is_newer("0.2.0", "0.1.0"));
    assert!(is_newer("0.10.0", "0.9.3"));
    assert!(is_newer("1.0.0", "0.99.99"));
    assert!(!is_newer("0.2.0", "0.2.0"));
    assert!(!is_newer("0.1.9", "0.2.0"));
    assert!(!is_newer("0.3.0-beta", "0.2.0"));
  }
}
