import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { TEAMMATES } from '../names';

export const relationsEvents: EventTemplate[] = [
  {
    id: 'relations-nouvelle-amitie',
    category: 'relations',
    title: tt('Une amitié se construit avec {teammate}', 'A friendship builds with {teammate}'),
    description: tt(
      '{teammate} et toi passez de plus en plus de temps ensemble en dehors du terrain.',
      'You and {teammate} spend more and more time together off the court.',
    ),
    slots: [{ key: 'teammate', pool: TEAMMATES }],
    choices: [
      { label: tt('Cultiver cette amitié', 'Nurture the friendship'), effects: { relationCoequipiers: 4, moral: 2 } },
      { label: tt('Garder une certaine distance professionnelle', 'Keep some professional distance'), effects: { mental: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'relations-vie-amoureuse',
    category: 'relations',
    title: tt('Ta vie amoureuse impacte ton quotidien', 'Your love life affects your daily routine'),
    description: tt(
      'Une nouvelle relation prend de la place dans ton emploi du temps déjà chargé.',
      'A new relationship is taking up space in your already busy schedule.',
    ),
    choices: [
      { label: tt('Prioriser cette relation', 'Prioritize the relationship'), effects: { moral: 4, forme: -2 } },
      { label: tt('Prioriser ta carrière pour l\'instant', 'Prioritize your career for now'), effects: { forme: 1, moral: -3 } },
      { label: tt('Trouver un équilibre', 'Find a balance'), effects: { moral: 2, forme: -1 } },
    ],
    weight: 2,
  },
  {
    id: 'relations-mentor-veteran',
    category: 'relations',
    title: tt('Un vétéran du club te prend sous son aile', 'A club veteran takes you under his wing'),
    description: tt(
      'Un joueur expérimenté partage volontiers son expérience et ses conseils avec toi.',
      'An experienced player is happy to share his experience and advice with you.',
    ),
    choices: [
      { label: tt('Absorber un maximum de conseils', 'Soak up as much advice as possible'), effects: { iqBasket: 3, relationCoequipiers: 2 } },
      { label: tt('Garder ton indépendance', 'Keep your independence'), effects: { mental: 2 } },
    ],
  },
  {
    id: 'relations-jalousie-vestiaire',
    category: 'relations',
    title: tt('De la jalousie dans le vestiaire', 'Jealousy in the locker room'),
    description: tt(
      'Ta progression rapide crée des tensions silencieuses avec certains coéquipiers plus anciens.',
      'Your rapid progress creates quiet tension with some of the more senior teammates.',
    ),
    choices: [
      { label: tt('Aller directement en discuter', 'Go talk about it directly'), effects: { relationCoequipiers: 3, mental: 1 } },
      { label: tt('Laisser les résultats parler', 'Let the results speak for themselves'), effects: { relationCoequipiers: -1, reputation: 2 } },
    ],
  },
  {
    id: 'relations-amitie-rival',
    category: 'relations',
    title: tt('Amitié inattendue avec un adversaire', 'An unexpected friendship with an opponent'),
    description: tt(
      "Tu te lies d'amitié avec un joueur d'une équipe rivale rencontré en sélection.",
      'You become friends with a player from a rival team you met on national duty.',
    ),
    choices: [
      { label: tt('Entretenir cette amitié', 'Maintain the friendship'), effects: { moral: 2, mental: 1 } },
      { label: tt('Garder une rivalité saine sans lien personnel', 'Keep a healthy rivalry without personal ties'), effects: { mental: 1 } },
    ],
  },
  {
    id: 'relations-capitanat',
    category: 'relations',
    title: tt('On évoque le brassard de capitaine pour toi', 'The captaincy is mentioned for you'),
    description: tt(
      'Le groupe et le staff discutent de te confier un rôle de leader officiel dans le vestiaire.',
      'The team and staff discuss giving you an official leadership role in the locker room.',
    ),
    choices: [
      { label: tt('Accepter cette responsabilité', 'Accept the responsibility'), effects: { relationCoequipiers: 3, relationCoach: 2, mental: 2 } },
      { label: tt('Suggérer qu\'un autre joueur est plus légitime', 'Suggest another player is more deserving'), effects: { relationCoequipiers: 2, mental: -1 } },
    ],
  },
];
