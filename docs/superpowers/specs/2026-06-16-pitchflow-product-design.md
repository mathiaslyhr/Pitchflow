# Pitchflow — product design

Date: 2026-06-16
Status: approved decisions, pending spec review

## Context

Pitchflow started as a single tactic board (phase 1, shipped). The product is now scoped as a
**complete system**: a public showcase landing page, email-OTP login (6-digit code), a dashboard of
saved tactics, and a larger, more spacious board powered by the full FM26 role/instruction vocabulary.
This spec records the vision, the decomposition into shippable sub-projects, and the decisions
that shape the architecture. Each sub-project gets its own implementation plan and its own
branch; we merge to `main` only on the user's approval.

## Locked decisions

- **Language:** English everywhere in the product/repo (current UI is Danish and gets translated).
  FM26 role/instruction names stay verbatim. See `CLAUDE.md`.
- **Color:** brand purple `#6260FF` (primary) / `#E4E4FF` (secondary) drives all UI chrome,
  landing, dashboard, buttons, focus, links — on dark ink `#0E1218`. Phase colors stay
  **functional and separate**: in possession = amber `#E8A93A`, out of possession = blue
  `#4A9EE0`. Do not rebrand phases to purple.
- **Build order:** (1) Foundations → (2) Role & instruction engine → (3) Auth + dashboard →
  (4) Public site + privacy.
- **Dashboard MVP:** grid of saved tactics — create new, open in board, rename, delete.
- **Auth:** Supabase email OTP — user enters email, receives a 6-digit code, verifies it
  (`signInWithOtp` → `verifyOtp({ type: 'email' })`). No magic link.
- **Unauthenticated board state:** when a user builds a tactic on `/board` without
  being logged in and then signs in, the current board state is automatically saved
  as their first tactic and they are redirected to `/board/[id]`. Do not discard work.
- **Role data:** encode the full FM26 vocabulary now (`lib/roles.ts` + `lib/instructions.ts`)
  with placeholder coordinates; real offsets come later from the Visualizer.
- **Git workflow:** branch per task; push + merge to `main` only when the user says approved.

## Architecture overview

Routes (App Router):

```
/            public landing / showcase  (marketing + "Log in" / "Get started")
/privacy     privacy policy
/login       email-OTP sign-in (enter email → 6-digit code → verify)
/dashboard   saved tactics grid          (auth-gated)
/board       the tactic board (new tactic)
/board/[id]  open a saved tactic          (auth-gated)
```

Layering stays as established: pure engine (`lib/engine.ts`) ← data (`lib/roles.ts`,
`lib/instructions.ts`, `lib/formations.ts`) ← state (`stores/board.ts`) ← UI
(`components/board/*`, route components). Supabase (`lib/supabase.ts`) only touches dashboard +
save/load, never the engine.

## Sub-projects

### 1. Foundations (first)
Visual + structural base everything else sits on.
- **Design tokens:** move the brand/phase/surface palette into CSS variables in `globals.css`
  (single source of truth) instead of being buried in the `S` object; expose them to Tailwind via
  `@theme`. Keep Satoshi/Inter/JetBrains Mono.
- **Bigger board:** the pitch and player markers are too small (see screenshot) — there is far
  more space to use. The pitch SVG should fill at least 60% of viewport width on desktop (min
  480px rendered width); player markers should have a minimum radius of 14px at that scale with
  labels legible at 13px. Remove the 920px card constraint and use a full-width app shell.
  Keep the drag/ghost/inspector behaviour exactly as-is.
- **English translation:** translate all current board UI strings to English ("Med bold" → "In
  possession", etc.); role behaviour/tags authored in English.
- **App shell:** shared layout/header used by board + later dashboard.
- Governance docs (`CLAUDE.md`, this spec, `docs/fm26-vocabulary.md`) — done in this branch.

### 2. Role & instruction engine
- `lib/roles.ts`: every role from `docs/fm26-vocabulary.md` as `{ name, position, phase,
  behaviour }`, grouped by position family, with placeholder per-phase offsets. `phase` ∈
  `ip | oop | hybrid`.
- `lib/instructions.ts`: team instructions as phase-grouped enums (Build-Up / Progression /
  Final Third; High Press / Mid Block / Low Block) with their options; player-instruction
  categories as the modifier layer; plus the dependency/validation rules (e.g. High Press ⇒
  Higher line).
- Engine matches a drawn position against roles in the same position+phase; inspector shows
  role + suggested instructions + "why".

### 3. Auth + dashboard
- Supabase email-OTP login (`/login`): enter email → receive 6-digit code → verify; session
  handling and route protection for `/dashboard` and `/board/[id]`.
- `tactics` table + RLS from `docs/guideline.md`; save = one insert, load = one select; the
  saved `data` column is exactly the board's exported JSON. TanStack Query for server data.
- Dashboard: grid of saved tactics — create / open / rename / delete.

### 4. Public site + privacy
- Landing/showcase: hero, product explanation, a preview of the board, CTAs ("Log in" /
  "Get started").
- Privacy policy page.
- Polished, on-brand (purple) marketing surface.

## Testing / verification

Per sub-project: `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean; run
`npm run dev` and verify the relevant flow in the browser. Engine logic (`matchRole`,
instruction dependency rules) is pure and unit-testable; add tests when sub-project 2 lands.

## Out of scope (for now)
Payments/subscriptions, PDF setup-sheet export, share links, full-vector zone matching, `.fmf`
research — all later per `docs/guideline.md` roadmap.
