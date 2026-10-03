import { useRef, useEffect } from 'preact/hooks';
import { PlanetScene } from '../three/PlanetScene';
import { zoomProgress } from '../state/store';

/** Singleton scene ref so ZoomSequence can access it */
let sceneInstance: PlanetScene | null = null;
export function getScene(): PlanetScene | null {
  return sceneInstance;
}

export function PlanetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new PlanetScene(canvasRef.current);
    sceneInstance = scene;

    return () => {
      scene.dispose();
      sceneInstance = null;
    };
  }, []);

  // React to zoom progress changes
  useEffect(() => {
    const unsub = zoomProgress.subscribe((p) => {
      sceneInstance?.setZoom(p);
    });
    return unsub;
  }, []);

  return (
    <div class="planet-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} id="planet-canvas" />
    </div>
  );
}
