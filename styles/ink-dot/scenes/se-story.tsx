// 22 custom ink-dot scenes for "مهندسی نرم‌افزار در عصر هوش مصنوعی" (outputs/ai-software-engineering-ink).
//
// All scenes draw inside the 1080×1920 scene canvas centered at (T.cx=540, T.cy=920),
// staying within x ∈ [170, 910], y ∈ [620, 1220] so both landscape and portrait layouts
// remain clean and never collide with captions.
// Character doodle PNGs (reviewer, omid-freelancer, omid-shocked, evil-bot, omid-thinking, kitchen-chefs)
// have 100% transparent backgrounds (alpha=0) and warm white (#F4F1EA) strokes.
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { draw, ease, exitFade, hop, mix, tween } from "../../../core/anim";
import { Bill, Check, Cross, glassPath } from "../primitives";
import { Bubble, CodeWindow, Coin, Cube, Doc, Gear, Magnifier, Target, docPen } from "../shapes";
import { SceneDef, T, cue, line } from "../theme";

// ── 1. se-code-cheap ────────────────────────────────────────────────────
// Weight "سخت" sits on a CodeWindow; the dot knocks it off with a red ✕, code windows multiply, price tag drops 100 → 1.
export const seCodeCheap: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.55);
    const knock = tween(f, c1 - 6, c1 + 10, 0, 1, ease.out);
    const mult = tween(f, c1 + 4, c1 + 22, 0, 1, ease.back);
    const price = Math.round(mix(100, 1, tween(f, c1 + 8, c1 + 32, 0, 1, ease.out)));
    const wx = T.cx + knock * 280;
    const wy = T.cy - 170 - knock * 220;
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Extra multiplied code windows behind */}
        {mult > 0 && (
          <g opacity={mult * 0.55}>
            <CodeWindow x={T.cx - 120 * mult} y={T.cy - 40 * mult} w={420} h={290} lines={5} p={1} />
            <CodeWindow x={T.cx + 120 * mult} y={T.cy - 40 * mult} w={420} h={290} lines={5} p={1} />
          </g>
        )}
        <CodeWindow x={T.cx} y={T.cy + 20} w={480} h={320} lines={6} p={tween(f, 0, 26)} />
        {/* Heavy weight "سخت" */}
        <g transform={`translate(${wx} ${wy}) rotate(${knock * 42})`} opacity={1 - tween(f, c1 + 2, c1 + 12)}>
          <path d="M -85 45 L -65 -35 Q -60 -50 -40 -50 H 40 Q 60 -50 65 -35 L 85 45 Z" {...line()} fill={T.paper} {...draw(tween(f, 4, 18))} />
          <path d="M -28 -50 A 28 24 0 0 1 28 -50" {...line()} fill="none" {...draw(tween(f, 10, 20))} />
          <text x={0} y={14} textAnchor="middle" fontFamily={T.font} fontSize={44} fill={T.ink} opacity={tween(f, 12, 20)}>
            سخت
          </text>
          {knock > 0 && <Cross x={0} y={0} size={46} p={tween(f, c1 - 6, c1 + 4)} />}
        </g>
        {/* Price tag dropping from ۱۰۰ to ۱ */}
        {f >= c1 && (
          <g transform={`translate(${T.cx} ${T.cy + 235}) scale(${tween(f, c1, c1 + 12, 0, 1, ease.back)})`}>
            <rect x={-130} y={-44} width={260} height={88} rx={22} {...line()} fill={T.paper} />
            <circle cx={96} cy={0} r={9} {...line(T.thin)} />
            <text x={-12} y={16} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={44} fill={price <= 5 ? T.good : T.ink}>
              {`${price.toLocaleString("fa-IR")} تومان`}
            </text>
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.55);
    if (f < c1 - 6) {
      return { x: T.cx + 150, y: T.cy - 210 + 6 * Math.sin(f * 0.25), r: T.dotR };
    }
    if (f < c1 + 10) {
      const t = tween(f, c1 - 6, c1 + 10);
      return { ...hop(t, T.cx + 150, T.cy - 210, T.cx, T.cy - 170, 60), r: T.dotR };
    }
    const t2 = tween(f, c1 + 10, c1 + 26);
    return { ...hop(t2, T.cx, T.cy - 170, T.cx, T.cy + 235 - 44 - T.dotR - 4, 50), r: T.dotR };
  },
};

// ── 2. se-what-matters ──────────────────────────────────────────────────
// Value diamond on top; right: target ("بدونی چی می‌خوای"); left: output card scanned by magnifier with ✓ and ✕.
export const seWhatMatters: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.32);
    const c2 = cue(p, 2, dur, 0.64);
    const scanT = tween(f, c2 + 4, dur - 14, 0, 1, ease.inOut);
    const lx = mix(370, 290, scanT);
    const ly = mix(T.cy + 10, T.cy + 110, scanT);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Top diamond of value */}
        <g transform={`translate(${T.cx} ${T.cy - 215}) scale(${tween(f, 0, 14, 0, 1, ease.back)})`}>
          <path d="M -55 -28 L 55 -28 L 85 10 L 0 92 L -85 10 Z" {...line()} fill={T.paper} />
          <path d="M -85 10 H 85 M -55 -28 L -28 10 L 0 92 L 28 10 L 55 -28" {...line(T.thin)} stroke={T.inkSoft} fill="none" />
        </g>
        {/* Right: Target (know what you want) */}
        <g opacity={tween(f, c1 - 2, c1 + 8)}>
          <Target x={720} y={T.cy + 55} r={96} p={tween(f, c1, c1 + 20)} />
          <text x={720} y={T.cy + 205} textAnchor="middle" fontFamily={T.font} fontSize={40} fill={T.inkSoft} direction="rtl">
            چی می‌خوای؟
          </text>
        </g>
        {/* Left: Output card + Magnifier + ✓/✕ */}
        <g opacity={tween(f, c2 - 2, c2 + 8)}>
          <Doc x={350} y={T.cy + 55} w={230} h={260} lines={5} p={tween(f, c2, c2 + 16)} />
          <Check x={425} y={T.cy + 15} size={22} p={tween(f, c2 + 14, c2 + 22)} />
          <Cross x={425} y={T.cy + 95} size={20} p={tween(f, c2 + 22, c2 + 30)} />
          <Magnifier x={lx} y={ly} r={54} o={tween(f, c2 + 4, c2 + 12)} />
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.32);
    const c2 = cue(p, 2, dur, 0.64);
    if (f < c1) return { x: T.cx, y: T.cy - 215 - 48, r: T.dotR };
    if (f < c2) {
      const t = tween(f, c1, c1 + 16);
      return { ...hop(t, T.cx, T.cy - 263, 720, T.cy + 55, 70), r: T.dotR };
    }
    const hopLeft = tween(f, c2, c2 + 12);
    const scanT = tween(f, c2 + 4, dur - 14, 0, 1, ease.inOut);
    const tx = mix(370, 290, scanT);
    const ty = mix(T.cy + 10, T.cy + 110, scanT);
    return { x: mix(720, tx, hopLeft), y: mix(T.cy + 55, ty, hopLeft), r: T.dotR };
  },
};

