import { tt, type EventTemplate } from '../../engine/eventTemplate';

export const finaleEvents: EventTemplate[] = [
  {
    id: 'finale-moment-decisif',
    category: 'finale',
    title: tt('Moment décisif', 'The decisive moment'),
    description: tt(
      "Finale. 98-98. Il reste 6 secondes. Tu récupères le ballon au milieu du chaos. Le public retient son souffle, la défense adverse se replie sur toi.",
      'Finals. 98-98. 6 seconds left. You grab the ball in the middle of the chaos. The crowd holds its breath, the defense collapses onto you.',
    ),
    unique: true,
    minSeason: 2,
    weight: 12,
    choices: [
      {
        label: tt('Tir à 3 points', '3-point shot'),
        successChance: {
          baseChance: 0.42,
          statBonus: { technique: 0.012, mental: 0.006 },
          onSuccess: { reputation: 15, popularite: 12, moral: 10, potentiel: 2 },
          onFailure: { moral: -8, reputation: -2 },
          successText: tt(
            "Le ballon traverse le filet à la sirène. Le gymnase explose, tu viens d'entrer dans la légende du club.",
            'The ball splashes through at the buzzer. The gym explodes — you just became a club legend.',
          ),
          failureText: tt(
            'Le tir heurte le cercle et ressort. Le match part en prolongation dans un silence de plomb.',
            'The shot clangs off the rim. The game heads to overtime in dead silence.',
          ),
        },
      },
      {
        label: tt("Drive jusqu'au cercle", 'Drive to the rim'),
        successChance: {
          baseChance: 0.5,
          statBonus: { physique: 0.01, technique: 0.008 },
          onSuccess: { reputation: 12, popularite: 8, moral: 8, physique: 1 },
          onFailure: { moral: -6, risqueBlessure: 5 },
          successText: tt(
            'Tu fends la défense et marques au buzzer sur une action pleine de puissance.',
            'You split the defense and score at the buzzer on a powerful drive.',
          ),
          failureText: tt(
            "Contré au dernier moment, tu t'écroules sous le cercle sans pouvoir marquer.",
            'Blocked at the last second, you crash under the rim without scoring.',
          ),
        },
      },
      {
        label: tt('Passe au joueur démarqué', 'Pass to the open man'),
        successChance: {
          baseChance: 0.55,
          statBonus: { iqBasket: 0.012 },
          onSuccess: { relationCoequipiers: 10, iqBasket: 4, reputation: 4, moral: 6 },
          onFailure: { relationCoequipiers: -3, moral: -4 },
          successText: tt(
            'Ton coéquipier démarqué ne tremble pas et inscrit le panier de la victoire. Tout le monde se souvient de ta passe.',
            "Your open teammate doesn't flinch and drains the winning shot. Everyone remembers your assist.",
          ),
          failureText: tt(
            'La passe est interceptée à la dernière seconde. Le rêve s\'échappe dans le chaos.',
            'The pass is intercepted at the last second. The dream slips away in the chaos.',
          ),
        },
      },
      {
        label: tt('Step-back', 'Step-back jumper'),
        successChance: {
          baseChance: 0.38,
          statBonus: { technique: 0.014, mental: 0.008 },
          onSuccess: { reputation: 18, popularite: 15, moral: 12 },
          onFailure: { moral: -10, reputation: -3 },
          successText: tt(
            'Un geste de pur génie individuel. Le tir rentre et ton nom restera gravé dans l\'histoire de ce match.',
            'A moment of pure individual genius. The shot drops and your name is etched into this game forever.',
          ),
          failureText: tt(
            'Le tir sort complètement. Un silence glacial s\'abat sur le banc.',
            'The shot misses badly. An icy silence falls over the bench.',
          ),
        },
      },
    ],
  },
  {
    id: 'finale-veille-de-match',
    category: 'finale',
    title: tt('La veille de la finale', 'The night before the finals'),
    description: tt(
      'Demain, tout se joue. Le sommeil se fait attendre, les pensées s\'enchaînent sans fin.',
      "Tomorrow, everything is on the line. Sleep won't come, thoughts keep racing.",
    ),
    weight: 2,
    choices: [
      { label: tt('Visualiser le match dans le calme', 'Visualize the game calmly'), effects: { mental: 5, moral: 3 } },
      { label: tt('Sortir se changer les idées', 'Go out to clear your head'), effects: { moral: 4, forme: -2 } },
      { label: tt('Réviser les schémas tactiques une dernière fois', 'Review the game plan one last time'), effects: { iqBasket: 4, forme: -1 } },
    ],
  },
  {
    id: 'finale-discours-vestiaire',
    category: 'finale',
    title: tt("Discours d'avant-match en finale", 'Pre-game speech at the finals'),
    description: tt(
      'Dans le silence du vestiaire, le coach te tend la parole avant d\'entrer sur le terrain.',
      'In the silence of the locker room, the coach hands you the floor before you head out.',
    ),
    weight: 2,
    choices: [
      { label: tt('Prendre la parole avec émotion', 'Speak with emotion'), effects: { relationCoequipiers: 5, mental: 3, reputation: 2 } },
      { label: tt("Rester silencieux et montrer l'exemple", 'Stay silent and lead by example'), effects: { mental: 2, relationCoequipiers: 1 } },
    ],
  },
];
