import type { StatKey } from '../types';
import type { DictionaryKey } from './dictionary';

export const STAT_LABEL_KEYS: Record<StatKey, DictionaryKey> = {
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

export const INJURY_LABEL_KEYS: Record<string, DictionaryKey> = {
  cheville: 'injuryCheville',
  genou: 'injuryGenou',
  dos: 'injuryDos',
  ischio: 'injuryIschio',
  epaule: 'injuryEpaule',
  poignet: 'injuryPoignet',
};

/**
 * For most stats, higher is better — but a few are inverted (e.g. injury risk),
 * so "went down" should still read as green, not red.
 */
const INVERTED_STATS: Partial<Record<StatKey, true>> = {
  risqueBlessure: true,
};

export function isGoodDelta(stat: StatKey, delta: number): boolean {
  const positive = delta >= 0;
  return INVERTED_STATS[stat] ? !positive : positive;
}
