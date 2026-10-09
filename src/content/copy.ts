/* ============================================
   PLANETARY SIM — Copy (i18n bridge)
   Re-exports reactive translations from i18n.
   Components that import `copy` get the active
   locale automatically via @preact/signals.
   ============================================ */

import { t, type Translation } from '../i18n';

/**
 * Reactive copy object. Reading `copy.xyz` accesses `t.value.xyz`
 * which automatically subscribes Preact components to locale changes.
 *
 * This proxy keeps every existing `copy.field` usage working
 * without touching any import statements in components.
 */
export const copy = new Proxy({} as Translation, {
  get(_target, prop: string) {
    return (t.value as unknown as Record<string, unknown>)[prop];
  },
});
