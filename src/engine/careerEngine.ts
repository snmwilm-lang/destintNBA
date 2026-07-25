import type {
  Archetype,
  Career,
  CareerEnding,
  EventCategory,
  GameEvent,
  InjuryKey,
  InjuryRecord,
  League,
  LocalizedText,
  PlayerStats,
  Position,
  SeasonResult,
  SeasonStatLine,
  StatKey,
  Team,
  Trophy,
} from '../types';
import { allEvents } from '../data/events';
import { HIGH_SCHOOL_TEAM_POOL, NBA_TEAM_POOL, EUROPE_TEAM_POOL, allTeamsForLeague } from '../data/teams';
import { getBuild } from '../data/builds';
import { RIVAL_PLAYERS } from '../data/names';
import { applyEffects, clampStat, initialStats, randFloat, randInt, weightedPick } from './statUtils';
import { generatePressArticles } from './pressGenerator';
import { tt } from './eventTemplate';

export const EVENTS_PER_SEASON = 7;

const POSITION_PROFILE: Record<Position, { score: number; rebound: number; pass: number; steal: number; block: number }> = {
  PG: { score: 0.85, rebound: 0.25, pass: 1.0, steal: 1.1, block: 0.15 },
  SG: { score: 1.0, rebound: 0.3, pass: 0.5, steal: 0.9, block: 0.2 },
  SF: { score: 0.95, rebound: 0.5, pass: 0.4, steal: 0.8, block: 0.4 },
  PF: { score: 0.85, rebound: 0.8, pass: 0.3, steal: 0.6, block: 0.75 },
  C: { score: 0.75, rebound: 1.0, pass: 0.25, steal: 0.4, block: 1.0 },
};

/** Realistic height range (cm) the player can pick from at creation, per position. */
export const POSITION_HEIGHT_RANGE: Record<Position, [number, number]> = {
  PG: [178, 193],
  SG: [185, 201],
  SF: [198, 206],
  PF: [203, 211],
  C: [208, 218],
};

export function defaultHeightForPosition(position: Position): number {
  const [min, max] = POSITION_HEIGHT_RANGE[position];
  return Math.round((min + max) / 2);
}

/** -1 (shortest for the position) .. +1 (tallest for the position), 0 = average. */
export function heightTilt(position: Position, height: number): number {
  const [min, max] = POSITION_HEIGHT_RANGE[position];
  const mid = (min + max) / 2;
  const half = (max - min) / 2 || 1;
  return Math.max(-1, Math.min(1, (height - mid) / half));
}


function eventMap(): Map<string, GameEvent> {
  const map = new Map<string, GameEvent>();
  for (const e of allEvents) map.set(e.id, e);
  return map;
}

const EVENT_MAP = eventMap();

export function getEvent(id: string): GameEvent | undefined {
  return EVENT_MAP.get(id);
}

/** Swaps whichever generic rival name a "rivalDuel"-tagged card was generated with for this
 * career's own pinned rival, so the same named opponent keeps showing up across seasons. */
export function pinRivalName(event: GameEvent, rivalName: string): GameEvent {
  if (!event.tags?.includes('rivalDuel')) return event;
  const swap = (text: LocalizedText): LocalizedText => {
    let fr = text.fr;
    let en = text.en;
    for (const name of RIVAL_PLAYERS) {
      if (name === rivalName) continue;
      if (fr.includes(name)) fr = fr.split(name).join(rivalName);
      if (en.includes(name)) en = en.split(name).join(rivalName);
    }
    return { fr, en };
  };
  return {
    ...event,
    title: swap(event.title),
    description: swap(event.description),
    choices: event.choices.map((c) => ({
      ...c,
      label: swap(c.label),
      resultText: c.resultText ? swap(c.resultText) : undefined,
      successChance: c.successChance
        ? {
            ...c.successChance,
            successText: c.successChance.successText ? swap(c.successChance.successText) : undefined,
            failureText: c.successChance.failureText ? swap(c.successChance.failureText) : undefined,
          }
        : undefined,
    })),
  };
}

function leagueForAge(age: number, currentLeague: League, hasBeenDrafted: boolean): League {
  if (currentLeague !== 'lycee') return currentLeague;
  // Stay in high school until the player has actually lived through draft night.
  if (age >= 18 && hasBeenDrafted) return 'nba';
  return 'lycee';
}

export type CareerPath = 'full' | 'skipToNba';

