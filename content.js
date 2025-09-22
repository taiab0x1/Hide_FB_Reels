// content.js - hides Facebook Reels elements

(function() {
  'use strict';

  const HIDE_CLASS = 'gh-hide-facebook-reels';
  // LOG can be toggled at runtime by setting `window.GH_HIDE_REELS_LOG = true` in DevTools.
  // Default is false to avoid console noise.
  const LOG = Boolean(window && window.GH_HIDE_REELS_LOG);

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
    // Check visible text for "Reels" for nav items (clean mode / nav buttons)
    try {
      const text = (el.innerText || el.textContent || '').trim();
      if (text && /\breels?\b/i.test(text)) {
        const tag = el.tagName && el.tagName.toLowerCase();
        const role = el.getAttribute && el.getAttribute('role');
        const inNav = el.closest && el.closest('nav, header, [role="navigation"], [role="menubar"]');
        if (tag === 'a' || tag === 'button' || role === 'button' || inNav) return true;
      }
    } catch (e) {
      // ignore text extraction errors
    }
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

    // Target nav/header items (clean mode) whose visible text contains "Reels"
    try {
      const navSel = 'nav a, nav button, [role="navigation"] a, [role="navigation"] button, header a, header button, div[role="navigation"] a, div[role="navigation"] button';
      const navItems = document.querySelectorAll(navSel);
      navItems.forEach(n => {
        try {
          const txt = (n.innerText || n.textContent || '').trim();
          if (/\breels?\b/i.test(txt)) {
            const anc = n.closest && n.closest('nav, header, div[role="navigation"], div[role="menubar"], div[role="article"], section, article');
            if (anc) addHideClass(anc);
            else addHideClass(n);
          }
        } catch (e) {}
      });
    } catch (e) {}

    // Broader pass: scan for elements with title/alt or small visible text nodes that say "Reels".
    try {
      const attrSel = '[title*="Reel" i], [alt*="Reel" i], [aria-label*="Reel" i]';
      const attrs = document.querySelectorAll(attrSel);
      attrs.forEach(n => {
        try {
          const anc = n.closest && n.closest('nav, header, [role="navigation"], [role="menubar"], div[role="navigation"]');
          if (anc) addHideClass(anc);
          else addHideClass(n);
        } catch (e) {}
      });
    } catch (e) {}

    try {
      // Search small visible text-only nodes to catch minimized nav labels
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const v = (node.nodeValue || '').trim();
          if (v && /\breels?\b/i.test(v) && v.length < 40) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      });
      const hit = [];
      while (walker.nextNode()) {
        const t = walker.currentNode;
        const el = t.parentElement;
        if (!el) continue;
        const anc = el.closest && el.closest('nav, header, [role="navigation"], [role="menubar"], div[role="navigation"]');
        if (anc) {
          if (!hit.includes(anc)) {
            hit.push(anc);
            addHideClass(anc);
          }
        } else {
          addHideClass(el);
        }
      }
    } catch (e) {}
  }

    // Robust, optimized nav/header detection: find small nav/menu items that say "Reels" and include an icon
    try {
      const navRoots = document.querySelectorAll('nav, header, [role="navigation"], [role="menubar"], div[role="navigation"]');
      navRoots.forEach(root => {
        // only inspect immediate interactive children to keep this cheap
        const items = Array.from(root.querySelectorAll('a, button, div[role="link"], div[role="button"]'));
        for (const el of items) {
          try {
            const txt = (el.innerText || el.textContent || '').trim();
            if (!/\breels?\b/i.test(txt)) continue;
            // Prefer elements that have an icon (svg or <i> with background-image) or are short labels
            const hasIcon = !!(el.querySelector('svg') || el.querySelector('i') || (window.getComputedStyle && window.getComputedStyle(el).backgroundImage && window.getComputedStyle(el).backgroundImage !== 'none'));
            if (!hasIcon && txt.length > 12) continue; // avoid matching large blocks
            // Hide the smallest safe ancestor (nav/header or the element itself)
            const anc = el.closest('nav, header, [role="navigation"], [role="menubar"], div[role="navigation"]');
            if (anc) addHideClass(anc);
            else addHideClass(el);
            // stop after hiding one matching item in this root to avoid excessive hiding
            break;
          } catch (e) {
            // ignore per-element errors and continue
          }
        }
      });
    } catch (e) {}

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
