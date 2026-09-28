/**
 * VisionEase - Service Worker
 * Manages extension state, lifecycle events, and content script alignment.
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultSettings = {
      activeProfile: 'standard',
      fontSizeFactor: 1.0,
      fontWeightBoost: false,
      lineHeight: 1.5,
      letterSpacing: 0,
      paragraphSpacing: 0,
      contrastMode: 'none',
      customFgColor: '#ffffff',
      customBgColor: '#000000',
      enhancedFocus: false,
      oversizedCursor: false,
      simplifiedReading: false,
      reduceMotion: false,
      zoomLevel: 1.0
    };

    chrome.storage.local.set({ settings: defaultSettings }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to initialize local settings:', chrome.runtime.lastError);
      }
    });
  }
});

// Sync state on tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.tabs.sendMessage(tabId, { action: 'REAPPLY_ACCESSIBILITY' }).catch(() => {
      // Content script may not be ready or injected on restricted domains
    });
  }
});