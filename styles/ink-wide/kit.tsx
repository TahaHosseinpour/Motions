// Reusable marker line-art for ink-wide. Pure SVG <g>s, authored in 1920×1080 space.
import React from "react";
import { draw, mix } from "../../core/anim";
import { T, fa, line } from "./theme";

/** Text helper. Persian words → handwriting; digits/Latin → sans (handwriting lacks them). */
export const Txt: React.FC<{
  x: number; y: number; size?: number; anchor?: "start" | "middle" | "end";
  color?: string; o?: number; sans?: boolean; weight?: number; children: React.ReactNode;
}> = ({ x, y, size = 40, anchor = "middle", color = T.ink, o = 1, sans, weight, children }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={sans ? T.fontSans : T.font}
    fontSize={size} fontWeight={weight ?? (sans ? 700 : 400)} fill={color} opacity={o}
    direction="rtl">{children}</text>
);

export const Check: React.FC<{ x: number; y: number; s?: number; p?: number; w?: number }> = ({ x, y, s = 30, p = 1, w = 7 }) => (
  <path d={`M ${x - s} ${y} L ${x - s * 0.3} ${y + s * 0.7} L ${x + s} ${y - s * 0.75}`}
    {...line(w)} stroke={T.good} {...draw(p)} />
);

export const Cross: React.FC<{ x: number; y: number; s?: number; p?: number; w?: number }> = ({ x, y, s = 30, p = 1, w = 7 }) => (
  <g transform={`translate(${x} ${y})`} {...line(w)} stroke={T.bad}>
    <line x1={-s} y1={-s} x2={s} y2={s} {...draw(Math.min(1, p * 2))} />
    <line x1={s} y1={-s} x2={-s} y2={s} {...draw(Math.max(0, p * 2 - 1))} />
  </g>
);

/** Expanding ring pulse (impact / lock-on). */
export const Ring: React.FC<{ x: number; y: number; r?: number; p?: number; color?: string }> = ({ x, y, r = 60, p = 1, color = T.ink }) => (
  <circle cx={x} cy={y} r={r * (0.4 + p)} {...line(4)} stroke={color} opacity={Math.max(0, 1 - p)} />
);

/** Ink-dot confetti burst. */
export const Burst: React.FC<{ x: number; y: number; p?: number; n?: number; r?: number; color?: string }> = ({ x, y, p = 1, n = 12, r = 120, color = T.ink }) => (
  <g opacity={Math.max(0, 1 - p * 0.9)}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const d = r * p * (0.6 + 0.4 * ((i * 37) % 10) / 10);
      return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={5 - 3 * p} fill={i % 3 === 0 ? T.highlight : color} />;
    })}
  </g>
);

/** Code editor window; lines draw one by one (p 0→1). */
export const CodeWindow: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; lines?: number; o?: number; accent?: string }> = ({
  x, y, w = 560, h = 380, p = 1, lines = 6, o = 1, accent = T.digital,
}) => {
  const l = x - w / 2, t = y - h / 2, bar = Math.min(54, h * 0.16);
  const frame = Math.min(1, p * 2.5), codeP = Math.max(0, (p - 0.3) / 0.7);
  const indents = [0, 1, 2, 2, 1, 2, 0, 1, 2, 1];
  const lens = [0.55, 0.66, 0.45, 0.72, 0.4, 0.6, 0.32, 0.55, 0.68, 0.46];
  const gap = (h - bar - 36) / lines;
  return (
    <g opacity={o}>
      <rect x={l} y={t} width={w} height={h} rx={16} {...line()} fill={T.paper} {...draw(frame)} />
      <line x1={l} y1={t + bar} x2={l + w} y2={t + bar} {...line(T.thin)} {...draw(frame)} />
      {[0, 1, 2].map((i) => <circle key={i} cx={l + 26 + i * 24} cy={t + bar / 2} r={6} {...line(T.thin)} opacity={frame} />)}
      {Array.from({ length: lines }, (_, i) => {
        const lp = Math.max(0, Math.min(1, codeP * lines - i));
        const x0 = l + 36 + indents[i % 10] * 32;
        const len = (w - 72) * lens[i % 10];
        const yy = t + bar + 26 + i * gap;
        return (
          <g key={i} opacity={lp > 0 ? 1 : 0}>
            <line x1={x0} y1={yy} x2={x0 + len * 0.2} y2={yy} {...line(5)} stroke={accent} {...draw(Math.min(1, lp * 3))} />
            <line x1={x0 + len * 0.28} y1={yy} x2={x0 + len} y2={yy} {...line(5)} stroke={T.inkSoft} {...draw(lp)} />
          </g>
        );
      })}
    </g>
  );
};

