import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { COACHES, TEAMMATES } from '../names';

export const entrainementEvents: EventTemplate[] = [
  {
    id: 'entrainement-tirs-supplementaires',
    category: 'entrainement',
    title: tt('Séance de tirs supplémentaire', 'Extra shooting session'),
    description: tt(
      "{coach} propose une séance de tirs en plus après l'entraînement collectif. Personne ne t'oblige à rester.",
      '{coach} offers an extra shooting session after team practice. Nobody is forcing you to stay.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Rester travailler', 'Stay and work'), effects: { technique: 5, forme: -3, relationCoach: 3 } },
      { label: tt('Rentrer se reposer', 'Go home and rest'), effects: { forme: 3, technique: -1 } },
      { label: tt('Proposer d\'y aller avec un coéquipier', 'Invite a teammate along'), effects: { technique: 3, relationCoequipiers: 3, forme: -2 } },
    ],
    weight: 3,
  },
  {
    id: 'entrainement-nouveau-systeme',
    category: 'entrainement',
    title: tt('Nouveau système tactique', 'New tactical system'),
    description: tt(
      "{coach} installe un système complexe de pick-and-roll que l'équipe peine à assimiler.",
      '{coach} installs a complex pick-and-roll system the team is struggling to learn.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Étudier les schémas le soir', 'Study the playbook at night'), effects: { iqBasket: 5, forme: -1, relationCoach: 2 } },
      { label: tt('Apprendre uniquement sur le terrain', 'Only learn it on the court'), effects: { iqBasket: 2, forme: 1 } },
      { label: tt('Aider les autres à comprendre', 'Help others understand it'), effects: { iqBasket: 3, relationCoequipiers: 4, relationCoach: 2 } },
    ],
  },
  {
    id: 'entrainement-fatigue-cumulee',
    category: 'entrainement',
    title: tt("Fatigue qui s'accumule", 'Fatigue is piling up'),
    description: tt(
      "Les séances s'enchaînent sans repos depuis deux semaines. Ton corps commence à le faire savoir.",
      'Sessions have piled up with no rest for two weeks. Your body is starting to let you know.',
    ),
    choices: [
      { label: tt('Pousser quand même à fond', 'Push through anyway'), effects: { physique: 3, forme: -8, risqueBlessure: 8 } },
      { label: tt('Lever la main et demander à lever le pied', 'Speak up and ask to ease off'), effects: { forme: 6, relationCoach: -1, risqueBlessure: -5 } },
      { label: tt('Gérer intelligemment son intensité', 'Manage your intensity smartly'), effects: { forme: 2, iqBasket: 2, risqueBlessure: -2 } },
    ],
    weight: 2,
  },
  {
    id: 'entrainement-defi-un-contre-un',
    category: 'entrainement',
    title: tt('Défi un-contre-un avec {teammate}', 'One-on-one challenge with {teammate}'),
    description: tt(
      "{teammate} te propose un duel amical en fin de séance pour voir qui est le plus fort.",
      '{teammate} challenges you to a friendly duel after practice to see who\'s better.',
    ),
    slots: [{ key: 'teammate', pool: TEAMMATES }],
    choices: [
      { label: tt('Accepter et jouer à fond', 'Accept and go all out'), effects: { technique: 3, mental: 2, relationCoequipiers: 1 }, successChance: { baseChance: 0.5, statBonus: { technique: 0.01 }, onSuccess: { popularite: 2, relationCoequipiers: 2 }, onFailure: { moral: -1 } } },
      { label: tt('Décliner poliment', 'Politely decline'), effects: { forme: 2, relationCoequipiers: -1 } },
      { label: tt("Transformer ça en séance d'entraide", 'Turn it into a mutual coaching session'), effects: { relationCoequipiers: 4, iqBasket: 1 } },
    ],
  },
  {
    id: 'entrainement-video-analyse',
    category: 'entrainement',
    title: tt('Séance vidéo avec {coach}', 'Film session with {coach}'),
    description: tt(
      "{coach} décortique tes erreurs défensives des derniers matchs devant tout le groupe.",
      '{coach} breaks down your defensive mistakes from recent games in front of the whole team.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Accepter la critique et prendre des notes', 'Take the criticism and note it down'), effects: { iqBasket: 4, mental: 2, relationCoach: 3 } },
      { label: tt('Se justifier devant le groupe', 'Defend yourself in front of the group'), effects: { relationCoach: -3, mental: -1, popularite: 1 } },
      { label: tt('Demander une séance individuelle après', 'Ask for a one-on-one session afterwards'), effects: { iqBasket: 3, relationCoach: 4, forme: -1 } },
    ],
  },
  {
    id: 'entrainement-travail-faiblesse',
    category: 'entrainement',
    title: tt('Travailler ton point faible', 'Work on your weakness'),
    description: tt(
      'Tu sais que ta main faible te limite. Un créneau libre s\'ouvre cette semaine pour y travailler spécifiquement.',
      'You know your weak hand is holding you back. A free slot opens up this week to work on it specifically.',
    ),
    choices: [
      { label: tt('Consacrer la semaine à ce point faible', 'Dedicate the week to this weakness'), effects: { technique: 6, forme: -2, potentiel: 1 } },
      { label: tt('Continuer à travailler tes points forts', 'Keep working on your strengths'), effects: { technique: 3, moral: 1 } },
      { label: tt('Demander de l\'aide à un ancien pro du club', 'Ask a club veteran for help'), effects: { technique: 4, iqBasket: 2, relationCoach: 1 } },
    ],
  },
  {
    id: 'entrainement-musculation-explosive',
    category: 'entrainement',
    title: tt("Travail d'explosivité imposé", 'Mandatory explosiveness work'),
    description: tt(
      '{coach} ajoute un bloc de pliométrie intense au programme de la semaine.',
      "{coach} adds an intense plyometrics block to this week's program.",
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Suivre le programme à la lettre', 'Follow the program to the letter'), effects: { physique: 5, forme: -3, risqueBlessure: 4 } },
      { label: tt('Adapter l\'intensité à ses sensations', 'Adjust intensity to how you feel'), effects: { physique: 2, risqueBlessure: -2, forme: 1 } },
      { label: tt('Ignorer et faire son propre programme', 'Ignore it and do your own program'), effects: { relationCoach: -4, physique: 1 } },
    ],
  },
  {
    id: 'entrainement-veille-technique',
    category: 'entrainement',
    title: tt('Analyser un joueur pro', 'Studying a pro player'),
    description: tt(
      "Tu passes ta soirée à visionner les highlights d'un grand joueur pour améliorer ta lecture du jeu.",
      "You spend your evening watching a great player's highlights to sharpen your basketball IQ.",
    ),
    choices: [
      { label: tt('Étudier ses déplacements sans ballon', 'Study his off-ball movement'), effects: { iqBasket: 4, technique: 1 } },
      { label: tt('Étudier sa gestuelle de tir', 'Study his shooting form'), effects: { technique: 4, iqBasket: 1 } },
      { label: tt('Regarder pour le plaisir sans analyser', 'Just watch for fun without analyzing'), effects: { moral: 2 } },
    ],
  },
];
