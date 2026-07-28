import type { League } from '../../types';
import { tt, type EventTemplate } from '../../engine/eventTemplate';
import { RIVAL_PLAYERS, HIGH_SCHOOL_TEAMS, NBA_LIKE_TEAMS, EUROPE_TEAMS } from '../names';

const europeOpponents = EUROPE_TEAMS.map((t) => t.name);
const proOpponents = NBA_LIKE_TEAMS.map((t) => t.name).concat(europeOpponents);
const opponents = HIGH_SCHOOL_TEAMS.concat(proOpponents);

// The opponents pool mixes high-school, NBA-market, and European club names — restrict each
// generated variant to the league its opponent actually belongs to, so a player never lines up
// against a pro franchise while still in high school (or the reverse).
function leaguesForOpponent(name: string): League[] | undefined {
  if (HIGH_SCHOOL_TEAMS.includes(name)) return ['lycee'];
  if (europeOpponents.includes(name)) return ['europe'];
  return ['nba', 'gLeague'];
}

export const matchEvents: EventTemplate[] = [
  {
    id: 'match-duel-direct',
    category: 'match',
    title: tt('Duel face à {rival}', 'Showdown against {rival}'),
    description: tt(
      "Tu es opposé à {rival}, le meilleur défenseur de {opponent}. Il te chambre avant l'entre-deux et promet de te \"faire disparaître\" du match.",
      "You're matched up against {rival}, {opponent}'s best defender. He trash-talks you before tip-off and promises to shut you down completely.",
    ),
    slots: [
      { key: 'rival', pool: RIVAL_PLAYERS },
      { key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent },
    ],
    choices: [
      {
        label: tt('Répondre par des mots', 'Talk back'),
        resultText: tt('Tu le chambres en retour. La tension monte, tout le gymnase le sent.', 'You trash-talk right back. The tension rises, the whole gym can feel it.'),
        effects: { mental: 3, popularite: 2, relationCoequipiers: -1 },
        successChance: {
          baseChance: 0.5,
          statBonus: { mental: 0.01 },
          onSuccess: { reputation: 4, popularite: 3, moral: 3 },
          onFailure: { moral: -4, reputation: -2 },
          successText: tt('Tu le domines toute la rencontre, il craque en fin de match.', 'You dominate him all game long — he cracks by the fourth quarter.'),
          failureText: tt('Il te punit sur le terrain et ne se prive pas de te le rappeler.', 'He punishes you on the court and makes sure to remind you about it.'),
        },
      },
      {
        label: tt('Rester silencieux et jouer', 'Stay silent and play'),
        resultText: tt('Tu ignores la provocation et te concentres sur ton jeu.', 'You ignore the trash talk and focus on your game.'),
        effects: { mental: 2, iqBasket: 2, forme: -1 },
      },
      {
        label: tt('Demander un temps mort mental', 'Take a mental timeout'),
        resultText: tt('Tu respires, tu te recentres avant de revenir plus fort.', 'You breathe, refocus, and come back stronger.'),
        effects: { mental: 4, moral: 1, forme: -2 },
      },
    ],
    weight: 3,
    tags: ['rivalDuel'],
  },
  {
    id: 'match-fin-serree',
    category: 'match',
    title: tt('Fin de match serrée contre {opponent}', 'Nail-biter against {opponent}'),
    description: tt(
      "Il reste 40 secondes. Ton équipe mène d'un point face à {opponent}. Le coach te regarde et attend ta décision sur le prochain système.",
      "40 seconds left. Your team is up by one against {opponent}. The coach looks at you, waiting for the call on the next play.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Demander le ballon final', 'Call for the final ball'),
        resultText: tt('Tu prends la responsabilité du dernier tir.', 'You take responsibility for the last shot.'),
        successChance: {
          baseChance: 0.5,
          statBonus: { technique: 0.01, mental: 0.01 },
          onSuccess: { reputation: 6, moral: 5, relationCoach: 3, popularite: 4 },
          onFailure: { moral: -5, relationCoach: -2 },
          successText: tt('Le ballon rentre au buzzer. Le gymnase explose.', 'The shot drops at the buzzer. The gym explodes.'),
          failureText: tt('Le tir sort. Le silence retombe sur le banc.', 'The shot rims out. Silence falls over the bench.'),
        },
      },
      {
        // The hardest, lowest-percentage look on the floor — a contested one-on-one jumper with
        // no dribble to set it up. Unlike the Finals-clinching shot (a rare once-per-career beat),
        // this keeps the same high-risk shot type showing up as a real, recurring choice.
        label: tt('Tenter le step-back au buzzer', 'Pull up for a step-back at the buzzer'),
        resultText: tt('Tu crées ton propre espace au prix du risque maximum.', 'You create your own space at maximum risk.'),
        successChance: {
          baseChance: 0.35,
          statBonus: { technique: 0.01, mental: 0.006 },
          onSuccess: { reputation: 9, popularite: 7, moral: 6 },
          onFailure: { moral: -6, reputation: -2 },
          successText: tt('Geste de pur génie individuel : le tir rentre au buzzer.', 'A moment of pure individual genius — the shot drops at the buzzer.'),
          failureText: tt('Le tir sort complètement. Un silence glacial tombe sur le banc.', 'The shot misses badly. An icy silence falls over the bench.'),
        },
      },
      {
        label: tt('Faire jouer un coéquipier plus démarqué', 'Find your open teammate'),
        resultText: tt('Tu fais confiance au collectif.', 'You trust the team.'),
        effects: { iqBasket: 4, relationCoequipiers: 4, relationCoach: 2, reputation: 1 },
      },
      {
        label: tt('Jouer la sécurité et faire perdre du temps', 'Play it safe and run the clock'),
        resultText: tt('Tu geins les secondes sans prendre de risque.', 'You milk the clock without taking any risks.'),
        effects: { iqBasket: 2, mental: 1, popularite: -1 },
      },
    ],
    weight: 3,
  },
  {
    id: 'match-grosse-perf',
    category: 'match',
    title: tt('Grande performance possible', 'A big night is possible'),
    description: tt(
      "Tu sens que c'est ton soir. Face à {opponent}, tu peux forcer les choix offensifs pour viser un record personnel.",
      "You can feel it's your night. Against {opponent}, you could force the offense to chase a personal record.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Chercher le scoring à tout prix', 'Chase points at all costs'),
        effects: { reputation: 3, popularite: 3, relationCoequipiers: -3, forme: -3 },
        successChance: {
          baseChance: 0.55,
          statBonus: { technique: 0.01 },
          onSuccess: { reputation: 6, popularite: 5, potentiel: 1 },
          onFailure: { moral: -3, relationCoequipiers: -3 },
        },
      },
      {
        label: tt('Distribuer le jeu pour élever le collectif', 'Distribute to elevate the team'),
        effects: { iqBasket: 4, relationCoequipiers: 4, reputation: 1 },
      },
      {
        label: tt('Jouer équilibré sans forcer', 'Play a balanced game'),
        effects: { forme: 2, mental: 1 },
      },
    ],
  },
  {
    id: 'match-mauvaise-passe',
    category: 'match',
    title: tt('Mauvaise soirée sur le parquet', 'A rough night on the court'),
    description: tt(
      "Rien ne rentre depuis le début du match contre {opponent}. Tu sens le doute t'envahir.",
      "Nothing has fallen since the start of the game against {opponent}. Doubt starts creeping in.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Insister sur le tir', 'Keep firing away'),
        effects: { mental: -2, reputation: -2, moral: -2 },
      },
      {
        label: tt('Se recentrer sur la défense et les passes', 'Refocus on defense and passing'),
        effects: { iqBasket: 3, relationCoequipiers: 2, mental: 2 },
        draftImpact: 1,
      },
      {
        label: tt('Demander à sortir du match', 'Ask to be substituted out'),
        effects: { relationCoach: -3, moral: -1, forme: 3 },
        draftImpact: -2,
      },
    ],
    weight: 2,
  },
  {
    id: 'match-blessure-legere',
    category: 'match',
    title: tt('Douleur en plein match', 'Pain mid-game'),
    description: tt(
      "Une gêne à la cheville apparaît après un contact face à {opponent}. Le match continue autour de toi.",
      "A nagging ankle pain appears after contact against {opponent}. The game keeps going around you.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Continuer à jouer', 'Keep playing'),
        effects: { risqueBlessure: 12, reputation: 2, relationCoach: 2 },
      },
      {
        label: tt('Prévenir le staff médical immédiatement', 'Alert the medical staff immediately'),
        effects: { risqueBlessure: -6, relationCoach: 1, popularite: -1 },
      },
      {
        label: tt('Demander un strapping et repartir prudent', 'Get taped up and play carefully'),
        effects: { risqueBlessure: 3, forme: -2 },
      },
    ],
    tags: ['injury-risk'],
  },
  {
    id: 'match-supporters',
    category: 'match',
    title: tt('Le public de {opponent} te chauffe', "{opponent}'s crowd is on you"),
    description: tt(
      "Les supporters adverses scandent ton nom pour te déconcentrer avant un lancer-franc décisif.",
      'The opposing fans chant your name to throw you off before a decisive free throw.',
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Ignorer et respirer', 'Ignore it and breathe'),
        effects: { mental: 3 },
        successChance: { baseChance: 0.65, statBonus: { mental: 0.01 }, onSuccess: { reputation: 2, moral: 2 }, onFailure: { moral: -2 } },
        draftImpact: 1,
      },
      {
        label: tt('Répondre au public avec un geste', 'Answer the crowd with a gesture'),
        effects: { popularite: 3, reputation: -1, mental: -1 },
        draftImpact: -2,
      },
    ],
  },
  {
    id: 'match-remontada',
    category: 'match',
    title: tt('Retard de 15 points contre {opponent}', 'Down 15 against {opponent}'),
    description: tt(
      "L'équipe est menée largement à la mi-temps. Le vestiaire attend un mot ou un geste fort.",
      'The team trails heavily at halftime. The locker room is waiting for a word or a strong gesture.',
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Prendre la parole devant le groupe', 'Speak up in front of the team'),
        effects: { relationCoequipiers: 4, mental: 3, reputation: 2 },
        successChance: { baseChance: 0.4, statBonus: { mental: 0.01, relationCoequipiers: 0.01 }, onSuccess: { relationCoequipiers: 5, reputation: 4 }, onFailure: { relationCoequipiers: -2 } },
      },
      {
        label: tt('Laisser parler le coach', 'Let the coach talk'),
        effects: { relationCoach: 2 },
      },
      {
        label: tt('Se concentrer en silence sur son propre jeu', 'Focus silently on your own game'),
        effects: { mental: 1, forme: 1 },
      },
    ],
  },
  {
    id: 'match-role-limite',
    category: 'match',
    title: tt('Temps de jeu limité', 'Limited playing time'),
    description: tt(
      "Le coach ne te fait jouer que quelques minutes face à {opponent}, malgré tes bonnes sensations à l'entraînement.",
      "The coach only plays you a few minutes against {opponent}, despite your strong feel in practice.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Aller en parler directement après le match', 'Talk to the coach right after the game'),
        effects: { relationCoach: -2, mental: 2 },
        successChance: {
          baseChance: 0.5,
          statBonus: { relationCoach: 0.012, mental: 0.006 },
          onSuccess: { tempsDeJeu: 5, relationCoach: 1 },
          onFailure: { relationCoach: -4 },
        },
      },
      {
        label: tt('Rester professionnel et travailler encore plus dur', 'Stay professional and work even harder'),
        effects: { mental: 3, relationCoach: 2, forme: -1 },
        draftImpact: 2,
      },
      {
        label: tt('Se plaindre publiquement', 'Complain publicly'),
        effects: { popularite: 1, relationCoach: -5, reputation: -2 },
        draftImpact: -3,
      },
    ],
  },
  {
    id: 'match-derby-rival',
    category: 'match',
    title: tt('Derby explosif contre {opponent}', 'Explosive derby against {opponent}'),
    description: tt(
      "L'ambiance est électrique. {rival} et toi vous affrontez pour la troisième fois cette saison, la rivalité est connue de tous.",
      "The atmosphere is electric. You and {rival} face off for the third time this season — everyone knows about the rivalry.",
    ),
    slots: [
      { key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent },
      { key: 'rival', pool: RIVAL_PLAYERS },
    ],
    choices: [
      {
        label: tt("Jouer la carte de l'intensité physique", 'Play the physical intensity card'),
        effects: { physique: 2, risqueBlessure: 6, reputation: 3 },
      },
      {
        label: tt("Jouer la carte de l'intelligence tactique", 'Play the tactical smarts card'),
        effects: { iqBasket: 4, reputation: 2 },
      },
      {
        label: tt('Chercher le duel individuel avec {rival}', 'Seek the individual duel with {rival}'),
        effects: { mental: 2, popularite: 3 },
        successChance: { baseChance: 0.5, statBonus: { technique: 0.01 }, onSuccess: { reputation: 6, popularite: 4 }, onFailure: { moral: -3 } },
      },
    ],
    weight: 2,
    tags: ['rivalDuel'],
  },
  {
    id: 'match-clameur-ville-rivale',
    category: 'match',
    title: tt('Sur la route de Chicago Bison', 'On the road at Chicago Bison'),
    description: tt(
      "La salle entière te hue avant même le coup d'envoi. Toute une ville s'est donné rendez-vous pour te voir craquer ce soir.",
      "The entire building boos you before tip-off even happens. A whole city has shown up hoping to watch you crack tonight.",
    ),
    leagues: ['nba', 'gLeague'],
    minSeason: 4,
    weight: 2,
    choices: [
      {
        label: tt('Prendre le match à ton compte devant leur public', 'Take the game over in front of their crowd'),
        successChance: {
          baseChance: 0.4,
          statBonus: { technique: 0.012, mental: 0.008 },
          onSuccess: { reputation: 16, popularite: 12, moral: 10 },
          onFailure: { moral: -9, reputation: -4 },
          successText: tt(
            'Tu fais taire 20 000 personnes à toi seul. Ce soir devient un moment légendaire dans cette rivalité.',
            'You silence 20,000 people all by yourself. Tonight becomes a legendary moment in this rivalry.',
          ),
          failureText: tt(
            "La salle explose de joie à chacune de tes erreurs. Une soirée que tu voudrais oublier.",
            'The building erupts with joy at every mistake you make. A night you wish you could forget.',
          ),
        },
      },
      { label: tt('Jouer collectif pour faire taire la salle', 'Play team ball to quiet the crowd'), effects: { iqBasket: 3, relationCoequipiers: 3, mental: 2 } },
    ],
    tags: ['cityRivalry'],
  },
  {
    id: 'match-back-to-back',
    category: 'match',
    title: tt('Deuxième match en 24 heures', 'Second game in 24 hours'),
    description: tt(
      "Les jambes sont lourdes après le déplacement de la veille, mais {opponent} arrive au complet et reposé.",
      "Your legs feel heavy after yesterday's road trip, but {opponent} arrives at full strength, well rested.",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    choices: [
      {
        label: tt('Puiser dans les réserves', 'Dig into the reserves'),
        effects: { forme: -6, mental: 3, reputation: 2 },
      },
      {
        label: tt('Gérer son effort', 'Manage your effort'),
        effects: { forme: -2, iqBasket: 2 },
      },
      {
        label: tt('Demander une rotation plus courte au coach', 'Ask the coach for a shorter rotation'),
        effects: { relationCoach: -1, forme: 2, tempsDeJeu: -3 },
      },
    ],
  },
  {
    id: 'match-chasse-record',
    category: 'match',
    leagues: ['nba', 'gLeague', 'europe'],
    title: tt('Une soirée historique face à {opponent}', 'A historic night against {opponent}'),
    description: tt(
      "Tout rentre depuis le début du match. À la mi-temps, tu réalises que le record de la ligue — 14 tirs à 3-points inscrits en un seul match — n'est plus si loin. Comment abordes-tu la seconde mi-temps ?",
      "Everything is falling since tip-off. At halftime, you realize the league record — 14 made threes in a single game — isn't that far off. How do you play the second half?",
    ),
    slots: [{ key: 'opponent', pool: opponents, leaguesForValue: leaguesForOpponent }],
    minSeason: 2,
    requirements: [{ stat: 'reputation', min: 40 }],
    weight: 1,
    choices: [
      {
        label: tt('Foncer vers le record, tir après tir', 'Chase the record, shot after shot'),
        // A league record has to stay a genuinely rare success, even for an elite build — capped
        // low enough that a maxed-out sharpshooter still fails to break it most of the time.
        successChance: {
          baseChance: 0.08,
          statBonus: { technique: 0.01, mental: 0.005 },
          onSuccess: { reputation: 6, popularite: 6, moral: 4 },
          onFailure: { moral: -3, forme: -2 },
          successText: tt(
            'Le ballon rentre encore et encore. 14 tirs à 3-points inscrits : un nouveau record de la ligue ! La salle est debout.',
            'The ball keeps falling. 14 threes made — a new league record! The whole arena is on its feet.',
          ),
          failureText: tt(
            "Le rythme retombe après un début de match électrique. Le record résiste, cette fois.",
            'The rhythm fades after a red-hot start. The record holds, this time.',
          ),
        },
      },
      {
        label: tt('Enchaîner les step-backs à 3-points', 'String together step-back threes'),
        successChance: {
          baseChance: 0.42,
          statBonus: { technique: 0.015, mental: 0.01 },
          onSuccess: { reputation: 4, popularite: 3 },
          onFailure: { moral: -2 },
          successText: tt(
            "Le step-back devient injouable ce soir — une master class d'adresse.",
            'The step-back is unguardable tonight — a clinic in shot-making.',
          ),
          failureText: tt('Les step-backs finissent par se dérégler sur la fin de match.', 'The step-backs lose their rhythm late in the game.'),
        },
      },
      {
        label: tt('Attaquer le cercle à chaque possession', 'Attack the rim on every possession'),
        successChance: {
          baseChance: 0.48,
          statBonus: { physique: 0.016 },
          onSuccess: { reputation: 3, tempsDeJeu: 2 },
          onFailure: { forme: -3 },
          successText: tt('Tu punis la peinture toute la soirée, aucune défense ne tient.', 'You punish the paint all night — no defense can hold up.'),
          failureText: tt('La défense adverse resserre le cercle et finit par te ralentir.', "The defense collapses on the rim and eventually slows you down."),
        },
      },
      {
        label: tt('Faire jouer le collectif plutôt que chercher le record', 'Get everyone involved instead of chasing the record'),
        effects: { relationCoequipiers: 3, iqBasket: 2, popularite: 1 },
      },
    ],
  },
];
