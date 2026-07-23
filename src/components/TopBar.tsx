import type { Career } from '../types';
import { useGameStore } from '../store/gameStore';
import { useT } from '../i18n/useT';
import { StatBar } from './StatBar';

interface TopBarProps {
  career: Career;
  onOpenMenu: () => void;
}

export function TopBar({ career, onOpenMenu }: TopBarProps) {
  const t = useT();
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);

  return (
    <div className="sticky top-0 z-20 border-b border-court-700/80 bg-court-950/90 backdrop-blur px-4 py-3">
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hoop-500 to-gold-500 text-sm font-bold text-court-950">
              🏀
            </div>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-semibold text-slate-100">{career.playerName}</div>
              <div className="truncate text-xs text-slate-400">
                {t('hudTeam', { team: career.currentTeam.name })} · {t('hudSeason', { season: career.season })} ·{' '}
                {t('hudAge', { age: career.age })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="rounded-full bg-court-800 px-3 py-1 text-xs font-semibold text-gold-400">
              {t('commonMoney', { amount: career.argent.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') })}
            </div>
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="rounded-full border border-court-600 px-2 py-1 text-xs font-semibold text-slate-300 hover:border-gold-400 hover:text-gold-400 transition-colors"
              aria-label={t('menuLanguage')}
            >
              {lang === 'fr' ? 'FR' : 'EN'}
            </button>
            <button
              onClick={onOpenMenu}
              className="rounded-full border border-court-600 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-hoop-500 hover:text-hoop-500 transition-colors"
            >
              {t('hudMenu')}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <StatBar label={t('statForme')} value={career.stats.forme} colorClass="bg-emerald-400" icon="⚡" />
          <StatBar label={t('statMoral')} value={career.stats.moral} colorClass="bg-sky-400" icon="🙂" />
          <StatBar label={t('statReputation')} value={career.stats.reputation} colorClass="bg-gold-400" icon="⭐" />
          <StatBar label={t('statPopularite')} value={career.stats.popularite} colorClass="bg-fuchsia-400" icon="📣" />
        </div>
      </div>
    </div>
  );
}
