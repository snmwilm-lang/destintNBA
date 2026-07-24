// Core domain types for the career mode.

export type Lang = 'fr' | 'en';

/** Text available in both supported languages. */
export interface LocalizedText {
  fr: string;
  en: string;
}

export type StatKey =
  | 'technique'
  | 'physique'
  | 'mental'
  | 'iqBasket'
  | 'reputation'
  | 'popularite'
  | 'moral'
  | 'forme'
  | 'relationCoach'
  | 'relationCoequipiers'
  | 'tempsDeJeu'
  | 'risqueBlessure'
  | 'potentiel';

/** Bounded 0-100 attributes that drive the simulation. */
export type PlayerStats = Record<StatKey, number>;

export type EventCategory =
  | 'match'
  | 'entrainement'
  | 'coach'
  | 'mercato'
  | 'blessure'
  | 'nutrition'
  | 'musculation'
  | 'sponsors'
  | 'reseaux'
  | 'famille'
  | 'relations'
  | 'conflits'
  | 'presse'
  | 'selectionNationale'
  | 'playoffs'
  | 'finale'
  | 'draft'
  | 'allStar'
  | 'jeuxOlympiques'
  | 'coupeDuMonde';

export type League = 'lycee' | 'ncaa' | 'nba' | 'europe' | 'gLeague';

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

/** A build id, e.g. 'pg-floor-general' — one of five position-specific builds per position. */
export type Archetype = string;

/** A delayed effect fires N seasons (or events) after the choice was made. */
export interface DelayedEffect {
  delaySeasons: number;
  effects: Partial<Record<StatKey, number>>;
  note?: string;
}

export interface StatRequirement {
  stat: StatKey;
  min?: number;
  max?: number;
}

export interface EventChoice {
  id: string;
  label: LocalizedText;
  /** Short flavor text shown after the choice is made. */
  resultText?: LocalizedText;
  /** Immediate stat deltas applied right away. */
  effects?: Partial<Record<StatKey, number>>;
  /** Effects applied later, simulating hidden long-term consequences. */
  delayedEffects?: DelayedEffect[];
  /** Money delta (can be independent from stats). */
  moneyDelta?: number;
  /** If present, outcome is rolled using these stats + luck instead of flat effects. */
  successChance?: {
    baseChance: number;
    statBonus?: Partial<Record<StatKey, number>>; // weight per point of stat above 50
    onSuccess: Partial<Record<StatKey, number>>;
    onFailure: Partial<Record<StatKey, number>>;
    successText?: LocalizedText;
    failureText?: LocalizedText;
  };
}

export interface GameEvent {
  id: string;
  category: EventCategory;
  title: LocalizedText;
  description: LocalizedText;
  choices: EventChoice[];
  /** Optional gating so an event only appears when plausible. */
  requirements?: StatRequirement[];
  minSeason?: number;
  maxSeason?: number;
  minAge?: number;
  maxAge?: number;
  leagues?: League[];
  /** Higher weight = more frequent draw. */
  weight?: number;
  /** Marks unique story beats that should not repeat. */
  unique?: boolean;
  tags?: string[];
}

export interface Trophy {
  id: string;
  name: LocalizedText;
  season: number;
  description: LocalizedText;
}

export interface PressArticle {
  id: string;
  season: number;
  headline: LocalizedText;
  body: LocalizedText;
  tone: 'positif' | 'neutre' | 'negatif';
}

export type InjuryKey = 'cheville' | 'genou' | 'dos' | 'ischio' | 'epaule' | 'poignet';

export interface InjuryRecord {
  key: InjuryKey;
  weeksOut: number;
  season: number;
}

export interface Team {
  id: string;
  name: string;
  league: League;
  city: string;
  ambition: number; // 0-100
  mediaExposure: number; // 0-100
  coachQuality: number; // 0-100
  salaryBudget: number; // relative scale
}

export interface TransferOffer {
  teamId: string;
  teamName: string;
  league: League;
  salary: number;
  tempsDeJeuPromis: number;
  ambition: number;
  exposureMedia: number;
  qualiteCoach: number;
}

export interface SeasonStatLine {
  matchs: number;
  points: number;
  rebonds: number;
  passes: number;
  interceptions: number;
  contres: number;
  adresse3pts: number;
  noteMoyenne: number;
}

export interface SeasonResult {
  season: number;
  age: number;
  team: string;
  league: League;
  statLine: SeasonStatLine;
  classementRank: number;
  classementTotal: number;
  trophies: Trophy[];
  pressArticles: PressArticle[];
  popularite: number;
  salaire: number;
  valeurMarchande: number;
  statDeltas: Partial<Record<StatKey, number>>;
  blessures: InjuryRecord[];
  transferOffers: TransferOffer[];
  skillPointsEarned: number;
}

export type EndingType =
  | 'legende'
  | 'halloffame'
  | 'europe'
  | 'declin'
  | 'retraiteAnticipee'
  | 'carriereHonnete'
  | 'echec';

export interface CareerEnding {
  type: EndingType;
  title: LocalizedText;
  description: LocalizedText;
}

export interface PendingChoiceLog {
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceLabel: string;
  season: number;
}

export type CareerPhase = 'event' | 'choiceResult' | 'seasonRecap' | 'transferOffers' | 'ended';

export interface Career {
  id: string;
  createdAt: number;
  updatedAt: number;
  playerName: string;
  age: number;
  archetype: Archetype;
  position: Position;
  /** Height in centimeters, chosen at creation within the position's realistic range. */
  height: number;
  /** NBA specialty picked once the player reaches the league — null until then. */
  specialty: LocalizedText | null;
  /** Earned through good seasons; the player spends them to directly train up a skill. */
  skillPoints: number;
  season: number;
  eventInSeasonIndex: number;
  eventsPerSeason: number;
  stats: PlayerStats;
  argent: number;
  valeurMarchande: number;
  currentTeam: Team;
  history: SeasonResult[];
  trophies: Trophy[];
  pressArticles: PressArticle[];
  /** Permanently used unique/milestone event ids (never redrawn). */
  seenEventIds: string[];
  /** Event ids already drawn this season (reset every season, avoids repeats). */
  usedThisSeasonIds: string[];
  /** Rolling history of recently-drawn base event templates, used to space out repeat beats. */
  recentEventIds: string[];
  pendingDelayed: { effect: DelayedEffect; triggerSeason: number }[];
  choiceLog: PendingChoiceLog[];
  retired: boolean;
  ending: CareerEnding | null;
  phase: CareerPhase;
  currentEventId: string | null;
  lastChoiceResultText: LocalizedText | null;
  /** Visible immediate stat impact of the last choice, shown to the player right after picking. */
  lastChoiceStatDeltas: Partial<Record<StatKey, number>> | null;
  lastChoiceMoneyDelta: number;
  lastChoiceWasSuccess: boolean | null;
  lastSeasonResult: SeasonResult | null;
  pendingTransferOffers: Team[] | null;
}
