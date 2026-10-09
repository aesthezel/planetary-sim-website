import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function LoopSteps() {
  return (
    <section id="como-se-juega" class="section section--cream" style={{ paddingTop: '0' }}>
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">{copy.loopLabel}</span>
            <h2 class="section-header__title">{copy.loopTitle}</h2>
            <p class="section-header__subtitle">{copy.loopDescription}</p>
          </div>
        </Reveal>

        <div class="feature-grid">
          {copy.loopSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <div class="feature-card">
                <div class="feature-card__icon">{step.icon}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--wood)', fontWeight: 600, marginBottom: 'var(--space-3xs)' }}>
                  {copy.loopStepPrefix} 0{index + 1}
                </div>
                <h3 class="feature-card__title">{step.title}</h3>
                <p class="feature-card__text">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
