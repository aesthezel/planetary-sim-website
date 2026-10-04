import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlanetCanvas, getScene } from './PlanetCanvas';
import { StoryHighlights } from './StoryHighlights';
import { copy } from '../content/copy';
import { storyProgress, storyStep, prefersReducedMotion } from '../state/store';

gsap.registerPlugin(ScrollTrigger);

export function ZoomSequence() {
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion.value) return;
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
  }, []);

  const handleStoryJump = (step: number) => {
    if (prefersReducedMotion.value || !spacerRef.current) {
      storyStep.value = step;
      getScene()?.setStoryProgress(step / (copy.storyBeats.length + 1));
      return;
    }

    const spacer = spacerRef.current;
    const progress = (step + 0.5) / (copy.storyBeats.length + 1);
    const start = spacer.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, spacer.offsetHeight - window.innerHeight);
    window.scrollTo({ top: start + range * progress, behavior: 'smooth' });
  };

  const handlePulse = () => {
    getScene()?.pulse();
  };

  // Reduced motion: static hero with enter button
  if (prefersReducedMotion.value) {
    return (
      <section id="zoom-static">
        <PlanetCanvas />
        <div class="hero-dom hero-dom--static">
          <div class="hero-copy">
            <span class="hero-brand"><span aria-hidden="true">✧</span> Planetary Sim</span>
            <span class="hero-kicker">{copy.badge}</span>
            <h1 class="hero-dom__logline">{copy.logline}</h1>
            <p class="hero-dom__elevator">{copy.elevator}</p>
            <button class="btn btn--primary hero-cta" onClick={handlePulse} type="button">{copy.ctaPulse} ✧</button>
            <StoryHighlights onJump={handleStoryJump} />
          </div>
          <span class="hero-dom__hint">{copy.hintScroll}</span>
        </div>
      </section>
    );
  }

  return (
    <section id="zoom">
      <PlanetCanvas />

      {/* Hero DOM overlay (visible during orbit phase) */}
      <div class="hero-dom" id="hero-dom">
        <div class="hero-copy">
          <span class="hero-brand"><span aria-hidden="true">✧</span> Planetary Sim</span>
          <span class="hero-kicker">{copy.badge}</span>
          <h1 class="hero-dom__logline">{copy.logline}</h1>
          <p class="hero-dom__elevator">{copy.elevator}</p>
          <button class="btn btn--primary hero-cta" onClick={handlePulse} type="button">
            {copy.ctaPulse} <span aria-hidden="true">✧</span>
          </button>
          <StoryHighlights onJump={handleStoryJump} />
        </div>
        <aside class="orbital-caption" aria-label="Estilo visual del planeta en Unity">
          <span aria-hidden="true">◉</span>
          <span>Agua toon · espuma costera · acabado clay · stop-motion 12 fps</span>
        </aside>
        <span class="hero-dom__hint"><span aria-hidden="true">↓</span> Desliza para recorrer la demo</span>
      </div>

      {/* Scroll through the feature story while the orbital view stays fixed. */}
      <div ref={spacerRef} class="zoom-spacer" id="zoom-spacer" />
    </section>
  );
}
