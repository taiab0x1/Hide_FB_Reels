// content.js - hides Facebook Reels elements

(function() {
  'use strict';

  const HIDE_CLASS = 'gh-hide-facebook-reels';
  let enabled = true;
  const observerConfig = { childList: true, subtree: true };

  function addGlobalStyles() {
    try {
      if (document.getElementById('gh-hide-reels-styles')) return;
      const s = document.createElement('style');
      s.id = 'gh-hide-reels-styles';
      s.textContent = `.${HIDE_CLASS} { display:none !important; visibility:hidden !important; opacity:0 !important; height:0 !important; overflow:hidden !important; margin:0 !important; padding:0 !important; border:0 !important; }`;
      (document.head || document.documentElement).appendChild(s);
    } catch (e) { /* ignore */ }
  }
  // Runtime diagnostic toggle: set `window.GH_HIDE_REELS_LOG = true` in DevTools to enable logging/highlight.
  function isLog() {
    return Boolean(window && window.GH_HIDE_REELS_LOG);
  }

  function log(...args) {
    if (isLog()) console.debug('[hide-reels]', ...args);
  }

  // Return a short readable selector for debug output
  function getReadableSelector(el) {
    if (!el || el === document || el === document.documentElement) return 'document';
    if (el.id) return '#' + el.id;
    const parts = [];
    let cur = el;
    while (cur && cur !== document.body && parts.length < 8) {
      let part = cur.tagName.toLowerCase();
      if (cur.classList && cur.classList.length) {
        part += '.' + Array.from(cur.classList).slice(0,2).join('.');
      }
      parts.unshift(part);
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }

  function addHideClass(el) {
    if (!el || !el.classList) return;
    if (!el.classList.contains(HIDE_CLASS)) {
      if (isLog()) {
        try {
          const sel = getReadableSelector(el);
          const snippet = (el.outerHTML || '').slice(0, 400).replace(/\s+/g, ' ');
          console.debug('[hide-reels] hiding', sel, snippet);
          // briefly outline the element so user can see what was matched
          const oldOutline = el.style.outline;
          el.style.outline = '2px solid rgba(255,50,50,0.9)';
          setTimeout(() => { el.style.outline = oldOutline; }, 1200);
        } catch (e) {}
      }
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

    // If a small label/span/h3 contains 'Reels', hide its nearest interactive ancestor
    try {
      const labels = document.querySelectorAll('span, h3');
      labels.forEach(el => {
        try {
          const txt = (el.innerText || el.textContent || '').trim();
          if (!/\breels?\b/i.test(txt)) return;
          // prefer hiding the interactive ancestor that contains both icon and label
          const interactive = el.closest('[role="button"], [role="link"], a, button, div[role="link"], div[role="button"]');
          if (interactive) addHideClass(interactive);
          else {
            const anc = el.closest('nav, header, [role="navigation"], [role="menubar"], div[role="navigation"]');
            if (anc) addHideClass(anc);
            else addHideClass(el);
          }
        } catch (e) {}
      });
    } catch (e) {}

  

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

  // Read enabled flag from storage and initialize. Listen for storage changes to toggle behavior.
  async function init() {
    addGlobalStyles();
    const data = await new Promise((res) => chrome.storage && chrome.storage.sync
      ? chrome.storage.sync.get({ enabled: true }, res)
      : res({ enabled: true }));
    enabled = Boolean(data.enabled);
    if (isLog()) console.log('[gh-hide-reels] initialized, enabled=', enabled);
    if (enabled) {
      scanExisting();
      observer.observe(document.body || document.documentElement, observerConfig);
    }
    hookHistoryEvents();

    // react to storage changes
    if (chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.enabled) {
          enabled = Boolean(changes.enabled.newValue);
          if (isLog()) console.log('[gh-hide-reels] storage.onChanged enabled=', enabled);
          if (enabled) {
            scanExisting();
            observer.observe(document.body || document.documentElement, observerConfig);
          } else {
            // remove hide class
            document.querySelectorAll('.' + HIDE_CLASS).forEach(el => el.classList.remove(HIDE_CLASS));
            observer.disconnect();
          }
        }
      });
    }

    // listen for explicit toggle events from popup
    window.addEventListener('gh-reels-toggle', () => {
      if (isLog()) console.log('[gh-hide-reels] received gh-reels-toggle event, re-scan');
      if (enabled) scanExisting();
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
