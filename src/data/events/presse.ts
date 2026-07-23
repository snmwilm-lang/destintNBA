import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { JOURNALISTS } from '../names';

export const presseEvents: EventTemplate[] = [
  {
    id: 'presse-interview-fond',
    category: 'presse',
    title: tt('Interview en profondeur avec {journalist}', 'In-depth interview with {journalist}'),
    description: tt(
      '{journalist} souhaite réaliser un portrait complet de toi et de ton parcours.',
      '{journalist} wants to write a full profile on you and your journey.',
    ),
    slots: [{ key: 'journalist', pool: JOURNALISTS }],
    choices: [
      { label: tt('Se livrer sincèrement', 'Open up sincerely'), effects: { popularite: 4, moral: 1, reputation: 1 } },
      { label: tt('Rester sur des réponses convenues', 'Stick to safe, rehearsed answers'), effects: { popularite: 1 } },
      { label: tt("Décliner l'interview", 'Decline the interview'), effects: { mental: 1, popularite: -1 } },
    ],
    weight: 2,
  },
  {
    id: 'presse-question-piege',
    category: 'presse',
    title: tt('{journalist} pose une question piège', '{journalist} asks a trick question'),
    description: tt(
      'En conférence de presse, {journalist} te pousse à commenter les rumeurs de tensions internes.',
      'In a press conference, {journalist} pushes you to comment on rumors of internal tension.',
    ),
    slots: [{ key: 'journalist', pool: JOURNALISTS }],
    choices: [
      { label: tt('Répondre avec diplomatie', 'Answer diplomatically'), effects: { reputation: 2, relationCoach: 1 } },
      { label: tt("Répondre franchement, quitte à créer des remous", 'Answer honestly, even if it stirs things up'), effects: { popularite: 3, relationCoequipiers: -2 } },
      { label: tt('Refuser de répondre', 'Refuse to answer'), effects: { reputation: -1 } },
    ],
  },
  {
    id: 'presse-article-elogieux',
    category: 'presse',
    title: tt('Article élogieux signé {journalist}', 'A glowing article by {journalist}'),
    description: tt(
      '{journalist} publie un article très flatteur qui te compare aux plus grands espoirs du basket.',
      '{journalist} publishes a flattering piece comparing you to the biggest prospects in basketball.',
    ),
    slots: [{ key: 'journalist', pool: JOURNALISTS }],
    choices: [
      { label: tt('Rester humble publiquement', 'Stay humble publicly'), effects: { popularite: 2, relationCoequipiers: 1 } },
      { label: tt('Assumer et savourer les louanges', 'Own it and enjoy the praise'), effects: { popularite: 3, mental: -1 } },
    ],
  },
  {
    id: 'presse-critique-severe',
    category: 'presse',
    title: tt('Critique sévère de {journalist}', 'A harsh review from {journalist}'),
    description: tt(
      '{journalist} publie une chronique très dure sur ta gestion de balle en fin de match.',
      "{journalist} publishes a scathing column about your late-game ball handling.",
    ),
    slots: [{ key: 'journalist', pool: JOURNALISTS }],
    choices: [
      { label: tt('Utiliser la critique comme carburant', 'Use the criticism as fuel'), effects: { mental: 3, technique: 1 } },
      { label: tt('Répondre publiquement pour te défendre', 'Respond publicly to defend yourself'), effects: { popularite: 2, reputation: -1 } },
      { label: tt('Laisser couler', 'Let it go'), effects: { mental: 1 } },
    ],
  },
  {
    id: 'presse-couverture-nationale',
    category: 'presse',
    title: tt('Couverture médiatique nationale', 'National media coverage'),
    description: tt(
      'Un grand média national consacre un reportage à ton ascension fulgurante.',
      'A major national outlet runs a feature on your meteoric rise.',
    ),
    choices: [
      { label: tt("Profiter pleinement de l'exposition", 'Fully embrace the exposure'), effects: { popularite: 5, forme: -1 } },
      { label: tt('Garder profil bas et rester focus', 'Keep a low profile and stay focused'), effects: { forme: 1, popularite: 1 } },
    ],
  },
  {
    id: 'presse-fuite-info',
    category: 'presse',
    title: tt("Fuite d'informations privées", 'Private information leak'),
    description: tt(
      'Des détails de ta vie privée fuitent dans la presse people sans ton accord.',
      'Details about your private life leak to the tabloids without your consent.',
    ),
    choices: [
      { label: tt('Envisager une action légale', 'Consider legal action'), effects: { mental: 1, moral: -1 }, moneyDelta: -1000 },
      { label: tt('Ignorer et avancer', 'Ignore it and move on'), effects: { moral: -2 } },
    ],
  },
];
