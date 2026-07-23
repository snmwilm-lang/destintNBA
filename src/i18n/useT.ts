import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { translate, type DictionaryKey } from './dictionary';

export function useLang() {
  return useGameStore((s) => s.lang);
}

export function useT() {
  const lang = useLang();
  return useCallback((key: DictionaryKey, vars?: Record<string, string | number>) => translate(key, lang, vars), [lang]);
}
