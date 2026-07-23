import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const selectionNationaleEvents: EventTemplate[] = [
  {
    id: 'selection-premiere-convocation',
    category: 'selectionNationale',
    title: tt('Première convocation en sélection nationale', 'First call-up to the national team'),
    description: tt(
      "Le sélectionneur national t'appelle pour la première fois pour un rassemblement des jeunes talents.",
      'The national coach calls you up for the first time for a gathering of young talents.',
    ),
    minAge: 16,
    choices: [
      { label: tt('Répondre présent avec fierté', 'Answer the call with pride'), effects: { reputation: 5, popularite: 3, moral: 3 } },
      { label: tt('Décliner pour te concentrer sur ton club', 'Decline to focus on your club'), effects: { relationCoach: 2, reputation: -3 } },
    ],
    weight: 2,
  },
  {
    id: 'selection-concurrence-poste',
    category: 'selectionNationale',
    title: tt('Forte concurrence à ton poste en sélection', 'Heavy competition for your spot'),
    description: tt(
      'Plusieurs joueurs de talent se battent pour la même place que toi dans l\'effectif national.',
      'Several talented players are fighting for the same spot as you on the national roster.',
    ),
    minAge: 17,
    choices: [
      { label: tt("Hausser ton niveau à l'entraînement", 'Raise your level in practice'), effects: { technique: 3, mental: 2, forme: -2 } },
      { label: tt('Rester toi-même sans forcer', 'Stay yourself without forcing it'), effects: { mental: 1 } },
    ],
  },
  {
    id: 'selection-brassard-jeunes',
    category: 'selectionNationale',
    title: tt('Leader de la sélection espoirs', 'Leader of the youth squad'),
    description: tt(
      "Le staff national te confie un rôle de leader au sein de la génération montante.",
      'The national staff gives you a leadership role within the rising generation.',
    ),
    minAge: 17,
    choices: [
      { label: tt('Accepter ce rôle avec sérieux', 'Take the role seriously'), effects: { mental: 3, reputation: 3, relationCoequipiers: 2 } },
      { label: tt('Rester discret dans le groupe', 'Stay low-key within the group'), effects: { mental: 1 } },
    ],
  },
  {
    id: 'selection-tournoi-continental',
    category: 'selectionNationale',
    title: tt('Tournoi continental des jeunes', 'Continental youth tournament'),
    description: tt(
      'Ta sélection dispute un tournoi majeur face aux meilleurs espoirs des autres nations.',
      'Your national team plays a major tournament against the best prospects from other nations.',
    ),
    minAge: 16,
    choices: [
      { label: tt('Jouer ton meilleur basket pour te montrer', 'Play your best basketball to stand out'), effects: { reputation: 6, popularite: 4, forme: -3 } },
      { label: tt('Privilégier le collectif national', 'Prioritize the national team'), effects: { iqBasket: 3, relationCoequipiers: 3 } },
    ],
    weight: 2,
  },
];
