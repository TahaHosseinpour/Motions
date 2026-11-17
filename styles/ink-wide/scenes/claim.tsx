// Act 1 — the claim: code got cheap; what matters is knowing what you want and judging output.
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { draw, ease, hop, mix, tween } from "../../../core/anim";
import { Check, CodeWindow, Cross, Diamond, Doc, Gear, Magnifier, Ring, Target, Txt } from "../kit";
import { SceneDef, T, cue, line } from "../theme";

const bob = (f: number, x: number, y: number, a = 6) => ({ x, y: y + a * Math.sin(f * 0.22), r: T.dotR });

// 1 ── writing code is no longer the hard part; AI made it cheap.
export const wCodeCheap: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.62);
    const knock = tween(f, c1 - 4, c1 + 16, 0, 1, ease.in);
    const mult = tween(f, c1 + 2, c1 + 26, 0, 1, ease.back);
    const price = Math.round(mix(100, 1, tween(f, c1 + 6, c1 + 34, 0, 1, ease.out)));
    const wx = 760 + knock * 760;
    const wy = 235 - knock * 180 + knock * knock * 420;
    const tagP = tween(f, c1, c1 + 12, 0, 1, ease.back);
    return (
      <g>
        {/* multiplied cheap code windows fan across the stage */}
        {mult > 0 && [380, 1180, 1560].map((x, i) => (
          <CodeWindow key={x} x={x} y={520 + i * 8} w={400} h={280} lines={5} p={1} o={mult * 0.5} accent={T.digital} />
        ))}
        <CodeWindow x={760} y={500} w={620} h={400} lines={6} p={tween(f, 0, 30)} accent={T.digital} />
        {/* the heavy "hard" weight */}
        <g transform={`translate(${wx} ${wy}) rotate(${knock * 170})`} opacity={1 - tween(f, c1 + 8, c1 + 18)}>
          <path d="M -95 50 L -72 -38 Q -66 -56 -44 -56 H 44 Q 66 -56 72 -38 L 95 50 Z" {...line(5)} fill={T.paper} {...draw(tween(f, 4, 20))} />
          <path d="M -30 -56 A 30 26 0 0 1 30 -56" {...line(5)} {...draw(tween(f, 12, 22))} />
          <Txt x={0} y={16} size={46} o={tween(f, 14, 24)}>سخت</Txt>
          {knock > 0.05 && <Cross x={0} y={0} s={50} p={tween(f, c1 - 4, c1 + 6)} />}
        </g>
        {/* price tag 100 → 1 */}
        {tagP > 0 && (
          <g transform={`translate(960 730) scale(${tagP})`}>
            <rect x={-150} y={-46} width={300} height={92} rx={24} {...line(5)} fill={T.paper} />
            <circle cx={112} cy={0} r={9} {...line(T.thin)} />
            <Txt x={-14} y={16} size={46} sans color={price <= 5 ? T.good : T.ink}>{`${price.toLocaleString("fa-IR")} تومان`}</Txt>
          </g>
        )}
        {knock > 0.1 && knock < 0.7 && <Ring x={760} y={235} r={90} p={tween(f, c1 - 4, c1 + 14)} color={T.bad} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.62);
    if (f < c1 - 6) return bob(f, 1340, 300);
    if (f < c1 + 8) return { ...hop(tween(f, c1 - 6, c1 + 8, 0, 1, ease.inOut), 1340, 300, 760, 205, 90), r: T.dotR };
    return { ...hop(tween(f, c1 + 8, c1 + 26, 0, 1, ease.inOut), 760, 205, 960, 676, 70), r: T.dotR };
  },
  cam: (f, dur, p) => ({ z: 1 + 0.05 * tween(f, cue(p, 1, dur, 0.62), dur, 0, 1, ease.out), x: -8 * tween(f, 0, dur) }),
};