export function createNewCareer(
  id: string,
  playerName: string,
  archetype: Archetype,
  position: Position,
  path: CareerPath = 'full',
  height: number = defaultHeightForPosition(position),
  bonusSkillPoints = 0,
): Career {
  const now = Date.now();
  const skip = path === 'skipToNba';
  const startingTeam = skip
    ? NBA_TEAM_POOL[randInt(0, NBA_TEAM_POOL.length - 1)]
    : HIGH_SCHOOL_TEAM_POOL[randInt(0, HIGH_SCHOOL_TEAM_POOL.length - 1)];
  let stats = initialStats(getBuild(archetype)?.boosts ?? {});
  // Taller-than-average builds lean into strength and rim protection at the cost of
  // some quickness/ball-handling touch; shorter builds trade the other way.
  const tilt = heightTilt(position, height);
  stats = applyEffects(stats, {
    physique: Math.round(tilt * 6),
    technique: Math.round(-tilt * 4),
    risqueBlessure: Math.round(Math.max(0, tilt) * 4),
  });
  // Going straight to the pros skips the high-school grind, so the prospect
  // arrives already NBA-caliber — but without the seasons of choices that
  // would normally have shaped (and potentially refined) those stats.
  if (skip) {
    stats = applyEffects(stats, {
      technique: 20,
      physique: 15,
      mental: 10,
      iqBasket: 10,
      reputation: 30,
      popularite: 25,
      tempsDeJeu: 15,
    });
  }
  const age = skip ? 19 : 15;
  const career: Career = {
    id,
    createdAt: now,
    updatedAt: now,
    playerName,
    age,
    archetype,
    position,
    height,
    specialty: getBuild(archetype)?.name ?? null,
    skillPoints: bonusSkillPoints,
    rivalName: RIVAL_PLAYERS[randInt(0, RIVAL_PLAYERS.length - 1)],
    rivalRecord: { wins: 0, losses: 0 },
    newlyUnlockedAchievements: [],
    season: 1,
    eventInSeasonIndex: 0,
    eventsPerSeason: EVENTS_PER_SEASON,
    stats,
    argent: skip ? 50000 : 200,
    valeurMarchande: computeMarketValue(stats, age, skip ? 'nba' : 'lycee'),
    currentTeam: startingTeam,
    history: [],
    trophies: [],
    pressArticles: [],
    seenEventIds: skip ? [...DRAFT_SEQUENCE] : [],
    usedThisSeasonIds: [],
    recentEventIds: [],
    pendingDelayed: [],
    choiceLog: [],
    retired: false,
    ending: null,
    phase: 'event',
    currentEventId: null,
    lastChoiceResultText: null,
    lastChoiceStatDeltas: null,
    lastChoiceMoneyDelta: 0,
    lastChoiceWasSuccess: null,
    lastSeasonResult: null,
    pendingTransferOffers: null,
  };
  career.currentEventId = pickNextEvent(career)?.id ?? null;
  return career;
}

// Olympics and the World Cup are once-every-four-years events, offset from each other like in
// real international calendars — not something that can come up every single season.
const QUADRENNIAL_CYCLE: Partial<Record<EventCategory, number>> = {
  jeuxOlympiques: 0,
  coupeDuMonde: 2,
};

function meetsRequirements(event: GameEvent, career: Career): boolean {
  if (event.minAge !== undefined && career.age < event.minAge) return false;
  if (event.maxAge !== undefined && career.age > event.maxAge) return false;
  if (event.minSeason !== undefined && career.season < event.minSeason) return false;
  if (event.maxSeason !== undefined && career.season > event.maxSeason) return false;
  if (event.leagues && !event.leagues.includes(career.currentTeam.league)) return false;
  if (event.unique && career.seenEventIds.includes(event.id)) return false;
  if (career.usedThisSeasonIds.includes(event.id)) return false;
  const cycleOffset = QUADRENNIAL_CYCLE[event.category];
  if (cycleOffset !== undefined && career.season % 4 !== cycleOffset) return false;
  if (event.requirements) {
    for (const req of event.requirements) {
      const val = career.stats[req.stat];
      if (req.min !== undefined && val < req.min) return false;
      if (req.max !== undefined && val > req.max) return false;
    }
  }
  return true;
}

/** The draft is a scripted three-beat sequence, not a random draw — force it in order once eligible. */
const DRAFT_SEQUENCE = ['draft-declaration', 'draft-combine', 'draft-soiree'];

const FINALE_EVENT_ID = 'finale-moment-decisif';
const FINALE_PREQUEL_EVENT_ID = 'finale-prequel-timeout';

export function seasonsPlayedInLeague(career: Career, league: League): number {
  return career.history.filter((h) => h.league === league).length;
}

function forcedMilestone(career: Career): GameEvent | null {
  if (career.age >= 18 && career.currentTeam.league === 'lycee') {
    for (const id of DRAFT_SEQUENCE) {
      if (!career.seenEventIds.includes(id) && !career.usedThisSeasonIds.includes(id)) {
        return getEvent(id) ?? null;
      }
    }
  }
  // The career-defining Finals moment is otherwise a rare random draw — guarantee it shows up
  // as a season closer by year 3 in the league if luck hasn't brought it up already. It's staged
  // as a two-part moment: this timeout beat chains straight into the actual shot.
  if (
    career.currentTeam.league === 'nba' &&
    !career.seenEventIds.includes(FINALE_EVENT_ID) &&
    !career.usedThisSeasonIds.includes(FINALE_EVENT_ID) &&
    !career.seenEventIds.includes(FINALE_PREQUEL_EVENT_ID) &&
    !career.usedThisSeasonIds.includes(FINALE_PREQUEL_EVENT_ID) &&
    seasonsPlayedInLeague(career, 'nba') >= 2 &&
    career.eventInSeasonIndex === career.eventsPerSeason - 1
  ) {
    return getEvent(FINALE_PREQUEL_EVENT_ID) ?? null;
  }
  return null;
}

