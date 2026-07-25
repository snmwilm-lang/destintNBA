import type { Career, LocalizedText } from '../types';
import type { CareerSheet } from '../engine/careerEngine';

export interface Achievement {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  check: (career: Career, sheet: CareerSheet) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: { fr: 'Premiers pas', en: 'First steps' },
    description: { fr: 'Termine une première saison.', en: 'Complete a first season.' },
    check: (career) => career.history.length >= 1,
  },
  {
    id: 'going-pro',
    name: { fr: 'Passage professionnel', en: 'Going pro' },
    description: { fr: 'Atteins la Hooper League.', en: 'Reach the Hooper League.' },
    check: (career) => career.history.some((h) => h.league === 'nba'),
  },
  {
    id: 'champion',
    name: { fr: 'Champion', en: 'Champion' },
    description: { fr: 'Remporte un titre de champion.', en: 'Win a championship.' },
    check: (career) => career.trophies.some((t) => t.id.includes('-champion')),
  },
  {
    id: 'mvp',
    name: { fr: 'MVP', en: 'MVP' },
    description: { fr: 'Remporte un trophée de MVP.', en: 'Win an MVP award.' },
    check: (career) => career.trophies.some((t) => t.id.includes('-mvp')),
  },
  {
    id: 'young-gun',
    name: { fr: 'Prodige précoce', en: 'Young gun' },
    description: { fr: 'Gagne un titre de champion avant 25 ans.', en: 'Win a championship before age 25.' },
    check: (career) => {
      const champTrophy = career.trophies.find((t) => t.id.includes('-champion'));
      if (!champTrophy) return false;
      const seasonEntry = career.history.find((h) => h.season === champTrophy.season);
      return seasonEntry ? seasonEntry.age < 25 : false;
    },
  },
  {
    id: 'iron-man',
    name: { fr: 'Increvable', en: 'Iron man' },
    description: { fr: 'Termine une carrière de 5 saisons ou plus sans aucune blessure.', en: 'Finish a career of 5+ seasons with zero injuries.' },
    check: (career) => career.history.length >= 5 && career.history.every((h) => h.blessures.length === 0),
  },
  {
    id: 'hall-of-fame',
    name: { fr: 'Hall of Fame', en: 'Hall of Fame' },
    description: { fr: 'Termine ta carrière au Hall of Fame.', en: 'Retire into the Hall of Fame.' },
    check: (career) => career.ending?.type === 'halloffame',
  },
  {
    id: 'legend-tier',
    name: { fr: 'Statut légendaire', en: 'Legendary status' },
    description: { fr: 'Termine une carrière avec la note S.', en: 'Finish a career with an S grade.' },
    check: (_career, sheet) => sheet.tier === 'S',
  },
];

export const MAX_ACHIEVEMENT_BONUS_POINTS = 6;
