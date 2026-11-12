// loaves-buy  — the dot hops right→left over 5 columns; each landing "buys" 2 loaves (10 total).
// loaves-loss — all 10 loaves sit there; `lose` of them tremble, go dashed and fall away.
// props (loss): lose?: number (default 3)
import React from "react";
import { ease, exitFade, hop, tween } from "../../../core/anim";
import { Loaf } from "../primitives";
import { SceneDef, T } from "../theme";

const XS = [850, 695, 540, 385, 230]; // RTL: column 0 is on the right
const YS = [T.cy - 58, T.cy + 58];
const SIT_Y = YS[0] - 46 - T.dotR - 3; // dot resting on top-row loaves
const HOME = { x: T.cx, y: T.cy - 200 };
const START = 8;
const HOP = 10;

export const loavesBuy: SceneDef = {
  Visual: ({ f, dur }) => (
    <g opacity={exitFade(f, dur)}>
      {XS.map((x, c) =>
        YS.map((y, r) => {
          const land = START + (c + 1) * HOP + r * 2;
          return <Loaf key={`${c}${r}`} x={x} y={y} s={tween(f, land, land + 9, 0, 1, ease.back)} />;
        }),
      )}
    </g>
  ),
  dot: (f) => {
    const pts = [HOME, ...XS.map((x) => ({ x, y: SIT_Y })), HOME];
    if (f < START) return { ...HOME, r: T.dotR };
    const k = Math.min(5, Math.floor((f - START) / HOP));
    const t = Math.min(1, (f - START - k * HOP) / HOP);
    const a = pts[k];
    const b = pts[k + 1];
    return { ...hop(t, a.x, a.y, b.x, b.y, k === 0 || k === 5 ? 40 : 55), r: T.dotR };
  },
};

export const loavesLoss: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const lose = (p.lose as number) ?? 3;
    // which loaves leave: from the left end, bottom row first
    const order: [number, number][] = [[4, 1], [4, 0], [3, 1], [3, 0], [2, 1], [2, 0]];
    const lost = order.slice(0, lose);
    const appear = tween(f, 0, 6);
    return (
      <g opacity={exitFade(f, dur)}>
        {XS.map((x, c) =>
          YS.map((y, r) => {
            const i = lost.findIndex(([lc, lr]) => lc === c && lr === r);
            if (i < 0) return <Loaf key={`${c}${r}`} x={x} y={y} o={appear} />;
            const s = 16 + i * 6;
            const shake = f > s && f < s + 10 ? Math.sin(f * 2.4) * 3 : 0;
            const t = tween(f, s + 10, s + 34, 0, 1, ease.in);
            return (
              <Loaf
                key={`${c}${r}`}
                x={x + shake}
                y={y + 620 * t}
                rot={(i % 2 ? -1 : 1) * 55 * t}
                o={appear * (1 - t)}
                dashed={f > s}
                cross={tween(f, s, s + 9)}
              />
            );
          }),
        )}
      </g>
    );
  },
  dot: (f) => ({
    x: HOME.x,
    y: HOME.y + 14 * Math.sin(Math.PI * tween(f, 26, 50)),
    r: T.dotR,
  }),
};
