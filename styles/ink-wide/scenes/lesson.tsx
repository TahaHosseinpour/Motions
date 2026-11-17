// Act 3 — the lesson: half an hour of thought; unanswered questions get the agent's simplest answer.
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { ease, hop, mix, tween } from "../../../core/anim";
import { Card, ClockFace, Envelope, Gear, Hourglass, Shield, Txt } from "../kit";
import { SceneDef, T, cue, line } from "../theme";

// 10 ── half an hour of thinking before starting.
export const wHalfHour: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.46);
    const rewind = tween(f, 8, c1, 0, 1, ease.inOut);
    const angle = -180 * rewind;
    const pop = (k: number) => tween(f, c1 + k * 8, c1 + k * 8 + 12, 0, 1, ease.back);
    return (
      <g>
        <ClockFace x={620} y={470} r={172} angle={angle} arc={180 * rewind} p={tween(f, 2, 16)} arcColor={T.highlight} />
        <Txt x={620} y={708} size={44} o={tween(f, 12, 24)}>نیم ساعت فکر</Txt>
        <AssetImage id="omid-thinking" x={1340} y={510} w={380} h={380} p={tween(f, 6, 24)} reveal="wipe" ink={T.ink} font={T.font} />
        {[[1230, 268], [1340, 232], [1450, 268]].map(([x, y], i) => (
          <g key={i} opacity={pop(i)} transform={`translate(${x} ${y}) scale(${pop(i)})`}>
            <circle r={34} {...line(4)} stroke={T.highlight} fill={T.paper} />
            <Txt x={0} y={14} size={40} color={T.highlight}>؟</Txt>
          </g>
        ))}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.46);
    const rewind = tween(f, 8, c1, 0, 1, ease.inOut);
    const rad = (-180 * rewind * Math.PI) / 180;
    if (f < c1) return { x: 620 + Math.sin(rad) * 124, y: 470 - Math.cos(rad) * 124, r: T.dotR };
    return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 620 + Math.sin(rad) * 124, 470 - Math.cos(rad) * 124, 1340, 232, 120), r: T.dotR };
  },
};

const QuestionCard: React.FC<{ x: number; active: boolean; p: number; icon: React.ReactNode; l1: string; l2: string }> = ({ x, active, p, icon, l1, l2 }) => (
  <g opacity={p}>
    <rect x={x - 210} y={280} width={420} height={380} rx={24} {...line(active ? 5 : T.thin)} stroke={active ? T.highlight : T.inkSoft} fill={active ? "rgba(1,205,152,0.06)" : T.paper} />
    {active && <rect x={x - 210} y={280} width={420} height={380} rx={24} fill={T.highlight} opacity={0.04} />}
    <g transform={`translate(${x} 400)`}>{icon}</g>
    <Txt x={x} y={560} size={32} color={active ? T.ink : T.inkSoft}>{l1}</Txt>
    <Txt x={x} y={606} size={32} color={active ? T.ink : T.inkSoft}>{l2}</Txt>
  </g>
);

// 11 ── the three questions he should have asked.
export const wThreeQuestions: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.21);
    const c2 = cue(p, 2, dur, 0.63);
    const a0 = f < c1, a1 = f >= c1 && f < c2, a2 = f >= c2;
    return (
      <g>
        <QuestionCard x={420} active={a0} p={tween(f, 2, 16, 0, 1, ease.out)} l1="کد چند دقیقه" l2="اعتبار داره؟"
          icon={<Hourglass x={0} y={0} s={1.1} color={a0 ? T.highlight : T.inkSoft} />} />
        <QuestionCard x={960} active={a1} p={tween(f, 10, 24, 0, 1, ease.out)} l1="از هر شماره در ساعت" l2="چند درخواست؟"
          icon={<g><circle r={64} {...line(5)} stroke={a1 ? T.highlight : T.inkSoft} /><path d="M 0 0 L 34 -34" {...line(6)} stroke={a1 ? T.highlight : T.inkSoft} /><Txt x={0} y={40} size={26} sans color={a1 ? T.highlight : T.inkSoft}>۱۰ / ساعت</Txt></g>} />
        <QuestionCard x={1500} active={a2} p={tween(f, 18, 32, 0, 1, ease.out)} l1="اگه بات بخواد" l2="سوءاستفاده کنه؟"
          icon={<g><Shield x={0} y={0} w={120} h={140} color={a2 ? T.highlight : T.inkSoft} /><Txt x={0} y={12} size={40} color={a2 ? T.highlight : T.inkSoft}>!</Txt></g>} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.21);
    const c2 = cue(p, 2, dur, 0.63);
    if (f < c1) return { x: 420, y: 400 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 420, 400, 960, 400, 90), r: T.dotR };
    return { ...hop(tween(f, c2, c2 + 12, 0, 1, ease.inOut), 960, 400, 1500, 400, 90), r: T.dotR };
  },
};

