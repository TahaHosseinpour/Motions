// chart — axes draw, a curve climbs; the dot rides the tip with a dashed guide to the y-axis.
// props: yLabel?: string, xLabel?: string, curve?: number (exponent, >1 = accelerating), good?: true (green curve)
import React from "react";
import { draw, exitFade, tween } from "../../../core/anim";
import { SceneDef, T, line } from "../theme";

const X0 = 200;
const Y0 = T.cy + 200;
const X1 = 900;
const YT = T.cy - 220;

const pt = (t: number, k: number) => ({ x: X0 + 30 + 640 * t, y: Y0 - 30 - 380 * Math.pow(t, k) });
const prog = (f: number) => tween(f, 10, 56);

export const chart: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const k = (p.curve as number) ?? 2.2;
    const t = prog(f);
    const d = Array.from({ length: 61 }, (_, i) => {
      const q = pt(i / 60, k);
      return `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    }).join(" ");
    const tip = pt(t, k);
    const axes = tween(f, 0, 14);
    return (
      <g opacity={exitFade(f, dur)}>
        <path d={`M ${X0} ${YT} L ${X0} ${Y0} L ${X1} ${Y0}`} {...line()} {...draw(axes)} />
        <path d={`M ${X0 - 12} ${YT + 16} L ${X0} ${YT} L ${X0 + 12} ${YT + 16}`} {...line()} opacity={axes} />
        <path d={d} {...line(p.good ? 6 : T.stroke)} stroke={p.good ? T.good : T.ink} {...draw(t)} />
        <line x1={X0} y1={tip.y} x2={tip.x} y2={tip.y} {...line(T.thin)} stroke={T.inkSoft} strokeDasharray="6 10" opacity={tween(f, 14, 22)} />
        <g fontFamily={T.font} fontSize={40} fill={T.inkSoft} opacity={axes}>
          <text x={X0 + 28} y={YT + 10}>{(p.yLabel as string) ?? "قیمت"}</text>
          <text x={X1} y={Y0 + 56} textAnchor="end">{(p.xLabel as string) ?? "زمان"}</text>
        </g>
      </g>
    );
  },
  dot: (f, _d, p) => ({ ...pt(prog(f), (p.curve as number) ?? 2.2), r: T.dotR }),
};
