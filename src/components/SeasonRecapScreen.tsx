import { motion } from 'framer-motion';
import type { Career, SeasonResult, StatKey } from '../types';
import { useLang, useT } from '../i18n/useT';
import type { DictionaryKey } from '../i18n/dictionary';

interface SeasonRecapScreenProps {
  career: Career;
  result: SeasonResult;
  onContinue: () => void;
}

const STAT_LABEL_KEYS: Record<StatKey, DictionaryKey> = {
  technique: 'statTechnique',
  physique: 'statPhysique',
  mental: 'statMental',
  iqBasket: 'statIqBasket',
  reputation: 'statReputation',
  popularite: 'statPopularite',
  moral: 'statMoral',
  forme: 'statForme',
  relationCoach: 'statRelationCoach',
  relationCoequipiers: 'statRelationCoequipiers',
  tempsDeJeu: 'statTempsDeJeu',
  risqueBlessure: 'statRisqueBlessure',
  potentiel: 'statPotentiel',
};

const INJURY_LABEL_KEYS: Record<string, DictionaryKey> = {
  cheville: 'injuryCheville',
  genou: 'injuryGenou',
  dos: 'injuryDos',
  ischio: 'injuryIschio',
  epaule: 'injuryEpaule',
  poignet: 'injuryPoignet',
};

export function SeasonRecapScreen({ career, result, onContinue }: SeasonRecapScreenProps) {
  const lang = useLang();
  const t = useT();
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
      initial={{ opacity: 0, y: 16 }}
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
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${delta >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}
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
