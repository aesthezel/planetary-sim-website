import { copy } from '../content/copy';
import { Reveal } from './Reveal';

export function InteriorIntro() {
  return (
    <section id="que-es" class="section section--cream">
      <div class="container container--narrow">
        <Reveal>
          <div class="section-header">
            <span class="section-header__label">Concepto Central</span>
            <h2 class="section-header__title">{copy.interiorTitle}</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p class="text-lg" style={{ marginBottom: 'var(--space-md)', color: 'var(--text-heading)' }}>
            {copy.interiorDescription}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p class="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
            {copy.interiorSubline}
          </p>
        </Reveal>

        <Reveal delay={0.23}>
          <p class="shader-note">
            <span class="shader-note__icon" aria-hidden="true">◉</span>
            <span>{copy.interiorShaderNote}</span>
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-xl)',
            }}
          >
            {copy.pills.map((pill) => (
              <span key={pill.label} class="pill pill--cream">
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <blockquote
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              borderLeft: '3px solid var(--wood-light)',
              background: 'rgba(139, 115, 85, 0.05)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontStyle: 'italic',
              color: 'var(--wood-dark)',
            }}
          >
            {copy.featuredQuote}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
