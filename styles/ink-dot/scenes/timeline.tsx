// timeline — a time axis drawn RTL (past on the right); the dot travels from past to now.
// props: from?: string, to?: string (tick labels)
import React from "react";
import { exitFade, tween } from "../../../core/anim";
import { SceneDef, T, line } from "../theme";
import { draw } from "../../../core/anim";

const Y = T.cy + 20;
const X_FROM = 840;
const X_TO = 240;

export const timeline: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const tick = tween(f, 8, 18);
    return (
      <g opacity={exitFade(f, dur)}>
        <line x1={920} y1={Y} x2={160} y2={Y} {...line()} {...draw(tween(f, 0, 18))} />
        {[X_FROM, X_TO].map((x) => (
          <line key={x} x1={x} y1={Y + 14} x2={x} y2={Y + 40} {...line(T.thin)} {...draw(tick)} />
        ))}
        <g fontFamily={T.font} fontSize={40} fill={T.inkSoft} textAnchor="middle" opacity={tick}>
          <text x={X_FROM} y={Y + 92}>{(p.from as string) ?? "پارسال"}</text>
          <text x={X_TO} y={Y + 92}>{(p.to as string) ?? "امسال"}</text>
        </g>
        {/* faint footprints behind the dot */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = X_FROM - (i + 1) * 60;
          const reached = tween(f, 14, 52) * (X_FROM - X_TO) >= (i + 1) * 60;
          return reached ? <circle key={i} cx={x} cy={Y - T.dotR} r={3} fill={T.inkFaint} /> : null;
        })}
      </g>
    );
  },
  dot: (f) => ({ x: X_FROM + (X_TO - X_FROM) * tween(f, 14, 52), y: Y - T.dotR, r: T.dotR }),
};
