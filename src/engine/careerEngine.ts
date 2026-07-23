import type {
  Archetype,
  Career,
  CareerEnding,
  GameEvent,
  InjuryKey,
  InjuryRecord,
  League,
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
import { applyEffects, clampStat, initialStats, randFloat, randInt, weightedPick } from './statUtils';
import { generatePressArticles } from './pressGenerator';
import { tt } from './eventTemplate';

export const EVENTS_PER_SEASON = 10;

const ARCHETYPE_BOOSTS: Record<Archetype, Partial<Record<StatKey, number>>> = {
  scorer: { technique: 10, mental: 5, popularite: 5 },
  playmaker: { iqBasket: 12, mental: 5, relationCoequipiers: 5 },
  defender: { physique: 10, mental: 8, iqBasket: 4 },
  allround: { technique: 4, physique: 4, iqBasket: 4, mental: 4 },
  shooter: { technique: 14, mental: 3 },
};

const POSITION_PROFILE: Record<Position, { score: number; rebound: number; pass: number; steal: number; block: number }> = {
  PG: { score: 0.85, rebound: 0.25, pass: 1.0, steal: 1.1, block: 0.15 },
  SG: { score: 1.0, rebound: 0.3, pass: 0.5, steal: 0.9, block: 0.2 },
  SF: { score: 0.95, rebound: 0.5, pass: 0.4, steal: 0.8, block: 0.4 },
  PF: { score: 0.85, rebound: 0.8, pass: 0.3, steal: 0.6, block: 0.75 },
  C: { score: 0.75, rebound: 1.0, pass: 0.25, steal: 0.4, block: 1.0 },
};

function eventMap(): Map<string, GameEvent> {
  const map = new Map<string, GameEvent>();
  for (const e of allEvents) map.set(e.id, e);
  return map;
}

const EVENT_MAP = eventMap();

export function getEvent(id: string): GameEvent | undefined {
  return EVENT_MAP.get(id);
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
): Career {
  const now = Date.now();
  const skip = path === 'skipToNba';
  const startingTeam = skip
    ? NBA_TEAM_POOL[randInt(0, NBA_TEAM_POOL.length - 1)]
    : HIGH_SCHOOL_TEAM_POOL[randInt(0, HIGH_SCHOOL_TEAM_POOL.length - 1)];
  let stats = initialStats(ARCHETYPE_BOOSTS[archetype]);
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
    pendingDelayed: [],
    choiceLog: [],
    retired: false,
    ending: null,
    phase: 'event',
    currentEventId: null,
    lastChoiceResultText: null,
    lastSeasonResult: null,
    pendingTransferOffers: null,
  };
  career.currentEventId = pickNextEvent(career)?.id ?? null;
  return career;
}