/** Categories that should feel more present once the stakes (and the awards race) are real. */
const BIG_MOMENT_CATEGORIES: EventCategory[] = ['allStar', 'playoffs', 'selectionNationale', 'finale', 'jeuxOlympiques', 'coupeDuMonde'];

/** Strips the numeric variant suffix so all name-swapped instances of a card share one id. */
export function baseEventId(id: string): string {
  return id.replace(/-\d+$/, '');
}

function eventWeight(event: GameEvent, career: Career): number {
  let weight = event.weight ?? 1;
  if (career.currentTeam.league === 'nba' && BIG_MOMENT_CATEGORIES.includes(event.category)) {
    weight *= 6;
  }
  // Same beat came up recently (even with a different name plugged in) — let the pool breathe.
  const recencyIndex = career.recentEventIds.lastIndexOf(baseEventId(event.id));
  if (recencyIndex !== -1) {
    const stepsAgo = career.recentEventIds.length - recencyIndex;
    const recencyPenalty = Math.min(0.95, 1 / (stepsAgo + 1));
    weight *= 1 - recencyPenalty;
  }
  return Math.max(0.01, weight);
}

export function pickNextEvent(career: Career): GameEvent | null {
  const forced = forcedMilestone(career);
  if (forced) return forced;
  const candidates = allEvents.filter((e) => meetsRequirements(e, career));
  if (candidates.length === 0) {
    // fall back: allow season repeats if the pool is exhausted, but never re-show unique events
    const fallback = allEvents.filter((e) => !e.unique || !career.seenEventIds.includes(e.id));
    return weightedPick(fallback, (e) => eventWeight(e, career));
  }
  return weightedPick(candidates, (e) => eventWeight(e, career));
}

export interface ChoiceOutcome {
  stats: PlayerStats;
  argent: number;
  resultText: { fr: string; en: string } | null;
  wasSuccess: boolean | null;
  /** Immediate, visible stat impact — excludes hidden delayed effects on purpose. */
  statDeltas: Partial<Record<StatKey, number>>;
  moneyDelta: number;
}

function diffStats(before: PlayerStats, after: PlayerStats): Partial<Record<StatKey, number>> {
  const deltas: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(after) as StatKey[]) {
    const delta = after[key] - before[key];
    if (delta !== 0) deltas[key] = delta;
  }
  return deltas;
}

export function resolveChoice(career: Career, event: GameEvent, choiceId: string): ChoiceOutcome {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { stats: career.stats, argent: career.argent, resultText: null, wasSuccess: null, statDeltas: {}, moneyDelta: 0 };
  }
  let stats = applyEffects(career.stats, choice.effects);
  let argent = career.argent + (choice.moneyDelta ?? 0);
  let resultText = choice.resultText ?? null;
  let wasSuccess: boolean | null = null;

  if (choice.successChance) {
    const sc = choice.successChance;
    let chance = sc.baseChance;
    if (sc.statBonus) {
      for (const key of Object.keys(sc.statBonus) as StatKey[]) {
        const weight = sc.statBonus[key] ?? 0;
        chance += (career.stats[key] - 50) * weight;
      }
    }
    chance = Math.max(0.05, Math.min(0.95, chance));
    wasSuccess = Math.random() < chance;
    stats = applyEffects(stats, wasSuccess ? sc.onSuccess : sc.onFailure);
    resultText = (wasSuccess ? sc.successText : sc.failureText) ?? resultText;
  }

  return { stats, argent, resultText, wasSuccess, statDeltas: diffStats(career.stats, stats), moneyDelta: argent - career.argent };
}

// --- Season progression -----------------------------------------------

function ageGrowthFactor(age: number): number {
  if (age <= 20) return 1.3;
  if (age <= 24) return 1.0;
  if (age <= 28) return 0.6;
  if (age <= 32) return 0.1;
  return -0.6;
}

function growTowardPotential(current: number, potentiel: number, driver: number, age: number): number {
  const factor = ageGrowthFactor(age);
  const headroom = potentiel - current;
  const growth = factor * driver * Math.max(0, headroom) * 0.02;
  const decay = factor < 0 ? factor * 1.5 : 0;
  return clampStat(current + growth + decay);
}

