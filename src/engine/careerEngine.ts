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
import { BUILDS, buildIdentity, getBuild } from '../data/builds';
import { HIGH_SCHOOL_TEAMS, NBA_LIKE_TEAMS, RIVAL_PLAYERS } from '../data/names';
import { getNationality } from '../data/nationalities';
import { checkNewTraits } from '../data/traits';
import { applyEffects, clampStat, initialStats, randFloat, randInt, weightedPick } from './statUtils';
import { generatePressArticles } from './pressGenerator';
import { tt } from './eventTemplate';

export const EVENTS_PER_SEASON = 7;
const MIN_EVENTS_PER_SEASON = 4;
const MAX_EVENTS_PER_SEASON = EVENTS_PER_SEASON;

// A quieter season (fewer beats to click through) or a busier one — varying the pace season to
// season keeps the rhythm from feeling identical every single year, instead of always the same 7.
function randomEventsPerSeason(): number {
  return randInt(MIN_EVENTS_PER_SEASON, MAX_EVENTS_PER_SEASON);
}

// A single "general" rating players can watch move up or down after almost any choice,
// instead of only seeing the individual attribute bars shift.
const OVERALL_WEIGHTS: Partial<Record<StatKey, number>> = {
  technique: 0.28,
  physique: 0.2,
  mental: 0.18,
  iqBasket: 0.24,
  reputation: 0.1,
};

export function computeOverall(stats: PlayerStats): number {
  let total = 0;
  for (const key of Object.keys(OVERALL_WEIGHTS) as StatKey[]) {
    total += stats[key] * (OVERALL_WEIGHTS[key] ?? 0);
  }
  return Math.round(total);
}

export function computeOverallDelta(statDeltas: Partial<Record<StatKey, number>>): number {
  let total = 0;
  for (const key of Object.keys(OVERALL_WEIGHTS) as StatKey[]) {
    total += (statDeltas[key] ?? 0) * (OVERALL_WEIGHTS[key] ?? 0);
  }
  return Math.round(total * 10) / 10;
}

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

/** Swaps whichever generic placeholder from `pool` a tagged card was generated with for this
 * career's own pinned value, so the same named opponent (or rival fanbase) keeps showing up
 * across seasons instead of a different one every time. */