export const Gear: React.FC<{ x: number; y: number; r?: number; rot?: number; o?: number; color?: string }> = ({ x, y, r = 52, rot = 0, o = 1, color = T.ink }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={-9} y={-r - 14} width={18} height={22} rx={4} transform={`rotate(${i * 45})`} {...line()} stroke={color} fill={T.paper} />
    ))}
    <circle r={r} {...line()} stroke={color} fill={T.paper} />
    <circle r={r * 0.34} {...line()} stroke={color} />
  </g>
);

/** Paper doc, folded corner, RTL text lines drawn by p. */
export const Doc: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; lines?: number; o?: number; heading?: boolean }> = ({
  x, y, w = 360, h = 460, p = 1, lines = 7, o = 1, heading = true,
}) => {
  const l = x - w / 2, t = y - h / 2, c = Math.min(56, w * 0.16);
  return (
    <g opacity={o}>
      <path d={`M ${l + c} ${t} H ${l + w} V ${t + h} H ${l} V ${t + c} Z M ${l} ${t + c} H ${l + c} V ${t}`} {...line()} fill={T.paper} {...draw(Math.min(1, p * 2))} />
      {Array.from({ length: lines }, (_, i) => {
        const lp = Math.max(0, Math.min(1, p * lines - i));
        const right = l + w - w * 0.12;
        const len = w * 0.76 * (i === 0 && heading ? 0.5 : i % 3 === 2 ? 0.6 : 0.95);
        const yy = t + h * 0.18 + i * ((h * 0.72) / lines);
        return <line key={i} x1={right} y1={yy} x2={right - len} y2={yy} {...line(i === 0 && heading ? 7 : 4)} stroke={i === 0 && heading ? T.ink : T.inkSoft} {...draw(lp)} />;
      })}
    </g>
  );
};

/** Pen tip tracking Doc's current line end. */
export const docPen = (x: number, y: number, w: number, h: number, lines: number, p: number, heading = true) => {
  const l = x - w / 2, t = y - h / 2;
  const i = Math.min(lines - 1, Math.floor(p * lines));
  const lp = Math.max(0, Math.min(1, p * lines - i));
  const right = l + w - w * 0.12;
  const len = w * 0.76 * (i === 0 && heading ? 0.5 : i % 3 === 2 ? 0.6 : 0.95);
  const yy = t + h * 0.18 + i * ((h * 0.72) / lines);
  return { x: right - len * lp, y: yy - 16 };
};

/** Phone shell; children draw inside the screen. Returns geometry via constants. */
export const Phone: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; o?: number; children?: React.ReactNode }> = ({
  x, y, w = 300, h = 560, p = 1, o = 1, children,
}) => {
  const l = x - w / 2, t = y - h / 2;
  return (
    <g opacity={o}>
      <rect x={l} y={t} width={w} height={h} rx={36} {...line(5)} fill={T.paper} {...draw(p)} />
      <line x1={x - 34} y1={t + 22} x2={x + 34} y2={t + 22} {...line(T.thin)} stroke={T.inkSoft} opacity={p} />
      <circle cx={x} cy={t + h - 24} r={8} {...line(T.thin)} opacity={p} />
      <g opacity={Math.max(0, (p - 0.5) * 2)}>{children}</g>
    </g>
  );
};

/** SMS envelope. */
export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; color?: string }> = ({ x, y, s = 1, rot = 0, o = 1, color = T.ink }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-44} y={-30} width={88} height={60} rx={8} {...line()} stroke={color} fill={T.paper} />
    <path d="M -44 -26 L 0 6 L 44 -26" {...line(T.thin)} stroke={color} />
  </g>
);

export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number; color?: string }> = ({ x, y, r = 26, o = 1, color = T.highlight }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} {...line()} stroke={color} fill={T.paper} />
    <circle cx={x} cy={y} r={r * 0.55} {...line(T.thin)} stroke={color} />
  </g>
);

