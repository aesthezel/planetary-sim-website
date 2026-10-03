/**
 * PlanetScene.ts — Main Three.js scene controller.
 *
 * Manages: init, render loop, zoom control, pulse, dispose, snapshot.
 * Camera: always looks at main island (lerp), FOV fixed at 38°.
 * Zoom driven by setZoom(progress: 0→1).
 */

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  Color,
  Clock,
  Vector3,
  MathUtils,
} from 'three';
import { createPlanet, type PlanetFactoryResult } from './planetFactory';

export class PlanetScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private planet: PlanetFactoryResult;
  private animationId: number | null = null;
  private boatAngle = 0;
  private disposed = false;

  // Camera zoom endpoints (from plan)
  private readonly CAM_Z_START = 4.4;
  private readonly CAM_Z_MID = 2.4;
  private readonly CAM_Z_END = 1.28;
  private readonly FOV = 38;

  // Lerp target for lookAt
  private lookTarget = new Vector3(0, 0, 0);
  private islandTarget: Vector3;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // Scene
    this.scene = new Scene();
    this.scene.background = new Color(0x0b0e1a);

    // Camera
    this.camera = new PerspectiveCamera(this.FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.3, this.CAM_Z_START);

    // Renderer
    const dpr = Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2);
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

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

    // Island target for lookAt lerp
    this.islandTarget = this.planet.islands[0]?.basePosition.clone() ?? new Vector3(0, 0, 0);

    // Clock
    this.clock = new Clock();

    // Resize handler
    window.addEventListener('resize', this.onResize);

    // Start loop
    this.animate();
  }

  /* ---- Zoom control (0 = orbit, 1 = inside) ---- */
  setZoom(progress: number): void {
    const p = MathUtils.clamp(progress, 0, 1);

    // Camera Z: interpolate through start → mid → end
    let camZ: number;
    if (p < 0.5) {
      const t = p / 0.5;
      camZ = MathUtils.lerp(this.CAM_Z_START, this.CAM_Z_MID, t);
    } else {
      const t = (p - 0.5) / 0.5;
      camZ = MathUtils.lerp(this.CAM_Z_MID, this.CAM_Z_END, t);
    }
    this.camera.position.z = camZ;

    // LookAt lerp: center → main island
    const lookLerp = MathUtils.smoothstep(p, 0.3, 0.8);
    this.lookTarget.lerpVectors(new Vector3(0, 0, 0), this.islandTarget, lookLerp * 0.3);

    // Islands emerge (25-60% of zoom)
    for (let i = 1; i < this.planet.islands.length; i++) {
      const emergeStart = 0.25 + (i - 1) * 0.08;
      const emergeEnd = emergeStart + 0.15;
      const s = MathUtils.smoothstep(p, emergeStart, emergeEnd);
      this.planet.islands[i].mesh.scale.setScalar(s);
    }

    // Orbital ring fade out (0-50%)
    const ringOpacity = 1 - MathUtils.smoothstep(p, 0.2, 0.5);
    (this.planet.orbitalRing.material as any).opacity = ringOpacity * 0.15;

    // Stars fade out (20-60%)
    const starOpacity = 1 - MathUtils.smoothstep(p, 0.2, 0.6);
    (this.planet.stars.material as any).opacity = starOpacity * 0.8;

    // Atmosphere grow (60-90%)
    const atmoOpacity = MathUtils.smoothstep(p, 0.6, 0.9);
    this.planet.animatedMaterials.atmosphere.uniforms.uOpacity.value = atmoOpacity;

    // Aura warmth
    this.planet.animatedMaterials.aura.uniforms.uWarmth.value = MathUtils.lerp(0.3, 0.9, p);

    // Motas fade for close-up
    const motaOpacity = 1 - MathUtils.smoothstep(p, 0.7, 0.95);
    (this.planet.motas.material as any).opacity = motaOpacity * 0.7;

    // Scene background color lerp
    const bgColor = new Color(0x0b0e1a).lerp(new Color(0xfff8e7), MathUtils.smoothstep(p, 0.65, 0.85));
    this.scene.background = bgColor;
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

  /* ---- Dispose everything ---- */
  dispose(): void {
    this.disposed = true;
    this.stopLoop();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.scene.clear();
  }

  /* ---- Private: render loop ---- */
  private animate = (): void => {
    if (this.disposed) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // Quantize rotation to ~10fps for stop-motion feel (planet rotates, camera stays smooth)
    const qt = Math.floor(elapsed * 10) / 10;

    // Planet slow rotation
    this.planet.group.rotation.y = qt * 0.05;

    // Boat orbit
    this.boatAngle += 0.003;
    const boatR = 1.12;
    this.planet.boat.position.set(
      Math.cos(this.boatAngle) * boatR,
      Math.sin(this.boatAngle * 0.3) * 0.02,
      Math.sin(this.boatAngle) * boatR,
    );
    this.planet.boat.lookAt(0, 0, 0);

    // Update water shader time
    this.planet.animatedMaterials.water.uniforms.uTime.value = elapsed;

    // Motas subtle oscillation
    this.planet.motas.rotation.y = elapsed * 0.02;

    // Camera lookAt
    this.camera.lookAt(this.lookTarget);

    // Render
    this.renderer.render(this.scene, this.camera);
  };

  /* ---- Resize ---- */
  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };
}

/* ---- Utils ---- */
function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}
