// Scenes for "a framework of N pillars" stories.
//
// question  — a big hand-drawn "؟" draws itself; the dot IS its point.
// opinions  — speech bubbles pop around the dot with "!" / "؟" (disagreement); at the end they collapse inward.
// pillars   — three pillars (۱ ۲ ۳, RTL) on a ground line. props: active 0|1|2|3, rise (grow from ground)
// temple    — the three pillars carry a roof (= the whole); coins drop beside it on cue 2; sparkles on cue 3.
import React from "react";
import { draw, ease, exitFade, mix, tween } from "../../../core/anim";
import { Bubble, Coin, Pillar } from "../shapes";
import { SceneDef, T, cue, line } from "../theme";

// ── question ────────────────────────────────────────────────────────────
const Q_DOT = { x: T.cx, y: T.cy + 70 };
export const question: SceneDef = {
  Visual: ({ f, dur }) => (
    <g opacity={exitFade(f, dur)}>
      <path
        d={`M 430 ${T.cy - 200} C 430 ${T.cy - 330}, 650 ${T.cy - 330}, 650 ${T.cy - 205} C 650 ${T.cy - 120}, 540 ${T.cy - 115}, 540 ${T.cy - 40} L 540 ${T.cy - 15}`}
        {...line(16)}
        {...draw(tween(f, 6, 34))}
      />
      {[-30, 0, 30].map((a, i) => {
        const p = tween(f, 34 + i * 3, 42 + i * 3);
        const r0 = 80;
        const r1 = 80 + 40 * p;
        const rad = ((a - 45) * Math.PI) / 180;
        const cx = 690;
        const cy = T.cy - 300;
        return <line key={a} x1={cx + r0 * Math.cos(rad)} y1={cy + r0 * Math.sin(rad)} x2={cx + r1 * Math.cos(rad)} y2={cy + r1 * Math.sin(rad)} {...line()} opacity={p} />;
      })}
    </g>
  ),
  dot: (f) => ({ ...Q_DOT, r: 22 * tween(f, 0, 12, 0, 1, ease.back) }),
};

