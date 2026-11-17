// Act 5 — the modern engineering checklist, five steps.
import React from "react";
import { ease, hop, mix, tween } from "../../../core/anim";
import { Arrow, Banknote, Check, CodeWindow, Cube, Doc, FlowNode, IdCard, Lock, Magnifier, Shield, StepBadge, Txt, docPen } from "../kit";
import { SceneDef, T, cue, fa, line } from "../theme";

const Header: React.FC<{ n: number; title: string; p?: number }> = ({ n, title, p = 1 }) => (
  <g opacity={p}>
    <StepBadge x={1640} y={250} n={n} state="active" r={42} />
    <Txt x={960} y={264} size={46}>{title}</Txt>
    <line x1={700} y1={292} x2={1220} y2={292} {...line(T.thin)} stroke={T.highlight} opacity={0.5} />
  </g>
);

// 16 ── title card: software engineering today = a five-step path.
export const wModernTitle: SceneDef = {
  Visual: ({ f, dur }) => {
    const xs = [1440, 1200, 960, 720, 480];
    const path = tween(f, 10, 42, 0, 1, ease.out);
    return (
      <g>
        <Txt x={960} y={380} size={80} o={tween(f, 0, 16, 0, 1, ease.out)}>مهندسی نرم‌افزار امروز</Txt>
        <Txt x={960} y={450} size={36} color={T.inkSoft} o={tween(f, 8, 22)}>یعنی این پنج گام</Txt>
        <line x1={1440} y1={600} x2={mix(1440, 480, path)} y2={600} {...line(4)} stroke={T.inkSoft} />
        {xs.map((x, i) => (
          <g key={i} opacity={tween(f, 12 + i * 6, 22 + i * 6, 0, 1, ease.back)}>
            <StepBadge x={x} y={600} n={i + 1} state={i === 0 ? "active" : "idle"} />
          </g>
        ))}
      </g>
    );
  },
  dot: (f, dur) => ({ ...hop(tween(f, 24, 46, 0, 1, ease.inOut), 960, 470, 1440, 556, 90), r: T.dotR }),
};

// 17 ── step 1: write the full spec & requirements.
export const wStepSpec: SceneDef = {
  Visual: ({ f, dur }) => {
    const write = tween(f, 6, dur - 10, 0, 1);
    return (
      <g>
        <Header n={1} title="مشخصات و نیازمندی‌ها" p={tween(f, 0, 12)} />
        <Doc x={960} y={540} w={540} h={430} lines={7} p={write} />
        {Array.from({ length: 7 }, (_, i) => (
          <Check key={i} x={1180} y={400 + i * 52} s={15} w={5} p={tween(f, 12 + i * 9, 20 + i * 9)} />
        ))}
        <Txt x={960} y={792} size={32} color={T.inkSoft} o={tween(f, 10, 22)}>کامل بنویس</Txt>
      </g>
    );
  },
  dot: (f, dur) => {
    const write = tween(f, 6, dur - 10, 0, 1);
    return { ...docPen(960, 540, 540, 430, 7, write), r: T.dotR };
  },
};

// 18 ── step 2: ask the agent for its plan before coding; read it fully.
export const wStepPlan: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.53);
    const scan = tween(f, 10, c1 - 6, 0, 1, ease.inOut);
    const unlock = tween(f, c1, c1 + 16, 0, 1, ease.out);
    const nodes = [
      { x: 300, kind: "round" as const, label: "شروع" },
      { x: 540, kind: "box" as const, label: "برنامه" },
      { x: 800, kind: "diamond" as const, label: "بازبینی" },
    ];
    const activeIdx = Math.min(2, Math.floor(scan * 3));
    const mx = mix(300, 800, scan), my = 470;
    return (
      <g>
        <Header n={2} title="اول برنامه، بعد کد" p={tween(f, 0, 12)} />
        {nodes.map((nd, i) => (
          <g key={i}>
            <FlowNode x={nd.x} y={470} w={i === 2 ? 180 : 170} h={84} label={nd.label} kind={nd.kind}
              state={i < activeIdx ? "done" : i === activeIdx ? "active" : "dim"} p={tween(f, 6 + i * 8, 18 + i * 8)} />
            {i < 2 && <Arrow x1={nd.x + 95} y1={470} x2={nodes[i + 1].x - 95} y2={470} p={tween(f, 14 + i * 8, 24 + i * 8)} />}
          </g>
        ))}
        <Magnifier x={mx} y={my} r={56} o={tween(f, 8, 16)} />
        {/* the code window stays locked until the plan is reviewed */}
        <g opacity={0.4 + 0.6 * unlock}>
          <CodeWindow x={1420} y={510} w={440} h={320} lines={5} p={0.3 + unlock * 0.5} accent={T.digital} />
        </g>
        <g transform={`translate(1420 400)`} opacity={1 - unlock}>
          <Lock x={0} y={0} s={1.2} color={T.inkSoft} />
        </g>
        {unlock > 0.5 && <Check x={1420} y={400} s={26} w={6} p={tween(f, c1 + 8, c1 + 18)} />}
        <Txt x={960} y={760} size={32} color={T.inkSoft} o={tween(f, 12, 24)}>برنامه‌اش رو کامل بخون</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.53);
    const scan = tween(f, 10, c1 - 6, 0, 1, ease.inOut);
    if (f < c1) return { x: mix(300, 800, scan), y: 470, r: T.dotR };
    return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 800, 470, 1420, 400, 120), r: T.dotR };
  },
};

