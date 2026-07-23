import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { PHYSIOS } from '../names';

export const blessureEvents: EventTemplate[] = [
  {
    id: 'blessure-genou-alerte',
    category: 'blessure',
    title: tt('Alerte au genou', 'Knee alert'),
    description: tt(
      'Une douleur récurrente au genou inquiète {physio} depuis quelques séances.',
      'A recurring knee pain has been worrying {physio} for a few sessions now.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('Passer une IRM complète par précaution', 'Get a full MRI as a precaution'), effects: { risqueBlessure: -10, forme: -2 } },
      { label: tt('Continuer avec des anti-inflammatoires', 'Keep going with anti-inflammatories'), effects: { risqueBlessure: 8, forme: 2 } },
      { label: tt("Réduire la charge d'entraînement", 'Reduce training load'), effects: { risqueBlessure: -5, forme: 1, tempsDeJeu: -2 } },
    ],
    weight: 2,
  },
  {
    id: 'blessure-cheville-tordue',
    category: 'blessure',
    title: tt("Cheville tordue à l'entraînement", 'Twisted ankle at practice'),
    description: tt(
      'Une mauvaise réception te fait tordre la cheville. {physio} intervient immédiatement.',
      'A bad landing twists your ankle. {physio} steps in immediately.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('Forcer le retour rapide', 'Force a quick return'), effects: { risqueBlessure: 15, tempsDeJeu: 4, relationCoach: 2 } },
      { label: tt('Suivre le protocole de rééducation complet de {physio}', "Follow {physio}'s full rehab protocol"), effects: { risqueBlessure: -12, forme: -4, tempsDeJeu: -6 } },
      { label: tt('Trouver un compromis avec {physio}', 'Find a compromise with {physio}'), effects: { risqueBlessure: -4, forme: -1 } },
    ],
  },
  {
    id: 'blessure-rechute-crainte',
    category: 'blessure',
    title: tt('Crainte de rechute', 'Fear of relapse'),
    description: tt(
      'Après une précédente blessure, tu ressens une gêne similaire qui réveille tes angoisses. {physio} te propose d\'en discuter.',
      'After a previous injury, you feel a similar discomfort that revives your anxiety. {physio} offers to talk it through.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('En parler ouvertement au staff', 'Talk openly to the staff'), effects: { mental: 3, risqueBlessure: -6 } },
      { label: tt('Garder ça pour toi et continuer', 'Keep it to yourself and carry on'), effects: { risqueBlessure: 10, mental: -3 } },
      { label: tt('Consulter un psychologue du sport', 'See a sports psychologist'), effects: { mental: 5, moral: 2 } },
    ],
  },
  {
    id: 'blessure-longue-absence',
    category: 'blessure',
    title: tt("Verdict : plusieurs semaines d'absence", 'Verdict: several weeks out'),
    description: tt(
      'Les examens de {physio} confirment une blessure qui va t\'éloigner des terrains pour un moment.',
      "{physio}'s exams confirm an injury that will keep you off the court for a while.",
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt("Rester très impliqué avec l'équipe depuis le banc", 'Stay heavily involved with the team from the bench'), effects: { relationCoequipiers: 4, relationCoach: 2, moral: 1 } },
      { label: tt("S'isoler pour encaisser le choc", 'Isolate yourself to process the shock'), effects: { moral: -4, mental: 2 } },
      { label: tt('Se concentrer à fond sur la rééducation', 'Focus entirely on rehab'), effects: { risqueBlessure: -8, physique: 2, forme: -3 } },
    ],
    weight: 2,
  },
  {
    id: 'blessure-retour-terrain',
    category: 'blessure',
    title: tt('Retour sur les terrains', 'Return to the court'),
    description: tt(
      'Après ta rééducation, {physio} te donne enfin le feu vert pour rejouer.',
      'After your rehab, {physio} finally gives you the green light to play again.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('Y aller prudemment, minutes limitées', 'Ease in carefully with limited minutes'), effects: { risqueBlessure: -5, forme: 2, tempsDeJeu: -3 } },
      { label: tt('Revenir à pleine intensité tout de suite', 'Come back at full intensity right away'), effects: { risqueBlessure: 10, reputation: 2, tempsDeJeu: 4 } },
    ],
  },
  {
    id: 'blessure-surcharge-calendrier',
    category: 'blessure',
    title: tt('Calendrier surchargé', 'Overloaded schedule'),
    description: tt(
      '{physio} alerte sur le nombre de matchs rapprochés qui augmente fortement le risque de blessure ce mois-ci.',
      '{physio} warns that the packed game schedule is sharply raising injury risk this month.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('Adapter ta récupération (sommeil, soins)', 'Adjust your recovery (sleep, treatment)'), effects: { risqueBlessure: -8, forme: 3 } },
      { label: tt('Continuer comme d\'habitude', 'Keep going as usual'), effects: { risqueBlessure: 6 } },
      { label: tt('Demander une rotation au coach', 'Ask the coach for a rotation'), effects: { risqueBlessure: -4, relationCoach: -1, tempsDeJeu: -3 } },
    ],
  },
  {
    id: 'blessure-douleur-dos',
    category: 'blessure',
    title: tt('Douleurs lombaires persistantes', 'Persistent lower back pain'),
    description: tt(
      '{physio} détecte une raideur inhabituelle au bas du dos après les derniers matchs.',
      '{physio} detects unusual stiffness in your lower back after recent games.',
    ),
    slots: [{ key: 'physio', pool: PHYSIOS }],
    choices: [
      { label: tt('Suivre un programme de mobilité ciblé', 'Follow a targeted mobility program'), effects: { risqueBlessure: -7, forme: 1 } },
      { label: tt('Ignorer et continuer normalement', 'Ignore it and carry on as normal'), effects: { risqueBlessure: 9 } },
    ],
  },
];
