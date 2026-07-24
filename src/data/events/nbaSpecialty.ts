import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const nbaSpecialtyEvents: EventTemplate[] = [
  {
    id: 'nba-arrival-specialty',
    category: 'coach',
    title: tt('Trouver ton identité en NBA', 'Finding your NBA identity'),
    description: tt(
      "Te voilà en NBA. Ton coach s'assoit avec toi pour définir le rôle précis que tu vas incarner dans l'équipe — la spécialité qui fera ta réputation dans la ligue.",
      "You've made it to the NBA. Your coach sits down with you to define the exact role you'll play on the team — the specialty that will build your reputation in the league.",
    ),
    unique: true,
    weight: 40,
    choices: [
      {
        label: tt('Sniper d\'élite', 'Elite Sniper'),
        resultText: tt(
          'Tu deviens une menace permanente à 3 points, capable de faire exploser un match en quelques tirs.',
          'You become a constant threat from deep, able to blow a game open in just a few shots.',
        ),
        effects: { technique: 10, reputation: 4, mental: 3 },
      },
      {
        label: tt('Rempart défensif', 'Defensive Wall'),
        resultText: tt(
          'Ta réputation se construit sur ta capacité à rendre la vie impossible à tes adversaires.',
          'Your reputation is built on making life miserable for whoever you guard.',
        ),
        effects: { physique: 9, iqBasket: 5, risqueBlessure: -4, reputation: 3 },
      },
      {
        label: tt('Meneur généreux', 'Floor General'),
        resultText: tt(
          'Tu deviens le métronome de ton équipe, celui qui élève le niveau de tout le monde autour de toi.',
          "You become your team's metronome — the one who elevates everyone around him.",
        ),
        effects: { iqBasket: 9, relationCoequipiers: 6, reputation: 3 },
      },
      {
        label: tt('Showman', 'Highlight Reel'),
        resultText: tt(
          'Chaque match devient une occasion de mettre le public debout.',
          'Every game becomes a chance to bring the crowd to its feet.',
        ),
        effects: { popularite: 10, reputation: 5, moral: 3 },
      },
      {
        label: tt('Increvable', 'Iron Man'),
        resultText: tt(
          'Ta fiabilité devient ta marque de fabrique : toujours présent, saison après saison.',
          'Your reliability becomes your trademark: always there, season after season.',
        ),
        effects: { forme: 8, risqueBlessure: -8, mental: 6 },
      },
    ],
  },
];
