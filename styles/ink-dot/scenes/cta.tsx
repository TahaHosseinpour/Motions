// follow — closing call to action. A "فالو" button draws itself while the dot bounces above it;
// on the LAST caption cue the dot drops onto the button, it presses, fills with ink and the + turns into ✓.
// props: label?: string (default "فالو")
import React from "react";
import { draw, ease, mix, tween } from "../../../core/anim";
import { SceneDef, T, line } from "../theme";

const B = { x: T.cx, y: T.cy + 90, w: 380, h: 130 };
const lastCue = (p: Record<string, unknown>, dur: number) => {
  const c = (p._cues as number[]) ?? [];
  return c.length > 1 ? c[c.length - 1] : Math.round(dur * 0.7);
};

export const follow: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const press = lastCue(p, dur) + 10;
    const filled = tween(f, press, press + 6);
    const squash = 1 - 0.07 * Math.sin(Math.PI * tween(f, press, press + 8));
    const spark = tween(f, press + 4, press + 16, 0, 1, ease.out);
    return (
      <g>
        <g transform={`translate(${B.x} ${B.y}) scale(${squash}) translate(${-B.x} ${-B.y})`}>
          <rect x={B.x - B.w / 2} y={B.y - B.h / 2} width={B.w} height={B.h} rx={B.h / 2} {...line(5)} fill={T.ink} fillOpacity={filled} {...draw(tween(f, 4, 30))} />
          <text x={B.x + 30} y={B.y + 22} textAnchor="middle" fontFamily={T.font} fontSize={64} fill={filled > 0.5 ? T.paper : T.ink} opacity={tween(f, 20, 30)}>
            {(p.label as string) ?? "فالو"}
          </text>
          {filled < 0.5 ? (
            <g {...line(6)} opacity={tween(f, 24, 32)}>
              <line x1={B.x - 118} y1={B.y - 22} x2={B.x - 118} y2={B.y + 22} {...line(6)} />
              <line x1={B.x - 140} y1={B.y} x2={B.x - 96} y2={B.y} {...line(6)} />
            </g>
          ) : (
            <path d={`M ${B.x - 142} ${B.y} L ${B.x - 124} ${B.y + 18} L ${B.x - 94} ${B.y - 18}`} {...line(7)} stroke={T.paper} {...draw(tween(f, press + 4, press + 12))} />
          )}
        </g>
        {spark > 0 &&
          [-160, -120, -60, -20].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const r0 = 230;
            return (
              <line
                key={i}
                x1={B.x + r0 * Math.cos(rad)}
                y1={B.y + r0 * 0.55 * Math.sin(rad)}
                x2={B.x + (r0 + 50 * spark) * Math.cos(rad)}
                y2={B.y + (r0 + 50 * spark) * 0.55 * Math.sin(rad)}
                {...line()}
                opacity={1 - Math.max(0, spark - 0.6) / 0.4}
              />
            );
          })}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const press = lastCue(p, dur) + 10;
    const top = B.y - B.h / 2 - T.dotR - 2;
    const restY = B.y - 230;
    if (f < press - 8) return { x: B.x, y: restY - 70 * Math.abs(Math.sin(f / 9)), r: T.dotR };
    const t = tween(f, press - 8, press, 0, 1, ease.in);
    return { x: B.x, y: mix(restY, top, t), r: T.dotR };
  },
};
