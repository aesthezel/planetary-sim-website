import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlanetCanvas, getScene } from './PlanetCanvas';
import { copy } from '../content/copy';
import { storyProgress, storyStep, prefersReducedMotion } from '../state/store';

gsap.registerPlugin(ScrollTrigger);

export function ZoomSequence() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion.value;

  useEffect(() => {
    if (reducedMotion) return;
    if (!spacerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      onUpdate: (self) => {
        storyProgress.value = self.progress;
        storyStep.value = Math.min(copy.storyBeats.length, Math.floor(self.progress * (copy.storyBeats.length + 1)));
        if (self.progress >= 0.98) getScene()?.stopLoop();
        else getScene()?.startLoop();
      },
      onLeaveBack: () => {
        storyProgress.value = 0;
        storyStep.value = 0;
        getScene()?.setStoryProgress(0);
        getScene()?.startLoop();
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  const handlePulse = () => {
    getScene()?.pulse();
  };

  return (
    <section id={reducedMotion ? 'zoom-static' : 'zoom'}>
      <PlanetCanvas />

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
        <span class="hero-dom__hint"><span aria-hidden="true">↓</span> {copy.hintScroll}</span>
      </div>

      {!reducedMotion && <div ref={spacerRef} class="zoom-spacer" id="zoom-spacer" />}
    </section>
  );
}
