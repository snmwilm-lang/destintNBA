# Hardwood Dreams

A narrative basketball career game, built as an original take on the "career mode" genre — a 15-year-old prospect's
journey toward NBA stardom, told through card-based events, seasonal simulation, and long-term consequences.

This project is inspired only by the general *concept* of narrative career-mode progression; no text, art, or content
is copied from any existing game.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (state + `localStorage` persistence)
- Framer Motion (card animations)

## Running locally

```bash
npm install
npm run dev
```

## Game structure

- `src/types` — core domain types (player stats, events, seasons, teams, trophies…)
- `src/data/events` — 1000+ generated event cards across 20 categories (match, training, coach, transfer market,
  injuries, nutrition, sponsors, social media, family, press, national team, playoffs, finals, draft, All-Star,
  Olympics, World Cup…), built from a smaller set of hand-written bilingual (FR/EN) templates expanded with
  fictional name/team pools for variety.
- `src/engine` — the season loop: event selection, choice resolution (including stat-driven random outcomes),
  stat progression/aging, injuries, season stat-line simulation, trophies, press, transfers, and career endings.
- `src/store` — the Zustand game store, supporting multiple simultaneous career save slots.
- `src/i18n` — French/English UI dictionary and language switcher.
- `src/screens`, `src/components` — the card-based UI.

## Design notes

- **13 tracked attributes** (technique, physique, mental, IQ basket, réputation, popularité, moral, forme, relation
  coach, relation coéquipiers, temps de jeu, risque de blessure, potentiel) plus money, evolve only through event
  choices, playing time, coaching, age, and injuries — never by direct grinding.
- **Multiple endings**: Hall of Fame, league legend, fulfilled European career, decline, honest career, or an early
  "undrafted" failure state.
- Careers run roughly 15–20 seasons, from age 15 to retirement.
