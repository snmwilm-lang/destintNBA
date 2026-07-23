import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Archetype, Position } from '../types';
import type { CareerPath } from '../engine/careerEngine';
import { useGameStore } from '../store/gameStore';
import { useT } from '../i18n/useT';
import type { DictionaryKey } from '../i18n/dictionary';

interface CharacterCreationProps {
  onCancel: () => void;
  onCreated: () => void;
}

const ARCHETYPES: { value: Archetype; labelKey: DictionaryKey }[] = [
  { value: 'scorer', labelKey: 'archetypeScorer' },
  { value: 'playmaker', labelKey: 'archetypePlaymaker' },
  { value: 'defender', labelKey: 'archetypeDefender' },
  { value: 'allround', labelKey: 'archetypeAllround' },
  { value: 'shooter', labelKey: 'archetypeShooter' },
];

const POSITIONS: { value: Position; labelKey: DictionaryKey }[] = [
  { value: 'PG', labelKey: 'positionPG' },
  { value: 'SG', labelKey: 'positionSG' },
  { value: 'SF', labelKey: 'positionSF' },
  { value: 'PF', labelKey: 'positionPF' },
  { value: 'C', labelKey: 'positionC' },
];

const PATHS: { value: CareerPath; labelKey: DictionaryKey; descKey: DictionaryKey }[] = [
  { value: 'full', labelKey: 'createPathFull', descKey: 'createPathFullDesc' },
  { value: 'skipToNba', labelKey: 'createPathSkip', descKey: 'createPathSkipDesc' },
];

export function CharacterCreation({ onCancel, onCreated }: CharacterCreationProps) {
  const t = useT();
  const createCareer = useGameStore((s) => s.createCareer);
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState<Archetype>('scorer');
  const [position, setPosition] = useState<Position>('SG');
  const [path, setPath] = useState<CareerPath>('full');

  const handleStart = () => {
    createCareer(name.trim(), archetype, position, path);
    onCreated();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-court-600/60 bg-court-800/90 px-6 py-8 shadow-2xl shadow-black/40"
      >
        <h1 className="mb-1 text-xl font-bold text-slate-50">{t('createTitle')}</h1>
        <p className="mb-6 text-xs text-slate-400">{path === 'full' ? t('createAge') : t('createPathSkipDesc')}</p>

        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">{t('createNameLabel')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('createNamePlaceholder')}
          className="mb-5 w-full rounded-xl border border-court-600 bg-court-700/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold-400 focus:outline-none"
        />

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createArchetypeLabel')}</label>
        <div className="mb-5 grid grid-cols-1 gap-2">
          {ARCHETYPES.map((a) => (
            <button
              key={a.value}
              onClick={() => setArchetype(a.value)}
              className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                archetype === a.value
                  ? 'border-gold-400 bg-gold-400/10 text-gold-300'
                  : 'border-court-600 bg-court-700/40 text-slate-300 hover:border-court-500'
              }`}
            >
              {t(a.labelKey)}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createPositionLabel')}</label>
        <div className="mb-7 grid grid-cols-5 gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPosition(p.value)}
              title={t(p.labelKey)}
              className={`rounded-lg border px-2 py-2.5 text-xs font-bold transition-colors ${
                position === p.value
                  ? 'border-gold-400 bg-gold-400/10 text-gold-300'
                  : 'border-court-600 bg-court-700/40 text-slate-300 hover:border-court-500'
              }`}
            >
              {p.value}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createPathLabel')}</label>
        <div className="mb-7 grid grid-cols-1 gap-2">
          {PATHS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPath(p.value)}
              className={`rounded-xl border px-4 py-2.5 text-left transition-colors ${
                path === p.value
                  ? 'border-gold-400 bg-gold-400/10'
                  : 'border-court-600 bg-court-700/40 hover:border-court-500'
              }`}
            >
              <div className={`text-sm font-semibold ${path === p.value ? 'text-gold-300' : 'text-slate-300'}`}>{t(p.labelKey)}</div>
              <div className="text-xs text-slate-400">{t(p.descKey)}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-court-600 px-6 py-3 text-sm font-bold text-slate-300 hover:border-slate-400 transition-colors"
          >
            {t('commonCancel')}
          </button>
          <button
            onClick={handleStart}
            className="flex-1 rounded-full bg-gradient-to-r from-hoop-500 to-gold-500 px-6 py-3 text-sm font-bold text-court-950 hover:brightness-110 transition-all"
          >
            {t('createStartButton')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
