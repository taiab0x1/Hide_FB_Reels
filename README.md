
Hide FB Reels
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
4. Visit facebook.com and browse; reels should be hidden automatically. To see diagnostic messages, open DevTools -> Console and run the following command (paste into the Console):


    window.GH_HIDE_REELS_LOG = true

This enables verbose logging in the content script at runtime without editing files.

Notes for developers

- The content script uses simple heuristics (link paths, attributes, and class name patterns) and a MutationObserver to handle dynamic content.
- The script hooks history.pushState/replaceState and observes DOM mutations to catch SPA navigations and dynamic inserts.

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
