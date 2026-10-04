/* ============================================
   PLANETARY SIM — Copy
   All text extracted from Obsidian vault.
   Source of truth: Pitch para publishers,
   Texto para prensa, Mensajes clave.
   ============================================ */

export const copy = {
  /* ---- Hero (Órbita) ---- */
  logline:
    'Un planeta. Un compañero.',

  elevator:
    'Despierta la vida y observa cómo tu mundo evoluciona mientras haces tus cosas. Siempre a su ritmo; siempre listo para recibirte.',

  ctaPulse: 'Darle un pulso al planeta',
  hintScroll: 'Desliza para acercarte ↓',

  /* ---- Scrollytelling: demostración del juego ---- */
  storyIntro: 'Un mundo pequeño que escribe una historia enorme.',
  storyBeats: [
    {
      eyebrow: '01 · SEMILLA',
      title: 'Ponle nombre a tu mundo',
      text: 'El nombre genera una semilla estable: cada planeta obtiene su propio mapa de islas y puede volver a generarse igual.',
      fact: 'Nombre → semilla → geografía reproducible',
      glyph: '✎',
    },
    {
      eyebrow: '02 · DESPERTAR',
      title: 'La vida empieza con un clic',
      text: 'La partida comienza con una isla y sin habitantes. Despierta la vida; los clics estimulan el crecimiento y nuevas islas aparecen poco a poco.',
      fact: '1 isla · población inicial 0',
      glyph: '✧',
    },
    {
      eyebrow: '03 · OBSERVAR',
      title: 'El planeta sigue a su ritmo',
      text: 'El crecimiento es principalmente autónomo. Los Eones representan tiempo de aplicación abierta; las motas astrales dan pequeños impulsos. La estasis reduce las crisis durante las pausas.',
      fact: 'Atención ocasional, sin castigo por ausentarte',
      glyph: '◷',
    },
    {
      eyebrow: '04 · EVOLUCIONAR',
      title: 'Dale identidad a la especie',
      text: 'Combina forma de vida, filosofía y material. Las tendencias de Naturaleza/Tecnología y Frío/Calor se ajustan con decisiones puntuales, no con microgestión.',
      fact: 'Forma de vida + filosofía + material',
      glyph: '❋',
    },
    {
      eyebrow: '05 · TRASCENDER',
      title: 'Cada ciclo deja algo atrás',
      text: 'La civilización pasa de la superficie a la órbita y la trascendencia. Al ascender nace una nueva especie, mientras Eones, ruinas y descubrimientos conservan el legado.',
      fact: 'Planetaria → orbital → trascendente → legado',
      glyph: '◎',
    },
  ],

  /* ---- Micro-labels (Zoom) ---- */
  microLabels: [
    '1 isla viva',
    'Eones +0.05 ✧',
    'Sin castigo por ausentarte',
  ],

  /* ---- Interior: Qué es ---- */
  interiorTitle: '¿Qué es Planetary Sim?',
  interiorDescription:
    'Da nombre a un mundo y observa cómo despierta. En Planetary Sim, un planeta diminuto evoluciona desde una isla sin vida hasta una civilización capaz de expandirse más allá de su superficie. Estimula el crecimiento, recoge motas astrales, combina rasgos para dar forma a cada especie y construye megaestructuras que orbitan el planeta. Cuando llega el momento, asciende: el mundo comienza un nuevo ciclo, pero sus ruinas y descubrimientos permanecen.',

  interiorSubline:
    'Pensado para sesiones breves y observación relajada, Planetary Sim deja que la simulación avance por sí sola y ofrece una estasis segura cuando el jugador se ausenta.',

  interiorShaderNote:
    'Bajo la superficie, el shader PlanetInterior pinta bandas de profundidad, rayos de luz, cáusticas y burbujas con una animación cuantizada a 12 fps. El océano visible usa PlanetWater: oleaje toon, espuma alrededor de las costas y textura clay.',

  featuredQuote:
    '«Cada mundo termina convirtiéndose en el recuerdo del siguiente.»',

  pills: [
    { icon: '🪐', label: 'Planeta vivo' },
    { icon: '⏳', label: 'Participación ocasional' },
    { icon: '✧', label: 'Ascensión = legado' },
  ],

  /* ---- Compañero de escritorio ---- */
  companionLabel: 'Compañero de escritorio',
  companionTitle: 'Un planeta que vive en tu escritorio',
  companionDescription:
    'Planetary Sim se ejecuta en una ventana transparente: solo el planeta y su interfaz capturan el ratón, el resto de clics pasan a lo que tengas debajo. Déjalo en un rincón mientras trabajas y míralo evolucionar. Prueba aquí el comportamiento real de la demo.',
  companionHint:
    'Clic izquierdo: anillo orbital · Clic derecho: resumen · Arrastra para moverlo · Clic en ✧: eones',
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
    'Demo ilustrativa de la ventana de la versión Unity en Windows. Plataformas finales por confirmar.',

  /* ---- Cómo se juega ---- */
  loopTitle: '¿Cómo se juega?',
  loopDescription:
    'El jugador nombra un planeta que sirve de semilla para su mundo, despierta la vida con un clic y observa cómo aparecen nuevas islas y crece la población.',
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
      icon: '🌍',
      title: 'Un mundo que invita a observar',
      text: 'Un microplaneta 3D procedural con islas curvas, océano estilizado, barco autónomo y estructuras orbitales.',
    },
    {
      icon: '☁️',
      title: 'Progreso amable y de baja demanda',
      text: 'El planeta avanza por sí mismo; la estasis evita que la ausencia del jugador se convierta en castigo.',
    },
    {
      icon: '🧬',
      title: 'Evolución con identidad emergente',
      text: 'Cada especie combina forma de vida, filosofía y material; las elecciones alteran sus bonificaciones y su expresión visual.',
    },
    {
      icon: '📜',
      title: 'Legado entre ciclos',
      text: 'La ascensión reinicia parcialmente el planeta, pero preserva eones, ruinas y descubrimientos del Almanaque.',
    },
    {
      icon: '🔭',
      title: 'Interfaz orbital',
      text: 'Las estadísticas y decisiones aparecen cuando el jugador las solicita, dejando al planeta como foco visual.',
    },
  ],

  /* ---- Fases ---- */
  phasesTitle: 'Fases de civilización',
  phasesDescription:
    'Cada civilización atraviesa fases de desarrollo, desde las primeras chispas de vida hasta la trascendencia estelar.',

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
  badge: 'Demo en desarrollo',

  /* ---- Navigation ---- */
  nav: [
    { label: 'Recorrido', href: '#zoom' },
    { label: 'Compañero', href: '#companero' },
    { label: 'Cómo se juega', href: '#como-se-juega' },
    { label: 'Evolución', href: '#fases' },
    { label: 'Estado', href: '#estado' },
    { label: 'FAQ', href: '#faq' },
  ],
} as const;
