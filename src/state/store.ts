import { signal, computed } from '@preact/signals';

/** Zoom progress: 0 = orbit, 1 = fully inside */
export const zoomProgress = signal(0);

/** Whether the user has "entered" the planet (past threshold) */
export const entered = computed(() => zoomProgress.value >= 0.78);

/** Demo eones counter for animation */
export const eonesDemo = signal(0);

/** Demo species name for animation */
export const especieDemo = signal('Lumínidos');

/** Whether reduced motion is preferred */
export const prefersReducedMotion = signal(
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
);

/** Header visibility (shows after entering) */
export const headerVisible = signal(false);

// Listen for reduced motion changes
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches;
    });
}
