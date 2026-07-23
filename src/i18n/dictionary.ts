import type { Lang } from '../types';

export const dictionary = {
  appTitle: { fr: 'Hardwood Dreams', en: 'Hardwood Dreams' },
  appTagline: {
    fr: 'De la cour de quartier aux sommets de la NBA.',
    en: 'From the neighborhood court to the top of the NBA.',
  },

  // Main menu
  menuNewCareer: { fr: 'Nouvelle carrière', en: 'New career' },
  menuContinue: { fr: 'Continuer', en: 'Continue' },
  menuYourCareers: { fr: 'Tes carrières', en: 'Your careers' },
  menuNoSaves: { fr: 'Aucune carrière pour le moment. Lance-toi !', en: 'No careers yet. Get started!' },
  menuDelete: { fr: 'Supprimer', en: 'Delete' },
  menuDeleteConfirm: { fr: 'Supprimer cette carrière ?', en: 'Delete this career?' },
  menuSlotSeason: { fr: 'Saison {season}', en: 'Season {season}' },
  menuSlotAge: { fr: '{age} ans', en: 'Age {age}' },
  menuBackToMenu: { fr: 'Menu principal', en: 'Main menu' },
  menuLanguage: { fr: 'Langue', en: 'Language' },

  // Character creation
  createTitle: { fr: 'Crée ton joueur', en: 'Create your player' },
  createNameLabel: { fr: 'Nom du joueur', en: "Player's name" },
  createNamePlaceholder: { fr: 'Ex : Jalen Moreau', en: 'e.g. Jalen Moore' },
  createArchetypeLabel: { fr: 'Style de jeu', en: 'Playing style' },
  createPositionLabel: { fr: 'Poste', en: 'Position' },
  createStartButton: { fr: 'Commencer la carrière', en: 'Start career' },
  createAge: { fr: '15 ans, dernière année de collège.', en: '15 years old, finishing middle school.' },

  createPathLabel: { fr: 'Point de départ', en: 'Starting point' },
  createPathFull: { fr: 'Parcours complet', en: 'Full journey' },
  createPathFullDesc: {
    fr: 'Dès le lycée à 15 ans : construis ta réputation, vis la draft, façonne ta légende pas à pas.',
    en: 'Starting in high school at 15: build your reputation, live the draft, shape your legend step by step.',
  },
  createPathSkip: { fr: 'Direct en NBA', en: 'Straight to the NBA' },
  createPathSkipDesc: {
    fr: "Saute la phase lycée/draft et débarque déjà en NBA à 19 ans, prêt à jouer.",
    en: 'Skip the high school and draft years and arrive already in the NBA at 19, ready to play.',
  },

  archetypeScorer: { fr: 'Scoreur explosif', en: 'Explosive scorer' },
  archetypePlaymaker: { fr: 'Meneur visionnaire', en: 'Visionary playmaker' },
  archetypeDefender: { fr: 'Défenseur élite', en: 'Elite defender' },
  archetypeAllround: { fr: 'Athlète polyvalent', en: 'Versatile athlete' },
  archetypeShooter: { fr: "Tireur d'élite", en: 'Elite shooter' },

  positionPG: { fr: 'Meneur', en: 'Point Guard' },
  positionSG: { fr: 'Arrière', en: 'Shooting Guard' },
  positionSF: { fr: 'Ailier', en: 'Small Forward' },
  positionPF: { fr: 'Ailier fort', en: 'Power Forward' },
  positionC: { fr: 'Pivot', en: 'Center' },

  // Stat names (short + full)
  statTechnique: { fr: 'Technique', en: 'Skill' },
  statPhysique: { fr: 'Physique', en: 'Physical' },
  statMental: { fr: 'Mental', en: 'Mental' },
  statIqBasket: { fr: 'IQ Basket', en: 'Basketball IQ' },
  statReputation: { fr: 'Réputation', en: 'Reputation' },
  statPopularite: { fr: 'Popularité', en: 'Popularity' },
  statMoral: { fr: 'Moral', en: 'Morale' },
  statForme: { fr: 'Forme', en: 'Fitness' },
  statRelationCoach: { fr: 'Relation coach', en: 'Coach relationship' },
  statRelationCoequipiers: { fr: 'Relation coéquipiers', en: 'Teammate relationship' },
  statTempsDeJeu: { fr: 'Temps de jeu', en: 'Playing time' },
  statRisqueBlessure: { fr: 'Risque de blessure', en: 'Injury risk' },
  statPotentiel: { fr: 'Potentiel', en: 'Potential' },
  statArgent: { fr: 'Argent', en: 'Money' },

  // Categories
  catMatch: { fr: 'Match', en: 'Game' },
  catEntrainement: { fr: 'Entraînement', en: 'Training' },
  catCoach: { fr: 'Coach', en: 'Coach' },
  catMercato: { fr: 'Mercato', en: 'Transfer market' },
  catBlessure: { fr: 'Blessure', en: 'Injury' },
  catNutrition: { fr: 'Nutrition', en: 'Nutrition' },
  catMusculation: { fr: 'Salle de musculation', en: 'Weight room' },
  catSponsors: { fr: 'Sponsors', en: 'Sponsors' },
  catReseaux: { fr: 'Réseaux sociaux', en: 'Social media' },
  catFamille: { fr: 'Famille', en: 'Family' },
  catRelations: { fr: 'Relations', en: 'Relationships' },
  catConflits: { fr: 'Conflits', en: 'Conflicts' },
  catPresse: { fr: 'Presse', en: 'Press' },
  catSelectionNationale: { fr: 'Sélection nationale', en: 'National team' },
  catPlayoffs: { fr: 'Playoffs', en: 'Playoffs' },
  catFinale: { fr: 'Finale', en: 'Finals' },
  catDraft: { fr: 'Draft NBA', en: 'NBA Draft' },
  catAllStar: { fr: 'All-Star', en: 'All-Star' },
  catJeuxOlympiques: { fr: 'Jeux Olympiques', en: 'Olympic Games' },
  catCoupeDuMonde: { fr: 'Coupe du Monde', en: 'World Cup' },

  // Event screen
  eventContinue: { fr: 'Continuer', en: 'Continue' },
  eventSeasonProgress: { fr: 'Événement {current} / {total}', en: 'Event {current} / {total}' },

  // Season recap
  recapTitle: { fr: 'Bilan de la saison {season}', en: 'Season {season} recap' },
  recapStatLine: { fr: 'Statistiques', en: 'Stats' },
  recapMatchs: { fr: 'Matchs', en: 'Games' },
  recapPoints: { fr: 'Points', en: 'Points' },
  recapRebonds: { fr: 'Rebonds', en: 'Rebounds' },
  recapPasses: { fr: 'Passes', en: 'Assists' },
  recapInterceptions: { fr: 'Interceptions', en: 'Steals' },
  recapContres: { fr: 'Contres', en: 'Blocks' },
  recapAdresse3: { fr: 'Adresse à 3 points', en: '3-point %' },
  recapNoteMoyenne: { fr: 'Note moyenne', en: 'Average rating' },
  recapClassement: { fr: 'Classement', en: 'Standing' },
  recapClassementValue: { fr: '{rank}e sur {total}', en: '{rank} of {total}' },
  recapTrophies: { fr: 'Palmarès', en: 'Trophies' },
  recapNoTrophies: { fr: 'Aucun trophée cette saison.', en: 'No trophies this season.' },
  recapPress: { fr: 'La presse en parle', en: 'What the press is saying' },
  recapPopularity: { fr: 'Popularité', en: 'Popularity' },
  recapSalary: { fr: 'Salaire', en: 'Salary' },
  recapMarketValue: { fr: 'Valeur marchande', en: 'Market value' },
  recapProgression: { fr: 'Progression', en: 'Growth' },
  recapInjuries: { fr: 'Blessures', en: 'Injuries' },
  recapNoInjuries: { fr: 'Saison sans blessure.', en: 'Injury-free season.' },
  recapContinue: { fr: 'Saison suivante', en: 'Next season' },
  recapSeeOffers: { fr: 'Voir les offres', en: 'See offers' },

  injuryCheville: { fr: 'Entorse à la cheville', en: 'Ankle sprain' },
  injuryGenou: { fr: 'Blessure au genou', en: 'Knee injury' },
  injuryDos: { fr: 'Douleurs dorsales', en: 'Back pain' },
  injuryIschio: { fr: 'Ischio-jambiers', en: 'Hamstring strain' },
  injuryEpaule: { fr: "Blessure à l'épaule", en: 'Shoulder injury' },
  injuryPoignet: { fr: 'Poignet fragilisé', en: 'Wrist injury' },
  injuryWeeks: { fr: '{weeks} sem. indisponible', en: '{weeks} wks out' },

  // Transfer offers
  offersTitle: { fr: 'Offres de transfert', en: 'Transfer offers' },
  offersIntro: {
    fr: 'Plusieurs clubs veulent de toi cette intersaison. Choisis ton avenir.',
    en: 'Several clubs want you this offseason. Choose your future.',
  },
  offersStay: { fr: 'Rester à {team}', en: 'Stay at {team}' },
  offersSalary: { fr: 'Salaire', en: 'Salary' },
  offersPlayingTime: { fr: 'Temps de jeu promis', en: 'Promised playing time' },
  offersAmbition: { fr: 'Ambition', en: 'Ambition' },
  offersExposure: { fr: 'Exposition média', en: 'Media exposure' },
  offersCoach: { fr: 'Qualité du coach', en: 'Coach quality' },
  offersSign: { fr: 'Signer', en: 'Sign' },
  offersSkip: { fr: 'Ignorer les offres', en: 'Ignore offers' },

  // Ending
  endingTitle: { fr: 'Fin de carrière', en: 'Career over' },
  endingRestart: { fr: 'Nouvelle carrière', en: 'New career' },
  endingBackToMenu: { fr: 'Retour au menu', en: 'Back to menu' },
  endingFinalStats: { fr: 'Bilan de carrière', en: 'Career summary' },
  endingSeasonsPlayed: { fr: '{count} saisons jouées', en: '{count} seasons played' },
  endingTotalTrophies: { fr: '{count} trophées', en: '{count} trophies' },

  // Top bar / HUD
  hudSeason: { fr: 'Saison {season}', en: 'Season {season}' },
  hudAge: { fr: '{age} ans', en: 'Age {age}' },
  hudTeam: { fr: '{team}', en: '{team}' },
  hudMenu: { fr: 'Menu', en: 'Menu' },

  // Common
  commonYes: { fr: 'Oui', en: 'Yes' },
  commonNo: { fr: 'Non', en: 'No' },
  commonCancel: { fr: 'Annuler', en: 'Cancel' },
  commonConfirm: { fr: 'Confirmer', en: 'Confirm' },
  commonMoney: { fr: '{amount} €', en: '${amount}' },
} satisfies Record<string, Record<Lang, string>>;

export type DictionaryKey = keyof typeof dictionary;

export function translate(key: DictionaryKey, lang: Lang, vars?: Record<string, string | number>): string {
  const raw = dictionary[key]?.[lang] ?? String(key);
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
