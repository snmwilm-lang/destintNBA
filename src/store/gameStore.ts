import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Archetype, Career, Lang, Position, SeasonResult, StatKey, Team } from '../types';
import { isGoodDelta } from '../i18n/statLabels';
import {
  baseEventId,
  type CareerPath,
  checkEnding,
  computeCareerSheet,
  computeDraftResult,
  createNewCareer,
  EVENTS_PER_SEASON,
  generateTransferOffers,
  getEvent,
  NATIONAL_CAMPAIGN_RESULT_IDS,
  pickNextEvent,
  pinRivalHighSchool,
  pinRivalName,
  pinRivalPlayerTeam,
  pinRivalTeam,
  resolveChoice,
  simulateNationalCampaign,
  simulateSeason,
  spendSkillPoint,
  startNextSeason,
} from '../engine/careerEngine';
import { ACHIEVEMENTS, MAX_ACHIEVEMENT_BONUS_POINTS } from '../data/achievements';
import { type DailyChallengeMetric, pickDailyChallenges, todayKey } from '../data/dailyChallenges';

const RECENT_EVENTS_MEMORY = 40;

const NATIONAL_SELECTION_EVENT_IDS: Record<string, 'jeuxOlympiques' | 'coupeDuMonde'> = {
  'jo-selection-equipe': 'jeuxOlympiques',
  'cdm-qualification': 'coupeDuMonde',
};

