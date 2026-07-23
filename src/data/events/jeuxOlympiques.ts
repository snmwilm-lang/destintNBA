import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const jeuxOlympiquesEvents: EventTemplate[] = [
  {
    id: 'jo-selection-equipe',
    category: 'jeuxOlympiques',
    title: tt('Sélectionné pour les Jeux Olympiques', 'Selected for the Olympic Games'),
    description: tt(
      "Le sélectionneur national t'inclut dans la liste des joueurs retenus pour les Jeux.",
      'The national coach includes you on the roster for the Games.',
    ),
    minAge: 20,
    weight: 2,
    choices: [
      { label: tt('Accepter avec fierté malgré la fatigue de la saison', 'Accept with pride despite the season fatigue'), effects: { reputation: 6, forme: -4, moral: 5 } },
      { label: tt('Décliner pour préserver ton corps', 'Decline to protect your body'), effects: { forme: 3, reputation: -4 } },
    ],
  },
  {
    id: 'jo-finale-olympique',
    category: 'jeuxOlympiques',
    title: tt('Finale olympique', 'Olympic final'),
    description: tt(
      'Ton équipe nationale dispute la finale devant le monde entier. La pression est à son comble.',
      'Your national team plays the final in front of the whole world. The pressure is at its peak.',
    ),
    minAge: 20,
    unique: true,
    weight: 10,
    choices: [
      {
        label: tt('Prendre le rôle de leader offensif', 'Take on the offensive leadership role'),
        successChance: {
          baseChance: 0.48,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 15, popularite: 12 },
          onFailure: { moral: -6 },
          successText: tt("Tu portes ton équipe vers l'or olympique.", 'You carry your team to Olympic gold.'),
          failureText: tt("La médaille d'argent a un goût amer malgré tes efforts.", 'The silver medal tastes bitter despite your efforts.'),
        },
      },
      { label: tt("Jouer collectif jusqu'au bout", 'Play team basketball until the end'), effects: { relationCoequipiers: 6, iqBasket: 3 } },
    ],
  },
  {
    id: 'jo-village-olympique',
    category: 'jeuxOlympiques',
    title: tt('Le village olympique', 'The Olympic village'),
    description: tt(
      'Tu croises des athlètes de disciplines très différentes venus du monde entier dans le village olympique.',
      'You cross paths with athletes from very different sports, from all over the world, in the Olympic village.',
    ),
    minAge: 20,
    choices: [
      { label: tt("Profiter de l'expérience humaine", 'Enjoy the human experience'), effects: { moral: 4, popularite: 2 } },
      { label: tt('Rester isolé pour te concentrer sur le tournoi', 'Stay isolated to focus on the tournament'), effects: { forme: 2, mental: 1 } },
    ],
  },
];