function progressStats(career: Career): PlayerStats {
  const s = { ...career.stats };
  const driver = (s.tempsDeJeu * 0.5 + s.relationCoach * 0.3 + s.forme * 0.2) / 100;
  s.technique = growTowardPotential(s.technique, s.potentiel, driver, career.age);
  s.physique = growTowardPotential(s.physique, Math.min(100, s.potentiel + 10), driver, career.age);
  s.iqBasket = growTowardPotential(s.iqBasket, s.potentiel, driver * 0.9 + 0.1, career.age);
  s.mental = clampStat(s.mental + (career.age <= 26 ? 1 : 0));
  s.forme = clampStat(s.forme + (100 - s.forme) * 0.15);
  s.moral = clampStat(s.moral + (60 - s.moral) * 0.1);
  // A coach can only ignore genuine quality for so long — minutes drift toward what the
  // player's actual level (plus standing with the coach) justifies, not just past choices.
  const skillComposite = (s.technique + s.physique + s.mental + s.iqBasket) / 4;
  const minutesTarget = Math.min(97, skillComposite * 0.9 + s.reputation * 0.25 + s.relationCoach * 0.15);
  s.tempsDeJeu = clampStat(s.tempsDeJeu + (minutesTarget - s.tempsDeJeu) * 0.3);
  return s;
}

function rollInjuries(career: Career, statsAfterProgress: PlayerStats): { blessures: InjuryRecord[]; matchesMissed: number; statsAfter: PlayerStats } {
  const blessures: InjuryRecord[] = [];
  let matchesMissed = 0;
  let stats = statsAfterProgress;
  const injuryChance = statsAfterProgress.risqueBlessure / 260; // ~0-38% per season
  const keys: InjuryKey[] = ['cheville', 'genou', 'dos', 'ischio', 'epaule', 'poignet'];
  let rolls = Math.random() < injuryChance ? 1 : 0;
  if (Math.random() < injuryChance * 0.3) rolls += 1;
  for (let i = 0; i < rolls; i++) {
    const key = keys[randInt(0, keys.length - 1)];
    const weeksOut = randInt(1, key === 'genou' ? 20 : 8);
    blessures.push({ key, weeksOut, season: career.season });
    matchesMissed += Math.round(weeksOut * 1.6);
    stats = applyEffects(stats, { forme: -Math.min(20, weeksOut), risqueBlessure: -8 });
  }
  return { blessures, matchesMissed, statsAfter: stats };
}

function scheduledGames(league: League): number {
  if (league === 'lycee') return 26;
  if (league === 'europe') return 34;
  return 74;
}

function maxMinutes(league: League): number {
  if (league === 'lycee') return 26;
  if (league === 'europe') return 32;
  return 34;
}

function generateStatLine(career: Career, stats: PlayerStats, matchesMissed: number): SeasonStatLine {
  const league = career.currentTeam.league;
  const profile = POSITION_PROFILE[career.position];
  const tilt = heightTilt(career.position, career.height);
  const total = scheduledGames(league);
  const matchs = Math.max(0, total - matchesMissed);
  const minutesFactor = stats.tempsDeJeu / 100;
  const minutes = 6 + minutesFactor * (maxMinutes(league) - 6);

  // forme/moral are what a season's worth of choices moves the most directly — let them swing
  // the actual output on top of the slower-building core skills, not just sit there unused.
  const formFactor = 0.82 + (stats.forme / 100) * 0.36;
  const moralFactor = 0.88 + (stats.moral / 100) * 0.24;
  const choiceFactor = formFactor * moralFactor;

  const scoringSkill = (stats.technique * 0.6 + stats.iqBasket * 0.2 + stats.physique * 0.2) / 100;
  let points = scoringSkill * minutes * profile.score * randFloat(0.85, 1.15) * 1.45 * choiceFactor;
  // A rare career-year bump — this is a SEASON average, so it stays modest even when it lands,
  // rather than the wild multiplier a single highlight game could get away with.
  if (Math.random() < 0.04) points *= randFloat(1.05, 1.18);

  const reboundSkill = (stats.physique * 0.7 + stats.iqBasket * 0.3) / 100;
  const rebonds = reboundSkill * minutes * profile.rebound * (1 + tilt * 0.35) * randFloat(0.85, 1.15) * 0.45 * choiceFactor;

  const passSkill = (stats.iqBasket * 0.6 + stats.technique * 0.2 + stats.mental * 0.2) / 100;
  const passes = passSkill * minutes * profile.pass * (1 - tilt * 0.25) * randFloat(0.85, 1.15) * 0.4 * choiceFactor;

  const stealSkill = (stats.iqBasket * 0.5 + stats.physique * 0.3 + stats.mental * 0.2) / 100;
  const interceptions = stealSkill * minutes * profile.steal * (1 - tilt * 0.15) * randFloat(0.8, 1.2) * 0.08 * choiceFactor;

  const blockSkill = (stats.physique * 0.6 + stats.iqBasket * 0.4) / 100;
  const contres = blockSkill * minutes * profile.block * (1 + tilt * 0.35) * randFloat(0.8, 1.2) * 0.12 * choiceFactor;

  const adresse3pts = Math.max(15, Math.min(52, 24 + stats.technique * 0.32 - stats.physique * 0.04 + (choiceFactor - 1) * 20 + randFloat(-3, 3)));

  const composite = (stats.technique + stats.physique + stats.mental + stats.iqBasket) / 4;
  const noteMoyenne = Math.max(
    2,
    Math.min(10, 3.2 + (composite / 100) * 5.5 + (minutes / maxMinutes(league)) * 1.3 + (choiceFactor - 1) * 4 + randFloat(-0.4, 0.4)),
  );

  return {
    matchs,
    points: Math.round(points * 10) / 10,
    rebonds: Math.round(rebonds * 10) / 10,
    passes: Math.round(passes * 10) / 10,
    interceptions: Math.round(interceptions * 10) / 10,
    contres: Math.round(contres * 10) / 10,
    adresse3pts: Math.round(adresse3pts * 10) / 10,
    noteMoyenne: Math.round(noteMoyenne * 10) / 10,
  };
}

