Hide Facebook Reels
===================

A simple Chrome extension (Manifest V3) that hides Facebook Reels elements on facebook.com by using a content script and CSS rules.

Install / Load locally
----------------------
1. Open Chrome/Edge and go to chrome://extensions
2. Enable Developer mode
3. Click "Load unpacked" and select the `Extension` folder from this workspace

Notes
-----
- The extension uses heuristics (selectors + MutationObserver). Facebook's DOM changes frequently; if Reels aren't hidden, update the selectors in `content.js`.
- No external permissions besides `storage` are used.

Files
-----
- `manifest.json` - extension manifest
- `content.js` - content script with dynamic detection
- `styles.css` - CSS to hide matched nodes
- `README.md` - this file

License
-------
MIT

QA / Troubleshooting
--------------------
- Load the extension as "unpacked" in Chrome/Edge (see above).
- Visit https://www.facebook.com/ and scroll through the feed. Reels items (links with `/reel/` and related containers) should be hidden.
- If you still see Reels:
	- Open DevTools (F12) -> Elements and try searching for `/reel/` or `Reel` in attributes to find current selectors.
	- Edit `content.js` and tweak the selector list; then reload the extension.

Privacy & Safety
----------------
- This extension runs only on `*.facebook.com` and doesn't transmit any data off the page.
- No external network requests are made by the extension.

Next steps / Improvements
------------------------
- Add an options page to toggle hiding or whitelist certain pages.
- Add unit tests for the selector heuristics (requires bundling/testing harness).
- Replace placeholder icons with proper PNG/SVG artwork.
