import { motion } from 'framer-motion';
import type { Career, Team } from '../types';
import { useLang, useT } from '../i18n/useT';
import { computeMarketValue, estimateSalary, seasonsPlayedInLeague } from '../engine/careerEngine';
import { leagueBadge } from '../i18n/statLabels';

interface TransferOffersScreenProps {
  career: Career;
  offers: Team[];
  onChoose: (team: Team | null) => void;
}

export function TransferOffersScreen({ career, offers, onChoose }: TransferOffersScreenProps) {
  const lang = useLang();
  const t = useT();
  const currency = lang === 'fr' ? 'fr-FR' : 'en-US';

  const cards: { team: Team | null; label: string }[] = [
    { team: null, label: t('offersStay', { team: career.currentTeam.name }) },
    ...offers.map((team) => ({ team, label: team.name })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl rounded-3xl border border-court-600/60 bg-court-800/90 shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-emerald-700 to-court-600 px-6 py-4 text-left">
        <h2 className="text-lg font-bold text-white">{t('offersTitle')}</h2>
        <p className="text-xs text-emerald-100/90">{t('offersIntro')}</p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-3">
        {cards.map(({ team, label }, i) => {
          const isStay = team === null;
          const displayTeam = team ?? career.currentTeam;
          const projectedValue = computeMarketValue(career.stats, career.age, displayTeam.league);
          const nbaServiceYears = displayTeam.league === 'nba' ? seasonsPlayedInLeague(career, 'nba') : undefined;
          const salary = estimateSalary(projectedValue, displayTeam, nbaServiceYears);
          return (
            <motion.div
              key={team?.id ?? 'stay'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-court-600 bg-court-700/50 px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-100">{label}</span>
                <span className="text-[10px] uppercase text-slate-400">{leagueBadge(displayTeam.league, lang)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-4">
                <div>
                  <div className="text-slate-500">{t('offersSalary')}</div>
                  <div className="font-semibold text-emerald-300">{t('commonMoney', { amount: salary.toLocaleString(currency) })}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t('offersAmbition')}</div>
                  <div className="font-semibold text-gold-300">{displayTeam.ambition}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t('offersExposure')}</div>
                  <div className="font-semibold text-fuchsia-300">{displayTeam.mediaExposure}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t('offersCoach')}</div>
                  <div className="font-semibold text-sky-300">{displayTeam.coachQuality}</div>
                </div>
              </div>
              <button
                onClick={() => onChoose(team)}
                className="mt-3 w-full rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-4 py-2 text-xs font-bold text-court-950 hover:brightness-110 transition-all"
              >
                {isStay ? label : t('offersSign')}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
