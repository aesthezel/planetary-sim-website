import type { Translation } from './types';

export const en: Translation = {
  /* ---- Hero (Orbit) ---- */
  logline: 'Your world.\nAt your pace.',
  elevator:
    'Awaken life on a tiny planet. Accompany the evolution of a civilization with occasional decisions and come back whenever you want: your world won\'t punish you for stepping away.',
  ctaPulse: 'Give the planet a pulse',
  ctaPublisher: 'Publisher contact',
  ctaPublisherShort: 'Press',
  ctaExplore: 'See how it evolves',
  hintScroll: 'Drag to spin the planet · Scroll to see it on your desktop ↓',

  /* ---- Visual tour ---- */
  storyIntro: 'Awaken a world. Accompany a civilization. Preserve its legacy.',
  storyBeats: [
    {
      eyebrow: '01 · SEED',
      title: 'Name your world',
      text: 'The name creates a stable seed and a unique island geography that can be regenerated.',
      fact: 'Name → seed → reproducible geography',
      glyph: '✎',
    },
    {
      eyebrow: '02 · AWAKENING',
      title: 'One island. The first spark of life.',
      text: 'Awaken the initial island and watch the population grow as new lands emerge.',
      fact: '1 island · initial population 0',
      glyph: '✧',
    },
    {
      eyebrow: '03 · LEGACY',
      title: 'Every species leaves its mark',
      text: 'Choose traits, guide a civilization to transcendence and preserve its ruins and discoveries upon ascending.',
      fact: 'Planetary → Orbital → Transcendent',
      glyph: '◎',
    },
  ],
  microLabels: ['A procedural planet', 'Occasional decisions', 'Persistent legacy'],

  /* ---- Interior: What is it ---- */
  interiorTitle: 'What is Planetary Sim?',
  interiorLead: 'A cozy incremental simulation and desktop companion.',
  interiorDescription:
    'A cozy incremental simulation and desktop companion. Awaken life on a procedural planet, guide its species\' evolution and watch each ascension leave a legacy.',
  interiorSubline:
    'The world progresses mostly on its own. Come back whenever you want: stasis reduces pressure and protects an experience free from punishment for stepping away.',
  interiorShaderNote:
    'Beneath the surface, the PlanetInterior shader paints depth bands, light rays, caustics and bubbles with a quantized 12 fps animation. The visible ocean uses PlanetWater: toon swell, foam around coastlines and clay texture.',
  featuredQuote: '"Every world ends up becoming the memory of the next."',
  pills: [
    { icon: '✧', label: 'Awaken life' },
    { icon: '◷', label: 'Observe at your pace' },
    { icon: '◎', label: 'Leave a legacy' },
  ],

  /* ---- Desktop companion ---- */
  companionLabel: '✦  THIS IS HOW IT LIVES ON YOUR SCREEN',
  companionTitle: 'Your planet, next to your windows.',
  companionDescription:
    'Planetary Sim lives in a corner of your desktop, spinning beside you while you work, study or rest.',
  companionHint:
    'Click: awaken & open orbital ring · Right-click: summary · Drag the planet · Tap ✧ to collect a mote',
  companionLayers: [
    { id: 'top', label: 'Top', note: 'Always on top' },
    { id: 'normal', label: 'Normal', note: 'Like any window' },
    { id: 'bottom', label: 'Bottom', note: 'Behind everything' },
  ],
  companionToggles: {
    transparent: 'Transparent background',
    clickThrough: 'Click through',
  },
  radialLabels: [
    { id: 'stats', label: 'Statistics', glyph: '✦' },
    { id: 'megas', label: 'Megastructures', glyph: '◎' },
    { id: 'almanac', label: 'Almanac', glyph: '❖' },
    { id: 'evolution', label: 'Evolution', glyph: '❋' },
    { id: 'trends', label: 'Trends', glyph: '≈' },
  ],
  radialPanels: {
    stats: 'Planet status: islands, inhabitants, temperature and eons.',
    megas: 'Cost, requirement and effect of each orbital megastructure.',
    almanac: 'Discoveries and collection progress between cycles.',
    evolution: 'Species, available mutation and ascension.',
    trends: 'Nature ↔ Technology and Cold ↔ Heat axes.',
  },
  companionNote:
    'Web recreation of the planet floating over other windows; it does not simulate an operating system nor replace a game build.',

  /* ---- How to play ---- */
  loopTitle: 'From one island to legacy.',
  loopDescription:
    'Three phases to accompany a civilization from its first island to transcendence.',
  loopSteps: [
    { icon: '✨', title: 'Awaken life', text: 'Name your planet, awaken life with a click and watch the first islands appear.' },
    { icon: '🌱', title: 'Shape evolution', text: 'Collect astral motes, choose evolutionary traits and steer your civilization\'s trends.' },
    { icon: '🏛️', title: 'Build legacy', text: 'Invest Eons in visible megastructures that orbit the planet as monuments to your species.' },
    { icon: '🔄', title: 'Ascend', text: 'The species transcends and gives way to another. Ruins and discoveries preserve the legacy of previous cycles.' },
  ],

  /* ---- Differentiators ---- */
  traitsTitle: 'What makes it different?',
  traits: [
    { icon: '🪐', title: 'A world to observe', text: 'A toy-scale procedural planet with emerging islands, stylized oceans and orbital life.' },
    { icon: '◷', title: 'Progress without pressure', text: 'The simulation progresses mostly on its own. Stasis reduces pressure when you step away.' },
    { icon: '🧬', title: 'Species with identity', text: 'Combine life form, philosophy and material. Upon ascending, keep Eons, ruins and discoveries.' },
  ],

  /* ---- Phases ---- */
  phasesTitle: 'The planet changes. The legacy endures.',
  phasesDescription: 'A serene progression from the first spark of life to a new ascension.',

  /* ---- Status ---- */
  statusTitle: 'Project status',
  statusDescription:
    'The project is in development as a Unity 6 demo. It already features a planetary scene, population and temperature simulation, island emergence, initial tutorial, combinatorial mutations, phases, ascension, Almanac, megastructures and a React/OneJS UI integrated in Unity.',
  statusTable: [
    { campo: 'Title', valor: 'Planetary Sim' },
    { campo: 'Genre', valor: 'Passive incremental simulation / cozy experience' },
    { campo: 'Mode', valor: 'Single player' },
    { campo: 'Engine', valor: 'Unity 6, URP' },
    { campo: 'Status', valor: 'Demo/project in development' },
    { campo: 'Platforms, date, price', valor: 'To be defined' },
  ],

  /* ---- Press ---- */
  pressTitle: 'Press',
  pressShortDescription:
    'Planetary Sim is a cozy incremental simulation experience about the life of a small procedural planet. Awaken a civilization, accompany its evolution and let each ascension add a new chapter to its story.',
  pressNote:
    'Do not describe the game as colony strategy, survival or realistic weather simulation. External weather is complementary and not required to play.',

  /* ---- FAQ ---- */
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'What does the player do?', a: 'Awakens life, observes growth and makes occasional decisions about evolution, trends and construction.' },
    { q: 'Do you have to play constantly?', a: 'No. Progression is mostly autonomous and stasis avoids penalizing pauses.' },
    { q: 'What is kept upon ascending?', a: 'Eons, the Almanac and ruins/legacy; population and species traits start a new cycle.' },
    { q: 'Does weather depend on real-time or internet?', a: 'Not for playing. There is documentation for an optional weather integration, but the base design works without it.' },
    { q: 'When does it come out and on which platforms?', a: 'To be confirmed. The project is in development.' },
  ],

  /* ---- Footer ---- */
  disclaimer: 'Demo in development · Platforms and date to be confirmed',
  footerTagline: 'A small civilization. A planet that evolves at its own pace. A legacy that survives every new beginning.',

  /* ---- Headlines ---- */
  headlines: [
    'A tiny planet. Entire civilizations. A legacy that endures.',
    'Awaken life and watch your planet write its own story.',
    'A cozy simulation that evolves even when you just stop to look.',
  ],

  /* ---- Badge ---- */
  badge: 'Target platform: PC · Demo in development',

  /* ---- Navigation ---- */
  nav: [
    { label: 'The game', href: '#que-es' },
    { label: 'How to play', href: '#fases' },
    { label: 'The companion', href: '#companero' },
  ],

  /* ---- UI labels ---- */
  skipLink: 'Skip to main content',
  navAria: 'Main navigation',
  homeAria: 'Planetary Sim — Home',
  languageSelectorAria: 'Language',
  languageSelectAria: 'Select language',
  heroPlatform: 'Cozy incremental simulation · Single player',
  storyDemoTitle: 'DEMO WALKTHROUGH',
  storyDemoHint: 'Scroll to discover each system',

  /* ---- FlowOfLife ---- */
  flowLabel: '✦  WHAT YOU\'LL DO IN PLANETARY SIM',
  flowTitle: 'From dust to life.',
  flowSubtitle: 'Shape a tiny planet and accompany it through every era of its story, at your pace.',
  flowSteps: [
    { tag: '01 · ROCK', title: 'Shape the crust', text: 'Raise mountains, open craters and trace the coastlines of your world.', glyph: '⛰️', color: '#F6C3B5' },
    { tag: '02 · WATER', title: 'Call the rain', text: 'Fill valleys and create oceans, rivers and lakes wherever you decide.', glyph: '🌊', color: '#BFD9F2' },
    { tag: '03 · FIRST LIFE', title: 'Sow life', text: 'Spread seeds and algae, and watch how they adapt to every climate.', glyph: '🌱', color: '#C9E8D5' },
    { tag: '04 · FORESTS', title: 'Tend the seasons', text: 'Your forests change with summer, autumn and snow.', glyph: '🌲', color: '#E3D6F5' },
    { tag: '05 · ECOSYSTEM', title: 'Let it bloom', text: 'Creatures, rain and small surprises appear and live alongside you.', glyph: '✨', color: '#F7E1A8' },
  ],
  flowPlanetAria: '3D planet accompanying the tour',

  /* ---- Phases section ---- */
  phasesLabel: 'Three phases · one legacy',
  phases: [
    { phase: 'PHASE 01', name: 'Planetary', desc: 'Name the planet to set its seed, awaken the first island and watch new lands emerge.', tag: 'The origin' },
    { phase: 'PHASE 02', name: 'Orbital', desc: 'Combine traits to give a species identity and invest Eons in megastructures orbiting the world.', tag: 'The expansion' },
    { phase: 'PHASE 03', name: 'Transcendent', desc: 'The civilization can ascend. A new species begins while Eons, ruins and discoveries preserve the legacy.', tag: 'The legacy' },
  ],

  /* ---- Traits section ---- */
  traitsLabel: 'The essence of the game',
  traitsSubtitle: 'Designed to offer an intimate, contemplative and aesthetic alternative within incremental simulation.',

  /* ---- Status section ---- */
  statusLabel: 'Fact Sheet',

  /* ---- PressKit section ---- */
  pressLabel: 'Press Kit',
  pressDescriptionLabel: 'Short description',
  pressEditorialLabel: 'Editorial guide:',
  pressContactTitle: 'Press and publisher contact',
  pressContactSubtitle: 'Request early access or official press material.',
  pressContactCta: 'Contact team',

  /* ---- FAQ section ---- */
  faqLabel: 'Common Questions',

  /* ---- Footer ---- */
  footerBackToTop: 'Back to orbit ↑',

  /* ---- LoopSteps section ---- */
  loopLabel: 'Game Loop',
  loopStepPrefix: 'Step',

  /* ---- Desktop companion UI ---- */
  deskMenuFile: 'File',
  deskMenuPlanet: 'Planet',
  deskMenuView: 'View',
  deskClock: 'Tue 16:20',
  deskIcons: [
    { glyph: '📁', label: 'Projects' },
    { glyph: '📄', label: 'notes.txt' },
    { glyph: '🖼️', label: 'Photos' },
  ],
  companionWins: [
    { id: 'n1', title: 'Awaken life', text: 'Click on the planet to awaken it.', glyph: '✨', color: '#F0D6A8' },
    { id: 'n2', title: 'Islands and eons', text: 'Every now and then a new island emerges and eons pass.', glyph: '🏝️', color: '#E8B9A0' },
    { id: 'n3', title: 'Orbital ring', text: 'Click: orbital ring. Right-click: summary. Drag to move it.', glyph: '💫', color: '#BFD9B0' },
  ],
  companionShowAllLabel: 'Show all notes',
  companionMinimizeLabel: 'Minimize',
  companionPlanetLayerAria: 'Transparent planet layer over your windows',
  companionPlanetSleepAria: 'Sleeping planet: click to awaken life',
  companionPlanetAwakeAria: 'Planet: click to open the orbital ring',
  companionRadialAria: 'Orbital ring',
  companionCloseLabel: 'Close',
  companionStatsIslands: 'Islands',
  companionStatsInhabitants: 'Inhabitants',
  companionStatsTemperature: 'Temperature',
  companionStatsEons: 'Eons',
  companionStatsPlanetaryPhase: 'Planetary Phase',
  companionStatsIslandEmergence: 'Island emergence',
  companionStatsLeftClickHint: 'Left-click opens the orbital ring.',
  companionTempCold: 'Cold',
  companionTempTemperate: 'Temperate',
  companionTempHot: 'Hot',

  /* ---- StoryHighlights ---- */
  storyNavAria: 'Featured game milestones',
  storyJumpAria: 'Go to step',
};
