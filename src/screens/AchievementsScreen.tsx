import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useLang, useT } from '../i18n/useT';
import { ACHIEVEMENTS } from '../data/achievements';
import { pickDailyChallenges, todayKey } from '../data/dailyChallenges';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const t = useT();
  const lang = useLang();
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const dailyChallengeDate = useGameStore((s) => s.dailyChallengeDate);
  const dailyProgress = useGameStore((s) => s.dailyProgress);
  const dailyClaimedIds = useGameStore((s) => s.dailyClaimedIds);
  const checkDailyReset = useGameStore((s) => s.checkDailyReset);

  // The set only rolls over on read (avoids a background timer) — make sure it's fresh the
  // moment this screen is actually looked at, in case a real day passed since the last action.
  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  const isCurrent = dailyChallengeDate === todayKey();
  const dailyChallenges = pickDailyChallenges(todayKey());
  const progress = isCurrent ? dailyProgress : {};
  const claimed = isCurrent ? dailyClaimedIds : [];

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-court-600/60 bg-court-800/90 px-6 py-8 shadow-2xl shadow-black/40"
      >
        <h1 className="mb-1 text-xl font-bold text-slate-50">{t('dailyChallengesTitle')}</h1>
        <p className="mb-5 text-xs text-slate-400">{t('dailyChallengesSubtitle')}</p>

        <div className="mb-7 flex flex-col gap-2">
          {dailyChallenges.map((challenge) => {
            const current = Math.min(challenge.target, progress[challenge.metric] ?? 0);
            const done = claimed.includes(challenge.id);
            return (
              <div
                key={challenge.id}
                className={`rounded-xl border px-4 py-3 ${done ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-court-600 bg-court-700/30'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{done ? '✅' : '🎯'}</span>
                    <span className={`text-sm font-semibold ${done ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {challenge.name[lang]}
                    </span>
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-400">
                    {current.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}/{challenge.target.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{challenge.description[lang]}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-court-600/60">
                  <div
                    className={`h-full rounded-full ${done ? 'bg-emerald-400' : 'bg-gold-400'}`}
                    style={{ width: `${(current / challenge.target) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mb-1 text-lg font-bold text-slate-50">{t('achievementsTitle')}</h2>
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
                <p className={`mt-1 text-xs ${unlocked ? 'text-slate-300' : 'text-slate-500'}`}>{achievement.description[lang]}</p>
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
