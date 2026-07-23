import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const allStarEvents: EventTemplate[] = [
  {
    id: 'allstar-selection',
    category: 'allStar',
    title: tt('Sélectionné pour le All-Star Game', 'Selected for the All-Star Game'),
    description: tt(
      'Ton nom apparaît parmi les meilleurs joueurs de la ligue pour le grand match des étoiles.',
      "Your name appears among the league's best for the big all-star showcase.",
    ),
    minAge: 19,
    weight: 2,
    choices: [
      { label: tt("Savourer pleinement l'événement", 'Fully enjoy the event'), effects: { popularite: 6, moral: 4 } },
      { label: tt('Rester focalisé sur la progression', 'Stay focused on your development'), effects: { technique: 2, mental: 2 } },
    ],
  },
  {
    id: 'allstar-concours-dunk',
    category: 'allStar',
    title: tt('Concours de dunks', 'Dunk contest'),
    description: tt(
      'Tu es invité à participer au concours de dunks devant un public en délire.',
      'You are invited to compete in the dunk contest in front of a roaring crowd.',
    ),
    minAge: 19,
    choices: [
      {
        label: tt('Tenter un dunk spectaculaire et risqué', 'Attempt a spectacular, risky dunk'),
        successChance: {
          baseChance: 0.45,
          statBonus: { physique: 0.01 },
          onSuccess: { popularite: 10, reputation: 4 },
          onFailure: { popularite: -2, moral: -2 },
          successText: tt('Le dunk est parfait, la foule est en délire.', 'The dunk is perfect, the crowd goes wild.'),
          failureText: tt('Le dunk échoue devant tout le monde, un moment gênant.', 'The dunk fails in front of everyone — an awkward moment.'),
        },
      },
      { label: tt('Jouer la sécurité avec un dunk classique', 'Play it safe with a classic dunk'), effects: { popularite: 3 } },
    ],
  },
  {
    id: 'allstar-week-end-media',
    category: 'allStar',
    title: tt('Week-end médiatique du All-Star', 'All-Star media weekend'),
    description: tt(
      "Le week-end des étoiles s'accompagne d'une avalanche d'interviews et d'événements sponsors.",
      'All-Star weekend comes with a flood of interviews and sponsor events.',
    ),
    minAge: 19,
    choices: [
      { label: tt('Accepter toutes les sollicitations', 'Accept every request'), effects: { popularite: 5, forme: -3 }, moneyDelta: 3000 },
      { label: tt('Filtrer et te préserver', 'Filter requests and protect yourself'), effects: { forme: 1, popularite: 2 } },
    ],
  },
];
