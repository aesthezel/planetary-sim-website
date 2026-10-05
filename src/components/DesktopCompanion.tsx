import { useEffect, useRef, useState } from 'preact/hooks';
import { copy } from '../content/copy';
import { Reveal } from './Reveal';
import {
  companionAwake,
  companionEones,
  companionIslands,
  companionPopulation,
} from '../state/store';

interface Win { id: string; title: string; text: string; x: number; y: number; min: boolean; open: boolean; glyph: string; color: string }

const DESK_ICONS = [
  { glyph: '📁', label: 'Proyectos' },
  { glyph: '📄', label: 'notas.txt' },
  { glyph: '🖼️', label: 'Fotos' },
];

const INITIAL_WINS: Win[] = [
  { id: 'n1', title: 'Despierta la vida', text: 'Haz clic en el planeta para despertarlo.', x: 14, y: 6, min: false, open: true, glyph: '✨', color: '#F0D6A8' },
  { id: 'n2', title: 'Islas y eones', text: 'Cada tanto emerge una isla nueva y pasan los eones.', x: 16, y: 50, min: false, open: true, glyph: '🏝️', color: '#E8B9A0' },
  { id: 'n3', title: 'Anillo orbital', text: 'Clic: anillo orbital. Clic derecho: resumen. Arrástralo para moverlo.', x: 64, y: 6, min: false, open: true, glyph: '💫', color: '#BFD9B0' },
];
const DRAG_THRESHOLD = 5;
const MAX_ISLANDS = 6;
const FALLBACK_WINDOW_SIZE = 320;

type Panel = keyof typeof copy.radialPanels | null;

