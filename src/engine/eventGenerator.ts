import type { GameEvent, EventChoice, LocalizedText } from '../types';
import type { EventTemplate } from './eventTemplate';

function fillText(text: LocalizedText, ctx: Record<string, string>): LocalizedText {
  const fill = (str: string) => str.replace(/\{(\w+)\}/g, (_, k: string) => ctx[k] ?? `{${k}}`);
  return { fr: fill(text.fr), en: fill(text.en) };
}

function instantiateChoice(tpl: Omit<EventChoice, 'id'>, ctx: Record<string, string>, idPrefix: string, index: number): EventChoice {
  return {
    ...tpl,
    id: `${idPrefix}-c${index}`,
    label: fillText(tpl.label, ctx),
    resultText: tpl.resultText ? fillText(tpl.resultText, ctx) : undefined,
    successChance: tpl.successChance
      ? {
          ...tpl.successChance,
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
