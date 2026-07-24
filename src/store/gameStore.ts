import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Archetype, Career, Lang, Position, StatKey, Team } from '../types';
import {
  type CareerPath,
  checkEnding,
  createNewCareer,
  EVENTS_PER_SEASON,
  generateTransferOffers,
  getEvent,
  pickNextEvent,
  resolveChoice,
  simulateSeason,
  spendSkillPoint,
  startNextSeason,
} from '../engine/careerEngine';

function uid(): string {
  return `career-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

interface GameStore {
  lang: Lang;
  setLang: (lang: Lang) => void;

  careers: Career[];
  activeCareerId: string | null;

  createCareer: (playerName: string, archetype: Archetype, position: Position, path?: CareerPath, height?: number) => void;
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

      createCareer: (playerName, archetype, position, path = 'full', height) => {
        const id = uid();
        const career = createNewCareer(id, playerName || 'Rookie', archetype, position, path, height);
        set((state) => ({ careers: [...state.careers, career], activeCareerId: id }));
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
        const event = getEvent(career.currentEventId);
        if (!event) return;
        const outcome = resolveChoice(career, event, choiceId);

        set((s) =>
          updateActiveCareer(s, (c) => {
            const seenEventIds = event.unique ? [...c.seenEventIds, event.id] : c.seenEventIds;
            const usedThisSeasonIds = [...c.usedThisSeasonIds, event.id];
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
            const specialty = event.id === 'nba-arrival-specialty' && choice ? choice.label : c.specialty;
            const withChoice: Career = {
              ...c,
              stats: outcome.stats,
              argent: outcome.argent,
              seenEventIds,
              usedThisSeasonIds,
              choiceLog,
              pendingDelayed,
              specialty,
              phase: 'choiceResult',
              lastChoiceResultText: outcome.resultText,
              lastChoiceStatDeltas: outcome.statDeltas,
              lastChoiceMoneyDelta: outcome.moneyDelta,
              lastChoiceWasSuccess: outcome.wasSuccess,
              eventInSeasonIndex: c.eventInSeasonIndex + 1,
            };
            return withChoice;
          }),
        );
      },

      acknowledgeChoiceResult: () => {
        set((s) => updateActiveCareer(s, advancePastChoice));
      },

      acknowledgeSeasonRecap: () => {
        set((s) =>
          updateActiveCareer(s, (c) => {
            const ending = checkEnding(c);
            if (ending) {
              return { ...c, ending, retired: true, phase: 'ended' };
            }
            if (c.currentTeam.league !== 'lycee') {
              const offers = generateTransferOffers(c);
              return { ...c, phase: 'transferOffers', pendingTransferOffers: offers };
            }
            return startNextSeason(c);
          }),
        );
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
