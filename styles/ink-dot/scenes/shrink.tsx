// shrink — the dot stays still while day-ticks pass (RTL); with each day a ring
// pushes outward and the dot gets smaller. Good as a closing beat.
// props: days?: number (default 6)
import React from "react";
import { draw, ease, tween } from "../../../core/anim";
import { SceneDef, T, line } from "../theme";

const step = (k: number) => 14 + k * 14;
const days = (p: Record<string, unknown>) => (p.days as number) ?? 6;

export const shrink: SceneDef = {
  Visual: ({ f, p }) => {
    const n = days(p);
    return (
      <g>
        {Array.from({ length: n }, (_, k) => {
          const t = tween(f, step(k), step(k) + 40, 0, 1, ease.out);
          return t > 0 && t < 1 ? (
            <circle key={k} cx={T.cx} cy={T.cy} r={30 + 230 * t} {...line(T.thin)} opacity={0.55 * (1 - t)} />
          ) : null;
        })}
        {Array.from({ length: n }, (_, k) => {
          const x = 790 - (k * 500) / (n - 1);
          return <line key={k} x1={x} y1={T.cy + 160} x2={x} y2={T.cy + 186} {...line(T.thin)} {...draw(tween(f, step(k), step(k) + 6))} />;
        })}
      </g>
    );
  },
  dot: (f, _d, p) => {
    let shrunk = 0;
    for (let k = 0; k < days(p); k++) shrunk += tween(f, step(k), step(k) + 6, 0, 1, ease.out);
    return { x: T.cx, y: T.cy, r: T.dotR - (shrunk * (T.dotR - 5)) / days(p) };
  },
};
