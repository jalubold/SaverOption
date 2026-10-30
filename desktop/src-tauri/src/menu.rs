//! The Mac menu bar. Page items move within the app the way the sidebar does
//! (the site handles `so:desktop-navigate`), falling back to loading the page.

use tauri::menu::{AboutMetadata, Menu, MenuBuilder, MenuEvent, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Manager, Runtime};

use crate::{update, ORIGIN};

/// Menu item id → page, with its shortcut (⌘1–⌘9 in sidebar order).
const PAGES: &[(&str, &str, &str, Option<&str>)] = &[
  ("go-overview", "Overview", "/business/dashboard", Some("CmdOrCtrl+1")),
  ("go-subscriptions", "Subscriptions", "/business/subscriptions", Some("CmdOrCtrl+2")),
  ("go-renewals", "Renewals", "/business/renewals", Some("CmdOrCtrl+3")),
  ("go-software", "Software", "/business/software", Some("CmdOrCtrl+4")),
  ("go-licenses", "Licenses & Seats", "/business/licenses", Some("CmdOrCtrl+5")),
  ("go-analytics", "Analytics", "/business/analytics", Some("CmdOrCtrl+6")),
  ("go-savings", "Savings", "/business/savings", Some("CmdOrCtrl+7")),
  ("go-reports", "Reports", "/business/reports", Some("CmdOrCtrl+8")),
  ("go-team", "Team", "/business/team", Some("CmdOrCtrl+9")),
  ("go-notifications", "Notifications", "/business/notifications", None),
];

pub fn build<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
  let item = |id: &str, text: &str, shortcut: Option<&str>| {
    let b = MenuItemBuilder::with_id(id, text);
    match shortcut {
      Some(s) => b.accelerator(s).build(app),
      None => b.build(app),
    }
  };

  let app_menu = SubmenuBuilder::new(app, "Saver Option Business")
    .about(Some(AboutMetadata {
      name: Some("Saver Option Business".into()),
      website: Some(format!("{ORIGIN}/business")),
      website_label: Some("saveroption.com/business".into()),
      ..Default::default()
    }))
    .item(&item("check-updates", "Check for Updates…", None)?)
    .separator()
    .item(&item("settings", "Settings…", Some("CmdOrCtrl+,"))?)
    .separator()
    .services()
    .separator()
    .hide()
    .hide_others()
    .show_all()
    .separator()
    .quit()
    .build()?;

  let edit = SubmenuBuilder::new(app, "Edit")
    .undo()
    .redo()
    .separator()
    .cut()
    .copy()
    .paste()
    .select_all()
    .build()?;

  let view = SubmenuBuilder::new(app, "View")
    .item(&item("reload", "Reload Page", Some("CmdOrCtrl+R"))?)
    .separator()
    .fullscreen()
    .build()?;

  let mut go = SubmenuBuilder::new(app, "Go")
    .item(&item("back", "Back", Some("CmdOrCtrl+["))?)
    .item(&item("forward", "Forward", Some("CmdOrCtrl+]"))?)
    .separator();
  for (id, text, _, shortcut) in PAGES {
    go = go.item(&item(id, text, *shortcut)?);
  }
  let go = go.build()?;

  let window = SubmenuBuilder::new(app, "Window")
    .minimize()
    .maximize()
    .separator()
    .close_window()
    .build()?;

  let help = SubmenuBuilder::new(app, "Help")
    .item(&item("help", "Saver Option Business Help", None)?)
    .build()?;

  MenuBuilder::new(app).items(&[&app_menu, &edit, &view, &go, &window, &help]).build()
}

/// Script that opens a page: in-app navigation when the site takes the event, a page load otherwise.
fn go_script(path: &str) -> String {
  let rel = serde_json::to_string(path).unwrap_or_default();
  let abs = serde_json::to_string(&format!("{ORIGIN}{path}")).unwrap_or_default();
  format!(
    "if (window.dispatchEvent(new CustomEvent('so:desktop-navigate', {{ detail: {rel}, cancelable: true }}))) window.location.assign({abs});"
  )
}

pub fn handle<R: Runtime>(app: &AppHandle<R>, event: MenuEvent) {
  let id = event.id().as_ref();
  if id == "check-updates" {
    update::check_now(app.clone());
    return;
  }
  let Some(window) = app.get_webview_window("main") else { return };
  let script = match id {
    "reload" => "window.location.reload();".to_string(),
    "back" => "window.history.back();".to_string(),
    "forward" => "window.history.forward();".to_string(),
    "settings" => go_script("/business/settings"),
    "help" => go_script("/business/docs"),
    _ => match PAGES.iter().find(|(page_id, ..)| *page_id == id) {
      Some((_, _, path, _)) => go_script(path),
      None => return,
    },
  };
  let _ = window.eval(script);
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn shortcuts_are_unique() {
    let mut keys: Vec<&str> = PAGES.iter().filter_map(|(.., s)| *s).collect();
    keys.extend(["CmdOrCtrl+,", "CmdOrCtrl+R", "CmdOrCtrl+[", "CmdOrCtrl+]"]);
    let n = keys.len();
    keys.sort();
    keys.dedup();
    assert_eq!(keys.len(), n);
  }

  #[test]
  fn page_script_falls_back_to_a_full_url() {
    let s = go_script("/business/renewals");
    assert!(s.contains("detail: \"/business/renewals\""));
    assert!(s.contains("window.location.assign(\"https://www.saveroption.com/business/renewals\")"));
  }
}
