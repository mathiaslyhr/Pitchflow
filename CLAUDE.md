@AGENTS.md

# Pitchflow

An FM26 tactic board and tactic manager. You design a team's shape **in possession**
and **out of possession**, drag players per phase, and the engine suggests the closest
FM26 role + instructions. Tactics export as JSON (a Supabase row + a human-readable "FM
setup sheet"). Roadmap goal: a complete product — public showcase, magic-link login, and
a dashboard of saved tactics — not just the board. Login is email OTP (a 6-digit
code sent to the user's email), not a magic link.

## Non-negotiable rules

### 1. English only
All product copy, UI text, code, comments, identifiers, commit messages, and docs are in
**English**. No Danish in the product or repo. (Chat with the user may be Danish; the
artifacts never are.) FM26 role and instruction **names** are the official taxonomy and
stay verbatim.

### 2. Branch per task — merge only on approval
- Never commit directly to `main`.
- Every piece of work happens on its own branch (`feat/...`, `fix/...`, `docs/...`, `chore/...`).
- Push and merge to `main` **only** when the user explicitly says it's approved
  ("godkendt" / "approved"). Until then, keep work on the branch.

### 3. Verify before claiming done
Run and pass before saying work is complete: `npx tsc --noEmit`, `npx eslint .`,
`npm run build`. State real results.

## Stack
Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · Zustand (board state) ·
TanStack Query (server data, from phase 2) · Supabase (Postgres + email-OTP auth) ·
Vercel deploy. Board = SVG + pointer events (no canvas lib).

## Structure
```
app/                     routes (landing, /login, /dashboard, /board, /privacy)
components/board/         PhaseBoard + board UI
components/ui/            shared primitives
lib/engine.ts            matchRole — pure, no UI
lib/roles.ts             role library as data
lib/instructions.ts      team + player instructions as data (modifier layer)
lib/formations.ts        formations as data
lib/supabase.ts          Supabase client
stores/board.ts          Zustand board state
docs/                    guideline.md, fm26-vocabulary.md, superpowers/specs/
```

## Design system
- **Brand (UI chrome, primary):** `--brand` `#6260FF`, `--brand-2` `#E4E4FF`, on a dark
  ink background `#0E1218`. Buttons, focus, links, landing, dashboard lean on the purple.
- **Phase colors (functional, kept separate from brand):** in possession = warm amber
  `#E8A93A`; out of possession = cool blue `#4A9EE0`. These are semantic so the user always
  knows which phase they're editing — do **not** rebrand them to purple.
- **Type:** Satoshi only (via Fontshare) — display, body, UI, and data. One typeface
  across the whole product; design tokens (colors + `--font-satoshi`) live in
  `app/globals.css` as the single source of truth, exposed to Tailwind via `@theme`.
- Rounded corners throughout; dark-first.

## Domain notes
- Role/instruction **vocabulary** lives in the repo as data (`lib/roles.ts`,
  `lib/instructions.ts`); source of truth for *what exists* is `docs/fm26-vocabulary.md`.
- Role **coordinates** (x/y per phase per third) are measured from FM26's in-game
  Visualizer — current values are placeholders. The engine doesn't change when real numbers
  land; only the data does.
- Database stores only user tactics (see `docs/guideline.md`); the role library is static
  and versioned with the code.

## Specs & plans
Design specs live in `docs/superpowers/specs/`; read the relevant one before implementing a
sub-project.
