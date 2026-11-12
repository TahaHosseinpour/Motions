// Scenes about choosing / judgement.
//
// crowd-build    — a grid of little dots each pops out a box (= everyone can build now); the hero builds too.
// pick-direction — a fan of faint paths, each ending in a box; on cue 1 one path turns bold, ends in a target,
//                  the others fade, and the dot travels it. ("what to build" > "building")
// clock          — clock face, the dot is the hub; a yellow "right moment" window on the rim; the hand sweeps
//                  into it and the window turns green. ("when to build")
import React from "react";
import { draw, ease, exitFade, mix, tween } from "../../../core/anim";
import { Cube, Target, rnd } from "../shapes";
import { SceneDef, T, cue, line } from "../theme";

// ── crowd-build ─────────────────────────────────────────────────────────
const GX = [220, 380, 540, 700, 860];
const GY = [T.cy - 170, T.cy, T.cy + 170];
const cells = GY.flatMap((y, r) => GX.map((x, c) => ({ x, y, i: r * 5 + c }))).filter((c) => !(c.x === T.cx && c.y === T.cy));
export const crowdBuild: SceneDef = {
  Visual: ({ f, dur }) => (
    <g opacity={exitFade(f, dur)}>
      <Cube x={T.cx} y={T.cy} s={46} scale={tween(f, 2, 12, 0, 1, ease.back)} />
      {cells.map(({ x, y, i }) => {
        const t0 = 8 + rnd(i) * dur * 0.5;
        return (
          <g key={i}>
            <circle cx={x} cy={y - 34 - 11} r={9} fill={T.ink} opacity={tween(f, t0 - 6, t0 - 2)} />
            <Cube x={x} y={y} s={30} scale={tween(f, t0, t0 + 9, 0, 1, ease.back)} />
          </g>
        );
      })}
    </g>
  ),
  dot: () => ({ x: T.cx, y: T.cy - 46 - T.dotR - 2, r: T.dotR }),
};

// ── pick-direction ──────────────────────────────────────────────────────
const O = { x: T.cx, y: T.cy + 210 };
const ANG = [-155, -132, -111, -90, -68, -47, -25];
const PICK = 4;
const R = 400;
const end = (a: number, r = R) => ({ x: O.x + r * Math.cos((a * Math.PI) / 180), y: O.y + r * Math.sin((a * Math.PI) / 180) });
export const pickDirection: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.45);
    const chosen = tween(f, c1, c1 + 12);
    return (
      <g opacity={exitFade(f, dur)}>
        {ANG.map((a, i) => {
          const e = end(a);
          const isPick = i === PICK;
          const fade = isPick ? 1 : mix(1, 0.18, chosen);
          return (
            <g key={i} opacity={fade}>
              <line x1={O.x} y1={O.y} x2={e.x} y2={e.y} {...line(T.thin)} stroke={T.inkSoft} {...draw(tween(f, i * 2, 16 + i * 2))} />
              {!(isPick && chosen > 0) && <Cube x={e.x} y={e.y} s={24} scale={tween(f, 12 + i * 2, 20 + i * 2, 0, 1, ease.back)} />}
            </g>
          );
        })}
        <line x1={O.x} y1={O.y} x2={end(ANG[PICK]).x} y2={end(ANG[PICK]).y} {...line(6)} {...draw(chosen)} />
        {chosen > 0 && <Target x={end(ANG[PICK]).x} y={end(ANG[PICK]).y} r={46} p={tween(f, c1 + 6, c1 + 22)} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.45);
    const t = tween(f, c1 + 10, c1 + 34);
    const e = end(ANG[PICK], R * 0.8);
    return { x: mix(O.x, e.x, t), y: mix(O.y, e.y, t), r: T.dotR };
  },
};

// ── clock ───────────────────────────────────────────────────────────────
const CR = 220;
const polar = (deg: number, r: number) => ({ x: T.cx + r * Math.sin((deg * Math.PI) / 180), y: T.cy - r * Math.cos((deg * Math.PI) / 180) });
const arc = (a0: number, a1: number, r: number) => {
  const p0 = polar(a0, r);
  const p1 = polar(a1, r);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
};
const WIN: [number, number] = [245, 295];
export const clock: SceneDef = {
  Visual: ({ f, dur }) => {
    const sweepEnd = dur - 22;
    const angle = tween(f, 8, sweepEnd, 0, 270, ease.inOut);
    const hit = tween(f, sweepEnd, sweepEnd + 8);
    const hand = polar(angle, 170);
    const ring = tween(f, sweepEnd, sweepEnd + 20, 0, 1, ease.out);
    return (
      <g opacity={exitFade(f, dur, 6)}>
        <path d={arc(WIN[0], WIN[1], CR)} {...line(26)} strokeLinecap="butt" stroke={hit > 0 ? T.good : T.highlight} opacity={tween(f, 10, 18)} />
        <circle cx={T.cx} cy={T.cy} r={CR} {...line()} {...draw(tween(f, 0, 18))} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = polar(i * 30, CR - 18);
          const b = polar(i * 30, CR - (i % 3 === 0 ? 44 : 32));
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...line(i % 3 === 0 ? 5 : T.thin)} opacity={tween(f, 8 + i, 12 + i)} />;
        })}
        <line x1={T.cx} y1={T.cy} x2={polar(60, 110).x} y2={polar(60, 110).y} {...line(5)} stroke={T.inkSoft} opacity={tween(f, 6, 12)} />
        <line x1={T.cx} y1={T.cy} x2={hand.x} y2={hand.y} {...line(7)} opacity={tween(f, 6, 12)} />
        {ring > 0 && ring < 1 && <circle cx={T.cx} cy={T.cy} r={CR + 70 * ring} {...line(4)} stroke={T.good} opacity={1 - ring} />}
      </g>
    );
  },
  dot: () => ({ x: T.cx, y: T.cy, r: T.dotR + 3 }),
};
