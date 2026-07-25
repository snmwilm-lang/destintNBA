import type { PlayerStats, StatKey } from '../types';

export const STAT_KEYS: StatKey[] = [
  'technique',
  'physique',
  'mental',
  'iqBasket',
  'reputation',
  'popularite',
  'moral',
  'forme',
  'relationCoach',
  'relationCoequipiers',
  'tempsDeJeu',
  'risqueBlessure',
  'potentiel',
];

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyEffects(stats: PlayerStats, effects?: Partial<Record<StatKey, number>>): PlayerStats {
  if (!effects) return stats;
  const next = { ...stats };
  for (const key of Object.keys(effects) as StatKey[]) {
    const delta = effects[key] ?? 0;
    // Diminishing returns near the ceiling — the last points of any stat take real, sustained
    // excellence to earn, not just repetition. Negative effects always apply at full strength.
    const resistance = delta > 0 ? Math.max(0.25, 1 - (Math.max(0, next[key] - 70) / 30) * 0.75) : 1;
    next[key] = clampStat(next[key] + delta * resistance);
  }
  return next;
}

export function initialStats(archetypeBoost: Partial<Record<StatKey, number>>): PlayerStats {
  const base: PlayerStats = {
    technique: 35,
    physique: 35,
    mental: 40,
    iqBasket: 35,
    reputation: 10,
    popularite: 8,
    moral: 65,
    forme: 80,
    relationCoach: 55,
    relationCoequipiers: 55,
    tempsDeJeu: 20,
    risqueBlessure: 15,
    potentiel: 55,
  };
  return applyEffects(base, archetypeBoost);
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function weightedPick<T>(items: T[], weightFn: (item: T) => number): T | null {
  const weights = items.map(weightFn).map((w) => Math.max(0, w));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0 || items.length === 0) return null;
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}
