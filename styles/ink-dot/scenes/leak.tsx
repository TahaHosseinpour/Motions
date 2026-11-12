// leak — a full glass drains through a hole at the bottom; the dot floats on the surface and sinks with it.
// props: from?: number, to?: number (fill 0..1 at start/end, default 0.92 → 0.12)
import React from "react";
import { draw, exitFade, tween } from "../../../core/anim";
import { glassPath } from "../primitives";
import { SceneDef, T, line } from "../theme";

const W = 300;
const H = 360;
const TOP = T.cy - 180;
const BOT = TOP + H;

const level = (f: number, dur: number, p: Record<string, unknown>) => {
  const a = (p.from as number) ?? 0.92;
  const b = (p.to as number) ?? 0.12;
  return BOT - H * tween(f, 8, dur - 10, a, b);
};

export const leak: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const L = level(f, dur, p);
    const path = glassPath(T.cx, TOP, W, H);
    const drops = [];
    for (let s = 10; s < dur - 12; s += 6) {
      const age = f - s;
      if (age < 0 || age > 14) continue;
      drops.push(
        <circle key={s} cx={T.cx} cy={BOT + 8 + 2 * age + 0.35 * age * age} r={5} fill={T.ink} opacity={1 - age / 14} />,
      );
    }
    return (
      <g opacity={exitFade(f, dur)}>
        <clipPath id="glass-clip">
          <path d={path + " Z"} />
        </clipPath>
        <rect x={T.cx - W / 2} y={L} width={W} height={BOT - L} fill={T.fill} clipPath="url(#glass-clip)" opacity={tween(f, 0, 10)} />
        <line x1={T.cx - W / 2} y1={L} x2={T.cx + W / 2} y2={L} {...line(T.thin)} stroke={T.inkSoft} opacity={tween(f, 0, 10)} />
        <path d={path} {...line()} {...draw(tween(f, 0, 16))} />
        {drops}
      </g>
    );
  },
  dot: (f, dur, p) => ({ x: T.cx + 8 * Math.sin(f / 7), y: level(f, dur, p) - T.dotR, r: T.dotR }),
};
