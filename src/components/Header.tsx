import { copy } from '../content/copy';
export function Header() {
  return (
    <header class="site-header site-header--visible" aria-label="Navegación principal">
      <div class="site-header__inner">
        <a href="#app" class="site-header__logo" aria-label="Planetary Sim Inicio">
          Planetary Sim
        </a>
        <nav class="site-header__nav">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} class="site-header__link">
              {item.label}
            </a>
          ))}
        </nav>
        <a class="site-header__cta" href="#prensa">{copy.ctaPublisher}<span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