// ── opinions ────────────────────────────────────────────────────────────
const BUBBLES = [
  { x: 290, y: T.cy - 170, rot: -8, tail: 1, mark: "!" },
  { x: 790, y: T.cy - 190, rot: 7, tail: -1, mark: "؟" },
  { x: 250, y: T.cy + 80, rot: 6, tail: 1, mark: "" },
  { x: 830, y: T.cy + 60, rot: -6, tail: -1, mark: "!" },
  { x: 540, y: T.cy + 190, rot: 3, tail: 1, mark: "؟" },
];
export const opinions: SceneDef = {
  Visual: ({ f, dur }) => {
    const collapse = tween(f, dur - 16, dur - 2, 0, 1, ease.in);
    return (
      <g>
        {BUBBLES.map((b, i) => {
          const s = tween(f, 4 + i * 7, 14 + i * 7, 0, 1, ease.back) * (1 - collapse);
          const x = mix(b.x, T.cx, collapse);
          const y = mix(b.y, T.cy, collapse);
          const rot = b.rot + 4 * Math.sin(f / 5 + i * 2);
          return (
            <g key={i}>
              <Bubble x={x} y={y} rot={rot} tail={b.tail} s={s} />
              {b.mark && (
                <text x={x + (b.tail > 0 ? 110 : -110)} y={y - 50} textAnchor="middle" fontFamily={T.font} fontSize={70} fill={T.ink} opacity={tween(f, 24 + i * 6, 30 + i * 6) * (1 - collapse)}>
                  {b.mark}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  },
  dot: (f, dur) => ({ x: T.cx + 22 * Math.sin(f / 7) * (1 - tween(f, dur - 16, dur)), y: T.cy - 20, r: T.dotR }),
};

// ── pillars ─────────────────────────────────────────────────────────────
const PX = [760, 540, 320];
const GROUND = T.cy + 200;
const PH = 320;
const NUM = ["۱", "۲", "۳"];
export const pillars: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const active = (p.active as number) ?? 0;
    const rise = !!p.rise;
    return (
      <g opacity={exitFade(f, dur)}>
        <line x1={180} y1={GROUND} x2={900} y2={GROUND} {...line()} {...draw(rise ? tween(f, 0, 14) : 1)} />
        {PX.map((x, i) => {
          const grow = rise ? tween(f, 4 + i * 6, 26 + i * 6, 0, 1, ease.out) : 1;
          const on = active === i + 1;
          const dim = active > 0 && !on ? mix(1, 0.3, tween(f, 2, 12)) : 1;
          return (
            <g key={i} transform={`translate(${x} ${GROUND}) scale(1 ${grow > 0 ? 1 : 0}) translate(${-x} ${-GROUND})`}>
              <Pillar x={x} ground={GROUND} height={PH} grow={grow} fillP={on ? tween(f, 6, 30, 0, 1, ease.out) : 0} o={dim * (rise ? 1 : tween(f, 0, 6))} label={NUM[i]} />
            </g>
          );
        })}
      </g>
    );
  },
  dot: (f, _d, p) => {
    const active = (p.active as number) ?? 0;
    const x = active ? PX[active - 1] : PX[1];
    const grow = p.rise ? tween(f, 10, 32, 0, 1, ease.out) : 1;
    return { x, y: GROUND - PH * grow - T.dotR - 2, r: T.dotR };
  },
};

// ── temple ──────────────────────────────────────────────────────────────
const TX = [680, 540, 400];
const TG = T.cy + 190;
const TH = 280;
const ROOF_Y = TG - TH; // top of pillars
export const temple: SceneDef = {
  Visual: ({ f, p }) => {
    const c1 = cue(p, 1, 60, 0.25);
    const c2 = cue(p, 2, 120, 0.5);
    const c3 = cue(p, 3, 160, 0.7);
    const roof = tween(f, c1, c1 + 18);
    return (
      <g>
        <line x1={250} y1={TG} x2={930} y2={TG} {...line()} />
        {TX.map((x, i) => (
          <Pillar key={i} x={x} ground={TG} height={TH} w={86} fillP={tween(f, 2 + i * 4, 18 + i * 4)} />
        ))}
        <rect x={320} y={ROOF_Y - 26} width={440} height={26} rx={4} {...line()} fill={T.paper} {...draw(roof)} />
        <path d={`M 300 ${ROOF_Y - 26} L 540 ${ROOF_Y - 150} L 780 ${ROOF_Y - 26} Z`} {...line()} fill={T.paper} {...draw(roof)} />
        {Array.from({ length: 5 }, (_, i) => {
          const s = c2 + i * 5;
          const t = tween(f, s, s + 12, 0, 1, ease.in);
          return f >= s ? <Coin key={i} x={870} y={mix(560, TG - 16 - i * 24, t)} r={36} /> : null;
        })}
        {[-50, -90, -130].map((a, i) => {
          const q = tween(f, c3 + i * 3, c3 + 8 + i * 3);
          const rad = (a * Math.PI) / 180;
          const cx = 540;
          const cy = ROOF_Y - 186;
          return <line key={a} x1={cx + 40 * Math.cos(rad)} y1={cy + 40 * Math.sin(rad)} x2={cx + (40 + 34 * q) * Math.cos(rad)} y2={cy + (40 + 34 * q) * Math.sin(rad)} {...line()} opacity={q} />;
        })}
      </g>
    );
  },
  dot: (f, _d, p) => {
    const c1 = cue(p, 1, 60, 0.25);
    const up = tween(f, c1 + 10, c1 + 24, 0, 1, ease.inOut);
    return { x: T.cx, y: mix(ROOF_Y - 26 - T.dotR - 2, ROOF_Y - 150 - T.dotR - 4, up) - 30 * Math.sin(Math.PI * up), r: T.dotR };
  },
};
