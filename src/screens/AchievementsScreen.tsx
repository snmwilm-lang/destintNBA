import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useLang, useT } from '../i18n/useT';
import { ACHIEVEMENTS } from '../data/achievements';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const t = useT();
  const lang = useLang();
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-court-600/60 bg-court-800/90 px-6 py-8 shadow-2xl shadow-black/40"
      >
        <h1 className="mb-1 text-xl font-bold text-slate-50">{t('achievementsTitle')}</h1>
        <p className="mb-1 text-xs text-slate-400">{t('achievementsSubtitle')}</p>
        <p className="mb-5 text-xs font-semibold text-gold-300">
          {t('achievementsProgress', { unlocked: unlockedAchievements.length, total: ACHIEVEMENTS.length })}
        </p>

        <div className="mb-7 flex flex-col gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-xl border px-4 py-3 ${
                  unlocked ? 'border-gold-400/40 bg-gold-400/10' : 'border-court-600 bg-court-700/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{unlocked ? '🏅' : '🔒'}</span>
                  <span className={`text-sm font-semibold ${unlocked ? 'text-gold-300' : 'text-slate-400'}`}>
                    {achievement.name[lang]}
                  </span>
                </div>
                <p className={`mt-1 text-xs ${unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                  {unlocked ? achievement.description[lang] : t('achievementsLocked')}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full rounded-full border border-court-600 px-6 py-3 text-sm font-bold text-slate-300 hover:border-gold-400 transition-colors"
        >
          {t('menuBackToMenu')}
        </button>
      </motion.div>
    </div>
  );
}
