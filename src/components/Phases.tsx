import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function Phases() {
  return (
    <section id="fases" class="section section--cream phases-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">{copy.phasesLabel}</span>
            <h2 class="section-header__title">{copy.phasesTitle}</h2>
            <p class="section-header__subtitle">{copy.phasesDescription}</p>
          </div>
        </Reveal>

        <div class="phases-grid">
          {copy.phases.map((item, index) => (
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
