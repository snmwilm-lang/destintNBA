import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { SPONSORS } from '../names';

export const sponsorsEvents: EventTemplate[] = [
  {
    id: 'sponsor-premiere-offre',
    category: 'sponsors',
    title: tt('{brand} te propose un premier contrat', '{brand} offers you a first contract'),
    description: tt(
      'La marque {brand} souhaite t\'associer à sa nouvelle ligne de chaussures de basket.',
      '{brand} wants to feature you in its new basketball shoe line.',
    ),
    slots: [{ key: 'brand', pool: SPONSORS }],
    choices: [
      { label: tt('Signer immédiatement', 'Sign immediately'), effects: { popularite: 3 }, moneyDelta: 3000 },
      { label: tt('Négocier de meilleures conditions', 'Negotiate better terms'), effects: { popularite: 1, reputation: 1 }, moneyDelta: 4500 },
      { label: tt('Refuser pour rester indépendant', 'Refuse to stay independent'), effects: { mental: 1, moral: 1 } },
    ],
    weight: 2,
  },
  {
    id: 'sponsor-exigences-image',
    category: 'sponsors',
    title: tt("{brand} impose des exigences d'image", '{brand} sets strict image requirements'),
    description: tt(
      'Le contrat avec {brand} inclut des clauses strictes sur ton comportement public.',
      'The contract with {brand} includes strict clauses about your public behavior.',
    ),
    slots: [{ key: 'brand', pool: SPONSORS }],
    choices: [
      { label: tt('Accepter toutes les clauses', 'Accept all the clauses'), effects: { moral: -2 }, moneyDelta: 2000 },
      { label: tt('Négocier plus de liberté', 'Negotiate more freedom'), effects: { mental: 1 }, moneyDelta: 500 },
      { label: tt('Refuser le contrat', 'Refuse the contract'), effects: { moral: 2, popularite: -1 } },
    ],
  },
  {
    id: 'sponsor-tournee-promo',
    category: 'sponsors',
    title: tt('Tournée promotionnelle pour {brand}', 'Promotional tour for {brand}'),
    description: tt(
      '{brand} te propose une tournée de trois jours d\'événements promotionnels en pleine période de matchs.',
      '{brand} offers you a three-day promotional tour right in the middle of the game schedule.',
    ),
    slots: [{ key: 'brand', pool: SPONSORS }],
    choices: [
      { label: tt('Accepter malgré la fatigue', 'Accept despite the fatigue'), effects: { forme: -4, popularite: 4 }, moneyDelta: 5000 },
      { label: tt('Négocier une version raccourcie', 'Negotiate a shorter version'), effects: { forme: -1, popularite: 2 }, moneyDelta: 2500 },
      { label: tt('Décliner pour préserver ta forme', 'Decline to protect your fitness'), effects: { forme: 1, relationCoach: 1 } },
    ],
  },
  {
    id: 'sponsor-conflit-materiel',
    category: 'sponsors',
    title: tt("Conflit d'équipementier avec le club", 'Gear conflict with the club'),
    description: tt(
      'Ton contrat personnel avec {brand} entre en conflit avec l\'équipementier officiel du club.',
      "Your personal contract with {brand} clashes with the club's official gear supplier.",
    ),
    slots: [{ key: 'brand', pool: SPONSORS }],
    choices: [
      { label: tt('Privilégier ton contrat personnel', 'Prioritize your personal contract'), effects: { relationCoach: -3 }, moneyDelta: 1500 },
      { label: tt('Respecter les règles du club', 'Respect the club rules'), effects: { relationCoach: 3 }, moneyDelta: -1500 },
    ],
  },
  {
    id: 'sponsor-collection-signature',
    category: 'sponsors',
    title: tt('{brand} veut créer un produit à ton nom', '{brand} wants to create a signature product'),
    description: tt(
      'Séduite par ta progression, {brand} envisage une collection signature à ton effigie.',
      'Impressed by your progress, {brand} is considering a signature line under your name.',
    ),
    slots: [{ key: 'brand', pool: SPONSORS }],
    choices: [
      { label: tt('S\'investir personnellement dans le design', 'Get personally involved in the design'), effects: { popularite: 4, moral: 2 }, moneyDelta: 6000 },
      { label: tt('Laisser faire les équipes marketing', 'Let the marketing team handle it'), effects: { popularite: 2 }, moneyDelta: 4000 },
    ],
  },
];
