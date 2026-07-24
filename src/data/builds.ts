import type { LocalizedText, Position, StatKey } from '../types';

export interface BuildDef {
  id: string;
  position: Position;
  name: LocalizedText;
  description: LocalizedText;
  boosts: Partial<Record<StatKey, number>>;
}

function b(id: string, position: Position, name: LocalizedText, description: LocalizedText, boosts: Partial<Record<StatKey, number>>): BuildDef {
  return { id, position, name, description, boosts };
}

export const BUILDS: BuildDef[] = [
  // Meneur / Point Guard
  b(
    'pg-floor-general',
    'PG',
    { fr: 'Meneur de jeu pur', en: 'Pure Floor General' },
    { fr: 'Fait jouer les autres avant tout, lit le jeu comme personne.', en: 'Sets up others above all — reads the game like no one else.' },
    { iqBasket: 14, relationCoequipiers: 6, mental: 4 },
  ),
  b(
    'pg-scorer',
    'PG',
    { fr: 'Meneur scoreur', en: 'Scoring Point Guard' },
    { fr: "Prend le jeu à son compte et n'hésite jamais à tirer.", en: 'Takes the game into his own hands and never hesitates to shoot.' },
    { technique: 12, mental: 5, popularite: 5 },
  ),
  b(
    'pg-defender',
    'PG',
    { fr: 'Meneur défensif', en: 'Defensive Guard' },
    { fr: "Colle son adversaire du premier au dernier ballon.", en: 'Locks down his matchup from the opening tip to the final buzzer.' },
    { physique: 8, iqBasket: 6, mental: 8 },
  ),
  b(
    'pg-sharpshooter',
    'PG',
    { fr: 'Meneur sniper', en: 'Sharpshooting Guard' },
    { fr: 'Un release rapide et une adresse extérieure redoutable.', en: 'A quick release and a lethal shot from deep.' },
    { technique: 16, mental: 2 },
  ),
  b(
    'pg-combo',
    'PG',
    { fr: 'Guard polyvalent', en: 'Combo Guard' },
    { fr: 'Aucun point faible évident, capable de tout faire un peu.', en: 'No obvious weakness — a little bit of everything.' },
    { technique: 6, physique: 4, iqBasket: 6, mental: 4 },
  ),

  // Arrière / Shooting Guard
  b(
    'sg-scorer',
    'SG',
    { fr: 'Scoreur explosif', en: 'Explosive Scorer' },
    { fr: 'Un volume de tirs impressionnant et beaucoup de confiance.', en: 'High shot volume and no shortage of confidence.' },
    { technique: 14, physique: 4, popularite: 5 },
  ),
  b(
    'sg-sharpshooter',
    'SG',
    { fr: "Sniper d'élite", en: 'Elite Sharpshooter' },
    { fr: 'Une mécanique de tir parfaite, dangereux dès la ligne médiane.', en: 'A flawless shooting stroke — dangerous from half court in.' },
    { technique: 16, mental: 3 },
  ),
  b(
    'sg-lockdown',
    'SG',
    { fr: 'Arrière verrou', en: 'Lockdown Defender' },
    { fr: "Le cauchemar des meilleurs scoreurs adverses.", en: "The nightmare of the opposing team's best scorer." },
    { physique: 10, mental: 8, iqBasket: 4 },
  ),
  b(
    'sg-playmaker',
    'SG',
    { fr: 'Arrière meneur', en: 'Playmaking Guard' },
    { fr: 'Combine adresse et vision de jeu pour faire mal des deux côtés.', en: 'Combines scoring touch with vision to hurt you both ways.' },
    { iqBasket: 10, relationCoequipiers: 6, technique: 4 },
  ),
  b(
    'sg-two-way',
    'SG',
    { fr: 'Two-way wing', en: 'Two-Way Wing' },
    { fr: 'Solide des deux côtés du terrain, sans grande faiblesse.', en: 'Solid on both ends of the floor, without a real weakness.' },
    { physique: 6, technique: 6, iqBasket: 6, mental: 4 },
  ),

  // Ailier / Small Forward
  b(
    'sf-allrounder',
    'SF',
    { fr: 'Ailier polyvalent', en: 'Do-It-All Wing' },
    { fr: 'Peut jouer à peu près à tous les postes sur un terrain.', en: 'Can play almost anywhere on the floor.' },
    { technique: 4, physique: 5, iqBasket: 5, mental: 5 },
  ),
  b(
    'sf-3and-d',
    'SF',
    { fr: 'Ailier 3&D', en: '3-and-D Wing' },
    { fr: 'Tir extérieur fiable et défense engagée, le profil recherché par tous.', en: 'Reliable outside shot and committed defense — the profile every team wants.' },
    { technique: 10, physique: 6, mental: 4 },
  ),
  b(
    'sf-slasher',
    'SF',
    { fr: 'Attaquant athlétique', en: 'Athletic Slasher' },
    { fr: "Explosif, il attaque le cercle avec une puissance rare.", en: 'Explosive — he attacks the rim with rare power.' },
    { physique: 12, technique: 6, popularite: 4 },
  ),
  b(
    'sf-point-forward',
    'SF',
    { fr: 'Meneur secondaire', en: 'Point Forward' },
    { fr: "Organise le jeu depuis l'aile, une vision rare pour sa taille.", en: 'Runs the offense from the wing — rare vision for his size.' },
    { iqBasket: 12, relationCoequipiers: 6, technique: 3 },
  ),
  b(
    'sf-stopper',
    'SF',
    { fr: 'Ailier défensif', en: 'Defensive Stopper' },
    { fr: "Capable de neutraliser n'importe quel ailier adverse.", en: 'Able to neutralize any wing he faces.' },
    { physique: 10, mental: 10, iqBasket: 2 },
  ),

  // Ailier fort / Power Forward
  b(
    'pf-stretch',
    'PF',
    { fr: 'Stretch four', en: 'Stretch Four' },
    { fr: "Étire les défenses avec un tir extérieur inattendu pour son gabarit.", en: 'Stretches defenses with an outside shot unexpected for his size.' },
    { technique: 12, physique: 6, mental: 2 },
  ),
  b(
    'pf-bully',
    'PF',
    { fr: 'Intérieur physique', en: 'Post Bully' },
    { fr: 'Impose sa force brute sous le cercle, impossible à déplacer.', en: 'Imposes raw strength under the rim — impossible to move.' },
    { physique: 16, mental: 4 },
  ),
  b(
    'pf-defender',
    'PF',
    { fr: 'Défenseur intérieur', en: 'Interior Defender' },
    { fr: "Une présence dissuasive permanente près du cercle.", en: 'A constant deterrent presence near the basket.' },
    { physique: 10, iqBasket: 6, mental: 6 },
  ),
  b(
    'pf-modern',
    'PF',
    { fr: 'Ailier fort moderne', en: 'Modern Power Forward' },
    { fr: "Aussi à l'aise à 3 points que dans la peinture.", en: 'Just as comfortable behind the arc as in the paint.' },
    { technique: 6, physique: 8, iqBasket: 6 },
  ),
  b(
    'pf-playmaking-big',
    'PF',
    { fr: 'Meneur intérieur', en: 'Playmaking Big' },
    { fr: 'Distribue le jeu depuis le poste haut comme un meneur.', en: 'Distributes from the high post like a true point guard.' },
    { iqBasket: 12, relationCoequipiers: 6, physique: 4 },
  ),

  // Pivot / Center
  b(
    'c-rim-protector',
    'C',
    { fr: 'Rempart défensif', en: 'Rim Protector' },
    { fr: 'Une tour de contrôle sous son propre cercle.', en: 'A control tower under his own rim.' },
    { physique: 14, mental: 8 },
  ),
  b(
    'c-post-scorer',
    'C',
    { fr: 'Pivot scoreur', en: 'Post Scorer' },
    { fr: "Un jeu au poste ancien école, dévastateur en un-contre-un.", en: 'An old-school post game, devastating in one-on-one.' },
    { technique: 10, physique: 10, popularite: 2 },
  ),
  b(
    'c-stretch-five',
    'C',
    { fr: 'Pivot mobile', en: 'Stretch Five' },
    { fr: 'Un pivot moderne, capable de s\'écarter et de tirer à 3 points.', en: 'A modern center, able to step out and shoot from deep.' },
    { technique: 12, physique: 8, mental: 2 },
  ),
  b(
    'c-point-center',
    'C',
    { fr: 'Meneur pivot', en: 'Point Center' },
    { fr: 'Le hub offensif de son équipe, malgré sa taille.', en: "His team's offensive hub, despite his size." },
    { iqBasket: 14, relationCoequipiers: 6, physique: 2 },
  ),
  b(
    'c-lob-threat',
    'C',
    { fr: 'Athlète explosif', en: 'Athletic Lob Threat' },
    { fr: 'Un athlète hors norme, terreur des alley-oops.', en: 'A freak athlete — a terror above the rim.' },
    { physique: 16, mental: 2, popularite: 4 },
  ),
];

export function buildsForPosition(position: Position): BuildDef[] {
  return BUILDS.filter((build) => build.position === position);
}

export function getBuild(id: string): BuildDef | undefined {
  return BUILDS.find((build) => build.id === id);
}

export function defaultBuildForPosition(position: Position): string {
  return buildsForPosition(position)[0].id;
}
