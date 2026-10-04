import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlanetScene, type PlanetViewProfile } from '../three/PlanetScene';
import { companionAwake, companionIslands, storyProgress } from '../state/store';

gsap.registerPlugin(ScrollTrigger);

/** Singleton scene ref so the pitch CTA can pulse the same planet. */
let sceneInstance: PlanetScene | null = null;
export function getScene(): PlanetScene | null {
  return sceneInstance;
}

type Rect = { left: number; top: number; width: number; height: number };
type CanvasMode = PlanetViewProfile;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const flightEase = gsap.parseEase('power3.inOut');

function mixRect(a: Rect, b: Rect, t: number): Rect {
  return {
    left: a.left + (b.left - a.left) * t,
    top: a.top + (b.top - a.top) * t,
    width: a.width + (b.width - a.width) * t,
    height: a.height + (b.height - a.height) * t,
  };
}

export function PlanetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const wrapper = canvas.parentElement;
    if (!wrapper) return;

    const scene = new PlanetScene(canvas);
    sceneInstance = scene;

    let currentProfile: CanvasMode | null = null;
    let currentMode: CanvasMode | null = null;
    let bufferWidth = 0;
    let bufferHeight = 0;
    let desktopActive = false;
    let desktopBlend = 0;
    let syncActive = false;
    let syncDelay: gsap.core.Tween | null = null;
    let modeTimeline: gsap.core.Timeline | null = null;
    let desktopExit: gsap.core.Tween | null = null;

    const blendState = { value: 0 };
    const toLeft = gsap.quickTo(wrapper, 'left', { duration: 0.34, ease: 'power3.out' });
    const toTop = gsap.quickTo(wrapper, 'top', { duration: 0.34, ease: 'power3.out' });
    const toWidth = gsap.quickTo(wrapper, 'width', { duration: 0.34, ease: 'power3.out' });
    const toHeight = gsap.quickTo(wrapper, 'height', { duration: 0.34, ease: 'power3.out' });
    const toBlend = gsap.quickTo(blendState, 'value', { duration: 0.28, ease: 'power2.out' });

    const viewport = (): Rect => ({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
    const floatingRect = (): Rect => {
      const size = Math.min(window.innerWidth < 700 ? 112 : 154, window.innerWidth * 0.16);
      return {
        left: window.innerWidth - size - (window.innerWidth < 700 ? 14 : 28),
        top: window.innerHeight - size - (window.innerWidth < 700 ? 72 : 82),
        width: size,
        height: size,
      };
    };

    const animateModeChange = (mode: CanvasMode, immediate: boolean) => {
      if (currentMode === mode) return;
      currentMode = mode;
      wrapper.classList.toggle('planet-canvas-wrap--ambient', mode === 'ambient');
      wrapper.classList.toggle('planet-canvas-wrap--desktop', mode === 'desktop');
      wrapper.style.zIndex = mode === 'hero' ? '1' : '21';
      wrapper.style.transformOrigin = '50% 50%';

      modeTimeline?.kill();
      gsap.killTweensOf(wrapper, 'scale,opacity');
      if (immediate) {
        gsap.set(wrapper, { scale: 1, opacity: 1, rotation: 0 });
        return;
      }

      const from = mode === 'desktop'
        ? { scale: 0.84, opacity: 0.68, rotation: -7 }
        : mode === 'ambient'
          ? { scale: 0.88, opacity: 0.76, rotation: 5 }
          : { scale: 1.045, opacity: 0.82, rotation: 0 };
      modeTimeline = gsap.timeline();
      modeTimeline.fromTo(
        wrapper,
        from,
        {
          scale: 1,
          opacity: mode === 'ambient' ? 0.94 : 1,
          rotation: 0,
          duration: mode === 'desktop' ? 0.7 : 0.58,
          ease: mode === 'desktop' ? 'back.out(1.35)' : 'power3.out',
          overwrite: 'auto',
        },
      );
    };

    const syncViewport = () => {
      if (!currentProfile) return;
      const width = Math.max(1, wrapper.clientWidth);
      const height = Math.max(1, wrapper.clientHeight);
      const resizeForDesktopFit = currentProfile === 'desktop'
        && blendState.value >= 0.985
        && (Math.abs(width - bufferWidth) > 12 || Math.abs(height - bufferHeight) > 12);
      if (resizeForDesktopFit) {
        bufferWidth = Math.round(width);
        bufferHeight = Math.round(height);
      }
      scene.setViewport(width, height, currentProfile, blendState.value, resizeForDesktopFit);
    };

    const scheduleViewportSync = () => {
      if (!syncActive) {
        gsap.ticker.add(syncViewport);
        syncActive = true;
      }
      syncDelay?.kill();
      syncDelay = gsap.delayedCall(0.5, () => {
        gsap.ticker.remove(syncViewport);
        syncActive = false;
        syncViewport();
      });
    };

    const place = (rect: Rect, mode: CanvasMode, blend = 1, immediate = false) => {
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const profileChanged = currentProfile !== mode;
      animateModeChange(mode, immediate);

      wrapper.style.inset = 'auto';
      wrapper.style.right = 'auto';
      wrapper.style.bottom = 'auto';
      if (immediate) {
        gsap.set(wrapper, { left: rect.left, top: rect.top, width, height });
        blendState.value = blend;
      } else {
        toLeft(rect.left);
        toTop(rect.top);
        toWidth(width);
        toHeight(height);
        if (profileChanged) blendState.value = blend;
        else toBlend(blend);
      }

      const nextWidth = Math.round(width);
      const nextHeight = Math.round(height);
      const resizeForStableDesktop = mode === 'desktop' && blend >= 0.985
        && (Math.abs(nextWidth - bufferWidth) > 12 || Math.abs(nextHeight - bufferHeight) > 12);
      const resizeForStableAmbient = mode === 'ambient'
        && (Math.abs(nextWidth - bufferWidth) > 12 || Math.abs(nextHeight - bufferHeight) > 12);
      const resizeBuffer = profileChanged || resizeForStableDesktop || resizeForStableAmbient;
      if (resizeBuffer) {
        bufferWidth = nextWidth;
        bufferHeight = nextHeight;
      }

      currentProfile = mode;
      scene.setViewport(width, height, mode, blendState.value, resizeBuffer);
      if (mode !== 'hero') scene.startLoop();
      scheduleViewportSync();
    };

    const setAmbient = () => place(floatingRect(), 'ambient');
    const fullRect = viewport();
    place(fullRect, 'hero', 0, true);

    const heroTarget = document.getElementById('zoom-spacer') ?? document.getElementById('zoom-static');
    const heroIsStatic = heroTarget?.id === 'zoom-static';
    const heroTrigger = heroTarget
      ? ScrollTrigger.create({
          trigger: heroTarget,
          start: 'top top',
          end: heroIsStatic ? 'bottom top' : 'bottom bottom',
          onEnter: () => place(viewport(), 'hero', 0),
          onEnterBack: () => place(viewport(), 'hero', 0),
          onUpdate: (self) => {
            const progress = heroIsStatic ? self.progress : clamp01((self.progress - 0.84) / 0.16);
            const rect = mixRect(viewport(), floatingRect(), flightEase(progress));
            place(rect, progress >= 1 ? 'ambient' : 'hero', progress);
          },
          onLeave: setAmbient,
          onLeaveBack: () => place(viewport(), 'hero', 0),
        })
      : null;

    const desktopTarget = document.getElementById('companion-planet');
    const placeInDesktopWindow = () => {
      if (!desktopTarget) return;
      const bounds = desktopTarget.getBoundingClientRect();
      const targetRect = { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
      const flyIn = flightEase(desktopBlend);
      place(mixRect(floatingRect(), targetRect, flyIn), 'desktop', desktopBlend);
    };
    const flyOutToAmbient = () => {
      desktopActive = false;
      desktopBlend = 0;
      desktopExit?.kill();
      place(floatingRect(), 'desktop', 0);
      desktopExit = gsap.delayedCall(0.46, setAmbient);
    };

    const desktopTrigger = desktopTarget
      ? ScrollTrigger.create({
          trigger: desktopTarget,
          start: 'top 80%',
          end: 'bottom 12%',
          onUpdate: (self) => {
            desktopActive = true;
            desktopBlend = clamp01(self.progress / 0.4);
            placeInDesktopWindow();
          },
          onEnter: () => {
            desktopExit?.kill();
            desktopActive = true;
            desktopBlend = 0;
            placeInDesktopWindow();
          },
          onEnterBack: () => {
            desktopExit?.kill();
            desktopActive = true;
            placeInDesktopWindow();
          },
          onLeave: flyOutToAmbient,
          onLeaveBack: flyOutToAmbient,
        })
      : null;

    const positionObserver = desktopTarget?.parentElement
      ? new MutationObserver(() => {
          if (desktopActive) placeInDesktopWindow();
        })
      : null;
    if (positionObserver && desktopTarget?.parentElement) {
      positionObserver.observe(desktopTarget.parentElement, { attributes: true, attributeFilter: ['style'] });
    }
    const targetResizeObserver = desktopTarget && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          if (desktopActive) placeInDesktopWindow();
        })
      : null;
    if (desktopTarget) targetResizeObserver?.observe(desktopTarget);

    scene.setCompanionState(companionIslands.value, companionAwake.value);
    const unsubscribeStory = storyProgress.subscribe((progress) => {
      sceneInstance?.setStoryProgress(progress);
    });
    const unsubscribeIslands = companionIslands.subscribe((count) => {
      sceneInstance?.setCompanionState(count, companionAwake.value);
    });
    const unsubscribeAwake = companionAwake.subscribe((awake) => {
      sceneInstance?.setCompanionState(companionIslands.value, awake);
    });

    const onResize = () => {
      ScrollTrigger.refresh();
      if (desktopActive) placeInDesktopWindow();
      else if (!heroTrigger?.isActive) setAmbient();
    };
    window.addEventListener('resize', onResize);
    ScrollTrigger.refresh();

    return () => {
      unsubscribeStory();
      unsubscribeIslands();
      unsubscribeAwake();
      window.removeEventListener('resize', onResize);
      positionObserver?.disconnect();
      targetResizeObserver?.disconnect();
      heroTrigger?.kill();
      desktopTrigger?.kill();
      desktopExit?.kill();
      syncDelay?.kill();
      gsap.ticker.remove(syncViewport);
      modeTimeline?.kill();
      gsap.killTweensOf(wrapper);
      scene.dispose();
      if (sceneInstance === scene) sceneInstance = null;
    };
  }, []);

  return (
    <div class="planet-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} id="planet-canvas" />
    </div>
  );
}
