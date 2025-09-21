
Hide FB Reels
=================

Simple Chrome extension (Manifest V3) that hides Facebook Reels elements from the page using a content script.

What this repository contains

- A content script that runs on facebook.com and hides UI blocks likely to be Reels.
- A small stylesheet that applies a hiding class to matched elements.
- A manifest.json configured for Manifest V3.

Quick install (for local testing)

1. Open Chrome (or Edge). Go to chrome://extensions.
2. Enable "Developer mode" in the top-right.
3. Click "Load unpacked" and select this project folder (the folder containing `manifest.json`).
4. Visit facebook.com and browse; reels should be hidden automatically. Open DevTools -> Console and set `LOG = true` in `content.js` to see diagnostic messages.

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