function meetsRequirements(event: GameEvent, career: Career): boolean {
  if (event.minAge !== undefined && career.age < event.minAge) return false;
  if (event.maxAge !== undefined && career.age > event.maxAge) return false;
  if (event.minSeason !== undefined && career.season < event.minSeason) return false;
  if (event.maxSeason !== undefined && career.season > event.maxSeason) return false;
  if (event.leagues && !event.leagues.includes(career.currentTeam.league)) return false;
  if (event.unique && career.seenEventIds.includes(event.id)) return false;
  if (career.usedThisSeasonIds.includes(event.id)) return false;
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

function forcedMilestone(career: Career): GameEvent | null {
  if (career.age >= 18 && career.currentTeam.league === 'lycee') {
    for (const id of DRAFT_SEQUENCE) {
      if (!career.seenEventIds.includes(id) && !career.usedThisSeasonIds.includes(id)) {
        return getEvent(id) ?? null;
      }
    }
  }
  return null;
}

export function pickNextEvent(career: Career): GameEvent | null {
  const forced = forcedMilestone(career);
  if (forced) return forced;
  const candidates = allEvents.filter((e) => meetsRequirements(e, career));
  if (candidates.length === 0) {
    // fall back: allow season repeats if the pool is exhausted, but never re-show unique events
    const fallback = allEvents.filter((e) => !e.unique || !career.seenEventIds.includes(e.id));
    return weightedPick(fallback, (e) => e.weight ?? 1);
  }
  return weightedPick(candidates, (e) => e.weight ?? 1);
}

export interface ChoiceOutcome {
  stats: PlayerStats;
  argent: number;
  resultText: { fr: string; en: string } | null;
  wasSuccess: boolean | null;
}

export function resolveChoice(career: Career, event: GameEvent, choiceId: string): ChoiceOutcome {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { stats: career.stats, argent: career.argent, resultText: null, wasSuccess: null };
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

  return { stats, argent, resultText, wasSuccess };
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
  const total = scheduledGames(league);
  const matchs = Math.max(0, total - matchesMissed);
  const minutesFactor = stats.tempsDeJeu / 100;
  const minutes = 6 + minutesFactor * (maxMinutes(league) - 6);

  const scoringSkill = (stats.technique * 0.6 + stats.iqBasket * 0.2 + stats.physique * 0.2) / 100;
  const points = scoringSkill * minutes * profile.score * randFloat(0.85, 1.15) * 0.9;

  const reboundSkill = (stats.physique * 0.7 + stats.iqBasket * 0.3) / 100;
  const rebonds = reboundSkill * minutes * profile.rebound * randFloat(0.85, 1.15) * 0.45;

  const passSkill = (stats.iqBasket * 0.6 + stats.technique * 0.2 + stats.mental * 0.2) / 100;
  const passes = passSkill * minutes * profile.pass * randFloat(0.85, 1.15) * 0.4;

  const stealSkill = (stats.iqBasket * 0.5 + stats.physique * 0.3 + stats.mental * 0.2) / 100;
  const interceptions = stealSkill * minutes * profile.steal * randFloat(0.8, 1.2) * 0.08;

  const blockSkill = (stats.physique * 0.6 + stats.iqBasket * 0.4) / 100;
  const contres = blockSkill * minutes * profile.block * randFloat(0.8, 1.2) * 0.12;

  const adresse3pts = Math.max(15, Math.min(52, 24 + stats.technique * 0.32 - stats.physique * 0.04 + randFloat(-3, 3)));

  const composite = (stats.technique + stats.physique + stats.mental + stats.iqBasket) / 4;
  const noteMoyenne = Math.max(2, Math.min(10, 3.2 + (composite / 100) * 5.5 + (minutes / maxMinutes(league)) * 1.3 + randFloat(-0.4, 0.4)));

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

export function computeMarketValue(stats: PlayerStats, age: number, league: League): number {
  const composite =
    stats.technique * 0.25 +
    stats.physique * 0.15 +
    stats.mental * 0.1 +
    stats.iqBasket * 0.2 +
    stats.reputation * 0.15 +
    stats.popularite * 0.1 +
    stats.potentiel * 0.05;
  const ageMultiplier = age <= 24 ? 1.2 : age <= 29 ? 1.0 : age <= 33 ? 0.7 : 0.4;
  const leagueMultiplier = league === 'nba' ? 1.6 : league === 'europe' ? 1.0 : 0.15;
  return Math.round(composite * 900 * ageMultiplier * leagueMultiplier);
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
  if (rank === 1) {
    trophies.push({
      id: `${idBase}-champion`,
      season: career.season,
      name: tt('Champion', 'Champion'),
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
      name: tt('Joueur de la saison', 'Player of the Season'),
      description: tt(
        `Une note moyenne de ${statLine.noteMoyenne}/10 qui impose le respect.`,
        `A ${statLine.noteMoyenne}/10 average rating that commands respect.`,
      ),
    });
  }
  if (statLine.points >= 26) {
    trophies.push({
      id: `${idBase}-scoring`,
      season: career.season,
      name: tt('Meilleur marqueur', 'Scoring leader'),
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
      name: tt('Défenseur de la saison', 'Defensive Player of the Season'),
      description: tt('Un mur infranchissable près du cercle.', 'An impenetrable wall near the rim.'),
    });
  }
  if (career.stats.popularite >= 92) {
    trophies.push({
      id: `${idBase}-fan`,
      season: career.season,
      name: tt('Idole des supporters', 'Fan favorite'),
      description: tt('Le public ne jure plus que par toi.', 'The crowd can\'t get enough of you.'),
    });
  }
  return trophies;
}

export function generateTransferOffers(career: Career): Team[] {
  const leaguePools = career.currentTeam.league === 'lycee' ? [...NBA_TEAM_POOL] : [...NBA_TEAM_POOL, ...EUROPE_TEAM_POOL];
  const sorted = leaguePools
    .filter((t) => t.id !== career.currentTeam.id)
    .sort((a, b) => Math.abs(a.salaryBudget - career.valeurMarchande / 200) - Math.abs(b.salaryBudget - career.valeurMarchande / 200));
  const count = career.currentTeam.league === 'lycee' ? 3 : 2 + randInt(0, 2);
  const offers: Team[] = [];
  const shuffled = sorted.sort(() => Math.random() - 0.5);
  for (const team of shuffled) {
    if (offers.length >= count) break;
    offers.push(team);
  }
  return offers;
}

export function simulateSeason(career: Career): { career: Career; result: SeasonResult } {
  let stats = progressStats(career);
  const { blessures, matchesMissed, statsAfter } = rollInjuries(career, stats);
  stats = statsAfter;

  const statLine = generateStatLine(career, stats, matchesMissed);
  const { rank, total } = computeClassement(career, statLine.noteMoyenne);
  const trophies = generateTrophies(career, statLine, rank);
  const valeurMarchande = computeMarketValue(stats, career.age, career.currentTeam.league);
  const salaire = Math.round((career.currentTeam.salaryBudget / 100) * valeurMarchande * 0.35 + valeurMarchande * 0.05);

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
  };

  const updatedCareer: Career = {
    ...career,
    stats,
    valeurMarchande,
    argent: career.argent + salaire,
    trophies: [...career.trophies, ...trophies],
    pressArticles: [...career.pressArticles, ...pressArticles],
    history: [...career.history, result],
    lastSeasonResult: result,
  };

  return { career: updatedCareer, result };
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
