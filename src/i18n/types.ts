/* ============================================
   i18n Type Definitions
   Shape of every translatable string used
   across the Planetary Sim website.
   ============================================ */

export type Locale = 'es' | 'en' | 'pt-BR';

export interface LocaleMeta {
  code: Locale;
  label: string;
  flag: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
];

export interface StoryBeat {
  eyebrow: string;
  title: string;
  text: string;
  fact: string;
  glyph: string;
}

export interface LoopStep {
  icon: string;
  title: string;
  text: string;
}

export interface Trait {
  icon: string;
  title: string;
  text: string;
}

export interface Pill {
  icon: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface RadialLabel {
  id: string;
  label: string;
  glyph: string;
}

export interface RadialPanels {
  stats: string;
  megas: string;
  almanac: string;
  evolution: string;
  trends: string;
}

export interface CompanionLayer {
  id: string;
  label: string;
  note: string;
}

export interface CompanionToggles {
  transparent: string;
  clickThrough: string;
}

export interface StatusRow {
  campo: string;
  valor: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FlowStep {
  tag: string;
  title: string;
  text: string;
  glyph: string;
  color: string;
}

export interface PhaseItem {
  phase: string;
  name: string;
  desc: string;
  tag: string;
}

export interface DeskIcon {
  glyph: string;
  label: string;
}

export interface CompanionWin {
  id: string;
  title: string;
  text: string;
  glyph: string;
  color: string;
}

export interface Translation {
  /* ---- Hero ---- */
  logline: string;
  elevator: string;
  ctaPulse: string;
  ctaPublisher: string;
  ctaPublisherShort: string;
  ctaExplore: string;
  hintScroll: string;

  /* ---- Story ---- */
  storyIntro: string;
  storyBeats: StoryBeat[];
  microLabels: string[];

  /* ---- Interior ---- */
  interiorTitle: string;
  interiorLead: string;
  interiorDescription: string;
  interiorSubline: string;
  interiorShaderNote: string;
  featuredQuote: string;
  pills: Pill[];

  /* ---- Companion ---- */
  companionLabel: string;
  companionTitle: string;
  companionDescription: string;
  companionHint: string;
  companionLayers: CompanionLayer[];
  companionToggles: CompanionToggles;
  radialLabels: RadialLabel[];
  radialPanels: RadialPanels;
  companionNote: string;

  /* ---- Loop ---- */
  loopTitle: string;
  loopDescription: string;
  loopSteps: LoopStep[];

  /* ---- Traits ---- */
  traitsTitle: string;
  traits: Trait[];

  /* ---- Phases ---- */
  phasesTitle: string;
  phasesDescription: string;

  /* ---- Status ---- */
  statusTitle: string;
  statusDescription: string;
  statusTable: StatusRow[];

  /* ---- Press ---- */
  pressTitle: string;
  pressShortDescription: string;
  pressNote: string;

  /* ---- FAQ ---- */
  faqTitle: string;
  faq: FaqItem[];

  /* ---- Footer ---- */
  disclaimer: string;
  footerTagline: string;

  /* ---- Headlines ---- */
  headlines: string[];

  /* ---- Badge ---- */
  badge: string;

  /* ---- Navigation ---- */
  nav: NavItem[];

  /* ---- UI labels (hardcoded in components) ---- */
  skipLink: string;
  navAria: string;
  homeAria: string;
  languageSelectorAria: string;
  languageSelectAria: string;
  heroPlatform: string;
  storyDemoTitle: string;
  storyDemoHint: string;

  /* ---- FlowOfLife ---- */
  flowLabel: string;
  flowTitle: string;
  flowSubtitle: string;
  flowSteps: FlowStep[];
  flowPlanetAria: string;

  /* ---- Phases section ---- */
  phasesLabel: string;
  phases: PhaseItem[];

  /* ---- Traits section ---- */
  traitsLabel: string;
  traitsSubtitle: string;

  /* ---- Status section ---- */
  statusLabel: string;

  /* ---- PressKit section ---- */
  pressLabel: string;
  pressDescriptionLabel: string;
  pressEditorialLabel: string;
  pressContactTitle: string;
  pressContactSubtitle: string;
  pressContactCta: string;

  /* ---- FAQ section ---- */
  faqLabel: string;

  /* ---- Footer ---- */
  footerBackToTop: string;

  /* ---- LoopSteps section ---- */
  loopLabel: string;
  loopStepPrefix: string;

  /* ---- Desktop companion UI ---- */
  deskMenuFile: string;
  deskMenuPlanet: string;
  deskMenuView: string;
  deskClock: string;
  deskIcons: DeskIcon[];
  companionWins: CompanionWin[];
  companionShowAllLabel: string;
  companionMinimizeLabel: string;
  companionPlanetLayerAria: string;
  companionPlanetSleepAria: string;
  companionPlanetAwakeAria: string;
  companionRadialAria: string;
  companionCloseLabel: string;
  companionStatsIslands: string;
  companionStatsInhabitants: string;
  companionStatsTemperature: string;
  companionStatsEons: string;
  companionStatsPlanetaryPhase: string;
  companionStatsIslandEmergence: string;
  companionStatsLeftClickHint: string;
  companionTempCold: string;
  companionTempTemperate: string;
  companionTempHot: string;

  /* ---- StoryHighlights ---- */
  storyNavAria: string;
  storyJumpAria: string;
}
