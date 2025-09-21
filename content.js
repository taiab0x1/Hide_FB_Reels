// content.js - hides Facebook Reels elements

(function() {
  'use strict';

  const HIDE_CLASS = 'gh-hide-facebook-reels';
  const LOG = false; // set to true while debugging

  function log(...args) {
    if (LOG) console.debug('[hide-reels]', ...args);
  }

  function addHideClass(el) {
    if (!el || !el.classList) return;
    if (!el.classList.contains(HIDE_CLASS)) {
      el.classList.add(HIDE_CLASS);
      log('hid element', el);
    }
  }

  function looksLikeReel(el) {
    if (!(el instanceof Element)) return false;
    // Match by href patterns, ARIA labels, data-pagelet attributes or class names
    const href = el.getAttribute && el.getAttribute('href');
    if (href && href.includes('/reel/')) return true;
    const pagelet = el.getAttribute && el.getAttribute('data-pagelet');
    if (pagelet && /reels?/i.test(pagelet)) return true;
    const aria = el.getAttribute && el.getAttribute('aria-label');
    if (aria && /reels?/i.test(aria)) return true;
    const cls = el.className || '';
    if (typeof cls === 'string' && /\breel\b/i.test(cls)) return true;
    return false;
  }

  function tryHide(node) {
    try {
      if (!(node instanceof Element)) return;

      if (looksLikeReel(node)) {
        addHideClass(node);
        return;
      }

      // check common descendants
      const q = 'a[href*="/reel/"], [data-pagelet*="Reel" i], [aria-label*="Reel" i], [class*="reel" i]';
      const found = node.querySelector && node.querySelector(q);
      if (found) {
        // find the nearest article/role container to hide whole block
        const ancestor = found.closest && found.closest('div[role="article"], div[data-pagelet], section, article');
        if (ancestor) addHideClass(ancestor);
        else addHideClass(found);
      }
    } catch (e) {
      // swallow
    }
  }

  function scanExisting() {
    log('scanning existing nodes');
    // Broad selectors for initial pass
    const initialSel = 'a[href*="/reel/"], [data-pagelet*="Reel" i], [aria-label*="Reel" i], [class*="reel" i]';
    const nodes = document.querySelectorAll(initialSel);
    nodes.forEach(n => {
      const ancestor = n.closest && n.closest('div[role="article"], div[data-pagelet], section, article');
      if (ancestor) addHideClass(ancestor);
      else addHideClass(n);
    });
  }

  // throttled rescans to avoid CPU spikes
  let scanScheduled = false;
  function scheduleScan(delay = 250) {
    if (scanScheduled) return;
    scanScheduled = true;
    setTimeout(() => {
      scanScheduled = false;
      scanExisting();
    }, delay);
  }

  // observe dynamic changes
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        tryHide(node);
      }
    }
    // schedule a broader scan occasionally
    scheduleScan();
  });

  // Hook history API to detect SPA navigations reliably
  function hookHistoryEvents() {
    const _wr = (type) => {
      const orig = history[type];
      return function() {
        const rv = orig.apply(this, arguments);
        window.dispatchEvent(new Event(type));
        return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    window.addEventListener('popstate', () => scheduleScan(100));
    window.addEventListener('pushState', () => scheduleScan(100));
    window.addEventListener('replaceState', () => scheduleScan(100));
  }

  function init() {
    scanExisting();
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    hookHistoryEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
