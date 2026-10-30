// No console window on Windows release builds (the app is built for macOS; this keeps other builds tidy).
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  saver_option_business_lib::run()
}