// 2 ── what matters: know exactly what you want (target) + judge the output (magnifier).
export const wWhatMatters: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.3);
    const c2 = cue(p, 2, dur, 0.62);
    const lock = tween(f, c1 + 4, c1 + 16, 0, 1, ease.out);
    const scan = tween(f, c2 + 6, dur - 12, 0, 1, ease.inOut);
    const mx = 440, my = mix(480, 620, scan);
    const glow = 0.5 + 0.5 * Math.sin(f * 0.12);
    return (
      <g>
        <Diamond x={960} y={300} s={74} p={tween(f, 2, 18)} />
        <circle cx={960} cy={300} r={110} fill={T.highlight} opacity={0.05 + 0.05 * glow} />
        <Txt x={960} y={418} size={44} o={tween(f, 10, 22)}>ارزش</Txt>
        {/* right: the target = knowing what you want */}
        <Target x={1480} y={540} r={90} p={tween(f, 12, 34)} />
        {lock > 0 && (
          <g opacity={lock}>
            <line x1={1480 - 125} y1={540} x2={1480 + 125} y2={540} {...line(T.thin)} stroke={T.bad} />
            <line x1={1480} y1={540 - 125} x2={1480} y2={540 + 125} {...line(T.thin)} stroke={T.bad} />
            <Ring x={1480} y={540} r={115} p={tween(f, c1 + 4, c1 + 22)} color={T.bad} />
          </g>
        )}
        <Txt x={1480} y={692} size={38} o={tween(f, 24, 36)}>چی می‌خوای</Txt>
        {/* left: judge the output */}
        <Doc x={440} y={540} w={380} h={320} lines={5} p={tween(f, 16, 40)} />
        <Check x={560} y={500} s={20} w={5} p={tween(f, c2 + 14, c2 + 24)} />
        <Cross x={560} y={590} s={18} w={5} p={tween(f, c2 + 26, c2 + 36)} />
        {f >= c2 && <Magnifier x={mx} y={my} r={56} o={tween(f, c2, c2 + 8)} />}
        <Txt x={440} y={742} size={38} o={tween(f, 30, 42)}>درسته یا نه</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.3);
    const c2 = cue(p, 2, dur, 0.62);
    if (f < c1) return bob(f, 960, 372, 5);
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 960, 372, 1480, 540, 120), r: T.dotR };
    const scan = tween(f, c2 + 6, dur - 12, 0, 1, ease.inOut);
    if (f < c2 + 6) return { ...hop(tween(f, c2, c2 + 6, 0, 1, ease.inOut), 1480, 540, 440, 480, 120), r: T.dotR };
    return { x: 440, y: mix(480, 620, scan), r: T.dotR };
  },
};

// 3 ── AI writes the code; you decide and review.
export const wAiYou: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.5);
    const split = tween(f, 0, 16, 0, 1, ease.out);
    const stamp = tween(f, c1 + 6, c1 + 16, 0, 1, ease.back);
    const write = (f * 0.05) % 1;
    return (
      <g>
        <line x1={960} y1={mix(480, 180, split)} x2={960} y2={mix(480, 790, split)} {...line(T.thin)} stroke={T.inkSoft} strokeDasharray="10 12" />
        {/* right: the agent */}
        <g opacity={split}>
          <Txt x={1400} y={236} size={52} sans color={T.digital}>AI</Txt>
          <Gear x={1230} y={430} r={58} rot={f * 3} color={T.digital} />
          <CodeWindow x={1530} y={480} w={440} h={300} lines={5} p={0.35 + write * 0.65} accent={T.digital} />
          <Txt x={1400} y={700} size={36} color={T.inkSoft}>کد رو می‌نویسه</Txt>
        </g>
        {/* left: you */}
        <g opacity={split}>
          <Txt x={520} y={236} size={52}>تو</Txt>
          <AssetImage id="reviewer" x={400} y={520} w={340} h={340} p={tween(f, 4, 20)} reveal="wipe" ink={T.ink} font={T.font} />
          <Doc x={720} y={520} w={230} h={290} lines={5} p={tween(f, 8, 24)} />
          {stamp > 0 && (
            <g transform={`translate(720 470) scale(${stamp})`}>
              <circle r={46} {...line(5)} stroke={T.good} fill="rgba(70,201,126,0.12)" />
              <Check x={0} y={0} s={24} w={6} />
            </g>
          )}
          {stamp > 0.1 && stamp < 0.8 && <Ring x={720} y={470} r={70} p={stamp} color={T.good} />}
          <Txt x={520} y={760} size={36} color={T.inkSoft}>تصمیم و بازبینی</Txt>
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.5);
    if (f < c1) return { x: 1230, y: 430, r: T.dotR };
    return { ...hop(tween(f, c1, c1 + 10, 0, 1, ease.inOut), 1230, 430, 720, 470, 140), r: T.dotR };
  },
};