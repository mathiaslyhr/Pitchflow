"use client";

import React, { useRef, useMemo } from "react";
import { matchRole } from "@/lib/engine";
import { FORMATIONS, type FormationKey } from "@/lib/formations";
import { useBoardStore } from "@/stores/board";

/*
  Pitchflow — FM26 tactic board (phase 1)
  ---------------------------------------
  Drag players per phase (in / out of possession), get a live FM role suggestion
  + score for the selected player, switch formations, and export the tactic as
  JSON (this JSON is your Supabase row + your "FM setup sheet").

  Engine + data + state are split out:
    lib/engine.ts     -> matchRole (pure)
    lib/roles.ts      -> ROLE_LIB (data)
    lib/formations.ts -> FORMATIONS (data)
    stores/board.ts   -> Zustand board state

  Design tokens (brand --color-brand/-2, phase --color-ip/--color-oop, surfaces,
  text) live in app/globals.css and are exposed both as Tailwind utilities and as
  raw CSS vars. Phase colors are kept functional (warm = with ball, cool =
  without) and separate from the brand on purpose.
*/

// --- Geometry: pitch coords (0-100) -> svg viewBox units ---
const VB_W = 100,
  VB_H = 132;
const mapX = (px: number) => 4 + px * 0.92;
const mapY = (py: number) => 128 - py * 1.24;