export function DesktopCompanion() {
  const stageRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const [pos, setPos] = useState({ x: 0.62, y: 0.5 });
  const [radial, setRadial] = useState(false);
  const [summary, setSummary] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [emerge, setEmerge] = useState(0);
  const [wins, setWins] = useState<Win[]>(INITIAL_WINS);
  const [order, setOrder] = useState<string[]>(['n1', 'n2', 'n3']);
  const winDrag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

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

  const clampPos = (x: number, y: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const windowRect = windowRef.current?.getBoundingClientRect();
    const mx = Math.min(0.5, (windowRect?.width ?? FALLBACK_WINDOW_SIZE) / 2 / rect.width);
    const my = Math.min(0.5, (windowRect?.height ?? FALLBACK_WINDOW_SIZE) / 2 / rect.height);
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
      companionPopulation.value = 10;
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

  const openPanel = (id: keyof typeof copy.radialPanels) => {
    setPanel(id);
    setRadial(false);
  };

  const patch = (id: string, p: Partial<Win>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...p } : w)));
  const focus = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const startWinDrag = (e: PointerEvent, w: Win) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    winDrag.current = { id: w.id, sx: e.clientX, sy: e.clientY, ox: w.x, oy: w.y };
    focus(w.id);
  };
  const moveWinDrag = (e: PointerEvent) => {
    const d = winDrag.current;
    if (!d) return;
    const rect = stageRef.current!.getBoundingClientRect();
    const windowRect = (e.currentTarget as HTMLElement).closest('.desk__window')?.getBoundingClientRect();
    const maxX = 100 - ((windowRect?.width ?? 0) / rect.width) * 100;
    const maxY = 100 - ((windowRect?.height ?? 0) / rect.height) * 100;
    patch(d.id, {
      x: Math.min(maxX, Math.max(0, d.ox + ((e.clientX - d.sx) / rect.width) * 100)),
      y: Math.min(maxY, Math.max(0, d.oy + ((e.clientY - d.sy) / rect.height) * 100)),
    });
  };
  const endWinDrag = () => { winDrag.current = null; };
  const showAll = () => {
    setWins((ws) => ws.map((w) => ({ ...w, open: true, min: false })));
  };
  const toggleTask = (w: Win) => {
    if (!w.open) patch(w.id, { open: true, min: false });
    else if (w.min) patch(w.id, { min: false });
    else if (order[order.length - 1] === w.id) patch(w.id, { min: true });
    if (!w.min) focus(w.id); else focus(w.id);
  };

  const onDesktopClick = () => {
    setRadial(false);
    setSummary(false);
    setPanel(null);
  };

  const temp = 14 + islands * 1.5;
  const tempLabel = temp < 16 ? 'Frío' : temp < 22 ? 'Templado' : 'Caluroso';
  const aura = awake
    ? `0 0 ${24 + islands * 6}px ${6 + islands}px rgba(${temp < 16 ? '110,143,171' : '212,160,110'},0.45)`
    : '0 0 18px 2px rgba(142,166,192,0.35)';
  const popupPlacement = (() => {
    const stage = stageRef.current?.getBoundingClientRect();
    const planetSize = windowRef.current?.getBoundingClientRect().width ?? FALLBACK_WINDOW_SIZE;
    if (!stage) return { side: 'right', width: 250 } as const;

    const gap = 18;
    const centerX = pos.x * stage.width;
    const leftSpace = centerX - planetSize / 2 - gap;
    const rightSpace = stage.width - centerX - planetSize / 2 - gap;
    const width = Math.max(0, Math.min(250, stage.width * 0.34, Math.max(leftSpace, rightSpace)));
    const side = rightSpace >= width || rightSpace >= leftSpace ? 'right' : 'left';
    return { side, width } as const;
  })();

  return (
    <section id="companero" class="section section--cream companion-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">{copy.companionLabel}</span>
            <h2 class="section-header__title">{copy.companionTitle}</h2>
            <p class="section-header__subtitle">{copy.companionDescription}</p>
          </div>
        </Reveal>

        <div class="companion">
            <div class="desk" onClick={onDesktopClick}>
              <div class="desk__menubar" aria-hidden="true">
                <div class="desk__menu"><b>🪐 Planetary Sim</b><span>Archivo</span><span>Planeta</span><span>Ver</span></div>
                <span>mar 16:20</span>
              </div>
              <div class="desk__workspace" ref={stageRef}>
                <div class="desk__icons" aria-hidden="true">
                  {DESK_ICONS.map((i) => (
                    <div class="desk__icon" key={i.label}><span>{i.glyph}</span>{i.label}</div>
                  ))}
                </div>
                {wins.filter((w) => w.open && !w.min).map((w) => (
                  <article
                    key={w.id}
                    class="desk__window desk__note"
                    style={{ left: `${w.x}%`, top: `${w.y}%`, zIndex: 10 + order.indexOf(w.id), borderTop: `3px solid ${w.color}` }}
                    onClick={(e) => { e.stopPropagation(); focus(w.id); }}
                  >
                    <header
                      class="desk__titlebar"
                      onPointerDown={(e) => startWinDrag(e, w)}
                      onPointerMove={moveWinDrag}
                      onPointerUp={endWinDrag}
                    >
                      <span class="desk__window-mark" style={{ background: w.color }} aria-hidden="true">{w.glyph}</span>
                      <span class="desk__window-title">{w.title}</span>
                      <button type="button" class="desk__minimize" aria-label={`Minimizar ${w.title}`} onClick={() => patch(w.id, { min: true })}>−</button>
                    </header>
                                        <p>{w.text}</p>
                  </article>
                ))}
                {/* PlanetCanvas fits its shared WebGL canvas to this floating globe viewport. */}
                <div
                  ref={windowRef}
                  id="companion-planet"
                  class="pwin pwin--through"
                  style={{ zIndex: 30, left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
                  role="group"
                  aria-label="Capa transparente del planeta sobre tus ventanas"
                >
                  <button
                    type="button"
                    class={`planet planet--canvas-backed ${awake ? 'is-awake' : ''}`}
                    aria-label={awake ? 'Planeta: clic para abrir el anillo orbital' : 'Planeta dormido: clic para despertar la vida'}
                    aria-pressed={awake}
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
                            style={{ left: `${50 + Math.cos(a) * 45}%`, top: `${50 + Math.sin(a) * 45}%` }}
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
                    <div class={`stats-card stats-card--${popupPlacement.side}`} style={{ width: `${popupPlacement.width}px` }} onClick={(e) => e.stopPropagation()}>
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
                    <div class={`menu-panel menu-panel--${popupPlacement.side}`} style={{ width: `${popupPlacement.width}px` }} role="dialog" aria-label={copy.radialLabels.find((r) => r.id === panel)?.label}>
                      <button type="button" class="menu-panel__x" aria-label="Cerrar" onClick={(e) => { e.stopPropagation(); setPanel(null); }}>
                        ×
                      </button>
                      <h4>{copy.radialLabels.find((r) => r.id === panel)?.label}</h4>
                      <p>{copy.radialPanels[panel]}</p>
                    </div>
                  )}
                </div>
              </div>

              <footer class="desk__dock" onClick={(e) => e.stopPropagation()}>
                <div class="desk__dock-bar">
                  <button type="button" class="desk__dock-item" style={{ background: '#3F7A62' }} aria-label="Mostrar todas las notas" title="Mostrar todas las notas" onClick={showAll}>🪐</button>
                  {wins.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      class={`desk__dock-item ${w.min ? 'is-min' : ''}`}
                      style={{ background: w.color }}
                      aria-label={w.title}
                      title={w.title}
                      onClick={() => toggleTask(w)}
                    >
                      {w.glyph}
                    </button>
                  ))}
                </div>
              </footer>
            </div>
        </div>
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




