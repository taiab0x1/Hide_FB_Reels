// background service worker: set default enabled flag on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ enabled: true });
  }
});

// optional: listen for messages (not used currently)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'getEnabled') {
    chrome.storage.sync.get({ enabled: true }).then(data => sendResponse({ enabled: data.enabled }));
    return true; // indicates async sendResponse
  }
});
