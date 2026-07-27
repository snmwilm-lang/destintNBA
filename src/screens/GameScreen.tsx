import type { Career } from '../types';
import { useGameStore } from '../store/gameStore';
import { getEvent, pinRivalHighSchool, pinRivalName, pinRivalPlayerTeam, pinRivalTeam } from '../engine/careerEngine';
import { useT } from '../i18n/useT';
import { TopBar } from '../components/TopBar';
import { EventCard } from '../components/EventCard';
import { ChoiceResultCard, type CareerDefiningVariant, type RivalryUpdate } from '../components/ChoiceResultCard';
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
    ? pinRivalHighSchool(
        pinRivalTeam(
          pinRivalPlayerTeam(pinRivalName(rawCurrentEvent, career.rivalName), career.rivalName, career.currentTeam.league),
          career.rivalTeamName,
        ),
        career.rivalHighSchool,
      )
    : undefined;

  // The finals-clinching shot and Olympic/World Cup finals are the career's biggest single
  // moments — their payoff gets a dedicated victory/defeat slide instead of the standard pill,
  // themed per competition (a Finals ring, an Olympic medal, a World Cup title).
  const lastResolvedEventId = career.choiceLog[career.choiceLog.length - 1]?.eventId;
  const careerDefiningVariant: CareerDefiningVariant | null =
    lastResolvedEventId === 'finale-moment-decisif'
      ? 'finale'
      : lastResolvedEventId === 'jo-finale-olympique'
        ? 'jo'
        : lastResolvedEventId === 'cdm-finale-mondiale'
          ? 'cdm'
          : lastResolvedEventId === 'cityRivalry-playoffs-decisif'
            ? 'rivalPlayoffs'
            : null;

  // Right after a rival-duel or city-rivalry choice resolves, surface the updated head-to-head
  // score in the moment — that's what actually makes the rivalry feel alive, instead of a stat
  // that only shows up once, on the end-of-career sheet.
  const lastResolvedEvent = lastResolvedEventId ? getEvent(lastResolvedEventId) : undefined;
  const rivalryUpdate: RivalryUpdate | null = lastResolvedEvent?.tags?.includes('rivalDuel')
    ? { rivalName: career.rivalName, wins: career.rivalRecord.wins, losses: career.rivalRecord.losses }
    : lastResolvedEvent?.tags?.includes('cityRivalry')
      ? { rivalName: career.rivalTeamName, wins: career.rivalTeamRecord.wins, losses: career.rivalTeamRecord.losses }
      : null;

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
            careerDefiningVariant={careerDefiningVariant}
            rivalryUpdate={rivalryUpdate}
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
