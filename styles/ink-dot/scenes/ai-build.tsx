// Scenes about building with AI.
//
// code-window — an editor window types its code; on cue 1 a red ✕ crosses it ("you don't need to be a hardcore coder").
// write-doc   — a document writes itself line by line; the dot is the pen tip. Tags pop at the side at times
//               given in props.tags: [{ text, at (s, beat-relative) }]   e.g. بریف / پرامپت / اسپک
// agent       — doc → agent box (rotating gear) → output window. The dot carries the doc in, sits as the gear hub,
//               and on cue 1 the output appears and the dot hops onto it.
// evaluate    — a magnifier (dot = lens center) scans the output's lines; on cue 2 a ✓ and a ✕ appear ("is it or isn't it?").
// checklist   — three rows; the dot hops box to box ticking green ✓. Last tick lands on cue 1.
import React from "react";
import { draw, ease, exitFade, hop, mix, tween } from "../../../core/anim";
import { Check, Cross } from "../primitives";
import { CodeWindow, Doc, Gear, Magnifier, docPen } from "../shapes";
import { SceneDef, T, cue, line } from "../theme";

// ── code-window ─────────────────────────────────────────────────────────
const CW = { x: T.cx, y: T.cy, w: 600, h: 420 };
export const codeWindow: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.55);
    return (
      <g opacity={exitFade(f, dur)}>
        <g opacity={mix(1, 0.45, tween(f, c1, c1 + 10))}>
          <CodeWindow {...CW} p={tween(f, 2, c1 - 4, 0, 1, (t) => t)} />
          <text x={CW.x + CW.w / 2 - 40} y={CW.y - CW.h / 2 + 42} textAnchor="end" fontFamily={T.fontSans} fontWeight={700} fontSize={28} fill={T.inkSoft} direction="ltr">
            {"</>"}
          </text>
        </g>
        <Cross x={CW.x} y={CW.y + 20} size={150} p={tween(f, c1, c1 + 12)} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.55);
    const t = tween(f, c1 + 4, c1 + 16, 0, 1, (x) => x);
    const top = CW.y - CW.h / 2 - T.dotR - 2;
    return { ...hop(t, 760, top, 900, CW.y + CW.h / 2 - T.dotR, 60), r: T.dotR };
  },
};

// ── write-doc ───────────────────────────────────────────────────────────
const D = { x: 640, y: T.cy, w: 360, h: 470, lines: 8 };
type Tag = { text: string; at: number };
export const writeDoc: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const tags = (p.tags as Tag[]) ?? [];
    return (
      <g opacity={exitFade(f, dur)}>
        <Doc {...D} p={tween(f, 6, dur - 8, 0, 1, (t) => t)} o={tween(f, 0, 6)} />
        {tags.map((t, i) => {
          const s = tween(f, t.at * 30, t.at * 30 + 9, 0, 1, ease.back);
          const y = T.cy - 150 + i * 150;
          return (
            <g key={i} transform={`translate(255 ${y}) scale(${s})`}>
              <rect x={-105} y={-42} width={210} height={84} rx={42} {...line()} fill={T.paper} />
              <text x={0} y={14} textAnchor="middle" fontFamily={T.font} fontSize={44} fill={T.ink}>
                {t.text}
              </text>
            </g>
          );
        })}
      </g>
    );
  },
  dot: (f, dur) => {
    const pen = docPen(D.x, D.y, D.w, D.h, D.lines, tween(f, 6, dur - 8, 0, 1, (t) => t));
    return { x: pen.x, y: pen.y + 4 * Math.sin(f * 1.3), r: T.dotR - 3 };
  },
};

