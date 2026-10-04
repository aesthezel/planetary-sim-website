import { copy } from '../content/copy';
import { Reveal } from './Reveal';

const phasesData = [
  {
    phase: 'FASE 01',
    name: 'Planetaria',
    desc: 'Nombra el planeta para fijar su semilla, despierta la primera isla y observa emerger nuevas tierras.',
    tag: 'El origen',
  },
  {
    phase: 'FASE 02',
    name: 'Orbital',
    desc: 'Combina rasgos para dar identidad a una especie e invierte Eones en megaestructuras que orbitan el mundo.',
    tag: 'La expansión',
  },
  {
    phase: 'FASE 03',
    name: 'Transcendente',
    desc: 'La civilización puede ascender. Una nueva especie comienza mientras Eones, ruinas y descubrimientos conservan el legado.',
    tag: 'El legado',
  },
];

export function Phases() {
  return (
    <section id="fases" class="section section--cream phases-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Tres fases · un legado</span>
            <h2 class="section-header__title">{copy.phasesTitle}</h2>
            <p class="section-header__subtitle">{copy.phasesDescription}</p>
          </div>
        </Reveal>

        <div class="phases-grid">
          {phasesData.map((item, index) => (
            <Reveal key={item.phase} delay={index * 0.1}>
              <article class="phase-card">
                <div class="phase-card__topline">
                  <span class="phase-card__number">{item.phase}</span>
                  <span class="phase-card__tag">{item.tag}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
