import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { FAMILY_FRIENDS } from '../names';
import { FAMILY_FRIENDS_EN } from '../namesEn';

export const familleEvents: EventTemplate[] = [
  {
    id: 'famille-devoirs-lycee',
    category: 'famille',
    title: tt('Les cours passent après le basket ?', 'School taking a back seat to basketball?'),
    description: tt(
      "Tes profs alertent tes parents : tes notes ont chuté depuis que tu enchaînes les entraînements intensifs.",
      'Your teachers have flagged it to your parents: your grades have slipped since the intensive training started piling up.',
    ),
    maxAge: 18,
    weight: 2,
    choices: [
      {
        label: tt('Te remettre sérieusement aux devoirs', 'Get serious about your schoolwork again'),
        effects: { mental: 2, moral: -1 },
        draftImpact: 2,
      },
      { label: tt('Trouver un équilibre raisonnable', 'Find a reasonable balance'), effects: { mental: 1 } },
      {
        label: tt('Laisser tomber, le basket est la priorité', "Let it slide — basketball is the priority"),
        effects: { forme: 2, relationCoach: 1 },
        draftImpact: -2,
      },
    ],
  },
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
  {
    id: 'famille-heritage-fin-carriere',
    category: 'famille',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Ton héritage', 'Your legacy'),
    description: tt(
      "En pleine saison, une question te trotte dans la tête depuis des semaines : combien de temps encore ? Ton enfant te regarde s'entraîner avec des étoiles dans les yeux et rêve déjà de te ressembler sur un terrain.",
      "In the middle of the season, a question has been on your mind for weeks: how much longer? Your kid watches you train with stars in their eyes, already dreaming of following in your footsteps.",
    ),
    minAge: 34,
    unique: true,
    choices: [
      {
        label: tt("Prendre le temps d'entraîner ton enfant, continuer ta carrière", "Take the time to coach your kid, keep playing"),
        resultText: tt(
          "Tu passes tes après-midis libres à lui apprendre les fondamentaux. Ce n'est plus seulement ta carrière — c'est une histoire qui continue.",
          "You spend your free afternoons teaching them the fundamentals. It's not just your career anymore — it's a story that keeps going.",
        ),
        effects: { moral: 4, mental: 2, popularite: 2 },
      },
      {
        label: tt('Te retirer maintenant, sur tes propres termes', 'Retire now, on your own terms'),
        resultText: tt(
          "Tu annonces ta retraite en pleine saison, la tête haute. Pas de déclin à traîner encore des années — tu pars au sommet de ta propre histoire.",
          'You announce your retirement mid-season, head held high. No dragging out a decline for years more — you go out on your own story\'s terms.',
        ),
        effects: { moral: 3 },
        endsCareer: true,
      },
    ],
  },
];
