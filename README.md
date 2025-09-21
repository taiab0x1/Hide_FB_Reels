# Hide Facebook Reels

A small Chrome extension that hides Facebook Reels elements on facebook.com by using a content script and CSS rules.

## Features

- Hides Facebook Reels elements using heuristics (href, data-pagelet, aria-label, class names).
- Observes dynamic DOM changes and SPA navigation to keep Reels hidden.
- Minimal permissions and no network requests.

## Install (local / developer)

1. Clone the repository or download the `Extension` folder.
2. Open Chrome (or Edge) and go to `chrome://extensions`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select this `Extension` folder.

## Usage

Once loaded, the extension will run on `*.facebook.com` and hide Reels-style elements. If you want to enable debug logs, edit `content.js` and set `LOG = true`, then reload the extension.

# Hide Facebook Reels

A small Chrome extension that hides Facebook Reels elements on facebook.com by using a content script and CSS rules.

## Features

- Hides Facebook Reels elements using heuristics (href, data-pagelet, aria-label, class names).
- Observes dynamic DOM changes and SPA navigation to keep Reels hidden.
- Minimal permissions and no network requests.

## Install (local / developer)

1. Clone the repository or download the `Extension` folder.
2. Open Chrome (or Edge) and go to `chrome://extensions`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select this `Extension` folder.

## Usage

Once loaded, the extension will run on `*.facebook.com` and hide Reels-style elements. If you want to enable debug logs, edit `content.js` and set `LOG = true`, then reload the extension.

## Development

Files of interest:

- `manifest.json` - Chrome extension manifest (Manifest V3)
- `content.js` - content script detecting and hiding Reels
- `styles.css` - CSS class that hides matched nodes
- `icons/` - small placeholder icons

To run locally and iterate:

1. Make code changes.
2. In `chrome://extensions` reload the extension (click the circular arrow).
3. Refresh facebook.com and verify behavior.

## QA / Troubleshooting

- Load the extension as "unpacked" in Chrome/Edge (see above).
- Visit https://www.facebook.com/ and scroll through the feed. Reels items (links with `/reel/` and related containers) should be hidden.
- If you still see Reels:
  - Open DevTools (F12) -> Elements and try searching for `/reel/` or `Reel` in attributes to find current selectors.
  - Edit `content.js` and tweak the selector list; then reload the extension.

## Privacy & Safety

- This extension runs only on `*.facebook.com` and doesn't transmit any data off the page.
- No external network requests are made by the extension.

## Contribute / Next steps

- Add an options page to toggle hiding or whitelist certain pages.
- Add unit tests for the selector heuristics (requires bundling/testing harness).
- Replace placeholder icons with proper PNG/SVG artwork.

## License

MIT
