// Act 4 — the kitchen metaphor: ten fast cooks, the confident wrong spice, and the wise head chef.
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { ease, hop, mix, tween } from "../../../core/anim";
import { Arrow, Check, ChefHat, Cloche, Cross, Doc, Jar, Plate, SpeedLines, Star, Txt } from "../kit";
import { SceneDef, T, cue, fa, line } from "../theme";

// 13 ── a head chef suddenly hires ten fast, tireless cooks.
export const wKitchenCrew: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.27);
    const c2 = cue(p, 2, dur, 0.67);
    const hats = Array.from({ length: 10 }, (_, i) => ({ x: 240 + (i % 5) * 180, y: i < 5 ? 360 : 520 }));
    const count = Math.min(10, Math.floor(tween(f, 8, 90, 0, 10)));
    const fly = tween(f, c2, c2 + 10, 0, 1);
    return (
      <g>
        <Txt x={600} y={210} size={40} o={tween(f, 4, 16)}>{`${fa(count)} آشپز جدید`}</Txt>
        {hats.map((h, i) => {
          const hp = tween(f, 8 + i * 8, 18 + i * 8, 0, 1, ease.back);
          return <ChefHat key={i} x={h.x} y={h.y} s={hp} o={hp} color={i < count ? T.ink : T.inkSoft} />;
        })}
        <AssetImage id="kitchen-chefs" x={1500} y={500} w={380} h={380} p={tween(f, 2, 22)} reveal="wipe" ink={T.ink} font={T.font} />
        <Txt x={1500} y={724} size={36} color={T.inkSoft} o={tween(f, 14, 26)}>سرآشپز</Txt>
        {/* counter + flying plates */}
        <line x1={180} y1={690} x2={1120} y2={690} {...line(5)} opacity={tween(f, c2 - 6, c2 + 4)} />
        {fly > 0 && [0, 1, 2].map((k) => {
          const t = ((f - c2) / 30 + k / 3) % 1;
          const x = mix(200, 1080, t);
          return (
            <g key={k} opacity={fly}>
              <Plate x={x} y={660} r={44} food={T.saffron} />
              <SpeedLines x={x - 60} y={660} len={60} o={0.7} dir={-1} />
            </g>
          );
        })}
        <Txt x={600} y={760} size={34} color={T.inkSoft} o={fly}>سریع کار می‌کنن و خسته نمی‌شن</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c2 = cue(p, 2, dur, 0.67);
    if (f < c2) {
      const idx = tween(f, 8, 90, 0, 9.99);
      const row = idx < 5 ? 0 : 1, col = idx % 5;
      return { x: 240 + col * 180, y: (row ? 520 : 360) - 46 - 8 * Math.abs(Math.sin(idx * Math.PI)), r: T.dotR };
    }
    return { ...hop(tween(f, c2, c2 + 12, 0, 1, ease.inOut), 960, 474, 640, 640, 80), r: T.dotR };
  },
};

// 14 ── sometimes turmeric instead of saffron — served with total confidence.
export const wWrongSpice: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.46);
    const tilt = tween(f, c1, c1 + 16, 0, 1, ease.inOut);
    const pour = tween(f, c1 + 8, c1 + 30, 0, 1);
    const cover = tween(f, c1 + 30, c1 + 44, 0, 1, ease.back);
    const badge = tween(f, c1 + 40, c1 + 52, 0, 1, ease.back);
    return (
      <g>
        <line x1={380} y1={300} x2={1220} y2={300} {...line(5)} opacity={tween(f, 2, 14)} />
        {/* saffron = right */}
        <g opacity={tween(f, 4, 18)}>
          <Jar x={560} y={430} color={T.saffron} label="زعفران" />
          <Check x={560} y={250} s={24} w={6} p={tween(f, 18, 28)} />
        </g>
        {/* turmeric = the confident mistake */}
        <g opacity={tween(f, 8, 22)}>
          <g transform={`translate(1040 430) rotate(${tilt * 38}) translate(-1040 -430)`}>
            <Jar x={1040} y={430} color={T.turmeric} label="زردچوبه" />
          </g>
          <Cross x={1040} y={250} s={24} w={6} p={tween(f, c1, c1 + 10)} />
        </g>
        {/* pouring powder onto the plate */}
        {pour > 0 && Array.from({ length: 10 }, (_, i) => {
          const t = ((f - c1 - 8) / 18 + i / 10) % 1;
          return <circle key={i} cx={mix(1100, 1040, t) + (i % 3 - 1) * 10} cy={mix(480, 640, t)} r={5} fill={T.turmeric} opacity={(1 - t) * pour} />;
        })}
        <Plate x={1040} y={670} r={86} food={pour > 0.3 ? T.turmeric : undefined} o={tween(f, 12, 24)} />
        {/* confident cloche + "excellent!" badge */}
        <Cloche x={1040} y={640} r={104} p={cover} o={cover} />
        {badge > 0 && (
          <g transform={`translate(1480 560) scale(${badge})`}>
            <rect x={-130} y={-56} width={260} height={112} rx={20} {...line(5)} stroke={T.turmeric} fill={T.paper} />
            <Txt x={0} y={6} size={44} color={T.turmeric}>عالی!</Txt>
            <Star x={-92} y={-30} r={20} color={T.turmeric} />
            <Star x={92} y={-30} r={16} color={T.turmeric} />
            <Txt x={0} y={44} size={24} color={T.inkSoft}>با اعتمادبه‌نفس کامل</Txt>
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.46);
    if (f < c1) return { x: 560, y: 360 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c1 + 16) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 560, 360, 1040, 360, 90), r: T.dotR };
    return { x: 1040, y: 360 + 6 * Math.sin(f * 0.2), r: T.dotR };
  },
};

