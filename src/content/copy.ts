/* ============================================
   PLANETARY SIM — Copy
   All text extracted from Obsidian vault.
   Source of truth: Pitch para publishers,
   Texto para prensa, Mensajes clave.
   ============================================ */

export const copy = {
  /* ---- Hero (Órbita) ---- */
  logline:
    'Tu mundo.\nA tu ritmo.',

  elevator:
    'Despierta la vida en un planeta diminuto. Acompaña la evolución de una civilización con decisiones ocasionales y vuelve cuando quieras: tu mundo no te castiga por ausentarte.',

  ctaPulse: 'Darle un pulso al planeta',
  ctaPublisher: 'Contacto publishers',
  ctaExplore: 'Ver cómo evoluciona',
  hintScroll: 'Arrastra para girar el planeta · Desliza para verlo en tu escritorio ↓',

  /* ---- Recorrido visual ---- */
  storyIntro: 'Despierta un mundo. Acompaña una civilización. Conserva su legado.',
  storyBeats: [
    {
      eyebrow: '01 · SEMILLA',
      title: 'Ponle nombre a tu mundo',
      text: 'El nombre crea una semilla estable y una geografía de islas única que puede volver a generarse.',
      fact: 'Nombre → semilla → geografía reproducible',
      glyph: '✎',
    },
    {
      eyebrow: '02 · DESPERTAR',
      title: 'Una isla. La primera chispa de vida.',
      text: 'Despierta la isla inicial y observa cómo la población crece mientras emergen nuevas tierras.',
      fact: '1 isla · población inicial 0',
      glyph: '✧',
    },
    {
      eyebrow: '03 · LEGADO',
      title: 'Cada especie deja su huella',
      text: 'Elige rasgos, guía una civilización hasta la trascendencia y conserva sus ruinas y descubrimientos al ascender.',
      fact: 'Planetaria → Orbital → Transcendente',
      glyph: '◎',
    },
  ],

  /* ---- Micro-labels (Zoom) ---- */
  microLabels: ['Un planeta procedural', 'Decisiones ocasionales', 'Legado persistente'],

  /* ---- Interior: Qué es ---- */
  interiorTitle: '¿Qué es Planetary Sim?',
  interiorDescription:
    'Una simulación incremental cozy y compañero de escritorio. Despierta la vida en un planeta procedural, orienta la evolución de su especie y observa cómo cada ascensión deja un legado.',

  interiorSubline:
    'El mundo avanza principalmente por sí solo. Puedes volver cuando quieras: la estasis reduce la presión y protege una experiencia sin castigos por ausentarte.',

  interiorShaderNote:
    'Bajo la superficie, el shader PlanetInterior pinta bandas de profundidad, rayos de luz, cáusticas y burbujas con una animación cuantizada a 12 fps. El océano visible usa PlanetWater: oleaje toon, espuma alrededor de las costas y textura clay.',

  featuredQuote:
    '«Cada mundo termina convirtiéndose en el recuerdo del siguiente.»',

  pills: [
    { icon: '✧', label: 'Despierta la vida' },
    { icon: '◷', label: 'Observa a tu ritmo' },
    { icon: '◎', label: 'Deja un legado' },
  ],

  /* ---- Compañero de escritorio ---- */
  companionLabel: '✦  ASÍ VIVE EN TU PANTALLA',
  companionTitle: 'Tu planeta, junto a tus ventanas.',
  companionDescription:
    'Planetary Sim vive en una esquina de tu escritorio, girando a tu lado mientras trabajas, estudias o descansas.',
  companionHint:
    'Clic: despierta y abre el anillo · Clic derecho: resumen · Arrastra el planeta · Toca ✧ para recoger una mota',
  companionLayers: [
    { id: 'top', label: 'Superior', note: 'Siempre encima' },
    { id: 'normal', label: 'Normal', note: 'Como cualquier ventana' },
    { id: 'bottom', label: 'Inferior', note: 'Detrás de todo' },
  ],
  companionToggles: {
    transparent: 'Fondo transparente',
    clickThrough: 'Clic a través',
  },
  radialLabels: [
    { id: 'stats', label: 'Estadísticas', glyph: '✦' },
    { id: 'megas', label: 'Megaestructuras', glyph: '◎' },
    { id: 'almanac', label: 'Almanaque', glyph: '❖' },
    { id: 'evolution', label: 'Evolución', glyph: '❋' },
    { id: 'trends', label: 'Tendencias', glyph: '≈' },
  ],
  radialPanels: {
    stats: 'Estado del planeta: islas, habitantes, temperatura y eones.',
    megas: 'Coste, requisito y efecto de cada megaestructura orbital.',
    almanac: 'Descubrimientos y progreso de colección entre ciclos.',
    evolution: 'Especie, mutación disponible y ascensión.',
    trends: 'Ejes Naturaleza ↔ Tecnología y Frío ↔ Calor.',
  },
  companionNote:
    'Recreación web del planeta flotando sobre otras ventanas; no simula un sistema operativo ni sustituye una build del juego.',

  /* ---- Cómo se juega ---- */
  loopTitle: 'De una isla al legado.',
  loopDescription:
    'Tres fases para acompañar a una civilización desde su primera isla hasta la trascendencia.',
  loopSteps: [
    {
      icon: '✨',
      title: 'Despierta la vida',
      text: 'Nombra tu planeta, despierta la vida con un clic y observa cómo aparecen las primeras islas.',
    },
    {
      icon: '🌱',
      title: 'Moldea la evolución',
      text: 'Recoge motas astrales, elige rasgos evolutivos y orienta las tendencias de tu civilización.',
    },
    {
      icon: '🏛️',
      title: 'Construye legado',
      text: 'Invierte Eones en megaestructuras visibles que orbitan el planeta como monumentos a tu especie.',
    },
    {
      icon: '🔄',
      title: 'Asciende',
      text: 'La especie trasciende y da paso a otra. Las ruinas y descubrimientos conservan el legado de ciclos anteriores.',
    },
  ],

  /* ---- Diferenciadores ---- */
  traitsTitle: '¿Qué lo distingue?',
  traits: [
    {
      icon: '🪐',
      title: 'Un mundo para observar',
      text: 'Un planeta procedural de escala juguete, con islas emergentes, océanos estilizados y vida orbital.',
    },
    {
      icon: '◷',
      title: 'Progreso sin presión',
      text: 'La simulación avanza principalmente sola. La estasis reduce la presión cuando te ausentas.',
    },
    {
      icon: '🧬',
      title: 'Especies con identidad',
      text: 'Combina forma de vida, filosofía y material. Al ascender, conserva Eones, ruinas y descubrimientos.',
    },
  ],

  /* ---- Fases ---- */
  phasesTitle: 'El planeta cambia. El legado permanece.',
  phasesDescription:
    'Una progresión serena desde la primera chispa de vida hasta una nueva ascensión.',

  /* ---- Estado ---- */
  statusTitle: 'Estado del proyecto',
  statusDescription:
    'El proyecto está en desarrollo como demo en Unity 6. Ya cuenta con una escena planetaria, simulación de población y temperatura, emergencia de islas, tutorial inicial, mutaciones combinatorias, fases, ascensión, Almanaque, megaestructuras y una interfaz React/OneJS integrada en Unity.',

  statusTable: [
    { campo: 'Título', valor: 'Planetary Sim' },
    { campo: 'Género', valor: 'Simulación incremental pasiva / experiencia cozy' },
    { campo: 'Modo', valor: 'Un jugador' },
    { campo: 'Motor', valor: 'Unity 6, URP' },
    { campo: 'Estado', valor: 'Demo/proyecto en desarrollo' },
    { campo: 'Plataformas, fecha, precio', valor: 'Por definir' },
  ],

  /* ---- Prensa ---- */
  pressTitle: 'Prensa',
  pressShortDescription:
    'Planetary Sim es una experiencia cozy de simulación incremental sobre la vida de un pequeño planeta procedural. Despierta una civilización, acompaña su evolución y deja que cada ascensión añada un nuevo capítulo a su historia.',
  pressNote:
    'No describir el juego como estrategia de colonias, supervivencia o simulación meteorológica realista. El clima externo es complementario y no es necesario para jugar.',

  /* ---- FAQ ---- */
  faqTitle: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Qué hace el jugador?',
      a: 'Despierta la vida, observa el crecimiento y toma decisiones puntuales de evolución, tendencias y construcción.',
    },
    {
      q: '¿Hay que jugar constantemente?',
      a: 'No. La progresión es principalmente autónoma y la estasis evita penalizar las pausas.',
    },
    {
      q: '¿Qué se conserva al ascender?',
      a: 'Los Eones, el Almanaque y las ruinas/legado; la población y los rasgos de la especie comienzan un nuevo ciclo.',
    },
    {
      q: '¿El clima depende del tiempo real o de internet?',
      a: 'No para jugar. Hay documentación de una integración meteorológica opcional, pero el diseño base funciona sin ella.',
    },
    {
      q: '¿Cuándo sale y en qué plataformas?',
      a: 'Por confirmar. El proyecto está en desarrollo.',
    },
  ],

  /* ---- Footer ---- */
  disclaimer: 'Demo en desarrollo · Plataformas y fecha por confirmar',
  footerTagline:
    'Una pequeña civilización. Un planeta que evoluciona a su ritmo. Un legado que sobrevive a cada nuevo comienzo.',

  /* ---- Headlines ---- */
  headlines: [
    'Un planeta diminuto. Civilizaciones enteras. Un legado que perdura.',
    'Despierta la vida y observa cómo tu planeta escribe su propia historia.',
    'Una simulación acogedora que evoluciona incluso cuando solo te detienes a mirar.',
  ],

  /* ---- Badge ---- */
  badge: 'Plataforma objetivo: PC · Demo en desarrollo',

  /* ---- Navigation ---- */
  nav: [
    { label: 'El juego', href: '#que-es' },
    { label: 'Cómo se juega', href: '#fases' },
    { label: 'El compañero', href: '#companero' },
  ],
} as const;

