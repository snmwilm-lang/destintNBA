import type { GameEvent, EventChoice, LocalizedText, StatKey } from '../types';
import type { EventTemplate } from './eventTemplate';

function fillText(text: LocalizedText, ctx: Record<string, string>): LocalizedText {
  const fill = (str: string) => str.replace(/\{(\w+)\}/g, (_, k: string) => ctx[k] ?? `{${k}}`);
  return { fr: fill(text.fr), en: fill(text.en) };
}

// Hand-authored effect numbers read as too timid on a 0-100 stat scale — scale them up
// uniformly at generation time so choices feel consequential without hand-editing every event.
const EFFECT_AMPLIFIER = 1.6;

// A single choice should never swing a stat by more than this in one go — keeps the visible
// per-choice impact readable and varied (2 to 7) instead of the amplifier occasionally
// blowing a hand-authored value out to 15-20+.
const MAX_EFFECT_MAGNITUDE = 7;

function clampMagnitude(effects?: Partial<Record<StatKey, number>>): Partial<Record<StatKey, number>> | undefined {
  if (!effects) return effects;
  const clamped: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(effects) as StatKey[]) {
    const value = effects[key] ?? 0;
    clamped[key] = Math.max(-MAX_EFFECT_MAGNITUDE, Math.min(MAX_EFFECT_MAGNITUDE, value));
  }
  return clamped;
}

function amplifyEffects(effects?: Partial<Record<StatKey, number>>): Partial<Record<StatKey, number>> | undefined {
  if (!effects) return effects;
  const scaled: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(effects) as StatKey[]) {
    const value = effects[key] ?? 0;
    const amplified = Math.round(value * EFFECT_AMPLIFIER);
    scaled[key] = amplified === 0 && value !== 0 ? Math.sign(value) : amplified;
  }
  return clampMagnitude(scaled);
}

// The riskier the play (lower baseChance), the bigger BOTH the upside and the downside should
// swing — a legendary attempt that whiffs should sting more than a safe pass that doesn't pan
// out. riskTier > 0 for risky/legendary choices, < 0 for safe/altruistic ones.
function riskScale(effects: Partial<Record<StatKey, number>> | undefined, baseChance: number, branch: 'success' | 'failure') {
  if (!effects) return effects;
  const riskTier = 0.5 - baseChance;
  const multiplier = branch === 'success' ? 1 + riskTier * 0.8 : 1 + riskTier * 1.3;
  const scaled: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(effects) as StatKey[]) {
    const value = effects[key] ?? 0;
    const result = Math.round(value * Math.max(0.4, multiplier));
    scaled[key] = result === 0 && value !== 0 ? Math.sign(value) : result;
  }
  return clampMagnitude(scaled);
}

function instantiateChoice(tpl: Omit<EventChoice, 'id'>, ctx: Record<string, string>, idPrefix: string, index: number): EventChoice {
  return {
    ...tpl,
    id: `${idPrefix}-c${index}`,
    label: fillText(tpl.label, ctx),
    resultText: tpl.resultText ? fillText(tpl.resultText, ctx) : undefined,
    effects: amplifyEffects(tpl.effects),
    delayedEffects: tpl.delayedEffects?.map((d) => ({ ...d, effects: amplifyEffects(d.effects) ?? {} })),
    successChance: tpl.successChance
      ? {
          ...tpl.successChance,
          onSuccess: riskScale(amplifyEffects(tpl.successChance.onSuccess), tpl.successChance.baseChance, 'success') ?? {},
          onFailure: riskScale(amplifyEffects(tpl.successChance.onFailure), tpl.successChance.baseChance, 'failure') ?? {},
          successText: tpl.successChance.successText ? fillText(tpl.successChance.successText, ctx) : undefined,
          failureText: tpl.successChance.failureText ? fillText(tpl.successChance.failureText, ctx) : undefined,
        }
      : undefined,
  };
}

function instantiate(tpl: EventTemplate, ctx: Record<string, string>, index: number): GameEvent {
  const id = tpl.slots && tpl.slots.length > 0 ? `${tpl.id}-${index}` : tpl.id;
  return {
    id,
    category: tpl.category,
    title: fillText(tpl.title, ctx),
    description: fillText(tpl.description, ctx),
    choices: tpl.choices.map((c, ci) => instantiateChoice(c, ctx, id, ci)),
    requirements: tpl.requirements,
    minSeason: tpl.minSeason,
    maxSeason: tpl.maxSeason,
    minAge: tpl.minAge,
    maxAge: tpl.maxAge,
    leagues: tpl.leagues,
    weight: tpl.weight,
    unique: tpl.unique,
    tags: tpl.tags,
  };
}

export function expandTemplate(tpl: EventTemplate): GameEvent[] {
  const slots = tpl.slots ?? [];
  if (slots.length === 0) {
    return [instantiate(tpl, {}, 0)];
  }
  const longest = Math.max(...slots.map((s) => s.pool.length));
  const count = Math.min(tpl.variants ?? longest, longest);
  const events: GameEvent[] = [];
  for (let i = 0; i < count; i++) {
    const ctx: Record<string, string> = {};
    for (const s of slots) ctx[s.key] = s.pool[i % s.pool.length];
    events.push(instantiate(tpl, ctx, i));
  }
  return events;
}

export function expandTemplates(templates: EventTemplate[]): GameEvent[] {
  return templates.flatMap(expandTemplate);
}
