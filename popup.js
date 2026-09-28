/**
 * Accessible Controller for Extension Popup
 */

document.addEventListener('DOMContentLoaded', async () => {
  const profileSelect = document.getElementById('profileSelect');
  const fontSizeInput = document.getElementById('fontSize');
  const fontSizeVal = document.getElementById('fontSizeVal');
  const lineHeightInput = document.getElementById('lineHeight');
  const lineHeightVal = document.getElementById('lineHeightVal');
  const fontWeightBoost = document.getElementById('fontWeightBoost');
  const contrastMode = document.getElementById('contrastMode');
  const enhancedFocus = document.getElementById('enhancedFocus');
  const oversizedCursor = document.getElementById('oversizedCursor');
  const reduceMotion = document.getElementById('reduceMotion');
  const resetBtn = document.getElementById('resetBtn');
  const openOptions = document.getElementById('openOptions');

  // Load and populate current settings
  async function syncFormState() {
    const settings = await StorageManager.getSettings();
    profileSelect.value = settings.activeProfile;
    fontSizeInput.value = settings.fontSizeFactor;
    fontSizeVal.textContent = `${Math.round(settings.fontSizeFactor * 100)}%`;
    lineHeightInput.value = settings.lineHeight;
    lineHeightVal.textContent = settings.lineHeight;
    fontWeightBoost.checked = settings.fontWeightBoost;
    contrastMode.value = settings.contrastMode;
    enhancedFocus.checked = settings.enhancedFocus;
    oversizedCursor.checked = settings.oversizedCursor;
    reduceMotion.checked = settings.reduceMotion;
  }

  await syncFormState();

  // Event Listeners for Input Binding
  fontSizeInput.addEventListener('input', (e) => {
    fontSizeVal.textContent = `${Math.round(e.target.value * 100)}%`;
    StorageManager.saveSettings({ fontSizeFactor: parseFloat(e.target.value), activeProfile: 'custom' });
  });

  lineHeightInput.addEventListener('input', (e) => {
    lineHeightVal.textContent = e.target.value;
    StorageManager.saveSettings({ lineHeight: parseFloat(e.target.value), activeProfile: 'custom' });
  });

  fontWeightBoost.addEventListener('change', (e) => {
    StorageManager.saveSettings({ fontWeightBoost: e.target.checked, activeProfile: 'custom' });
  });

  contrastMode.addEventListener('change', (e) => {
    StorageManager.saveSettings({ contrastMode: e.target.value, activeProfile: 'custom' });
  });

  enhancedFocus.addEventListener('change', (e) => {
    StorageManager.saveSettings({ enhancedFocus: e.target.checked, activeProfile: 'custom' });
  });

  oversizedCursor.addEventListener('change', (e) => {
    StorageManager.saveSettings({ oversizedCursor: e.target.checked, activeProfile: 'custom' });
  });

  reduceMotion.addEventListener('change', (e) => {
    StorageManager.saveSettings({ reduceMotion: e.target.checked, activeProfile: 'custom' });
  });

  profileSelect.addEventListener('change', async (e) => {
    const selectedKey = e.target.value;
    if (AccessibilityProfiles[selectedKey]) {
      await StorageManager.saveSettings(AccessibilityProfiles[selectedKey]);
      await syncFormState();
    }
  });

  resetBtn.addEventListener('click', async () => {
    await StorageManager.saveSettings(AccessibilityProfiles.standard);
    await syncFormState();
  });

  openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});