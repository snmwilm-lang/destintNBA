import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const playoffsEvents: EventTemplate[] = [
  {
    id: 'playoffs-premiere-qualification',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
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
    leagues: ['nba', 'gLeague', 'europe'],
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
    leagues: ['nba', 'gLeague', 'europe'],
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
    leagues: ['nba', 'gLeague', 'europe'],
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
  // A rare, full playoff run: three real elimination rounds, each won or lost on the choice made
  // (see PLAYOFF_RUN_TRANSITIONS in gameStore.ts), before handing off into the existing Finals
  // chain on a full sweep through. Flopping any round ends the season's run right there.
  {
    id: 'playoffs-run-round1',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Premier tour des playoffs', 'First round of the playoffs'),
    description: tt(
      "La série commence. Sept matchs, potentiellement, pour ouvrir la route — mais tout peut déjà s'arrêter ici.",
      'The series begins. Seven games, potentially, to open the road — but it can all end right here too.',
    ),
    weight: 1,
    choices: [
      {
        label: tt('Prendre le contrôle du money-time', 'Take control in crunch time'),
        successChance: {
          baseChance: 0.55,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 6, popularite: 4, moral: 4 },
          onFailure: { moral: -6, reputation: -2 },
          successText: tt('La série est bouclée. Premier tour passé.', 'The series is wrapped up. First round done.'),
          failureText: tt("La série t'échappe. Le premier tour s'arrête là.", 'The series slips away. The first round ends right here.'),
        },
      },
      {
        label: tt('Jouer collectif sur toute la série', 'Play team ball across the whole series'),
        effects: { relationCoequipiers: 3, iqBasket: 2 },
        successChance: {
          baseChance: 0.55,
          statBonus: { iqBasket: 0.01, relationCoequipiers: 0.008 },
          onSuccess: { reputation: 5, popularite: 3, moral: 4 },
          onFailure: { moral: -6, reputation: -2 },
          successText: tt('Le collectif suffit à passer ce premier tour.', 'The team effort is enough to get through this first round.'),
          failureText: tt("Malgré les efforts collectifs, la série vous échappe.", 'Despite the team effort, the series slips away.'),
        },
      },
    ],
  },
  {
    id: 'playoffs-run-eliminated-round1',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Élimination au premier tour', 'Eliminated in the first round'),
    description: tt(
      "Une saison qui promettait plus s'arrête dès le premier tour. Amère déception dans le vestiaire.",
      'A season that promised more ends right in the first round. Bitter disappointment in the locker room.',
    ),
    weight: 1,
    choices: [
      { label: tt('Encaisser et regarder vers la suite', 'Take it on the chin and look ahead'), effects: { mental: 3, moral: -2 } },
      { label: tt('Rester marqué par cette sortie', 'Stay marked by this exit'), effects: { moral: -4, mental: 1 } },
    ],
  },
  {
    id: 'playoffs-run-round2',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Demi-finale de conférence', 'Conference semifinals'),
    description: tt(
      "Le niveau monte encore d'un cran. Cette série va être plus dure que la précédente, tout le monde le sait.",
      'The level rises another notch. This series will be harder than the last one, everyone knows it.',
    ),
    weight: 1,
    choices: [
      {
        label: tt('Forcer ton rythme dès le début de série', 'Push your pace from the start of the series'),
        effects: { forme: -3 },
        successChance: {
          baseChance: 0.5,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 8, popularite: 6, moral: 5 },
          onFailure: { moral: -7, reputation: -3 },
          successText: tt('La série bascule de votre côté. Demi-finale de conférence passée.', 'The series tips your way. Conference semis done.'),
          failureText: tt("Cette fois, l'adversaire est trop fort. La saison s'arrête ici.", "This time, the opponent is too strong. The season ends here."),
        },
      },
      {
        label: tt('Gérer ton énergie sur la longueur', 'Manage your energy over the long haul'),
        effects: { forme: 2 },
        successChance: {
          baseChance: 0.5,
          statBonus: { mental: 0.012 },
          onSuccess: { reputation: 7, popularite: 5, moral: 5 },
          onFailure: { moral: -7, reputation: -3 },
          successText: tt('Ta gestion paie sur la durée. Demi-finale de conférence passée.', 'Your pacing pays off over the series. Conference semis done.'),
          failureText: tt("La série s'achève sur une désillusion collective.", 'The series ends in collective disappointment.'),
        },
      },
    ],
  },
  {
    id: 'playoffs-run-eliminated-round2',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Élimination en demi-finale de conférence', 'Eliminated in the conference semifinals'),
    description: tt(
      "Si près, et pourtant la saison s'arrête là, à deux tours de l'objectif.",
      'So close, and yet the season ends here, two rounds short of the goal.',
    ),
    weight: 1,
    choices: [
      { label: tt('Retenir les points positifs malgré tout', 'Focus on the positives despite it all'), effects: { moral: 2, reputation: 2 } },
      { label: tt("Ressasser cette occasion manquée", 'Dwell on the missed opportunity'), effects: { mental: 2, moral: -3 } },
    ],
  },
  {
    id: 'playoffs-run-round3',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Finale de conférence', 'Conference finals'),
    description: tt(
      "Une place en finale à la clé. C'est le tour le plus dur, celui qui sépare les vraies équipes de titre des autres.",
      'A spot in the Finals is on the line. This is the toughest round — the one that separates real title teams from the rest.',
    ),
    weight: 1,
    choices: [
      {
        label: tt('Jouer ta carte la plus dangereuse', 'Play your most dangerous card'),
        successChance: {
          baseChance: 0.4,
          statBonus: { technique: 0.012, mental: 0.012 },
          onSuccess: { reputation: 12, popularite: 9, moral: 7 },
          onFailure: { moral: -9, reputation: -4 },
          successText: tt('Vous arrachez la série. La Finale attend.', 'You claw out the series. The Finals await.'),
          failureText: tt("La finale de conférence vous échappe, cruellement.", 'The conference finals slip away, cruelly.'),
        },
      },
      {
        label: tt('Faire confiance au collectif jusqu\'au bout', 'Trust the team all the way through'),
        effects: { relationCoequipiers: 3 },
        successChance: {
          baseChance: 0.4,
          statBonus: { iqBasket: 0.01, relationCoequipiers: 0.01 },
          onSuccess: { reputation: 10, popularite: 8, moral: 7 },
          onFailure: { moral: -9, reputation: -4 },
          successText: tt('Le collectif porte l\'équipe jusqu\'en Finale.', 'The team effort carries the group all the way to the Finals.'),
          failureText: tt("Le système craque au pire moment. La saison s'arrête en finale de conférence.", 'The system breaks down at the worst moment. The season ends in the conference finals.'),
        },
      },
    ],
  },
  {
    id: 'playoffs-run-eliminated-round3',
    category: 'playoffs',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Élimination en finale de conférence', 'Eliminated in the conference finals'),
    description: tt(
      "À une victoire de la Finale. La plus douloureuse des éliminations, à un tour du sommet.",
      'One win away from the Finals. The most painful kind of elimination — one round short of the summit.',
    ),
    weight: 1,
    choices: [
      { label: tt('Transformer cette frustration en carburant', 'Turn this frustration into fuel'), effects: { mental: 3, moral: -2 } },
      { label: tt('Prendre le temps de digérer ce résultat', 'Take the time to process this result'), effects: { moral: -3, forme: 2 } },
    ],
  },
];