// ── 3. se-ai-you ────────────────────────────────────────────────────────
// Split board: right = AI gear + code window; left = reviewer character asset + spec doc + green ✓ stamp.
export const seAiYou: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.48);
    const stamp = tween(f, c1 + 14, c1 + 24, 0, 1, ease.back);
    return (
      <g opacity={exitFade(f, dur)}>
        <line x1={T.cx} y1={T.cy - 250} x2={T.cx} y2={T.cy + 250} {...line(T.thin)} stroke={T.inkSoft} strokeDasharray="12 14" opacity={tween(f, 0, 14)} />
        {/* Right: AI writes code */}
        <Gear x={735} y={T.cy - 125} r={46} rot={f * 4.5} o={tween(f, 2, 10)} />
        <CodeWindow x={735} y={T.cy + 75} w={280} h={220} lines={5} p={tween(f, 4, 28)} />
        <text x={735} y={T.cy + 235} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={34} fill={T.inkSoft} opacity={tween(f, 8, 16)}>
          AI
        </text>
        {/* Left: Reviewer character asset + Checkmark */}
        <AssetImage
          id="reviewer"
          x={345}
          y={T.cy + 15}
          w={330}
          h={330}
          reveal="wipe"
          p={tween(f, c1 - 2, c1 + 18)}
          ink={T.ink}
          font={T.fontSans}
        />
        {stamp > 0 && (
          <g transform={`translate(240 ${T.cy - 145}) scale(${stamp})`}>
            <circle cx={0} cy={0} r={42} {...line()} fill={T.paper} stroke={T.good} />
            <Check x={0} y={0} size={22} p={tween(f, c1 + 16, c1 + 24)} />
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.48);
    if (f < c1) return { x: 735, y: T.cy - 125, r: T.dotR };
    const t = tween(f, c1, c1 + 14);
    return { ...hop(t, 735, T.cy - 125, 345, T.cy - 170, 90), r: T.dotR };
  },
};

// ── 4. se-omid-brief ────────────────────────────────────────────────────
// Omid freelancer asset on right; saffron jar in middle-left; phone + SMS code bubble on top-left.
const SaffronJar: React.FC<{ x: number; y: number; s?: number; label?: string; good?: boolean; bad?: boolean; o?: number }> = ({
  x,
  y,
  s = 1,
  label,
  good,
  bad,
  o = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-42} y={-68} width={84} height={22} rx={6} {...line()} fill={T.paper} />
    <path d="M -52 -46 H 52 L 60 58 Q 60 76 42 76 H -42 Q -60 76 -60 58 Z" {...line()} fill={T.paper} />
    <rect x={-44} y={-14} width={88} height={46} rx={8} {...line(T.thin)} stroke={T.inkSoft} fill="none" />
    {label && (
      <text x={0} y={17} textAnchor="middle" fontFamily={T.font} fontSize={30} fill={good ? T.good : bad ? T.bad : T.ink}>
        {label}
      </text>
    )}
  </g>
);

export const seOmidBrief: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.25);
    const c2 = cue(p, 2, dur, 0.52);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Omid freelancer character */}
        <AssetImage
          id="omid-freelancer"
          x={720}
          y={T.cy + 65}
          w={340}
          h={340}
          reveal="wipe"
          p={tween(f, 0, 22)}
          ink={T.ink}
          font={T.fontSans}
        />
        {/* Left-bottom: Saffron jar */}
        <SaffronJar x={355} y={T.cy + 125} s={1.1 * tween(f, c1, c1 + 14, 0, 1, ease.back)} label="زعفران" o={tween(f, c1, c1 + 8)} />
        {/* Top-left: Mobile store + SMS code bubble */}
        {f >= c2 && (
          <g transform={`translate(355 ${T.cy - 120}) scale(${tween(f, c2, c2 + 14, 0, 1, ease.back)})`}>
            <rect x={-165} y={-85} width={330} height={170} rx={26} {...line()} fill={T.paper} />
            <text x={0} y={-22} textAnchor="middle" fontFamily={T.font} fontSize={36} fill={T.inkSoft}>
              کد ورود پیامکی
            </text>
            <text x={0} y={42} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={44} fill={T.highlight} direction="ltr">
              4 8 2 1
            </text>
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.25);
    const c2 = cue(p, 2, dur, 0.52);
    if (f < c1) return { x: 720, y: T.cy - 125, r: T.dotR };
    if (f < c2) {
      const t = tween(f, c1, c1 + 14);
      return { ...hop(t, 720, T.cy - 125, 355, T.cy + 25, 70), r: T.dotR };
    }
    const t = tween(f, c2, c2 + 14);
    return { ...hop(t, 355, T.cy + 25, 355, T.cy - 225, 70), r: T.dotR };
  },
};

