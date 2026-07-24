import { motion } from 'framer-motion';
import type { LocalizedText, StatKey } from '../types';
import { useLang, useT } from '../i18n/useT';
import { isGoodDelta, STAT_LABEL_KEYS } from '../i18n/statLabels';

interface ChoiceResultCardProps {
  text: LocalizedText | null;
  statDeltas: Partial<Record<StatKey, number>> | null;
  moneyDelta: number;
  wasSuccess: boolean | null;
  onContinue: () => void;
}

export function ChoiceResultCard({ text, statDeltas, moneyDelta, wasSuccess, onContinue }: ChoiceResultCardProps) {
  const lang = useLang();
  const t = useT();
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  const entries = Object.entries(statDeltas ?? {}) as [StatKey, number][];
  const overallGood =
    wasSuccess !== null
      ? wasSuccess
      : entries.length > 0
        ? entries.reduce((acc, [key, delta]) => acc + (isGoodDelta(key, delta) ? 1 : -1) * Math.abs(delta), 0) >= 0
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg rounded-3xl border border-gold-500/40 bg-court-800/90 px-6 py-8 text-center shadow-2xl shadow-black/40"
    >
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
      {text && <p className="mb-5 text-sm leading-relaxed text-slate-200">{text[lang]}</p>}

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

      <button
        onClick={onContinue}
        className="rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-8 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
      >
        {t('eventContinue')}
      </button>
    </motion.div>
  );
}
