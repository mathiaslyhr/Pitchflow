// Formations: each player has a family, side (L/R/C) and per-phase positions.

import type { Pos, Side } from "./engine";

export interface Player {
  id: string;
  lbl: string;
  family: string;
  side: Side;
  pos: {
    ip: Pos;
    oop: Pos;
  };
}

export type FormationKey = "4-3-3" | "4-2-3-1" | "4-4-2";

const F = (
  id: string,
  lbl: string,
  family: string,
  side: Side,
  ip: Pos,
  oop: Pos
): Player => ({ id, lbl, family, side, pos: { ip, oop } });

export const FORMATIONS: Record<FormationKey, Player[]> = {
  "4-3-3": [
    F("gk", "GK", "gk", "C", { x: 50, y: 6 }, { x: 50, y: 6 }),
    F("dl", "DL", "wide-def", "L", { x: 18, y: 40 }, { x: 16, y: 22 }),
    F("dcl", "CB", "central-def", "L", { x: 38, y: 20 }, { x: 38, y: 20 }),
    F("dcr", "CB", "central-def", "R", { x: 62, y: 20 }, { x: 62, y: 20 }),
    F("dr", "DR", "wide-def", "R", { x: 82, y: 40 }, { x: 84, y: 22 }),
    F("dm", "DM", "def-mid", "C", { x: 50, y: 45 }, { x: 50, y: 40 }),
    F("mcl", "CM", "central-mid", "L", { x: 35, y: 56 }, { x: 38, y: 50 }),
    F("mcr", "CM", "central-mid", "R", { x: 65, y: 56 }, { x: 62, y: 50 }),
    F("wl", "W", "winger", "L", { x: 16, y: 78 }, { x: 20, y: 52 }),
    F("st", "ST", "striker", "C", { x: 50, y: 86 }, { x: 50, y: 80 }),
    F("wr", "W", "winger", "R", { x: 84, y: 78 }, { x: 80, y: 52 }),
  ],
  "4-2-3-1": [
    F("gk", "GK", "gk", "C", { x: 50, y: 6 }, { x: 50, y: 6 }),
    F("dl", "DL", "wide-def", "L", { x: 18, y: 40 }, { x: 16, y: 22 }),
    F("dcl", "CB", "central-def", "L", { x: 38, y: 20 }, { x: 38, y: 20 }),
    F("dcr", "CB", "central-def", "R", { x: 62, y: 20 }, { x: 62, y: 20 }),
    F("dr", "DR", "wide-def", "R", { x: 82, y: 40 }, { x: 84, y: 22 }),
    F("dml", "DM", "def-mid", "C", { x: 40, y: 44 }, { x: 42, y: 40 }),
    F("dmr", "DM", "def-mid", "C", { x: 60, y: 44 }, { x: 58, y: 40 }),
    F("aml", "W", "winger", "L", { x: 18, y: 72 }, { x: 22, y: 54 }),
    F("amc", "AM", "att-mid", "C", { x: 50, y: 74 }, { x: 50, y: 62 }),
    F("amr", "W", "winger", "R", { x: 82, y: 72 }, { x: 78, y: 54 }),
    F("st", "ST", "striker", "C", { x: 50, y: 88 }, { x: 50, y: 82 }),
  ],
  "4-4-2": [
    F("gk", "GK", "gk", "C", { x: 50, y: 6 }, { x: 50, y: 6 }),
    F("dl", "DL", "wide-def", "L", { x: 18, y: 38 }, { x: 16, y: 22 }),
    F("dcl", "CB", "central-def", "L", { x: 38, y: 20 }, { x: 38, y: 20 }),
    F("dcr", "CB", "central-def", "R", { x: 62, y: 20 }, { x: 62, y: 20 }),
    F("dr", "DR", "wide-def", "R", { x: 82, y: 38 }, { x: 84, y: 22 }),
    F("ml", "W", "winger", "L", { x: 16, y: 58 }, { x: 22, y: 46 }),
    F("mcl", "CM", "central-mid", "L", { x: 38, y: 52 }, { x: 40, y: 48 }),
    F("mcr", "CM", "central-mid", "R", { x: 62, y: 52 }, { x: 60, y: 48 }),
    F("mr", "W", "winger", "R", { x: 84, y: 58 }, { x: 78, y: 46 }),
    F("stl", "ST", "striker", "C", { x: 42, y: 82 }, { x: 44, y: 78 }),
    F("str", "ST", "striker", "C", { x: 58, y: 82 }, { x: 56, y: 78 }),
  ],
};