// ── 5. se-weekend-build ─────────────────────────────────────────────────
// Calendar flips پنجشنبه → جمعه while gear spins; on cue 1 (شنبه صبح) sun rises and online store window gets green ✓.
export const seWeekendBuild: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.62);
    const dayIdx = f >= c1 ? 2 : f >= Math.round(c1 * 0.5) ? 1 : 0;
    const days = ["پنجشنبه", "جمعه", "شنبه صبح"];
    const live = tween(f, c1, c1 + 16, 0, 1, ease.back);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Calendar card on top-right */}
        <g transform={`translate(730 ${T.cy - 130})`}>
          <rect x={-125} y={-80} width={250} height={160} rx={18} {...line()} fill={T.paper} {...draw(tween(f, 0, 16))} />
          <line x1={-125} y1={-30} x2={125} y2={-30} {...line(T.thin)} />
          <line x1={-60} y1={-100} x2={-60} y2={-60} {...line(6)} />
          <line x1={60} y1={-100} x2={60} y2={-60} {...line(6)} />
          <text x={0} y={32} textAnchor="middle" fontFamily={T.font} fontSize={44} fill={dayIdx === 2 ? T.good : T.ink}>
            {days[dayIdx]}
          </text>
        </g>
        {/* Agent gear working before Saturday */}
        <Gear x={730} y={T.cy + 115} r={54} rot={f < c1 ? f * 6 : c1 * 6} o={tween(f, 4, 12)} />
        {/* Store browser window on left */}
        <CodeWindow x={380} y={T.cy + 40} w={390} h={290} lines={5} p={tween(f, 6, c1)} />
        {/* Sun + green checkmark when site goes live on Saturday morning */}
        {live > 0 && (
          <g transform={`translate(380 ${T.cy - 165}) scale(${live})`}>
            <circle cx={0} cy={0} r={44} {...line()} fill={T.paper} stroke={T.highlight} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return <line key={i} x1={Math.cos(a) * 56} y1={Math.sin(a) * 56} x2={Math.cos(a) * 74} y2={Math.sin(a) * 74} {...line(4)} stroke={T.highlight} />;
            })}
            <Check x={0} y={0} size={22} p={tween(f, c1 + 6, c1 + 16)} />
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.62);
    if (f < c1) return { x: 730, y: T.cy + 115, r: T.dotR };
    const t = tween(f, c1, c1 + 14);
    return { ...hop(t, 730, T.cy + 115, 380, T.cy - 235, 80), r: T.dotR };
  },
};

// ── 6. se-phone-rings ───────────────────────────────────────────────────
// Shocked Omid on phone (right) + SMS credit tank draining from ۲,۰۰۰,۰۰۰ to ۰ in 3 days (left); dot sinks with level.
export const sePhoneRings: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.36);
    const c2 = cue(p, 2, dur, 0.72);
    const level = 1 - tween(f, c1 + 8, dur - 10, 0, 1, ease.inOut);
    const amount = Math.round(2000000 * level);
    const gx = 355;
    const gy = T.cy - 110;
    const gw = 240;
    const gh = 300;
    const fillH = (gh - 24) * level;
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Shocked Omid holding ringing phone */}
        <AssetImage
          id="omid-shocked"
          x={730}
          y={T.cy + 25}
          w={340}
          h={340}
          reveal="pop"
          p={tween(f, 0, 16, 0, 1, ease.back)}
          ink={T.ink}
          font={T.fontSans}
        />
        {/* Left: SMS Panel balance tank */}
        <g opacity={tween(f, c1 - 4, c1 + 8)}>
          <rect
            x={gx - gw / 2 + 10}
            y={gy + gh - 12 - fillH}
            width={gw - 20}
            height={Math.max(0, fillH)}
            rx={14}
            fill={level < 0.25 ? T.bad : T.fill}
            opacity={level < 0.25 ? 0.55 : 1}
          />
          <path d={glassPath(gx, gy, gw, gh, 26)} {...line()} />
          <text x={gx} y={gy - 30} textAnchor="middle" fontFamily={T.font} fontSize={38} fill={T.inkSoft} direction="rtl">
            شارژ پنل پیامک
          </text>
          <text x={gx} y={gy + gh + 58} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={36} fill={level < 0.15 ? T.bad : T.ink} direction="rtl">
            {`${amount.toLocaleString("fa-IR")} تومان`}
          </text>
          {f >= c2 && <Cross x={gx} y={gy + gh / 2} size={52} p={tween(f, c2, c2 + 12)} />}
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.36);
    if (f < c1) return { x: 730, y: T.cy - 165 + 6 * Math.sin(f * 0.8), r: T.dotR };
    const level = 1 - tween(f, c1 + 8, dur - 10, 0, 1, ease.inOut);
    const surfaceY = T.cy - 110 + 300 - 12 - 276 * level - T.dotR;
    const t = tween(f, c1, c1 + 12);
    return { x: mix(730, 355, t), y: mix(T.cy - 165, surfaceY, t), r: T.dotR };
  },
};

