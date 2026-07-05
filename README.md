# GWAFA — Goblin With a Fat Ass, Player Assistant

A mobile-first web app for players of *Goblin With a Fat Ass* (Tom Bloom, 2023).
Generates goblins, rolls action dice and ass dice, and keeps the rulebook one tap away.
Everything is stored locally in the browser — no accounts, no backend, no sync.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

Deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
The app is a PWA: once loaded it works fully offline, and phones can "Add to Home Screen".

## What's inside (MVP1 — player screen only)

- **My Goblins** — hold multiple goblins, switch the active one, one-tap full auto-generation
- **Character Sheet** — every field editable or individually rerollable; ±1 ass-size adjust; status flag (Fine / Dazed / KO'd); the kobold secret stays collapsed until you peek
- **Roller** — action rolls with hard/skill/advantage/dazed/bad-situation toggles (auto 2d6-take-lowest at 0 dice), ass rolls with automatic 1/6 pair-cancellation and a chaos-clock reminder; Barbarian and Paladin class quirks are handled
- **Rules** — the full rulebook text, searchable, including the DM mission tables

## Where things live

```
src/
  gameData.js   ← all rulebook tables & reference text (edit here to tweak content)
  dice.js       ← pure roll logic (action roll, ass roll)
  generator.js  ← character generation
  store.js      ← Pinia store, persisted to localStorage
  App.vue       ← header + bottom tab nav
  views/        ← the four screens
  components/   ← Die.vue (animated die face)
```

DM tools (chaos clock, mission generator, consequences tracker) are deliberately out of scope for MVP1 — see the spec.