/** Contract scale per league, loosely mirroring real-world pay bands (min .. supermax-ish ceiling). */
const CONTRACT_SCALE: Record<League, { min: number; max: number }> = {
  lycee: { min: 0, max: 0 },
  ncaa: { min: 0, max: 0 },
  europe: { min: 150_000, max: 8_000_000 },
  nba: { min: 1_200_000, max: 55_000_000 },
  gLeague: { min: 40_000, max: 600_000 },
};

export function computeMarketValue(stats: PlayerStats, age: number, league: League): number {
  const composite =
    stats.technique * 0.25 +
    stats.physique * 0.15 +
    stats.mental * 0.1 +
    stats.iqBasket * 0.2 +
    stats.reputation * 0.15 +
    stats.popularite * 0.1 +
    stats.potentiel * 0.05;
  const ageMultiplier = age <= 24 ? 1.15 : age <= 29 ? 1.0 : age <= 33 ? 0.7 : 0.4;

  if (league === 'lycee') {
    // High schoolers aren't paid — this is just recruiting buzz, kept on a small scale.
    return Math.round(composite * 9 * ageMultiplier);
  }
  const { min, max } = CONTRACT_SCALE[league];
  const value01 = Math.max(0, Math.min(1.1, (composite / 100) * ageMultiplier));
  return Math.round(min + Math.min(1, value01) * (max - min));
}

function computeClassement(career: Career, noteMoyenne: number): { rank: number; total: number } {
  const total = career.currentTeam.league === 'nba' ? NBA_TEAM_POOL.length : career.currentTeam.league === 'europe' ? EUROPE_TEAM_POOL.length : HIGH_SCHOOL_TEAM_POOL.length;
  const teamStrength = (career.currentTeam.ambition + career.currentTeam.coachQuality) / 2;
  const playerContribution = noteMoyenne * 6 + career.stats.reputation * 0.2;
  const score = teamStrength * 0.5 + playerContribution * 0.5 + randFloat(-15, 15);
  const rank = Math.max(1, Math.min(total, Math.round(total - (score / 100) * (total - 1))));
  return { rank, total };
}

function generateTrophies(career: Career, statLine: SeasonStatLine, rank: number): Trophy[] {
  const trophies: Trophy[] = [];
  const idBase = `trophy-s${career.season}`;
  const league = career.currentTeam.league;
  const isFirstProSeason = league !== 'lycee' && !career.history.some((h) => h.league === league);

  if (rank === 1) {
    const champLabel =
      league === 'nba' ? tt('Champion NBA', 'NBA Champion') : league === 'europe' ? tt("Champion d'Europe", 'European Champion') : tt('Champion', 'Champion');
    trophies.push({
      id: `${idBase}-champion`,
      season: career.season,
      name: champLabel,
      description: tt(
        `${career.currentTeam.name} termine 1er de la ligue cette saison.`,
        `${career.currentTeam.name} finish 1st in the league this season.`,
      ),
    });
  }
  if (statLine.noteMoyenne >= 8.7) {
    trophies.push({
      id: `${idBase}-mvp`,
      season: career.season,
      name: tt('MVP', 'MVP'),
      description: tt(
        `Une note moyenne de ${statLine.noteMoyenne}/10 qui impose le respect.`,
        `A ${statLine.noteMoyenne}/10 average rating that commands respect.`,
      ),
    });
  } else if (isFirstProSeason && statLine.noteMoyenne >= 6.5) {
    trophies.push({
      id: `${idBase}-royo`,
      season: career.season,
      name: tt("Recrue de l'année", 'Rookie of the Year'),
      description: tt(
        'Une première saison professionnelle qui ne passe pas inaperçue.',
        'A rookie season that did not go unnoticed.',
      ),
    });
  }
  if (statLine.points >= 30) {
    trophies.push({
      id: `${idBase}-scoring`,
      season: career.season,
      name: tt('Meilleur marqueur de la ligue', 'Scoring Champion'),
      description: tt(
        `${statLine.points} points de moyenne sur la saison.`,
        `${statLine.points} points per game this season.`,
      ),
    });
  }
  if (statLine.contres >= 2.4) {
    trophies.push({
      id: `${idBase}-defense`,
      season: career.season,
      name: tt("Défenseur de l'année", 'Defensive Player of the Year'),
      description: tt('Un mur infranchissable près du cercle.', 'An impenetrable wall near the rim.'),
    });
  }
  if (statLine.passes >= 9) {
    trophies.push({
      id: `${idBase}-assists`,
      season: career.season,
      name: tt('Meilleur passeur de la ligue', 'Assists Champion'),
      description: tt(
        `${statLine.passes} passes décisives de moyenne sur la saison.`,
        `${statLine.passes} assists per game this season.`,
      ),
    });
  }
  if (career.stats.popularite >= 92) {
    trophies.push({
      id: `${idBase}-fan`,
      season: career.season,
      name: tt('Idole des supporters', 'Fan Favorite'),
      description: tt('Le public ne jure plus que par toi.', 'The crowd can\'t get enough of you.'),
    });
  }
  return trophies;
}

