import { AnimatePresence, motion } from 'framer-motion';
import type { GameEvent } from '../types';
import { useLang, useT } from '../i18n/useT';
import { CATEGORY_META } from './categoryMeta';

interface EventCardProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
  progressLabel: string;
}

export function EventCard({ event, onChoose, progressLabel }: EventCardProps) {
  const lang = useLang();
  const t = useT();
  const meta = CATEGORY_META[event.category];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-court-600/60 bg-court-800/90 shadow-2xl shadow-black/40"
      >
        <div className={`bg-gradient-to-r ${meta.colorClass} px-5 py-3 flex items-center justify-between`}>
          <span className="flex items-center gap-2 text-sm font-bold text-white/95">
            <span className="text-lg">{meta.icon}</span>
            {t(meta.labelKey)}
          </span>
          <span className="text-xs font-medium text-white/80">{progressLabel}</span>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-slate-50 mb-3 text-left">{event.title[lang]}</h2>
          <p className="text-sm leading-relaxed text-slate-300 text-left mb-6">{event.description[lang]}</p>

          <div className="flex flex-col gap-3">
            {event.choices.map((choice, i) => (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i + 0.1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose(choice.id)}
                className="rounded-xl border border-court-600 bg-court-700/70 px-4 py-3 text-left text-sm font-semibold text-slate-100 hover:border-gold-400 hover:bg-court-700 transition-colors"
              >
                {choice.label[lang]}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