// ── 7. se-bot-attack ────────────────────────────────────────────────────
// Evil bot asset on right; phone login screen with rotating numbers in center-left; flying SMS envelopes & red coins.
const PHONE_NUMS = ["0912 345 6789", "0935 118 2207", "0919 660 4531", "0902 771 9048", "0990 235 1164"];
export const seBotAttack: SceneDef = {
  Visual: ({ f, dur }) => {
    const step = Math.floor(f / 16);
    const phase = (f % 16) / 16;
    const num = PHONE_NUMS[step % PHONE_NUMS.length];
    const px = 370;
    const py = T.cy + 15;
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Evil bot asset */}
        <AssetImage
          id="evil-bot"
          x={735}
          y={T.cy + 30}
          w={330}
          h={330}
          reveal="wipe"
          p={tween(f, 0, 18)}
          ink={T.ink}
          font={T.fontSans}
        />
        {/* Left: Login phone screen */}
        <rect x={px - 145} y={py - 210} width={290} height={420} rx={32} {...line()} fill={T.paper} {...draw(tween(f, 2, 18))} />
        <rect x={px - 115} y={py - 90} width={230} height={64} rx={12} {...line(T.thin)} fill="none" />
        <text x={px} y={py - 46} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={28} fill={T.ink} direction="ltr">
          {num}
        </text>
        {/* Send SMS button */}
        <rect
          x={px - 115}
          y={py + 20 + (phase < 0.25 ? 6 : 0)}
          width={230}
          height={68}
          rx={16}
          {...line()}
          fill={phase < 0.25 ? T.bad : T.paper}
          stroke={phase < 0.25 ? T.bad : T.ink}
        />
        <text x={px} y={py + 64 + (phase < 0.25 ? 6 : 0)} textAnchor="middle" fontFamily={T.font} fontSize={36} fill={T.ink}>
          ارسال کد
        </text>
        {/* Flying SMS envelope + coin per request */}
        {f > 18 && (
          <g opacity={1 - phase} transform={`translate(${mix(px, 210, phase)} ${mix(py - 120, py - 270, phase)})`}>
            <rect x={-42} y={-28} width={84} height={56} rx={6} {...line(T.thin)} fill={T.paper} />
            <path d="M -42 -28 L 0 4 L 42 -28" {...line(T.thin)} fill="none" />
            <Coin x={68} y={0} r={22} />
          </g>
        )}
      </g>
    );
  },
  dot: (f) => {
    const phase = (f % 16) / 16;
    const bounce = Math.abs(Math.sin(phase * Math.PI)) * 55;
    return { x: 370, y: T.cy + 20 - T.dotR - bounce, r: T.dotR };
  },
};

// ── 8. se-tests-green ───────────────────────────────────────────────────
// Right: test rows all get green ✓; Left: spec doc with dashed missing box "در دقیقه چند بار؟ ؟" where dot is the ؟ dot.
export const seTestsGreen: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.42);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Green test list */}
        <g opacity={mix(1, 0.55, tween(f, c1, c1 + 12))}>
          <rect x={590} y={T.cy - 180} width={290} height={360} rx={20} {...line()} fill={T.paper} {...draw(tween(f, 0, 16))} />
          {[0, 1, 2, 3].map((i) => {
            const yy = T.cy - 110 + i * 74;
            return (
              <g key={i}>
                <Check x={830} y={yy} size={20} p={tween(f, 8 + i * 5, 16 + i * 5)} />
                <line x1={790} y1={yy} x2={630} y2={yy} {...line(5)} stroke={T.inkSoft} {...draw(tween(f, 6 + i * 5, 14 + i * 5))} />
              </g>
            );
          })}
        </g>
        {/* Left: Spec document with missing dashed requirement */}
        {f >= c1 - 4 && (
          <g opacity={tween(f, c1 - 4, c1 + 8)}>
            <Doc x={340} y={T.cy} w={310} h={390} lines={4} p={tween(f, c1, c1 + 18)} />
            <rect
              x={215}
              y={T.cy + 30}
              width={250}
              height={125}
              rx={14}
              {...line(3)}
              stroke={T.highlight}
              strokeDasharray="12 10"
              fill={T.paper}
            />
            <text x={340} y={T.cy + 85} textAnchor="middle" fontFamily={T.font} fontSize={34} fill={T.highlight} direction="rtl">
              در دقیقه چند بار؟
            </text>
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.42);
    if (f < c1) return { x: 735, y: T.cy - 205, r: T.dotR };
    const t = tween(f, c1, c1 + 16);
    return { ...hop(t, 735, T.cy - 205, 340, T.cy + 132, 80), r: T.dotR };
  },
};

// ── 9. se-missing-piece ─────────────────────────────────────────────────
// Wall of feature blocks; center block ("Rate Limit") is a red dashed hole with SMS envelopes pouring through.
export const seMissingPiece: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.48);
    const cols = [720, 540, 360];
    const rows = [T.cy - 120, T.cy, T.cy + 120];
    return (
      <g opacity={exitFade(f, dur)}>
        {rows.map((ry, r) =>
          cols.map((cx, c) => {
            const idx = r * 3 + c;
            const isHole = r === 1 && c === 1;
            const popP = tween(f, idx * 3, idx * 3 + 12, 0, 1, ease.back);
            if (isHole) {
              return (
                <g key={idx} opacity={tween(f, 14, 24)}>
                  <rect
                    x={cx - 82}
                    y={ry - 50}
                    width={164}
                    height={100}
                    rx={12}
                    {...line(3.5)}
                    stroke={T.bad}
                    strokeDasharray="12 10"
                    fill="none"
                  />
                  <text x={cx} y={ry + 10} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={26} fill={T.bad} direction="ltr">
                    {f >= c1 ? "Rate Limit" : "؟"}
                  </text>
                </g>
              );
            }
            return (
              <g key={idx} transform={`translate(${cx} ${ry}) scale(${popP})`}>
                <rect x={-82} y={-50} width={164} height={100} rx={12} {...line()} fill={T.paper} />
                <line x1={50} y1={0} x2={-50} y2={0} {...line(4)} stroke={T.inkSoft} />
              </g>
            );
          }),
        )}
      </g>
    );
  },
  dot: (f) => ({ x: T.cx, y: T.cy - 195 + 8 * Math.sin(f * 0.2), r: T.dotR }),
};

