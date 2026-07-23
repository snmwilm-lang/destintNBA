import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const draftEvents: EventTemplate[] = [
  {
    id: 'draft-declaration',
    category: 'draft',
    title: tt('Te déclarer pour la draft', 'Declaring for the draft'),
    description: tt(
      "L'heure du choix est arrivée : te déclarer pour la draft professionnelle ou attendre encore une saison pour progresser.",
      'The moment of choice has arrived: declare for the pro draft, or wait one more season to keep developing.',
    ),
    minAge: 18,
    unique: true,
    choices: [
      { label: tt('Te déclarer dès maintenant', 'Declare right now'), effects: { reputation: 4, mental: 2 } },
      { label: tt('Attendre une saison de plus pour progresser', 'Wait one more season to develop'), effects: { potentiel: 3, technique: 2 } },
    ],
  },
  {
    id: 'draft-combine',
    category: 'draft',
    title: tt('Le combine pré-draft', 'The pre-draft combine'),
    description: tt(
      'Face aux recruteurs et scouts de toutes les franchises, tu dois impressionner lors des tests physiques et techniques.',
      'In front of scouts and recruiters from every franchise, you need to impress in the physical and skill tests.',
    ),
    minAge: 18,
    unique: true,
    choices: [
      {
        label: tt('Tout donner sur les tests physiques', 'Give it your all on the physical tests'),
        successChance: {
          baseChance: 0.5,
          statBonus: { physique: 0.012 },
          onSuccess: { reputation: 8 },
          onFailure: { risqueBlessure: 6 },
          successText: tt('Tes chiffres impressionnent toutes les franchises présentes.', 'Your numbers impress every franchise in the room.'),
          failureText: tt("Une petite gêne physique t'empêche de montrer ton plein potentiel.", 'A minor physical issue keeps you from showing your full potential.'),
        },
      },
      { label: tt('Se concentrer sur les entretiens et le mental', 'Focus on interviews and mental prep'), effects: { mental: 4, reputation: 3 } },
    ],
  },
  {
    id: 'draft-soiree',
    category: 'draft',
    title: tt('La soirée de la draft', 'Draft night'),
    description: tt(
      'Tu es assis avec ta famille, le cœur battant, en attendant que ton nom soit appelé par la ligue devant des millions de spectateurs.',
      'You sit with your family, heart pounding, waiting for the league to call your name in front of millions of viewers.',
    ),
    minAge: 18,
    unique: true,
    weight: 1,
    choices: [
      { label: tt('Vivre l\'instant avec ta famille', 'Live the moment with your family'), effects: { moral: 6, reputation: 4 } },
      { label: tt('Rester concentré et professionnel', 'Stay focused and professional'), effects: { mental: 3, reputation: 2 } },
    ],
  },
];