function pinPlaceholder(event: GameEvent, tag: string, pool: string[], pinned: string): GameEvent {
  if (!event.tags?.includes(tag)) return event;
  const swap = (text: LocalizedText): LocalizedText => {
    let fr = text.fr;
    let en = text.en;
    for (const name of pool) {
      if (name === pinned) continue;
      if (fr.includes(name)) fr = fr.split(name).join(pinned);
      if (en.includes(name)) en = en.split(name).join(pinned);
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

/** Swaps whichever generic rival name a "rivalDuel"-tagged card was generated with for this
 * career's own pinned rival, so the same named opponent keeps showing up across seasons. */
export function pinRivalName(event: GameEvent, rivalName: string): GameEvent {
  return pinPlaceholder(event, 'rivalDuel', RIVAL_PLAYERS, rivalName);
}

const RIVAL_TEAM_NAMES = NBA_LIKE_TEAMS.map((t) => t.name);

/** Same idea as pinRivalName, but for a "cityRivalry"-tagged card: an entire fanbase turned
 * against the player (a la Trae Young vs. New York), not just one named opponent. */
export function pinRivalTeam(event: GameEvent, rivalTeamName: string): GameEvent {
  return pinPlaceholder(event, 'cityRivalry', RIVAL_TEAM_NAMES, rivalTeamName);
}

/** Same idea again, but for a "schoolRivalry"-tagged card: a rival high school program, the
 * origin story that can go on to seed the career's legacy. */
export function pinRivalHighSchool(event: GameEvent, rivalHighSchool: string): GameEvent {
  return pinPlaceholder(event, 'schoolRivalry', HIGH_SCHOOL_TEAMS, rivalHighSchool);
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
  nationality: string = 'US',
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
    highSchool: skip ? null : startingTeam.name,
    draftStock: 50,
    draftPick: null,
    skillPoints: bonusSkillPoints,
    rivalName: RIVAL_PLAYERS[randInt(0, RIVAL_PLAYERS.length - 1)],
    rivalRecord: { wins: 0, losses: 0 },
    rivalTeamName: RIVAL_TEAM_NAMES[randInt(0, RIVAL_TEAM_NAMES.length - 1)],
    rivalTeamRecord: { wins: 0, losses: 0 },
    rivalryProvoked: false,
    rivalHighSchool: HIGH_SCHOOL_TEAMS.filter((s) => s !== startingTeam.name)[randInt(0, HIGH_SCHOOL_TEAMS.length - 2)],
    rivalHighSchoolRecord: { wins: 0, losses: 0 },
    nationality,
    momentum: 50,
    pendingNationalCampaign: null,
    pendingFinaleResult: null,
    hasReachedFinale: false,
    eliteBreakthroughCount: 0,
    newlyUnlockedAchievements: [],
    traits: [],
    newlyUnlockedTraits: [],
    season: 1,
    eventInSeasonIndex: 0,
    eventsPerSeason: randomEventsPerSeason(),
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

// These are the payoff of a national team selection roll — they must never surface through the
// normal random draw (that would show an elimination before the player was ever picked for the
// team), only through the forced follow-up once forcedMilestone knows the actual result.
export const NATIONAL_CAMPAIGN_RESULT_IDS = new Set([
  'jo-finale-olympique',
  'jo-elimination-demies',
  'jo-elimination-quarts',
  'jo-elimination-groupes',
  'cdm-finale-mondiale',
  'cdm-elimination-demies',
  'cdm-elimination-quarts',
  'cdm-elimination-groupes',
]);

function meetsRequirements(event: GameEvent, career: Career): boolean {
  if (NATIONAL_CAMPAIGN_RESULT_IDS.has(event.id)) return false;
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

const FINALE_PREQUEL_EVENT_ID = 'finale-prequel-timeout';
const RIVALRY_PROVOCATION_EVENT_ID = 'conflit-defi-public';
const HIGH_SCHOOL_RIVALRY_EVENT_ID = 'conflit-derby-lycee';

export type NationalCampaignRound = 'groupes' | 'quarts' | 'demies' | 'finale';

/** How far the player's national team goes this tournament — driven by the country's basketball
 * pedigree plus the player's own standing, with enough randomness that even a weak nation can
 * pull off a run and a favorite can crash out early. */
export function simulateNationalCampaign(career: Career): NationalCampaignRound {
  const strength = getNationality(career.nationality)?.strength ?? 50;
  const contribution = (career.stats.reputation * 0.5 + career.stats.mental * 0.3 + career.stats.iqBasket * 0.2) / 100;
  const score = strength * 0.7 + contribution * 100 * 0.3 + randFloat(-18, 18);
  if (score >= 78) return 'finale';
  if (score >= 60) return 'demies';
  if (score >= 40) return 'quarts';
  return 'groupes';
}

const NATIONAL_CAMPAIGN_EVENT_ID: Record<'jeuxOlympiques' | 'coupeDuMonde', Record<NationalCampaignRound, string>> = {
  jeuxOlympiques: {
    finale: 'jo-finale-olympique',
    demies: 'jo-elimination-demies',
    quarts: 'jo-elimination-quarts',
    groupes: 'jo-elimination-groupes',
  },
  coupeDuMonde: {
    finale: 'cdm-finale-mondiale',
    demies: 'cdm-elimination-demies',
    quarts: 'cdm-elimination-quarts',
    groupes: 'cdm-elimination-groupes',
  },
};

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
  // The high-school rivalry is meant to seed the whole career's legacy narrative — guarantee it's
  // lived through by the player's 2nd year of high school instead of leaving it to a near-invisible
  // random draw across a pool of well over a thousand event variants.
  if (
    career.currentTeam.league === 'lycee' &&
    career.season >= 2 &&
    !career.seenEventIds.includes(HIGH_SCHOOL_RIVALRY_EVENT_ID) &&
    !career.usedThisSeasonIds.includes(HIGH_SCHOOL_RIVALRY_EVENT_ID)
  ) {
    return getEvent(HIGH_SCHOOL_RIVALRY_EVENT_ID) ?? null;
  }
  // The first trip to the Finals is otherwise a rare random draw — guarantee it shows up as a
  // season closer by year 3 in the league if luck hasn't brought it up already. It's staged as a
  // two-part moment: this timeout beat chains straight into the actual shot. Every trip AFTER the
  // first is left to the normal (reputation-gated) draw — a great player/team can make it back
  // more than once over a career, but it's never forced again.
  if (
    career.currentTeam.league === 'nba' &&
    !career.hasReachedFinale &&
    !career.usedThisSeasonIds.includes(FINALE_PREQUEL_EVENT_ID) &&
    seasonsPlayedInLeague(career, 'nba') >= 2 &&
    career.eventInSeasonIndex === career.eventsPerSeason - 1
  ) {
    return getEvent(FINALE_PREQUEL_EVENT_ID) ?? null;
  }
  // The deliberate "start a rivalry" choice is meant to be a real, discoverable decision — not a
  // needle buried in a pool of well over a thousand event variants. Guarantee it's offered once,
  // early in the player's NBA career, instead of leaving it to a near-invisible random draw.
  if (
    career.currentTeam.league === 'nba' &&
    !career.seenEventIds.includes(RIVALRY_PROVOCATION_EVENT_ID) &&
    !career.usedThisSeasonIds.includes(RIVALRY_PROVOCATION_EVENT_ID) &&
    seasonsPlayedInLeague(career, 'nba') >= 1
  ) {
    return getEvent(RIVALRY_PROVOCATION_EVENT_ID) ?? null;
  }
  // A national team call-up rolls the tournament run once, then the matching result event
  // (the final, or an early-exit round) is guaranteed to follow — so the player always sees
  // exactly how far their country went, not just a chance of it coming up.
  if (career.pendingNationalCampaign) {
    const { competition, round } = career.pendingNationalCampaign;
    const targetId = NATIONAL_CAMPAIGN_EVENT_ID[competition][round];
    if (!career.seenEventIds.includes(targetId) && !career.usedThisSeasonIds.includes(targetId)) {
      return getEvent(targetId) ?? null;
    }
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
  // Once the player has deliberately provoked the rival fanbase, that storyline becomes a real,
  // recurring presence for the rest of the career instead of a random long-shot.
  if (career.rivalryProvoked && event.tags?.includes('cityRivalry')) {
    weight *= 14;
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
    const fallback = allEvents.filter((e) => !NATIONAL_CAMPAIGN_RESULT_IDS.has(e.id) && (!e.unique || !career.seenEventIds.includes(e.id)));
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
    let statBonusTotal = 0;
    if (sc.statBonus) {
      for (const key of Object.keys(sc.statBonus) as StatKey[]) {
        const weight = sc.statBonus[key] ?? 0;
        statBonusTotal += (career.stats[key] - 50) * weight;
      }
    }
    // A skilled player should have real odds, but never so much that the "risky" choice stops
    // being risky — even a maxed-out stat differential can only swing the base odds by so much,
    // so the harder, lower-baseChance calls (a step-back, a contested step-in three) always keep
    // a real chance of missing, no matter how good the player has become.
    statBonusTotal = Math.max(-0.3, Math.min(0.3, statBonusTotal));
    const chance = Math.max(0.05, Math.min(0.85, sc.baseChance + statBonusTotal));
    wasSuccess = Math.random() < chance;
    stats = applyEffects(stats, wasSuccess ? sc.onSuccess : sc.onFailure);
    resultText = (wasSuccess ? sc.successText : sc.failureText) ?? resultText;
  }

  // A choice can combine flat effects with a successChance branch, and each piece is already
  // capped on its own at generation time — but stacked together they could still exceed the
  // single-choice max. Clamp the final combined swing per stat here, once, as the source of truth.
  const rawDeltas = diffStats(career.stats, stats);
  const clampedDeltas: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(rawDeltas) as StatKey[]) {
    const value = rawDeltas[key] ?? 0;
    clampedDeltas[key] = Math.max(-7, Math.min(7, value));
  }
  // No single event, however flattering, can train a stat past the player's own talent ceiling —
  // that only happens through real seasons of good play (see capTrainableGrowth).
  const finalStats = capTrainableGrowth(career.stats, applyEffects(career.stats, clampedDeltas));

  return { stats: finalStats, argent, resultText, wasSuccess, statDeltas: diffStats(career.stats, finalStats), moneyDelta: argent - career.argent };
}

// --- Season progression -----------------------------------------------

function ageGrowthFactor(age: number, vintage: boolean): number {
  if (age <= 24) return 1.3;
  // The athletic prime (roughly 24-29): still developing at close to full speed, not coasting —
  // a player who reaches the league and puts the seasons in should be closing in on their real
  // ceiling by the end of it, not still stuck catching up.
  if (age <= 29) return 1.0;
  if (age <= 32) return 0.4;
  // The prime is over — from here it's real decline, unless a rare, truly elite talent defies
  // the curve for a season and still looks like a legend deep into their 30s.
  return vintage ? 0.2 : -0.6;
}

// Extremely elite, well-rounded veterans get a small, rare (~12%) chance each season past 33
// to post a "vintage" season that resists the usual age-driven decline.
function isEligibleForVintageSeason(career: Career): boolean {
  if (career.age < 33) return false;
  const composite = (career.stats.technique + career.stats.physique + career.stats.mental + career.stats.iqBasket) / 4;
  return composite >= 82 && career.stats.reputation >= 75 && career.stats.potentiel >= 85;
}

function growTowardPotential(current: number, potentiel: number, driver: number, age: number, vintage: boolean): number {
  const factor = ageGrowthFactor(age, vintage);
  const headroom = potentiel - current;
  const growth = factor * driver * Math.max(0, headroom) * 0.02;
  const decay = factor < 0 ? factor * 1.5 : 0;
  return clampStat(current + growth + decay);
}

// Technique/physique/mental/iqBasket are the four "trainable" stats that feed Overall — every
// path that can raise them (season progression, choice effects, delayed effects, trait buffs,
// skill points) must respect the same talent ceiling, or the ceiling means nothing. This caps an
// *increase* at whichever is higher: the player's value before this operation (never claws back
// stats a one-time creation boost — e.g. skip-to-NBA — already put above potentiel), or the
// current potentiel headroom (physique keeps its small +10 athletic allowance).
function capTrainableGrowth(before: PlayerStats, after: PlayerStats): PlayerStats {
  const capped = { ...after };
  const cap = after.potentiel;
  for (const key of ['technique', 'iqBasket', 'mental'] as const) {
    capped[key] = Math.min(after[key], Math.max(before[key], cap));
  }
  const physiqueCeiling = Math.max(before.physique, Math.min(100, cap + 10));
  capped.physique = Math.min(after.physique, physiqueCeiling);
  return capped;
}

function progressStats(career: Career, vintage: boolean): PlayerStats {
  const s = { ...career.stats };
  const driver = (s.tempsDeJeu * 0.5 + s.relationCoach * 0.3 + s.forme * 0.2) / 100;
  s.technique = growTowardPotential(s.technique, s.potentiel, driver, career.age, vintage);
  s.physique = growTowardPotential(s.physique, Math.min(100, s.potentiel + 10), driver, career.age, vintage);
  s.iqBasket = growTowardPotential(s.iqBasket, s.potentiel, driver * 0.9 + 0.1, career.age, vintage);
  // Mental toughness now grows the same headroom-gated way as the other trainable stats, instead
  // of a flat +1/season that used to creep to the max regardless of potentiel or how the player
  // was actually developing.
  s.mental = growTowardPotential(s.mental, s.potentiel, driver * 0.7 + 0.2, career.age, vintage);
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

function generateStatLine(career: Career, stats: PlayerStats, matchesMissed: number, vintage: boolean): SeasonStatLine {
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
  // A vintage season (see isEligibleForVintageSeason) also shows up as a small on-court surge,
  // not just a stat line that quietly stops declining.
  const choiceFactor = formFactor * moralFactor * (vintage ? 1.1 : 1);

  // The chosen build isn't just flat attribute boosts — it gives the player a distinct
  // statistical signature (a scorer build puts up more points, a playmaking build racks up
  // more assists), at the cost of a bit of well-roundedness in the average rating.
  const identity = buildIdentity(getBuild(career.archetype) ?? BUILDS[0]);

  const scoringSkill = (stats.technique * 0.6 + stats.iqBasket * 0.2 + stats.physique * 0.2) / 100;
  let points = scoringSkill * minutes * profile.score * randFloat(0.85, 1.15) * 1.45 * choiceFactor * (1 + identity.pointsPct / 100);
  // A rare career-year bump — this is a SEASON average, so it stays modest even when it lands,
  // rather than the wild multiplier a single highlight game could get away with.
  if (Math.random() < 0.04) points *= randFloat(1.05, 1.18);
  // Every box-score number below is a season AVERAGE, not a single game — the build-identity and
  // choice-factor multipliers can otherwise stack past anything realistic. Hard-cap each one at
  // a rare, historically-plausible career-high ceiling.
  points = Math.min(65, points);

  const reboundSkill = (stats.physique * 0.7 + stats.iqBasket * 0.3) / 100;
  const rebonds = Math.min(
    18,
    reboundSkill * minutes * profile.rebound * (1 + tilt * 0.35) * randFloat(0.85, 1.15) * 0.45 * choiceFactor * (1 + identity.reboundsPct / 100),
  );

  const passSkill = (stats.iqBasket * 0.6 + stats.technique * 0.2 + stats.mental * 0.2) / 100;
  const passes = Math.min(
    14,
    passSkill * minutes * profile.pass * (1 - tilt * 0.25) * randFloat(0.85, 1.15) * 0.4 * choiceFactor * (1 + identity.passesPct / 100),
  );

  const stealSkill = (stats.iqBasket * 0.5 + stats.physique * 0.3 + stats.mental * 0.2) / 100;
  const interceptions = Math.min(4, stealSkill * minutes * profile.steal * (1 - tilt * 0.15) * randFloat(0.8, 1.2) * 0.08 * choiceFactor);

  const blockSkill = (stats.physique * 0.6 + stats.iqBasket * 0.4) / 100;
  const contres = Math.min(5, blockSkill * minutes * profile.block * (1 + tilt * 0.35) * randFloat(0.8, 1.2) * 0.12 * choiceFactor);

  const adresse3pts = Math.max(15, Math.min(52, 24 + stats.technique * 0.32 - stats.physique * 0.04 + (choiceFactor - 1) * 20 + randFloat(-3, 3)));

  const composite = (stats.technique + stats.physique + stats.mental + stats.iqBasket) / 4;
  const noteMoyenne = Math.max(
    2,
    Math.min(
      10,
      3.2 + (composite / 100) * 5.5 + (minutes / maxMinutes(league)) * 1.3 + (choiceFactor - 1) * 4 + identity.noteDelta + randFloat(-0.4, 0.4),
    ),
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

function computeClassement(career: Career, noteMoyenne: number, forcedChampion?: boolean): { rank: number; total: number } {
  const total = career.currentTeam.league === 'nba' ? NBA_TEAM_POOL.length : career.currentTeam.league === 'europe' ? EUROPE_TEAM_POOL.length : HIGH_SCHOOL_TEAM_POOL.length;
  // The Finals-clinching shot (finale-moment-decisif) is that title, not a separate roll of the
  // dice — hitting it always means the team is champion this season, no exceptions.
  if (forcedChampion) {
    return { rank: 1, total };
  }
  const teamStrength = (career.currentTeam.ambition + career.currentTeam.coachQuality) / 2;
  // An MVP-caliber season (the same 8.7 threshold that awards the trophy) can genuinely carry a
  // so-so roster deep into contention on its own — individual brilliance should count for more
  // than just a minor nudge on top of what the roster already brings.
  const carryBonus = noteMoyenne >= 8.7 ? (noteMoyenne - 8.7) * 6 : 0;
  const playerContribution = noteMoyenne * 6 + career.stats.reputation * 0.2 + carryBonus;
  // Solid competition, not a rubber stamp: rival front offices specifically build super-teams to
  // dethrone a proven champion, so each additional title in the same career gets meaningfully
  // harder to repeat, on top of the raw team+player quality that was already required.
  const priorTitles = career.trophies.filter((t) => t.id.includes('-champion')).length;
  const leagueResistance = Math.min(28, priorTitles * 8);
  const contention = teamStrength * 0.4 + playerContribution * 0.6 - leagueResistance;
  // Winning the title is resolved as its own direct roll rather than spreading every team across
  // a continuous 1..total scale — with a large league, "exactly rank 1" is a razor-thin sliver of
  // that scale, so mapping it that way made a title all but impossible even for a flawless
  // season. A real MVP-level year on a good roster now has a genuine, meaningful shot; an average
  // year on an average team still essentially never wins it.
  const winChance = Math.max(0, Math.min(0.35, (contention - 60) / 130));
  if (Math.random() < winChance) {
    return { rank: 1, total };
  }
  const score = contention + randFloat(-15, 15);
  const rank = Math.max(2, Math.min(total, Math.round(total - (score / 100) * (total - 1))));
  return { rank, total };
}

function generateTrophies(career: Career, statLine: SeasonStatLine, rank: number): Trophy[] {
  const trophies: Trophy[] = [];
  const idBase = `trophy-s${career.season}`;
  const league = career.currentTeam.league;
  const isFirstProSeason = league !== 'lycee' && !career.history.some((h) => h.league === league);

  if (rank === 1) {
    const champLabel =
      league === 'nba'
        ? tt('Champion Hooper League', 'Hooper League Champion')
        : league === 'europe'
          ? tt("Champion d'Europe", 'European Champion')
          : tt('Champion', 'Champion');
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
  const eligible = leaguePools.filter((t) => t.id !== career.currentTeam.id);
  const sorted = eligible.sort((a, b) => Math.abs(a.salaryBudget - normalizedValue) - Math.abs(b.salaryBudget - normalizedValue));
  const count = career.currentTeam.league === 'lycee' ? 3 : 2 + randInt(0, 2);
  const offers: Team[] = [];
  // A bad team drafting a great prospect is realistic — but a proven, in-demand player should be
  // able to eventually maneuver onto an actual contender, not stay stuck on a rebuilding roster
  // for an entire career just because that's who happened to hold the pick. Once a player has
  // real standing, a genuine contender fights for their signature among the offers.
  const isElite = career.stats.reputation >= 65 && career.currentTeam.league !== 'lycee';
  if (isElite) {
    const contender = [...eligible].sort((a, b) => b.ambition - a.ambition)[0];
    if (contender) offers.push(contender);
  }
  const shuffled = sorted.sort(() => Math.random() - 0.5);
  for (const team of shuffled) {
    if (offers.length >= count) break;
    if (offers.some((o) => o.id === team.id)) continue;
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
  const vintage = isEligibleForVintageSeason(career) && Math.random() < 0.12;
  let stats = progressStats(career, vintage);
  const { blessures, matchesMissed, statsAfter } = rollInjuries(career, stats);
  stats = statsAfter;

  // A genuine hot streak — built from a season's chain of good choices, with real luck on the
  // risky ones — is what actually raises a player's ceiling. A cold or mixed season leaves
  // potentiel untouched, no matter how many seasons have gone by.
  if (career.age <= 30) {
    const breakthroughChance = career.momentum >= 90 ? 0.5 : career.momentum >= 75 ? 0.3 : career.momentum >= 60 ? 0.12 : 0;
    if (breakthroughChance > 0 && Math.random() < breakthroughChance) {
      const breakthroughGain = career.momentum >= 90 ? 3 : career.momentum >= 75 ? 2 : 1;
      stats = applyEffects(stats, { potentiel: breakthroughGain });
    }
  }

  // Traits are earned from how the player has actually developed this season — each one is a
  // permanent, double-edged personality trait: a real buff paired with a real nerf.
  const newTraits = checkNewTraits({ ...career, stats });
  const statsBeforeTraits = stats;
  for (const trait of newTraits) {
    stats = applyEffects(stats, trait.buff);
    stats = applyEffects(stats, trait.nerf);
  }
  stats = capTrainableGrowth(statsBeforeTraits, stats);

  const statLine = generateStatLine(career, stats, matchesMissed, vintage);
  const { rank, total } = computeClassement(career, statLine.noteMoyenne, career.pendingFinaleResult === true);
  const trophies = generateTrophies(career, statLine, rank);

  // A season that sweeps the league's hardware is proof the player is legitimately elite right
  // now — the recognized skill stats (and Overall) shouldn't need years of gradual progression to
  // catch up to what the whole league just watched happen. The bigger the haul, the bigger and
  // more immediate the jump — instead of a trophy case that reads MVP/Champion/Scoring next to a
  // GEN badge that still looks middling. Each trigger's gain is halved from the last, so a single
  // signature season delivers a real, decisive jump (role player -> genuinely great in one go),
  // while sustained, repeated dominance across a whole career can still climb toward true
  // legend status — without letting any one dominant stretch snowball straight to the max the
  // way an uncapped repeatable version did.
  const majorTrophyCount = trophies.filter((t) => /-(mvp|champion|scoring|assists|defense)$/.test(t.id)).length;
  const eliteSeasonBonus = majorTrophyCount >= 3 ? 10 : majorTrophyCount === 2 ? 7 : statLine.noteMoyenne >= 8.7 ? 4 : 0;
  let eliteBreakthroughCount = career.eliteBreakthroughCount;
  if (eliteSeasonBonus > 0 && career.age <= 32) {
    const effectiveBonus = Math.max(1, Math.round(eliteSeasonBonus * Math.pow(0.5, eliteBreakthroughCount)));
    eliteBreakthroughCount += 1;
    const newPotentiel = clampStat(stats.potentiel + effectiveBonus);
    stats = { ...stats, potentiel: newPotentiel };
    for (const key of TRAINABLE_STATS) {
      if (stats[key] < newPotentiel) {
        stats = { ...stats, [key]: clampStat(stats[key] + (newPotentiel - stats[key]) * 0.5) };
      }
    }
  }

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
    vintageSeason: vintage,
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
    pendingFinaleResult: null,
    eliteBreakthroughCount,
    traits: [...career.traits, ...newTraits.map((t) => t.id)],
    newlyUnlockedTraits: newTraits.map((t) => t.id),
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

  // A high-school rivalry that actually got played out becomes the origin story the rest of the
  // legacy narrative builds on top of.
  const { wins: hsWins, losses: hsLosses } = career.rivalHighSchoolRecord;
  const originText =
    !startedInNba && hsWins + hsLosses > 0
      ? hsWins > hsLosses
        ? {
            fr: `Tout a commencé par une rivalité légendaire face à ${career.rivalHighSchool} au lycée. `,
            en: `It all started with a legendary high-school rivalry against ${career.rivalHighSchool}. `,
          }
        : {
            fr: `Une rivalité de lycée douloureuse face à ${career.rivalHighSchool} a forgé son mental très tôt. `,
            en: `A painful high-school rivalry against ${career.rivalHighSchool} forged his mindset early on. `,
          }
      : { fr: '', en: '' };

  const tierText = TIER_NARRATIVE[tier];

  const trophyCount = career.trophies.length;
  const trophyText =
    trophyCount === 0
      ? { fr: "Aucun trophée à son actif, mais l'aventure a eu lieu.", en: 'No hardware to show for it, but the journey happened.' }
      : trophyCount <= 3
        ? { fr: 'Quelques trophées glanés en chemin.', en: 'A handful of trophies picked up along the way.' }
        : { fr: 'Une vitrine bien remplie de récompenses.', en: 'A trophy case packed with hardware.' };

  return {
    fr: `${originText.fr}${pathText.fr} ${tierText.fr} ${trophyText.fr}`,
    en: `${originText.en}${pathText.en} ${tierText.en} ${trophyText.en}`,
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
        "Malgré tes efforts, aucune franchise ni club professionnel ne t'a fait confiance. Le rêve Hooper League s'arrête ici, mais le basket reste une passion.",
        "Despite your efforts, no professional club ever took a chance on you. The Hooper League dream ends here, but basketball remains a passion.",
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
        "Ta carrière s'est épanouie en Europe, loin de la Hooper League mais pleine de sens.",
        'Your career flourished in Europe, far from the Hooper League but full of meaning.',
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

/** Stats the player can directly train up by spending earned skill points — gated by potentiel. */
export const TRAINABLE_STATS: StatKey[] = ['technique', 'physique', 'mental', 'iqBasket'];

/** Once every trainable stat is pinned at the talent ceiling, points don't just pile up unused —
 * they can still buy real, ongoing value in conditioning and team chemistry, neither of which has
 * (or needs) a talent ceiling of its own, and both of which directly move the season stat line
 * (see generateStatLine's formFactor/moralFactor and progressStats' minutesTarget). */
export const CONDITIONING_STATS: StatKey[] = ['forme', 'moral', 'relationCoach', 'relationCoequipiers'];

export function spendSkillPoint(career: Career, stat: StatKey): Career {
  if (career.skillPoints <= 0) return career;
  if (TRAINABLE_STATS.includes(stat)) {
    // Training can't push a stat past the player's own talent ceiling — potentiel has to rise
    // first, through real seasons of good decisions, not just spent points.
    if (career.stats[stat] >= career.stats.potentiel) return career;
  } else if (!CONDITIONING_STATS.includes(stat)) {
    return career;
  }
  return {
    ...career,
    skillPoints: career.skillPoints - 1,
    stats: applyEffects(career.stats, { [stat]: 1 }),
  };
}

// Bad teams draft first, just like the real lottery/draft order — a proxy sort by ambition
// (low-ambition teams are the ones rebuilding and picking early).
function draftOrderPool(): Team[] {
  return [...NBA_TEAM_POOL].sort((a, b) => a.ambition - b.ambition);
}

export function teamForDraftPick(pick: number): Team {
  const order = draftOrderPool();
  return order[Math.max(0, Math.min(order.length - 1, pick - 1))];
}

export interface DraftResult {
  pick: number;
  team: Team;
}

// The draft is never pure stats: it blends 4 years of accumulated draft stock (performance +
// behavior) with the raw stat line, then adds a real luck swing — a great prospect is far more
// likely to go early, but is never mathematically guaranteed to go first overall.
export function computeDraftResult(career: Career): DraftResult {
  const performanceScore = (career.stats.technique + career.stats.physique + career.stats.mental + career.stats.iqBasket + career.stats.reputation) / 5;
  const combined = career.draftStock * 0.5 + performanceScore * 0.5;
  const roll = Math.max(0, Math.min(100, combined + randFloat(-25, 25)));
  const poolSize = NBA_TEAM_POOL.length;
  const pick = Math.max(1, Math.min(poolSize, Math.round(poolSize - (roll / 100) * (poolSize - 1))));
  return { pick, team: teamForDraftPick(pick) };
}

export function startNextSeason(career: Career): Career {
  const nextAge = career.age + 1;
  const nextLeague = leagueForAge(nextAge, career.currentTeam.league, career.seenEventIds.includes('draft-soiree'));
  let currentTeam = career.currentTeam;
  if (nextLeague !== career.currentTeam.league) {
    // Landing in the NBA off the back of an actual draft night uses the pick that was rolled
    // there, instead of a purely random team assignment.
    currentTeam = nextLeague === 'nba' && career.draftPick !== null ? teamForDraftPick(career.draftPick) : allTeamsForLeague(nextLeague)[randInt(0, allTeamsForLeague(nextLeague).length - 1)];
  }
  const withDelayed = applyDueDelayedEffects({ ...career, age: nextAge, currentTeam });
  // Vary the pace season to season instead of always the same fixed count.
  const eventsPerSeason = randomEventsPerSeason();
  return {
    ...withDelayed,
    season: career.season + 1,
    eventInSeasonIndex: 0,
    eventsPerSeason,
    usedThisSeasonIds: [],
    phase: 'event',
    currentEventId: pickNextEvent({ ...withDelayed, usedThisSeasonIds: [], eventsPerSeason })?.id ?? null,
    lastSeasonResult: null,
    pendingTransferOffers: null,
    newlyUnlockedTraits: [],
    // Each new season is a fresh challenge — momentum regresses partway back toward neutral
    // instead of carrying a hot (or cold) streak forever.
    momentum: Math.round(career.momentum + (50 - career.momentum) * 0.4),
    updatedAt: Date.now(),
  };
}

function applyDueDelayedEffects(career: Career): Career {
  const due = career.pendingDelayed.filter((d) => d.triggerSeason <= career.season);
  const remaining = career.pendingDelayed.filter((d) => d.triggerSeason > career.season);
  let stats = career.stats;
  for (const d of due) stats = applyEffects(stats, d.effect.effects);
  stats = capTrainableGrowth(career.stats, stats);
  return { ...career, stats, pendingDelayed: remaining };
}
