// Scenes about products, attention and growth.
//
// crowd-products — your box builds itself (dot on top); on cue 1 identical boxes pop all around and yours
//                  shrinks into the crowd ("built simply & cheaply, like everyone else").
// attract        — yellow attention waves pulse from your box; on cue 1 users walk in from the edges and gather.
// fill-up        — users drop into a glass that fills up (retention, the mirror of `leak`); the dot floats on top;
//                  a green ↑ grows on cue 1.
// fast-build     — boxes pop up faster and faster everywhere; the dot hops on them (products are built fast).
// flatline       — axes; a faint dashed "hoped" curve vs. the real flat line the dot rolls on; red ✕ at the end.
import React from "react";
import { draw, ease, exitFade, hop, mix, tween } from "../../../core/anim";
import { Cross, glassPath } from "../primitives";
import { Cube, UpArrow, UserIcon, rnd } from "../shapes";
import { SceneDef, T, cue, line } from "../theme";

// ── crowd-products ──────────────────────────────────────────────────────
const GX = [220, 380, 540, 700, 860];
const GY = [T.cy - 170, T.cy, T.cy + 170];
const others = GY.flatMap((y, r) => GX.map((x, c) => ({ x, y, i: r * 5 + c }))).filter((c) => !(c.x === T.cx && c.y === T.cy));
const heroS = (f: number, c1: number) => mix(70, 44, tween(f, c1 + 10, c1 + 30));
export const crowdProducts: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.6);
    return (
      <g opacity={exitFade(f, dur)}>
        <Cube x={T.cx} y={T.cy} s={heroS(f, c1)} p={tween(f, 2, 34, 0, 1, (t) => t)} />
        {others.map(({ x, y, i }) => {
          const t0 = c1 - 8 + rnd(i + 3) * 36;
          return <Cube key={i} x={x} y={y} s={44} scale={tween(f, t0, t0 + 9, 0, 1, ease.back)} />;
        })}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.6);
    return { x: T.cx, y: T.cy - heroS(f, c1) - T.dotR - 2, r: T.dotR };
  },
};

// ── attract ─────────────────────────────────────────────────────────────
const HB = { x: T.cx, y: T.cy + 20, s: 60 };
const USERS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + 0.3;
  const r = 190 + (i % 2) * 70;
  return {
    from: { x: T.cx + 620 * Math.cos(a), y: T.cy + 620 * Math.sin(a) },
    to: { x: T.cx + r * Math.cos(a), y: HB.y + r * Math.sin(a) * 0.85 },
  };
});
export const attract: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.55);
    return (
      <g opacity={exitFade(f, dur)}>
        {Array.from({ length: 6 }, (_, k) => {
          const t = tween(f, 6 + k * 14, 46 + k * 14, 0, 1, ease.out);
          return t > 0 && t < 1 ? <circle key={k} cx={HB.x} cy={HB.y} r={70 + 260 * t} {...line(8)} stroke={T.highlight} opacity={1 - t} /> : null;
        })}
        <Cube x={HB.x} y={HB.y} s={HB.s} />
        {USERS.map((u, i) => {
          const t = tween(f, c1 - 10 + i * 2, c1 + 14 + i * 2, 0, 1, ease.out);
          return t > 0 ? <UserIcon key={i} x={mix(u.from.x, u.to.x, t)} y={mix(u.from.y, u.to.y, t)} s={1.3} /> : null;
        })}
      </g>
    );
  },
  dot: () => ({ x: HB.x, y: HB.y - HB.s - T.dotR - 2, r: T.dotR }),
};

// ── fill-up ─────────────────────────────────────────────────────────────
const GW = 300;
const GH = 380;
const GT = T.cy - 190;
const GB = GT + GH;
const level = (f: number, dur: number) => GB - GH * tween(f, 4, dur - 8, 0.08, 0.82);
export const fillUp: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.5);
    const L = level(f, dur);
    const path = glassPath(T.cx, GT, GW, GH);
    return (
      <g opacity={exitFade(f, dur)}>
        <clipPath id="fill-clip">
          <path d={path + " Z"} />
        </clipPath>
        <rect x={T.cx - GW / 2} y={L} width={GW} height={GB - L} fill={T.highlight} opacity={0.75} clipPath="url(#fill-clip)" />
        <line x1={T.cx - GW / 2} y1={L} x2={T.cx + GW / 2} y2={L} {...line(T.thin)} />
        <path d={path} {...line()} {...draw(tween(f, 0, 12))} />
        {Array.from({ length: 12 }, (_, i) => {
          const s = 2 + i * 5;
          const t = tween(f, s, s + 14, 0, 1, ease.in);
          if (t <= 0 || t >= 1) return null;
          const x = T.cx - 100 + rnd(i) * 200;
          return <UserIcon key={i} x={x} y={mix(GT - 220, L - 10, t)} s={1.1} o={1 - Math.max(0, (t - 0.85) / 0.15)} />;
        })}
        <UpArrow x={790} y={GB} len={300} p={tween(f, c1, c1 + 16)} />
      </g>
    );
  },
  dot: (f, dur) => ({ x: T.cx + 8 * Math.sin(f / 6), y: level(f, dur) - T.dotR, r: T.dotR }),
};

