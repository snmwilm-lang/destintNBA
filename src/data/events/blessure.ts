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
  // A rare, serious injury scare — gated to players who have genuinely built up real risk (tall
  // builds accumulate this fastest, see heightTilt in rollInjuries) — staged as a real two-step
  // decision instead of a single silent stat roll, since a career-threatening injury deserves an
  // actual choice about how to handle it.
  {
    id: 'blessure-grave-diagnostic',
    category: 'blessure',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Diagnostic inquiétant', 'A worrying diagnosis'),
    description: tt(
      "L'IRM de routine révèle quelque chose de plus sérieux que prévu : une blessure qui pourrait vraiment peser sur la suite de ta carrière.",
      'The routine MRI turns up something more serious than expected — an injury that could genuinely weigh on the rest of your career.',
    ),
    requirements: [{ stat: 'risqueBlessure', min: 35 }],
    weight: 0.5,
    choices: [
      {
        label: tt('Rester positif face à l\'annonce', 'Stay positive about the news'),
        effects: { mental: 2 },
        linkedNextEventId: 'blessure-grave-decision',
      },
      {
        label: tt("Laisser l'inquiétude s'installer", 'Let the worry set in'),
        effects: { moral: -2, mental: 1 },
        linkedNextEventId: 'blessure-grave-decision',
      },
    ],
  },
  {
    id: 'blessure-grave-decision',
    category: 'blessure',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Chirurgie ou jouer avec la douleur ?', 'Surgery or play through the pain?'),
    description: tt(
      'Le staff médical te présente les options. Ta décision va peser lourd sur la suite de ta carrière.',
      'The medical staff lays out the options. Whatever you decide here will weigh heavily on the rest of your career.',
    ),
    // Defensive gate in case this is ever drawn directly instead of via the diagnostic's
    // linkedNextEventId chain — same standard used for the Finals decisive beat.
    requirements: [{ stat: 'risqueBlessure', min: 35 }],
    weight: 0.5,
    choices: [
      {
        label: tt('Opter pour la chirurgie et une rééducation complète', 'Opt for surgery and a full rehab'),
        resultText: tt(
          "L'opération se passe bien. La rééducation est longue mais complète — tu reviens sur des bases saines.",
          'The surgery goes well. The rehab is long but thorough — you come back on healthy footing.',
        ),
        effects: { forme: -10, tempsDeJeu: -6, risqueBlessure: -15, moral: -2 },
        moneyDelta: -50000,
      },
      {
        label: tt('Jouer à travers la douleur', 'Play through the pain'),
        successChance: {
          baseChance: 0.35,
          statBonus: { mental: 0.015 },
          onSuccess: { reputation: 5, popularite: 4, moral: 3 },
          onFailure: { forme: -15, risqueBlessure: 12, moral: -6, tempsDeJeu: -10 },
          successText: tt(
            'Contre toute attente, ton corps tient le coup. Une histoire de dureté qui marque les esprits.',
            'Against all odds, your body holds up. A story of toughness that leaves a mark.',
          ),
          failureText: tt(
            "La blessure s'aggrave sérieusement. Tu payes cher d'avoir forcé.",
            'The injury gets seriously worse. Pushing through it costs you dearly.',
          ),
        },
      },
      {
        label: tt('Rééducation conservative, sans chirurgie', 'Conservative rehab, no surgery'),
        resultText: tt(
          "Tu choisis la voie du milieu : pas de bistouri, mais un vrai programme de soin pris au sérieux.",
          'You take the middle path: no scalpel, but a real, disciplined recovery program.',
        ),
        effects: { forme: -5, tempsDeJeu: -3, risqueBlessure: -6 },
      },
    ],
  },
];
