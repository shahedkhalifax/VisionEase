/**
 * Safe local storage manager wrapped in ES6 Promises.
 * Prevents direct calls to chrome.storage and sanitizes inputs.
 */
const StorageManager = {
  SCHEMA_VERSION: 1,

  DEFAULTS: {
    activeProfile: 'standard',
    fontSizeFactor: 1.0,
    fontWeightBoost: false,
    lineHeight: 1.5,
    letterSpacing: 0,
    paragraphSpacing: 0,
    contrastMode: 'none', // 'none' | 'high-contrast-yellow' | 'dark' | 'light' | 'custom'
    customFgColor: '#ffffff',
    customBgColor: '#000000',
    enhancedFocus: false,
    oversizedCursor: false,
    simplifiedReading: false,
    reduceMotion: false,
    zoomLevel: 1.0
  },

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['settings'], (result) => {
        if (chrome.runtime.lastError || !result.settings) {
          resolve({ ...this.DEFAULTS });
        } else {
          resolve(this.sanitize({ ...this.DEFAULTS, ...result.settings }));
        }
      });
    });
  },

  async saveSettings(newSettings) {
    const current = await this.getSettings();
    const updated = this.sanitize({ ...current, ...newSettings });
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ settings: updated }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(updated);
        }
      });
    });
  },

  sanitize(settings) {
    const safe = {};
    safe.activeProfile = String(settings.activeProfile || 'standard');
    safe.fontSizeFactor = Math.min(Math.max(parseFloat(settings.fontSizeFactor) || 1.0, 0.8), 2.5);
    safe.fontWeightBoost = Boolean(settings.fontWeightBoost);
    safe.lineHeight = Math.min(Math.max(parseFloat(settings.lineHeight) || 1.5, 1.0), 3.0);
    safe.letterSpacing = Math.min(Math.max(parseFloat(settings.letterSpacing) || 0, 0), 0.5);
    safe.paragraphSpacing = Math.min(Math.max(parseFloat(settings.paragraphSpacing) || 0, 0), 2.0);
    
    const validModes = ['none', 'high-contrast-yellow', 'dark', 'light', 'custom'];
    safe.contrastMode = validModes.includes(settings.contrastMode) ? settings.contrastMode : 'none';

    // Color hex pattern sanitization
    const hexPattern = /^#([0-9A-F]{3}){1,2}$/i;
    safe.customFgColor = hexPattern.test(settings.customFgColor) ? settings.customFgColor : '#ffffff';
    safe.customBgColor = hexPattern.test(settings.customBgColor) ? settings.customBgColor : '#000000';

    safe.enhancedFocus = Boolean(settings.enhancedFocus);
    safe.oversizedCursor = Boolean(settings.oversizedCursor);
    safe.simplifiedReading = Boolean(settings.simplifiedReading);
    safe.reduceMotion = Boolean(settings.reduceMotion);
    safe.zoomLevel = Math.min(Math.max(parseFloat(settings.zoomLevel) || 1.0, 0.5), 2.0);

    return safe;
  }
};

if (typeof module !== 'undefined') module.exports = StorageManager;