// ── fast-build ──────────────────────────────────────────────────────────
const FX = [190, 330, 470, 610, 750, 890];
const FY = [T.cy - 150, T.cy, T.cy + 150];
const FAST = FY.flatMap((y) => FX.map((x) => ({ x, y })))
  .map((c, i) => ({ ...c, k: rnd(i + 11) }))
  .sort((a, b) => a.k - b.k);
const popAt = (i: number, dur: number) => 4 + (dur - 16) * Math.pow(i / FAST.length, 0.75);
export const fastBuild: SceneDef = {
  Visual: ({ f, dur }) => (
    <g opacity={exitFade(f, dur)}>
      {FAST.map((c, i) => {
        const t0 = popAt(i, dur);
        return <Cube key={i} x={c.x} y={c.y} s={34} scale={tween(f, t0, t0 + 6, 0, 1, ease.back)} />;
      })}
    </g>
  ),
  dot: (f, dur) => {
    // hop onto every 3rd box as it appears
    const idx = FAST.map((_, i) => i).filter((i) => i % 3 === 0);
    let k = 0;
    while (k < idx.length - 1 && popAt(idx[k + 1], dur) <= f) k++;
    const a = FAST[idx[Math.max(0, k)]];
    const b = FAST[idx[Math.min(idx.length - 1, k + 1)]];
    const t0 = popAt(idx[k], dur);
    const t1 = k + 1 < idx.length ? popAt(idx[k + 1], dur) : t0 + 1;
    const t = Math.max(0, Math.min(1, (f - t0) / Math.max(1, t1 - t0)));
    const top = (c: { y: number }) => c.y - 34 - T.dotR - 2;
    return { ...hop(t, a.x, top(a), b.x, top(b), 50), r: T.dotR };
  },
};

// ── flatline ────────────────────────────────────────────────────────────
const X0 = 200;
const Y0 = T.cy + 200;
const X1 = 900;
const YT = T.cy - 220;
const FLAT_Y = Y0 - 50;
const tipX = (f: number, dur: number) => mix(X0 + 30, X1 - 60, tween(f, 4, dur - 14, 0, 1, (t) => t));
export const flatline: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const hoped = Array.from({ length: 41 }, (_, i) => {
      const t = i / 40;
      return `${i ? "L" : "M"} ${X0 + 30 + 610 * t} ${Y0 - 50 - 360 * Math.pow(t, 2)}`;
    }).join(" ");
    const tx = tipX(f, dur);
    return (
      <g opacity={exitFade(f, dur, 6)}>
        <path d={`M ${X0} ${YT} L ${X0} ${Y0} L ${X1} ${Y0}`} {...line()} />
        <path d={`M ${X0 - 12} ${YT + 16} L ${X0} ${YT} L ${X0 + 12} ${YT + 16}`} {...line()} />
        <path d={hoped} {...line(T.thin)} stroke={T.inkSoft} strokeDasharray="8 12" opacity={tween(f, 0, 14)} />
        <line x1={X0 + 30} y1={FLAT_Y} x2={tx} y2={FLAT_Y} {...line(5)} />
        <Cross x={X1 - 30} y={FLAT_Y - 70} size={24} p={tween(f, dur - 14, dur - 6)} />
        <g fontFamily={T.font} fontSize={40} fill={T.inkSoft}>
          <text x={X0 + 28} y={YT + 10}>{(p.yLabel as string) ?? "رشد"}</text>
          <text x={X1} y={Y0 + 56} textAnchor="end">{(p.xLabel as string) ?? "زمان"}</text>
        </g>
      </g>
    );
  },
  dot: (f, dur) => ({ x: tipX(f, dur), y: FLAT_Y - T.dotR - 2 - 6 * Math.abs(Math.sin(f / 3)), r: T.dotR }),
};
