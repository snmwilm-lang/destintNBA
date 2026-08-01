import { motion } from 'framer-motion';
import type { Career, SeasonResult, StatKey } from '../types';
import { useLang, useT } from '../i18n/useT';
import type { DictionaryKey } from '../i18n/dictionary';
import { INJURY_LABEL_KEYS, isGoodDelta, STAT_LABEL_KEYS } from '../i18n/statLabels';
import { CONDITIONING_STATS, TRAINABLE_STATS } from '../engine/careerEngine';
import { useGameStore } from '../store/gameStore';
import { getTrait } from '../data/traits';
import { StatBar } from './StatBar';

interface SeasonRecapScreenProps {
  career: Career;
  result: SeasonResult;
  onContinue: () => void;
}

export function SeasonRecapScreen({ career, result, onContinue }: SeasonRecapScreenProps) {
  const lang = useLang();
  const t = useT();
  const spendPoint = useGameStore((s) => s.spendPoint);
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  const statRows: [DictionaryKey, string][] = [
    ['recapMatchs', String(result.statLine.matchs)],
    ['recapPoints', result.statLine.points.toFixed(1)],
    ['recapRebonds', result.statLine.rebonds.toFixed(1)],
    ['recapPasses', result.statLine.passes.toFixed(1)],
    ['recapInterceptions', result.statLine.interceptions.toFixed(1)],
    ['recapContres', result.statLine.contres.toFixed(1)],
    ['recapAdresse3', `${result.statLine.adresse3pts.toFixed(1)}%`],
    ['recapNoteMoyenne', `${result.statLine.noteMoyenne.toFixed(1)}/10`],
  ];

  const progressionEntries = Object.entries(result.statDeltas) as [StatKey, number][];

  return (
    <motion.div
      initial={{ opacity: 1, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl rounded-3xl border border-court-600/60 bg-court-800/90 shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-court-700 to-court-600 px-6 py-4 text-left">
        <h2 className="text-lg font-bold text-gold-400">{t('recapTitle', { season: result.season })}</h2>
        <p className="text-xs text-slate-300">
          {career.currentTeam.name} · {t('recapClassementValue', { rank: result.classementRank, total: result.classementTotal })}
        </p>
      </div>

      <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {result.classementRank === 1 && (
          <div className="col-span-2 sm:col-span-3 rounded-xl border border-gold-400/60 bg-gold-400/15 px-4 py-3 text-left">
            <span className="text-base font-bold text-gold-300">
              {t('recapChampionBanner', { team: career.currentTeam.name })}
            </span>
          </div>
        )}
        {result.vintageSeason && (
          <div className="col-span-2 sm:col-span-3 rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-2.5 text-left">
            <span className="text-sm font-bold text-gold-300">🌟 {t('recapVintageSeason')}</span>
          </div>
        )}
        {career.newlyUnlockedTraits.map((id) => {
          const trait = getTrait(id);
          if (!trait) return null;
          const borderClasses =
            trait.rarity === 'legendaire' ? 'border-gold-400/50 bg-gold-400/10' : 'border-sky-400/40 bg-sky-400/10';
          const labelClasses = trait.rarity === 'legendaire' ? 'text-gold-300' : 'text-sky-300';
          const nameClasses = trait.rarity === 'legendaire' ? 'text-gold-200' : 'text-sky-200';
          const rarityLabel =
            trait.rarity === 'legendaire'
              ? t('traitRarityLegendaire')
              : trait.rarity === 'rare'
                ? t('traitRarityRare')
                : t('traitRarityCommun');
          return (
            <div key={id} className={`col-span-2 sm:col-span-3 rounded-xl border px-4 py-2.5 text-left ${borderClasses}`}>
              <div className={`text-xs uppercase tracking-wide ${labelClasses}`}>
                {t('recapNewTraits')} · {rarityLabel}
              </div>
              <div className={`text-sm font-bold ${nameClasses}`}>🧬 {trait.name[lang]}</div>
              <div className="text-xs text-slate-300">{trait.description[lang]}</div>
            </div>
          );
        })}
        <section className="col-span-2 sm:col-span-3">
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapStatLine')}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statRows.map(([key, value]) => (
              <div key={key} className="rounded-lg bg-court-700/60 px-3 py-2 text-left">
                <div className="text-[10px] uppercase text-slate-400">{t(key)}</div>
                <div className="text-sm font-bold text-slate-100 tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-2 sm:col-span-3 text-left">
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapTrophies')}</h3>
          {result.trophies.length === 0 ? (
            <p className="text-sm text-slate-400">{t('recapNoTrophies')}</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {result.trophies.map((trophy) => (
                <li key={trophy.id} className="flex items-center gap-2 text-sm text-gold-300">
                  <span>🏆</span>
                  <span className="font-semibold">{trophy.name[lang]}</span>
                  <span className="text-slate-400 text-xs">— {trophy.description[lang]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {(career.rivalRecord.wins > 0 ||
          career.rivalRecord.losses > 0 ||
          career.rivalTeamRecord.wins > 0 ||
          career.rivalTeamRecord.losses > 0) && (
          <section className="col-span-2 sm:col-span-3 text-left">
            <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapRivalryTitle')}</h3>
            <div className="flex flex-col gap-2">
              {(career.rivalRecord.wins > 0 || career.rivalRecord.losses > 0) && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm text-slate-200">
                  {t('endingRivalryRecord', { rival: career.rivalName, wins: career.rivalRecord.wins, losses: career.rivalRecord.losses })}
                </div>
              )}
              {(career.rivalTeamRecord.wins > 0 || career.rivalTeamRecord.losses > 0) && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm text-slate-200">
                  {t('endingRivalTeamRecord', { team: career.rivalTeamName, wins: career.rivalTeamRecord.wins, losses: career.rivalTeamRecord.losses })}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="col-span-2 sm:col-span-3 text-left">
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapPress')}</h3>
          <div className="flex flex-col gap-2">
            {result.pressArticles.map((article) => (
              <div key={article.id} className="rounded-lg border border-court-600 bg-court-700/40 px-3 py-2">
                <div className="text-sm font-semibold text-slate-100">{article.headline[lang]}</div>
                <div className="text-xs text-slate-400">{article.body[lang]}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-lg bg-court-700/60 px-3 py-2 text-left">
          <div className="text-[10px] uppercase text-slate-400">{t('recapPopularity')}</div>
          <div className="text-sm font-bold text-fuchsia-300">{Math.round(result.popularite)}</div>
        </div>
        <div className="rounded-lg bg-court-700/60 px-3 py-2 text-left">
          <div className="text-[10px] uppercase text-slate-400">{t('recapSalary')}</div>
          <div className="text-sm font-bold text-emerald-300">
            {t('commonMoney', { amount: result.salaire.toLocaleString(currency) })}
          </div>
        </div>
        <div className="rounded-lg bg-court-700/60 px-3 py-2 text-left">
          <div className="text-[10px] uppercase text-slate-400">{t('recapMarketValue')}</div>
          <div className="text-sm font-bold text-gold-300">
            {t('commonMoney', { amount: result.valeurMarchande.toLocaleString(currency) })}
          </div>
        </div>

        <section className="col-span-2 sm:col-span-3 text-left">
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapProgression')}</h3>
          {progressionEntries.length === 0 ? (
            <p className="text-sm text-slate-400">—</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {progressionEntries.map(([key, delta]) => (
                <span
                  key={key}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isGoodDelta(key, delta) ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}
                >
                  {t(STAT_LABEL_KEYS[key])} {delta >= 0 ? '+' : ''}
                  {delta}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="col-span-2 sm:col-span-3 text-left">
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">{t('recapInjuries')}</h3>
          {result.blessures.length === 0 ? (
            <p className="text-sm text-slate-400">{t('recapNoInjuries')}</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {result.blessures.map((injury, i) => (
                <li key={i} className="text-sm text-rose-300">
                  {t(INJURY_LABEL_KEYS[injury.key])} — {t('injuryWeeks', { weeks: injury.weeksOut })}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="col-span-2 sm:col-span-3 text-left">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs uppercase tracking-wide text-slate-400">{t('recapTraining')}</h3>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-xs font-bold text-sky-300 tabular-nums">
                {t('recapPotentiel', { value: career.stats.potentiel })}
              </span>
              <span className="rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs font-bold text-gold-300 tabular-nums">
                {t('recapPointsAvailable', { count: career.skillPoints })}
              </span>
            </div>
          </div>
          {result.skillPointsEarned > 0 && (
            <p className="mb-2 text-xs text-emerald-300">{t('recapPointsEarned', { count: result.skillPointsEarned })}</p>
          )}
          <p className="mb-2 text-xs text-slate-500">{t('recapPotentielExplain', { value: career.stats.potentiel })}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TRAINABLE_STATS.map((stat) => {
              const maxed = career.stats[stat] >= career.stats.potentiel;
              return (
                <button
                  key={stat}
                  onClick={() => spendPoint(stat)}
                  disabled={career.skillPoints <= 0 || maxed}
                  className="rounded-lg border border-court-600 bg-court-700/50 px-3 py-2 text-left transition-colors enabled:hover:border-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="text-[10px] uppercase text-slate-400">{t(STAT_LABEL_KEYS[stat])}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100 tabular-nums">{career.stats[stat]}</span>
                    <span className={`text-xs font-bold ${maxed ? 'text-slate-500' : 'text-emerald-400'}`}>
                      {maxed ? t('recapStatCapped') : '+1'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 mb-2 text-[11px] text-slate-500">{t('recapConditioningHint')}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CONDITIONING_STATS.map((stat) => (
              <button
                key={stat}
                onClick={() => spendPoint(stat)}
                disabled={career.skillPoints <= 0 || career.stats[stat] >= 100}
                className="rounded-lg border border-court-600 bg-court-700/30 px-3 py-2 text-left transition-colors enabled:hover:border-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div className="text-[10px] uppercase text-slate-400">{t(STAT_LABEL_KEYS[stat])}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-100 tabular-nums">{career.stats[stat]}</span>
                  <span className="text-xs font-bold text-emerald-400">+1</span>
                </div>
              </button>
            ))}
          </div>
          <h3 className="mt-4 mb-2 text-xs uppercase tracking-wide text-slate-400">{t('recapSpecialtySkills')}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBar label={t('skillDunk')} value={career.skillDunk} max={10} colorClass="bg-orange-400" icon="🏀" />
            <StatBar label={t('skillShoot')} value={career.skillShoot} max={10} colorClass="bg-sky-400" icon="🎯" />
            <StatBar label={t('skillPass')} value={career.skillPass} max={10} colorClass="bg-emerald-400" icon="🤝" />
            <StatBar label={t('skillDef')} value={career.skillDef} max={10} colorClass="bg-rose-400" icon="🛡️" />
          </div>
        </section>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onContinue}
          className="w-full rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-8 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
        >
          {t('recapContinue')}
        </button>
      </div>
    </motion.div>
  );
}
