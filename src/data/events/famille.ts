import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { FAMILY_FRIENDS } from '../names';
import { FAMILY_FRIENDS_EN } from '../namesEn';

export const familleEvents: EventTemplate[] = [
  {
    id: 'famille-fierte-parents',
    category: 'famille',
    title: tt('Une visite qui compte', 'A visit that matters'),
    description: tt(
      "Après des mois d'absence pour raisons professionnelles, {relative} vient enfin te voir jouer.",
      '{relativeEn} finally comes to watch you play, after months away for work.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Lui consacrer la soirée après le match', 'Spend the evening with them after the game'), effects: { moral: 4, mental: 1 } },
      { label: tt('Rester concentré sur la routine habituelle', 'Stick to your usual routine'), effects: { forme: 1, moral: -1 } },
    ],
    weight: 2,
  },
  {
    id: 'famille-pression-reussite',
    category: 'famille',
    title: tt('Pression familiale sur ta réussite', 'Family pressure to succeed'),
    description: tt(
      '{relative} a beaucoup sacrifié pour ta carrière et te le rappelle régulièrement.',
      '{relativeEn} sacrificed a lot for your career and reminds you of it often.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('En parler ouvertement', 'Talk about it openly'), effects: { mental: 3, moral: 2 } },
      { label: tt('Encaisser la pression en silence', 'Bottle up the pressure'), effects: { moral: -3, mental: -1 } },
    ],
  },
  {
    id: 'famille-probleme-sante',
    category: 'famille',
    title: tt('Un proche traverse une période difficile', 'A loved one is going through a hard time'),
    description: tt(
      '{relative} traverse des soucis de santé et tu hésites à t\'absenter du club.',
      '{relativeEn} is dealing with health issues, and you\'re torn about taking time off from the club.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Prendre du temps pour être présent', 'Take time to be there'), effects: { moral: 3, forme: -1, relationCoach: -1 } },
      { label: tt('Rester concentré sur la saison', 'Stay focused on the season'), effects: { relationCoach: 1, moral: -3 } },
    ],
    weight: 2,
  },
  {
    id: 'famille-demenagement',
    category: 'famille',
    title: tt('Un déménagement pour te suivre', 'A move to follow you'),
    description: tt(
      'Pour te soutenir, {relative} envisage de quitter sa ville pour se rapprocher de ton club.',
      '{relativeEn} is considering leaving their hometown to be closer to your club.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Encourager cette décision', 'Encourage the move'), effects: { moral: 4 }, moneyDelta: -2000 },
      { label: tt('Lui dire de rester où il/elle est bien', 'Tell them to stay where they are happy'), effects: { mental: 1, moral: -1 } },
    ],
  },
  {
    id: 'famille-modele',
    category: 'famille',
    title: tt('On te prend pour modèle', 'Someone looks up to you'),
    description: tt(
      '{relative} commence à s\'intéresser sérieusement au basket et veut absolument s\'entraîner avec toi pendant tes jours de repos.',
      '{relativeEn} is getting serious about basketball and really wants to train with you on your days off.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Lui consacrer du temps', 'Give them your time'), effects: { moral: 3, forme: -1 } },
      { label: tt('Privilégier ta récupération', 'Prioritize your recovery'), effects: { forme: 2, moral: -2 } },
    ],
  },
  {
    id: 'famille-conflit-argent',
    category: 'famille',
    title: tt("Tensions autour de l'argent en famille", 'Family tension over money'),
    description: tt(
      'Tes premiers revenus créent des tensions avec {relative} sur la façon dont ils devraient être gérés.',
      'Your first paychecks create tension with {relativeEn} over how the money should be managed.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Aider financièrement sans compter', 'Help out financially without limits'), effects: { moral: 2 }, moneyDelta: -3000 },
      { label: tt('Fixer des limites claires', 'Set clear boundaries'), effects: { mental: 2, moral: -1 } },
      { label: tt('Faire appel à un conseiller financier', 'Bring in a financial advisor'), effects: { mental: 1 } },
    ],
  },
  {
    id: 'famille-conseil-avise',
    category: 'famille',
    title: tt('Un conseil qui fait réfléchir', 'A piece of advice that sticks with you'),
    description: tt(
      'Avant une décision importante pour ta carrière, {relative} te livre un conseil qui te touche particulièrement.',
      'Before a big career decision, {relativeEn} shares a piece of advice that really hits home.',
    ),
    slots: [
      { key: 'relative', pool: FAMILY_FRIENDS },
      { key: 'relativeEn', pool: FAMILY_FRIENDS_EN },
    ],
    choices: [
      { label: tt('Suivre ce conseil', 'Follow the advice'), effects: { mental: 3, moral: 2 } },
      { label: tt('Écouter mais suivre ton propre instinct', 'Listen but trust your own instinct'), effects: { mental: 1 } },
    ],
  },
];
