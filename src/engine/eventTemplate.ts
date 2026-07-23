import type { EventCategory, EventChoice, League, LocalizedText, StatRequirement } from '../types';

export interface EventTemplateSlot {
  key: string;
  pool: string[];
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
