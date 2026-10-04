import { Header } from './components/Header';
import { ZoomSequence } from './components/ZoomSequence';
import { InteriorIntro } from './components/InteriorIntro';
import { DesktopCompanion } from './components/DesktopCompanion';
import { Traits } from './components/Traits';
import { FlowOfLife } from './components/FlowOfLife';
import { Phases } from './components/Phases';
import { Status } from './components/Status';
import { PressKit } from './components/PressKit';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';

export function App() {
  return (
    <>
      {/* A11y skip link */}
      <a href="#que-es" class="skip-link">
        Saltar al contenido principal
      </a>

      {/* Persistent / Appearing Header */}
      <Header />

      {/* Orbit 3D Zoom Sequence */}
      <main id="main-content">
        <ZoomSequence />

        {/* Interior Surface & Pitch Content */}
        <div id="interior-bg" class="interior">
          <div class="interior__grain" aria-hidden="true" />
          <InteriorIntro />
          <DesktopCompanion />
          <FlowOfLife />
          <Phases />
          <Traits />
          <Status />
          <PressKit />
          <Faq />
          <Footer />
        </div>
      </main>
    </>
  );
}