export function generateTransferOffers(career: Career): Team[] {
  const leaguePools = career.currentTeam.league === 'lycee' ? [...NBA_TEAM_POOL] : [...NBA_TEAM_POOL, ...EUROPE_TEAM_POOL];
  const scale = CONTRACT_SCALE[career.currentTeam.league];
  const normalizedValue = scale.max > scale.min ? ((career.valeurMarchande - scale.min) / (scale.max - scale.min)) * 100 : 50;
  const sorted = leaguePools
    .filter((t) => t.id !== career.currentTeam.id)
    .sort((a, b) => Math.abs(a.salaryBudget - normalizedValue) - Math.abs(b.salaryBudget - normalizedValue));
  const count = career.currentTeam.league === 'lycee' ? 3 : 2 + randInt(0, 2);
  const offers: Team[] = [];
  const shuffled = sorted.sort(() => Math.random() - 0.5);
  for (const team of shuffled) {
    if (offers.length >= count) break;
    offers.push(team);
  }
  return offers;
}

// Real rookie-scale contracts are set by years of service, not by projected value — a
// can't-miss rookie still gets paid off this ladder, not a veteran max.
const NBA_ROOKIE_SCALE = [1_200_000, 2_200_000, 3_400_000, 5_000_000];

export function estimateSalary(valeurMarchande: number, team: Team, nbaServiceYears?: number): number {
  if (team.league === 'nba' && nbaServiceYears !== undefined && nbaServiceYears < NBA_ROOKIE_SCALE.length) {
    return NBA_ROOKIE_SCALE[nbaServiceYears];
  }
  const { min: contractFloor, max: contractCeiling } = CONTRACT_SCALE[team.league];
  const raw = valeurMarchande * (0.85 + (team.salaryBudget / 100) * 0.35) * randFloat(0.92, 1.08);
  return Math.round(Math.max(contractFloor, Math.min(contractCeiling, raw)));
}

export function simulateSeason(career: Career): { career: Career; result: SeasonResult } {
  let stats = progressStats(career);
  const { blessures, matchesMissed, statsAfter } = rollInjuries(career, stats);
  stats = statsAfter;

  const statLine = generateStatLine(career, stats, matchesMissed);
  const { rank, total } = computeClassement(career, statLine.noteMoyenne);
  const trophies = generateTrophies(career, statLine, rank);
  const valeurMarchande = computeMarketValue(stats, career.age, career.currentTeam.league);
  const nbaServiceYears = career.currentTeam.league === 'nba' ? seasonsPlayedInLeague(career, 'nba') : undefined;
  const salaire = estimateSalary(valeurMarchande, career.currentTeam, nbaServiceYears);

  const pressArticles = generatePressArticles(
    {
      playerName: career.playerName,
      team: career.currentTeam.name,
      season: career.season,
      noteMoyenne: statLine.noteMoyenne,
      statLine,
      classementRank: rank,
      wonTitle: rank === 1,
    },
    `s${career.season}`,
  );

  const statDeltas: Partial<Record<StatKey, number>> = {};
  (Object.keys(stats) as StatKey[]).forEach((k) => {
    const delta = stats[k] - career.stats[k];
    if (delta !== 0) statDeltas[k] = Math.round(delta * 10) / 10;
  });

  // Training points earned this season: a baseline, plus more for a strong rating and any hardware.
  const earnedSkillPoints = 1 + Math.floor(statLine.noteMoyenne / 3) + trophies.length;

  const result: SeasonResult = {
    season: career.season,
    age: career.age,
    team: career.currentTeam.name,
    league: career.currentTeam.league,
    statLine,
    classementRank: rank,
    classementTotal: total,
    trophies,
    pressArticles,
    popularite: stats.popularite,
    salaire,
    valeurMarchande,
    statDeltas,
    blessures,
    transferOffers: [],
    skillPointsEarned: earnedSkillPoints,
  };

  const updatedCareer: Career = {
    ...career,
    stats,
    valeurMarchande,
    argent: career.argent + salaire,
    skillPoints: career.skillPoints + earnedSkillPoints,
    trophies: [...career.trophies, ...trophies],
    pressArticles: [...career.pressArticles, ...pressArticles],
    history: [...career.history, result],
    lastSeasonResult: result,
  };

  return { career: updatedCareer, result };
}

