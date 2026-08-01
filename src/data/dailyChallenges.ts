import type { LocalizedText } from '../types';

export type DailyChallengeMetric =
  | 'choicesMade'
  | 'successfulRisks'
  | 'seasonsCompleted'
  | 'trophiesWon'
  | 'moneyEarned'
  | 'recordsBroken'
  | 'skillsTrained';

export interface DailyChallengeTemplate {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  metric: DailyChallengeMetric;
  target: number;
}

export const DAILY_CHALLENGE_POOL: DailyChallengeTemplate[] = [
  {
    id: 'daily-choices-5',
    name: { fr: 'Petit échauffement', en: 'Warm-up' },
    description: { fr: 'Fais 5 choix.', en: 'Make 5 choices.' },
    metric: 'choicesMade',
    target: 5,
  },
  {
    id: 'daily-choices-15',
    name: { fr: 'Grosse session', en: 'Long session' },
    description: { fr: 'Fais 15 choix.', en: 'Make 15 choices.' },
    metric: 'choicesMade',
    target: 15,
  },
  {
    id: 'daily-risk-3',
    name: { fr: 'Joueur de risque', en: 'Risk taker' },
    description: { fr: 'Réussis 3 choix risqués.', en: 'Succeed at 3 risky choices.' },
    metric: 'successfulRisks',
    target: 3,
  },
  {
    id: 'daily-risk-6',
    name: { fr: 'Sang-froid', en: 'Ice in your veins' },
    description: { fr: 'Réussis 6 choix risqués.', en: 'Succeed at 6 risky choices.' },
    metric: 'successfulRisks',
    target: 6,
  },
  {
    id: 'daily-season-1',
    name: { fr: 'Une saison de plus', en: 'One more season' },
    description: { fr: 'Termine une saison.', en: 'Finish a season.' },
    metric: 'seasonsCompleted',
    target: 1,
  },
  {
    id: 'daily-season-2',
    name: { fr: 'Marathon', en: 'Marathon' },
    description: { fr: 'Termine 2 saisons.', en: 'Finish 2 seasons.' },
    metric: 'seasonsCompleted',
    target: 2,
  },
  {
    id: 'daily-trophy-1',
    name: { fr: 'Vitrine à trophées', en: 'Trophy case' },
    description: { fr: 'Remporte un trophée cette saison.', en: 'Win a trophy this season.' },
    metric: 'trophiesWon',
    target: 1,
  },
  {
    id: 'daily-money-500000',
    name: { fr: 'Gros contrat', en: 'Big paycheck' },
    description: { fr: 'Gagne 500 000 € de salaire sur une saison.', en: 'Earn €500,000 in salary in a single season.' },
    metric: 'moneyEarned',
    target: 500_000,
  },
  {
    id: 'daily-record-1',
    name: { fr: 'Entrée dans les livres', en: 'Into the record books' },
    description: { fr: 'Bats un record historique de la ligue en un match.', en: "Break a league single-game record." },
    metric: 'recordsBroken',
    target: 1,
  },
  {
    id: 'daily-skill-1',
    name: { fr: 'Travail spécifique', en: 'Specialized work' },
    description: { fr: 'Progresse dans une compétence spécialisée (Dunk, Tir, Passe ou Défense).', en: 'Improve a specialty skill (Dunk, Shoot, Pass, or Def).' },
    metric: 'skillsTrained',
    target: 1,
  },
  {
    id: 'daily-skill-2',
    name: { fr: 'Double séance', en: 'Double session' },
    description: { fr: 'Progresse 2 fois dans tes compétences spécialisées.', en: 'Improve your specialty skills 2 times.' },
    metric: 'skillsTrained',
    target: 2,
  },
];

/** Picks a stable but different set of 3 challenges for the given day, so everyone playing the
 * same day sees the same set, and it changes automatically at each new day. */
export function pickDailyChallenges(dateKey: string): DailyChallengeTemplate[] {
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
  const pool = [...DAILY_CHALLENGE_POOL];
  const picked: DailyChallengeTemplate[] = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const index = seed % pool.length;
    picked.push(pool[index]);
    pool.splice(index, 1);
  }
  return picked;
}

/** Today's date key in the player's local timezone, e.g. "2026-07-25" — changes at local midnight. */
export function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
