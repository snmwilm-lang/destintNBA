import { motion } from 'framer-motion';
import type { LocalizedText } from '../types';
import { useLang, useT } from '../i18n/useT';

interface ChoiceResultCardProps {
  text: LocalizedText | null;
  onContinue: () => void;
}

export function ChoiceResultCard({ text, onContinue }: ChoiceResultCardProps) {
  const lang = useLang();
  const t = useT();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg rounded-3xl border border-gold-500/40 bg-court-800/90 px-6 py-8 text-center shadow-2xl shadow-black/40"
    >
      <div className="mb-4 text-3xl">🏀</div>
      <p className="mb-6 text-sm leading-relaxed text-slate-200">{text ? text[lang] : ''}</p>
      <button
        onClick={onContinue}
        className="rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-8 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
      >
        {t('eventContinue')}
      </button>
    </motion.div>
  );
}
