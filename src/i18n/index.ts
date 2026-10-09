/* ============================================
   i18n Core — Signal-based locale switching
   Uses @preact/signals for reactive translations.
   ============================================ */

import { signal, computed } from '@preact/signals';
import { es } from './es';
import { en } from './en';
import { ptBR } from './pt-BR';
import type { Locale, Translation } from './types';

export type { Locale, Translation };
export { LOCALES } from './types';

const TRANSLATIONS: Record<Locale, Translation> = {
  es,
  en,
  'pt-BR': ptBR,
};

const STORAGE_KEY = 'planetary-sim-locale';

/** Detect the best initial locale from browser or localStorage. */
function detectLocale(): Locale {
  // 1. Saved preference
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in TRANSLATIONS) return saved;
  }

  // 2. Browser language
  if (typeof navigator !== 'undefined') {
    for (const lang of navigator.languages ?? [navigator.language]) {
      const lower = lang.toLowerCase();
      if (lower.startsWith('pt')) return 'pt-BR';
      if (lower.startsWith('en')) return 'en';
      if (lower.startsWith('es')) return 'es';
    }
  }

  // 3. Default
  return 'es';
}

/** Current locale signal — drives all reactive translations. */
export const locale = signal<Locale>(detectLocale());

/** Keep the document language in sync with the active locale. */
function applyDocumentLocale(code: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }
}

// Apply the detected locale on first load (not only after a manual switch).
applyDocumentLocale(locale.value);

/** Computed translation object — re-evaluates whenever locale changes. */
export const t = computed<Translation>(() => TRANSLATIONS[locale.value]);

/** Locale-aware number formatting that re-renders with the active locale. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale.value, options).format(value);
}

/** Switch locale and persist the choice. */
export function setLocale(code: Locale) {
  locale.value = code;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, code);
  }
  // Update the html lang attribute for accessibility/SEO
  applyDocumentLocale(code);
}
