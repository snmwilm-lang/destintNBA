import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useLang, useT } from '../i18n/useT';

interface MainMenuProps {
  onNewCareer: () => void;
}

export function MainMenu({ onNewCareer }: MainMenuProps) {
  const t = useT();
  const lang = useLang();
  const setLang = useGameStore((s) => s.setLang);
  const careers = useGameStore((s) => s.careers);
  const selectCareer = useGameStore((s) => s.selectCareer);
  const deleteCareer = useGameStore((s) => s.deleteCareer);

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

      <div className="w-full max-w-md">
        <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-slate-500">{t('menuYourCareers')}</h2>
        {careers.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t('menuNoSaves')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {careers
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
                  <button
                    onClick={() => {
                      if (window.confirm(t('menuDeleteConfirm'))) deleteCareer(c.id);
                    }}
                    className="ml-3 shrink-0 rounded-full border border-court-600 px-3 py-1 text-xs text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                  >
                    {t('menuDelete')}
                  </button>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
