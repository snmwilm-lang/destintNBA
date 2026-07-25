import type { Career, LocalizedText, StatKey } from '../types';

export interface Trait {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  check: (career: Career) => boolean;
  buff: Partial<Record<StatKey, number>>;
  nerf: Partial<Record<StatKey, number>>;
}

function tt(fr: string, en: string): LocalizedText {
  return { fr, en };
}

// Traits are earned mid-career from how the player has actually developed, not chosen directly —
// each one is a permanent, double-edged personality trait: a real buff paired with a real nerf.
export const TRAITS: Trait[] = [
  {
    id: 'early-genius',
    name: tt('Génie précoce', 'Early Genius'),
    description: tt(
      'Un basketball IQ hors norme acquis très jeune — mais un ego qui frotte parfois les vétérans.',
      'A freakishly high basketball IQ locked in early — but an ego that occasionally rubs veterans the wrong way.',
    ),
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
    check: (career) => career.age >= 33 && career.stats.mental >= 85,
    buff: { mental: 4, iqBasket: 3 },
    nerf: { physique: -4 },
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
    check: (career) => new Set(career.history.map((h) => h.league)).size >= 3,
    buff: { iqBasket: 3, mental: 3 },
    nerf: { relationCoequipiers: -3 },
  },
];

export function getTrait(id: string): Trait | undefined {
  return TRAITS.find((t) => t.id === id);
}

export function checkNewTraits(career: Career): Trait[] {
  return TRAITS.filter((trait) => !career.traits.includes(trait.id) && trait.check(career));
}
