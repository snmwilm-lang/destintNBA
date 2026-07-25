import type { EventCategory, EventChoice, League, LocalizedText, StatRequirement } from '../types';

export interface EventTemplateSlot {
  key: string;
  pool: string[];
  /** When a pool mixes values that only make sense in some leagues (e.g. a combined pool of
   * high-school and pro opponents), this restricts each generated variant's eligible leagues
   * based on which value it actually got — so a high-school name never shows up as an opponent
   * once the player has turned pro, and vice versa. Ignored if the template already sets `leagues`. */
  leaguesForValue?: (value: string) => League[] | undefined;
}

export type EventChoiceTemplate = Omit<EventChoice, 'id'>;

export interface EventTemplate {
  id: string;
  category: EventCategory;
  title: LocalizedText;
  description: LocalizedText;
  choices: EventChoiceTemplate[];
  slots?: EventTemplateSlot[];
  /** Caps how many variants get generated; defaults to the longest slot pool (or 1). */
  variants?: number;
  requirements?: StatRequirement[];
  minSeason?: number;
  maxSeason?: number;
  minAge?: number;
  maxAge?: number;
  leagues?: League[];
  weight?: number;
  unique?: boolean;
  tags?: string[];
}

/** Shorthand for building a LocalizedText — fr first, en second. */
export function tt(fr: string, en: string): LocalizedText {
  return { fr, en };
}
