import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Archetype, Career, Lang, Position, StatKey, Team } from '../types';
import {
  baseEventId,
  type CareerPath,
  checkEnding,
  computeCareerSheet,
  createNewCareer,
  EVENTS_PER_SEASON,
  generateTransferOffers,
  getEvent,
  pickNextEvent,
  pinRivalName,
  resolveChoice,
  simulateNationalCampaign,
  simulateSeason,
  spendSkillPoint,
  startNextSeason,
} from '../engine/careerEngine';
import { ACHIEVEMENTS, MAX_ACHIEVEMENT_BONUS_POINTS } from '../data/achievements';

const RECENT_EVENTS_MEMORY = 40;

const NATIONAL_SELECTION_EVENT_IDS: Record<string, 'jeuxOlympiques' | 'coupeDuMonde'> = {
  'jo-selection-equipe': 'jeuxOlympiques',
  'cdm-qualification': 'coupeDuMonde',
};

const NATIONAL_CAMPAIGN_RESULT_EVENT_IDS = new Set([
  'jo-finale-olympique',
  'jo-elimination-demies',
  'jo-elimination-quarts',
  'jo-elimination-groupes',
  'cdm-finale-mondiale',
  'cdm-elimination-demies',
  'cdm-elimination-quarts',
  'cdm-elimination-groupes',
]);

function uid(): string {
  return `career-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

interface GameStore {
  lang: Lang;
  setLang: (lang: Lang) => void;

  careers: Career[];
  activeCareerId: string | null;
  unlockedAchievements: string[];

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

/** Moves past the "choice result" beat: either the next event card, or the season simulation. */
function advancePastChoice(c: Career): Career {
  if (c.eventInSeasonIndex >= c.eventsPerSeason) {
    const { career: simulated } = simulateSeason(c);
    return { ...simulated, phase: 'seasonRecap' };
  }
  const next = pickNextEvent(c);
  return {
    ...c,
    phase: 'event',
    currentEventId: next?.id ?? null,
    lastChoiceResultText: null,
    lastChoiceStatDeltas: null,
    lastChoiceMoneyDelta: 0,
    lastChoiceWasSuccess: null,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      lang: 'fr',
      setLang: (lang) => set({ lang }),

      careers: [],
      activeCareerId: null,
      unlockedAchievements: [],

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
        const event = pinRivalName(rawEvent, career.rivalName);
        const outcome = resolveChoice(career, event, choiceId);

        set((s) =>
          updateActiveCareer(s, (c) => {
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
            const rivalRecord =
              event.tags?.includes('rivalDuel') && outcome.wasSuccess !== null
                ? {
                    wins: c.rivalRecord.wins + (outcome.wasSuccess ? 1 : 0),
                    losses: c.rivalRecord.losses + (outcome.wasSuccess ? 0 : 1),
                  }
                : c.rivalRecord;
            // Getting picked for the national team rolls the whole tournament run right away, so
            // a guaranteed follow-up event can later reveal exactly how far the country went.
            const selectionCompetition = NATIONAL_SELECTION_EVENT_IDS[event.id];
            const pendingNationalCampaign = selectionCompetition
              ? { competition: selectionCompetition, round: simulateNationalCampaign(c) }
              : NATIONAL_CAMPAIGN_RESULT_EVENT_IDS.has(event.id)
                ? null
                : c.pendingNationalCampaign;
            // A choice can chain straight into a follow-up event (a multi-step moment) instead
            // of showing the usual result screen — it doesn't eat an extra slot from the season.
            const linkedNextEventId = choice?.linkedNextEventId;
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
              pendingNationalCampaign,
              phase: linkedNextEventId ? 'event' : 'choiceResult',
              currentEventId: linkedNextEventId ?? c.currentEventId,
              lastChoiceResultText: linkedNextEventId ? null : outcome.resultText,
              lastChoiceStatDeltas: outcome.statDeltas,
              lastChoiceMoneyDelta: outcome.moneyDelta,
              lastChoiceWasSuccess: outcome.wasSuccess,
              eventInSeasonIndex: linkedNextEventId ? c.eventInSeasonIndex : c.eventInSeasonIndex + 1,
            };
            return withChoice;
          }),
        );
      },

      acknowledgeChoiceResult: () => {
        set((s) => updateActiveCareer(s, advancePastChoice));
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
      version: 1,
    },
  ),
);

export const EVENTS_PER_SEASON_EXPORT = EVENTS_PER_SEASON;
