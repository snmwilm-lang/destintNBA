import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const jeuxOlympiquesEvents: EventTemplate[] = [
  {
    id: 'jo-selection-equipe',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
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
    id: 'jo-prequel-finale',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('La veille de la finale olympique', 'The eve of the Olympic final'),
    description: tt(
      "Demain, une nation entière retient son souffle. Le sélectionneur rassemble le groupe une dernière fois avant le sommet du basket mondial.",
      'Tomorrow, an entire nation holds its breath. The coach gathers the group one last time before the summit of world basketball.',
    ),
    minAge: 20,
    weight: 10,
    choices: [
      {
        label: tt('Prendre la parole devant le groupe', 'Speak up in front of the group'),
        resultText: tt(
          "Tu regardes tes coéquipiers dans les yeux : \"On est venu ici pour l'or.\" Le silence qui suit est chargé.",
          'You look your teammates in the eye: "We came here for gold." The silence that follows is heavy.',
        ),
        effects: { mental: 3, reputation: 1 },
        linkedNextEventId: 'jo-finale-olympique',
      },
      {
        label: tt('Rassurer les plus jeunes du groupe', 'Reassure the younger players in the group'),
        resultText: tt(
          "Tu prends le temps de parler individuellement à ceux qui vivent leur première grande finale.",
          'You take the time to talk one-on-one with the ones living through their first big final.',
        ),
        effects: { relationCoequipiers: 3, iqBasket: 2 },
        linkedNextEventId: 'jo-finale-olympique',
      },
      {
        label: tt('Rester seul avec tes pensées', 'Stay alone with your thoughts'),
        resultText: tt(
          "Tu n'as pas besoin de mots. Demain, tout se joue — tu le sais depuis toujours.",
          "You don't need words. Tomorrow, everything is on the line — you've always known that.",
        ),
        effects: { mental: 5, moral: 1 },
        linkedNextEventId: 'jo-finale-olympique',
      },
    ],
  },
  {
    id: 'jo-finale-olympique',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Finale olympique', 'Olympic final'),
    description: tt(
      'Ton équipe nationale dispute la finale devant le monde entier. La pression est à son comble.',
      'Your national team plays the final in front of the whole world. The pressure is at its peak.',
    ),
    minAge: 20,
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
      {
        label: tt("Jouer collectif jusqu'au bout", 'Play team basketball until the end'),
        effects: { relationCoequipiers: 6, iqBasket: 3 },
        successChance: {
          baseChance: 0.48,
          statBonus: { iqBasket: 0.01, relationCoequipiers: 0.01 },
          onSuccess: { reputation: 10, popularite: 8 },
          onFailure: { moral: -6 },
          successText: tt("L'or olympique, en équipe. Le collectif l'a emporté.", 'Olympic gold, as a team. The collective effort paid off.'),
          failureText: tt("La médaille d'argent a un goût amer malgré tes efforts.", 'The silver medal tastes bitter despite your efforts.'),
        },
      },
    ],
  },
  {
    id: 'jo-elimination-groupes',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé dès la phase de groupes', 'Eliminated in the group stage'),
    description: tt(
      "Ton équipe nationale ne passe pas le premier tour. Le rêve olympique s'arrête net, bien plus tôt que prévu.",
      'Your national team fails to get out of the first round. The Olympic dream ends abruptly, far earlier than hoped.',
    ),
    minAge: 20,
    weight: 1,
    choices: [
      { label: tt('Analyser les erreurs sans complaisance', 'Break down the mistakes honestly'), effects: { iqBasket: 3, mental: 2, moral: -2 } },
      { label: tt('Tourner la page rapidement', 'Move on quickly'), effects: { moral: 2, forme: 2 } },
    ],
  },
  {
    id: 'jo-elimination-quarts',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé en quart de finale', 'Eliminated in the quarterfinals'),
    description: tt(
      "Ton équipe nationale s'incline en quart de finale, si près du dernier carré.",
      'Your national team falls in the quarterfinals, agonizingly close to the final four.',
    ),
    minAge: 20,
    weight: 1,
    choices: [
      { label: tt('Retenir les points positifs du tournoi', 'Focus on the tournament\'s positives'), effects: { moral: 3, reputation: 2 } },
      { label: tt("Ressasser l'occasion manquée", 'Dwell on the missed opportunity'), effects: { mental: 2, moral: -3 } },
    ],
  },
  {
    id: 'jo-elimination-demies',
    category: 'jeuxOlympiques',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé en demi-finale olympique', 'Eliminated in the Olympic semifinal'),
    description: tt(
      "Ton équipe nationale tombe en demi-finale et devra se contenter de la petite finale pour le bronze.",
      'Your national team falls in the semifinal and will have to settle for the bronze-medal game.',
    ),
    minAge: 20,
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
    leagues: ['nba', 'gLeague', 'europe'],
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