/** Liquid gauge tank; level 0→1 from bottom. */
export const Tank: React.FC<{ x: number; y: number; w?: number; h?: number; level?: number; color?: string; p?: number; label?: string }> = ({
  x, y, w = 260, h = 380, level = 1, color = T.digital, p = 1, label,
}) => {
  const l = x - w / 2, t = y - h / 2, b = t + h;
  const lh = (h - 16) * Math.max(0, Math.min(1, level));
  return (
    <g opacity={p}>
      {lh > 0 && <rect x={l + 8} y={b - 8 - lh} width={w - 16} height={lh} rx={6} fill={color} opacity={0.8} />}
      <path d={`M ${l} ${t} L ${l} ${b - 20} Q ${l} ${b} ${l + 20} ${b} L ${l + w - 20} ${b} Q ${l + w} ${b} ${l + w} ${b - 20} L ${l + w} ${t}`} {...line(5)} {...draw(p)} />
      {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={l} y1={b - h * k} x2={l + 22} y2={b - h * k} {...line(T.thin)} stroke={T.inkSoft} opacity={p} />)}
      {label && <Txt x={x} y={t - 24} size={34}>{label}</Txt>}
    </g>
  );
};

export const CalendarDay: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; state?: "idle" | "active" | "done"; p?: number }> = ({
  x, y, w = 180, h = 170, label, state = "idle", p = 1,
}) => {
  const l = x - w / 2, t = y - h / 2;
  const col = state === "active" ? T.highlight : state === "done" ? T.good : T.inkSoft;
  return (
    <g opacity={p}>
      <rect x={l} y={t} width={w} height={h} rx={14} {...line(state === "idle" ? T.thin : 5)} stroke={col} fill={T.paper} />
      <line x1={l} y1={t + 40} x2={l + w} y2={t + 40} {...line(T.thin)} stroke={col} />
      {[0.3, 0.7].map((k) => <line key={k} x1={l + w * k} y1={t - 12} x2={l + w * k} y2={t + 14} {...line(5)} stroke={col} />)}
      {label && <Txt x={x} y={y + 34} size={36} color={state === "idle" ? T.inkSoft : T.ink}>{label}</Txt>}
      {state === "done" && <Check x={x} y={y - 18} s={20} w={5} />}
    </g>
  );
};

/** Clock face; hand angle deg (0 = up, clockwise). arc = highlighted sector from 0 to angle. */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; angle?: number; arc?: number; p?: number; arcColor?: string }> = ({
  x, y, r = 150, angle = 0, arc = 0, p = 1, arcColor = T.highlight,
}) => {
  const rad = (angle * Math.PI) / 180;
  const hx = x + Math.sin(rad) * r * 0.72, hy = y - Math.cos(rad) * r * 0.72;
  const a0 = -Math.PI / 2, a1 = a0 + (arc * Math.PI) / 180;
  const large = arc > 180 ? 1 : 0;
  const arcPath = `M ${x} ${y} L ${x + Math.cos(a0) * r} ${y + Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${x + Math.cos(a1) * r} ${y + Math.sin(a1) * r} Z`;
  return (
    <g opacity={p}>
      {arc > 0 && <path d={arcPath} fill={arcColor} opacity={0.28} />}
      <circle cx={x} cy={y} r={r} {...line(5)} fill={T.paper} {...draw(p)} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.sin(a) * r * 0.86} y1={y - Math.cos(a) * r * 0.86} x2={x + Math.sin(a) * r * 0.96} y2={y - Math.cos(a) * r * 0.96} {...line(T.thin)} stroke={T.inkSoft} opacity={p} />;
      })}
      <line x1={x} y1={y} x2={hx} y2={hy} {...line(7)} stroke={arcColor} opacity={p} />
      <circle cx={x} cy={y} r={8} fill={T.ink} opacity={p} />
    </g>
  );
};

export const Hourglass: React.FC<{ x: number; y: number; s?: number; p?: number; color?: string }> = ({ x, y, s = 1, p = 1, color = T.ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={p}>
    <path d="M -40 -60 H 40 M -40 60 H 40 M -34 -60 C -34 -18 -6 -12 -6 0 C -6 12 -34 18 -34 60 M 34 -60 C 34 -18 6 -12 6 0 C 6 12 34 18 34 60" {...line()} stroke={color} />
    <path d="M -22 -44 H 22 L 4 -16 H -4 Z" fill={color} opacity={0.7} />
    <path d="M -26 52 H 26 L 6 28 H -6 Z" fill={color} opacity={0.7} />
  </g>
);

export const Shield: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; color?: string }> = ({ x, y, w = 300, h = 360, p = 1, color = T.ink }) => (
  <path d={`M ${x} ${y - h / 2} L ${x + w / 2} ${y - h / 2 + 50} V ${y + 20} Q ${x + w / 2} ${y + h / 2 - 40} ${x} ${y + h / 2} Q ${x - w / 2} ${y + h / 2 - 40} ${x - w / 2} ${y + 20} V ${y - h / 2 + 50} Z`}
    {...line(5)} stroke={color} fill={T.paper} {...draw(p)} />
);

