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
    id: 'jo-elimination-groupes',
    category: 'jeuxOlympiques',
    title: tt('Éliminé dès la phase de groupes', 'Eliminated in the group stage'),
    description: tt(
      "Ton équipe nationale ne passe pas le premier tour. Le rêve olympique s'arrête net, bien plus tôt que prévu.",
      'Your national team fails to get out of the first round. The Olympic dream ends abruptly, far earlier than hoped.',
    ),
    minAge: 20,
    unique: true,
    weight: 1,
    choices: [
      { label: tt('Analyser les erreurs sans complaisance', 'Break down the mistakes honestly'), effects: { iqBasket: 3, mental: 2, moral: -2 } },
      { label: tt('Tourner la page rapidement', 'Move on quickly'), effects: { moral: 2, forme: 2 } },
    ],
  },
  {
    id: 'jo-elimination-quarts',
    category: 'jeuxOlympiques',
    title: tt('Éliminé en quart de finale', 'Eliminated in the quarterfinals'),
    description: tt(
      "Ton équipe nationale s'incline en quart de finale, si près du dernier carré.",
      'Your national team falls in the quarterfinals, agonizingly close to the final four.',
    ),
    minAge: 20,
    unique: true,
    weight: 1,
    choices: [
      { label: tt('Retenir les points positifs du tournoi', 'Focus on the tournament\'s positives'), effects: { moral: 3, reputation: 2 } },
      { label: tt("Ressasser l'occasion manquée", 'Dwell on the missed opportunity'), effects: { mental: 2, moral: -3 } },
    ],
  },
  {
    id: 'jo-elimination-demies',
    category: 'jeuxOlympiques',
    title: tt('Éliminé en demi-finale olympique', 'Eliminated in the Olympic semifinal'),
    description: tt(
      "Ton équipe nationale tombe en demi-finale et devra se contenter de la petite finale pour le bronze.",
      'Your national team falls in the semifinal and will have to settle for the bronze-medal game.',
    ),
    minAge: 20,
    unique: true,
    weight: 1,
    choices: [
      {
        label: tt('Se battre pour le bronze', 'Fight for the bronze'),
        successChance: {
          baseChance: 0.55,
          statBonus: { mental: 0.01 },
          onSuccess: { reputation: 8, popularite: 6, moral: 5 },
          onFailure: { moral: -3 },
          successText: tt('La médaille de bronze a un goût de fierté retrouvée.', 'The bronze medal tastes like pride regained.'),
          failureText: tt('Quatrième place, la pire des désillusions dans le sport.', 'Fourth place — the cruelest finish in sports.'),
        },
      },
      { label: tt('Digérer la déception en silence', 'Process the disappointment quietly'), effects: { mental: 2, moral: -2 } },
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
