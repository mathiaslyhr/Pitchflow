// Role libraries (canonical RIGHT / CENTRE side; left players are mirrored at match time).
// x: 0 (left touchline) .. 100 (right touchline)   y: 0 (own goal) .. 100 (opponent goal)
//
// NOTE: all role coordinates below are ILLUSTRATIVE placeholders so the matching
// *feels* right. The real numbers come from reading FM26's in-game Visualizer and
// writing the offsets in. Replace these values with measured data, the engine stays
// the same.

import type { Phase, Role } from "./engine";

export type RoleLib = Record<string, Record<Phase, Role[]>>;

export const ROLE_LIB: RoleLib = {
  "wide-def": {
    ip: [
      { name: "Full-Back", x: 80, y: 42, tags: ["holder bredden", "støtter kanten"], instr: "—" },
      { name: "Wing-Back", x: 86, y: 64, tags: ["høj og bred", "overlap"], instr: "Bredde: bredere" },
      { name: "Complete Wing-Back", x: 88, y: 80, tags: ["ind i sidste tredjedel", "underlap"], instr: "Bredde: bredere" },
      { name: "Inverted Wing-Back", x: 57, y: 55, tags: ["inverterer", "danner pivot", "ekstra 6'er"], instr: "Bredde: smallere" },
      { name: "Inverted Full-Back", x: 60, y: 33, tags: ["tucker ind", "ekstra CB i opbygning"], instr: "Bredde: smallere" },
    ],
    oop: [
      { name: "Holder firkæden", x: 82, y: 22, tags: ["bliver i linjen", "disciplineret"], instr: "—" },
      { name: "Bred presspiller", x: 86, y: 48, tags: ["stepper ud", "jager bolden"], instr: "Press: oftere" },
      { name: "Falder i femkæde", x: 70, y: 14, tags: ["dropper dybt", "5. forsvarer"], instr: "Linje: dybere" },
      { name: "Skærmer centralt", x: 58, y: 36, tags: ["bliver smal", "dækker rummet"], instr: "—" },
    ],
  },
  "central-def": {
    ip: [
      { name: "Central forsvarer", x: 50, y: 18, tags: ["holder linjen"], instr: "—" },
      { name: "Boldspillende forsvarer", x: 50, y: 24, tags: ["starter opspil"], instr: "—" },
      { name: "Libero", x: 50, y: 40, tags: ["træder ind i midten"], instr: "—" },
      { name: "Bred forsvarer", x: 30, y: 20, tags: ["splitter bredt", "trekant i opspil"], instr: "—" },
    ],
    oop: [
      { name: "Stopper", x: 50, y: 20, tags: ["markerer", "vinder dueller"], instr: "—" },
      { name: "Dækkende forsvarer", x: 50, y: 13, tags: ["bag linjen", "samler op"], instr: "Linje: dybere" },
    ],
  },
  "def-mid": {
    ip: [
      { name: "Holdende midtbane", x: 50, y: 45, tags: ["skærmer forsvaret"], instr: "—" },
      { name: "Dyb playmaker", x: 50, y: 40, tags: ["dikterer tempoet"], instr: "—" },
      { name: "Box-to-box afsæt", x: 50, y: 58, tags: ["bryder frem"], instr: "—" },
      { name: "Regista", x: 46, y: 43, tags: ["kreativ fra dybden"], instr: "—" },
    ],
    oop: [
      { name: "Anker", x: 50, y: 40, tags: ["bliver foran forsvaret"], instr: "—" },
      { name: "Central presser", x: 50, y: 58, tags: ["jager i midten"], instr: "Press: oftere" },
    ],
  },
  "central-mid": {
    ip: [
      { name: "Central midtbane", x: 50, y: 55, tags: ["forbinder spillet"], instr: "—" },
      { name: "Mezzala", x: 66, y: 62, tags: ["driver i halvrummet"], instr: "—" },
      { name: "Angribende midtbane", x: 50, y: 67, tags: ["løber i feltet"], instr: "—" },
      { name: "Dyb støtte", x: 50, y: 48, tags: ["falder af og hjælper"], instr: "—" },
    ],
    oop: [
      { name: "Box-to-box", x: 50, y: 52, tags: ["dækker meget plads"], instr: "—" },
      { name: "Presser", x: 50, y: 66, tags: ["jager højt"], instr: "Press: oftere" },
      { name: "Skærmer", x: 50, y: 44, tags: ["holder positionen"], instr: "—" },
    ],
  },
  "att-mid": {
    ip: [
      { name: "Klassisk 10'er", x: 50, y: 72, tags: ["spiller mellem linjerne"], instr: "—" },
      { name: "Shadow striker", x: 50, y: 82, tags: ["løber forbi spidsen"], instr: "—" },
      { name: "Advanced playmaker", x: 50, y: 70, tags: ["kreativt omdrejningspunkt"], instr: "—" },
    ],
    oop: [
      { name: "Front-presser", x: 50, y: 76, tags: ["trigger på presset"], instr: "Press: oftere" },
      { name: "Falder i midtbanen", x: 50, y: 60, tags: ["lukker centrum"], instr: "—" },
    ],
  },
  "winger": {
    ip: [
      { name: "Klassisk kantspiller", x: 88, y: 78, tags: ["holder bredden", "dribler"], instr: "Bredde: bredere" },
      { name: "Inverted winger", x: 70, y: 80, tags: ["skærer indad", "skud"], instr: "Bredde: smallere" },
      { name: "Inside forward", x: 68, y: 86, tags: ["løber i feltet"], instr: "—" },
      { name: "Wide playmaker", x: 82, y: 66, tags: ["falder af", "dikterer"], instr: "—" },
    ],
    oop: [
      { name: "Falder på kanten", x: 84, y: 50, tags: ["hjælper backen"], instr: "—" },
      { name: "Kant-presser", x: 86, y: 72, tags: ["lukker udad"], instr: "Press: oftere" },
    ],
  },
  "striker": {
    ip: [
      { name: "Target forward", x: 50, y: 86, tags: ["holder bolden oppe"], instr: "—" },
      { name: "Komplet angriber", x: 50, y: 88, tags: ["alsidig trussel"], instr: "—" },
      { name: "Falsk nier", x: 50, y: 72, tags: ["falder af", "skaber rum"], instr: "—" },
      { name: "Poacher", x: 50, y: 92, tags: ["lever i feltet"], instr: "—" },
    ],
    oop: [
      { name: "Forrest presser", x: 50, y: 84, tags: ["starter presset"], instr: "Press: oftere" },
      { name: "Lukker pasningsvej", x: 50, y: 78, tags: ["skygger opspil"], instr: "—" },
    ],
  },
};