export const Lock: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = T.ink, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-34} y={-8} width={68} height={54} rx={10} {...line()} stroke={color} fill={T.paper} />
    <path d="M -20 -8 V -26 A 20 20 0 0 1 20 -26 V -8" {...line()} stroke={color} />
    <circle cx={0} cy={18} r={7} fill={color} />
  </g>
);

export const Banknote: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; o?: number }> = ({ x, y, w = 150, h = 84, color = T.ink, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} {...line()} stroke={color} fill={T.paper} />
    <circle cx={x} cy={y} r={h * 0.28} {...line(T.thin)} stroke={color} />
    <line x1={x - w / 2 + 14} y1={y} x2={x - w / 2 + 30} y2={y} {...line(T.thin)} stroke={color} />
    <line x1={x + w / 2 - 30} y1={y} x2={x + w / 2 - 14} y2={y} {...line(T.thin)} stroke={color} />
  </g>
);

export const IdCard: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; o?: number }> = ({ x, y, w = 150, h = 96, color = T.ink, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} {...line()} stroke={color} fill={T.paper} />
    <circle cx={x - w / 2 + 34} cy={y - 8} r={14} {...line(T.thin)} stroke={color} />
    <path d={`M ${x - w / 2 + 18} ${y + 26} Q ${x - w / 2 + 34} ${y + 4} ${x - w / 2 + 50} ${y + 26}`} {...line(T.thin)} stroke={color} />
    <line x1={x - 6} y1={y - 16} x2={x + w / 2 - 16} y2={y - 16} {...line(T.thin)} stroke={color} />
    <line x1={x - 6} y1={y + 2} x2={x + w / 2 - 16} y2={y + 2} {...line(T.thin)} stroke={color} />
    <line x1={x - 6} y1={y + 20} x2={x + w / 2 - 30} y2={y + 20} {...line(T.thin)} stroke={color} />
  </g>
);

/** Spice jar; fill = thread strokes in `color`. tilt handled by caller transform. */
export const Jar: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; label?: string; fill?: number; o?: number }> = ({
  x, y, w = 120, h = 170, color = T.saffron, label, fill = 1, o = 1,
}) => {
  const l = x - w / 2, t = y - h / 2;
  return (
    <g opacity={o}>
      <rect x={l - 8} y={t - 22} width={w + 16} height={26} rx={8} {...line()} fill={T.paper} />
      <rect x={l} y={t} width={w} height={h} rx={18} {...line()} fill={T.paper} />
      {Array.from({ length: 9 }, (_, i) => {
        const fx = l + 18 + (i % 3) * (w - 36) / 2;
        const fy = t + h - 24 - Math.floor(i / 3) * 26;
        return <path key={i} d={`M ${fx} ${fy} q 8 -10 16 -2`} {...line(4)} stroke={color} opacity={fill} />;
      })}
      {label && <Txt x={x} y={y + h / 2 + 40} size={34}>{label}</Txt>}
    </g>
  );
};

export const Plate: React.FC<{ x: number; y: number; r?: number; o?: number; food?: string }> = ({ x, y, r = 90, o = 1, food }) => (
  <g opacity={o}>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} {...line()} fill={T.paper} />
    <ellipse cx={x} cy={y} rx={r * 0.66} ry={r * 0.27} {...line(T.thin)} stroke={T.inkSoft} />
    {food && <path d={`M ${x - r * 0.4} ${y} Q ${x} ${y - r * 0.4} ${x + r * 0.4} ${y}`} {...line(5)} stroke={food} />}
  </g>
);

