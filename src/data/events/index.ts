import type { EventTemplate } from '../../engine/eventTemplate';
import { expandTemplates } from '../../engine/eventGenerator';
import { matchEvents } from './match';
import { entrainementEvents } from './entrainement';
import { coachEvents } from './coach';
import { mercatoEvents } from './mercato';
import { blessureEvents } from './blessure';
import { nutritionEvents } from './nutrition';
import { musculationEvents } from './musculation';
import { sponsorsEvents } from './sponsors';
import { reseauxEvents } from './reseaux';
import { familleEvents } from './famille';
import { relationsEvents } from './relations';
import { conflitsEvents } from './conflits';
import { presseEvents } from './presse';
import { selectionNationaleEvents } from './selectionNationale';
import { playoffsEvents } from './playoffs';
import { finaleEvents } from './finale';
import { draftEvents } from './draft';
import { allStarEvents } from './allStar';
import { jeuxOlympiquesEvents } from './jeuxOlympiques';
import { coupeDuMondeEvents } from './coupeDuMonde';

export const allEventTemplates: EventTemplate[] = [
  ...matchEvents,
  ...entrainementEvents,
  ...coachEvents,
  ...mercatoEvents,
  ...blessureEvents,
  ...nutritionEvents,
  ...musculationEvents,
  ...sponsorsEvents,
  ...reseauxEvents,
  ...familleEvents,
  ...relationsEvents,
  ...conflitsEvents,
  ...presseEvents,
  ...selectionNationaleEvents,
  ...playoffsEvents,
  ...finaleEvents,
  ...draftEvents,
  ...allStarEvents,
  ...jeuxOlympiquesEvents,
  ...coupeDuMondeEvents,
];

export const allEvents = expandTemplates(allEventTemplates);
