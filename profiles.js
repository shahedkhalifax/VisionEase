/**
 * Pre-defined accessibility configurations compliant with WCAG 2.2 / EN 301 549.
 */
const AccessibilityProfiles = {
  standard: {
    activeProfile: 'standard',
    fontSizeFactor: 1.0,
    fontWeightBoost: false,
    lineHeight: 1.5,
    letterSpacing: 0,
    paragraphSpacing: 0,
    contrastMode: 'none',
    enhancedFocus: false,
    oversizedCursor: false,
    simplifiedReading: false,
    reduceMotion: false,
    zoomLevel: 1.0
  },
  lowVision: {
    activeProfile: 'lowVision',
    fontSizeFactor: 1.4,
    fontWeightBoost: true,
    lineHeight: 1.8,
    letterSpacing: 0.08,
    paragraphSpacing: 0.5,
    contrastMode: 'none',
    enhancedFocus: true,
    oversizedCursor: true,
    simplifiedReading: false,
    reduceMotion: false,
    zoomLevel: 1.2
  },
  highContrast: {
    activeProfile: 'highContrast',
    fontSizeFactor: 1.2,
    fontWeightBoost: true,
    lineHeight: 1.6,
    letterSpacing: 0.05,
    paragraphSpacing: 0.3,
    contrastMode: 'high-contrast-yellow',
    enhancedFocus: true,
    oversizedCursor: true,
    simplifiedReading: false,
    reduceMotion: false,
    zoomLevel: 1.0
  },
  readingFocus: {
    activeProfile: 'readingFocus',
    fontSizeFactor: 1.25,
    fontWeightBoost: false,
    lineHeight: 2.0,
    letterSpacing: 0.12,
    paragraphSpacing: 1.0,
    contrastMode: 'light',
    enhancedFocus: true,
    oversizedCursor: false,
    simplifiedReading: true,
    reduceMotion: true,
    zoomLevel: 1.0
  },
  reducedMotion: {
    activeProfile: 'reducedMotion',
    fontSizeFactor: 1.0,
    fontWeightBoost: false,
    lineHeight: 1.5,
    letterSpacing: 0,
    paragraphSpacing: 0,
    contrastMode: 'none',
    enhancedFocus: false,
    oversizedCursor: false,
    simplifiedReading: false,
    reduceMotion: true,
    zoomLevel: 1.0
  }
};

if (typeof module !== 'undefined') module.exports = AccessibilityProfiles;