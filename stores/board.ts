// Zustand board state: formation, phase, player positions, selected player.

import { create } from "zustand";
import type { Phase, Pos } from "@/lib/engine";
import { FORMATIONS, type FormationKey, type Player } from "@/lib/formations";

interface BoardState {
  formationKey: FormationKey;
  phase: Phase;
  players: Player[];
  selectedId: string;
  showJson: boolean;

  changeFormation: (key: FormationKey) => void;
  setPhase: (phase: Phase) => void;
  setSelected: (id: string) => void;
  movePlayer: (id: string, phase: Phase, pos: Pos) => void;
  toggleJson: () => void;
}

const INITIAL_FORMATION: FormationKey = "4-3-3";

export const useBoardStore = create<BoardState>((set) => ({
  formationKey: INITIAL_FORMATION,
  phase: "ip",
  players: structuredClone(FORMATIONS[INITIAL_FORMATION]),
  selectedId: "dr",
  showJson: false,

  changeFormation: (key) =>
    set(() => ({
      formationKey: key,
      players: structuredClone(FORMATIONS[key]),
      selectedId: FORMATIONS[key].find((p) => p.family !== "gk")!.id,
    })),

  setPhase: (phase) => set({ phase }),

  setSelected: (id) => set({ selectedId: id }),

  movePlayer: (id, phase, pos) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, pos: { ...p.pos, [phase]: pos } } : p
      ),
    })),

  toggleJson: () => set((state) => ({ showJson: !state.showJson })),
}));
