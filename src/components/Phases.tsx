import { copy } from '../content/copy';
import { Reveal } from './Reveal';

const phasesData = [
  {
    phase: 'Fase I',
    name: 'Génesis y Despertar',
    desc: 'Un planeta virgen despierta con una primera isla. La población echa raíces mientras el jugador recoge motas astrales tempranas.',
    tag: 'Origen',
  },
  {
    phase: 'Fase II',
    name: 'Expansión y Rasgos',
    desc: 'Aparecen nuevos parches de tierra, navegación autónoma entre islas y la combinación de filosofía y biología para definir la especie.',
    tag: 'Evolución',
  },
  {
    phase: 'Fase III',
    name: 'Trascendencia Orbital',
    desc: 'La civilización mira al cosmos. Se desbloquean e invierten Eones en megaestructuras visibles en órbita alrededor del planeta.',
    tag: 'Apogeo',
  },
  {
    phase: 'Fase IV',
    name: 'Ascensión y Legado',
    desc: 'La especie trasciende. Sus huellas, ruinas y entradas en el Almanaque permanecen como legado eterno para la siguiente civilización.',
    tag: 'Ciclo',
  },
];

export function Phases() {
  return (
    <section id="fases" class="section section--cream">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Progresión</span>
            <h2 class="section-header__title">{copy.phasesTitle}</h2>
            <p class="section-header__subtitle">{copy.phasesDescription}</p>
          </div>
        </Reveal>

        <div class="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {phasesData.map((item, index) => (
            <Reveal key={item.phase} delay={index * 0.1}>
              <div
                class="feature-card"
                style={{
                  background: 'var(--cream-soft)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--wood)' }}>
                    {item.phase}
                  </span>
                  <span class="pill pill--cream" style={{ fontSize: '0.7rem' }}>
                    {item.tag}
                  </span>
                </div>
                <h3 class="feature-card__title" style={{ fontSize: 'var(--text-lg)' }}>
                  {item.name}
                </h3>
                <p class="feature-card__text">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