// ── 10. se-half-hour ────────────────────────────────────────────────────
// Rewinding clock with 30-min yellow sector on right; thinking Omid asset + question bubble on left.
export const seHalfHour: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.45);
    const cr = 135;
    const cx = 720;
    const cy = T.cy + 10;
    const handAngle = f < c1 ? -f * 18 : 180;
    const rad = ((handAngle - 90) * Math.PI) / 180;
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Clock with 30-minute sector */}
        {f >= c1 && (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - cr} A ${cr} ${cr} 0 0 1 ${cx} ${cy + cr} Z`}
            fill={T.highlight}
            opacity={0.28 * tween(f, c1, c1 + 12)}
          />
        )}
        <circle cx={cx} cy={cy} r={cr} {...line()} fill="none" {...draw(tween(f, 0, 16))} />
        <line x1={cx} y1={cy} x2={cx + Math.cos(rad) * (cr - 28)} y2={cy + Math.sin(rad) * (cr - 28)} {...line(6)} />
        <text x={cx} y={cy + cr + 54} textAnchor="middle" fontFamily={T.font} fontSize={40} fill={T.highlight} opacity={tween(f, c1, c1 + 12)} direction="rtl">
          ۳۰ دقیقه فکر
        </text>
        {/* Left: Omid thinking character asset + question bubble */}
        <AssetImage
          id="omid-thinking"
          x={355}
          y={T.cy + 40}
          w={330}
          h={330}
          reveal="wipe"
          p={tween(f, c1 - 4, c1 + 16)}
          ink={T.ink}
          font={T.fontSans}
        />
        <Bubble x={355} y={T.cy - 175} w={180} h={95} s={tween(f, c1 + 8, c1 + 18, 0, 1, ease.back)} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.45);
    if (f < c1) return { x: 720, y: T.cy + 10, r: T.dotR };
    const t = tween(f, c1, c1 + 14);
    return { ...hop(t, 720, T.cy + 10, 355, T.cy - 240, 70), r: T.dotR };
  },
};

// ── 11. se-three-questions ──────────────────────────────────────────────
// Three question rows (۱: اعتبار کد، ۲: سقف درخواست، ۳: مقابله با بات); dot hops down from card 1 → 2 → 3.
export const seThreeQuestions: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.3);
    const c2 = cue(p, 2, dur, 0.65);
    const starts = [0, c1, c2];
    const labels = ["۱. کد چند دقیقه اعتبار داره؟", "۲. در ساعت چند درخواست مجازه؟", "۳. اگه بات حمله کرد چکار کنیم؟"];
    return (
      <g opacity={exitFade(f, dur)}>
        {labels.map((txt, i) => {
          const yy = T.cy - 165 + i * 165;
          const on = tween(f, starts[i], starts[i] + 14, 0, 1, ease.back);
          const active = (i === 0 && f < c1) || (i === 1 && f >= c1 && f < c2) || (i === 2 && f >= c2);
          return (
            <g key={i} transform={`translate(${T.cx} ${yy}) scale(${on})`}>
              <rect
                x={-330}
                y={-58}
                width={660}
                height={116}
                rx={20}
                {...line(active ? 5 : 3.5)}
                stroke={active ? T.highlight : T.ink}
                fill={T.paper}
              />
              <text x={0} y={14} textAnchor="middle" fontFamily={T.font} fontSize={42} fill={active ? T.highlight : T.ink} direction="rtl">
                {txt}
              </text>
            </g>
          );
        })}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.3);
    const c2 = cue(p, 2, dur, 0.65);
    const y0 = T.cy - 165;
    const y1 = T.cy;
    const y2 = T.cy + 165;
    const rx = T.cx + 365;
    if (f < c1) return { x: rx, y: y0, r: T.dotR };
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12), rx, y0, rx, y1, 45), r: T.dotR };
    return { ...hop(tween(f, c2, c2 + 12), rx, y1, rx, y2, 45), r: T.dotR };
  },
};

// ── 12. se-agent-answers ────────────────────────────────────────────────
// Agent gear picks the easiest option ("بدون محدودیت ∞"), barrier gate swings open.
export const seAgentAnswers: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.35);
    const c2 = cue(p, 2, dur, 0.68);
    const open = tween(f, c2, c2 + 16, 0, 1, ease.back);
    return (
      <g opacity={exitFade(f, dur)}>
        <Gear x={735} y={T.cy - 110} r={52} rot={f * 4} o={tween(f, 0, 12)} />
        {/* Two option cards: limited vs unlimited ∞ */}
        <g opacity={mix(1, 0.3, tween(f, c1, c1 + 12))}>
          <rect x={220} y={T.cy - 175} width={380} height={95} rx={16} {...line()} fill={T.paper} />
          <text x={410} y={T.cy - 115} textAnchor="middle" fontFamily={T.font} fontSize={36} fill={T.inkSoft} direction="rtl">
            محدودیت ۳ بار در دقیقه
          </text>
        </g>
        <g transform={`translate(410 ${T.cy}) scale(${1 + 0.06 * tween(f, c1, c1 + 12, 0, 1, ease.back)})`}>
          <rect x={-190} y={-52} width={380} height={104} rx={16} {...line(5)} stroke={f >= c1 ? T.bad : T.ink} fill={T.paper} />
          <text x={0} y={14} textAnchor="middle" fontFamily={T.font} fontSize={40} fill={f >= c1 ? T.bad : T.ink} direction="rtl">
            بدون محدودیت ∞
          </text>
        </g>
        {/* Open barrier gate at bottom */}
        {f >= c2 - 4 && (
          <g opacity={tween(f, c2 - 4, c2 + 6)}>
            <rect x={630} y={T.cy + 120} width={36} height={110} rx={6} {...line()} fill={T.paper} />
            <g transform={`translate(648 ${T.cy + 140}) rotate(${open * 68})`}>
              <rect x={-380} y={-12} width={380} height={24} rx={8} {...line()} fill={T.paper} />
            </g>
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.35);
    if (f < c1) return { x: 735, y: T.cy - 110, r: T.dotR };
    const t = tween(f, c1, c1 + 14);
    return { ...hop(t, 735, T.cy - 110, 410, T.cy - 75, 70), r: T.dotR };
  },
};

// ── 13. se-kitchen-crew ─────────────────────────────────────────────────
// Head chef character asset on right; 10 mini chef hats pop in a 5×2 grid on left as the dot counts them.
const MiniChefHat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -28 18 V -2 Q -42 -12 -32 -28 Q -22 -42 0 -38 Q 22 -42 32 -28 Q 42 -12 28 -2 V 18 Z" {...line(3)} fill={T.paper} />
    <line x1={-28} y1={8} x2={28} y2={8} {...line(T.thin)} stroke={T.inkSoft} />
  </g>
);

export const seKitchenCrew: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.28);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: Head chef character asset */}
        <AssetImage
          id="kitchen-chefs"
          x={745}
          y={T.cy + 20}
          w={330}
          h={330}
          reveal="wipe"
          p={tween(f, 0, 20)}
          ink={T.ink}
          font={T.fontSans}
        />
        {/* Left: 10 chef hats popping rapidly */}
        {Array.from({ length: 10 }, (_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const hx = 520 - col * 82;
          const hy = T.cy - 65 + row * 130;
          const sc = tween(f, c1 + i * 3, c1 + i * 3 + 10, 0, 1, ease.back);
          return <MiniChefHat key={i} x={hx} y={hy} s={sc} />;
        })}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.28);
    if (f < c1) return { x: 745, y: T.cy - 165, r: T.dotR };
    const k = Math.min(9, Math.max(0, Math.floor((f - c1) / 3)));
    const col = k % 5;
    const row = Math.floor(k / 5);
    return { x: 520 - col * 82, y: T.cy - 65 + row * 130 - 52, r: T.dotR };
  },
};

// ── 14. se-wrong-spice ──────────────────────────────────────────────────
// Saffron jar (right, ✓) vs Turmeric jar (left, ✕); dot hops onto turmeric, pours onto dish, cloche covers with "عالی!".
export const seWrongSpice: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.48);
    const cloche = tween(f, c1, c1 + 14, 0, 1, ease.back);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Two spice jars on top shelf */}
        <line x1={230} y1={T.cy - 30} x2={850} y2={T.cy - 30} {...line()} {...draw(tween(f, 0, 14))} />
        <SaffronJar x={680} y={T.cy - 110} label="زعفران" good o={tween(f, 4, 12)} />
        <g transform={`translate(400 ${T.cy - 110}) rotate(${tween(f, 16, 30, 0, 28, ease.inOut)})`}>
          <SaffronJar x={0} y={0} label="زردچوبه" bad o={tween(f, 6, 14)} />
        </g>
        {/* Dish at bottom */}
        <g transform={`translate(${T.cx} ${T.cy + 165})`}>
          <ellipse cx={0} cy={20} rx={165} ry={28} {...line()} fill={T.paper} />
          {cloche > 0 && (
            <g transform={`translate(0 ${-160 * (1 - cloche)})`}>
              <path d="M -145 16 A 145 125 0 0 1 145 16 Z" {...line()} fill={T.paper} />
              <circle cx={0} cy={-118} r={14} {...line()} fill={T.paper} />
              <text x={0} y={-28} textAnchor="middle" fontFamily={T.font} fontSize={44} fill={T.highlight} direction="rtl">
                عالی شد!
              </text>
            </g>
          )}
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.48);
    if (f < 14) return { x: 680, y: T.cy - 200, r: T.dotR };
    if (f < c1) {
      const t = tween(f, 14, 26);
      return { ...hop(t, 680, T.cy - 200, 400, T.cy - 200, 60), r: T.dotR };
    }
    const t2 = tween(f, c1, c1 + 14);
    return { ...hop(t2, 400, T.cy - 200, T.cx, T.cy + 15, 70), r: T.dotR };
  },
};

// ── 15. se-wise-chef ────────────────────────────────────────────────────
// Wise chef: 1) recipe doc written on right, 2) splits into 3 task cards in center, 3) tasted dish with green ✓ on left.
export const seWiseChef: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.4);
    const c2 = cue(p, 2, dur, 0.65);
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Right: exact recipe doc */}
        <Doc x={745} y={T.cy} w={230} h={300} lines={6} p={tween(f, 2, c1)} />
        {/* Middle: 3 split task cards */}
        {[0, 1, 2].map((i) => {
          const sc = tween(f, c1 + i * 4, c1 + 12 + i * 4, 0, 1, ease.back);
          const yy = T.cy - 110 + i * 110;
          return (
            <g key={i} transform={`translate(${T.cx} ${yy}) scale(${sc})`}>
              <rect x={-75} y={-38} width={150} height={76} rx={12} {...line()} fill={T.paper} />
              <line x1={45} y1={0} x2={-45} y2={0} {...line(4)} stroke={T.inkSoft} />
            </g>
          );
        })}
        {/* Left: Tasted plate + green checkmark */}
        {f >= c2 && (
          <g transform={`translate(320 ${T.cy + 20}) scale(${tween(f, c2, c2 + 14, 0, 1, ease.back)})`}>
            <circle cx={0} cy={0} r={92} {...line()} fill={T.paper} />
            <circle cx={0} cy={0} r={62} {...line(T.thin)} stroke={T.inkSoft} fill="none" />
            <Check x={0} y={0} size={34} p={tween(f, c2 + 8, c2 + 18)} />
          </g>
        )}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.4);
    const c2 = cue(p, 2, dur, 0.65);
    if (f < c1) {
      const pen = docPen(745, T.cy, 230, 300, 6, tween(f, 2, c1));
      return { x: pen.x, y: pen.y, r: T.dotR - 2 };
    }
    if (f < c2) {
      const t = tween(f, c1, c1 + 12);
      return { ...hop(t, 745, T.cy - 160, T.cx, T.cy - 165, 60), r: T.dotR };
    }
    const t = tween(f, c2, c2 + 12);
    return { ...hop(t, T.cx, T.cy - 165, 320, T.cy - 92, 65), r: T.dotR };
  },
};

// ── 16. se-modern-title ─────────────────────────────────────────────────
// 5-step roadmap (۱ تا ۵ RTL) draws across the canvas; dot lands on step ۱.
const STEP_X = [820, 680, 540, 400, 260];
export const seModernTitle: SceneDef = {
  Visual: ({ f, dur }) => (
    <g opacity={exitFade(f, dur)}>
      <line x1={820} y1={T.cy} x2={260} y2={T.cy} {...line(T.thin)} stroke={T.inkSoft} strokeDasharray="10 12" opacity={tween(f, 0, 24)} />
      {STEP_X.map((x, i) => {
        const sc = tween(f, 4 + i * 4, 14 + i * 4, 0, 1, ease.back);
        const isFirst = i === 0;
        return (
          <g key={i} transform={`translate(${x} ${T.cy}) scale(${sc})`}>
            <circle cx={0} cy={0} r={46} {...line(isFirst ? 5 : 3.5)} stroke={isFirst ? T.highlight : T.ink} fill={T.paper} />
            <text x={0} y={16} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={40} fill={isFirst ? T.highlight : T.ink}>
              {(i + 1).toLocaleString("fa-IR")}
            </text>
          </g>
        );
      })}
    </g>
  ),
  dot: (f) => ({ x: STEP_X[0], y: T.cy - 46 - T.dotR - 6 - 12 * Math.abs(Math.sin(f * 0.15)), r: T.dotR }),
};

// ── 17. se-step-spec ────────────────────────────────────────────────────
// Step 1: Spec document writes itself line by line with green ✓ ticks beside each requirement.
export const seStepSpec: SceneDef = {
  Visual: ({ f, dur }) => {
    const pDoc = tween(f, 4, dur - 12);
    return (
      <g opacity={exitFade(f, dur)}>
        <Doc x={T.cx} y={T.cy} w={380} h={460} lines={6} p={pDoc} />
        {[0, 1, 2, 3].map((i) => (
          <Check key={i} x={T.cx + 235} y={T.cy - 120 + i * 82} size={22} p={tween(f, 14 + i * 12, 22 + i * 12)} />
        ))}
      </g>
    );
  },
  dot: (f, dur) => {
    const pen = docPen(T.cx, T.cy, 380, 460, 6, tween(f, 4, dur - 12));
    return { x: pen.x, y: pen.y, r: T.dotR - 2 };
  },
};

// ── 18. se-step-plan ────────────────────────────────────────────────────
// Step 2: Agent flowchart plan drawn on right and inspected by magnifier before the code window on left.
const PLAN_NODES = [
  { x: 690, y: T.cy - 140 },
  { x: 540, y: T.cy },
  { x: 690, y: T.cy + 140 },
];
export const seStepPlan: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.48);
    const idx = f < c1 ? 0 : f < c1 + 22 ? 1 : 2;
    const node = PLAN_NODES[idx];
    return (
      <g opacity={exitFade(f, dur)}>
        {/* Flowchart arrows */}
        <line x1={690} y1={T.cy - 90} x2={540} y2={T.cy - 50} {...line(T.thin)} stroke={T.inkSoft} {...draw(tween(f, 6, 18))} />
        <line x1={540} y1={T.cy + 50} x2={690} y2={T.cy + 90} {...line(T.thin)} stroke={T.inkSoft} {...draw(tween(f, 14, 26))} />
        {PLAN_NODES.map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y}) scale(${tween(f, i * 5, 12 + i * 5, 0, 1, ease.back)})`}>
            <rect x={-95} y={-44} width={190} height={88} rx={16} {...line()} fill={T.paper} />
            <line x1={55} y1={0} x2={-55} y2={0} {...line(4)} stroke={T.inkSoft} />
            <Check x={-125} y={0} size={20} p={tween(f, c1 + i * 12, c1 + 10 + i * 12)} />
          </g>
        ))}
        <Magnifier x={node.x} y={node.y} r={62} o={tween(f, c1 - 4, c1 + 6)} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.48);
    const idx = f < c1 ? 0 : f < c1 + 22 ? 1 : 2;
    const node = PLAN_NODES[idx];
    return { x: node.x, y: node.y, r: T.dotR };
  },
};

