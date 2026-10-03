import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function Faq() {
  return (
    <section id="faq" class="section section--cream">
      <div class="container container--narrow">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Dudas Habituales</span>
            <h2 class="section-header__title">{copy.faqTitle}</h2>
          </div>
        </Reveal>

        <div class="faq-list">
          {copy.faq.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.08}>
              <article class="faq-item">
                <h3 class="faq-item__q">{item.q}</h3>
                <p class="faq-item__a">{item.a}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
