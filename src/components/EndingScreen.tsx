import { motion } from 'framer-motion';
import type { Career } from '../types';
import { useLang, useT } from '../i18n/useT';

interface EndingScreenProps {
  career: Career;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function EndingScreen({ career, onRestart, onBackToMenu }: EndingScreenProps) {
  const lang = useLang();
  const t = useT();
  if (!career.ending) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl rounded-3xl border border-gold-500/40 bg-gradient-to-b from-court-800 to-court-900 px-8 py-10 text-center shadow-2xl shadow-black/50"
    >
      <div className="mb-3 text-4xl">🏀</div>
      <div className="mb-1 text-xs uppercase tracking-widest text-gold-400">{t('endingTitle')}</div>
      <h1 className="mb-4 text-2xl font-black text-slate-50">{career.ending.title[lang]}</h1>
      <p className="mb-6 text-sm leading-relaxed text-slate-300">{career.ending.description[lang]}</p>

      <div className="mb-8 grid grid-cols-2 gap-3 text-left">
        <div className="rounded-xl bg-court-700/60 px-4 py-3">
          <div className="text-[10px] uppercase text-slate-400">{t('endingSeasonsPlayed', { count: career.history.length })}</div>
        </div>
        <div className="rounded-xl bg-court-700/60 px-4 py-3">
          <div className="text-[10px] uppercase text-slate-400">{t('endingTotalTrophies', { count: career.trophies.length })}</div>
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