export const ChefHat: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string }> = ({ x, y, s = 1, o = 1, color = T.ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -34 18 Q -52 14 -50 -6 Q -48 -26 -26 -26 Q -22 -46 0 -46 Q 22 -46 26 -26 Q 48 -26 50 -6 Q 52 14 34 18 Z" {...line()} stroke={color} fill={T.paper} />
    <rect x={-34} y={18} width={68} height={18} rx={6} {...line()} stroke={color} fill={T.paper} />
  </g>
);

export const Cloche: React.FC<{ x: number; y: number; r?: number; p?: number; o?: number }> = ({ x, y, r = 100, p = 1, o = 1 }) => (
  <g opacity={o}>
    <path d={`M ${x - r} ${y} A ${r} ${r * 0.9} 0 0 1 ${x + r} ${y}`} {...line(5)} fill={T.paper} {...draw(p)} />
    <line x1={x - r - 16} y1={y} x2={x + r + 16} y2={y} {...line(5)} {...draw(p)} />
    <circle cx={x} cy={y - r * 0.9 - 10} r={9} {...line()} opacity={p} />
  </g>
);

export const Star: React.FC<{ x: number; y: number; r?: number; p?: number; color?: string; o?: number }> = ({ x, y, r = 60, p = 1, color = T.highlight, o = 1 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.44;
    return `${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr}`;
  }).join(" L ");
  return <path d={`M ${pts} Z`} {...line(5)} stroke={color} fill={color} fillOpacity={0.18 * p} opacity={o} {...draw(p)} />;
};

export const Button: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; press?: number; done?: boolean; o?: number }> = ({
  x, y, w = 380, h = 96, label, press = 0, done, o = 1,
}) => {
  const s = 1 - 0.06 * press;
  const col = done ? T.good : T.ink;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} {...line(5)} stroke={col} fill={done ? "rgba(70,201,126,0.16)" : T.paper} />
      {label && <Txt x={done ? 18 : 0} y={14} size={42} color={col}>{label}</Txt>}
      {done && <Check x={-w / 2 + 52} y={0} s={20} w={6} />}
    </g>
  );
};

export const Magnifier: React.FC<{ x: number; y: number; r?: number; o?: number; color?: string }> = ({ x, y, r = 64, o = 1, color = T.ink }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} {...line(6)} stroke={color} fill={T.paper} fillOpacity={0.3} />
    <line x1={x + r * 0.72} y1={y + r * 0.72} x2={x + r * 1.7} y2={y + r * 1.7} {...line(13)} stroke={color} />
  </g>
);

export const Target: React.FC<{ x: number; y: number; r?: number; p?: number }> = ({ x, y, r = 70, p = 1 }) => (
  <g>
    {[1, 0.62, 0.26].map((k, i) => (
      <circle key={i} cx={x} cy={y} r={r * k} {...line(i === 2 ? 5 : 4)} fill={i === 2 ? T.bad : "none"} stroke={i === 2 ? T.bad : T.ink} {...draw(Math.max(0, Math.min(1, p * 3 - i)))} />
    ))}
  </g>
);

export const Diamond: React.FC<{ x: number; y: number; s?: number; p?: number; color?: string }> = ({ x, y, s = 70, p = 1, color = T.highlight }) => (
  <g opacity={p}>
    <path d={`M ${x - s} ${y - s * 0.3} L ${x - s * 0.5} ${y - s} H ${x + s * 0.5} L ${x + s} ${y - s * 0.3} L ${x} ${y + s} Z`} {...line(5)} stroke={color} fill={color} fillOpacity={0.14} {...draw(p)} />
    <path d={`M ${x - s} ${y - s * 0.3} H ${x + s} M ${x - s * 0.5} ${y - s} L ${x} ${y + s} L ${x + s * 0.5} ${y - s}`} {...line(T.thin)} stroke={color} opacity={p} />
  </g>
);

export const Cube: React.FC<{ x: number; y: number; s?: number; p?: number; o?: number; color?: string }> = ({ x, y, s = 70, p = 1, o = 1, color = T.ink }) => {
  const w = s * 0.87, h = s / 2;
  const outline = `M 0 ${-s} L ${w} ${-s + h} L ${w} ${h} L 0 ${2 * h} L ${-w} ${h} L ${-w} ${-s + h} Z`;
  const inner = `M ${-w} ${-s + h} L 0 ${-s + 2 * h} L ${w} ${-s + h} M 0 ${-s + 2 * h} L 0 ${2 * h}`;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={outline} {...line()} stroke={color} fill={T.paper} {...draw(p)} />
      <path d={inner} {...line(T.thin)} stroke={color} {...draw(p)} />
    </g>
  );
};

