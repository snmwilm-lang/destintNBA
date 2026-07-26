import { motion } from 'framer-motion';
import type { LocalizedText, StatKey } from '../types';
import { useLang, useT } from '../i18n/useT';
import type { DictionaryKey } from '../i18n/dictionary';
import { isGoodDelta, STAT_LABEL_KEYS } from '../i18n/statLabels';
import { computeOverallDelta } from '../engine/careerEngine';

export type CareerDefiningVariant = 'finale' | 'jo' | 'cdm';

const VICTORY_CONTENT: Record<CareerDefiningVariant, { winIcon: string; loseIcon: string; winTitleKey: DictionaryKey; loseTitleKey: DictionaryKey }> = {
  finale: { winIcon: '🏆', loseIcon: '💔', winTitleKey: 'choiceVictoryTitle', loseTitleKey: 'choiceDefeatTitle' },
  jo: { winIcon: '🥇', loseIcon: '🥈', winTitleKey: 'choiceVictoryTitleJo', loseTitleKey: 'choiceDefeatTitleJo' },
  cdm: { winIcon: '🌍', loseIcon: '🥈', winTitleKey: 'choiceVictoryTitleCdm', loseTitleKey: 'choiceDefeatTitleCdm' },
};

export interface RivalryUpdate {
  rivalName: string;
  wins: number;
  losses: number;
}

interface ChoiceResultCardProps {
  text: LocalizedText | null;
  statDeltas: Partial<Record<StatKey, number>> | null;
  moneyDelta: number;
  wasSuccess: boolean | null;
  /** Marks the payoff of a career-defining moment (the finals-clinching shot, an Olympic final,
   * a World Cup final) — shown as a full dramatic win/loss slide instead of the small standard
   * outcome pill, since this is the one beat in the game the player should never miss. Each
   * competition gets its own icon and headline (gold medal, world champion, etc.) instead of one
   * generic "victory" screen for all three. */
  careerDefiningVariant?: CareerDefiningVariant | null;
  /** The updated head-to-head record right after a rival-duel or city-rivalry choice resolves —
   * surfaces the score live, in the moment, instead of leaving the rivalry invisible until the
   * end-of-career sheet where it can't actually build any tension. */
  rivalryUpdate?: RivalryUpdate | null;
  onContinue: () => void;
}

export function ChoiceResultCard({ text, statDeltas, moneyDelta, wasSuccess, careerDefiningVariant, rivalryUpdate, onContinue }: ChoiceResultCardProps) {
  const lang = useLang();
  const t = useT();
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  const entries = Object.entries(statDeltas ?? {}) as [StatKey, number][];
  const overallDelta = statDeltas ? computeOverallDelta(statDeltas) : 0;
  const overallGood =
    wasSuccess !== null
      ? wasSuccess
      : entries.length > 0
        ? entries.reduce((acc, [key, delta]) => acc + (isGoodDelta(key, delta) ? 1 : -1) * Math.abs(delta), 0) >= 0
        : null;

  const showVictorySlide = !!careerDefiningVariant && wasSuccess !== null;
  const variantContent = careerDefiningVariant ? VICTORY_CONTENT[careerDefiningVariant] : null;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full max-w-lg rounded-3xl border px-6 py-8 text-center shadow-2xl shadow-black/40 ${
        showVictorySlide
          ? wasSuccess
            ? 'border-gold-400/70 bg-gradient-to-b from-gold-500/20 via-court-800/95 to-court-800/95'
            : 'border-rose-500/50 bg-gradient-to-b from-rose-500/15 via-court-800/95 to-court-800/95'
          : 'border-gold-500/40 bg-court-800/90'
      }`}
    >
      {showVictorySlide && variantContent ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="mb-3"
        >
          <div className="text-5xl">{wasSuccess ? variantContent.winIcon : variantContent.loseIcon}</div>
          <div className={`mt-2 text-2xl font-black tracking-wide ${wasSuccess ? 'text-gold-300' : 'text-rose-300'}`}>
            {wasSuccess ? t(variantContent.winTitleKey) : t(variantContent.loseTitleKey)}
          </div>
        </motion.div>
      ) : (
        <>
          {wasSuccess !== null && (
            <div
              className={`mb-4 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide ${
                wasSuccess ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
              }`}
            >
              {wasSuccess ? t('choiceOutcomeSuccess') : t('choiceOutcomeFailure')}
            </div>
          )}
          <div className="mb-4 text-3xl">{overallGood === null ? '🏀' : overallGood ? '📈' : '📉'}</div>
        </>
      )}
      {text && <p className="mb-5 text-sm leading-relaxed text-slate-200">{text[lang]}</p>}

      {overallDelta !== 0 && (
        <div
          className={`mb-3 inline-block rounded-full px-4 py-1 text-sm font-black tabular-nums ${
            overallDelta > 0 ? 'bg-gold-400/15 text-gold-300' : 'bg-rose-500/15 text-rose-300'
          }`}
        >
          {t('choiceOverallDelta', { sign: overallDelta >= 0 ? '+' : '', delta: overallDelta })}
        </div>
      )}

      {(entries.length > 0 || moneyDelta !== 0) && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {entries.map(([key, delta]) => (
            <span
              key={key}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isGoodDelta(key, delta) ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
              }`}
            >
              {t(STAT_LABEL_KEYS[key])} {delta >= 0 ? '+' : ''}
              {delta}
            </span>
          ))}
          {moneyDelta !== 0 && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                moneyDelta >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
              }`}
            >
              {moneyDelta >= 0 ? '+' : ''}
              {t('commonMoney', { amount: moneyDelta.toLocaleString(currency) })}
            </span>
          )}
        </div>
      )}

      {rivalryUpdate && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-wide text-rose-300">
            {t('rivalryBannerTitle', { rival: rivalryUpdate.rivalName })}
          </div>
          <div className="mt-1 text-2xl font-black tabular-nums text-slate-100">
            {rivalryUpdate.wins} — {rivalryUpdate.losses}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {t(
              rivalryUpdate.wins === rivalryUpdate.losses
                ? 'rivalryStatusTied'
                : rivalryUpdate.wins > rivalryUpdate.losses
                  ? 'rivalryStatusLeading'
                  : 'rivalryStatusTrailing',
            )}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className="rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-8 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
      >
        {t('eventContinue')}
      </button>
    </motion.div>
  );
}
