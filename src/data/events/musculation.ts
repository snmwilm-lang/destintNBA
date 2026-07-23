import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { PREPARATEURS_PHYSIQUES } from '../names';

export const musculationEvents: EventTemplate[] = [
  {
    id: 'muscu-programme-intensif',
    category: 'musculation',
    title: tt('Programme de prise de masse', 'Mass-gain program'),
    description: tt(
      '{prep} propose un programme intensif pour gagner en puissance avant la saison.',
      '{prep} offers an intensive program to gain power before the season.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Suivre le programme à fond', 'Follow the program fully'), effects: { physique: 6, forme: -3, risqueBlessure: 5 } },
      { label: tt('Suivre un programme allégé', 'Follow a lighter program'), effects: { physique: 3, forme: -1 } },
      { label: tt("Refuser pour privilégier l'explosivité", 'Decline to prioritize explosiveness'), effects: { physique: 1, technique: 2 } },
    ],
    weight: 2,
  },
  {
    id: 'muscu-record-perso',
    category: 'musculation',
    title: tt('Tentative de record personnel en salle', 'Personal record attempt in the weight room'),
    description: tt(
      'Tu te sens fort aujourd\'hui et {prep} te propose de pousser un nouveau record au développé couché.',
      'You feel strong today and {prep} suggests chasing a new bench press record.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Tenter le record', 'Go for the record'), effects: { physique: 4, risqueBlessure: 7, moral: 2 } },
      { label: tt('Rester dans tes charges habituelles', 'Stick to your usual loads'), effects: { physique: 2, risqueBlessure: -1 } },
    ],
  },
  {
    id: 'muscu-recuperation-active',
    category: 'musculation',
    title: tt('Séance de récupération active', 'Active recovery session'),
    description: tt(
      'Après une semaine difficile, {prep} propose une séance légère centrée sur la mobilité.',
      'After a tough week, {prep} suggests a light session focused on mobility.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Suivre la séance de récupération', 'Follow the recovery session'), effects: { forme: 4, risqueBlessure: -4 } },
      { label: tt('Préférer une séance de muscu classique', 'Prefer a classic strength session'), effects: { physique: 2, forme: -2 } },
    ],
  },
  {
    id: 'muscu-coach-prive',
    category: 'musculation',
    title: tt('Préparateur physique privé', 'Private strength coach'),
    description: tt(
      'Tu as l\'opportunité d\'engager {prep} comme préparateur personnel en plus du staff du club.',
      'You have the chance to hire {prep} as a personal trainer alongside the club staff.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Engager le préparateur privé', 'Hire the private trainer'), effects: { physique: 5, forme: 1 }, moneyDelta: -4000 },
      { label: tt('Rester avec le staff du club uniquement', 'Stick with the club staff only'), effects: { relationCoach: 1 } },
    ],
  },
  {
    id: 'muscu-blessure-surentrainement',
    category: 'musculation',
    title: tt('Signes de surentraînement', 'Signs of overtraining'),
    description: tt(
      'Fatigue chronique, sommeil perturbé : {prep} identifie les signes classiques du surentraînement.',
      'Chronic fatigue, disrupted sleep: {prep} spots the classic signs of overtraining.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Réduire immédiatement le volume', 'Cut the volume immediately'), effects: { forme: 5, risqueBlessure: -8, physique: -1 } },
      { label: tt('Continuer en ignorant les signaux', 'Keep going and ignore the signs'), effects: { risqueBlessure: 12, forme: -6 } },
    ],
    weight: 2,
  },
  {
    id: 'muscu-explosivite-pliometrie',
    category: 'musculation',
    title: tt('Travail spécifique de détente verticale', 'Vertical leap specific work'),
    description: tt(
      '{prep} propose un programme de pliométrie pour améliorer ton impulsion au saut.',
      '{prep} offers a plyometrics program to improve your jumping power.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt("S'investir à fond dans ce programme", 'Commit fully to this program'), effects: { physique: 4, risqueBlessure: 3, potentiel: 1 } },
      { label: tt('Y aller progressivement', 'Ease into it progressively'), effects: { physique: 2, risqueBlessure: 1 } },
    ],
  },
  {
    id: 'muscu-gainage-core',
    category: 'musculation',
    title: tt('Renforcement du gainage', 'Core strengthening'),
    description: tt(
      '{prep} insiste sur le travail de la ceinture abdominale pour prévenir les blessures au dos.',
      '{prep} insists on core work to prevent back injuries.',
    ),
    slots: [{ key: 'prep', pool: PREPARATEURS_PHYSIQUES }],
    choices: [
      { label: tt('Ajouter ce travail quotidiennement', 'Add this work daily'), effects: { physique: 3, risqueBlessure: -5 } },
      { label: tt('Le faire occasionnellement', 'Do it occasionally'), effects: { physique: 1, risqueBlessure: -1 } },
    ],
  },
];
