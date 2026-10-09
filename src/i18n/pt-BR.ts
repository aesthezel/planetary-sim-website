import type { Translation } from './types';

export const ptBR: Translation = {
  /* ---- Hero (Órbita) ---- */
  logline: 'Seu mundo.\nNo seu ritmo.',
  elevator:
    'Desperte a vida em um planeta diminuto. Acompanhe a evolução de uma civilização com decisões ocasionais e volte quando quiser: seu mundo não te pune por se ausentar.',
  ctaPulse: 'Dar um pulso ao planeta',
  ctaPublisher: 'Contato publishers',
  ctaPublisherShort: 'Imprensa',
  ctaExplore: 'Veja como ele evolui',
  hintScroll: 'Arraste para girar o planeta · Deslize para vê-lo na sua área de trabalho ↓',

  /* ---- Tour visual ---- */
  storyIntro: 'Desperte um mundo. Acompanhe uma civilização. Preserve seu legado.',
  storyBeats: [
    {
      eyebrow: '01 · SEMENTE',
      title: 'Dê um nome ao seu mundo',
      text: 'O nome cria uma semente estável e uma geografia de ilhas única que pode ser regenerada.',
      fact: 'Nome → semente → geografia reproduzível',
      glyph: '✎',
    },
    {
      eyebrow: '02 · DESPERTAR',
      title: 'Uma ilha. A primeira centelha de vida.',
      text: 'Desperte a ilha inicial e observe a população crescer enquanto novas terras emergem.',
      fact: '1 ilha · população inicial 0',
      glyph: '✧',
    },
    {
      eyebrow: '03 · LEGADO',
      title: 'Cada espécie deixa sua marca',
      text: 'Escolha características, guie uma civilização até a transcendência e preserve suas ruínas e descobertas ao ascender.',
      fact: 'Planetária → Orbital → Transcendente',
      glyph: '◎',
    },
  ],
  microLabels: ['Um planeta procedural', 'Decisões ocasionais', 'Legado persistente'],

  /* ---- Interior: O que é ---- */
  interiorTitle: 'O que é Planetary Sim?',
  interiorLead: 'Uma simulação incremental aconchegante e companheiro de área de trabalho.',
  interiorDescription:
    'Uma simulação incremental aconchegante e companheiro de área de trabalho. Desperte a vida em um planeta procedural, oriente a evolução de sua espécie e observe cada ascensão deixar um legado.',
  interiorSubline:
    'O mundo avança principalmente sozinho. Volte quando quiser: a estase reduz a pressão e protege uma experiência sem punições por se ausentar.',
  interiorShaderNote:
    'Sob a superfície, o shader PlanetInterior pinta faixas de profundidade, raios de luz, cáusticas e bolhas com uma animação quantizada a 12 fps. O oceano visível usa PlanetWater: ondulação toon, espuma ao redor das costas e textura clay.',
  featuredQuote: '"Cada mundo acaba se tornando a memória do próximo."',
  pills: [
    { icon: '✧', label: 'Desperte a vida' },
    { icon: '◷', label: 'Observe no seu ritmo' },
    { icon: '◎', label: 'Deixe um legado' },
  ],

  /* ---- Companheiro de área de trabalho ---- */
  companionLabel: '✦  ASSIM ELE VIVE NA SUA TELA',
  companionTitle: 'Seu planeta, ao lado das suas janelas.',
  companionDescription:
    'Planetary Sim vive em um canto da sua área de trabalho, girando ao seu lado enquanto você trabalha, estuda ou descansa.',
  companionHint:
    'Clique: desperta e abre o anel · Clique direito: resumo · Arraste o planeta · Toque ✧ para coletar uma partícula',
  companionLayers: [
    { id: 'top', label: 'Superior', note: 'Sempre acima' },
    { id: 'normal', label: 'Normal', note: 'Como qualquer janela' },
    { id: 'bottom', label: 'Inferior', note: 'Atrás de tudo' },
  ],
  companionToggles: {
    transparent: 'Fundo transparente',
    clickThrough: 'Clique através',
  },
  radialLabels: [
    { id: 'stats', label: 'Estatísticas', glyph: '✦' },
    { id: 'megas', label: 'Megaestruturas', glyph: '◎' },
    { id: 'almanac', label: 'Almanaque', glyph: '❖' },
    { id: 'evolution', label: 'Evolução', glyph: '❋' },
    { id: 'trends', label: 'Tendências', glyph: '≈' },
  ],
  radialPanels: {
    stats: 'Status do planeta: ilhas, habitantes, temperatura e éons.',
    megas: 'Custo, requisito e efeito de cada megaestrutura orbital.',
    almanac: 'Descobertas e progresso de coleção entre ciclos.',
    evolution: 'Espécie, mutação disponível e ascensão.',
    trends: 'Eixos Natureza ↔ Tecnologia e Frio ↔ Calor.',
  },
  companionNote:
    'Recriação web do planeta flutuando sobre outras janelas; não simula um sistema operacional nem substitui uma build do jogo.',

  /* ---- Como jogar ---- */
  loopTitle: 'De uma ilha ao legado.',
  loopDescription:
    'Três fases para acompanhar uma civilização da sua primeira ilha até a transcendência.',
  loopSteps: [
    { icon: '✨', title: 'Desperte a vida', text: 'Nomeie seu planeta, desperte a vida com um clique e observe as primeiras ilhas surgirem.' },
    { icon: '🌱', title: 'Molde a evolução', text: 'Colete partículas astrais, escolha características evolutivas e oriente as tendências da sua civilização.' },
    { icon: '🏛️', title: 'Construa legado', text: 'Invista Éons em megaestruturas visíveis que orbitam o planeta como monumentos à sua espécie.' },
    { icon: '🔄', title: 'Ascenda', text: 'A espécie transcende e dá lugar a outra. As ruínas e descobertas preservam o legado de ciclos anteriores.' },
  ],

  /* ---- Diferenciadores ---- */
  traitsTitle: 'O que o diferencia?',
  traits: [
    { icon: '🪐', title: 'Um mundo para observar', text: 'Um planeta procedural em escala brinquedo, com ilhas emergentes, oceanos estilizados e vida orbital.' },
    { icon: '◷', title: 'Progresso sem pressão', text: 'A simulação avança principalmente sozinha. A estase reduz a pressão quando você se ausenta.' },
    { icon: '🧬', title: 'Espécies com identidade', text: 'Combine forma de vida, filosofia e material. Ao ascender, conserve Éons, ruínas e descobertas.' },
  ],

  /* ---- Fases ---- */
  phasesTitle: 'O planeta muda. O legado permanece.',
  phasesDescription: 'Uma progressão serena desde a primeira centelha de vida até uma nova ascensão.',

  /* ---- Status ---- */
  statusTitle: 'Status do projeto',
  statusDescription:
    'O projeto está em desenvolvimento como demo no Unity 6. Já conta com cena planetária, simulação de população e temperatura, emergência de ilhas, tutorial inicial, mutações combinatórias, fases, ascensão, Almanaque, megaestruturas e interface React/OneJS integrada no Unity.',
  statusTable: [
    { campo: 'Título', valor: 'Planetary Sim' },
    { campo: 'Gênero', valor: 'Simulação incremental passiva / experiência aconchegante' },
    { campo: 'Modo', valor: 'Um jogador' },
    { campo: 'Motor', valor: 'Unity 6, URP' },
    { campo: 'Status', valor: 'Demo/projeto em desenvolvimento' },
    { campo: 'Plataformas, data, preço', valor: 'A definir' },
  ],

  /* ---- Imprensa ---- */
  pressTitle: 'Imprensa',
  pressShortDescription:
    'Planetary Sim é uma experiência aconchegante de simulação incremental sobre a vida de um pequeno planeta procedural. Desperte uma civilização, acompanhe sua evolução e deixe cada ascensão adicionar um novo capítulo à sua história.',
  pressNote:
    'Não descrever o jogo como estratégia de colônias, sobrevivência ou simulação meteorológica realista. O clima externo é complementar e não é necessário para jogar.',

  /* ---- FAQ ---- */
  faqTitle: 'Perguntas frequentes',
  faq: [
    { q: 'O que o jogador faz?', a: 'Desperta a vida, observa o crescimento e toma decisões pontuais de evolução, tendências e construção.' },
    { q: 'É preciso jogar constantemente?', a: 'Não. A progressão é principalmente autônoma e a estase evita penalizar as pausas.' },
    { q: 'O que se conserva ao ascender?', a: 'Os Éons, o Almanaque e as ruínas/legado; a população e as características da espécie começam um novo ciclo.' },
    { q: 'O clima depende do tempo real ou da internet?', a: 'Não para jogar. Há documentação de uma integração meteorológica opcional, mas o design base funciona sem ela.' },
    { q: 'Quando será lançado e em quais plataformas?', a: 'A confirmar. O projeto está em desenvolvimento.' },
  ],

  /* ---- Rodapé ---- */
  disclaimer: 'Demo em desenvolvimento · Plataformas e data a confirmar',
  footerTagline: 'Uma pequena civilização. Um planeta que evolui no seu ritmo. Um legado que sobrevive a cada novo começo.',

  /* ---- Manchetes ---- */
  headlines: [
    'Um planeta diminuto. Civilizações inteiras. Um legado que perdura.',
    'Desperte a vida e observe como seu planeta escreve sua própria história.',
    'Uma simulação aconchegante que evolui mesmo quando você apenas para para olhar.',
  ],

  /* ---- Badge ---- */
  badge: 'Plataforma alvo: PC · Demo em desenvolvimento',

  /* ---- Navegação ---- */
  nav: [
    { label: 'O jogo', href: '#que-es' },
    { label: 'Como jogar', href: '#fases' },
    { label: 'O companheiro', href: '#companero' },
  ],

  /* ---- Rótulos de UI ---- */
  skipLink: 'Pular para o conteúdo principal',
  navAria: 'Navegação principal',
  homeAria: 'Planetary Sim — Início',
  languageSelectorAria: 'Idioma',
  languageSelectAria: 'Selecionar idioma',
  heroPlatform: 'Simulação incremental aconchegante · Um jogador',
  storyDemoTitle: 'TOUR DA DEMO',
  storyDemoHint: 'Role para descobrir cada sistema',

  /* ---- FlowOfLife ---- */
  flowLabel: '✦  O QUE VOCÊ FARÁ EM PLANETARY SIM',
  flowTitle: 'Da poeira à vida.',
  flowSubtitle: 'Molde um planeta diminuto e acompanhe-o em cada era de sua história, no seu ritmo.',
  flowSteps: [
    { tag: '01 · ROCHA', title: 'Molde a crosta', text: 'Levante montanhas, abra crateras e trace as costas do seu mundo.', glyph: '⛰️', color: '#F6C3B5' },
    { tag: '02 · ÁGUA', title: 'Chame a chuva', text: 'Preencha vales e crie oceanos, rios e lagos onde você decidir.', glyph: '🌊', color: '#BFD9F2' },
    { tag: '03 · PRIMEIRA VIDA', title: 'Semeie a vida', text: 'Espalhe sementes e algas, e observe como se adaptam a cada clima.', glyph: '🌱', color: '#C9E8D5' },
    { tag: '04 · FLORESTAS', title: 'Cuide das estações', text: 'Suas florestas mudam com o verão, o outono e a neve.', glyph: '🌲', color: '#E3D6F5' },
    { tag: '05 · ECOSSISTEMA', title: 'Deixe florescer', text: 'Criaturas, chuvas e pequenas surpresas aparecem e vivem com você.', glyph: '✨', color: '#F7E1A8' },
  ],
  flowPlanetAria: 'Planeta 3D acompanhando o tour',

  /* ---- Seção Fases ---- */
  phasesLabel: 'Três fases · um legado',
  phases: [
    { phase: 'FASE 01', name: 'Planetária', desc: 'Nomeie o planeta para fixar sua semente, desperte a primeira ilha e observe novas terras emergirem.', tag: 'A origem' },
    { phase: 'FASE 02', name: 'Orbital', desc: 'Combine características para dar identidade a uma espécie e invista Éons em megaestruturas que orbitam o mundo.', tag: 'A expansão' },
    { phase: 'FASE 03', name: 'Transcendente', desc: 'A civilização pode ascender. Uma nova espécie começa enquanto Éons, ruínas e descobertas preservam o legado.', tag: 'O legado' },
  ],

  /* ---- Seção Características ---- */
  traitsLabel: 'A essência do jogo',
  traitsSubtitle: 'Projetado para oferecer uma alternativa íntima, contemplativa e estética dentro da simulação incremental.',

  /* ---- Seção Status ---- */
  statusLabel: 'Ficha Técnica',

  /* ---- Seção Kit de Imprensa ---- */
  pressLabel: 'Kit de Imprensa',
  pressDescriptionLabel: 'Descrição curta',
  pressEditorialLabel: 'Guia editorial:',
  pressContactTitle: 'Contato de imprensa e publishers',
  pressContactSubtitle: 'Solicite acesso antecipado ou material de imprensa oficial.',
  pressContactCta: 'Contatar equipe',

  /* ---- Seção FAQ ---- */
  faqLabel: 'Dúvidas Frequentes',

  /* ---- Rodapé ---- */
  footerBackToTop: 'Voltar à órbita ↑',

  /* ---- Seção LoopSteps ---- */
  loopLabel: 'Ciclo de Jogo',
  loopStepPrefix: 'Passo',

  /* ---- UI do companheiro de área de trabalho ---- */
  deskMenuFile: 'Arquivo',
  deskMenuPlanet: 'Planeta',
  deskMenuView: 'Ver',
  deskClock: 'ter 16:20',
  deskIcons: [
    { glyph: '📁', label: 'Projetos' },
    { glyph: '📄', label: 'notas.txt' },
    { glyph: '🖼️', label: 'Fotos' },
  ],
  companionWins: [
    { id: 'n1', title: 'Desperte a vida', text: 'Clique no planeta para despertá-lo.', glyph: '✨', color: '#F0D6A8' },
    { id: 'n2', title: 'Ilhas e éons', text: 'De vez em quando surge uma nova ilha e passam os éons.', glyph: '🏝️', color: '#E8B9A0' },
    { id: 'n3', title: 'Anel orbital', text: 'Clique: anel orbital. Clique direito: resumo. Arraste para movê-lo.', glyph: '💫', color: '#BFD9B0' },
  ],
  companionShowAllLabel: 'Mostrar todas as notas',
  companionMinimizeLabel: 'Minimizar',
  companionPlanetLayerAria: 'Camada transparente do planeta sobre suas janelas',
  companionPlanetSleepAria: 'Planeta adormecido: clique para despertar a vida',
  companionPlanetAwakeAria: 'Planeta: clique para abrir o anel orbital',
  companionRadialAria: 'Anel orbital',
  companionCloseLabel: 'Fechar',
  companionStatsIslands: 'Ilhas',
  companionStatsInhabitants: 'Habitantes',
  companionStatsTemperature: 'Temperatura',
  companionStatsEons: 'Éons',
  companionStatsPlanetaryPhase: 'Fase Planetária',
  companionStatsIslandEmergence: 'Emergência de ilha',
  companionStatsLeftClickHint: 'Clique esquerdo abre o anel orbital.',
  companionTempCold: 'Frio',
  companionTempTemperate: 'Temperado',
  companionTempHot: 'Quente',

  /* ---- StoryHighlights ---- */
  storyNavAria: 'Marcos destacados do jogo',
  storyJumpAria: 'Ir para o passo',
};
