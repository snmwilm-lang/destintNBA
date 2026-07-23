import type { EventCategory } from '../types';
import type { DictionaryKey } from '../i18n/dictionary';

export const CATEGORY_META: Record<EventCategory, { icon: string; labelKey: DictionaryKey; colorClass: string }> = {
  match: { icon: '🏀', labelKey: 'catMatch', colorClass: 'from-hoop-600 to-hoop-500' },
  entrainement: { icon: '💪', labelKey: 'catEntrainement', colorClass: 'from-sky-600 to-sky-500' },
  coach: { icon: '📋', labelKey: 'catCoach', colorClass: 'from-indigo-600 to-indigo-500' },
  mercato: { icon: '💼', labelKey: 'catMercato', colorClass: 'from-emerald-600 to-emerald-500' },
  blessure: { icon: '🩹', labelKey: 'catBlessure', colorClass: 'from-rose-700 to-rose-500' },
  nutrition: { icon: '🥗', labelKey: 'catNutrition', colorClass: 'from-lime-600 to-lime-500' },
  musculation: { icon: '🏋️', labelKey: 'catMusculation', colorClass: 'from-orange-600 to-orange-500' },
  sponsors: { icon: '🤝', labelKey: 'catSponsors', colorClass: 'from-gold-500 to-gold-400' },
  reseaux: { icon: '📱', labelKey: 'catReseaux', colorClass: 'from-fuchsia-600 to-fuchsia-500' },
  famille: { icon: '👪', labelKey: 'catFamille', colorClass: 'from-amber-600 to-amber-500' },
  relations: { icon: '💬', labelKey: 'catRelations', colorClass: 'from-teal-600 to-teal-500' },
  conflits: { icon: '⚡', labelKey: 'catConflits', colorClass: 'from-red-700 to-red-500' },
  presse: { icon: '📰', labelKey: 'catPresse', colorClass: 'from-slate-600 to-slate-500' },
  selectionNationale: { icon: '🌍', labelKey: 'catSelectionNationale', colorClass: 'from-blue-700 to-blue-500' },
  playoffs: { icon: '🔥', labelKey: 'catPlayoffs', colorClass: 'from-hoop-600 to-gold-500' },
  finale: { icon: '🏆', labelKey: 'catFinale', colorClass: 'from-gold-500 to-hoop-500' },
  draft: { icon: '🎙️', labelKey: 'catDraft', colorClass: 'from-purple-700 to-purple-500' },
  allStar: { icon: '✨', labelKey: 'catAllStar', colorClass: 'from-gold-400 to-fuchsia-500' },
  jeuxOlympiques: { icon: '🥇', labelKey: 'catJeuxOlympiques', colorClass: 'from-blue-600 to-gold-400' },
  coupeDuMonde: { icon: '🌐', labelKey: 'catCoupeDuMonde', colorClass: 'from-emerald-700 to-blue-500' },
};
