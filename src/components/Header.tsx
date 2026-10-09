import { copy } from '../content/copy';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  return (
    <header class="site-header site-header--visible" aria-label={copy.navAria}>
      <div class="site-header__inner">
        <a href="#app" class="site-header__logo" aria-label={copy.homeAria}>
          Planetary Sim
        </a>
        <nav class="site-header__nav">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} class="site-header__link">
              {item.label}
            </a>
          ))}
        </nav>
        <div class="site-header__actions">
          <LanguageSelector />
          <a class="site-header__cta" href="#prensa">
            <span class="site-header__cta-full">{copy.ctaPublisher}</span>
            <span class="site-header__cta-short">{copy.ctaPublisherShort}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
