import type { LocalizedText } from '../types';

export interface Nationality {
  code: string;
  name: LocalizedText;
  flag: string;
  /** Basketball pedigree, 0-100 — shapes how far the national team tends to go internationally. */
  strength: number;
}

export const NATIONALITIES: Nationality[] = [
  { code: 'US', name: tt('États-Unis', 'United States'), flag: '🇺🇸', strength: 97 },
  { code: 'ES', name: tt('Espagne', 'Spain'), flag: '🇪🇸', strength: 86 },
  { code: 'FR', name: tt('France', 'France'), flag: '🇫🇷', strength: 85 },
  { code: 'RS', name: tt('Serbie', 'Serbia'), flag: '🇷🇸', strength: 85 },
  { code: 'AU', name: tt('Australie', 'Australia'), flag: '🇦🇺', strength: 78 },
  { code: 'CA', name: tt('Canada', 'Canada'), flag: '🇨🇦', strength: 78 },
  { code: 'LT', name: tt('Lituanie', 'Lithuania'), flag: '🇱🇹', strength: 76 },
  { code: 'AR', name: tt('Argentine', 'Argentina'), flag: '🇦🇷', strength: 74 },
  { code: 'GR', name: tt('Grèce', 'Greece'), flag: '🇬🇷', strength: 73 },
  { code: 'SI', name: tt('Slovénie', 'Slovenia'), flag: '🇸🇮', strength: 73 },
  { code: 'DE', name: tt('Allemagne', 'Germany'), flag: '🇩🇪', strength: 72 },
  { code: 'IT', name: tt('Italie', 'Italy'), flag: '🇮🇹', strength: 66 },
  { code: 'BR', name: tt('Brésil', 'Brazil'), flag: '🇧🇷', strength: 64 },
  { code: 'HR', name: tt('Croatie', 'Croatia'), flag: '🇭🇷', strength: 64 },
  { code: 'TR', name: tt('Turquie', 'Turkey'), flag: '🇹🇷', strength: 62 },
  { code: 'NG', name: tt('Nigéria', 'Nigeria'), flag: '🇳🇬', strength: 58 },
  { code: 'PR', name: tt('Porto Rico', 'Puerto Rico'), flag: '🇵🇷', strength: 56 },
  { code: 'DO', name: tt('République dominicaine', 'Dominican Republic'), flag: '🇩🇴', strength: 55 },
  { code: 'JP', name: tt('Japon', 'Japan'), flag: '🇯🇵', strength: 52 },
  { code: 'PH', name: tt('Philippines', 'Philippines'), flag: '🇵🇭', strength: 50 },
  { code: 'GB', name: tt('Royaume-Uni', 'United Kingdom'), flag: '🇬🇧', strength: 48 },
  { code: 'MX', name: tt('Mexique', 'Mexico'), flag: '🇲🇽', strength: 46 },
  { code: 'SN', name: tt('Sénégal', 'Senegal'), flag: '🇸🇳', strength: 45 },
  { code: 'CN', name: tt('Chine', 'China'), flag: '🇨🇳', strength: 44 },
  { code: 'EG', name: tt('Égypte', 'Egypt'), flag: '🇪🇬', strength: 38 },
];

function tt(fr: string, en: string): LocalizedText {
  return { fr, en };
}

export function getNationality(code: string): Nationality | undefined {
  return NATIONALITIES.find((n) => n.code === code);
}
