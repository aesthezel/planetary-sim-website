import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlanetCanvas, getScene } from './PlanetCanvas';
import { copy } from '../content/copy';
import { zoomProgress, prefersReducedMotion, headerVisible } from '../state/store';

gsap.registerPlugin(ScrollTrigger);

export function ZoomSequence() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const heroDomRef = useRef<HTMLDivElement>(null);
  const thresholdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion.value) return;
    if (!spacerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          zoomProgress.value = self.progress;

          // Show header when entered
          if (self.progress >= 0.78 && !headerVisible.value) {
            headerVisible.value = true;
          }

          // Snapshot at threshold for interior continuity
          if (self.progress >= 0.75 && self.progress <= 0.82) {
            const scene = getScene();
            if (scene) {
              const dataUrl = scene.snapshot();
              const interior = document.getElementById('interior-bg');
              if (interior) {
                interior.style.backgroundImage = `url(${dataUrl})`;
              }
            }
          }

          // Stop render loop when fully entered
          if (self.progress >= 0.95) {
            getScene()?.stopLoop();
          }
        },
      },
    });

    // Hero DOM fade out
    if (heroDomRef.current) {
      tl.to(heroDomRef.current, { opacity: 0, y: -40, duration: 0.8 }, 0.4);
    }

    // Threshold flash
    if (thresholdRef.current) {
      tl.fromTo(
        thresholdRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        0.65,
      ).to(thresholdRef.current, { opacity: 0, duration: 0.4 }, 0.8);
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handlePulse = () => {
    getScene()?.pulse();
  };

  // Reduced motion: static hero with enter button
  if (prefersReducedMotion.value) {
    return (
      <section id="zoom-static">
        <PlanetCanvas />
        <div class="hero-dom" style={{ position: 'relative', minHeight: '100vh' }}>
          <span class="pill pill--gold">{copy.badge}</span>
          <h1 class="hero-dom__logline">{copy.logline}</h1>
          <p class="hero-dom__elevator">{copy.elevator}</p>
          <a href="#que-es" class="btn btn--primary">
            Entrar
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="zoom">
      <PlanetCanvas />

      {/* Hero DOM overlay (visible during orbit phase) */}
      <div ref={heroDomRef} class="hero-dom" id="hero-dom">
        <span class="pill pill--gold">{copy.badge}</span>
        <h1 class="hero-dom__logline">{copy.logline}</h1>
        <p class="hero-dom__elevator">{copy.elevator}</p>
        <button class="btn btn--primary" onClick={handlePulse} type="button">
          {copy.ctaPulse}
        </button>
        <span class="hero-dom__hint">{copy.hintScroll}</span>
      </div>

      {/* Threshold flash (warm transition) */}
      <div ref={thresholdRef} class="threshold-flash" id="threshold-flash" />

      {/* Zoom spacer (scroll distance = zoom distance) */}
      <div ref={spacerRef} class="zoom-spacer" id="zoom-spacer" />
    </section>
  );
}
