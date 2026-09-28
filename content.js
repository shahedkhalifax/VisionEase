/**
 * Content Script DOM Mutation Engine
 * Applies accessibility classes and updates CSS custom variables safely.
 */
(function () {
    let currentSettings = null;

    async function applyAccessibilityTransformations() {
        if (!document.documentElement) return;

        currentSettings = await StorageManager.getSettings();
        const root = document.documentElement;

        // Reset base classes
        root.classList.add('ve-active');
        root.classList.toggle('ve-font-boost', currentSettings.fontWeightBoost);
        root.classList.toggle('ve-enhanced-focus', currentSettings.enhancedFocus);
        root.classList.toggle('ve-oversized-cursor', currentSettings.oversizedCursor);
        root.classList.toggle('ve-reduce-motion', currentSettings.reduceMotion);
        root.classList.toggle('ve-simplified-reading', currentSettings.simplifiedReading);

        // Apply Typography Variable Adjustments
        root.style.setProperty('--ve-line-height', currentSettings.lineHeight);
        root.style.setProperty('--ve-letter-spacing', `${currentSettings.letterSpacing}em`);
        root.style.setProperty('--ve-para-spacing', `${currentSettings.paragraphSpacing}em`);
        root.style.setProperty('--ve-fg-color', currentSettings.customFgColor);
        root.style.setProperty('--ve-bg-color', currentSettings.customBgColor);

        // Scale Font Size via DOM-safe Zoom Adjustments
        if (currentSettings.fontSizeFactor !== 1.0) {
            document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, h5, h6, label').forEach(el => {
                if (!el.dataset.veOriginalSize) {
                    const computed = window.getComputedStyle(el).fontSize;
                    el.dataset.veOriginalSize = parseFloat(computed);
                }
                const original = parseFloat(el.dataset.veOriginalSize);
                if (!isNaN(original)) {
                    el.style.setProperty('font-size', `${original * currentSettings.fontSizeFactor}px`, 'important');
                }
            });
        } else {
            document.querySelectorAll('[data-ve-original-size]').forEach(el => {
                el.style.removeProperty('font-size');
            });
        }

        // High Contrast Modes
        root.classList.remove('ve-mode-yellow', 've-mode-dark', 've-mode-light', 've-mode-custom');
        if (currentSettings.contrastMode === 'high-contrast-yellow') {
            root.classList.add('ve-mode-yellow');
        } else if (currentSettings.contrastMode === 'dark') {
            root.classList.add('ve-mode-dark');
        } else if (currentSettings.contrastMode === 'light') {
            root.classList.add('ve-mode-light');
        } else if (currentSettings.contrastMode === 'custom') {
            root.classList.add('ve-mode-custom');
        }

        // Controlled Document Zoom
        if (currentSettings.zoomLevel !== 1.0) {
            root.style.setProperty('zoom', currentSettings.zoomLevel);
        } else {
            root.style.removeProperty('zoom');
        }
    }

    // React to Extension Storage Changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.settings) {
            applyAccessibilityTransformations();
        }
    });

    // Listen for execution messages from service worker
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'REAPPLY_ACCESSIBILITY') {
            applyAccessibilityTransformations();
            sendResponse({ status: 'SUCCESS' });
        }
    });

    // Execute initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAccessibilityTransformations);
    } else {
        applyAccessibilityTransformations();
    }
})();