export const Bubble: React.FC<{ x: number; y: number; w?: number; h?: number; tail?: number; o?: number; children?: React.ReactNode }> = ({
  x, y, w = 220, h = 120, tail = 1, o = 1, children,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d={`M ${-w / 2 + 26} ${-h / 2} H ${w / 2 - 26} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 26} V ${h / 2 - 26} Q ${w / 2} ${h / 2} ${w / 2 - 26} ${h / 2} H ${tail * 26 + 16} L ${tail * 8} ${h / 2 + 30} L ${tail * 4 - 6} ${h / 2} H ${-w / 2 + 26} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 26} V ${-h / 2 + 26} Q ${-w / 2} ${-h / 2} ${-w / 2 + 26} ${-h / 2} Z`} {...line()} fill={T.paper} />
    {children}
  </g>
);

export const SpeedLines: React.FC<{ x: number; y: number; len?: number; n?: number; o?: number; dir?: number }> = ({ x, y, len = 90, n = 3, o = 1, dir = -1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => (
      <line key={i} x1={x} y1={y + (i - (n - 1) / 2) * 18} x2={x + dir * len * (1 - i * 0.18)} y2={y + (i - (n - 1) / 2) * 18} {...line(4)} stroke={T.inkSoft} />
    ))}
  </g>
);

export const StepBadge: React.FC<{ x: number; y: number; n: number; state?: "idle" | "active" | "done"; r?: number }> = ({ x, y, n, state = "idle", r = 40 }) => {
  const col = state === "active" ? T.highlight : state === "done" ? T.good : T.inkSoft;
  return (
    <g>
      <circle cx={x} cy={y} r={r} {...line(state === "idle" ? T.thin : 5)} stroke={col} fill={T.paper} />
      <Txt x={x} y={y + 14} size={40} sans color={state === "idle" ? T.inkSoft : T.ink}>{fa(n)}</Txt>
    </g>
  );
};

/** Flowchart node; kind: box | diamond | round. state: dim | active | done. */
export const FlowNode: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; kind?: "box" | "diamond" | "round"; state?: "dim" | "active" | "done"; p?: number }> = ({
  x, y, w = 180, h = 80, label, kind = "box", state = "dim", p = 1,
}) => {
  const col = state === "active" ? T.highlight : state === "done" ? T.good : T.inkSoft;
  const shape = kind === "diamond"
    ? <path d={`M ${x} ${y - h / 2 - 10} L ${x + w / 2} ${y} L ${x} ${y + h / 2 + 10} L ${x - w / 2} ${y} Z`} {...line(state === "dim" ? T.thin : 5)} stroke={col} fill={T.paper} {...draw(p)} />
    : kind === "round"
      ? <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} {...line(state === "dim" ? T.thin : 5)} stroke={col} fill={T.paper} {...draw(p)} />
      : <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={12} {...line(state === "dim" ? T.thin : 5)} stroke={col} fill={T.paper} {...draw(p)} />;
  return (
    <g opacity={p}>
      {shape}
      {label && <Txt x={x} y={y + 12} size={30} color={state === "dim" ? T.inkSoft : T.ink}>{label}</Txt>}
      {state === "done" && <Check x={x + w / 2 - 6} y={y - h / 2 + 2} s={16} w={5} />}
    </g>
  );
};

/** Generic card with title + icon slot. */
export const Card: React.FC<{ x: number; y: number; w?: number; h?: number; active?: boolean; p?: number; children?: React.ReactNode; title?: string }> = ({
  x, y, w = 380, h = 300, active, p = 1, children, title,
}) => (
  <g opacity={p}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={22} {...line(active ? 5 : T.thin)} stroke={active ? T.highlight : T.inkSoft} fill={active ? "rgba(255,216,74,0.06)" : T.paper} {...draw(Math.min(1, p * 1.6))} />
    {children}
    {title && <Txt x={x} y={y + h / 2 - 30} size={34} color={active ? T.ink : T.inkSoft}>{title}</Txt>}
  </g>
);

/** Horizontal arrow connector. */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; color?: string }> = ({ x1, y1, x2, y2, p = 1, color = T.inkSoft }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = mix(x1, x2, p), hy = mix(y1, y2, p);
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} {...line(4)} stroke={color} />
      {p > 0.9 && <path d={`M ${hx} ${hy} l ${-18 * Math.cos(a - 0.4)} ${-18 * Math.sin(a - 0.4)} M ${hx} ${hy} l ${-18 * Math.cos(a + 0.4)} ${-18 * Math.sin(a + 0.4)}`} {...line(4)} stroke={color} />}
    </g>
  );
};