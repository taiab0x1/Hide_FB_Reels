
Hide FB Reels
=============

Simple Chrome extension (Manifest V3) that hides Facebook Reels elements from the page using a content script.

What this repository contains

- A content script that runs on facebook.com and hides UI blocks likely to be Reels.
- A small stylesheet that applies a hiding class to matched elements.
- A manifest.json configured for Manifest V3.

Quick install (for local testing)

1. Open Chrome (or Edge). Go to chrome://extensions.
2. Enable "Developer mode" in the top-right.
3. Click "Load unpacked" and select this project folder (the folder containing `manifest.json`).
4. Visit facebook.com and browse; Reels should be hidden automatically.

Popup Toggle (one-click)

This release includes a small popup that lets you enable or disable the hiding behavior without reloading the extension.

- Click the extension icon in the toolbar to open the popup.
- The button shows the current state (ON / OFF). Toggle it to enable/disable hiding.
- The state is saved to `chrome.storage.sync` so it persists across browsers where you are signed in.

Runtime diagnostics (dev)

If you need to debug why something is or isn't being hidden, open DevTools on Facebook and run:

    window.GH_HIDE_REELS_LOG = true

With this flag set the content script will log matched elements to the Console and briefly outline them visually so you can inspect the outerHTML and craft precise rules.

Notes for developers

- The content script uses heuristics (link paths, attributes, and class name patterns) and a MutationObserver to handle dynamic content.
- It also hooks history.pushState/replaceState to detect SPA navigations and schedules throttled rescans to avoid CPU spikes.

Privacy and permissions

- The extension requests minimal permissions required to run on `*.facebook.com` (see `manifest.json`).
- No data is collected or transmitted by this extension.

Extending this project

- Add an options page for whitelists, more granular toggles, or logging levels.
- Add tests (Puppeteer + HTML fixtures) to assert hiding behavior.

Contributing

- Open issues or PRs if you have improvements. Keep changes small and documented.

License

- This project is provided "as-is". Add a license file if you want to publish it publicly.

Contact

- Repo owner: GitHub user `taiab0x1`.
Quick install (for local testing)

1. Open Chrome (or Edge). Go to chrome://extensions.
2. Enable "Developer mode" in the top-right.
3. Click "Load unpacked" and select this project folder (the folder containing `manifest.json`).
4. Visit facebook.com and browse; reels should be hidden automatically. To see diagnostic messages, open DevTools -> Console and run:


    window.GH_HIDE_REELS_LOG = true

This enables verbose logging in the content script at runtime without editing files.

Notes for developers

- The content script uses simple heuristics (link paths, attributes, and class name patterns) and a MutationObserver to handle dynamic content.
- This is intentionally minimal and client-side only — no network requests or external APIs.

Privacy and permissions

- The extension requests no sensitive permissions beyond what is needed to run on `*.facebook.com` (declared in `manifest.json`).
- No data is collected or transmitted by this extension.

Extending this project

- Options page: add settings for a whitelist, toggle, and debug logging.
- Popup: provide a one-click enable/disable and a count of hidden items.
- Tests: add a small Puppeteer script and HTML fixture to assert the hiding behavior.

Contributing

- Open issues or PRs if you have improvements. Keep changes small and well-documented.

License

- This project is provided "as-is". Add a license file if you want to publish it publicly.

Contact

- Repo owner: GitHub user `taiab0x1`.
