import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useLang, useT } from '../i18n/useT';
import { computeCareerSheet } from '../engine/careerEngine';
import { ACHIEVEMENTS } from '../data/achievements';

interface MainMenuProps {
  onNewCareer: () => void;
  onOpenAchievements: () => void;
}

const TIER_COLOR: Record<string, string> = {
  S: 'text-gold-300',
  A: 'text-emerald-300',
  B: 'text-sky-300',
  C: 'text-slate-300',
  D: 'text-rose-300',
};

// A native window.confirm() can be silently blocked in sandboxed preview iframes and some
// mobile browsers, which would make delete look broken with no error at all — so the
// confirmation lives entirely in-app: tap once to arm, tap again to confirm.
interface DeleteButtonProps {
  armed: boolean;
  onArm: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteButton({ armed, onArm, onConfirm, onCancel }: DeleteButtonProps) {
  const t = useT();
  if (armed) {
    return (
      <div className="ml-3 flex shrink-0 items-center gap-1.5">
        <button
          onClick={onConfirm}
          className="rounded-full border border-rose-500 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-300"
        >
          {t('menuConfirmDelete')}
        </button>
        <button onClick={onCancel} className="rounded-full border border-court-600 px-3 py-1 text-xs text-slate-400">
          {t('menuCancelDelete')}
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onArm}
      className="ml-3 shrink-0 rounded-full border border-court-600 px-3 py-1 text-xs text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
    >
      {t('menuDelete')}
    </button>
  );
}

export function MainMenu({ onNewCareer, onOpenAchievements }: MainMenuProps) {
  const t = useT();
  const lang = useLang();
  const setLang = useGameStore((s) => s.setLang);
  const careers = useGameStore((s) => s.careers);
  const selectCareer = useGameStore((s) => s.selectCareer);
  const deleteCareer = useGameStore((s) => s.deleteCareer);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);
  const activeCareers = careers.filter((c) => !c.retired);
  const retiredCareers = careers
    .filter((c) => c.retired)
    .map((c) => ({ career: c, sheet: computeCareerSheet(c) }))
    .sort((a, b) => b.sheet.score - a.sheet.score);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start gap-8 px-4 py-12 sm:justify-center">
      <div className="absolute right-4 top-4">
        <button
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="rounded-full border border-court-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-gold-400 hover:text-gold-400 transition-colors"
        >
          {lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-3 text-5xl">🏀</div>
        <h1 className="bg-gradient-to-r from-hoop-500 via-gold-400 to-hoop-500 bg-clip-text text-4xl font-black text-transparent">
          {t('appTitle')}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{t('appTagline')}</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewCareer}
        className="rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-10 py-3.5 text-sm font-bold text-court-950 shadow-lg shadow-hoop-500/20 hover:brightness-110 transition-all"
      >
        {t('menuNewCareer')}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={onOpenAchievements}
        className="flex items-center gap-2 rounded-full border border-court-600 px-5 py-2 text-xs font-semibold text-slate-300 hover:border-gold-400 hover:text-gold-300 transition-colors"
      >
        <span>🏅</span>
        {t('menuAchievements')}
        <span className="text-slate-500">
          {t('achievementsProgress', { unlocked: unlockedAchievements.length, total: ACHIEVEMENTS.length })}
        </span>
      </motion.button>

      <div className="w-full max-w-md">
        <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-slate-500">{t('menuYourCareers')}</h2>
        {activeCareers.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t('menuNoSaves')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeCareers
              .slice()
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between rounded-xl border border-court-600 bg-court-800/70 px-4 py-3"
                >
                  <button onClick={() => selectCareer(c.id)} className="flex-1 text-left">
                    <div className="text-sm font-bold text-slate-100">{c.playerName}</div>
                    <div className="text-xs text-slate-400">
                      {t('menuSlotSeason', { season: c.season })} · {t('menuSlotAge', { age: c.age })} · {c.currentTeam.name}
                    </div>
                  </button>
                  <DeleteButton
                    armed={armedDeleteId === c.id}
                    onArm={() => setArmedDeleteId(c.id)}
                    onConfirm={() => {
                      deleteCareer(c.id);
                      setArmedDeleteId(null);
                    }}
                    onCancel={() => setArmedDeleteId(null)}
                  />
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {retiredCareers.length > 0 && (
        <div className="w-full max-w-md">
          <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-slate-500">{t('menuLegendsWall')}</h2>
          <div className="flex flex-col gap-2">
            {retiredCareers.map(({ career: c, sheet }) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between rounded-xl border border-gold-500/20 bg-court-800/70 px-4 py-3"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{c.playerName}</span>
                    <span className={`text-xs font-black ${TIER_COLOR[sheet.tier]}`}>{sheet.tier}</span>
                  </div>
                  <div className="text-xs italic text-slate-400">“{sheet.legacyTitle[lang]}”</div>
                </div>
                <DeleteButton
                  armed={armedDeleteId === c.id}
                  onArm={() => setArmedDeleteId(c.id)}
                  onConfirm={() => {
                    deleteCareer(c.id);
                    setArmedDeleteId(null);
                  }}
                  onCancel={() => setArmedDeleteId(null)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
