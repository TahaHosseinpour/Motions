// bill — a banknote draws itself; the dot sits in its medallion like a portrait.
// props: value?: string (corner number, default "۱۰۰")
import React from "react";
import { ease, exitFade, tween } from "../../../core/anim";
import { Bill } from "../primitives";
import { SceneDef, T } from "../theme";

export const bill: SceneDef = {
  Visual: ({ f, dur, p }) => (
    <g opacity={exitFade(f, dur)}>
      <Bill x={T.cx} y={T.cy} p={tween(f, 4, 32)} value={(p.value as string) ?? "۱۰۰"} />
    </g>
  ),
  dot: (f) => ({ x: T.cx, y: T.cy, r: T.dotR * tween(f, 0, 14, 0, 1, ease.back) }),
};
