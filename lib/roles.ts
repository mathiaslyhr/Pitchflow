// Role libraries (canonical RIGHT / CENTRE side; left players are mirrored at match time).
// x: 0 (left touchline) .. 100 (right touchline)   y: 0 (own goal) .. 100 (opponent goal)
//
// Role names are the FM26 taxonomy from docs/fm26-vocabulary.md (the source of truth).
// NOTE: the x/y coordinates below are still ILLUSTRATIVE placeholders so the matching
// *feels* right — the real numbers come from FM26's in-game Visualizer. Sub-project 2
// expands this into the full ~72-role library; the engine stays the same either way.

import type { Phase, Role } from "./engine";

export type RoleLib = Record<string, Record<Phase, Role[]>>;

export const ROLE_LIB: RoleLib = {
  "wide-def": {
    ip: [
      { name: "Full-Back", x: 80, y: 42, tags: ["holds width", "supports the winger"], instr: "—" },
      { name: "Wing-Back", x: 86, y: 64, tags: ["high and wide", "overlaps"], instr: "Attacking Width: Wider" },
      { name: "Advanced Wing-Back", x: 88, y: 80, tags: ["as high and wide as possible", "into final third"], instr: "Attacking Width: Wider" },
      { name: "Inverted Wing-Back", x: 57, y: 55, tags: ["plays as a DM", "extra pivot"], instr: "Attacking Width: Narrower" },
      { name: "Inside Full-Back", x: 60, y: 33, tags: ["tucks in", "extra CB in build-up"], instr: "Attacking Width: Narrower" },
    ],
    oop: [
      { name: "Holding Full-Back", x: 82, y: 22, tags: ["stays deeper", "disciplined"], instr: "—" },
      { name: "Pressing Full-Back", x: 86, y: 48, tags: ["pushes up", "supports the press"], instr: "Trigger Press: More Often" },
      { name: "Holding Wing-Back", x: 70, y: 14, tags: ["stays deeper while pressing", "cautious"], instr: "Defensive Line: Deeper" },
      { name: "Pressing Wing-Back", x: 58, y: 36, tags: ["engages high", "supports the press"], instr: "Trigger Press: More Often" },
    ],
  },
  "central-def": {
    ip: [
      { name: "Centre-Back", x: 50, y: 18, tags: ["balanced defender", "holds the line"], instr: "—" },
      { name: "Ball-Playing Centre-Back", x: 50, y: 24, tags: ["line-breaking passes", "starts build-up"], instr: "—" },
      { name: "Advanced Centre-Back", x: 50, y: 40, tags: ["steps toward the DM"], instr: "—" },
      { name: "Wide Centre-Back", x: 30, y: 20, tags: ["provides width", "triangle in build-up"], instr: "—" },
    ],
    oop: [
      { name: "Stopping Centre-Back", x: 50, y: 20, tags: ["steps out", "engages aggressively"], instr: "—" },
      { name: "Covering Centre-Back", x: 50, y: 13, tags: ["covers behind", "reacts"], instr: "Defensive Line: Deeper" },
    ],
  },
  "def-mid": {
    ip: [
      { name: "Defensive Midfielder", x: 50, y: 45, tags: ["shields the defence", "covers counters"], instr: "—" },
      { name: "Deep-Lying Playmaker", x: 50, y: 40, tags: ["dictates from deep", "starts attacks"], instr: "—" },
      { name: "Box-to-Box Playmaker", x: 50, y: 58, tags: ["breaks forward", "creative"], instr: "—" },
      { name: "Half-Back", x: 46, y: 43, tags: ["drops between the CBs"], instr: "—" },
    ],
    oop: [
      { name: "Screening Defensive Midfielder", x: 50, y: 40, tags: ["covers space between CBs", "intercepts"], instr: "—" },
      { name: "Pressing Defensive Midfielder", x: 50, y: 58, tags: ["pushes up", "supports the press"], instr: "Trigger Press: More Often" },
    ],
  },
  "central-mid": {
    ip: [
      { name: "Central Midfielder", x: 50, y: 55, tags: ["supports attack and defence"], instr: "—" },
      { name: "Channel Midfielder", x: 66, y: 62, tags: ["runs into the half-spaces"], instr: "—" },
      { name: "Box-to-Box Midfielder", x: 50, y: 67, tags: ["covers the whole pitch"], instr: "—" },
      { name: "Midfield Playmaker", x: 50, y: 48, tags: ["creative link"], instr: "—" },
    ],
    oop: [
      { name: "Wide-Covering Central Midfielder", x: 50, y: 52, tags: ["shifts wide when the FB pushes up"], instr: "—" },
      { name: "Pressing Central Midfielder", x: 50, y: 66, tags: ["supports the press high"], instr: "Trigger Press: More Often" },
      { name: "Screening Central Midfielder", x: 50, y: 44, tags: ["blocks central lanes", "holds position"], instr: "—" },
    ],
  },
  "att-mid": {
    ip: [
      { name: "Attacking Midfielder", x: 50, y: 72, tags: ["between the lines", "creates space"], instr: "—" },
      { name: "Free Role", x: 50, y: 82, tags: ["total freedom", "goes anywhere"], instr: "—" },
      { name: "Advanced Playmaker", x: 50, y: 70, tags: ["between the lines centrally"], instr: "—" },
    ],
    oop: [
      { name: "Central Outlet Attacking Midfielder", x: 50, y: 76, tags: ["stays high", "counter outlet"], instr: "—" },
      { name: "Tracking Attacking Midfielder", x: 50, y: 60, tags: ["drops deep", "defensive support"], instr: "—" },
    ],
  },
  "winger": {
    ip: [
      { name: "Winger", x: 88, y: 78, tags: ["stretches play", "crosses"], instr: "Attacking Width: Wider" },
      { name: "Inside Winger", x: 70, y: 80, tags: ["cuts inside centrally"], instr: "Attacking Width: Narrower" },
      { name: "Inside Forward", x: 68, y: 86, tags: ["cuts inside", "attacks the box"], instr: "—" },
      { name: "Wide Playmaker", x: 82, y: 66, tags: ["creates space", "tucks in"], instr: "—" },
    ],
    oop: [
      { name: "Tracking Winger", x: 84, y: 50, tags: ["tracks back", "supports the defence"], instr: "—" },
      { name: "Wide Outlet Winger", x: 86, y: 72, tags: ["stays high", "counter outlet"], instr: "—" },
    ],
  },
  "striker": {
    ip: [
      { name: "Target Forward", x: 50, y: 86, tags: ["physical reference", "aerial threat"], instr: "—" },
      { name: "Centre Forward", x: 50, y: 88, tags: ["leads the line", "classic No. 9"], instr: "—" },
      { name: "False Nine", x: 50, y: 72, tags: ["drops to AM", "creates space"], instr: "—" },
      { name: "Second Striker", x: 50, y: 92, tags: ["drops into space", "runs in behind"], instr: "—" },
    ],
    oop: [
      { name: "Central Outlet CF", x: 50, y: 84, tags: ["stays high", "counter outlet"], instr: "—" },
      { name: "Tracking CF", x: 50, y: 78, tags: ["tracks back", "counter focus"], instr: "—" },
    ],
  },
};