// 15 ── the wise chef: precise recipe, split work, taste before sending.
export const wWiseChef: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.41);
    const c2 = cue(p, 2, dur, 0.6);
    const s1 = f < c1, s2 = f >= c1 && f < c2, s3 = f >= c2;
    const write = tween(f, 6, c1 - 6, 0, 1);
    const split = tween(f, c1, c1 + 18, 0, 1, ease.out);
    const taste = tween(f, c2 + 4, c2 + 22, 0, 1, ease.inOut);
    const stamp = tween(f, c2 + 24, c2 + 36, 0, 1, ease.back);
    const col = (a: boolean) => (a ? T.highlight : T.inkSoft);
    return (
      <g>
        {/* station 1: precise recipe */}
        <g opacity={tween(f, 2, 14)}>
          <Doc x={380} y={460} w={300} h={380} lines={6} p={write} />
          {[0, 1, 2].map((i) => <Check key={i} x={500} y={380 + i * 70} s={16} w={5} p={tween(f, 20 + i * 12, 30 + i * 12)} />)}
          <Txt x={380} y={724} size={32} color={col(s1)}>دستور پخت دقیق</Txt>
        </g>
        <Arrow x1={560} y1={460} x2={740} y2={460} p={tween(f, c1 - 8, c1)} color={col(s2)} />
        {/* station 2: split into tasks */}
        <g opacity={tween(f, 10, 22)}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${960 + (i - 1) * 130 * split} ${460 + (i - 1) * 10 * split})`}>
              <rect x={-60} y={-90} width={120} height={180} rx={14} {...line(s2 ? 5 : T.thin)} stroke={col(s2)} fill={T.paper} />
              <line x1={-36} y1={-50} x2={36} y2={-50} {...line(3)} stroke={T.inkSoft} />
              <line x1={-36} y1={-20} x2={36} y2={-20} {...line(3)} stroke={T.inkSoft} />
              <Txt x={0} y={40} size={26} sans color={col(s2)}>{fa(i + 1)}</Txt>
            </g>
          ))}
          <Txt x={960} y={724} size={32} color={col(s2)}>تقسیم کار</Txt>
        </g>
        <Arrow x1={1150} y1={460} x2={1330} y2={460} p={tween(f, c2 - 8, c2)} color={col(s3)} />
        {/* station 3: taste then send */}
        <g opacity={tween(f, 18, 30)}>
          <Plate x={1540} y={560} r={84} food={T.saffron} />
          <g transform={`translate(${mix(1640, 1540, taste)} ${mix(380, 520, taste)}) rotate(${mix(30, 0, taste)})`}>
            <line x1={0} y1={-70} x2={0} y2={20} {...line(6)} />
            <ellipse cx={0} cy={34} rx={20} ry={14} {...line(5)} fill={T.paper} />
          </g>
          {stamp > 0 && (
            <g transform={`translate(1540 470) scale(${stamp})`}>
              <circle r={44} {...line(5)} stroke={T.good} fill="rgba(1,205,152,0.14)" />
              <Check x={0} y={0} s={22} w={6} />
            </g>
          )}
          <Txt x={1540} y={724} size={32} color={col(s3)}>چشیدن قبل از ارسال</Txt>
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.41);
    const c2 = cue(p, 2, dur, 0.6);
    if (f < c1) return { x: 500, y: 380 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 500, 380, 960, 400, 110), r: T.dotR };
    const taste = tween(f, c2 + 4, c2 + 22, 0, 1, ease.inOut);
    if (f < c2 + 24) return { x: mix(1640, 1540, taste), y: mix(380, 520, taste), r: T.dotR };
    return { x: 1540, y: 470, r: T.dotR };
  },
};