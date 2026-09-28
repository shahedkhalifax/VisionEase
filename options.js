/**
 * Options Controller with real-time WCAG contrast calculation
 */

document.addEventListener('DOMContentLoaded', async () => {
  const customFgColor = document.getElementById('customFgColor');
  const customBgColor = document.getElementById('customBgColor');
  const contrastScoreDisplay = document.getElementById('contrastScoreDisplay');
  const letterSpacing = document.getElementById('letterSpacing');
  const paragraphSpacing = document.getElementById('paragraphSpacing');
  const simplifiedReading = document.getElementById('simplifiedReading');

  async function updateDisplay() {
    const settings = await StorageManager.getSettings();
    customFgColor.value = settings.customFgColor;
    customBgColor.value = settings.customBgColor;
    letterSpacing.value = settings.letterSpacing;
    paragraphSpacing.value = settings.paragraphSpacing;
    simplifiedReading.checked = settings.simplifiedReading;
    recalculateContrast();
  }

  function recalculateContrast() {
    const fg = customFgColor.value;
    const bg = customBgColor.value;
    const ratio = AccessibilityEngine.getContrastRatio(fg, bg).toFixed(2);

    let rating = 'Fails WCAG';
    if (ratio >= 7.0) {
      rating = 'Passes WCAG AAA (Enhanced)';
    } else if (ratio >= 4.5) {
      rating = 'Passes WCAG AA (Minimum)';
    }

    contrastScoreDisplay.innerHTML = `Calculated Contrast Ratio: <strong>${ratio}:1</strong> — <span>${rating}</span>`;
  }

  await updateDisplay();

  customFgColor.addEventListener('input', () => {
    recalculateContrast();
    StorageManager.saveSettings({ customFgColor: customFgColor.value, contrastMode: 'custom' });
  });

  customBgColor.addEventListener('input', () => {
    recalculateContrast();
    StorageManager.saveSettings({ customBgColor: customBgColor.value, contrastMode: 'custom' });
  });

  letterSpacing.addEventListener('input', (e) => {
    StorageManager.saveSettings({ letterSpacing: parseFloat(e.target.value) });
  });

  paragraphSpacing.addEventListener('input', (e) => {
    StorageManager.saveSettings({ paragraphSpacing: parseFloat(e.target.value) });
  });

  simplifiedReading.addEventListener('change', (e) => {
    StorageManager.saveSettings({ simplifiedReading: e.target.checked });
  });
});