import { motion } from 'framer-motion';
import type { Career } from '../types';
import { useLang, useT } from '../i18n/useT';
import { computeCareerSheet } from '../engine/careerEngine';
import { ACHIEVEMENTS } from '../data/achievements';
import { getTrait } from '../data/traits';

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

const TROPHY_ICON: Record<string, string> = {
  champion: '🏆',
  mvp: '🌟',
  royo: '🌱',
  scoring: '🎯',
  defense: '🛡️',
  assists: '🤝',
  fan: '📣',
};

function trophyIcon(id: string): string {
  return TROPHY_ICON[id.split('-').pop() ?? ''] ?? '🏆';
}

/** A career's trophy case: same award won in seasons 3, 7 and 12 should read as one line with a
 * count, the way a real career palmarès does — not three separate near-identical rows to scroll
 * past. */
function groupTrophies(trophies: { id: string; name: { fr: string; en: string } }[], lang: 'fr' | 'en') {
  const order: { name: string; icon: string; count: number }[] = [];
  const index = new Map<string, number>();
  for (const trophy of trophies) {
    const name = trophy.name[lang];
    const existingIndex = index.get(name);
    if (existingIndex !== undefined) {
      order[existingIndex].count += 1;
    } else {
      index.set(name, order.length);
      order.push({ name, icon: trophyIcon(trophy.id), count: 1 });
    }
  }
  return order.sort((a, b) => b.count - a.count);
}

export function EndingScreen({ career, onRestart, onBackToMenu }: EndingScreenProps) {
  const lang = useLang();
  const t = useT();
  if (!career.ending) return null;

  const sheet = computeCareerSheet(career);
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.95 }}
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

      {(career.highSchool || career.draftPick !== null) && (
        <p className="mb-6 text-xs text-slate-400">
          {career.highSchool && t('endingHighSchool', { school: career.highSchool })}
          {career.highSchool && career.draftPick !== null && ' · '}
          {career.draftPick !== null && t('endingDraftPick', { pick: career.draftPick })}
        </p>
      )}

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
            <ul className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
              {groupTrophies(sheet.trophies, lang).map((entry) => (
                <li
                  key={entry.name}
                  className="flex items-center justify-between gap-2 rounded-lg bg-court-800/50 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 font-semibold text-gold-300">
                    <span>{entry.icon}</span>
                    <span>{entry.name}</span>
                  </span>
                  <span className="font-bold tabular-nums text-slate-200">{entry.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {career.traits.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">{t('endingTraits')}</div>
            <ul className="flex flex-col gap-1">
              {career.traits.map((id) => {
                const trait = getTrait(id);
                if (!trait) return null;
                const rarityClasses =
                  trait.rarity === 'legendaire'
                    ? 'border-gold-400/50 bg-gold-400/10 text-gold-300'
                    : trait.rarity === 'rare'
                      ? 'border-sky-400/50 bg-sky-400/10 text-sky-300'
                      : 'border-slate-500/50 bg-slate-500/10 text-slate-300';
                const rarityLabel =
                  trait.rarity === 'legendaire'
                    ? t('traitRarityLegendaire')
                    : trait.rarity === 'rare'
                      ? t('traitRarityRare')
                      : t('traitRarityCommun');
                return (
                  <li key={id} className="text-sm text-sky-300">
                    <span className="font-semibold">🧬 {trait.name[lang]}</span>
                    <span className={`ml-2 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${rarityClasses}`}>
                      {rarityLabel}
                    </span>
                    <span className="text-slate-500 text-xs"> — {trait.description[lang]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">{t('endingRivalry')}</div>
          <p className="text-sm text-slate-300">
            {t('endingRivalryRecord', { rival: career.rivalName, wins: career.rivalRecord.wins, losses: career.rivalRecord.losses })}
          </p>
          {(career.rivalTeamRecord.wins > 0 || career.rivalTeamRecord.losses > 0) && (
            <p className="mt-1 text-sm text-slate-300">
              {t('endingRivalTeamRecord', {
                team: career.rivalTeamName,
                wins: career.rivalTeamRecord.wins,
                losses: career.rivalTeamRecord.losses,
              })}
            </p>
          )}
          {(career.rivalHighSchoolRecord.wins > 0 || career.rivalHighSchoolRecord.losses > 0) && (
            <p className="mt-1 text-sm text-slate-300">
              {t('endingRivalHighSchoolRecord', {
                school: career.rivalHighSchool,
                wins: career.rivalHighSchoolRecord.wins,
                losses: career.rivalHighSchoolRecord.losses,
              })}
            </p>
          )}
        </div>
      </div>

      {career.newlyUnlockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl border border-gold-400/40 bg-gold-400/10 px-5 py-4 text-left"
        >
          <div className="mb-2 text-xs uppercase tracking-wide text-gold-300">{t('endingNewAchievements')}</div>
          <ul className="flex flex-col gap-1">
            {career.newlyUnlockedAchievements.map((id) => {
              const achievement = ACHIEVEMENTS.find((a) => a.id === id);
              if (!achievement) return null;
              return (
                <li key={id} className="text-sm text-gold-200">
                  <span className="font-semibold">🏅 {achievement.name[lang]}</span> — {achievement.description[lang]}
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}

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
