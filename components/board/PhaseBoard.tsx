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

  Brand colors are the two CSS vars --brand / --brand-2 near the top of styles.
  Phase colors (--ip / --oop) are kept separate on purpose: they're functional
  (warm = with ball, cool = without), not brand.
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
  const phaseColor = isIP ? "var(--ip)" : "var(--oop)";
  const phaseBg = isIP ? "var(--ip-bg)" : "var(--oop-bg)";

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
    <div style={S.root} className="phase-root">
      <style>{CSS}</style>

      <header style={S.header}>
        <div style={S.brandWrap}>
          <span style={S.logoMark} aria-hidden="true" />
          <span style={S.wordmark}>Pitchflow</span>
          <span style={S.tagline}>FM26 tactic board</span>
        </div>

        <div style={S.controls}>
          <label style={S.selWrap}>
            <span style={S.selLabel}>Formation</span>
            <select
              value={formationKey}
              onChange={(e) => changeFormation(e.target.value as FormationKey)}
              style={S.select}
            >
              {Object.keys(FORMATIONS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => toggleJson()} style={S.ghostBtn} className="jbtn">
            {showJson ? "Skjul JSON" : "Vis JSON"}
          </button>
        </div>
      </header>

      <div style={S.phaseRow}>
        <button
          onClick={() => setPhase("ip")}
          style={{
            ...S.phaseBtn,
            ...(isIP
              ? { background: "var(--ip-bg)", color: "var(--ip)", borderColor: "var(--ip)" }
              : {}),
          }}
        >
          <span style={{ ...S.dot, background: "var(--ip)" }} /> Med bold
        </button>
        <button
          onClick={() => setPhase("oop")}
          style={{
            ...S.phaseBtn,
            ...(!isIP
              ? { background: "var(--oop-bg)", color: "var(--oop)", borderColor: "var(--oop)" }
              : {}),
          }}
        >
          <span style={{ ...S.dot, background: "var(--oop)" }} /> Uden bold
        </button>
        <span style={S.phaseHint}>
          {isIP
            ? "in possession — hvor holdet står med bolden"
            : "out of possession — hvor holdet forsvarer"}
        </span>
      </div>

      <div style={S.main} className="phase-main">
        <div
          style={{
            ...S.pitchCard,
            boxShadow: `inset 0 0 0 1px var(--border), inset 0 0 70px ${
              isIP ? "rgba(232,169,58,0.05)" : "rgba(74,158,224,0.05)"
            }`,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={S.svg}
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
                  stroke={isIP ? "var(--oop)" : "var(--ip)"}
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
                    style={{ pointerEvents: "none", fontFamily: "var(--mono)" }}
                  >
                    {p.lbl}
                  </text>
                </g>
              );
            })}
          </svg>
          <p style={S.pitchFoot}>
            Træk en spiller. Den stiplede ring viser hvor han står i den anden fase.
          </p>
        </div>

        <aside style={S.inspector}>
          {!selected || selected.family === "gk" ? (
            <div style={S.inspEmpty}>
              <div style={S.inspPos}>{selected ? selected.lbl : "—"}</div>
              <div style={S.roleName}>Målmand</div>
              <p style={S.note}>
                Fast position. Vælg en markspiller for at se rolleforslag.
              </p>
            </div>
          ) : (
            <>
              <div style={S.inspTop}>
                <span style={{ ...S.posBadge, background: phaseBg, color: phaseColor }}>
                  {selected.lbl}
                </span>
                <span style={S.phaseTag}>{isIP ? "med bold" : "uden bold"}</span>
              </div>

              <div style={S.roleLabel}>Foreslået rolle</div>
              <div style={S.roleName}>{match!.role.name}</div>

              <div style={S.scoreRow}>
                <div style={S.scoreTrack}>
                  <div style={{ ...S.scoreFill, width: `${match!.conf}%`, background: phaseColor }} />
                </div>
                <span style={{ ...S.scoreNum, color: phaseColor }}>
                  {match!.conf}
                  <span style={S.scorePct}>%</span>
                </span>
              </div>

              <div style={S.kv}>
                <span style={S.kvKey}>Instruks</span>
                <span style={S.kvVal}>{match!.role.instr}</span>
              </div>

              <div style={S.roleLabel}>Hvorfor</div>
              <div style={S.tags}>
                {match!.role.tags.map((t) => (
                  <span key={t} style={{ ...S.tag, background: phaseBg, color: phaseColor }}>
                    {t}
                  </span>
                ))}
              </div>

              {match!.second && (
                <div style={S.second}>
                  Næstbedste: {match!.second.name} · {match!.conf2}%
                </div>
              )}
            </>
          )}
        </aside>
      </div>

      {showJson && (
        <div style={S.jsonCard}>
          <div style={S.jsonHead}>
            <span style={S.jsonTitle}>Taktik som JSON</span>
            <span style={S.jsonSub}>= din Supabase-række + dit FM-opskriftsark</span>
          </div>
          <pre style={S.pre}>{tacticJson}</pre>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@500;600&display=swap');
.phase-root *{box-sizing:border-box}
.phase-root select:focus,.phase-root button:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
@media (max-width:760px){.phase-main{grid-template-columns:1fr !important}}
.phase-root select:hover{border-color:var(--brand-2)}
.phase-root .jbtn{transition:border-color .15s,color .15s}
.phase-root .jbtn:hover{border-color:var(--brand-2);color:var(--brand-2)}
`;

const S: Record<string, React.CSSProperties> = {
  root: {
    "--bg": "#0E1218",
    "--surface": "#161B24",
    "--surface2": "#1E2530",
    "--border": "rgba(255,255,255,0.09)",
    "--borderStrong": "rgba(255,255,255,0.16)",
    "--text": "#E7ECF3",
    "--dim": "#98A2B3",
    "--faint": "#5C6675",
    "--brand": "#6260FF",
    "--brand-2": "#E4E4FF",
    "--ip": "#E8A93A",
    "--ip-bg": "rgba(232,169,58,0.14)",
    "--oop": "#4A9EE0",
    "--oop-bg": "rgba(74,158,224,0.14)",
    "--mono": "'JetBrains Mono', ui-monospace, monospace",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "20px",
    borderRadius: "16px",
    maxWidth: "920px",
    margin: "0 auto",
  } as React.CSSProperties,
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" },
  brandWrap: { display: "flex", alignItems: "center", gap: "10px" },
  logoMark: { width: "14px", height: "14px", borderRadius: "4px", background: "var(--brand)", display: "inline-block", transform: "rotate(45deg)" },
  wordmark: { fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.02em" },
  tagline: { fontSize: "12px", color: "var(--faint)", borderLeft: "1px solid var(--border)", paddingLeft: "10px", marginLeft: "2px" },
  controls: { display: "flex", alignItems: "flex-end", gap: "10px" },
  selWrap: { display: "flex", flexDirection: "column", gap: "4px" },
  selLabel: { fontSize: "11px", color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em" },
  select: { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", padding: "7px 10px", fontSize: "13px", fontFamily: "var(--mono)" },
  ghostBtn: { background: "transparent", color: "var(--dim)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", cursor: "pointer" },
  phaseRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" },
  phaseBtn: { display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--surface)", color: "var(--dim)", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--border)", borderRadius: "10px", padding: "9px 16px", fontSize: "14px", fontWeight: 500, cursor: "pointer" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" },
  phaseHint: { fontSize: "12px", color: "var(--faint)", marginLeft: "4px" },
  main: { display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "16px" },
  pitchCard: { background: "var(--surface)", borderRadius: "14px", padding: "12px", border: "1px solid var(--border)" },
  svg: { width: "100%", display: "block", touchAction: "none", userSelect: "none" },
  pitchFoot: { fontSize: "11.5px", color: "var(--faint)", margin: "8px 2px 0", textAlign: "center" },
  inspector: { background: "var(--surface)", borderRadius: "14px", padding: "18px", border: "1px solid var(--border)", minHeight: "260px" },
  inspEmpty: { display: "flex", flexDirection: "column", gap: "6px" },
  inspTop: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
  posBadge: { fontFamily: "var(--mono)", fontWeight: 600, fontSize: "13px", padding: "3px 9px", borderRadius: "6px" },
  phaseTag: { fontSize: "12px", color: "var(--faint)" },
  inspPos: { fontFamily: "var(--mono)", fontSize: "13px", color: "var(--faint)" },
  roleLabel: { fontSize: "11px", color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" },
  roleName: { fontFamily: "'Satoshi', sans-serif", fontSize: "23px", fontWeight: 500, lineHeight: 1.1, marginBottom: "14px", letterSpacing: "-0.01em" },
  scoreRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" },
  scoreTrack: { flex: 1, height: "6px", background: "var(--surface2)", borderRadius: "3px", overflow: "hidden" },
  scoreFill: { height: "100%", borderRadius: "3px", transition: "width 0.12s ease" },
  scoreNum: { fontFamily: "var(--mono)", fontWeight: 600, fontSize: "17px", minWidth: "44px", textAlign: "right" },
  scorePct: { fontSize: "11px", opacity: 0.7, marginLeft: "1px" },
  kv: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "16px" },
  kvKey: { fontSize: "13px", color: "var(--dim)" },
  kvVal: { fontSize: "13px", fontWeight: 500, fontFamily: "var(--mono)" },
  tags: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" },
  tag: { fontSize: "12px", padding: "4px 10px", borderRadius: "7px", fontWeight: 500 },
  second: { fontSize: "12.5px", color: "var(--faint)", marginTop: "2px" },
  note: { fontSize: "13px", color: "var(--dim)", lineHeight: 1.5, marginTop: "4px" },
  jsonCard: { marginTop: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" },
  jsonHead: { display: "flex", alignItems: "baseline", gap: "10px", padding: "12px 16px", borderBottom: "1px solid var(--border)" },
  jsonTitle: { fontSize: "13px", fontWeight: 500 },
  jsonSub: { fontSize: "12px", color: "var(--faint)" },
  pre: { margin: 0, padding: "16px", fontSize: "12px", fontFamily: "var(--mono)", color: "var(--dim)", maxHeight: "320px", overflow: "auto", lineHeight: 1.5 },
};