// ── 19. se-step-split ───────────────────────────────────────────────────
// Step 3: One big cube splits into 4 neat small cubes arranged RTL; dot hops across them.
const SPLIT_POS = [
  { x: 760, y: T.cy + 40 },
  { x: 615, y: T.cy + 40 },
  { x: 465, y: T.cy + 40 },
  { x: 320, y: T.cy + 40 },
];
export const seStepSplit: SceneDef = {
  Visual: ({ f, dur }) => {
    const sp = tween(f, 10, 28, 0, 1, ease.back);
    return (
      <g opacity={exitFade(f, dur)}>
        {SPLIT_POS.map((pos, i) => (
          <Cube
            key={i}
            x={mix(T.cx, pos.x, sp)}
            y={mix(T.cy, pos.y, sp)}
            s={mix(78, 48, sp)}
            p={tween(f, 0, 14)}
          />
        ))}
      </g>
    );
  },
  dot: (f, dur) => {
    const t = tween(f, 18, dur - 8);
    const k = Math.min(3, Math.floor(t * 4));
    const p = SPLIT_POS[k];
    return { x: p.x, y: p.y - 68, r: T.dotR };
  },
};

// ── 20. se-step-tests ───────────────────────────────────────────────────
// Step 4: Test table — first magnifier checks "چه چیزی سنجیده می‌شود" (right), then "نتیجه" (left) lights up with green ✓.
export const seStepTests: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.52);
    const rowsY = [T.cy - 95, T.cy + 5, T.cy + 105];
    const scanY = mix(rowsY[0], rowsY[2], tween(f, 6, c1, 0, 1, ease.inOut));
    return (
      <g opacity={exitFade(f, dur)}>
        <rect x={230} y={T.cy - 185} width={620} height={360} rx={22} {...line()} fill={T.paper} {...draw(tween(f, 0, 16))} />
        <line x1={430} y1={T.cy - 185} x2={430} y2={T.cy + 175} {...line(T.thin)} stroke={T.inkSoft} />
        {rowsY.map((yy, i) => (
          <g key={i}>
            <line x1={790} y1={yy} x2={480} y2={yy} {...line(5)} stroke={T.ink} {...draw(tween(f, 6 + i * 5, 16 + i * 5))} />
            <Check x={330} y={yy} size={24} p={tween(f, c1 + i * 6, c1 + 10 + i * 6)} />
          </g>
        ))}
        <Magnifier x={635} y={scanY} r={58} o={1 - tween(f, c1, c1 + 8)} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.52);
    const rowsY = [T.cy - 95, T.cy + 5, T.cy + 105];
    if (f < c1) {
      return { x: 635, y: mix(rowsY[0], rowsY[2], tween(f, 6, c1, 0, 1, ease.inOut)), r: T.dotR };
    }
    const t = tween(f, c1, c1 + 14);
    return { ...hop(t, 635, rowsY[2], 330, rowsY[0] - 55, 65), r: T.dotR };
  },
};

