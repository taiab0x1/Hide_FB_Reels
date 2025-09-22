// Popup script: toggle the extension on/off using chrome.storage.sync
const btn = document.getElementById('toggleBtn');

function updateButton(enabled) {
  btn.textContent = enabled ? 'Hide Facebook Reels: ON' : 'Hide Facebook Reels: OFF';
  btn.style.background = enabled ? '#0b7' : '#ddd';
  btn.style.color = enabled ? '#012' : '#000';
}

btn.addEventListener('click', async () => {
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  const newVal = !enabled;
  await chrome.storage.sync.set({ enabled: newVal });
  updateButton(newVal);
  // Notify active tab(s) to re-run hiding logic
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    for (const t of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: t.id },
        func: () => window.dispatchEvent(new CustomEvent('gh-reels-toggle', { detail: {} })),
      });
    }
  } catch (e) {
    console.error('Failed to notify tabs:', e);
  }
});

// initialize
(async function() {
  const data = await chrome.storage.sync.get({ enabled: true });
  updateButton(Boolean(data.enabled));
})();
