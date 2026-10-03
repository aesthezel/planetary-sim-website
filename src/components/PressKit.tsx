import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function PressKit() {
  return (
    <section id="prensa" class="section section--cream" style={{ background: 'var(--cream-warm)' }}>
      <div class="container container--narrow">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Kit de Prensa</span>
            <h2 class="section-header__title">{copy.pressTitle}</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            class="feature-card"
            style={{
              background: 'var(--cream-soft)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-md)',
            }}
          >
            <h3 class="feature-card__title">Descripción corta</h3>
            <p class="feature-card__text" style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>
              {copy.pressShortDescription}
            </p>
            <div
              style={{
                padding: 'var(--space-xs) var(--space-sm)',
                background: 'rgba(139, 115, 85, 0.08)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--wood-dark)',
              }}
            >
              <strong>Guía editorial:</strong> {copy.pressNote}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-md)',
              background: 'var(--cream-soft)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-heading)' }}>
                Contacto de prensa y publishers
              </h4>
              <p class="text-sm text-muted">Solicita acceso anticipado o material de prensa oficial.</p>
            </div>
            <a
              href="mailto:contact@planetarysim.com?subject=Planetary%20Sim%20-%20Publisher/Press%20Inquiry"
              class="btn btn--primary"
            >
              Contactar equipo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