// ── 21. se-step-sensitive ───────────────────────────────────────────────
// Step 5: Security shield holding 3 icons: Lock (رمز), Bill (پول), ID Card (اطلاعات شخصی); magnifier inspects each.
const SENS_X = [740, 540, 340];
export const seStepSensitive: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.55);
    const scanX = mix(SENS_X[0], SENS_X[2], tween(f, c1 - 6, dur - 10, 0, 1, ease.inOut));
    return (
      <g opacity={exitFade(f, dur)}>
        {/* 1. Lock (رمز) */}
        <g transform={`translate(${SENS_X[0]} ${T.cy}) scale(${tween(f, 2, 14, 0, 1, ease.back)})`}>
          <rect x={-58} y={-20} width={116} height={96} rx={16} {...line()} fill={T.paper} />
          <path d="M -34 -20 V -48 A 34 34 0 0 1 34 -48 V -20" {...line()} fill="none" />
          <circle cx={0} cy={26} r={10} fill={T.highlight} />
        </g>
        {/* 2. Money (پول) */}
        <g transform={`translate(${SENS_X[1]} ${T.cy + 10}) scale(${0.42 * tween(f, 8, 20, 0, 1, ease.back)})`}>
          <Bill x={0} y={0} value="۱۰۰" />
        </g>
        {/* 3. Personal Data ID card (اطلاعات شخصی) */}
        <g transform={`translate(${SENS_X[2]} ${T.cy + 10}) scale(${tween(f, 14, 26, 0, 1, ease.back)})`}>
          <rect x={-75} y={-52} width={150} height={104} rx={14} {...line()} fill={T.paper} />
          <circle cx={36} cy={-6} r={16} {...line(T.thin)} />
          <line x1={4} y1={-12} x2={-52} y2={-12} {...line(4)} stroke={T.inkSoft} />
          <line x1={4} y1={14} x2={-38} y2={14} {...line(4)} stroke={T.inkSoft} />
        </g>
        {f >= c1 - 8 && <Magnifier x={scanX} y={T.cy + 10} r={74} o={tween(f, c1 - 8, c1 + 2)} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.55);
    const x = f < c1 - 6 ? SENS_X[0] : mix(SENS_X[0], SENS_X[2], tween(f, c1 - 6, dur - 10, 0, 1, ease.inOut));
    return { x, y: T.cy + 10, r: T.dotR };
  },
};

