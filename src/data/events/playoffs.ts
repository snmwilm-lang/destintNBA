import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const playoffsEvents: EventTemplate[] = [
  {
    id: 'playoffs-premiere-qualification',
    category: 'playoffs',
    title: tt('Qualification en playoffs', 'Playoff qualification'),
    description: tt(
      "Ton équipe se qualifie pour les playoffs pour la première fois depuis ton arrivée. La pression monte d'un cran.",
      'Your team qualifies for the playoffs for the first time since you arrived. The pressure ramps up.',
    ),
    choices: [
      { label: tt('Se donner un objectif ambitieux publiquement', 'Set an ambitious public goal'), effects: { reputation: 3, mental: -1, popularite: 2 } },
      { label: tt('Rester humble et concentré match après match', 'Stay humble and focused game by game'), effects: { mental: 3, relationCoequipiers: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'playoffs-serie-decisive',
    category: 'playoffs',
    title: tt('Match décisif de série', 'Decisive game of the series'),
    description: tt(
      'Ta série est à égalité, ce match va décider de la suite de la saison.',
      'The series is tied — this game will decide the rest of the season.',
    ),
    choices: [
      { label: tt('Prendre les responsabilités offensives', 'Take the offensive responsibility'), effects: { reputation: 4, forme: -3 }, successChance: { baseChance: 0.5, statBonus: { technique: 0.01, mental: 0.01 }, onSuccess: { reputation: 6, popularite: 4 }, onFailure: { moral: -4 } } },
      { label: tt('Se fondre dans le collectif', 'Blend into the team system'), effects: { iqBasket: 3, relationCoequipiers: 3 } },
    ],
  },
  {
    id: 'playoffs-blessure-cle',
    category: 'playoffs',
    title: tt('Un cadre de l\'équipe se blesse en playoffs', 'A key player gets hurt in the playoffs'),
    description: tt(
      "Un joueur clé de ton équipe se blesse juste avant une série capitale. On se tourne vers toi.",
      'A key player on your team gets injured right before a crucial series. All eyes turn to you.',
    ),
    choices: [
      { label: tt('Accepter d\'endosser plus de responsabilités', 'Accept more responsibility'), effects: { tempsDeJeu: 6, reputation: 3, forme: -3 } },
      { label: tt('Rester dans ton rôle habituel', 'Stay in your usual role'), effects: { mental: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'playoffs-elimination',
    category: 'playoffs',
    title: tt('Élimination en playoffs', 'Eliminated in the playoffs'),
    description: tt(
      'La saison se termine plus tôt que prévu. La déception est grande dans le vestiaire.',
      'The season ends earlier than expected. Disappointment runs deep in the locker room.',
    ),
    choices: [
      { label: tt('Analyser objectivement ce qui a manqué', 'Objectively analyze what went wrong'), effects: { iqBasket: 3, mental: 2 } },
      { label: tt('Prendre du recul avant de faire le bilan', 'Take a step back before reflecting'), effects: { moral: 1, forme: 2 } },
    ],
  },
];
