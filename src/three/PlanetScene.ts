/**
 * PlanetScene.ts — Main Three.js scene controller.
 *
 * Manages: init, render loop, zoom control, pulse, dispose, snapshot.
 * Camera: fixed distant orbital framing. Scroll progress reveals the pitch features.
 */

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  Clock,
  Vector3,
  MathUtils,
} from 'three';
import { createPlanet, type PlanetFactoryResult } from './planetFactory';

export type PlanetViewProfile = 'hero' | 'ambient' | 'desktop';

export class PlanetScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private planet: PlanetFactoryResult;
  private animationId: number | null = null;
  private disposed = false;
  private viewProfile: PlanetViewProfile = 'hero';
  private viewportWidth = 0;
  private viewportHeight = 0;
  private storyProgress = 0;
  private companionIslandCount = 1;
  private companionAwake = false;

  // Fixed orbital framing for the scroll-driven feature story.
  private readonly CAM_Z_START = 6.8;
  private readonly CAM_Z_MOBILE = 6.3;
  private readonly FOV = 38;

  // Keep the globe on the right half, clear of the pitch column.
  private lookTarget = new Vector3(0, 0, 0);
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // Scene
    this.scene = new Scene();
    this.scene.background = null;

    // Camera
    this.camera = new PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    this.applyCameraProfile('hero', window.innerWidth / window.innerHeight, window.innerWidth);

    // Renderer
    const dpr = Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2);
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    // Lights (from plan: directional warm + hemisphere sky/earth + rim blue)
    const dirLight = new DirectionalLight(0xfff3d6, 1.2);
    dirLight.position.set(3, 2, 4);
    this.scene.add(dirLight);

    const hemiLight = new HemisphereLight(0x6e8fab, 0x8b7355, 0.6);
    this.scene.add(hemiLight);

    const rimLight = new DirectionalLight(0x6e8fab, 0.4);
    rimLight.position.set(-3, 1, -2);
    this.scene.add(rimLight);

    // Create planet
    this.planet = createPlanet('Mundo');
    this.scene.add(this.planet.group);
    this.setStoryProgress(0);

    // Clock
    this.clock = new Clock();

    // Start loop
    this.animate();
  }

  /** Resize the one shared canvas as it moves from orbit to the desktop companion window. */
  setViewport(width: number, height: number, profile: PlanetViewProfile, blend = 1, resizeBuffer = false): void {
    if (this.disposed || width <= 0 || height <= 0) return;
    const viewportWidth = Math.round(width);
    const viewportHeight = Math.round(height);
    const profileChanged = this.viewProfile !== profile;
    if (profileChanged) {
      const dprCap = profile === 'hero' && !isMobile() ? 1.75 : 1.5;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      this.viewProfile = profile;
      (this.planet.stars.material as any).opacity = profile === 'hero' ? 0.25 : profile === 'ambient' ? 0.1 : 0.035;
      (this.planet.motas.material as any).opacity = profile === 'desktop' ? 0.42 : 0.72;
    }
    if (resizeBuffer && (Math.abs(viewportWidth - this.viewportWidth) > 8 || Math.abs(viewportHeight - this.viewportHeight) > 8)) {
      this.renderer.setSize(viewportWidth, viewportHeight, false);
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
    }
    this.applyCameraProfile(profile, viewportWidth / viewportHeight, window.innerWidth, blend);
    if (profileChanged) {
      if (profile === 'desktop') {
        this.applyDesktopIslands();
        this.applyCompanionAura();
      } else {
        this.applyStoryIslands();
        this.planet.animatedMaterials.aura.uniforms.uWarmth.value = MathUtils.lerp(0.3, 0.9, this.storyProgress);
        this.planet.animatedMaterials.aura.uniforms.uOpacity.value = 0.5;
      }
    }
  }

  /* ---- Scroll-story control (0 = opening, 1 = final feature) ---- */
  setStoryProgress(progress: number): void {
    const p = MathUtils.clamp(progress, 0, 1);
    this.storyProgress = p;
    if (this.viewProfile === 'desktop') return;
    this.applyStoryIslands();

    // Keep stars and orbital UI present as a frame for the feature callouts.
    (this.planet.orbitalRing.material as any).opacity = 0.18;
    this.planet.animatedMaterials.atmosphere.uniforms.uOpacity.value = 0.04 + p * 0.1;

    // Aura warmth
    this.planet.animatedMaterials.aura.uniforms.uWarmth.value = MathUtils.lerp(0.3, 0.9, p);

    (this.planet.motas.material as any).opacity = 0.72;
    this.canvas.parentElement?.style.setProperty('--story-progress', String(p));
  }

  /** Mirror the companion demo's island count while the canvas is inside its PC window. */
  setCompanionState(islandCount: number, awake: boolean): void {
    this.companionIslandCount = Math.max(1, islandCount);
    this.companionAwake = awake;
    if (this.viewProfile === 'desktop') {
      this.applyDesktopIslands();
      this.applyCompanionAura();
    }
  }

  private applyStoryIslands(): void {
    let visibleCoasts = 1;
    for (let i = 1; i < this.planet.islands.length; i++) {
      const emergeStart = 0.12 + (i - 1) * 0.12;
      const emergeEnd = emergeStart + 0.1;
      const s = MathUtils.smoothstep(this.storyProgress, emergeStart, emergeEnd);
      this.planet.islands[i].mesh.scale.setScalar(s);
      if (s > 0.08) visibleCoasts = i + 1;
    }
    this.planet.animatedMaterials.water.uniforms.uIslandCount.value = visibleCoasts;
  }

  private applyDesktopIslands(): void {
    const visible = Math.min(this.planet.islands.length, this.companionIslandCount);
    for (let i = 0; i < this.planet.islands.length; i++) {
      this.planet.islands[i].mesh.scale.setScalar(i < visible ? 1 : 0);
    }
    this.planet.animatedMaterials.water.uniforms.uIslandCount.value = visible;
  }

  private applyCompanionAura(): void {
    this.planet.animatedMaterials.aura.uniforms.uOpacity.value = this.companionAwake ? 0.85 : 0.32;
    this.planet.animatedMaterials.aura.uniforms.uWarmth.value = this.companionAwake ? 0.72 : 0.18;
  }

  /* ---- Pulse effect (CTA "Despertar el planeta") ---- */
  pulse(): void {
    const auraMat = this.planet.animatedMaterials.aura;
    const startOpacity = auraMat.uniforms.uOpacity.value;
    const start = performance.now();
    const duration = 800;

    const doPulse = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const pulseVal = t < 0.5 ? startOpacity + 0.5 * ease : startOpacity + 0.5 * (1 - ease);
      auraMat.uniforms.uOpacity.value = pulseVal;
      if (t < 1) requestAnimationFrame(doPulse);
    };
    requestAnimationFrame(doPulse);
  }

  /* ---- Snapshot (for interior background continuity) ---- */
  snapshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.canvas.toDataURL('image/webp', 0.7);
  }

  /* ---- Stop the render loop (post-entry, save GPU) ---- */
  stopLoop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /* ---- Resume the render loop (user scrolled back up) ---- */
  startLoop(): void {
    if (this.disposed || this.animationId !== null) return;
    this.animate();
  }

  /* ---- Dispose everything ---- */
  dispose(): void {
    this.disposed = true;
    this.stopLoop();
    this.renderer.dispose();
    this.scene.clear();
  }

  /* ---- Private: render loop ---- */
  private animate = (): void => {
    if (this.disposed) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // The globe turns smoothly and slowly; only the water follows Unity's stop-motion clock.
    this.planet.group.rotation.y = elapsed * 0.04;

    // The tiny ship follows its own slow orbital path.
    const boatAngle = elapsed * 0.045;
    const boatR = 1.12;
    this.planet.boat.position.set(
      Math.cos(boatAngle) * boatR,
      Math.sin(boatAngle * 0.3) * 0.02,
      Math.sin(boatAngle) * boatR,
    );
    this.planet.boat.lookAt(0, 0, 0);

    // Update water shader time
    this.planet.animatedMaterials.water.uniforms.uTime.value = elapsed;

    // Stars twinkle gently in orbit and fade back inside the simulated desktop window.
    const starBase = this.viewProfile === 'hero' ? 0.22 : this.viewProfile === 'ambient' ? 0.08 : 0.025;
    (this.planet.stars.material as any).opacity = starBase + (Math.sin(elapsed * 0.7) + 1) * (this.viewProfile === 'hero' ? 0.035 : 0.012);

    // Motas subtle oscillation
    this.planet.motas.rotation.y = elapsed * 0.02;

    // Camera lookAt
    this.camera.lookAt(this.lookTarget);

    // Render
    this.renderer.render(this.scene, this.camera);
  };

  private applyCameraProfile(profile: PlanetViewProfile, aspect: number, screenWidth: number, blend = 1): void {
    this.camera.aspect = aspect;
    const mobile = screenWidth < 768;
    const heroX = mobile ? -0.28 : -0.52;
    const heroY = mobile ? 0.35 : 0.18;
    const heroZ = mobile ? this.CAM_Z_MOBILE : this.CAM_Z_START;
    const heroTargetX = mobile ? -0.9 : -1.45;
    const heroTargetY = mobile ? 0.72 : 0;
    if (profile === 'hero') {
      this.camera.position.set(
        MathUtils.lerp(heroX, 0, blend),
        MathUtils.lerp(heroY, 0.12, blend),
        MathUtils.lerp(heroZ, 4.6, blend),
      );
      this.lookTarget.set(MathUtils.lerp(heroTargetX, 0, blend), MathUtils.lerp(heroTargetY, 0, blend), 0);
    } else {
      this.camera.position.set(0, 0.12, profile === 'desktop' ? MathUtils.lerp(4.6, 3.9, blend) : 4.6);
      this.lookTarget.set(0, 0, 0);
    }
    this.camera.updateProjectionMatrix();
  }
}

/* ---- Utils ---- */
function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}