// ── 22. se-follow ───────────────────────────────────────────────────────
// Starcoach star + "فالو استارکوچ" CTA button; dot bounces and presses the button on the last caption cue.
export const seFollow: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const cues = (p._cues as number[]) ?? [];
    const press = (cues.length > 1 ? cues[cues.length - 1] : Math.round(dur * 0.7)) + 10;
    const filled = tween(f, press, press + 8);
    const squash = 1 - 0.07 * Math.sin(Math.PI * tween(f, press, press + 10));
    const by = T.cy + 95;
    return (
      <g>
        {/* Star above the button */}
        <g transform={`translate(${T.cx} ${T.cy - 135}) scale(${tween(f, 0, 18, 0, 1, ease.back)})`}>
          <path
            d="M 0 -72 L 21 -22 L 75 -16 L 34 19 L 46 72 L 0 44 L -46 72 L -34 19 L -75 -16 L -21 -22 Z"
            {...line()}
            stroke={T.highlight}
            fill={T.paper}
          />
        </g>
        {/* Follow button */}
        <g transform={`translate(${T.cx} ${by}) scale(${squash}) translate(${-T.cx} ${-by})`}>
          <rect
            x={T.cx - 230}
            y={by - 64}
            width={460}
            height={128}
            rx={64}
            {...line(5)}
            fill={T.ink}
            fillOpacity={filled}
            {...draw(tween(f, 4, 28))}
          />
          <text x={T.cx + 24} y={by + 20} textAnchor="middle" fontFamily={T.font} fontSize={54} fill={filled > 0.5 ? T.paper : T.ink} opacity={tween(f, 16, 28)}>
            فالو استارکوچ
          </text>
          {filled > 0.5 && (
            <path
              d={`M ${T.cx - 175} ${by} L ${T.cx - 157} ${by + 18} L ${T.cx - 127} ${by - 18}`}
              {...line(7)}
              stroke={T.paper}
              {...draw(tween(f, press + 2, press + 12))}
            />
          )}
        </g>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const cues = (p._cues as number[]) ?? [];
    const press = (cues.length > 1 ? cues[cues.length - 1] : Math.round(dur * 0.7)) + 10;
    const by = T.cy + 95;
    const top = by - 64 - T.dotR - 4;
    if (f < press - 8) return { x: T.cx, y: T.cy - 135, r: T.dotR };
    return { x: T.cx, y: mix(T.cy - 135, top, tween(f, press - 8, press, 0, 1, ease.in)), r: T.dotR };
  },
};

export const SE_SCENES: Record<string, SceneDef> = {
  "se-code-cheap": seCodeCheap,
  "se-what-matters": seWhatMatters,
  "se-ai-you": seAiYou,
  "se-omid-brief": seOmidBrief,
  "se-weekend-build": seWeekendBuild,
  "se-phone-rings": sePhoneRings,
  "se-bot-attack": seBotAttack,
  "se-tests-green": seTestsGreen,
  "se-missing-piece": seMissingPiece,
  "se-half-hour": seHalfHour,
  "se-three-questions": seThreeQuestions,
  "se-agent-answers": seAgentAnswers,
  "se-kitchen-crew": seKitchenCrew,
  "se-wrong-spice": seWrongSpice,
  "se-wise-chef": seWiseChef,
  "se-modern-title": seModernTitle,
  "se-step-spec": seStepSpec,
  "se-step-plan": seStepPlan,
  "se-step-split": seStepSplit,
  "se-step-tests": seStepTests,
  "se-step-sensitive": seStepSensitive,
  "se-follow": seFollow,
};
