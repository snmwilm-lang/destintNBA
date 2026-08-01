import type { Career, LocalizedText, StatKey } from '../types';

export type TraitRarity = 'commun' | 'rare' | 'legendaire';

export interface Trait {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  rarity: TraitRarity;
  check: (career: Career) => boolean;
  buff: Partial<Record<StatKey, number>>;
  nerf: Partial<Record<StatKey, number>>;
}

function tt(fr: string, en: string): LocalizedText {
  return { fr, en };
}

// Traits are earned mid-career from how the player has actually developed, not chosen directly —
// each one is a permanent, double-edged personality trait: a real buff paired with a real nerf.
// Three rarity tiers, roughly in order of how hard the check() is to satisfy: 'commun' traits
// come from a single stat/skill threshold, 'rare' traits from a genuine pattern of choices built
// up over time, and 'legendaire' traits require several of the game's hardest-to-reach systems
// to align at once — and pay off with noticeably bigger buff/nerf magnitudes to match.
export const TRAITS: Trait[] = [
  {
    id: 'early-genius',
    name: tt('Génie précoce', 'Early Genius'),
    description: tt(
      'Un basketball IQ hors norme acquis très jeune — mais un ego qui frotte parfois les vétérans.',
      'A freakishly high basketball IQ locked in early — but an ego that occasionally rubs veterans the wrong way.',
    ),
    rarity: 'commun',
    check: (career) => career.age <= 21 && career.stats.iqBasket >= 85,
    buff: { iqBasket: 4, mental: 3 },
    nerf: { relationCoequipiers: -4 },
  },
  {
    id: 'iron-body',
    name: tt('Corps de fer', 'Iron Body'),
    description: tt(
      "Un corps taillé pour durer, presque insensible à l'usure — au prix d'un style plus mécanique, moins spectaculaire.",
      'A body built to last, almost immune to wear — at the cost of a more mechanical, less flashy game.',
    ),
    rarity: 'commun',
    check: (career) => career.history.length >= 4 && career.history.slice(-4).every((h) => h.blessures.length === 0),
    buff: { risqueBlessure: -10, forme: 4 },
    nerf: { popularite: -3 },
  },
  {
    id: 'media-darling',
    name: tt('Idole médiatique', 'Media Darling'),
    description: tt(
      "Le public et les sponsors t'adorent — mais toutes ces sollicitations grignotent ton énergie.",
      'The crowd and sponsors adore you — but the constant demands chip away at your energy.',
    ),
    rarity: 'commun',
    check: (career) => career.stats.popularite >= 90,
    buff: { popularite: 4, reputation: 3 },
    nerf: { forme: -4 },
  },
  {
    id: 'born-leader',
    name: tt('Meneur né', 'Born Leader'),
    description: tt(
      "Le vestiaire gravite naturellement autour de toi — parfois au détriment de ta propre finition.",
      'The locker room naturally gravitates around you — sometimes at the expense of your own scoring polish.',
    ),
    rarity: 'commun',
    check: (career) => career.stats.relationCoequipiers >= 85 && career.stats.relationCoach >= 80,
    buff: { relationCoequipiers: 4, mental: 3 },
    nerf: { technique: -3 },
  },
  {
    id: 'gunslinger',
    name: tt('Franc-tireur', 'Gunslinger'),
    description: tt(
      "Une confiance en ton tir sans limite — au prix de coéquipiers parfois frustrés d'être ignorés.",
      'Bottomless confidence in your shot — at the cost of teammates occasionally frustrated at being ignored.',
    ),
    rarity: 'commun',
    check: (career) => career.stats.technique >= 90 && career.stats.mental >= 80,
    buff: { technique: 4 },
    nerf: { relationCoequipiers: -3 },
  },
  {
    id: 'old-sage',
    name: tt('Vieux sage', 'Old Sage'),
    description: tt(
      "L'expérience a remplacé l'explosivité — ta lecture du jeu est désormais inégalée.",
      'Experience has replaced explosiveness — your read of the game is now unmatched.',
    ),
    rarity: 'commun',
    check: (career) => career.age >= 33 && career.stats.mental >= 85,
    buff: { mental: 4, iqBasket: 3 },
    nerf: { physique: -4 },
  },
  {
    id: 'dunk-specialist',
    name: tt('Spécialiste du dunk', 'Dunk Specialist'),
    description: tt(
      "Le cercle t'appartient — un highlight à chaque possession, mais un corps qui encaisse chaque atterrissage.",
      'The rim belongs to you — a highlight on every possession, but a body that takes the hit on every landing.',
    ),
    rarity: 'commun',
    check: (career) => career.skillDunk >= 6,
    buff: { physique: 4, popularite: 2 },
    nerf: { risqueBlessure: 4 },
  },
  {
    id: 'sharpshooter-badge',
    name: tt('Tireur d\'élite', 'Sharpshooter'),
    description: tt(
      'Ton tir extérieur est devenu une arme redoutable — au prix du reste de ton jeu, un peu négligé.',
      'Your outside shot has become a genuine weapon — at the cost of the rest of your game, somewhat neglected.',
    ),
    rarity: 'commun',
    check: (career) => career.skillShoot >= 6,
    buff: { technique: 4 },
    nerf: { physique: -3 },
  },
  {
    id: 'floor-general-badge',
    name: tt('Chef d\'orchestre', 'Floor General'),
    description: tt(
      "Tu vois le jeu une passe à l'avance — mais ta propre finition en a payé le prix.",
      "You see the game a pass ahead of everyone else — but your own finishing has paid the price for it.",
    ),
    rarity: 'commun',
    check: (career) => career.skillPass >= 6,
    buff: { iqBasket: 3, relationCoequipiers: 3 },
    nerf: { technique: -3 },
  },
  {
    id: 'defensive-anchor',
    name: tt('Ancre défensive', 'Defensive Anchor'),
    description: tt(
      "Rien ne passe de ton côté du terrain — un travail de l'ombre que les stats de points ne récompensent jamais vraiment.",
      "Nothing gets through on your side of the floor — thankless work that the scoring column never quite rewards.",
    ),
    rarity: 'commun',
    check: (career) => career.skillDef >= 6,
    buff: { mental: 4 },
    nerf: { popularite: -3 },
  },
  // Rare, unique traits earned from a genuine pattern of choices over time (not just a stat
  // snapshot) — a deliberate storyline the player built, not a threshold they crossed by chance.
  {
    id: 'viral-sensation',
    name: tt('Phénomène viral', 'Viral Sensation'),
    description: tt(
      "Chaque moment devient du contenu — ton feed explose, mais le repos, lui, se fait rare.",
      'Every moment becomes content — your feed explodes, but rest becomes a rare commodity.',
    ),
    rarity: 'rare',
    check: (career) =>
      career.choiceLog.filter((l) => l.eventId.startsWith('reseaux-video-virale') && l.choiceId.endsWith('-c0')).length >= 3 &&
      career.stats.popularite >= 80,
    buff: { popularite: 5, reputation: 2 },
    nerf: { forme: -4 },
  },
  {
    id: 'rival-nemesis',
    name: tt('Bourreau de son rival', "Rival's Nemesis"),
    description: tt(
      'Chaque duel devient une démonstration — ce rival ne dort plus tranquille avant de te croiser.',
      'Every duel turns into a statement — that rival stops sleeping easy before facing you.',
    ),
    rarity: 'rare',
    check: (career) => career.rivalRecord.wins >= 8 && career.rivalRecord.wins >= career.rivalRecord.losses * 2,
    buff: { mental: 4, reputation: 3 },
    nerf: { relationCoequipiers: -2 },
  },
  {
    id: 'public-enemy',
    name: tt("Ennemi public d'une ville", "A City's Public Enemy"),
    description: tt(
      "Toute une ville te déteste et le lui rend bien — et ça ne fait qu'ajouter à la légende.",
      'A whole city hates you, and you thrive on it — it only adds to the legend.',
    ),
    rarity: 'rare',
    check: (career) =>
      career.rivalryProvoked && career.rivalTeamRecord.wins >= 5 && career.stats.popularite >= 80,
    buff: { popularite: 5, mental: 3 },
    nerf: { reputation: -3 },
  },
  {
    id: 'finals-legend',
    name: tt('Légende de la finale', 'Finals Legend'),
    description: tt(
      "Le grand moment ne t'a jamais fait peur — la ligue entière sait désormais ton nom.",
      'The big moment never scared you off — the whole league knows your name now.',
    ),
    rarity: 'rare',
    check: (career) => career.hasReachedFinale && career.eliteBreakthroughCount >= 1,
    buff: { reputation: 4, mental: 2 },
    nerf: { forme: -3 },
  },
  {
    id: 'legendary-loyalty',
    name: tt('Loyauté légendaire', 'Legendary Loyalty'),
    description: tt(
      "Jamais parti voir ailleurs — le même maillot depuis le premier jour, année après année.",
      'Never once looked elsewhere — the same jersey since day one, year after year.',
    ),
    rarity: 'rare',
    check: (career) => career.history.length >= 8 && new Set(career.history.map((h) => h.team)).size === 1,
    buff: { relationCoequipiers: 5, popularite: 3 },
    nerf: { reputation: -3 },
  },
  {
    id: 'world-traveler',
    name: tt('Globe-trotteur', 'World Traveler'),
    description: tt(
      "Lycée, ligue pro, aventure à l'étranger — tu as vu du basket sous toutes les latitudes.",
      'High school, the pros, a stint abroad — you\'ve seen basketball on every continent.',
    ),
    rarity: 'rare',
    check: (career) => new Set(career.history.map((h) => h.league)).size >= 3,
    buff: { iqBasket: 3, mental: 3 },
    nerf: { relationCoequipiers: -3 },
  },
  {
    id: 'comeback-story',
    name: tt('Histoire de résilience', 'Comeback Story'),
    description: tt(
      "Une blessure sérieuse aurait pu tout arrêter — tu es revenu plus dur mentalement, mais le corps garde une fragilité.",
      'A serious injury could have ended it all — you came back mentally tougher, but your body kept a lingering fragility.',
    ),
    rarity: 'rare',
    check: (career) => career.choiceLog.some((l) => l.eventId === 'blessure-grave-decision') && career.stats.forme >= 55,
    buff: { mental: 5, reputation: 2 },
    nerf: { risqueBlessure: 4 },
  },
  {
    id: 'record-breaker',
    name: tt('Chasseur de records', 'Record Chaser'),
    description: tt(
      "Ton nom apparaît désormais dans les livres d'histoire de la ligue — mais on t'attend au tournant chaque soir pour recommencer.",
      "Your name now sits in the league's record books — but everyone expects you to do it again every single night.",
    ),
    rarity: 'rare',
    check: (career) => career.recordsBrokenCount >= 2,
    buff: { reputation: 5, popularite: 3 },
    nerf: { moral: -3 },
  },
  {
    id: 'mvp-caliber',
    name: tt('Calibre MVP', 'MVP Caliber'),
    description: tt(
      "Tu as prouvé que tu pouvais être le meilleur joueur d'une ligue entière — un standard désormais impossible à ignorer, pour toi comme pour les autres.",
      "You've proven you can be the best player in an entire league — a standard now impossible to ignore, for you and everyone else.",
    ),
    rarity: 'rare',
    check: (career) => career.trophies.filter((t) => t.id.endsWith('-mvp')).length >= 1,
    buff: { reputation: 4, mental: 3 },
    nerf: { relationCoequipiers: -3 },
  },
  {
    id: 'playoff-warrior',
    name: tt('Guerrier des playoffs', 'Playoff Warrior'),
    description: tt(
      "Le mois d'avril te transforme — un tout autre joueur apparaît dès que l'enjeu monte, au prix d'une saison régulière parfois plus économe.",
      "The postseason transforms you — a whole different player shows up once the stakes rise, at the cost of a regular season played a little more conservatively.",
    ),
    rarity: 'rare',
    check: (career) => career.playoffRunCount >= 2,
    buff: { mental: 5, iqBasket: 2 },
    nerf: { forme: -3 },
  },
  // Legendary traits: deliberately the hardest checks in the game, requiring several of the
  // rarest systems (elite breakthroughs, real championships, maxed specialty skills) to line up
  // in a single career — and paying off with buff/nerf magnitudes well above every other tier.
  {
    id: 'complete-player',
    name: tt('Joueur complet', 'Complete Player'),
    description: tt(
      "Dunk, tir, passe, défense : aucune faiblesse à exploiter. Un niveau d'exigence de tous les instants qui use autant qu'il impressionne.",
      "Dunk, shot, playmaking, defense: no weakness left to exploit anywhere. A standard so total it wears on you as much as it impresses everyone else.",
    ),
    rarity: 'legendaire',
    check: (career) => career.skillDunk >= 8 && career.skillShoot >= 8 && career.skillPass >= 8 && career.skillDef >= 8,
    buff: { technique: 8, physique: 6, iqBasket: 6, mental: 6 },
    nerf: { forme: -6, popularite: -4 },
  },
  {
    id: 'goat-status',
    name: tt('Statut de GOAT', 'GOAT Status'),
    description: tt(
      "Des titres, des sommets de dominance répétés, une réputation quasi parfaite : on ne parle plus de toi comme d'une star, mais comme d'un sommet de l'histoire du sport — un poids que plus personne d'autre ne porte.",
      "Championships, repeated peaks of dominance, a reputation near the ceiling: people no longer talk about you as a star, but as one of the sport's all-time peaks — a weight nobody else in the league carries.",
    ),
    rarity: 'legendaire',
    // Deliberately set at the hard ceiling of each underlying system (elite breakthroughs cap at
    // 6 for the whole career, repeat Finals trips are capped at 3 titles) rather than a merely
    // high threshold — simulation showed a 5-breakthrough/2-title/95-rep version fired in roughly
    // 1 in 4 careers even under random, unoptimized play, nowhere close to "legendary."
    check: (career) =>
      career.eliteBreakthroughCount >= 6 &&
      career.trophies.filter((t) => t.id.includes('-champion')).length >= 3 &&
      career.stats.reputation >= 97,
    buff: { reputation: 10, mental: 8, potentiel: 5 },
    nerf: { forme: -6, popularite: -4 },
  },
];

export function getTrait(id: string): Trait | undefined {
  return TRAITS.find((t) => t.id === id);
}

export function checkNewTraits(career: Career): Trait[] {
  return TRAITS.filter((trait) => !career.traits.includes(trait.id) && trait.check(career));
}