export default function PhaseBoard() {
  const formationKey = useBoardStore((s) => s.formationKey);
  const phase = useBoardStore((s) => s.phase);
  const players = useBoardStore((s) => s.players);
  const selectedId = useBoardStore((s) => s.selectedId);
  const showJson = useBoardStore((s) => s.showJson);
  const changeFormation = useBoardStore((s) => s.changeFormation);
  const setPhase = useBoardStore((s) => s.setPhase);
  const setSelected = useBoardStore((s) => s.setSelected);
  const movePlayer = useBoardStore((s) => s.movePlayer);
  const toggleJson = useBoardStore((s) => s.toggleJson);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<string | null>(null);

  const selected = players.find((p) => p.id === selectedId) || null;
  const isIP = phase === "ip";
  const phaseColor = isIP ? "var(--color-ip)" : "var(--color-oop)";
  const phaseBg = isIP ? "var(--color-ip-bg)" : "var(--color-oop-bg)";

  const match = useMemo(() => {
    if (!selected || selected.family === "gk") return null;
    return matchRole(selected.family, selected.side, phase, selected.pos[phase]);
  }, [selected, phase]);

  function clientToPitch(e: React.PointerEvent) {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    let px = (loc.x - 4) / 0.92;
    let py = (128 - loc.y) / 1.24;
    px = Math.max(2, Math.min(98, px));
    py = Math.max(2, Math.min(98, py));
    return { x: Math.round(px * 10) / 10, y: Math.round(py * 10) / 10 };
  }

  function onPlayerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    setSelected(id);
    dragRef.current = id;
    try {
      svgRef.current!.setPointerCapture(e.pointerId);
    } catch {}
  }
  function onMove(e: React.PointerEvent) {
    const id = dragRef.current;
    if (!id) return;
    const np = clientToPitch(e);
    movePlayer(id, phase, np);
  }
  function onUp() {
    dragRef.current = null;
  }

  const tacticJson = useMemo(() => {
    const out = {
      formation: formationKey,
      players: players.map((p) => {
        const ipm =
          p.family === "gk" ? null : matchRole(p.family, p.side, "ip", p.pos.ip);
        const oopm =
          p.family === "gk"
            ? null
            : matchRole(p.family, p.side, "oop", p.pos.oop);
        return {
          slot: p.id,
          position: p.lbl,
          family: p.family,
          side: p.side,
          ip: {
            x: p.pos.ip.x,
            y: p.pos.ip.y,
            role: ipm ? ipm.role.name : "Goalkeeper",
            instr: ipm ? ipm.role.instr : "—",
          },
          oop: {
            x: p.pos.oop.x,
            y: p.pos.oop.y,
            role: oopm ? oopm.role.name : "Goalkeeper",
            instr: oopm ? oopm.role.instr : "—",
          },
        };
      }),
    };
    return JSON.stringify(out, null, 2);
  }, [players, formationKey]);

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 py-6 sm:px-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-faint">FM26 tactic board</span>

        <div className="flex items-end gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.06em] text-faint">
              Formation
            </span>
            <select
              value={formationKey}
              onChange={(e) => changeFormation(e.target.value as FormationKey)}
              className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-brand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {Object.keys(FORMATIONS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => toggleJson()}
            className="cursor-pointer rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] text-dim transition-colors hover:border-brand-2 hover:text-brand-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {showJson ? "Hide JSON" : "Show JSON"}
          </button>
        </div>
      </header>

      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPhase("ip")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            isIP
              ? "border-ip bg-ip-bg text-ip"
              : "border-border bg-surface text-dim"
          }`}
        >
          <span className="inline-block size-2 rounded-full bg-ip" /> In possession
        </button>
        <button
          onClick={() => setPhase("oop")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            !isIP
              ? "border-oop bg-oop-bg text-oop"
              : "border-border bg-surface text-dim"
          }`}
        >
          <span className="inline-block size-2 rounded-full bg-oop" /> Out of
          possession
        </button>
        <span className="ml-1 text-xs text-faint">
          {isIP
            ? "in possession — where the team has the ball"
            : "out of possession — where the team defends"}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div
          className="w-full rounded-[14px] border border-border bg-surface p-3 lg:max-w-[720px]"
          style={{
            boxShadow: `inset 0 0 0 1px var(--color-border), inset 0 0 70px ${
              isIP ? "rgba(232,169,58,0.05)" : "rgba(74,158,224,0.05)"
            }`,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="block w-full touch-none select-none"
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
          >
            <rect x="4" y="4" width="92" height="124" rx="3" fill="#11211A" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <rect x="4" y="4" width="92" height="124" rx="3" fill={isIP ? "rgba(232,169,58,0.05)" : "rgba(74,158,224,0.05)"} />
            <line x1="4" y1="66" x2="96" y2="66" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <circle cx="50" cy="66" r="11" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <circle cx="50" cy="66" r="0.8" fill="rgba(255,255,255,0.18)" />
            <rect x="28" y="4" width="44" height="16" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <rect x="40" y="4" width="20" height="7" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <rect x="28" y="112" width="44" height="16" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <rect x="40" y="121" width="20" height="7" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />

            {/* ghost: selected player's OTHER-phase position */}
            {selected && (
              <g pointerEvents="none">
                <circle
                  cx={mapX(selected.pos[isIP ? "oop" : "ip"].x)}
                  cy={mapY(selected.pos[isIP ? "oop" : "ip"].y)}
                  r="3.4"
                  fill="none"
                  stroke={isIP ? "var(--color-oop)" : "var(--color-ip)"}
                  strokeWidth="0.6"
                  strokeDasharray="1.6 1.4"
                  opacity="0.8"
                />
              </g>
            )}

            {players.map((p) => {
              const pos = p.pos[phase];
              const cx = mapX(pos.x),
                cy = mapY(pos.y);
              const isSel = p.id === selectedId;
              const fill = p.family === "gk" ? "#2A3340" : isSel ? phaseColor : "#28323F";
              const txt = isSel && p.family !== "gk" ? "#10151C" : "#DCE3EC";
              return (
                <g
                  key={p.id}
                  onPointerDown={(e) => onPlayerDown(e, p.id)}
                  style={{ cursor: p.family === "gk" ? "default" : "grab" }}
                >
                  {isSel && (
                    <circle cx={cx} cy={cy} r="4.6" fill="none" stroke={phaseColor} strokeWidth="0.5" opacity="0.55" />
                  )}
                  <circle cx={cx} cy={cy} r="3.4" fill={fill} stroke="rgba(0,0,0,0.35)" strokeWidth="0.4" />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="2.9"
                    fontWeight="600"
                    fill={txt}
                    style={{ pointerEvents: "none" }}
                  >
                    {p.lbl}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 px-0.5 text-center text-[11.5px] text-faint">
            Drag a player. The dashed ring shows where they stand in the other
            phase.
          </p>
        </div>

        <aside className="rounded-[14px] border border-border bg-surface p-[18px] lg:min-h-[260px]">
          {!selected || selected.family === "gk" ? (
            <div className="flex flex-col gap-1.5">
              <div className="text-[13px] text-faint">
                {selected ? selected.lbl : "—"}
              </div>
              <div className="mb-3.5 text-[23px] font-medium leading-[1.1] tracking-[-0.01em]">
                Goalkeeper
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-dim">
                Fixed position. Select an outfield player to see role
                suggestions.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="rounded-md px-2.5 py-[3px] text-[13px] font-semibold"
                  style={{ background: phaseBg, color: phaseColor }}
                >
                  {selected.lbl}
                </span>
                <span className="text-xs text-faint">
                  {isIP ? "in possession" : "out of possession"}
                </span>
              </div>

              <div className="mb-1.5 text-[11px] uppercase tracking-[0.06em] text-faint">
                Suggested role
              </div>
              <div className="mb-3.5 text-[23px] font-medium leading-[1.1] tracking-[-0.01em]">
                {match!.role.name}
              </div>

              <div className="mb-[18px] flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-surface-2">
                  <div
                    className="h-full rounded-[3px] transition-[width] duration-100"
                    style={{ width: `${match!.conf}%`, background: phaseColor }}
                  />
                </div>
                <span
                  className="min-w-11 text-right text-[17px] font-semibold tabular-nums"
                  style={{ color: phaseColor }}
                >
                  {match!.conf}
                  <span className="ml-px text-[11px] opacity-70">%</span>
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between border-y border-border py-2.5">
                <span className="text-[13px] text-dim">Instruction</span>
                <span className="text-[13px] font-medium">
                  {match!.role.instr}
                </span>
              </div>

              <div className="mb-1.5 text-[11px] uppercase tracking-[0.06em] text-faint">
                Why
              </div>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {match!.role.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[7px] px-2.5 py-1 text-xs font-medium"
                    style={{ background: phaseBg, color: phaseColor }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {match!.second && (
                <div className="mt-0.5 text-[12.5px] text-faint">
                  Second best: {match!.second.name} · {match!.conf2}%
                </div>
              )}
            </>
          )}
        </aside>
      </div>

      {showJson && (
        <div className="mt-4 overflow-hidden rounded-[14px] border border-border bg-surface">
          <div className="flex items-baseline gap-2.5 border-b border-border px-4 py-3">
            <span className="text-[13px] font-medium">Tactic as JSON</span>
            <span className="text-xs text-faint">
              = your Supabase row + your FM setup sheet
            </span>
          </div>
          <pre className="m-0 max-h-80 overflow-auto p-4 text-xs leading-relaxed text-dim tabular-nums">
            {tacticJson}
          </pre>
        </div>
      )}
    </div>
  );
}