function uid(): string {
  return `career-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

interface PersistedShape {
  lang?: Lang;
  careers?: (Partial<Career> & Record<string, unknown>)[];
  activeCareerId?: string | null;
  unlockedAchievements?: string[];
  dailyChallengeDate?: string;
  dailyProgress?: Partial<Record<DailyChallengeMetric, number>>;
  dailyClaimedIds?: string[];
}

// The Career shape has grown several new required fields over the game's development. A save
// written before one of those fields existed would otherwise rehydrate with it `undefined` and
// crash the first time it's read — so every load backfills sane defaults for anything missing,
// regardless of the save's reported version.
function reconcileCareer(c: Partial<Career> & Record<string, unknown>): Career {
  return {
    ...c,
    specialty: c.specialty ?? null,
    highSchool: c.highSchool ?? null,
    draftStock: c.draftStock ?? 50,
    draftPick: c.draftPick ?? null,
    skillPoints: c.skillPoints ?? 0,
    rivalName: c.rivalName ?? 'Malik Sanders',
    rivalRecord: c.rivalRecord ?? { wins: 0, losses: 0 },
    rivalTeamName: c.rivalTeamName ?? 'Chicago Bison',
    rivalTeamRecord: c.rivalTeamRecord ?? { wins: 0, losses: 0 },
    rivalryProvoked: c.rivalryProvoked ?? false,
    rivalHighSchool: c.rivalHighSchool ?? 'Northview High',
    rivalHighSchoolRecord: c.rivalHighSchoolRecord ?? { wins: 0, losses: 0 },
    nationality: c.nationality ?? 'US',
    momentum: c.momentum ?? 50,
    pendingNationalCampaign: c.pendingNationalCampaign ?? null,
    pendingFinaleResult: c.pendingFinaleResult ?? null,
    hasReachedFinale: c.hasReachedFinale ?? false,
    // Saves from before the diminishing multi-trigger version stored a plain boolean.
    eliteBreakthroughCount: typeof c.eliteBreakthroughCount === 'number' ? c.eliteBreakthroughCount : c.hadEliteBreakthrough ? 1 : 0,
    // Saves from before the JO/CDM guarantees were tracked separately had one shared flag that
    // could already be true from whichever competition came first — reset both here so an
    // in-progress career actually gets the fixed, independent guarantee for the one it never saw.
    hasBeenSelectedForJo: c.hasBeenSelectedForJo ?? false,
    hasBeenSelectedForCdm: c.hasBeenSelectedForCdm ?? false,
    newlyUnlockedAchievements: c.newlyUnlockedAchievements ?? [],
    traits: c.traits ?? [],
    newlyUnlockedTraits: c.newlyUnlockedTraits ?? [],
  } as Career;
}

interface GameStore {
  lang: Lang;
  setLang: (lang: Lang) => void;

  careers: Career[];
  activeCareerId: string | null;
  unlockedAchievements: string[];

  // Daily challenges: a fresh set of 3 is picked every real-world day (see dailyChallenges.ts),
  // shared account-wide (not per career) since they're about "today's session", not one career.
  dailyChallengeDate: string;
  dailyProgress: Partial<Record<DailyChallengeMetric, number>>;
  dailyClaimedIds: string[];
  checkDailyReset: () => void;

  createCareer: (playerName: string, archetype: Archetype, position: Position, path?: CareerPath, height?: number, nationality?: string) => void;
  selectCareer: (id: string) => void;
  deleteCareer: (id: string) => void;
  exitToMenu: () => void;

  chooseOption: (choiceId: string) => void;
  acknowledgeChoiceResult: () => void;
  acknowledgeSeasonRecap: () => void;
  chooseTransferOffer: (team: Team | null) => void;
  spendPoint: (stat: StatKey) => void;
}

function updateActiveCareer(state: GameStore, updater: (c: Career) => Career): Partial<GameStore> {
  if (!state.activeCareerId) return {};
  const careers = state.careers.map((c) => (c.id === state.activeCareerId ? { ...updater(c), updatedAt: Date.now() } : c));
  return { careers };
}

/** Moves past the "choice result" beat: either the next event card, or the season simulation —
 * returning the fresh SeasonResult too, so daily-challenge progress (seasons/trophies/salary) can
 * be credited without re-deriving whether a season actually just completed. */
function advancePastChoice(c: Career): { career: Career; seasonResult: SeasonResult | null } {
  if (c.eventInSeasonIndex >= c.eventsPerSeason) {
    const { career: simulated, result } = simulateSeason(c);
    return { career: { ...simulated, phase: 'seasonRecap' }, seasonResult: result };
  }
  const next = pickNextEvent(c);
  return {
    career: {
      ...c,
      phase: 'event',
      currentEventId: next?.id ?? null,
      lastChoiceResultText: null,
      lastChoiceStatDeltas: null,
      lastChoiceMoneyDelta: 0,
      lastChoiceWasSuccess: null,
    },
    seasonResult: null,
  };
}

/** Rolls forward to a fresh daily set (if the local day has changed) and credits progress toward
 * the active set's targets, auto-claiming (and rewarding a skill point for) anything newly
 * completed. Multiple metrics can be credited in one pass so a single game action — like a season
 * completing — can move several challenges at once without one call clobbering another's update. */
function applyDailyProgress(state: GameStore, deltas: Partial<Record<DailyChallengeMetric, number>>): Partial<GameStore> {
  const dateKey = todayKey();
  const isFreshDay = state.dailyChallengeDate !== dateKey;
  const baseProgress = isFreshDay ? {} : state.dailyProgress;
  const baseClaimed = isFreshDay ? [] : state.dailyClaimedIds;
  const dailyProgress = { ...baseProgress };
  for (const [metric, amount] of Object.entries(deltas) as [DailyChallengeMetric, number][]) {
    if (!amount) continue;
    dailyProgress[metric] = (dailyProgress[metric] ?? 0) + amount;
  }
  const activeSet = pickDailyChallenges(dateKey);
  const newlyCompleted = activeSet.filter((ch) => (dailyProgress[ch.metric] ?? 0) >= ch.target && !baseClaimed.includes(ch.id));
  const dailyClaimedIds = newlyCompleted.length > 0 ? [...baseClaimed, ...newlyCompleted.map((ch) => ch.id)] : baseClaimed;
  const bonusPoints = newlyCompleted.length;
  const careers =
    bonusPoints > 0 && state.activeCareerId
      ? state.careers.map((c) => (c.id === state.activeCareerId ? { ...c, skillPoints: c.skillPoints + bonusPoints } : c))
      : state.careers;
  return { dailyChallengeDate: dateKey, dailyProgress, dailyClaimedIds, careers };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      lang: 'fr',
      setLang: (lang) => set({ lang }),

      careers: [],
      activeCareerId: null,
      unlockedAchievements: [],

      dailyChallengeDate: '',
      dailyProgress: {},
      dailyClaimedIds: [],
      checkDailyReset: () => set((state) => applyDailyProgress(state, {})),

      createCareer: (playerName, archetype, position, path = 'full', height, nationality) => {
        const id = uid();
        set((state) => {
          const bonusSkillPoints = Math.min(MAX_ACHIEVEMENT_BONUS_POINTS, state.unlockedAchievements.length);
          const career = createNewCareer(id, playerName || 'Rookie', archetype, position, path, height, bonusSkillPoints, nationality);
          return { careers: [...state.careers, career], activeCareerId: id };
        });
      },

      selectCareer: (id) => set({ activeCareerId: id }),

      deleteCareer: (id) =>
        set((state) => ({
          careers: state.careers.filter((c) => c.id !== id),
          activeCareerId: state.activeCareerId === id ? null : state.activeCareerId,
        })),

      exitToMenu: () => set({ activeCareerId: null }),

      chooseOption: (choiceId) => {
        const state = get();
        const career = state.careers.find((c) => c.id === state.activeCareerId);
        if (!career || !career.currentEventId) return;
        const rawEvent = getEvent(career.currentEventId);
        if (!rawEvent) return;
        const event = pinRivalHighSchool(
          pinRivalTeam(pinRivalPlayerTeam(pinRivalName(rawEvent, career.rivalName), career.rivalName, career.currentTeam.league), career.rivalTeamName),
          career.rivalHighSchool,
        );
        const outcome = resolveChoice(career, event, choiceId);

        set((s) => {
          const afterChoice = updateActiveCareer(s, (c) => {
            const seenEventIds = event.unique ? [...c.seenEventIds, event.id] : c.seenEventIds;
            const usedThisSeasonIds = [...c.usedThisSeasonIds, event.id];
            const recentEventIds = [...c.recentEventIds, baseEventId(event.id)].slice(-RECENT_EVENTS_MEMORY);
            const choiceLog = [
              ...c.choiceLog,
              {
                eventId: event.id,
                eventTitle: event.title[s.lang],
                choiceId,
                choiceLabel: event.choices.find((ch) => ch.id === choiceId)?.label[s.lang] ?? '',
                season: c.season,
              },
            ];
            const pendingDelayed = [...c.pendingDelayed];
            const choice = event.choices.find((ch) => ch.id === choiceId);
            if (choice?.delayedEffects) {
              for (const d of choice.delayedEffects) {
                pendingDelayed.push({ effect: d, triggerSeason: c.season + d.delaySeasons });
              }
            }
            // Momentum tracks a real streak of good decisions (and luck on risky ones) — this
            // is what actually gates potentiel growth each season, not just playing a lot of
            // seasons regardless of how they went.
            let momentumDelta = 0;
            if (outcome.wasSuccess === true) momentumDelta = 8;
            else if (outcome.wasSuccess === false) momentumDelta = -10;
            else {
              const netGood = (Object.entries(outcome.statDeltas) as [StatKey, number][]).reduce(
                (acc, [key, delta]) => acc + (isGoodDelta(key, delta) ? 1 : -1) * Math.abs(delta),
                0,
              );
              momentumDelta = netGood > 0 ? 2 : netGood < 0 ? -2 : 0;
            }
            const momentum = Math.max(0, Math.min(100, c.momentum + momentumDelta));
            // A rival showdown is still a real game even when the picked choice was a flavor/dialogue
            // option with no successChance of its own (e.g. "stay silent and play") — the record
            // must reflect that a game actually happened, so it falls back to a stat-weighted roll
            // instead of silently staying untouched.
            const resolveRivalGame = (): boolean => {
              if (outcome.wasSuccess !== null) return outcome.wasSuccess;
              const composite = (c.stats.technique + c.stats.mental + c.stats.iqBasket) / 3;
              return Math.random() < Math.max(0.3, Math.min(0.8, 0.45 + (composite - 50) / 150));
            };
            const rivalRecord = event.tags?.includes('rivalDuel')
              ? resolveRivalGame()
                ? { wins: c.rivalRecord.wins + 1, losses: c.rivalRecord.losses }
                : { wins: c.rivalRecord.wins, losses: c.rivalRecord.losses + 1 }
              : c.rivalRecord;
            const rivalTeamRecord = event.tags?.includes('cityRivalry')
              ? resolveRivalGame()
                ? { wins: c.rivalTeamRecord.wins + 1, losses: c.rivalTeamRecord.losses }
                : { wins: c.rivalTeamRecord.wins, losses: c.rivalTeamRecord.losses + 1 }
              : c.rivalTeamRecord;
            const rivalHighSchoolRecord = event.tags?.includes('schoolRivalry')
              ? resolveRivalGame()
                ? { wins: c.rivalHighSchoolRecord.wins + 1, losses: c.rivalHighSchoolRecord.losses }
                : { wins: c.rivalHighSchoolRecord.wins, losses: c.rivalHighSchoolRecord.losses + 1 }
              : c.rivalHighSchoolRecord;
            const rivalryProvoked = c.rivalryProvoked || choice?.triggersRivalry === true;
            // Draft stock only accumulates during the high-school years it's meant to reflect —
            // once drafted, the pick is locked in and further swings would be meaningless.
            const draftStock =
              choice?.draftImpact !== undefined && c.currentTeam.league === 'lycee'
                ? Math.max(0, Math.min(100, c.draftStock + choice.draftImpact))
                : c.draftStock;
            // Getting picked for the national team rolls the whole tournament run right away, so
            // a guaranteed follow-up event can later reveal exactly how far the country went.
            const selectionCompetition = NATIONAL_SELECTION_EVENT_IDS[event.id];
            const pendingNationalCampaign = selectionCompetition
              ? { competition: selectionCompetition, round: simulateNationalCampaign(c) }
              : NATIONAL_CAMPAIGN_RESULT_IDS.has(event.id)
                ? null
                : c.pendingNationalCampaign;
            // A choice can chain straight into a follow-up event (a multi-step moment) instead
            // of showing the usual result screen — it doesn't eat an extra slot from the season.
            const linkedNextEventId = choice?.linkedNextEventId;
            // Draft night: roll the real pick now (stock + performance + luck) and reveal it
            // right in the result text, since the team assignment itself only takes effect at
            // the next season boundary (startNextSeason picks it up from career.draftPick).
            let draftPick = c.draftPick;
            let resultText = linkedNextEventId ? null : outcome.resultText;
            if (event.id === 'draft-soiree') {
              const draftResult = computeDraftResult({ ...c, stats: outcome.stats, draftStock });
              draftPick = draftResult.pick;
              if (resultText) {
                resultText = {
                  fr: resultText.fr.replace('{pick}', String(draftResult.pick)).replace('{team}', draftResult.team.name),
                  en: resultText.en.replace('{pick}', String(draftResult.pick)).replace('{team}', draftResult.team.name),
                };
              }
            }
            // The Finals-clinching shot is the title, not a separate roll — whether it drops (or
            // clangs out) is carried forward and directly decides this season's championship.
            const pendingFinaleResult = event.id === 'finale-moment-decisif' ? outcome.wasSuccess : c.pendingFinaleResult;
            const hasReachedFinale =
              c.hasReachedFinale || event.id === 'finale-prequel-timeout' || event.id === 'finale-moment-decisif';
            const hasBeenSelectedForJo = c.hasBeenSelectedForJo || selectionCompetition === 'jeuxOlympiques';
            const hasBeenSelectedForCdm = c.hasBeenSelectedForCdm || selectionCompetition === 'coupeDuMonde';
            const withChoice: Career = {
              ...c,
              stats: outcome.stats,
              argent: outcome.argent,
              seenEventIds,
              usedThisSeasonIds,
              recentEventIds,
              choiceLog,
              pendingDelayed,
              rivalRecord,
              rivalTeamRecord,
              rivalHighSchoolRecord,
              momentum,
              rivalryProvoked,
              draftStock,
              draftPick,
              pendingNationalCampaign,
              pendingFinaleResult,
              hasReachedFinale,
              hasBeenSelectedForJo,
              hasBeenSelectedForCdm,
              phase: linkedNextEventId ? 'event' : 'choiceResult',
              currentEventId: linkedNextEventId ?? c.currentEventId,
              lastChoiceResultText: resultText,
              lastChoiceStatDeltas: outcome.statDeltas,
              lastChoiceMoneyDelta: outcome.moneyDelta,
              lastChoiceWasSuccess: outcome.wasSuccess,
              eventInSeasonIndex: linkedNextEventId ? c.eventInSeasonIndex : c.eventInSeasonIndex + 1,
            };
            return withChoice;
          });
          const stateAfterChoice = { ...s, ...afterChoice };
          const daily = applyDailyProgress(stateAfterChoice, {
            choicesMade: 1,
            successfulRisks: outcome.wasSuccess === true ? 1 : 0,
          });
          return { ...afterChoice, ...daily };
        });
      },

      acknowledgeChoiceResult: () => {
        set((s) => {
          if (!s.activeCareerId) return {};
          const career = s.careers.find((c) => c.id === s.activeCareerId);
          if (!career) return {};
          const { career: advanced, seasonResult } = advancePastChoice(career);
          const careers = s.careers.map((c) => (c.id === s.activeCareerId ? { ...advanced, updatedAt: Date.now() } : c));
          const afterAdvance = { careers };
          if (!seasonResult) return afterAdvance;
          const stateAfterAdvance = { ...s, ...afterAdvance };
          const daily = applyDailyProgress(stateAfterAdvance, {
            seasonsCompleted: 1,
            trophiesWon: seasonResult.trophies.length,
            moneyEarned: seasonResult.salaire,
          });
          return { ...afterAdvance, ...daily };
        });
      },

      acknowledgeSeasonRecap: () => {
        set((s) => {
          const career = s.careers.find((c) => c.id === s.activeCareerId);
          if (!career) return {};
          const ending = checkEnding(career);
          if (ending) {
            const endedCareer: Career = { ...career, ending, retired: true, phase: 'ended' };
            const sheet = computeCareerSheet(endedCareer);
            const newlyUnlocked = ACHIEVEMENTS.filter((a) => !s.unlockedAchievements.includes(a.id) && a.check(endedCareer, sheet)).map(
              (a) => a.id,
            );
            const withAchievements: Career = { ...endedCareer, newlyUnlockedAchievements: newlyUnlocked, updatedAt: Date.now() };
            return {
              careers: s.careers.map((c) => (c.id === s.activeCareerId ? withAchievements : c)),
              unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked],
            };
          }
          return updateActiveCareer(s, (c) => {
            if (c.currentTeam.league !== 'lycee') {
              const offers = generateTransferOffers(c);
              return { ...c, phase: 'transferOffers', pendingTransferOffers: offers };
            }
            return startNextSeason(c);
          });
        });
      },

      chooseTransferOffer: (team) => {
        set((s) =>
          updateActiveCareer(s, (c) => {
            const withTeam = team ? { ...c, currentTeam: team } : c;
            return startNextSeason(withTeam);
          }),
        );
      },

      spendPoint: (stat) => {
        set((s) => updateActiveCareer(s, (c) => spendSkillPoint(c, stat)));
      },
    }),
    {
      name: 'hardwood-dreams-save',
      version: 2,
      migrate: (persisted) => {
        const state = persisted as PersistedShape;
        return {
          lang: state.lang ?? 'fr',
          careers: (state.careers ?? []).map(reconcileCareer),
          activeCareerId: state.activeCareerId ?? null,
          unlockedAchievements: state.unlockedAchievements ?? [],
          dailyChallengeDate: state.dailyChallengeDate ?? '',
          dailyProgress: state.dailyProgress ?? {},
          dailyClaimedIds: state.dailyClaimedIds ?? [],
        };
      },
      // `migrate` only fires when the persisted version number differs from `version` above — a
      // save written once at version 2 will never run it again, so any Career field added later
      // (most of them, over this game's development) would silently rehydrate as `undefined` and
      // crash the moment it's read. `merge` runs on every single load regardless of version, so
      // reconciling here is what actually keeps old saves safe on an ongoing basis. Every store
      // key that should survive a reload has to be listed explicitly here (not just `careers`) —
      // anything left out silently falls back to the freshly-initialized default instead of the
      // persisted value.
      merge: (persisted, current) => {
        const state = persisted as PersistedShape | undefined;
        if (!state) return current;
        return {
          ...current,
          lang: state.lang ?? current.lang,
          careers: (state.careers ?? []).map(reconcileCareer),
          activeCareerId: state.activeCareerId ?? null,
          unlockedAchievements: state.unlockedAchievements ?? [],
          dailyChallengeDate: state.dailyChallengeDate ?? current.dailyChallengeDate,
          dailyProgress: state.dailyProgress ?? current.dailyProgress,
          dailyClaimedIds: state.dailyClaimedIds ?? current.dailyClaimedIds,
        };
      },
    },
  ),
);

export const EVENTS_PER_SEASON_EXPORT = EVENTS_PER_SEASON;
