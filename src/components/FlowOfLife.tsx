import { Reveal } from './Reveal';

const STEPS = [
  { tag: '01 · ROCA', title: 'Moldea la corteza', text: 'Levanta montañas, abre cráteres y traza las costas de tu mundo.', glyph: '⛰️', color: '#F6C3B5' },
  { tag: '02 · AGUA', title: 'Llama a la lluvia', text: 'Llena valles y crea océanos, ríos y lagos donde tú decidas.', glyph: '🌊', color: '#BFD9F2' },
  { tag: '03 · PRIMERA VIDA', title: 'Siembra la vida', text: 'Esparce semillas y algas, y observa cómo se adaptan a cada clima.', glyph: '🌱', color: '#C9E8D5' },
  { tag: '04 · BOSQUES', title: 'Cuida las estaciones', text: 'Tus bosques cambian con el verano, el otoño y la nieve.', glyph: '🌲', color: '#E3D6F5' },
  { tag: '05 · ECOSISTEMA', title: 'Deja que florezca', text: 'Aparecen criaturas, lluvias y pequeñas sorpresas que viven contigo.', glyph: '✨', color: '#F7E1A8' },
];

export function FlowOfLife() {
  return (
    <section id="flujo" class="section section--cream flow-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">✦  LO QUE HARÁS EN PLANETARY SIM</span>
            <h2 class="section-header__title">Del polvo a la vida.</h2>
            <p class="section-header__subtitle">Moldea un planeta diminuto y acompáñalo en cada era de su historia, a tu ritmo.</p>
          </div>
        </Reveal>
        <div class="flow" data-planet-zone>
          <div class="flow__stage">
            <div id="flow-planet" class="flow__planet" role="img" aria-label="Planeta 3D que acompaña el recorrido" />
          </div>
          <ol class="flow__steps">
            {STEPS.map((s) => (
              <li class="flow__step" key={s.tag}>
                <span class="flow__dot" style={{ background: s.color }} aria-hidden="true">{s.glyph}</span>
                <div>
                  <span class="flow__tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
