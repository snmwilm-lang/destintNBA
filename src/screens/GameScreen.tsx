import type { Career } from '../types';
import { useGameStore } from '../store/gameStore';
import { getEvent, pinRivalHighSchool, pinRivalName, pinRivalTeam } from '../engine/careerEngine';
import { useT } from '../i18n/useT';
import { TopBar } from '../components/TopBar';
import { EventCard } from '../components/EventCard';
import { ChoiceResultCard } from '../components/ChoiceResultCard';
import { SeasonRecapScreen } from '../components/SeasonRecapScreen';
import { TransferOffersScreen } from '../components/TransferOffersScreen';
import { EndingScreen } from '../components/EndingScreen';

interface GameScreenProps {
  career: Career;
  onOpenMenu: () => void;
  onRestart: () => void;
}

export function GameScreen({ career, onOpenMenu, onRestart }: GameScreenProps) {
  const t = useT();
  const chooseOption = useGameStore((s) => s.chooseOption);
  const acknowledgeChoiceResult = useGameStore((s) => s.acknowledgeChoiceResult);
  const acknowledgeSeasonRecap = useGameStore((s) => s.acknowledgeSeasonRecap);
  const chooseTransferOffer = useGameStore((s) => s.chooseTransferOffer);
  const exitToMenu = useGameStore((s) => s.exitToMenu);

  const rawCurrentEvent = career.currentEventId ? getEvent(career.currentEventId) : undefined;
  const currentEvent = rawCurrentEvent
    ? pinRivalHighSchool(pinRivalTeam(pinRivalName(rawCurrentEvent, career.rivalName), career.rivalTeamName), career.rivalHighSchool)
    : undefined;

  // The finals-clinching shot and Olympic/World Cup finals are the career's biggest single
  // moments — their payoff gets a dedicated victory/defeat slide instead of the standard pill.
  const lastResolvedEventId = career.choiceLog[career.choiceLog.length - 1]?.eventId;
  const isCareerDefining = ['finale-moment-decisif', 'jo-finale-olympique', 'cdm-finale-mondiale'].includes(lastResolvedEventId ?? '');

  return (
    <div className="flex min-h-screen flex-col">
      {career.phase !== 'ended' && <TopBar career={career} onOpenMenu={onOpenMenu} />}
      <div className="flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:py-10">
        {career.phase === 'event' && currentEvent && (
          <EventCard
            event={currentEvent}
            onChoose={chooseOption}
            progressLabel={t('eventSeasonProgress', { current: career.eventInSeasonIndex + 1, total: career.eventsPerSeason })}
          />
        )}
        {career.phase === 'choiceResult' && (
          <ChoiceResultCard
            text={career.lastChoiceResultText}
            statDeltas={career.lastChoiceStatDeltas}
            moneyDelta={career.lastChoiceMoneyDelta}
            wasSuccess={career.lastChoiceWasSuccess}
            isCareerDefining={isCareerDefining}
            onContinue={acknowledgeChoiceResult}
          />
        )}
        {career.phase === 'seasonRecap' && career.lastSeasonResult && (
          <SeasonRecapScreen career={career} result={career.lastSeasonResult} onContinue={acknowledgeSeasonRecap} />
        )}
        {career.phase === 'transferOffers' && career.pendingTransferOffers && (
          <TransferOffersScreen career={career} offers={career.pendingTransferOffers} onChoose={chooseTransferOffer} />
        )}
        {career.phase === 'ended' && <EndingScreen career={career} onRestart={onRestart} onBackToMenu={exitToMenu} />}
      </div>
    </div>
  );
}
