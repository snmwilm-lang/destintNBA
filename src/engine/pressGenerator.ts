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

  const pool = ctx.wonTitle
    ? titleTemplates
    : ctx.noteMoyenne >= 7
      ? positiveTemplates
      : ctx.noteMoyenne >= 5
        ? neutralTemplates
        : negativeTemplates;

  const tone = ctx.wonTitle || ctx.noteMoyenne >= 7 ? 'positif' : ctx.noteMoyenne >= 5 ? 'neutre' : 'negatif';

  const count = 1 + Math.floor(Math.random() * 2);
  const articles: PressArticle[] = [];
  for (let i = 0; i < count; i++) {
    const body = pool[Math.floor(Math.random() * pool.length)];
    const headline = ctx.wonTitle
      ? tt('{player} champion avec {team}', '{player} wins it all with {team}')
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
