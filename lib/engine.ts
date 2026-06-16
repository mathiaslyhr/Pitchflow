// Matching engine: nearest role in (family, phase), with left-side mirroring.
// Pure functions only — no UI, no state.

import { ROLE_LIB } from "./roles";

export type Phase = "ip" | "oop";
export type Side = "L" | "R" | "C";

export interface Pos {
  x: number;
  y: number;
}

export interface Role {
  name: string;
  x: number;
  y: number;
  tags: string[];
  instr: string;
}

export interface MatchResult {
  role: Role;
  conf: number;
  second: Role | null;
  conf2: number;
}

export function matchRole(
  family: string,
  side: Side,
  phase: Phase,
  pos: Pos
): MatchResult | null {
  const lib = ROLE_LIB[family] && ROLE_LIB[family][phase];
  if (!lib) return null;
  const px = side === "L" ? 100 - pos.x : pos.x;
  let best: Role | null = null,
    bestD = Infinity,
    second: Role | null = null,
    secondD = Infinity;
  for (const r of lib) {
    const d = Math.hypot(r.x - px, r.y - pos.y);
    if (d < bestD) {
      second = best;
      secondD = bestD;
      best = r;
      bestD = d;
    } else if (d < secondD) {
      second = r;
      secondD = d;
    }
  }
  const conf = Math.max(0, Math.min(100, Math.round(100 - bestD * 1.7)));
  const conf2 = second
    ? Math.max(0, Math.min(100, Math.round(100 - secondD * 1.7)))
    : 0;
  return { role: best as Role, conf, second, conf2 };
}