// 19 ── step 3: split the work into small pieces.
export const wStepSplit: SceneDef = {
  Visual: ({ f, dur }) => {
    const split = tween(f, 14, 36, 0, 1, ease.inOut);
    const xs = [1260, 1060, 860, 660];
    return (
      <g>
        <Header n={3} title="بخش‌های کوچیک" p={tween(f, 0, 12)} />
        <g opacity={1 - split}>
          <Cube x={960} y={500} s={120} />
        </g>
        {xs.map((x, i) => (
          <Cube key={i} x={mix(960, x, split)} y={mix(500, 540, split)} s={mix(120, 60, split)} p={1} o={split} color={T.highlight} />
        ))}
        <Txt x={960} y={760} size={32} color={T.inkSoft} o={split}>کار رو تقسیم کن</Txt>
      </g>
    );
  },
  dot: (f, dur) => {
    const split = tween(f, 14, 36, 0, 1, ease.inOut);
    if (f < 36) return { x: 960, y: 500 - 120 * (1 - split) - 30, r: T.dotR };
    const t = tween(f, 36, dur - 2, 0, 1);
    const idx = t * 3;
    const xs = [1260, 1060, 860, 660];
    const i = Math.min(2, Math.floor(idx)), fr = idx - i;
    return { x: mix(xs[i], xs[i + 1], fr), y: 540 - 60 - 20 * Math.sin(fr * Math.PI), r: T.dotR };
  },
};

// 20 ── step 4: check the tests — what they measure AND their results.
export const wStepTests: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.54);
    const scan = tween(f, 10, c1 - 6, 0, 1, ease.inOut);
    const rows = 4;
    const ys = [390, 480, 570, 660];
    const my = mix(ys[0], ys[rows - 1], scan);
    return (
      <g>
        <Header n={4} title="تست‌ها رو چک کن" p={tween(f, 0, 12)} />
        <rect x={480} y={330} width={960} height={390} rx={20} {...line(5)} fill={T.paper} opacity={tween(f, 4, 16)} />
        <line x1={960} y1={330} x2={960} y2={720} {...line(T.thin)} stroke={T.inkSoft} opacity={tween(f, 8, 18)} />
        <Txt x={1200} y={372} size={32} color={T.highlight}>چی می‌سنجه؟</Txt>
        <Txt x={720} y={372} size={32} color={f >= c1 ? T.good : T.inkSoft}>نتیجه</Txt>
        {ys.map((y, i) => (
          <g key={i}>
            <line x1={1040} y1={y + 18} x2={1380} y2={y + 18} {...line(4)} stroke={T.inkSoft} opacity={tween(f, 12 + i * 6, 22 + i * 6)} />
            <rect x={1020} y={y - 12} width={380} height={48} rx={10} fill={T.highlight} opacity={Math.abs(my - (y + 18)) < 30 && f < c1 ? 0.12 : 0} />
            <Check x={720} y={y + 18} s={20} w={6} p={tween(f, c1 + i * 10, c1 + i * 10 + 12)} />
          </g>
        ))}
        {f < c1 && <Magnifier x={1200} y={my} r={52} o={tween(f, 8, 16)} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.54);
    const scan = tween(f, 10, c1 - 6, 0, 1, ease.inOut);
    const ys = [390, 480, 570, 660];
    if (f < c1) return { x: 1200, y: mix(ys[0], ys[3], scan) + 18, r: T.dotR };
    const t = tween(f, c1, dur - 6, 0, 1);
    return { x: 720, y: mix(ys[0], ys[3], t) + 18, r: T.dotR };
  },
};

// 21 ── step 5: read sensitive parts (password, money, personal data) more carefully.
export const wStepSensitive: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.68);
    const scan = tween(f, 12, c1 - 8, 0, 1, ease.inOut);
    const items = [
      { x: 760, label: "رمز", icon: <Lock x={0} y={0} s={1.1} /> },
      { x: 960, label: "پول", icon: <Banknote x={0} y={0} /> },
      { x: 1160, label: "اطلاعات شخصی", icon: <IdCard x={0} y={0} /> },
    ];
    const mx = mix(760, 1160, scan);
    const activeIdx = Math.min(2, Math.floor(scan * 3));
    return (
      <g>
        <Header n={5} title="بخش‌های حساس" p={tween(f, 0, 12)} />
        <Shield x={960} y={520} w={620} h={430} p={tween(f, 4, 20)} color={T.highlight} />
        {items.map((it, i) => (
          <g key={i} opacity={tween(f, 12 + i * 8, 24 + i * 8)}>
            <g transform={`translate(${it.x} 480)`}>{it.icon}</g>
            <Txt x={it.x} y={600} size={28} color={i === activeIdx && f < c1 ? T.highlight : T.inkSoft}>{it.label}</Txt>
            {f >= c1 && <Check x={it.x} y={420} s={18} w={5} p={tween(f, c1 + i * 8, c1 + i * 8 + 12)} />}
            {Math.abs(mx - it.x) < 40 && f < c1 && <circle cx={it.x} cy={480} r={70} {...line(T.thin)} stroke={T.highlight} opacity={0.6} />}
          </g>
        ))}
        {f < c1 && <Magnifier x={mx} y={480} r={58} o={tween(f, 10, 18)} />}
        <Txt x={960} y={792} size={32} color={T.inkSoft} o={tween(f, 14, 26)}>دقیق‌تر بخون و آنالیز کن</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.68);
    const scan = tween(f, 12, c1 - 8, 0, 1, ease.inOut);
    return { x: mix(760, 1160, scan), y: 480, r: T.dotR };
  },
  cam: (f, dur) => ({ z: 1 + 0.03 * tween(f, 0, dur, 0, 1, ease.out) }),
};