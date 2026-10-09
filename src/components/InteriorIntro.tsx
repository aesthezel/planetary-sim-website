import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function InteriorIntro() {
  return (
    <section id="que-es" class="essence-band" aria-label={copy.interiorTitle}>
      <div class="container essence-band__inner">
        <Reveal>
          <p class="essence-band__lead">{copy.interiorLead}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul class="essence-band__steps">
            {copy.pills.map((pill, index) => (
              <li key={pill.label}>
                <span aria-hidden="true">{pill.icon}</span>
                <span>{pill.label}</span>
                {index < copy.pills.length - 1 && <i aria-hidden="true">·</i>}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
