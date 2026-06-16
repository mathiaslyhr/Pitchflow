# Phase — projekt-guideline

Working title: **Phase**. Hele produktet handler om de to faser (in/out of possession), navnet er kort, ownable og passer til `.app`/`.gg`-domæner. Alternativer hvis du vil videre: *Shape*, *OffBall*, *Gegen*. Skift bare wordmark i `PhaseBoard.jsx` (`S.wordmark`).

---

## 1. Brand

### Farver — to lag, holdt adskilt
Den vigtigste regel: **brand-farver ≠ fase-farver.**

- **Brand (primær/sekundær)** styrer UI-krom: logo, knapper, fokus, highlights. Det er her dine to farver i hovedet skal ind. I koden er det `--brand` og `--brand-2` øverst i `S.root`. Lige nu står der placeholders (`#3DDC97` mint / `#8B93FF` indigo) — send mig dine to hex, så swapper jeg dem ind, og de propagerer overalt.
- **Fase (funktionelle)** er semantiske og bør *ikke* være dine brandfarver: varm = med bold (`--ip`, amber), kold = uden bold (`--oop`, blå). De skal være intuitive på tværs af alle temaer, så brugeren aldrig er i tvivl om hvilken fase de redigerer. Lad dem være.

Dark-first. Baggrund er ikke ren sort men en dyb blå-grå ink (`#0E1218`) — renere i et værktøj end #000.

### Typografi
- Display/wordmark/overskrifter: **Space Grotesk** — geometrisk, teknisk, passer til et "instrument".
- Body/UI: **Inter**.
- Data (score, koordinater, positioner): **JetBrains Mono** — giver fornemmelsen af et taktisk instrument-panel frem for en webside.

Til din rigtige build kan du self-hoste **Satoshi** (som i Kvittr/WKB/portfolio) og bruge den som display-face i stedet for Space Grotesk, så Phase matcher dine andre produkter. Fontshare-CDN'et virker bare ikke her, derfor Google Fonts i prototypen.

### Stemme
Taktisk og præcis. Forklar hvad ting gør i klar tale, ingen hype. Fejl undskylder ikke — de fortæller hvad der skete og hvad man gør.

---

## 2. Teknisk

### Stack (matcher det du allerede kender)
- **Next.js (App Router) + TypeScript** — board'et er client-side, resten kan være server components.
- **Supabase** — Postgres + Auth (magic link til at starte).
- **Vercel** — deploy.
- **Zustand** til board-state (formation, fase, spillerpositioner, valgt spiller). **TanStack Query** til server-data (gemte taktikker).
- Board = **SVG + pointer events**. Ingen canvas-library nødvendig i phase 1 — komponenten du har (`PhaseBoard.jsx`) porter direkte ind som `components/board/PhaseBoard.tsx`.

### Motor og data — to lag
Hold motoren ren og data-drevet:

- `lib/engine.ts` — `matchRole(family, side, phase, pos)`. Ren funktion, ingen UI. (Allerede skrevet i prototypen.)
- `lib/roles.ts` — rollebiblioteket som data, ikke kode. **Adskil roller fra instrukser**: roller har grund-offsets, instrukser er et separat modifikator-lag der justerer dem. Det er det der holder datamængden additiv (~55 captures) i stedet for multiplikativ (~600).
- Koordinaterne i prototypen er placeholders. **Ground truth aflæses fra FM26's in-game Visualizer** — det er moaten, og det er kedeligt manuelt arbejde ingen andre gider.

### Datamodel (Supabase)
Rollebiblioteket bor i repo'et (statisk, versioneret med koden) — ikke i databasen. Databasen gemmer kun brugernes taktikker:

```sql
create table tactics (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,
  formation   text not null,
  data        jsonb not null,      -- præcis den JSON board'et eksporterer
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table tactics enable row level security;
create policy "egne taktikker" on tactics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

`data`-kolonnen er 1:1 det `tacticJson` board'et allerede laver. Gem = ét insert, hent = ét select. Det er hele phase 2.

### FM-integration — vær realistisk
`.fmf` er et lukket, proprietært binærformat bundet til spilmotoren; det kan ikke parses udefra, og formatet kan ændre sig for hver FM-udgivelse. **Byg ikke produktet på det.**

Den holdbare vej er envejs og menneske-medieret: eksportér et rent **opskriftsark** (IP/OOP-formation + roller + instrukser pr. spiller) som brugeren genskaber i FM på et par minutter. Din JSON *er* opskriftsarket — render den bare pænt (skærm + PDF). To-vejs `.fmf` er en risikabel R&D-satsning til allersidst, hvis overhovedet.

### Mappe-skitse
```
app/            (routes)
components/board/PhaseBoard.tsx
lib/engine.ts   (matchRole)
lib/roles.ts    (rollebibliotek som data)
lib/formations.ts
lib/supabase.ts (client)
stores/board.ts (zustand)
```

---

## 3. Roadmap

- **Phase 1 (nu):** board op, træk spillere pr. fase, formationer, levende rolleforslag + score, JSON-eksport. *(= prototypen)*
- **Phase 2:** auth + gem/hent navngivne taktikker i Supabase.
- **Phase 3:** fuld-vektor-matching over de tre zoner (ikke kun ét punkt) + rigtige Visualizer-målte tal + instruks-modifikatorlaget.
- **Phase 4:** opskriftsark-eksport (skærm/PDF) + delelinks.
- **Senere / risikabelt:** `.fmf`-research, hvis efterspørgslen er der.

Hold linjen: få phase 1 i luften og brugbar, før du rører noget af det andet.

---

## 4. Pris / forretningsmodel

En tanke, ikke en anbefaling — du bør validere betalingsvilje før du låser noget.

Publikummet er nichet men passioneret, og det taler for **freemium + abonnement** frem for engangskøb:

- **Gratis:** byg og eksperimentér, få rolleforslag, gem fx 1–3 taktikker, vandmærke på eksport.
- **Pro:** ubegrænsede taktikker, fuldt rollebibliotek, opskriftsark-eksport (PDF), delelinks.

Realistiske niveauer for et niche-FM-værktøj: i omegnen af 3–5 USD/md eller ~25–30 USD årligt. FM er sæsonbetonet (årlig udgivelse), så et **sæson-pass** der følger udgivelsescyklussen kan ramme bedre end løbende månedsbetaling — folk spiller intenst lige efter release og falder af hen mod sommeren.

Et par ærlige forbehold: rollebiblioteket skal være målt og troværdigt før folk betaler (det er produktet, ikke UI'et), og du konkurrerer mod gratis community-værktøjer — så Pro skal løse noget de ikke gør, fx den baglæns oversættelse og IP/OOP-splittet. Jeg er ikke økonomisk rådgiver; test prisen mod rigtige FM-spillere før du beslutter.
