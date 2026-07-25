import { motion } from 'framer-motion';
import type { Career } from '../types';
import { useLang, useT } from '../i18n/useT';
import { computeCareerSheet } from '../engine/careerEngine';

interface EndingScreenProps {
  career: Career;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const TIER_COLOR: Record<string, string> = {
  S: 'text-gold-300',
  A: 'text-emerald-300',
  B: 'text-sky-300',
  C: 'text-slate-300',
  D: 'text-rose-300',
};

export function EndingScreen({ career, onRestart, onBackToMenu }: EndingScreenProps) {
  const lang = useLang();
  const t = useT();
  if (!career.ending) return null;

  const sheet = computeCareerSheet(career);
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl rounded-3xl border border-gold-500/40 bg-gradient-to-b from-court-800 to-court-900 px-8 py-10 text-center shadow-2xl shadow-black/50"
    >
      <div className="mb-3 text-4xl">🏀</div>
      <div className="mb-1 text-xs uppercase tracking-widest text-gold-400">{t('endingTitle')}</div>
      <h1 className="mb-2 text-2xl font-black text-slate-50">{career.ending.title[lang]}</h1>
      <p className="mb-4 text-sm leading-relaxed text-slate-300">{career.ending.description[lang]}</p>

      <blockquote className="mb-6 text-base font-semibold italic text-slate-100">
        “{sheet.legacyTitle[lang]}”
      </blockquote>

      <div className="mb-6 rounded-2xl border border-court-600 bg-court-700/40 px-5 py-4 text-left">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-slate-400">{t('endingFinalStats')}</span>
          <span className={`text-lg font-black tabular-nums ${TIER_COLOR[sheet.tier]}`}>
            {sheet.tier} · {sheet.score}/100
          </span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">{sheet.narrative[lang]}</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingSeasonsPlayed', { count: career.history.length })}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingGamesPlayed')}</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">{sheet.totalGames}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingTotalTrophies', { count: career.trophies.length })}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingCareerPoints')}</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">{sheet.totalPoints.toLocaleString(currency)}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingCareerRebounds')}</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">{sheet.totalRebounds.toLocaleString(currency)}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingCareerPasses')}</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">{sheet.totalPasses.toLocaleString(currency)}</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingCareerAvgRating')}</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">{sheet.careerAvgRating.toFixed(1)}/10</div>
          </div>
          <div className="rounded-lg bg-court-800/60 px-3 py-2 col-span-2">
            <div className="text-[10px] uppercase text-slate-400">{t('endingPeakValue')}</div>
            <div className="text-sm font-bold text-gold-300 tabular-nums">
              {t('commonMoney', { amount: sheet.peakValeurMarchande.toLocaleString(currency) })}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">{t('endingTrophyCase')}</div>
          {sheet.trophies.length === 0 ? (
            <p className="text-sm text-slate-400">{t('endingNoTrophyCase')}</p>
          ) : (
            <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {sheet.trophies.map((trophy) => (
                <li key={trophy.id} className="flex items-center gap-2 text-sm text-gold-300">
                  <span>🏆</span>
                  <span className="font-semibold">{trophy.name[lang]}</span>
                  <span className="text-slate-500 text-xs">S{trophy.season}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRestart}
          className="flex-1 rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-6 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
        >
          {t('endingRestart')}
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 rounded-full border border-court-600 px-6 py-3 text-sm font-bold text-slate-200 hover:border-gold-400 transition-colors"
        >
          {t('endingBackToMenu')}
        </button>
      </div>
    </motion.div>
  );
}
