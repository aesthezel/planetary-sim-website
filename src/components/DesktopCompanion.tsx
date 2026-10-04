import { useEffect, useRef, useState } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { copy } from '../content/copy';
import { Reveal } from './Reveal';
import {
  companionAwake,
  companionClickThrough,
  companionEones,
  companionIslands,
  companionLayer,
  companionPopulation,
  prefersReducedMotion,
  companionTransparent,
  type LayerMode,
} from '../state/store';

const WIN = 260;
const DRAG_THRESHOLD = 5;
const MAX_ISLANDS = 6;

type Panel = keyof typeof copy.radialPanels | null;

gsap.registerPlugin(ScrollTrigger);

export function DesktopCompanion() {
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [radial, setRadial] = useState(false);
  const [summary, setSummary] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [emerge, setEmerge] = useState(0);
  const [spark, setSpark] = useState<{ x: number; y: number } | null>(null);
  const [desktopClicks, setDesktopClicks] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [winFront, setWinFront] = useState(false);

  useEffect(() => {
    const screen = stageRef.current;
    if (!screen || prefersReducedMotion.value) return;
    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: screen,
          start: 'top 84%',
          end: 'bottom 24%',
          scrub: 0.65,
        },
      })
        .fromTo(screen,
          { autoAlpha: 0, y: 54, scale: 0.94, rotationX: 2 },
          { autoAlpha: 1, y: 0, scale: 1, rotationX: 0, duration: 0.68, ease: 'power3.out' },
        )
        .to(screen,
          { autoAlpha: 0, y: -28, scale: 0.98, duration: 0.32, ease: 'power2.in' },
          0.78,
        );
    }, screen);
    return () => context.revert();
  }, []);

  const layer = companionLayer.value;
  const transparent = companionTransparent.value;
  const through = companionClickThrough.value;
  const awake = companionAwake.value;
  const islands = companionIslands.value;

  /* Passive simulation: eones, population and island emergence */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!companionAwake.value) return;
      companionEones.value = Math.round((companionEones.value + 0.01) * 100) / 100;
      companionPopulation.value += companionIslands.value * 3;
      setEmerge((e) => bumpEmerge(e, 1.5));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  function bumpEmerge(e: number, amount: number) {
    const next = e + amount;
    if (next < 100) return next;
    if (companionIslands.value < MAX_ISLANDS) companionIslands.value += 1;
    return 0;
  }

  /* Astral mote appears from time to time once awake */
  useEffect(() => {
    if (!awake) return;
    const id = window.setInterval(() => {
      setSpark((s) => s ?? { x: 94 + Math.random() * 4, y: 14 + Math.random() * 24 });
    }, 7000);
    const first = window.setTimeout(() => setSpark({ x: 96, y: 24 }), 1500);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(first);
    };
  }, [awake]);

  const clampPos = (x: number, y: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const mx = Math.min(0.5, WIN / 2 / rect.width);
    const my = Math.min(0.5, WIN / 2 / rect.height);
    return {
      x: Math.min(1 - mx, Math.max(mx, x)),
      y: Math.min(1 - my, Math.max(my, y)),
    };
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      moved: false,
      sx: e.clientX,
      sy: e.clientY,
      ox: pos.x,
      oy: pos.y,
    };
  };

  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    d.moved = true;
    setRadial(false);
    setSummary(false);
    const rect = stageRef.current!.getBoundingClientRect();
    setPos(clampPos(d.ox + dx / rect.width, d.oy + dy / rect.height));
  };

  const onPointerUp = (e: PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (d.moved) return;
    leftClick();
  };

  const leftClick = () => {
    setSummary(false);
    setPanel(null);
    if (!companionAwake.value) {
      companionAwake.value = true;
      companionPopulation.value = 12;
      return;
    }
    setEmerge((v) => bumpEmerge(v, 20));
    setRadial((r) => !r);
  };

  const rightClick = (e: Event) => {
    e.preventDefault();
    if (!companionAwake.value) return;
    setRadial(false);
    setPanel(null);
    setSummary((s) => !s);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      leftClick();
    } else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      rightClick(e);
    } else if (e.key === 'Escape') {
      setRadial(false);
      setSummary(false);
      setPanel(null);
    }
  };

  const collectSpark = () => {
    companionEones.value = Math.round((companionEones.value + 0.05) * 100) / 100;
    setSpark(null);
  };

  const openPanel = (id: keyof typeof copy.radialPanels) => {
    setPanel(id);
    setRadial(false);
  };

  const reset = () => {
    companionAwake.value = false;
    companionEones.value = 0;
    companionIslands.value = 1;
    companionPopulation.value = 0;
    setRadial(false);
    setSummary(false);
    setPanel(null);
    setSpark(null);
    setEmerge(0);
    setPos({ x: 0.5, y: 0.5 });
    setDesktopClicks(0);
    setBlocked(0);
  };

  const onDesktopClick = () => {
    setDesktopClicks((c) => c + 1);
    setRadial(false);
    setSummary(false);
    setPanel(null);
  };

  const planetZ = layer === 'top' ? 30 : layer === 'normal' ? (winFront ? 10 : 30) : 5;
  const winZ = layer === 'top' ? 20 : layer === 'normal' ? (winFront ? 30 : 20) : 20;
  const temp = 14 + islands * 1.5;
  const tempLabel = temp < 16 ? 'Frío' : temp < 22 ? 'Templado' : 'Caluroso';
  const aura = awake
    ? `0 0 ${24 + islands * 6}px ${6 + islands}px rgba(${temp < 16 ? '110,143,171' : '212,160,110'},0.45)`
    : '0 0 18px 2px rgba(142,166,192,0.35)';

  return (
    <section id="companero" class="section section--cream" style={{ background: 'var(--cream-warm)' }}>
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">{copy.companionLabel}</span>
            <h2 class="section-header__title">{copy.companionTitle}</h2>
            <p class="section-header__subtitle">{copy.companionDescription}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div class="companion">
            <div class="companion__controls" role="group" aria-label="Opciones de ventana">
              <div class="seg" role="radiogroup" aria-label="Capa de la ventana">
                {copy.companionLayers.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={layer === l.id}
                    class={`seg__btn ${layer === l.id ? 'is-on' : ''}`}
                    title={l.note}
                    onClick={() => {
                      companionLayer.value = l.id as LayerMode;
                      setWinFront(false);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <label class="toggle">
                <input
                  type="checkbox"
                  checked={transparent}
                  onChange={(e) => (companionTransparent.value = (e.target as HTMLInputElement).checked)}
                />
                <span>{copy.companionToggles.transparent}</span>
              </label>
              <label class="toggle">
                <input
                  type="checkbox"
                  checked={through}
                  onChange={(e) => (companionClickThrough.value = (e.target as HTMLInputElement).checked)}
                />
                <span>{copy.companionToggles.clickThrough}</span>
              </label>
              <button type="button" class="seg__btn" disabled={!awake} onClick={() => { setSummary((s) => !s); setRadial(false); setPanel(null); }}>
                Resumen
              </button>
              <button type="button" class="seg__btn" onClick={reset}>
                Reiniciar
              </button>
            </div>

            <div class="desk" ref={stageRef} onClick={onDesktopClick}>
              <div class="desk__icons" aria-hidden="true">
                <span>🗂️<small>Proyectos</small></span>
                <span>📝<small>Notas</small></span>
              </div>

              <div
                class="desk__window"
                style={{ zIndex: winZ }}
                onClick={(e) => {
                  e.stopPropagation();
                  setWinFront(true);
                  setDesktopClicks((c) => c + 1);
                }}
              >
                <div class="desk__titlebar">
                  <i /> <i /> <i /> <b>Notas.txt</b>
                </div>
                <p>Reunión 16:00</p>
                <p>Revisar entregas</p>
                <p class="desk__counter">
                  Clics recibidos: <strong>{desktopClicks}</strong>
                </p>
              </div>

              <div
                class={`pwin ${transparent ? '' : 'pwin--solid'} ${through ? 'pwin--through' : ''}`}
                style={{
                  zIndex: planetZ,
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  width: `${WIN}px`,
                  height: `${WIN}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!through) {
                    setBlocked((b) => b + 1);
                    setWinFront(false);
                  }
                }}
              >
                {spark && awake && (
                  <button
                    type="button"
                    class="mote"
                    style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      collectSpark();
                    }}
                    aria-label="Recoger mota astral"
                  >
                    ✧
                  </button>
                )}

                <div
                  id="companion-planet"
                  class={`planet planet--canvas-backed ${awake ? 'is-awake' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={awake ? 'Planeta: clic para abrir el anillo orbital' : 'Planeta dormido: clic para despertar la vida'}
                  style={{ boxShadow: aura }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onContextMenu={rightClick}
                  onKeyDown={onKeyDown}
                  onClick={(e) => e.stopPropagation()}
                />

                {radial && (
                  <ul class="radial" aria-label="Anillo orbital">
                    {copy.radialLabels.map((r, i) => {
                      const a = (-90 + (360 / copy.radialLabels.length) * i) * (Math.PI / 180);
                      return (
                        <li
                          key={r.id}
                          style={{ left: `${50 + Math.cos(a) * 52}%`, top: `${50 + Math.sin(a) * 52}%` }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPanel(r.id as keyof typeof copy.radialPanels);
                            }}
                          >
                            <span aria-hidden="true">{r.glyph}</span> {r.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {summary && (
                  <div class="stats-card" onClick={(e) => e.stopPropagation()}>
                    <div class="stats-card__tiles">
                      <div class="tile tile--islands"><small>Islas</small><b>{islands}</b></div>
                      <div class="tile tile--pop"><small>Habitantes</small><b>{formatCompact(companionPopulation.value)}</b></div>
                      <div class="tile tile--temp"><small>Temperatura</small><b>{temp.toFixed(1)}°</b></div>
                      <div class="tile tile--eons"><small>Eones</small><b>{companionEones.value.toFixed(2)}</b></div>
                    </div>
                    <p>{tempLabel} · Fase Planetaria</p>
                    <div class="bar" aria-label="Emergencia de isla"><i style={{ width: `${Math.min(emerge, 100)}%` }} /></div>
                    <small>Clic izquierdo abre el anillo orbital.</small>
                  </div>
                )}

                {panel && (
                  <div class="menu-panel" role="dialog" aria-label={copy.radialLabels.find((r) => r.id === panel)?.label}>
                    <button type="button" class="menu-panel__x" aria-label="Cerrar" onClick={(e) => { e.stopPropagation(); setPanel(null); }}>
                      ×
                    </button>
                    <h4>{copy.radialLabels.find((r) => r.id === panel)?.label}</h4>
                    <p>{copy.radialPanels[panel]}</p>
                  </div>
                )}
              </div>

              <div class="desk__taskbar" aria-hidden="true">
                <span>⊞</span>
                <span class="desk__tray">
                  {through ? 'Clic a través: activo' : `Ventana captura clics (${blocked})`}
                </span>
              </div>
            </div>

            <p class="companion__hint">{copy.companionHint}</p>
            <p class="companion__note text-muted">{copy.companionNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  const units = ['K', 'M', 'B'];
  let v = n;
  let i = -1;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return `${v.toFixed(v < 10 ? 1 : 0).replace('.', ',').replace(/,0$/, '')}${units[i]}`;
}
