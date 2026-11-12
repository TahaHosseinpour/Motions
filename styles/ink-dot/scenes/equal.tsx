// equal — two identical bills (then / now) with "=" between; the dot visits both and settles on "=".
// props: right?: string, left?: string (labels under the bills; right = past in RTL)
import React from "react";
import { draw, exitFade, hop, tween } from "../../../core/anim";
import { Bill, Check } from "../primitives";
import { SceneDef, T, line } from "../theme";

const Y = T.cy + 20;
const XR = 790;
const XL = 290;
const TOP = Y - 75 - T.dotR;

export const equal: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const eq = tween(f, 40, 50);
    return (
      <g opacity={exitFade(f, dur)}>
        <Bill x={XR} y={Y} w={300} h={150} p={tween(f, 2, 24)} />
        <Bill x={XL} y={Y} w={300} h={150} p={tween(f, 10, 32)} />
        <line x1={515} y1={Y - 14} x2={565} y2={Y - 14} {...line()} {...draw(eq)} />
        <line x1={515} y1={Y + 14} x2={565} y2={Y + 14} {...line()} {...draw(tween(f, 44, 54))} />
        <Check x={T.cx} y={Y + 110} size={26} p={tween(f, 52, 62)} />
        <g fontFamily={T.font} fontSize={38} fill={T.inkSoft} textAnchor="middle" opacity={tween(f, 16, 30)}>
          <text x={XR} y={Y + 130}>{(p.right as string) ?? "پارسال"}</text>
          <text x={XL} y={Y + 130}>{(p.left as string) ?? "امسال"}</text>
        </g>
      </g>
    );
  },
  dot: (f) => {
    if (f < 22) return { x: XR, y: TOP, r: T.dotR };
    if (f < 36) return { ...hop(tween(f, 22, 36, 0, 1, (t) => t), XR, TOP, XL, TOP, 90), r: T.dotR };
    return { ...hop(tween(f, 36, 48, 0, 1, (t) => t), XL, TOP, T.cx, Y - 60, 60), r: T.dotR };
  },
};
