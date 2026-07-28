import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Archetype, Position } from '../types';
import { type CareerPath, defaultHeightForPosition, heightTilt, POSITION_HEIGHT_RANGE } from '../engine/careerEngine';
import { type BuildDef, buildIdentity, buildsForPosition, defaultBuildForPosition, getBuild } from '../data/builds';
import { NATIONALITIES } from '../data/nationalities';
import { useGameStore } from '../store/gameStore';
import { useLang, useT } from '../i18n/useT';
import type { DictionaryKey } from '../i18n/dictionary';

function formatHeight(cm: number, lang: 'fr' | 'en'): string {
  const meters = (cm / 100).toFixed(2);
  return lang === 'fr' ? `${meters.replace('.', ',')} m` : `${meters} m`;
}

function formatIdentityBadge(build: BuildDef, t: (key: DictionaryKey) => string): string {
  const identity = buildIdentity(build);
  const stats: { pct: number; label: string }[] = [
    { pct: identity.pointsPct, label: t('createIdentityPoints') },
    { pct: identity.passesPct, label: t('createIdentityPasses') },
    { pct: identity.reboundsPct, label: t('createIdentityRebounds') },
  ];
  const top = stats
    .filter((s) => s.pct !== 0)
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
    .slice(0, 2)
    .map((s) => `${s.pct >= 0 ? '+' : ''}${s.pct}% ${s.label}`);
  const noteText = `${t('createIdentityNote')} ${identity.noteDelta >= 0 ? '+' : ''}${identity.noteDelta.toFixed(2)}`;
  return `🧬 ${[...top, noteText].join(' · ')}`;
}

/** Shows the actual physique/technique/injury-risk swing this exact height gives this exact
 * build — the same tilt × heightSensitivity math the engine applies at career creation, made
 * visible so the height slider isn't just a cosmetic number. */
function formatHeightBadge(position: Position, height: number, build: BuildDef, t: (key: DictionaryKey) => string): string {
  const identity = buildIdentity(build);
  const tilt = heightTilt(position, height) * identity.heightSensitivity;
  const physiqueBonus = Math.round(tilt * 6);
  const techniqueBonus = Math.round(-tilt * 4);
  const riskBonus = Math.round(Math.max(0, tilt) * 4);
  const parts = [
    `${physiqueBonus >= 0 ? '+' : ''}${physiqueBonus} ${t('createHeightPhysique')}`,
    `${techniqueBonus >= 0 ? '+' : ''}${techniqueBonus} ${t('createHeightTechnique')}`,
  ];
  if (riskBonus !== 0) parts.push(`+${riskBonus} ${t('createHeightRisk')}`);
  return `📏 ${parts.join(' · ')}`;
}

interface CharacterCreationProps {
  onCancel: () => void;
  onCreated: () => void;
}

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
  const lang = useLang();
  const createCareer = useGameStore((s) => s.createCareer);
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('SG');
  const [archetype, setArchetype] = useState<Archetype>(() => defaultBuildForPosition('SG'));
  const [path, setPath] = useState<CareerPath>('full');
  const [height, setHeight] = useState(() => defaultHeightForPosition('SG'));
  const [nationality, setNationality] = useState('US');

  const [heightMin, heightMax] = POSITION_HEIGHT_RANGE[position];
  const builds = useMemo(() => buildsForPosition(position), [position]);

  useEffect(() => {
    setHeight(defaultHeightForPosition(position));
    setArchetype(defaultBuildForPosition(position));
  }, [position]);

  const handleStart = () => {
    createCareer(name.trim(), archetype, position, path, height, nationality);
    onCreated();
  };

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:py-12">
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

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createPositionLabel')}</label>
        <div className="mb-5 grid grid-cols-5 gap-2">
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

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createNationalityLabel')}</label>
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="mb-5 w-full rounded-xl border border-court-600 bg-court-700/60 px-4 py-2.5 text-sm text-slate-100 focus:border-gold-400 focus:outline-none"
        >
          {NATIONALITIES.map((n) => (
            <option key={n.code} value={n.code}>
              {n.flag} {n.name[lang]}
            </option>
          ))}
        </select>

        <div className="mb-5">
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-xs uppercase tracking-wide text-slate-400">{t('createHeightLabel')}</label>
            <span className="text-sm font-bold text-gold-300 tabular-nums">{formatHeight(height, lang)}</span>
          </div>
          <input
            type="range"
            min={heightMin}
            max={heightMax}
            step={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-hoop-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500 tabular-nums">
            <span>{formatHeight(heightMin, lang)}</span>
            <span>{formatHeight(heightMax, lang)}</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400">{formatHeightBadge(position, height, getBuild(archetype) ?? builds[0], t)}</div>
        </div>

        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t('createArchetypeLabel')}</label>
        <div className="mb-7 grid grid-cols-1 gap-2">
          {builds.map((build) => (
            <button
              key={build.id}
              onClick={() => setArchetype(build.id)}
              className={`rounded-xl border px-4 py-2.5 text-left transition-colors ${
                archetype === build.id
                  ? 'border-gold-400 bg-gold-400/10'
                  : 'border-court-600 bg-court-700/40 hover:border-court-500'
              }`}
            >
              <div className={`text-sm font-semibold ${archetype === build.id ? 'text-gold-300' : 'text-slate-200'}`}>{build.name[lang]}</div>
              <div className="text-xs text-slate-400">{build.description[lang]}</div>
              <div className="mt-1 text-[11px] font-semibold text-gold-400/90">{formatIdentityBadge(build, t)}</div>
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
