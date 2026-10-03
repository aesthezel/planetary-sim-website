import { copy } from '../content/copy';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer class="footer section--cream">
      <div class="container container--narrow">
        <div class="footer__brand">Planetary Sim</div>
        <p class="footer__tagline">{copy.footerTagline}</p>
        <p class="footer__disclaimer" style={{ marginBottom: 'var(--space-md)' }}>
          {copy.disclaimer}
        </p>

        <button
          onClick={scrollToTop}
          type="button"
          class="btn btn--ghost"
          style={{
            color: 'var(--text-cream)',
            borderColor: 'var(--border-subtle)',
            fontSize: 'var(--text-xs)',
          }}
        >
          Volver a la órbita ↑
        </button>
      </div>
    </footer>
  );
}
