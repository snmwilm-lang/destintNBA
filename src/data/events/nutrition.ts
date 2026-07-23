import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { NUTRITIONISTS } from '../names';

export const nutritionEvents: EventTemplate[] = [
  {
    id: 'nutrition-prise-de-poids',
    category: 'nutrition',
    title: tt('Hygiène de vie en question', 'Lifestyle under scrutiny'),
    description: tt(
      '{doc} remarque que tu prends du poids depuis quelques semaines et t\'alerte sur tes habitudes alimentaires.',
      "{doc} notices you've been gaining weight for a few weeks and warns you about your eating habits.",
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Suivre un régime strict', 'Follow a strict diet'), effects: { physique: 4, forme: 2, moral: -3 } },
      { label: tt('Continuer à profiter de la vie', 'Keep enjoying life'), effects: { moral: 3, physique: -4, forme: -2 } },
      { label: tt('Engager un chef personnel', 'Hire a personal chef'), effects: { physique: 5, forme: 3, moral: 1 }, moneyDelta: -2000 },
    ],
    weight: 2,
  },
  {
    id: 'nutrition-complements',
    category: 'nutrition',
    title: tt('Compléments alimentaires douteux', 'Questionable supplements'),
    description: tt(
      "Un coéquipier te propose des compléments qui promettent des gains rapides de masse musculaire. {doc} n'a pas validé leur composition.",
      'A teammate offers you supplements promising quick muscle gains. {doc} has not approved their ingredients.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Refuser et rester sur une alimentation naturelle', 'Refuse and stick to natural food'), effects: { mental: 2, risqueBlessure: -2 } },
      { label: tt('Essayer sans vérifier la composition', 'Try them without checking the ingredients'), effects: { physique: 3, risqueBlessure: 6 } },
      { label: tt('Consulter {doc} avant de décider', 'Consult {doc} before deciding'), effects: { physique: 2, iqBasket: 1 } },
    ],
  },
  {
    id: 'nutrition-jeune-intermittent',
    category: 'nutrition',
    title: tt('Un influenceur fitness vante le jeûne intermittent', 'A fitness influencer promotes intermittent fasting'),
    description: tt(
      'Tu hésites à changer complètement ton rythme alimentaire sur les conseils de vidéos en ligne, malgré les réserves de {doc}.',
      'You consider overhauling your eating schedule based on online videos, despite {doc}\'s reservations.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Tester malgré les réserves du staff', 'Try it despite the staff\'s concerns'), effects: { forme: -3, physique: 1, mental: 1 } },
      { label: tt('Suivre le plan du staff médical', 'Follow the medical staff\'s plan'), effects: { forme: 3, physique: 2 } },
    ],
  },
  {
    id: 'nutrition-repas-avant-match',
    category: 'nutrition',
    title: tt("Repas d'avant-match", 'Pre-game meal'),
    description: tt(
      'Une soirée entre amis tombe la veille d\'un match important, avec un menu qui n\'a rien de diététique. {doc} t\'a pourtant prévenu la semaine passée.',
      'A night out with friends falls the night before a big game, with a far-from-dietary menu. {doc} warned you about this last week.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Décliner pour respecter ton hygiène de vie', 'Decline to stick to your routine'), effects: { forme: 3, relationCoequipiers: -1, moral: -1 } },
      { label: tt('Y aller mais rester raisonnable', 'Go but stay reasonable'), effects: { moral: 2, forme: -1 } },
      { label: tt('Profiter sans retenue', 'Enjoy without restraint'), effects: { moral: 4, forme: -5 } },
    ],
  },
  {
    id: 'nutrition-hydratation',
    category: 'nutrition',
    title: tt("Suivi d'hydratation imposé", 'Mandatory hydration tracking'),
    description: tt(
      '{doc} met en place un suivi strict de ton hydratation pendant les entraînements intensifs.',
      '{doc} sets up strict hydration tracking during intense training blocks.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Suivre le protocole à la lettre', 'Follow the protocol to the letter'), effects: { forme: 3, physique: 1 } },
      { label: tt('Faire à ta manière', 'Do it your own way'), effects: { forme: -1 } },
    ],
  },
  {
    id: 'nutrition-trouble-alimentaire',
    category: 'nutrition',
    title: tt('Pression sur ton image corporelle', 'Pressure about your body image'),
    description: tt(
      'Les commentaires sur ton physique se multiplient sur les réseaux, tu ressens une pression sur ton rapport à la nourriture. {doc} te propose d\'en parler.',
      'Comments about your body pile up online, and you feel pressure around your relationship with food. {doc} offers to talk about it.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('En parler à un professionnel', 'Talk to a professional'), effects: { mental: 5, moral: 2 } },
      { label: tt('Ignorer et continuer seul', 'Ignore it and carry on alone'), effects: { mental: -3, moral: -2 } },
      { label: tt('Se couper temporairement des réseaux', 'Take a break from social media'), effects: { moral: 3, popularite: -2 } },
    ],
  },
  {
    id: 'nutrition-plan-personnalise',
    category: 'nutrition',
    title: tt('Plan alimentaire personnalisé proposé par {doc}', 'A custom meal plan from {doc}'),
    description: tt(
      '{doc} te propose un plan sur mesure basé sur ton métabolisme et ta charge d\'entraînement.',
      '{doc} offers you a tailored plan based on your metabolism and training load.',
    ),
    slots: [{ key: 'doc', pool: NUTRITIONISTS }],
    choices: [
      { label: tt('Adopter le plan sur le long terme', 'Adopt the plan long-term'), effects: { physique: 4, forme: 2 }, moneyDelta: -800 },
      { label: tt('L\'essayer un mois avant de juger', 'Try it for a month before judging'), effects: { physique: 2, forme: 1 } },
      { label: tt('Rester sur tes habitudes actuelles', 'Stick to your current habits'), effects: { moral: 1 } },
    ],
  },
];
