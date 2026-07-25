import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { AGENTS, NBA_LIKE_TEAMS, EUROPE_TEAMS } from '../names';

const allTeams = NBA_LIKE_TEAMS.concat(EUROPE_TEAMS).map((t) => t.name);

export const mercatoEvents: EventTemplate[] = [
  {
    id: 'mercato-approche-agent',
    category: 'mercato',
    title: tt('{agent} veut devenir ton agent', '{agent} wants to become your agent'),
    description: tt(
      '{agent}, agent réputé, te contacte pour te représenter et négocier tes futurs contrats.',
      '{agent}, a well-known agent, reaches out to represent you and negotiate your future contracts.',
    ),
    slots: [{ key: 'agent', pool: AGENTS }],
    choices: [
      { label: tt('Signer avec cet agent', 'Sign with this agent'), effects: { reputation: 2 }, moneyDelta: -500 },
      { label: tt('Continuer sans agent pour l\'instant', 'Keep going without an agent for now'), effects: { mental: 1 } },
      { label: tt('Comparer plusieurs offres d\'agents', 'Compare several agent offers'), effects: { iqBasket: 1, reputation: 1 } },
    ],
  },
  {
    id: 'mercato-interet-club',
    category: 'mercato',
    title: tt('{team} s\'intéresse à toi', '{team} is showing interest'),
    description: tt(
      'Des recruteurs de {team} ont assisté à trois de tes derniers matchs.',
      "Scouts from {team} have attended three of your last games.",
    ),
    slots: [{ key: 'team', pool: allTeams }],
    // NBA-club interest shouldn't start until the player is genuinely a draft prospect — one
    // year out from the typical draft age (18), not two.
    minAge: 17,
    choices: [
      { label: tt('Rester concentré sur ta saison actuelle', 'Stay focused on your current season'), effects: { mental: 2, relationCoach: 1 } },
      { label: tt('Laisser filtrer l\'information à la presse', 'Let the info leak to the press'), effects: { popularite: 3, reputation: 1, relationCoach: -2, relationCoequipiers: -1 } },
    ],
  },
  {
    id: 'mercato-offre-prolongation',
    category: 'mercato',
    title: tt('Ton club veut prolonger ton contrat', 'Your club wants to extend your contract'),
    description: tt(
      'La direction propose une prolongation avant même la fin de la saison, pour sécuriser ton avenir chez eux.',
      "Management offers an extension before the season even ends, to secure your future with them.",
    ),
    leagues: ['nba', 'europe', 'gLeague'],
    choices: [
      { label: tt('Signer rapidement pour la sécurité', 'Sign quickly for security'), effects: { moral: 3 }, moneyDelta: 2000 },
      { label: tt('Négocier de meilleures conditions', 'Negotiate better terms'), effects: { reputation: 1 }, moneyDelta: 3500 },
      { label: tt('Attendre de voir le marché', 'Wait and see the market'), effects: { relationCoach: -2, mental: 1 } },
    ],
  },
  {
    id: 'mercato-rumeur-presse',
    category: 'mercato',
    title: tt('Une rumeur de transfert vers {team} enfle', 'A transfer rumor to {team} grows'),
    description: tt(
      "La presse spécule sur un possible départ vers {team}, sans confirmation officielle.",
      'The press speculates about a possible move to {team}, with no official confirmation.',
    ),
    slots: [{ key: 'team', pool: allTeams }],
    // NBA-club interest shouldn't start until the player is genuinely a draft prospect — one
    // year out from the typical draft age (18), not two.
    minAge: 17,
    choices: [
      { label: tt('Démentir publiquement', 'Deny it publicly'), effects: { relationCoach: 2, relationCoequipiers: 2, popularite: -1 } },
      { label: tt('Ne pas commenter', 'Decline to comment'), effects: { mental: 1 } },
      { label: tt('Laisser planer le doute', 'Let the doubt linger'), effects: { popularite: 3, relationCoach: -3, relationCoequipiers: -3 } },
    ],
  },
  {
    id: 'mercato-visite-club',
    category: 'mercato',
    title: tt('Visite des installations de {team}', "Touring {team}'s facilities"),
    description: tt(
      "{team} t'invite à visiter son centre d'entraînement dernier cri pour te convaincre de signer.",
      '{team} invites you to tour its state-of-the-art training center to convince you to sign.',
    ),
    slots: [{ key: 'team', pool: allTeams }],
    // NBA-club interest shouldn't start until the player is genuinely a draft prospect — one
    // year out from the typical draft age (18), not two.
    minAge: 17,
    choices: [
      { label: tt('Être impressionné et se projeter', 'Be impressed and picture yourself there'), effects: { moral: 3, mental: 1 } },
      { label: tt('Rester lucide sur le projet sportif', 'Stay clear-eyed about the sporting project'), effects: { iqBasket: 2 } },
    ],
  },
  {
    id: 'mercato-fidelite-club',
    category: 'mercato',
    title: tt('Ton club actuel te demande de rester fidèle', 'Your current club asks for loyalty'),
    description: tt(
      "La direction fait appel à ton attachement au club pour te dissuader d'écouter les autres offres.",
      'Management appeals to your attachment to the club to discourage you from hearing other offers.',
    ),
    leagues: ['nba', 'europe', 'gLeague'],
    choices: [
      { label: tt('Réaffirmer ta fidélité publiquement', 'Publicly reaffirm your loyalty'), effects: { relationCoach: 4, relationCoequipiers: 3, popularite: 2 }, moneyDelta: -1000 },
      { label: tt('Rester ouvert à toutes les options', 'Stay open to all options'), effects: { relationCoach: -2, relationCoequipiers: -2 }, moneyDelta: 500 },
    ],
  },
];
