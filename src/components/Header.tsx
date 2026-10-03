import { copy } from '../content/copy';
import { headerVisible } from '../state/store';

export function Header() {
  const isVisible = headerVisible.value;

  return (
    <header class={`site-header ${isVisible ? 'site-header--visible' : ''}`} aria-label="Navegación principal">
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
        <span class="pill pill--cream">Unity 6 Demo</span>
      </div>
    </header>
  );
}
