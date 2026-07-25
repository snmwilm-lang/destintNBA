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
  /** Chains straight into another event as the payoff of a multi-step moment, without
   * consuming an extra season slot or showing the usual choice-result screen in between. */
  linkedNextEventId?: string;
  /** Marks a choice as the player deliberately kicking off (or escalating) the city/fanbase
   * rivalry — from then on, cityRivalry moments come up noticeably more often. */
  triggersRivalry?: boolean;
  /** How this choice moves the NBA draft stock, accumulated only during the high-school years
   * (missing practice, arrogance with the press, poor discipline, etc. should be negative;
   * professionalism and maturity should be positive). */
  draftImpact?: number;
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
  /** A rare late-career season where an elite veteran defies the usual age-driven decline. */
  vintageSeason: boolean;
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
  /** The high school attended, ages 15-19 only — kept afterward purely as a bio fact, never
   * shown as the active team again once the player is drafted. Null for the skip-to-NBA path. */
  highSchool: string | null;
  /** Draft stock (0-100): built from 4 years of high-school performance and behavior, then
   * combined with a luck roll on draft night — a great player is more likely to go early, but
   * never guaranteed to go first. */
  draftStock: number;
  /** Set once the player is actually drafted. */
  draftPick: number | null;
  /** Earned through good seasons; the player spends them to directly train up a skill. */
  skillPoints: number;
  /** Persistent named rival for duel-style events, pinned for this career. */
  rivalName: string;
  rivalRecord: { wins: number; losses: number };
  /** A whole fanbase can turn into a rival too (a la Trae Young vs. New York), pinned for this career. */
  rivalTeamName: string;
  rivalTeamRecord: { wins: number; losses: number };
  /** Set once the player deliberately provokes the rival fanbase — from then on, cityRivalry
   * moments come up noticeably more often instead of purely at random. */
  rivalryProvoked: boolean;
  /** A rival high school (ages 15-19 only) — the origin story that can seed the career's legacy. */
  rivalHighSchool: string;
  rivalHighSchoolRecord: { wins: number; losses: number };
  /** Country represented in international competition (Olympics, World Cup). */
  nationality: string;
  /** 0-100, starts neutral. Rises on successful/good choices, falls on failed/bad ones — a real
   * streak of good decisions (and luck) is what actually unlocks potentiel growth each season,
   * not just the passage of time. */
  momentum: number;
  /** Set the moment the national team is selected; resolved into the matching
   * result event (final or an early-exit round), then cleared. */
  pendingNationalCampaign: { competition: 'jeuxOlympiques' | 'coupeDuMonde'; round: 'groupes' | 'quarts' | 'demies' | 'finale' } | null;
  /** Set the moment the Finals-clinching shot (finale-moment-decisif) resolves; consumed by the
   * next season simulation so hitting (or missing) that shot always narratively matches whether
   * the team is actually crowned champion, instead of the two being decided independently. */
  pendingFinaleResult: boolean | null;
  /** True once the player has reached the finals at least once — the first trip is guaranteed by
   * year 3 in the league; every trip after that is a normal (reputation-gated) random draw, so a
   * genuinely great player/team can make it back more than once instead of exactly once ever. */
  hasReachedFinale: boolean;
  /** How many times a trophy-sweeping season has already given the player's recognized skill
   * stats (and potentiel) an elite-breakthrough correction — each trigger's gain is halved from
   * the last, so a career can keep climbing toward true legend status on sustained dominance
   * without any single hot stretch snowballing straight to the max. */
  eliteBreakthroughCount: number;
  /** Achievement ids unlocked by THIS career's ending, for a one-time flash on the ending screen. */
  newlyUnlockedAchievements: string[];
  /** Permanent double-edged personality traits earned mid-career (a buff paired with a nerf). */
  traits: string[];
  /** Trait ids unlocked THIS season, for a one-time flash on the season recap. */
  newlyUnlockedTraits: string[];
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
