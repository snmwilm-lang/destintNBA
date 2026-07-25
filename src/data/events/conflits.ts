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
      { label: tt("Aller s'excuser après coup", 'Go apologize afterwards'), effects: { relationCoequipiers: 3, mental: 1 }, draftImpact: 2 },
      { label: tt('Laisser la tension retomber seule', 'Let the tension die down on its own'), effects: { relationCoequipiers: -1 } },
      { label: tt('Envenimer la situation', 'Make things worse'), effects: { relationCoequipiers: -5, relationCoach: -2 }, draftImpact: -3 },
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
      { label: tt('Répondre calmement', 'Respond calmly'), effects: { mental: 2, reputation: 1 }, draftImpact: 1 },
      { label: tt('Répondre avec la même agressivité', 'Fire back with the same aggression'), effects: { reputation: -2, popularite: 2, mental: -1 }, draftImpact: -2 },
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
      { label: tt('Clarifier immédiatement en interne', 'Clarify it internally right away'), effects: { relationCoequipiers: 2, relationCoach: 1 }, draftImpact: 2 },
      { label: tt("Laisser la polémique enfler", 'Let the controversy grow'), effects: { reputation: -3, relationCoequipiers: -2 }, draftImpact: -2 },
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
  {
    id: 'conflit-defi-public',
    category: 'conflits',
    title: tt('Une occasion de lancer les hostilités avec Chicago Bison', 'A chance to start something with Chicago Bison'),
    description: tt(
      "Un micro tendu après le match te donne l'occasion de dire ce que tu penses vraiment de cette franchise et de ses supporters.",
      'A microphone shoved in your face after the game gives you a chance to say what you really think about that franchise and its fans.',
    ),
    leagues: ['nba', 'gLeague'],
    weight: 2,
    choices: [
      {
        label: tt('Lancer le défi publiquement', 'Call them out publicly'),
        resultText: tt(
          "Tes mots font le tour des réseaux en quelques minutes. La rivalité est officiellement lancée.",
          'Your words are all over social media within minutes. The rivalry is officially on.',
        ),
        effects: { popularite: 5, reputation: -1, mental: 2 },
        triggersRivalry: true,
      },
      { label: tt('Rester professionnel et ne rien lâcher', 'Stay professional and give nothing away'), effects: { mental: 2, reputation: 1 } },
    ],
    tags: ['cityRivalry'],
  },
  {
    id: 'conflit-foule-hostile',
    category: 'conflits',
    title: tt('Chaudron hostile à Chicago Bison', 'Hostile crowd at Chicago Bison'),
    description: tt(
      "Chaque apparition dans cette salle tourne à la chasse à l'homme : sifflets dès l'échauffement, banderoles à ton nom.",
      "Every appearance in that building turns into a manhunt: whistles from warmups, banners with your name on them.",
    ),
    leagues: ['nba', 'gLeague'],
    minSeason: 3,
    weight: 2,
    choices: [
      {
        label: tt('Nourrir la tension avec un geste fort', 'Feed the tension with a bold statement'),
        successChance: {
          baseChance: 0.45,
          statBonus: { mental: 0.012 },
          onSuccess: { popularite: 8, reputation: 5, moral: 6 },
          onFailure: { moral: -6, reputation: -3 },
          successText: tt(
            'Tu fais taire toute la salle. La rivalité devient encore plus légendaire.',
            'You silence the entire building. The rivalry becomes even more legendary.',
          ),
          failureText: tt(
            "La salle explose de joie à ton échec. L'humiliation est totale.",
            'The building erupts with joy at your failure. The humiliation is total.',
          ),
        },
      },
      { label: tt('Rester silencieux et jouer ton jeu', 'Stay silent and play your game'), effects: { mental: 4, forme: -2 } },
    ],
    tags: ['cityRivalry'],
  },
  {
    id: 'conflit-provocation-supporters',
    category: 'conflits',
    title: tt('Les supporters de Chicago Bison te ciblent sur les réseaux', "Chicago Bison's fans target you online"),
    description: tt(
      "Une vague de messages hostiles venus de leurs supporters envahit tes réseaux après le dernier match.",
      'A wave of hostile messages from their fanbase floods your social media after the last game.',
    ),
    leagues: ['nba', 'gLeague'],
    minSeason: 2,
    weight: 1,
    choices: [
      { label: tt('Répondre avec humour', 'Respond with humor'), effects: { popularite: 5, reputation: 1 } },
      { label: tt('Ignorer complètement', 'Ignore it completely'), effects: { mental: 3 } },
      { label: tt('Riposter frontalement', 'Fire back head-on'), effects: { popularite: 3, reputation: -3, moral: -1 } },
    ],
    tags: ['cityRivalry'],
  },
  {
    id: 'conflit-derby-lycee',
    category: 'conflits',
    title: tt('Le derby contre Northview High', 'The derby against Northview High'),
    description: tt(
      "Le match le plus attendu de l'année scolaire. Toute la ville s'est déplacée pour ce choc entre les deux meilleurs lycées de la région.",
      "The most anticipated game of the school year. The whole town has shown up for this clash between the two best high schools in the area.",
    ),
    leagues: ['lycee'],
    minSeason: 1,
    weight: 3,
    choices: [
      {
        label: tt('Vouloir tout porter sur tes épaules', 'Try to carry the whole team yourself'),
        successChance: {
          baseChance: 0.42,
          statBonus: { technique: 0.012, mental: 0.008 },
          onSuccess: { reputation: 10, popularite: 8, moral: 8 },
          onFailure: { moral: -7, reputation: -3 },
          successText: tt(
            "Tu portes ton lycée à la victoire à toi seul. Cette rivalité restera dans les mémoires — c'est le début de ta légende.",
            'You carry your school to victory almost single-handedly. This rivalry will be remembered — the start of your legend.',
          ),
          failureText: tt(
            "Trop de responsabilités pour un seul joueur. Le derby se termine dans la douleur.",
            'Too much responsibility for one player to carry. The derby ends in heartbreak.',
          ),
        },
      },
      { label: tt('Faire confiance au collectif', 'Trust the team around you'), effects: { relationCoequipiers: 4, iqBasket: 2, mental: 1 } },
    ],
    tags: ['schoolRivalry'],
  },
  {
    id: 'conflit-star-lycee-rival',
    category: 'conflits',
    title: tt('La star de Northview High te chambre', "Northview High's star player talks trash"),
    description: tt(
      "Le meilleur espoir de leur lycée te promet publiquement une humiliation avant le prochain match entre vos deux écoles.",
      'Their school\'s top prospect publicly promises to humiliate you before the next game between your two schools.',
    ),
    leagues: ['lycee'],
    minSeason: 2,
    weight: 2,
    choices: [
      { label: tt('Répondre par des actes sur le terrain', 'Answer with your play on the court'), effects: { mental: 3, reputation: 2 }, draftImpact: 1 },
      { label: tt('Répondre sur les réseaux', 'Fire back on social media'), effects: { popularite: 4, reputation: -2 }, draftImpact: -1 },
      { label: tt('Ignorer et rester concentré', 'Ignore it and stay focused'), effects: { mental: 2 } },
    ],
    tags: ['schoolRivalry'],
  },
];
