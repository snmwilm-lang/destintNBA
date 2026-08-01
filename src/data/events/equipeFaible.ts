import { tt, type EventTemplate } from '../../engine/eventTemplate';

// Reached exclusively through forcedMilestone (see BAD_TEAM_EVENT_ID in careerEngine.ts), gated
// on career.currentTeam.ambition rather than a player stat — never drawn from the normal pool.
export const equipeFaibleEvents: EventTemplate[] = [
  {
    id: 'equipe-reconstruction-role',
    category: 'match',
    title: tt('Une équipe en reconstruction', 'A team in rebuilding mode'),
    description: tt(
      "Le vestiaire ne s'en cache pas : cette saison est perdue d'avance pour la franchise. Le staff attend de toi que tu trouves ta place dans ce contexte-là — reste à savoir laquelle.",
      "The locker room doesn't hide it: this season is a lost cause for the franchise. The staff is waiting to see what role you'll carve out in it — the only question is which one.",
    ),
    leagues: ['nba', 'gLeague', 'europe'],
    weight: 1,
    choices: [
      {
        label: tt('Prendre le jeu à ton compte et essayer de porter l\'équipe', 'Take the game on your shoulders and try to carry the team'),
        actionStyle: 'scoring',
        successChance: {
          baseChance: 0.4,
          statBonus: { technique: 0.01, mental: 0.008 },
          onSuccess: {
            reputation: 8,
            popularite: 6,
            moral: 4,
            relationCoequipiers: 2,
          },
          onFailure: {
            forme: -8,
            moral: -6,
            relationCoequipiers: -4,
            risqueBlessure: 4,
          },
          successText: tt(
            "Match après match, tu forces le jeu et ça paye : tu deviens la vraie raison de regarder cette équipe, même dans une saison sans enjeu.",
            'Game after game, you force the issue and it pays off: you become the actual reason to watch this team, even in a season with nothing on the line.',
          ),
          failureText: tt(
            "Tu prends trop sur toi, le collectif s'en ressent et les résultats ne suivent pas. Un pari qui ne paye pas cette fois-ci.",
            "You take on too much, the team chemistry suffers, and the results never come. A gamble that doesn't pay off this time.",
          ),
        },
      },
      {
        label: tt('Accepter la reconstruction et jouer pour progresser', 'Accept the rebuild and play for your own development'),
        effects: { potentiel: 2, mental: 2, relationCoequipiers: 2, reputation: 1, forme: 2 },
        resultText: tt(
          "Tu ne te bats pas contre l'évidence : cette saison, c'est du travail de fond, sans pression du résultat. Pas glorieux, mais sain.",
          "You don't fight the obvious: this season is about the groundwork, with no pressure on the results. Not glamorous, but healthy.",
        ),
      },
    ],
  },
];