// ── agent ───────────────────────────────────────────────────────────────
const DOC = { x: 860, y: T.cy, w: 130, h: 170 };
const AG = { x: T.cx, y: T.cy, s: 220 };
const OUT = { x: 215, y: T.cy, w: 200, h: 160 };
const Arrow: React.FC<{ x1: number; x2: number; y: number; p: number }> = ({ x1, x2, y, p }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} {...line(T.thin)} strokeDasharray="10 10" opacity={p} />
    <path d={`M ${x2 + 16} ${y - 14} L ${x2} ${y} L ${x2 + 16} ${y + 14}`} {...line(T.thin)} opacity={p} />
  </g>
);
export const agent: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.6);
    const busy = f > 24 && f < c1 + 10;
    return (
      <g opacity={exitFade(f, dur)}>
        <Doc x={DOC.x} y={DOC.y} w={DOC.w} h={DOC.h} lines={4} o={tween(f, 0, 6)} />
        <Arrow x1={790} x2={662} y={T.cy} p={tween(f, 4, 12)} />
        <rect x={AG.x - AG.s / 2} y={AG.y - AG.s / 2} width={AG.s} height={AG.s} rx={36} {...line()} fill={T.paper} {...draw(tween(f, 0, 16))} />
        <Gear x={AG.x} y={AG.y} r={52} rot={busy ? (f - 24) * 6 : 0} o={tween(f, 8, 16)} />
        <text x={AG.x} y={AG.y + AG.s / 2 + 56} textAnchor="middle" fontFamily={T.font} fontSize={40} fill={T.inkSoft} opacity={tween(f, 10, 18)}>
          ایجنت
        </text>
        <Arrow x1={418} x2={330} y={T.cy} p={tween(f, c1 - 6, c1 + 2)} />
        <CodeWindow x={OUT.x} y={OUT.y} w={OUT.w} h={OUT.h} lines={3} p={tween(f, c1, c1 + 16)} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.6);
    const docTop = DOC.y - DOC.h / 2 - T.dotR - 2;
    if (f < 10) return { x: DOC.x, y: docTop, r: T.dotR };
    if (f < 26) return { ...hop(tween(f, 10, 26, 0, 1, (t) => t), DOC.x, docTop, AG.x, AG.y, 80), r: T.dotR };
    if (f < c1 + 6) return { x: AG.x, y: AG.y, r: T.dotR };
    return { ...hop(tween(f, c1 + 6, c1 + 20, 0, 1, (t) => t), AG.x, AG.y, OUT.x, OUT.y - OUT.h / 2 - T.dotR - 2, 90), r: T.dotR };
  },
};

// ── evaluate ────────────────────────────────────────────────────────────
const EV = { x: T.cx, y: T.cy + 20, w: 560, h: 400 };
const SCAN = [
  { x: 960, y: 1180 },
  { x: 720, y: 820 },
  { x: 380, y: 860 },
  { x: 700, y: 950 },
  { x: 400, y: 1010 },
  { x: 600, y: 960 },
];
const scanAt = (t: number) => {
  const n = SCAN.length - 1;
  const k = Math.min(n - 1, Math.floor(t * n));
  const u = ease.inOut(Math.min(1, t * n - k));
  return { x: mix(SCAN[k].x, SCAN[k + 1].x, u), y: mix(SCAN[k].y, SCAN[k + 1].y, u) };
};
export const evaluate: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c2 = cue(p, 2, dur, 0.7);
    const lens = scanAt(tween(f, 0, dur - 16, 0, 1, (t) => t));
    return (
      <g opacity={exitFade(f, dur)}>
        <CodeWindow {...EV} p={1} o={tween(f, 0, 8)} />
        <Magnifier x={lens.x} y={lens.y} r={72} />
        <Check x={760} y={EV.y - EV.h / 2 - 60} size={30} p={tween(f, c2, c2 + 10)} />
        <Cross x={320} y={EV.y - EV.h / 2 - 60} size={22} p={tween(f, c2 + 6, c2 + 16)} />
        <text x={T.cx} y={EV.y - EV.h / 2 - 44} textAnchor="middle" fontFamily={T.font} fontSize={56} fill={T.inkSoft} opacity={tween(f, c2 + 4, c2 + 12)}>
          ؟
        </text>
      </g>
    );
  },
  dot: (f, dur) => ({ ...scanAt(tween(f, 0, dur - 16, 0, 1, (t) => t)), r: T.dotR }),
};

// ── checklist ───────────────────────────────────────────────────────────
const ROWS = [T.cy - 120, T.cy, T.cy + 120];
const BOX_X = 770;
const LEFT = [300, 380, 330];
const ticks = (dur: number, p: Record<string, unknown>) => {
  const c1 = cue(p, 1, dur, 0.75);
  return [18, Math.round(18 + (c1 - 18) / 2), c1 + 4];
};
export const checklist: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const tk = ticks(dur, p);
    return (
      <g opacity={exitFade(f, dur)}>
        {ROWS.map((y, i) => (
          <g key={i}>
            <rect x={BOX_X - 30} y={y - 30} width={60} height={60} rx={10} {...line()} fill={T.paper} {...draw(tween(f, i * 4, 12 + i * 4))} />
            <line x1={BOX_X - 70} y1={y} x2={LEFT[i]} y2={y} {...line(5)} stroke={T.inkSoft} {...draw(tween(f, 4 + i * 4, 18 + i * 4))} />
            <Check x={BOX_X} y={y} size={24} p={tween(f, tk[i], tk[i] + 8)} />
          </g>
        ))}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const tk = ticks(dur, p);
    const at = (i: number) => ({ x: BOX_X + 70, y: ROWS[i] });
    if (f < tk[0] - 8) return { ...at(0), r: T.dotR };
    for (let i = 1; i < 3; i++) {
      if (f < tk[i] - 8) {
        const t = tween(f, tk[i - 1] + 4, tk[i] - 8, 0, 1, (x) => x);
        const a = at(i - 1);
        const b = at(i);
        return { ...hop(t, a.x, a.y, b.x, b.y, 50), r: T.dotR };
      }
    }
    return { ...at(2), r: T.dotR };
  },
};
