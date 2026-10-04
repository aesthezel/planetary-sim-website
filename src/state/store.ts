import { signal } from '@preact/signals';

/** Pinned orbital feature-story progress: 0 = opening, 1 = final feature. */
export const storyProgress = signal(0);
/** Active informational beat in the pinned orbital introduction (0 = opening). */
export const storyStep = signal(0);

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

/** Desktop companion demo (mirrors Unity WindowHandler + OrbitalRing) */
export type LayerMode = 'top' | 'normal' | 'bottom';
export const companionLayer = signal<LayerMode>('top');
export const companionTransparent = signal(true);
export const companionClickThrough = signal(true);
export const companionEones = signal(0);
export const companionIslands = signal(1);
export const companionPopulation = signal(0);
export const companionAwake = signal(false);

// Listen for reduced motion changes
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches;
    });
}
