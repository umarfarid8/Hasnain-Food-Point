import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

/**
 * Open an external URL safely across both native Android WebView and Web browsers.
 * On native Android / Capacitor, uses @capacitor/browser to trigger Android system intents
 * (e.g. launching WhatsApp or Google Maps app directly or in Chrome Custom Tabs).
 * In browser dev mode, falls back to window.open(url, '_blank', 'noopener,noreferrer').
 */
export async function openExternalUrl(url) {
  if (!url) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.warn('Browser.open failed, falling back to window.open:', err);
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (fallbackErr) {
      console.error('Failed to open external link:', fallbackErr);
    }
  }
}

/**
 * Smoothly scrolls to a target in-app section id (e.g. '#menu', 'menu', '#about', '#location').
 * Prevents default event cancellation issues and guarantees scroll navigation works reliably
 * in both Capacitor Android WebView and standard desktop/mobile browsers.
 */
export function scrollToSection(sectionIdOrHref, event = null) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  const id = (sectionIdOrHref || '').startsWith('#')
    ? sectionIdOrHref.slice(1)
    : sectionIdOrHref;

  if (!id) return;

  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.history && typeof window.history.pushState === 'function') {
      window.history.pushState(null, '', '#hero');
    }
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history && typeof window.history.pushState === 'function') {
      window.history.pushState(null, '', `#${id}`);
    }
  }
}
