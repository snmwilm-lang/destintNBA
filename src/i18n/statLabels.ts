import type { Lang, League, StatKey } from '../types';
import type { DictionaryKey } from './dictionary';

// Short league badge text — 'nba' is the internal id (used across code, teams, etc.) but must
// never surface to players as "NBA" for trademark reasons, so it's abbreviated to HL (Hooper
// League) wherever a compact badge is needed.
const LEAGUE_BADGE: Record<League, Record<Lang, string>> = {
  lycee: { fr: 'LYCÉE', en: 'HIGH SCHOOL' },
  ncaa: { fr: 'NCAA', en: 'NCAA' },
  nba: { fr: 'HL', en: 'HL' },
  europe: { fr: 'EUROPE', en: 'EUROPE' },
  gLeague: { fr: 'G LEAGUE', en: 'G LEAGUE' },
};

export function leagueBadge(league: League, lang: Lang): string {
  return LEAGUE_BADGE[league]?.[lang] ?? league.toUpperCase();
}

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
