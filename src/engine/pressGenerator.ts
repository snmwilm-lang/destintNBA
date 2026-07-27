import { tt } from './eventTemplate';
import type { PressArticle, SeasonStatLine } from '../types';
import { JOURNALISTS } from '../data/names';

interface PressContext {
  playerName: string;
  team: string;
  season: number;
  noteMoyenne: number;
  statLine: SeasonStatLine;
  classementRank: number;
  wonTitle: boolean;
  /** Set when the player had an MVP-caliber season but the actual vote went to someone else —
   * gives the "so close, and lost it to someone real" beat a face and a stat line instead of the
   * trophy just silently not showing up. `reason` picks the framing: a clean note-for-note edge,
   * or — once the player's own rating is already near the 10/10 ceiling and a bigger number isn't
   * a credible explanation anymore — a team-success/momentum framing instead. */
  mvpSnub?: { winnerName: string; winnerNote: number; reason: 'noteMoyenne' | 'formCollective' };
}

function fillFr(str: string, ctx: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => ctx[k] ?? `{${k}}`);
}

export function generatePressArticles(ctx: PressContext, idPrefix: string): PressArticle[] {
  const vars = {
    player: ctx.playerName,
    team: ctx.team,
    points: ctx.statLine.points.toFixed(1),
    note: ctx.noteMoyenne.toFixed(1),
    rank: String(ctx.classementRank),
    winner: ctx.mvpSnub?.winnerName ?? '',
    winnerNote: ctx.mvpSnub ? ctx.mvpSnub.winnerNote.toFixed(1) : '',
  };
  const journalist = JOURNALISTS[Math.floor(Math.random() * JOURNALISTS.length)];

  const positiveTemplates = [
    tt(
      '{player} confirme tout le bien qu\'on pensait de lui cette saison avec {team}.',
      "{player} lives up to every bit of hype this season with {team}.",
    ),
    tt(
      'Avec {points} points de moyenne, {player} s\'impose comme une valeur montante.',
      'Averaging {points} points, {player} establishes himself as a rising force.',
    ),
    tt(
      'Note moyenne de {note}/10 : {player} traverse une saison remarquable.',
      'A {note}/10 average rating: {player} is putting together a remarkable season.',
    ),
  ];
  const neutralTemplates = [
    tt(
      '{player} traverse une saison sans éclat particulier avec {team}, mais reste régulier.',
      '{player} has a fairly unremarkable season with {team}, but stays consistent.',
    ),
    tt(
      'Rien de spectaculaire pour {player} cette saison, mais les fondations sont là.',
      "Nothing spectacular for {player} this season, but the foundations are there.",
    ),
  ];
  const negativeTemplates = [
    tt(
      '{player} traverse une période compliquée, la pression commence à monter autour de {team}.',
      '{player} is going through a rough patch, and pressure is mounting around {team}.',
    ),
    tt(
      'Une saison décevante pour {player}, loin des attentes placées en lui.',
      'A disappointing season for {player}, far from the expectations placed on him.',
    ),
  ];
  const titleTemplates = [
    tt(
      '{player} et {team} sacrés ! Une saison à marquer d\'une pierre blanche.',
      '{player} and {team} crowned champions! A season to remember forever.',
    ),
  ];
  const mvpSnubTemplates = [
    tt(
      'Une saison à {note}/10, et pourtant {player} repart les mains vides : le trophée de MVP part chez {winner}, auteur d\'une saison à {winnerNote}/10.',
      'A {note}/10 season, and still {player} walks away empty-handed: the MVP trophy goes to {winner}, who posted a {winnerNote}/10 season of his own.',
    ),
    tt(
      '{player} a fait presque tout juste cette saison. Presque : {winner} ({winnerNote}/10) lui souffle le titre de MVP dans les dernières semaines.',
      '{player} did almost everything right this season. Almost: {winner} ({winnerNote}/10) steals the MVP away in the final weeks.',
    ),
  ];
  // Used once the player's own rating is already right up against the 10/10 ceiling, where "a
  // bigger number" stops being a believable reason to lose — the vote has to be explained by
  // something other than the stat line itself for the snub to still read as earned.
  const mvpSnubTightTemplates = [
    tt(
      '{note}/10 : difficile de faire mieux sur le papier, et pourtant {player} termine deuxième du vote. Les votants ont préféré {winner} ({winnerNote}/10), porté par le collectif de son équipe sur la fin de saison.',
      'A {note}/10 season — hard to top on paper — and yet {player} finishes runner-up in the vote. Voters went with {winner} ({winnerNote}/10) instead, carried by his team\'s late-season form.',
    ),
    tt(
      'Vote extrêmement serré : {player} ({note}/10) et {winner} ({winnerNote}/10) se tiennent en quelques dixièmes, mais c\'est {winner} qui repart avec le trophée, porté par un meilleur bilan collectif.',
      'An extremely tight vote: {player} ({note}/10) and {winner} ({winnerNote}/10) are separated by a few tenths, but it\'s {winner} who walks away with the trophy, backed by the stronger team record.',
    ),
  ];

  const pool = ctx.wonTitle
    ? titleTemplates
    : ctx.mvpSnub
      ? ctx.mvpSnub.reason === 'formCollective'
        ? mvpSnubTightTemplates
        : mvpSnubTemplates
      : ctx.noteMoyenne >= 7
        ? positiveTemplates
        : ctx.noteMoyenne >= 5
          ? neutralTemplates
          : negativeTemplates;

  const tone = ctx.wonTitle || ctx.noteMoyenne >= 7 ? 'positif' : ctx.mvpSnub ? 'negatif' : ctx.noteMoyenne >= 5 ? 'neutre' : 'negatif';

  const count = 1 + Math.floor(Math.random() * 2);
  const articles: PressArticle[] = [];
  for (let i = 0; i < count; i++) {
    const body = pool[Math.floor(Math.random() * pool.length)];
    const headline = ctx.wonTitle
      ? tt('{player} champion avec {team}', '{player} wins it all with {team}')
      : ctx.mvpSnub
        ? tt('{player} snobé pour le MVP', '{player} snubbed for MVP')
        : ctx.noteMoyenne >= 7
          ? tt('{player} impressionne', '{player} impresses')
          : ctx.noteMoyenne >= 5
            ? tt('{player}, saison sans relief', "{player}'s quiet season")
            : tt('{player} sous pression', '{player} under pressure');
    articles.push({
      id: `${idPrefix}-press-${i}`,
      season: ctx.season,
      tone,
      headline: { fr: fillFr(headline.fr, vars), en: fillFr(headline.en, vars) },
      body: { fr: `${journalist} — ${fillFr(body.fr, vars)}`, en: `${journalist} — ${fillFr(body.en, vars)}` },
    });
  }
  return articles;
}
