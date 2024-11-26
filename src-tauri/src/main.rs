// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::{command, Window};
use window_shadows::set_shadow;
use tauri_plugin_oauth::start;

// Setup Last.fm OAuth callback server
#[command]
async fn start_server(window: Window) -> Result<u16, String> {
    start(move |url| {
        // Because of the unprotected localhost port, you must verify the URL here.
        // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.
        let _ = window.emit("redirect_uri", url);
    })
    .map_err(|err| err.to_string())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![start_server])
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();
      // Apply window-shadows on Windows / MacOS
      #[cfg(any(windows, target_os = "macos"))]
      set_shadow(main_window, true).unwrap();
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
