import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { PLATFORMS } from '../names';

export const reseauxEvents: EventTemplate[] = [
  {
    id: 'reseaux-video-virale',
    category: 'reseaux',
    title: tt('Une de tes actions devient virale sur {platform}', 'One of your plays goes viral on {platform}'),
    description: tt(
      'Un highlight de ton dernier match cumule des millions de vues en une nuit sur {platform}.',
      'A highlight from your last game racks up millions of views overnight on {platform}.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Surfer sur le buzz avec du contenu', 'Ride the buzz with more content'), effects: { popularite: 6, forme: -1 } },
      { label: tt('Rester discret et laisser passer', 'Stay low-key and let it pass'), effects: { moral: 1, popularite: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'reseaux-critique-en-ligne',
    category: 'reseaux',
    title: tt('Vague de critiques sur {platform}', 'A wave of criticism on {platform}'),
    description: tt(
      'Après une contre-performance, les commentaires très durs envahissent tes publications sur {platform}.',
      'After a poor performance, harsh comments flood your posts on {platform}.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Répondre aux critiques', 'Respond to the criticism'), effects: { moral: -2, popularite: 1, mental: -1 } },
      { label: tt('Couper les notifications quelques jours', 'Turn off notifications for a few days'), effects: { moral: 2, mental: 1 } },
      { label: tt('Ignorer complètement', 'Ignore it completely'), effects: { mental: 2 } },
    ],
    weight: 2,
  },
  {
    id: 'reseaux-partenariat-createur',
    category: 'reseaux',
    title: tt('Un créateur de {platform} veut collaborer', 'A {platform} creator wants to collaborate'),
    description: tt(
      'Un créateur populaire sur {platform} propose une vidéo commune pour booster ta visibilité.',
      'A popular creator on {platform} suggests a joint video to boost your visibility.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Accepter la collaboration', 'Accept the collaboration'), effects: { popularite: 4, forme: -1 } },
      { label: tt('Décliner poliment', 'Politely decline'), effects: { moral: 1 } },
    ],
  },
  {
    id: 'reseaux-publication-maladroite',
    category: 'reseaux',
    title: tt('Publication maladroite sur {platform}', 'An awkward post on {platform}'),
    description: tt(
      'Un message que tu as posté tard le soir sur {platform} est mal interprété et fait polémique.',
      'A late-night post on {platform} gets misread and sparks controversy.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Supprimer et présenter des excuses', 'Delete it and apologize'), effects: { reputation: -1, moral: -1 } },
      { label: tt('Assumer et clarifier ton propos', 'Own it and clarify what you meant'), effects: { reputation: 1, mental: 2 } },
      { label: tt('Ne rien faire', 'Do nothing'), effects: { reputation: -3 } },
    ],
  },
  {
    id: 'reseaux-followers-milestone',
    category: 'reseaux',
    title: tt('Cap symbolique atteint sur {platform}', 'A symbolic milestone on {platform}'),
    description: tt(
      'Ton compte {platform} franchit un cap impressionnant d\'abonnés, les marques commencent à te repérer.',
      'Your {platform} account crosses an impressive follower milestone — brands start noticing.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Célébrer avec ta communauté', 'Celebrate with your community'), effects: { popularite: 3, moral: 2 } },
      { label: tt('Rester focalisé sur le terrain', 'Stay focused on the court'), effects: { forme: 1, mental: 1 } },
    ],
  },
  {
    id: 'reseaux-comparaison-rival',
    category: 'reseaux',
    title: tt('Comparaisons incessantes sur {platform}', 'Endless comparisons on {platform}'),
    description: tt(
      'Sur {platform}, les internautes te comparent sans cesse à un autre jeune talent en pleine ascension.',
      'On {platform}, people keep comparing you to another rising young talent.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Utiliser ça comme motivation', 'Use it as motivation'), effects: { mental: 3, moral: 1 } },
      { label: tt("Laisser cela t'atteindre", 'Let it get to you'), effects: { moral: -3, mental: -2 } },
      { label: tt('Répondre avec humour', 'Respond with humor'), effects: { popularite: 2 } },
    ],
  },
  {
    id: 'reseaux-story-quotidien',
    category: 'reseaux',
    title: tt('Partager ton quotidien sur {platform}', 'Sharing your daily life on {platform}'),
    description: tt(
      'Tu hésites à documenter ta routine d\'entraînement sur {platform} pour ta communauté grandissante.',
      'You debate documenting your training routine on {platform} for your growing community.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Partager régulièrement', 'Share regularly'), effects: { popularite: 3, forme: -1 } },
      { label: tt('Garder ta vie privée pour toi', 'Keep your private life private'), effects: { mental: 1, popularite: -1 } },
    ],
  },
  {
    id: 'reseaux-fake-news',
    category: 'reseaux',
    title: tt('Une fausse rumeur circule sur {platform}', 'A false rumor spreads on {platform}'),
    description: tt(
      'Une information totalement inventée sur toi se propage rapidement sur {platform}.',
      'A completely made-up story about you spreads fast on {platform}.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Démentir officiellement', 'Officially deny it'), effects: { reputation: 2, moral: -1 } },
      { label: tt('Laisser ton entourage gérer la communication', 'Let your entourage handle it'), effects: { moral: 1 } },
      { label: tt('Ignorer complètement', 'Ignore it completely'), effects: { reputation: -2 } },
    ],
  },
  {
    id: 'reseaux-live-question-reponse',
    category: 'reseaux',
    title: tt('Session en direct sur {platform}', 'Live Q&A on {platform}'),
    description: tt(
      'Tes fans te demandent d\'organiser un live questions-réponses sur {platform}.',
      'Your fans ask you to host a live Q&A on {platform}.',
    ),
    slots: [{ key: 'platform', pool: PLATFORMS }],
    choices: [
      { label: tt('Organiser le live', 'Host the live session'), effects: { popularite: 4, forme: -1 } },
      { label: tt('Décliner pour préserver ton temps', 'Decline to save your time'), effects: { forme: 1 } },
    ],
  },
];