export type CareerTier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface CareerSheet {
  totalGames: number;
  totalPoints: number;
  totalRebounds: number;
  totalPasses: number;
  careerAvgRating: number;
  peakValeurMarchande: number;
  trophies: Trophy[];
  score: number;
  tier: CareerTier;
  legacyTitle: LocalizedText;
  narrative: LocalizedText;
}

const TIER_NOUN: Record<CareerTier, LocalizedText> = {
  S: { fr: 'Légende', en: 'Legend' },
  A: { fr: 'Grand nom', en: 'Big name' },
  B: { fr: 'Valeur sûre', en: 'Steady hand' },
  C: { fr: 'Second rôle', en: 'Bit player' },
  D: { fr: 'Souvenir vite oublié', en: 'Forgotten name' },
};

function craftLegacyTitle(career: Career, tier: CareerTier): LocalizedText {
  const style = career.specialty ?? getBuild(career.archetype)?.name ?? { fr: 'Joueur', en: 'Player' };
  const tierNoun = TIER_NOUN[tier];
  const city = career.currentTeam.city;
  return {
    fr: `${style.fr} — ${tierNoun.fr} de ${city}`,
    en: `${style.en} — ${tierNoun.en} of ${city}`,
  };
}

const TIER_NARRATIVE: Record<CareerTier, LocalizedText> = {
  S: {
    fr: 'Une trajectoire hors normes qui restera dans les mémoires.',
    en: 'An extraordinary trajectory that will be remembered.',
  },
  A: { fr: 'Une carrière brillante, portée par un talent rare.', en: 'A brilliant career, carried by rare talent.' },
  B: { fr: 'Une carrière solide, faite de constance et de travail.', en: 'A solid career built on consistency and hard work.' },
  C: { fr: 'Une carrière discrète, loin des projecteurs.', en: 'A quiet career, far from the spotlight.' },
  D: {
    fr: 'Une carrière compliquée, plus faite de doutes que de lumière.',
    en: 'A difficult career, more shadows than spotlight.',
  },
};

function craftCareerNarrative(career: Career, tier: CareerTier): LocalizedText {
  const startedInNba = career.history[0]?.league === 'nba';
  const pathText = startedInNba
    ? { fr: 'Direct dans le grand bain, sans passer par la case lycée.', en: 'Straight into the deep end, skipping high school entirely.' }
    : { fr: 'Parti de zéro sur les playgrounds, saison après saison.', en: 'Built from scratch on the playgrounds, season after season.' };

  const tierText = TIER_NARRATIVE[tier];

  const trophyCount = career.trophies.length;
  const trophyText =
    trophyCount === 0
      ? { fr: "Aucun trophée à son actif, mais l'aventure a eu lieu.", en: 'No hardware to show for it, but the journey happened.' }
      : trophyCount <= 3
        ? { fr: 'Quelques trophées glanés en chemin.', en: 'A handful of trophies picked up along the way.' }
        : { fr: 'Une vitrine bien remplie de récompenses.', en: 'A trophy case packed with hardware.' };

  return {
    fr: `${pathText.fr} ${tierText.fr} ${trophyText.fr}`,
    en: `${pathText.en} ${tierText.en} ${trophyText.en}`,
  };
}

export function computeCareerSheet(career: Career): CareerSheet {
  const totalGames = career.history.reduce((sum, h) => sum + h.statLine.matchs, 0);
  const totalPoints = Math.round(career.history.reduce((sum, h) => sum + h.statLine.matchs * h.statLine.points, 0));
  const totalRebounds = Math.round(career.history.reduce((sum, h) => sum + h.statLine.matchs * h.statLine.rebonds, 0));
  const totalPasses = Math.round(career.history.reduce((sum, h) => sum + h.statLine.matchs * h.statLine.passes, 0));
  const careerAvgRating = career.history.length
    ? career.history.reduce((sum, h) => sum + h.statLine.noteMoyenne, 0) / career.history.length
    : 0;
  const peakValeurMarchande = career.history.reduce((max, h) => Math.max(max, h.valeurMarchande), 0);

  const score = Math.max(
    0,
    Math.min(100, Math.round(careerAvgRating * 7 + career.trophies.length * 2.5 + (peakValeurMarchande / 1_000_000) * 0.15)),
  );
  const tier: CareerTier = score >= 90 ? 'S' : score >= 75 ? 'A' : score >= 55 ? 'B' : score >= 35 ? 'C' : 'D';
  const legacyTitle = craftLegacyTitle(career, tier);
  const narrative = craftCareerNarrative(career, tier);

  return {
    totalGames,
    totalPoints,
    totalRebounds,
    totalPasses,
    careerAvgRating,
    peakValeurMarchande,
    trophies: career.trophies,
    score,
    tier,
    legacyTitle,
    narrative,
  };
}

