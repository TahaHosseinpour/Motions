// Act 6 — the call to action: follow Starcooch.
import React from "react";
import { ease, hop, tween } from "../../../core/anim";
import { Burst, Button, Ring, Star, StepBadge, Txt } from "../kit";
import { SceneDef, T, cue } from "../theme";

// 22 ── follow Starcooch for more on vibe-coding & software engineering in the AI era.
export const wFollow: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c2 = cue(p, 2, dur, 0.72);
    const starP = tween(f, 4, 24, 0, 1, ease.back);
    const press = tween(f, c2, c2 + 8, 0, 1, ease.in);
    const release = tween(f, c2 + 8, c2 + 16, 0, 1, ease.out);
    const done = f >= c2 + 12;
    const burst = tween(f, c2 + 10, c2 + 40, 0, 1, ease.out);
    const glow = 0.5 + 0.5 * Math.sin(f * 0.1);
    return (
      <g>
        <Txt x={960} y={210} size={34} color={T.inkSoft} o={tween(f, 8, 22)}>وایب‌کدینگ و مهندسی نرم‌افزار در عصر هوش مصنوعی</Txt>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <g key={n} opacity={tween(f, 10 + i * 5, 20 + i * 5) * 0.7}>
            <StepBadge x={720 + i * 120} y={280} n={n} state="done" r={26} />
          </g>
        ))}
        <circle cx={960} cy={430} r={150} fill={T.highlight} opacity={0.05 + 0.05 * glow} />
        <Star x={960} y={430} r={96} p={starP} color={T.highlight} />
        <Txt x={960} y={570} size={64} o={tween(f, 14, 28)}>استارکوچ</Txt>
        <Button x={960} y={680} w={460} h={112} label={done ? "فالو شد" : "فالو کن"} press={press * (1 - release)} done={done} o={tween(f, 20, 34, 0, 1, ease.out)} />
        {burst > 0 && burst < 1 && <Burst x={960} y={680} p={burst} n={16} r={220} color={T.highlight} />}
        {done && <Ring x={960} y={680} r={120} p={tween(f, c2 + 12, c2 + 34)} color={T.good} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c2 = cue(p, 2, dur, 0.72);
    if (f < c2) return { x: 960, y: 320 + 6 * Math.sin(f * 0.18), r: T.dotR };
    if (f < c2 + 10) return { ...hop(tween(f, c2, c2 + 10, 0, 1, ease.in), 960, 320, 960, 640, 60), r: T.dotR };
    return { x: 960, y: 640 + 4 * Math.sin(f * 0.2), r: T.dotR };
  },
  cam: (f, dur, p) => ({ z: 1 + 0.04 * tween(f, cue(p, 2, dur, 0.72), dur, 0, 1, ease.out) }),
};