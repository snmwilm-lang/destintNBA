import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { COACHES } from '../names';

export const coachEvents: EventTemplate[] = [
  {
    id: 'coach-entretien-individuel',
    category: 'coach',
    title: tt('Entretien individuel avec {coach}', 'One-on-one meeting with {coach}'),
    description: tt(
      '{coach} te convoque pour faire le point sur ta progression et tes ambitions.',
      '{coach} calls you in to talk about your progress and your ambitions.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Être totalement honnête sur tes doutes', 'Be fully honest about your doubts'), effects: { relationCoach: 4, mental: 2, moral: 1 } },
      { label: tt('Rester dans le contrôle et projeter la confiance', 'Stay composed and project confidence'), effects: { relationCoach: 2, reputation: 1 } },
      { label: tt('Demander plus de responsabilités', 'Ask for more responsibility'), effects: { relationCoach: -1, tempsDeJeu: 3, mental: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'coach-critique-publique',
    category: 'coach',
    title: tt('{coach} te critique devant le groupe', '{coach} criticizes you in front of the team'),
    description: tt(
      "Après une erreur défensive, {coach} hausse le ton devant tout le vestiaire.",
      'After a defensive mistake, {coach} raises his voice in front of the whole locker room.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Encaisser sans rien dire', 'Take it without saying a word'), effects: { mental: 2, relationCoach: 1, moral: -2 }, draftImpact: 2 },
      { label: tt('Répondre calmement pour se justifier', 'Calmly explain yourself'), effects: { relationCoach: -2, mental: 1 } },
      { label: tt('Répondre sur le ton de la confrontation', 'Fire back confrontationally'), effects: { relationCoach: -6, popularite: 1, relationCoequipiers: 1 }, draftImpact: -3 },
    ],
  },
  {
    id: 'coach-confiance-accrue',
    category: 'coach',
    title: tt('{coach} t\'annonce plus de responsabilités', '{coach} hands you more responsibility'),
    description: tt(
      'Satisfait de tes efforts, {coach} veut faire de toi un cadre plus important du système.',
      'Pleased with your effort, {coach} wants to make you a bigger part of the system.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Accepter avec enthousiasme', 'Accept enthusiastically'), effects: { relationCoach: 4, tempsDeJeu: 6, mental: 2, forme: -2 } },
      { label: tt('Demander du temps pour être prêt', 'Ask for time to be ready'), effects: { relationCoach: 2, mental: 3 } },
    ],
  },
  {
    id: 'coach-changement-poste',
    category: 'coach',
    title: tt('{coach} veut te faire jouer à un nouveau poste', '{coach} wants to try you at a new position'),
    description: tt(
      'Pour exploiter ta polyvalence, {coach} envisage de te repositionner sur le terrain.',
      'To exploit your versatility, {coach} is considering repositioning you on the floor.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Accepter le défi', 'Accept the challenge'), effects: { iqBasket: 3, potentiel: 2, forme: -2, relationCoach: 2 } },
      { label: tt('Exprimer ta préférence pour ton poste habituel', 'Say you prefer your usual position'), effects: { relationCoach: -2, mental: 1 } },
    ],
  },
  {
    id: 'coach-depart-annonce',
    category: 'coach',
    title: tt('{coach} pourrait quitter le club', '{coach} might be leaving the club'),
    description: tt(
      'Des rumeurs circulent : {coach} serait courtisé ailleurs. L\'ambiance du groupe s\'en ressent.',
      'Rumors are swirling: {coach} is reportedly being courted elsewhere. The team feels the tension.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Aller lui demander directement', 'Go ask him directly'), effects: { relationCoach: 3, mental: 1 } },
      { label: tt('Ignorer les rumeurs et se concentrer sur son jeu', 'Ignore the rumors and focus on your game'), effects: { forme: 1, mental: 2 } },
      { label: tt('En parler ouvertement avec les coéquipiers', 'Talk openly about it with teammates'), effects: { relationCoequipiers: 2, relationCoach: -1 } },
    ],
  },
  {
    id: 'coach-methode-contestee',
    category: 'coach',
    title: tt('Les méthodes de {coach} divisent le vestiaire', "{coach}'s methods divide the locker room"),
    description: tt(
      'Une partie de l\'équipe conteste en privé les choix tactiques de {coach}. On te demande ton avis.',
      "Part of the team privately questions {coach}'s tactical choices. You're asked for your opinion.",
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Défendre publiquement le coach', 'Publicly defend the coach'), effects: { relationCoach: 5, relationCoequipiers: -2 }, draftImpact: 2 },
      { label: tt('Rester neutre', 'Stay neutral'), effects: { mental: 1 } },
      { label: tt('Rejoindre la contestation', 'Join the pushback'), effects: { relationCoach: -5, relationCoequipiers: 3, popularite: 1 }, draftImpact: -2 },
    ],
  },
  {
    id: 'coach-mentorat',
    category: 'coach',
    title: tt("{coach} te prend sous son aile", '{coach} takes you under his wing'),
    description: tt(
      "{coach} t'invite à des sessions de mentorat individuel en dehors des heures habituelles.",
      '{coach} invites you to one-on-one mentoring sessions outside of normal hours.',
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Accepter chaque session', 'Accept every session'), effects: { iqBasket: 4, relationCoach: 4, forme: -2 }, draftImpact: 2 },
      { label: tt('Accepter avec modération', 'Accept in moderation'), effects: { iqBasket: 2, relationCoach: 2 } },
      { label: tt('Décliner pour préserver ton temps libre', 'Decline to protect your free time'), effects: { moral: 2, relationCoach: -2 }, draftImpact: -1 },
    ],
  },
  {
    id: 'coach-desaccord-tactique',
    category: 'coach',
    title: tt('Désaccord tactique avec {coach}', 'Tactical disagreement with {coach}'),
    description: tt(
      "Tu penses avoir une meilleure lecture du système offensif que celui imposé par {coach}.",
      "You think you have a better read on the offensive system than the one {coach} is running.",
    ),
    slots: [{ key: 'coach', pool: COACHES }],
    choices: [
      { label: tt('Proposer tes idées en privé', 'Offer your ideas privately'), effects: { relationCoach: 2, iqBasket: 3 }, draftImpact: 1 },
      { label: tt('Appliquer le système sans discuter', 'Run the system without arguing'), effects: { relationCoach: 1, iqBasket: -1 }, draftImpact: 1 },
      { label: tt('Improviser sur le terrain malgré les consignes', 'Improvise on court despite instructions'), effects: { relationCoach: -4, reputation: 1, iqBasket: 1 }, draftImpact: -2 },
    ],
  },
];
