import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function FlowOfLife() {
  return (
    <section id="flujo" class="section section--cream flow-section">
      <div class="container">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">{copy.flowLabel}</span>
            <h2 class="section-header__title">{copy.flowTitle}</h2>
            <p class="section-header__subtitle">{copy.flowSubtitle}</p>
          </div>
        </Reveal>
        <div class="flow" data-planet-zone>
          <div class="flow__stage">
            <div id="flow-planet" class="flow__planet" role="img" aria-label={copy.flowPlanetAria} />
          </div>
          <ol class="flow__steps">
            {copy.flowSteps.map((s) => (
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
