import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { TEAMMATES, RIVAL_PLAYERS } from '../names';

export const conflitsEvents: EventTemplate[] = [
  {
    id: 'conflit-accrochage-entrainement',
    category: 'conflits',
    title: tt("Accrochage avec {teammate} à l'entraînement", 'Clash with {teammate} at practice'),
    description: tt(
      'Une faute beaucoup trop appuyée de {teammate} pendant un exercice dégénère en échange de mots vifs.',
      'A hard foul from {teammate} during a drill escalates into a heated exchange.',
    ),
    slots: [{ key: 'teammate', pool: TEAMMATES }],
    choices: [
      { label: tt("Aller s'excuser après coup", 'Go apologize afterwards'), effects: { relationCoequipiers: 3, mental: 1 } },
      { label: tt('Laisser la tension retomber seule', 'Let the tension die down on its own'), effects: { relationCoequipiers: -1 } },
      { label: tt('Envenimer la situation', 'Make things worse'), effects: { relationCoequipiers: -5, relationCoach: -2 } },
    ],
    weight: 2,
  },
  {
    id: 'conflit-repartition-ballons',
    category: 'conflits',
    title: tt('Désaccord sur la répartition des tirs', 'Disagreement over shot distribution'),
    description: tt(
      'Plusieurs joueurs, dont {teammate}, estiment ne pas assez toucher le ballon dans le système actuel.',
      "Several players, including {teammate}, feel they don't touch the ball enough in the current system.",
    ),
    slots: [{ key: 'teammate', pool: TEAMMATES }],
    choices: [
      { label: tt('Partager davantage le ballon', 'Share the ball more'), effects: { relationCoequipiers: 4, reputation: -1, iqBasket: 2 } },
      { label: tt('Continuer à jouer ton jeu', 'Keep playing your game'), effects: { reputation: 2, relationCoequipiers: -3 } },
    ],
  },
  {
    id: 'conflit-provocation-adverse',
    category: 'conflits',
    title: tt('{rival} te provoque après le match', '{rival} taunts you after the game'),
    description: tt(
      'Sur le chemin des vestiaires, {rival} te lance une remarque destinée à te déstabiliser publiquement.',
      "On the way to the locker room, {rival} throws a remark meant to rattle you publicly.",
    ),
    slots: [{ key: 'rival', pool: RIVAL_PLAYERS }],
    choices: [
      { label: tt('Répondre calmement', 'Respond calmly'), effects: { mental: 2, reputation: 1 } },
      { label: tt('Répondre avec la même agressivité', 'Fire back with the same aggression'), effects: { reputation: -2, popularite: 2, mental: -1 } },
      { label: tt('Ignorer complètement', 'Ignore it completely'), effects: { mental: 3 } },
    ],
    tags: ['rivalDuel'],
  },
  {
    id: 'conflit-media-declaration',
    category: 'conflits',
    title: tt('Déclaration mal interprétée en conférence de presse', 'A statement gets misread in a press conference'),
    description: tt(
      'Une de tes phrases sortie de son contexte est perçue comme une critique du groupe.',
      'One of your quotes, taken out of context, is seen as a criticism of the team.',
    ),
    choices: [
      { label: tt('Clarifier immédiatement en interne', 'Clarify it internally right away'), effects: { relationCoequipiers: 2, relationCoach: 1 } },
      { label: tt("Laisser la polémique enfler", 'Let the controversy grow'), effects: { reputation: -3, relationCoequipiers: -2 } },
    ],
  },
  {
    id: 'conflit-hierarchie-vestiaire',
    category: 'conflits',
    title: tt('Tensions sur la hiérarchie du vestiaire', 'Tension over the locker room hierarchy'),
    description: tt(
      'Ta montée en puissance bouscule les rapports de force établis dans le groupe.',
      'Your rise is upsetting the established pecking order within the team.',
    ),
    choices: [
      { label: tt('Rester humble malgré tes performances', 'Stay humble despite your performances'), effects: { relationCoequipiers: 3, moral: 1 } },
      { label: tt('Assumer ton nouveau statut ouvertement', 'Openly embrace your new status'), effects: { reputation: 2, relationCoequipiers: -2 } },
    ],
    weight: 2,
  },
  {
    id: 'conflit-clash-reseaux',
    category: 'conflits',
    title: tt('Clash public avec {rival} sur les réseaux', 'Public clash with {rival} on social media'),
    description: tt(
      'Un échange tendu avec {rival} sur les réseaux sociaux attire l\'attention des médias.',
      'A tense exchange with {rival} on social media catches the media\'s attention.',
    ),
    slots: [{ key: 'rival', pool: RIVAL_PLAYERS }],
    choices: [
      { label: tt('Supprimer et calmer le jeu', 'Delete it and cool things down'), effects: { reputation: 1, popularite: -1 } },
      { label: tt("Continuer l'échange publiquement", 'Keep the exchange going publicly'), effects: { popularite: 4, reputation: -3 } },
    ],
    tags: ['rivalDuel'],
  },
];