// 12 ── the agent answers unanswered questions itself — usually the simplest: no limit.
export const wAgentAnswers: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.29);
    const c2 = cue(p, 2, dur, 0.62);
    const pick = tween(f, c1, c1 + 14, 0, 1, ease.out);
    const gate = tween(f, c2, c2 + 18, 0, 1, ease.inOut);
    const opts = [
      { y: 320, t: "۳ بار در دقیقه" },
      { y: 440, t: "۱۰ بار در ساعت" },
      { y: 560, t: "بدون محدودیت", inf: true },
    ];
    return (
      <g>
        <Gear x={360} y={430} r={74} rot={f * 3} color={T.digital} o={tween(f, 2, 16)} />
        <Txt x={360} y={640} size={36} color={T.inkSoft} o={tween(f, 8, 20)}>ایجنت</Txt>
        {/* option chips */}
        {opts.map((o, i) => {
          const chosen = o.inf && pick > 0.4;
          const dim = pick > 0.4 && !o.inf;
          return (
            <g key={i} opacity={tween(f, 10 + i * 8, 22 + i * 8) * (dim ? 0.35 : 1)}>
              <rect x={660} y={o.y - 42} width={440} height={84} rx={42} {...line(chosen ? 5 : T.thin)} stroke={chosen ? T.highlight : T.inkSoft} fill={chosen ? "rgba(1,205,152,0.12)" : T.paper} />
              <Txt x={o.inf ? 850 : 880} y={o.y + 12} size={34} color={chosen ? T.highlight : T.ink}>{o.t}</Txt>
              {o.inf && <Txt x={1050} y={o.y + 16} size={44} sans color={chosen ? T.highlight : T.inkSoft}>∞</Txt>}
              {chosen && <Txt x={880} y={o.y + 70} size={26} color={T.inkSoft}>ساده‌ترین جواب</Txt>}
            </g>
          );
        })}
        {/* gate lifts, SMS streams through */}
        <g opacity={tween(f, 16, 30)}>
          <line x1={1380} y1={300} x2={1380} y2={640} {...line(6)} />
          <line x1={1620} y1={300} x2={1620} y2={640} {...line(6)} />
          <g transform={`translate(0 ${-gate * 200})`}>
            <rect x={1380} y={440} width={240} height={26} rx={8} {...line(5)} stroke={gate > 0.5 ? T.good : T.bad} fill={T.paper} />
            {[0, 1, 2, 3].map((i) => <line key={i} x1={1410 + i * 60} y1={440} x2={1410 + i * 60} y2={466} {...line(3)} stroke={gate > 0.5 ? T.good : T.bad} />)}
          </g>
        </g>
        {gate > 0.5 && Array.from({ length: 5 }, (_, k) => {
          const t = ((f - c2) / 34 + k / 5) % 1;
          return <Envelope key={k} x={mix(1300, 1780, t)} y={452} s={0.7} o={Math.sin(t * Math.PI)} color={T.digital} />;
        })}
        <Txt x={960} y={752} size={34} color={T.inkSoft} o={pick}>«هر چند بار که کاربر خواست، محدودیتی نمی‌ذارم»</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.29);
    const c2 = cue(p, 2, dur, 0.62);
    if (f < c1) return { x: 360, y: 360 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 360, 360, 880, 560, 120), r: T.dotR };
    return { ...hop(tween(f, c2, c2 + 12, 0, 1, ease.inOut), 880, 560, 1500, 452, 120), r: T.dotR };
  },
};