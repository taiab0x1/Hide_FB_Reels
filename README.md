
# Hide FB Reels

![release](https://img.shields.io/badge/release-v0.1.0-blue.svg) ![license](https://img.shields.io/badge/license-as--is-lightgrey.svg) ![platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge-brightgreen)

Lightweight Chrome/Edge extension (Manifest V3) to hide Facebook Reels UI elements from facebook.com. It uses conservative heuristics and lets you toggle the behavior via a popup. No external network requests or data collection.

<!-- toc -->
- [Quick demo](#quick-demo)
- [Install (developer)](#install-developer)
- [Popup toggle](#popup-toggle)
- [Runtime diagnostics](#runtime-diagnostics)
- [How it works (short)](#how-it-works-short)
- [Troubleshooting](#troubleshooting)
- [Development & tests](#development--tests)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
<!-- tocstop -->

## Quick demo

Open the extension and toggle the popup to enable/disable hiding. When enabled, the content script hides elements it thinks are Reels.

> Note: Facebook UI changes frequently; this extension aims for conservative rules to reduce false positives.

## Install (developer)

1. Open Chrome/Edge and navigate to `chrome://extensions` (or `edge://extensions`).
2. Enable "Developer mode".
3. Click "Load unpacked" and select this repository's folder (the folder containing `manifest.json`).

The extension will inject `content.js` on `*.facebook.com` pages.

## Popup toggle

- Click the extension icon in the browser toolbar to open the popup.
- The popup has a single button showing `Hide Facebook Reels: ON` or `OFF`.
- The state is persisted to `chrome.storage.sync` so it follows your Chrome profile.

## Runtime diagnostics

To debug matching/visibility issues without editing code, open Developer Tools on Facebook and run:

```js
window.GH_HIDE_REELS_LOG = true
```

With this flag set the content script will:

- Log messages to the Console for each element it hides (includes a short selector and an outerHTML snippet).
- Briefly outline matched elements so you can visually confirm which element was targeted.

If something still appears, copy the console line starting with `[hide-reels] hiding` and paste it into a new issue or in a reply here.

## How it works (short)

- The content script uses several lightweight heuristics:
    - href patterns (e.g. links containing `/reel/`)
    - attributes (aria-label, data-pagelet, title, alt)
    - visible labels/text (searches for "Reels" in small nav items)
    - icon detection (svg or icon element beside a short label)
- It uses a `MutationObserver` to catch dynamically inserted content and wraps `history.pushState`/`replaceState` to detect SPA navigations.

## Troubleshooting

- If the popup state doesn't persist: make sure Chrome sync is enabled for `chrome.storage.sync` or test with the extension reloaded.
- If unrelated UI is hidden: enable `window.GH_HIDE_REELS_LOG = true` and paste the console output so we can make the rule more specific.

## Development & tests

Local quick smoke test:

1. Open `devtools` and set `window.GH_HIDE_REELS_LOG = true`.
2. Reload the facebook.com tab to see logs for matched elements.

Automated testing (suggestion): create a small HTML fixture with a Reels-like block and use Puppeteer/Jest to assert the CSS hiding class is applied.

## Contributing

- Open issues or pull requests. Small focused PRs are preferred.
- If you submit a rule change, include a short rationale and before/after screenshots (or the element outerHTML) to help review.

## License

This project is provided "as-is". Add a license file if you want to publish it.

## Contact

- Repo owner: GitHub user `taiab.cse@gmail.com`.

