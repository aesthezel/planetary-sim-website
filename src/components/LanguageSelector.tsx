import { useState, useRef, useEffect } from 'preact/hooks';
import { locale, setLocale, LOCALES } from '../i18n';
import type { Locale } from '../i18n';
import { copy } from '../content/copy';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div class={`lang-selector ${open ? 'lang-selector--open' : ''}`} ref={ref}>
      <button
        type="button"
        class="lang-selector__trigger"
        aria-label={`${copy.languageSelectorAria}: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span class="lang-selector__flag" aria-hidden="true">{current.flag}</span>
        <span class="lang-selector__code">{current.code.toUpperCase()}</span>
        <svg class="lang-selector__chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      {open && (
        <ul class="lang-selector__dropdown" role="listbox" aria-label={copy.languageSelectAria}>
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale.value}>
              <button
                type="button"
                class={`lang-selector__option ${l.code === locale.value ? 'lang-selector__option--active' : ''}`}
                onClick={() => handleSelect(l.code)}
              >
                <span class="lang-selector__flag" aria-hidden="true">{l.flag}</span>
                <span class="lang-selector__option-label">{l.label}</span>
                {l.code === locale.value && (
                  <svg class="lang-selector__check" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
