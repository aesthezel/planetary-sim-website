import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function Traits() {
  return (
    <section id="diferenciadores" class="section section--cream traits-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">La esencia del juego</span>
            <h2 class="section-header__title">{copy.traitsTitle}</h2>
            <p class="section-header__subtitle">
              Diseñado para ofrecer una alternativa íntima, contemplativa y estética dentro de la simulación incremental.
            </p>
          </div>
        </Reveal>

        <div class="feature-grid traits-grid">
          {copy.traits.map((trait, index) => (
            <Reveal key={trait.title} delay={index * 0.08}>
              <div
                class="feature-card feature-card--pastel"
              >
                <div class="feature-card__icon">{trait.icon}</div>
                <h3 class="feature-card__title">{trait.title}</h3>
                <p class="feature-card__text">{trait.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
