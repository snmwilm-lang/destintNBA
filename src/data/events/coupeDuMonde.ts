import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const coupeDuMondeEvents: EventTemplate[] = [
  {
    id: 'cdm-qualification',
    category: 'coupeDuMonde',
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
    id: 'cdm-finale-mondiale',
    category: 'coupeDuMonde',
    title: tt('Finale de la Coupe du Monde', 'World Cup final'),
    description: tt(
      "Ta sélection dispute la finale de la Coupe du Monde. C'est l'un des sommets possibles de ta carrière internationale.",
      "Your national team plays the World Cup final — one of the peaks your international career can reach.",
    ),
    minAge: 19,
    unique: true,
    weight: 10,
    choices: [
      {
        label: tt('Jouer le rôle de leader décisif', 'Play the decisive leader role'),
        successChance: {
          baseChance: 0.46,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 16, popularite: 13 },
          onFailure: { moral: -6 },
          successText: tt('Champion du monde ! Ton nom entre dans l\'histoire de ta nation.', 'World champion! Your name enters your nation\'s history.'),
          failureText: tt('La défaite en finale restera une immense frustration.', 'Losing the final will remain a deep source of frustration.'),
        },
      },
      { label: tt('Porter le collectif national', 'Carry the national team'), effects: { relationCoequipiers: 6, iqBasket: 3 } },
    ],
  },
];