export function checkEnding(career: Career): CareerEnding | null {
  if (career.age < 19 && career.currentTeam.league === 'lycee' && career.stats.reputation < 20 && career.season >= 4) {
    return {
      type: 'echec',
      title: tt('Rêve inachevé', 'Unfinished dream'),
      description: tt(
        "Malgré tes efforts, aucune franchise ni club professionnel ne t'a fait confiance. Le rêve NBA s'arrête ici, mais le basket reste une passion.",
        "Despite your efforts, no professional club ever took a chance on you. The NBA dream ends here, but basketball remains a passion.",
      ),
    };
  }

  const shouldRetire = career.age >= 39 || (career.age >= 34 && career.stats.forme < 25);
  if (!shouldRetire) return null;

  const totalTrophies = career.trophies.length;
  if (totalTrophies >= 8 && career.stats.reputation >= 85) {
    return {
      type: 'halloffame',
      title: tt('Hall of Fame', 'Hall of Fame'),
      description: tt(
        "Une carrière exceptionnelle qui restera gravée dans l'histoire du basket. Ton nom entre au Hall of Fame.",
        'An extraordinary career etched into basketball history. Your name enters the Hall of Fame.',
      ),
    };
  }
  if (totalTrophies >= 4 && career.stats.reputation >= 70) {
    return {
      type: 'legende',
      title: tt('Légende de la ligue', 'League legend'),
      description: tt(
        "Tu raccroches les baskets en légende, respecté par tes pairs et adoré par les fans.",
        'You hang up your sneakers as a legend, respected by your peers and adored by fans.',
      ),
    };
  }
  if (career.currentTeam.league === 'europe') {
    return {
      type: 'europe',
      title: tt('Carrière européenne accomplie', 'A fulfilled European career'),
      description: tt(
        "Ta carrière s'est épanouie en Europe, loin de la NBA mais pleine de sens.",
        'Your career flourished in Europe, far from the NBA but full of meaning.',
      ),
    };
  }
  const recentForm = career.history.slice(-3);
  const declining = recentForm.length >= 2 && recentForm[recentForm.length - 1].statLine.noteMoyenne < recentForm[0].statLine.noteMoyenne - 1;
  if (declining || career.age >= 36) {
    return {
      type: 'declin',
      title: tt('Fin de parcours en douceur', 'A gentle end of the road'),
      description: tt(
        'Les jambes ne répondent plus comme avant. Il est temps de tirer sa révérence.',
        'The legs no longer respond like they used to. Time to take a bow.',
      ),
    };
  }
  return {
    type: 'carriereHonnete',
    title: tt('Carrière honnête', 'A solid career'),
    description: tt(
      "Une carrière solide et respectable, sans être exceptionnelle. Tu peux être fier du chemin parcouru.",
      "A solid, respectable career, if not an exceptional one. You can be proud of the journey.",
    ),
  };
}

/** Stats the player can directly train up by spending earned skill points. */
export const TRAINABLE_STATS: StatKey[] = ['technique', 'physique', 'mental', 'iqBasket'];

export function spendSkillPoint(career: Career, stat: StatKey): Career {
  if (career.skillPoints <= 0 || !TRAINABLE_STATS.includes(stat)) return career;
  return {
    ...career,
    skillPoints: career.skillPoints - 1,
    stats: applyEffects(career.stats, { [stat]: 1 }),
  };
}

export function startNextSeason(career: Career): Career {
  const nextAge = career.age + 1;
  const nextLeague = leagueForAge(nextAge, career.currentTeam.league, career.seenEventIds.includes('draft-soiree'));
  let currentTeam = career.currentTeam;
  if (nextLeague !== career.currentTeam.league) {
    const pool = allTeamsForLeague(nextLeague);
    currentTeam = pool[randInt(0, pool.length - 1)];
  }
  const withDelayed = applyDueDelayedEffects({ ...career, age: nextAge, currentTeam });
  return {
    ...withDelayed,
    season: career.season + 1,
    eventInSeasonIndex: 0,
    usedThisSeasonIds: [],
    phase: 'event',
    currentEventId: pickNextEvent({ ...withDelayed, usedThisSeasonIds: [] })?.id ?? null,
    lastSeasonResult: null,
    pendingTransferOffers: null,
    updatedAt: Date.now(),
  };
}

function applyDueDelayedEffects(career: Career): Career {
  const due = career.pendingDelayed.filter((d) => d.triggerSeason <= career.season);
  const remaining = career.pendingDelayed.filter((d) => d.triggerSeason > career.season);
  let stats = career.stats;
  for (const d of due) stats = applyEffects(stats, d.effect.effects);
  return { ...career, stats, pendingDelayed: remaining };
}
