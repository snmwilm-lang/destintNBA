import type { League, Team } from '../types';
import { NBA_LIKE_TEAMS, EUROPE_TEAMS, HIGH_SCHOOL_TEAMS } from './names';

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function rangeFromHash(name: string, salt: string, min: number, max: number): number {
  const h = hash(name + salt);
  return min + (h % (max - min + 1));
}

export function buildTeam(name: string, city: string, league: League): Team {
  return {
    id: `${league}-${name}`,
    name,
    league,
    city,
    ambition: rangeFromHash(name, 'ambition', 45, 95),
    mediaExposure: rangeFromHash(name, 'media', 30, 95),
    coachQuality: rangeFromHash(name, 'coach', 40, 95),
    salaryBudget: rangeFromHash(name, 'salary', 50, 100),
  };
}

export const HIGH_SCHOOL_TEAM_POOL: Team[] = HIGH_SCHOOL_TEAMS.map((name) =>
  buildTeam(name, name.split(' ')[0], 'lycee'),
);

export const NBA_TEAM_POOL: Team[] = NBA_LIKE_TEAMS.map((t) => buildTeam(t.name, t.city, 'nba'));

export const EUROPE_TEAM_POOL: Team[] = EUROPE_TEAMS.map((t) => buildTeam(t.name, t.city, 'europe'));

export function allTeamsForLeague(league: League): Team[] {
  if (league === 'lycee') return HIGH_SCHOOL_TEAM_POOL;
  if (league === 'europe') return EUROPE_TEAM_POOL;
  return NBA_TEAM_POOL;
}
