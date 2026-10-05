import { useEffect, useRef } from 'preact/hooks';
import { PlanetCanvas, getScene } from './PlanetCanvas';
import { copy } from '../content/copy';
import { storyProgress, storyStep, prefersReducedMotion } from '../state/store';

/** How long the world takes to fully grow while the visitor stays on the landing. */
const EVOLUTION_MS = 42000;

export function ZoomSequence() {
  const reducedMotion = prefersReducedMotion.value;
  const dragRef = useRef<HTMLDivElement>(null);

  /*
   * The world evolves with the time spent on the landing (not with scroll).
   * Progress pauses as soon as the visitor leaves the first screen.
   */
  useEffect(() => {
    if (reducedMotion) {
      storyProgress.value = 1;
      storyStep.value = copy.storyBeats.length;
      getScene()?.setStoryProgress(1);
      return;
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 250);
      last = now;

      const onLanding = window.scrollY < window.innerHeight * 0.6 && document.visibilityState === 'visible';
      if (!onLanding || storyProgress.value >= 1) return;

      const next = Math.min(1, storyProgress.value + dt / EVOLUTION_MS);
      storyProgress.value = next;
      storyStep.value = Math.min(copy.storyBeats.length, Math.floor(next * (copy.storyBeats.length + 1)));
      getScene()?.setStoryProgress(next);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  /*
   * Left-click drag spins the globe by hand. Native listeners keep this reliable
   * across browsers and avoid interfering with the hero copy or scrolling.
   */
  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;

    let active = false;
    let pointerId = -1;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      active = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      e.preventDefault();
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!active || e.pointerId !== pointerId) return;
      getScene()?.dragRotate(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (!active || e.pointerId !== pointerId) return;
      active = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const handlePulse = () => {
    getScene()?.pulse();
  };

  return (
    <section id={reducedMotion ? 'zoom-static' : 'zoom'}>
      <PlanetCanvas />

      <div ref={dragRef} class="hero-drag" aria-hidden="true" />

      <div class={`hero-dom ${reducedMotion ? 'hero-dom--static' : ''}`} id={reducedMotion ? undefined : 'hero-dom'}>
        <div class="hero-copy">
          <span class="hero-brand"><span aria-hidden="true">✦</span> Planetary Sim</span>
          <span class="hero-kicker"><i aria-hidden="true" />{copy.badge}</span>
          <h1 class="hero-dom__logline">{copy.logline}</h1>
          <p class="hero-dom__elevator">{copy.elevator}</p>
          <div class="hero-actions">
            <a class="btn btn--primary hero-cta" href="#prensa">
              {copy.ctaPublisher} <span aria-hidden="true">↗</span>
            </a>
            <button class="btn btn--pulse" onClick={handlePulse} type="button">
              {copy.ctaPulse} <span aria-hidden="true">✧</span>
            </button>
          </div>
          <span class="hero-platform">Simulación incremental cozy · Un jugador</span>
        </div>
        <span class="hero-dom__hint"><span aria-hidden="true">↻</span> {copy.hintScroll}</span>
      </div>

      {!reducedMotion && <div class="zoom-spacer" id="zoom-spacer" />}
    </section>
  );
}
