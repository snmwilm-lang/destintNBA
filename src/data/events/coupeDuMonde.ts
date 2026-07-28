import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const coupeDuMondeEvents: EventTemplate[] = [
  {
    id: 'cdm-qualification',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Qualification pour la Coupe du Monde', 'World Cup qualification'),
    description: tt(
      'Ta sélection nationale se qualifie pour la Coupe du Monde, une compétition majeure dans ta carrière internationale.',
      'Your national team qualifies for the World Cup, a major milestone in your international career.',
    ),
    minAge: 19,
    weight: 2,
    choices: [
      { label: tt("T'investir à fond dans la préparation", 'Fully commit to preparation'), effects: { reputation: 4, forme: -2, mental: 2 } },
      { label: tt('Gérer ton investissement avec ton club en tête', 'Manage your involvement with your club in mind'), effects: { relationCoach: 2, reputation: 1 } },
    ],
  },
  {
    id: 'cdm-phase-groupes',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Phase de groupes serrée', 'Tight group stage'),
    description: tt(
      'Ta sélection joue un match crucial de phase de groupes face à une nation coriace.',
      'Your national team plays a crucial group-stage game against a tough opponent.',
    ),
    minAge: 19,
    choices: [
      { label: tt('Hausser ton niveau de jeu', 'Raise your level of play'), effects: { reputation: 4, forme: -2 } },
      { label: tt('Jouer avec discipline tactique', 'Play with tactical discipline'), effects: { iqBasket: 3, relationCoequipiers: 2 } },
    ],
  },
  {
    id: 'cdm-elimination-groupes',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé dès la phase de groupes', 'Eliminated in the group stage'),
    description: tt(
      "Ta sélection nationale ne survit pas à la phase de groupes de la Coupe du Monde.",
      'Your national team does not survive the World Cup group stage.',
    ),
    minAge: 19,
    weight: 1,
    choices: [
      { label: tt('Analyser les erreurs sans complaisance', 'Break down the mistakes honestly'), effects: { iqBasket: 3, mental: 2, moral: -2 } },
      { label: tt('Tourner la page rapidement', 'Move on quickly'), effects: { moral: 2, forme: 2 } },
    ],
  },
  {
    id: 'cdm-elimination-quarts',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé en quart de finale', 'Eliminated in the quarterfinals'),
    description: tt(
      "Ta sélection nationale s'incline en quart de finale de la Coupe du Monde.",
      'Your national team falls in the World Cup quarterfinals.',
    ),
    minAge: 19,
    weight: 1,
    choices: [
      { label: tt('Retenir les points positifs du tournoi', "Focus on the tournament's positives"), effects: { moral: 3, reputation: 2 } },
      { label: tt("Ressasser l'occasion manquée", 'Dwell on the missed opportunity'), effects: { mental: 2, moral: -3 } },
    ],
  },
  {
    id: 'cdm-elimination-demies',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Éliminé en demi-finale mondiale', 'Eliminated in the World Cup semifinal'),
    description: tt(
      "Ta sélection nationale tombe en demi-finale et devra jouer la petite finale pour le bronze.",
      'Your national team falls in the semifinal and will have to play for bronze.',
    ),
    minAge: 19,
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
    id: 'cdm-prequel-finale',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('La veille de la finale mondiale', 'The eve of the World Cup final'),
    description: tt(
      "Demain, tout un pays sera scotché à son écran. Le sélectionneur rassemble le groupe une dernière fois avant la finale de la Coupe du Monde.",
      'Tomorrow, an entire country will be glued to its screen. The coach gathers the group one last time before the World Cup final.',
    ),
    minAge: 19,
    weight: 10,
    choices: [
      {
        label: tt('Prendre la parole devant le groupe', 'Speak up in front of the group'),
        resultText: tt(
          "Tu regardes tes coéquipiers dans les yeux : \"On est venu ici pour être champions du monde.\" Le silence qui suit est chargé.",
          'You look your teammates in the eye: "We came here to become world champions." The silence that follows is heavy.',
        ),
        effects: { mental: 3, reputation: 1 },
        linkedNextEventId: 'cdm-finale-mondiale',
      },
      {
        label: tt('Rassurer les plus jeunes du groupe', 'Reassure the younger players in the group'),
        resultText: tt(
          "Tu prends le temps de parler individuellement à ceux qui vivent leur première grande finale.",
          'You take the time to talk one-on-one with the ones living through their first big final.',
        ),
        effects: { relationCoequipiers: 3, iqBasket: 2 },
        linkedNextEventId: 'cdm-finale-mondiale',
      },
      {
        label: tt('Rester seul avec tes pensées', 'Stay alone with your thoughts'),
        resultText: tt(
          "Tu n'as pas besoin de mots. Demain, tout se joue — tu le sais depuis toujours.",
          "You don't need words. Tomorrow, everything is on the line — you've always known that.",
        ),
        effects: { mental: 5, moral: 1 },
        linkedNextEventId: 'cdm-finale-mondiale',
      },
    ],
  },
  {
    id: 'cdm-finale-mondiale',
    category: 'coupeDuMonde',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Finale de la Coupe du Monde', 'World Cup final'),
    description: tt(
      "Ta sélection dispute la finale de la Coupe du Monde. C'est l'un des sommets possibles de ta carrière internationale.",
      "Your national team plays the World Cup final — one of the peaks your international career can reach.",
    ),
    minAge: 19,
    weight: 10,
    choices: [
      {
        label: tt('Jouer le rôle de leader décisif', 'Play the decisive leader role'),
        actionStyle: 'scoring',
        successChance: {
          baseChance: 0.46,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 16, popularite: 13 },
          onFailure: { moral: -6 },
          successText: tt('Champion du monde ! Ton nom entre dans l\'histoire de ta nation.', 'World champion! Your name enters your nation\'s history.'),
          failureText: tt('La défaite en finale restera une immense frustration.', 'Losing the final will remain a deep source of frustration.'),
        },
      },
      {
        label: tt('Porter le collectif national', 'Carry the national team'),
        actionStyle: 'passing',
        effects: { relationCoequipiers: 6, iqBasket: 3 },
        successChance: {
          baseChance: 0.46,
          statBonus: { iqBasket: 0.01, relationCoequipiers: 0.01 },
          onSuccess: { reputation: 11, popularite: 9 },
          onFailure: { moral: -6 },
          successText: tt('Champion du monde, porté par le collectif ! Ton nom entre dans l\'histoire de ta nation.', 'World champion, carried by the team! Your name enters your nation\'s history.'),
          failureText: tt('La défaite en finale restera une immense frustration.', 'Losing the final will remain a deep source of frustration.'),
        },
      },
    ],
  },
];
