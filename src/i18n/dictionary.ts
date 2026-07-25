import type { Lang } from '../types';

export const dictionary = {
  appTitle: { fr: 'Hardwood Dreams', en: 'Hardwood Dreams' },
  appTagline: {
    fr: 'De la cour de quartier aux sommets de la Hooper League.',
    en: 'From the neighborhood court to the top of the Hooper League.',
  },

  // Main menu
  menuNewCareer: { fr: 'Nouvelle carrière', en: 'New career' },
  menuContinue: { fr: 'Continuer', en: 'Continue' },
  menuYourCareers: { fr: 'Tes carrières', en: 'Your careers' },
  menuLegendsWall: { fr: 'Mur des légendes', en: 'Legends wall' },
  menuNoSaves: { fr: 'Aucune carrière pour le moment. Lance-toi !', en: 'No careers yet. Get started!' },
  menuDelete: { fr: 'Supprimer', en: 'Delete' },
  menuConfirmDelete: { fr: 'Confirmer', en: 'Confirm' },
  menuCancelDelete: { fr: 'Annuler', en: 'Cancel' },
  menuSlotSeason: { fr: 'Saison {season}', en: 'Season {season}' },
  menuSlotAge: { fr: '{age} ans', en: 'Age {age}' },
  menuBackToMenu: { fr: 'Menu principal', en: 'Main menu' },
  menuLanguage: { fr: 'Langue', en: 'Language' },
  menuAchievements: { fr: 'Succès', en: 'Achievements' },

  // Achievements screen
  achievementsTitle: { fr: 'Succès', en: 'Achievements' },
  achievementsSubtitle: {
    fr: 'Débloqués sur toutes tes carrières, ils donnent un bonus aux prochaines.',
    en: 'Unlocked across all your careers, they grant a bonus to future ones.',
  },
  achievementsProgress: { fr: '{unlocked}/{total} débloqués', en: '{unlocked}/{total} unlocked' },
  achievementsLocked: { fr: 'Verrouillé', en: 'Locked' },

  // Character creation
  createTitle: { fr: 'Crée ton joueur', en: 'Create your player' },
  createNameLabel: { fr: 'Nom du joueur', en: "Player's name" },
  createNamePlaceholder: { fr: 'Ex : Jalen Moreau', en: 'e.g. Jalen Moore' },
  createArchetypeLabel: { fr: 'Style de jeu', en: 'Playing style' },
  createIdentityPoints: { fr: 'points', en: 'points' },
  createIdentityPasses: { fr: 'passes', en: 'assists' },
  createIdentityRebounds: { fr: 'rebonds', en: 'rebounds' },
  createIdentityNote: { fr: 'note', en: 'rating' },
  createPositionLabel: { fr: 'Poste', en: 'Position' },
  createNationalityLabel: { fr: 'Nationalité', en: 'Nationality' },
  createHeightLabel: { fr: 'Taille', en: 'Height' },
  createStartButton: { fr: 'Commencer la carrière', en: 'Start career' },
  createAge: { fr: '15 ans, dernière année de collège.', en: '15 years old, finishing middle school.' },

  createPathLabel: { fr: 'Point de départ', en: 'Starting point' },
  createPathFull: { fr: 'Parcours complet', en: 'Full journey' },
  createPathFullDesc: {
    fr: 'Dès le lycée à 15 ans : construis ta réputation, vis la draft, façonne ta légende pas à pas.',
    en: 'Starting in high school at 15: build your reputation, live the draft, shape your legend step by step.',
  },
  createPathSkip: { fr: 'Direct en Hooper League', en: 'Straight to the Hooper League' },
  createPathSkipDesc: {
    fr: "Saute la phase lycée/draft et débarque déjà en Hooper League à 19 ans, prêt à jouer.",
    en: 'Skip the high school and draft years and arrive already in the Hooper League at 19, ready to play.',
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
  catDraft: { fr: 'Draft Hooper League', en: 'Hooper League Draft' },
  catAllStar: { fr: 'All-Star', en: 'All-Star' },
  catJeuxOlympiques: { fr: 'Jeux Olympiques', en: 'Olympic Games' },
  catCoupeDuMonde: { fr: 'Coupe du Monde', en: 'World Cup' },

  // Event screen
  eventContinue: { fr: 'Continuer', en: 'Continue' },
  eventSeasonProgress: { fr: 'Événement {current} / {total}', en: 'Event {current} / {total}' },
  choiceOutcomeSuccess: { fr: 'Réussi !', en: 'Success!' },
  choiceOutcomeFailure: { fr: 'Raté...', en: 'Failed...' },

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
  recapNewTraits: { fr: 'Nouveau trait de caractère', en: 'New personality trait' },
  endingTraits: { fr: 'Traits de caractère', en: 'Personality traits' },
  recapVintageSeason: {
    fr: 'Saison vintage — ton corps a défié le temps cette année.',
    en: 'Vintage season — your body defied the years this time around.',
  },
  recapChampionBanner: {
    fr: '🏆 Champion de la ligue ! {team} termine 1er cette saison.',
    en: "🏆 League champion! {team} finishes 1st this season.",
  },
  choiceVictoryTitle: { fr: 'VICTOIRE !', en: 'VICTORY!' },
  choiceDefeatTitle: { fr: 'DÉFAITE', en: 'DEFEAT' },
  recapTraining: { fr: 'Entraînement ciblé', en: 'Targeted training' },
  recapPointsAvailable: { fr: '{count} pts disponibles', en: '{count} pts available' },
  recapPointsEarned: { fr: '+{count} points gagnés cette saison', en: '+{count} points earned this season' },
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
  endingHighSchool: { fr: 'Formé à {school}', en: 'Developed at {school}' },
  endingDraftPick: { fr: 'Draft en {pick}e position', en: 'Drafted {pick} overall' },
  endingRestart: { fr: 'Nouvelle carrière', en: 'New career' },
  endingBackToMenu: { fr: 'Retour au menu', en: 'Back to menu' },
  endingFinalStats: { fr: 'Fiche de carrière', en: 'Career sheet' },
  endingSeasonsPlayed: { fr: '{count} saisons jouées', en: '{count} seasons played' },
  endingTotalTrophies: { fr: '{count} trophées', en: '{count} trophies' },
  endingCareerScore: { fr: 'Note de carrière', en: 'Career rating' },
  endingGamesPlayed: { fr: 'Matchs joués', en: 'Games played' },
  endingCareerPoints: { fr: 'Points en carrière', en: 'Career points' },
  endingCareerRebounds: { fr: 'Rebonds en carrière', en: 'Career rebounds' },
  endingCareerPasses: { fr: 'Passes en carrière', en: 'Career assists' },
  endingCareerAvgRating: { fr: 'Note moyenne carrière', en: 'Career avg. rating' },
  endingPeakValue: { fr: 'Valeur marchande record', en: 'Peak market value' },
  endingTrophyCase: { fr: 'Palmarès complet', en: 'Full trophy case' },
  endingNoTrophyCase: { fr: 'Aucun trophée remporté.', en: 'No trophies won.' },
  endingRivalry: { fr: 'Rivalité', en: 'Rivalry' },
  endingRivalryRecord: { fr: 'Face à {rival} : {wins} victoires — {losses} défaites', en: 'Against {rival}: {wins} wins — {losses} losses' },
  endingRivalTeamRecord: {
    fr: 'Ennemi public à {team} : {wins} victoires — {losses} défaites',
    en: 'Public enemy at {team}: {wins} wins — {losses} losses',
  },
  endingRivalHighSchoolRecord: {
    fr: 'Derby lycée face à {school} : {wins} victoires — {losses} défaites',
    en: 'High-school derby against {school}: {wins} wins — {losses} losses',
  },
  endingNewAchievements: { fr: 'Nouveaux succès débloqués', en: 'New achievements unlocked' },

  // Top bar / HUD
  hudSeason: { fr: 'Saison {season}', en: 'Season {season}' },
  hudAge: { fr: '{age} ans', en: 'Age {age}' },
  hudTeam: { fr: '{team}', en: '{team}' },
  hudMenu: { fr: 'Menu', en: 'Menu' },
  hudOverall: { fr: 'Général', en: 'Overall' },
  hudOverallShort: { fr: 'GÉN', en: 'OVR' },
  choiceOverallDelta: { fr: 'Général {sign}{delta}', en: 'Overall {sign}{delta}' },

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
