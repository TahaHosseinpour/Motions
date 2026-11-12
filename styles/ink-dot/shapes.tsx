// More recognizable line-art pieces (product / tech / growth vocabulary).
import React from "react";
import { draw } from "../../core/anim";
import { T, line } from "./theme";

/** Isometric box = "a product". (x,y) = visual center; spans y-s … y+s. */
export const Cube: React.FC<{ x: number; y: number; s?: number; p?: number; o?: number; scale?: number; fill?: string; stroke?: string }> = ({
  x,
  y,
  s = 60,
  p = 1,
  o = 1,
  scale = 1,
  fill = T.paper,
  stroke = T.ink,
}) => {
  const w = s * 0.87;
  const h = s / 2;
  // centered on the cube's visual middle
  const top = `M 0 ${-s} L ${w} ${-s + h} L 0 ${-s + 2 * h} L ${-w} ${-s + h} Z`;
  const outline = `M 0 ${-s} L ${w} ${-s + h} L ${w} ${h} L 0 ${2 * h} L ${-w} ${h} L ${-w} ${-s + h} Z`;
  const inner = `M ${-w} ${-s + h} L 0 ${-s + 2 * h} L ${w} ${-s + h} M 0 ${-s + 2 * h} L 0 ${2 * h}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={o}>
      <path d={outline} {...line()} stroke={stroke} fill={fill} {...draw(p)} />
      <path d={top} fill={stroke} opacity={0.08 * p} />
      <path d={inner} {...line(T.thin)} stroke={stroke} {...draw(p)} />
    </g>
  );
};

/** Classic pillar: capital slab, shaft with flutes, base slab. Grows up from `ground` by `h` (0..1). */
export const Pillar: React.FC<{ x: number; ground: number; height?: number; w?: number; grow?: number; fillP?: number; o?: number; label?: string }> = ({
  x,
  ground,
  height = 300,
  w = 110,
  grow = 1,
  fillP = 0,
  o = 1,
  label,
}) => {
  const H = height * grow;
  const top = ground - H;
  const shaftTop = top + 22;
  return (
    <g opacity={o}>
      {/* yellow fill rising inside the shaft = "this one is active" */}
      {fillP > 0 && (
        <rect x={x - w / 2 + 6} y={ground - 20 - (H - 42) * fillP} width={w - 12} height={(H - 42) * fillP} fill={T.highlight} opacity={0.85} />
      )}
      <rect x={x - w / 2} y={shaftTop} width={w} height={Math.max(0, H - 42)} {...line()} fill="none" />
      {[-0.25, 0, 0.25].map((k) => (
        <line key={k} x1={x + k * w} y1={shaftTop + 14} x2={x + k * w} y2={ground - 34} {...line(T.thin)} stroke={T.inkSoft} opacity={grow > 0.3 ? 1 : 0} />
      ))}
      <rect x={x - w / 2 - 16} y={top} width={w + 32} height={22} rx={4} {...line()} fill={T.paper} />
      <rect x={x - w / 2 - 12} y={ground - 20} width={w + 24} height={20} rx={4} {...line()} fill={T.paper} />
      {label && (
        <text x={x} y={top - 46} textAnchor="middle" fontFamily={T.fontSans} fontWeight={700} fontSize={46} fill={T.ink} opacity={grow}>
          {label}
        </text>
      )}
    </g>
  );
};

/** Speech bubble with two "text" squiggles. tail: -1 (left) / 1 (right). */
export const Bubble: React.FC<{ x: number; y: number; w?: number; h?: number; s?: number; rot?: number; tail?: number; o?: number }> = ({
  x,
  y,
  w = 190,
  h = 110,
  s = 1,
  rot = 0,
  tail = 1,
  o = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path
      d={`M ${-w / 2 + 30} ${-h / 2} H ${w / 2 - 30} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 30} V ${h / 2 - 30} Q ${w / 2} ${h / 2} ${w / 2 - 30} ${h / 2}
         H ${tail * 30 + 20} L ${tail * 10} ${h / 2 + 34} L ${tail * 4 - 6} ${h / 2} H ${-w / 2 + 30} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 30} V ${-h / 2 + 30} Q ${-w / 2} ${-h / 2} ${-w / 2 + 30} ${-h / 2} Z`}
      {...line()}
      fill={T.paper}
    />
    <line x1={w / 2 - 34} y1={-14} x2={-w / 2 + 40} y2={-14} {...line(T.thin)} stroke={T.inkSoft} />
    <line x1={w / 2 - 34} y1={16} x2={-w / 2 + 80} y2={16} {...line(T.thin)} stroke={T.inkSoft} />
  </g>
);

/** Code-editor window: title bar with 3 dots, indented code lines drawn one by one (p 0..1). */
export const CodeWindow: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; lines?: number; o?: number }> = ({
  x,
  y,
  w = 600,
  h = 420,
  p = 1,
  lines = 7,
  o = 1,
}) => {
  const l = x - w / 2;
  const t = y - h / 2;
  const bar = Math.min(60, h * 0.16);
  const frame = Math.min(1, p * 2.5);
  const codeP = Math.max(0, (p - 0.3) / 0.7);
  const indents = [0, 1, 2, 2, 1, 2, 0, 1, 2, 1];
  const lens = [0.55, 0.62, 0.48, 0.7, 0.4, 0.58, 0.3, 0.52, 0.66, 0.44];
  const gap = (h - bar - 40) / lines;
  return (
    <g opacity={o}>
      <rect x={l} y={t} width={w} height={h} rx={18} {...line()} fill={T.paper} {...draw(frame)} />
      <line x1={l} y1={t + bar} x2={l + w} y2={t + bar} {...line(T.thin)} {...draw(frame)} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={l + 30 + i * 26} cy={t + bar / 2} r={7} {...line(T.thin)} opacity={frame} />
      ))}
      {Array.from({ length: lines }, (_, i) => {
        const lp = Math.max(0, Math.min(1, codeP * lines - i));
        const x0 = l + 40 + indents[i % 10] * 36;
        const len = (w - 80) * lens[i % 10];
        const yy = t + bar + 30 + i * gap;
        return (
          <g key={i}>
            <line x1={x0} y1={yy} x2={x0 + len * 0.22} y2={yy} {...line(5)} stroke={T.ink} opacity={lp > 0 ? 1 : 0} {...draw(Math.min(1, lp * 3))} />
            <line x1={x0 + len * 0.3} y1={yy} x2={x0 + len} y2={yy} {...line(5)} stroke={T.inkSoft} {...draw(lp)} />
          </g>
        );
      })}
    </g>
  );
};

/** Paper document with folded corner (top-left) and text lines (RTL). */
export const Doc: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; lines?: number; o?: number; heading?: boolean }> = ({
  x,
  y,
  w = 380,
  h = 480,
  p = 1,
  lines = 8,
  o = 1,
  heading = true,
}) => {
  const l = x - w / 2;
  const t = y - h / 2;
  const c = Math.min(60, w * 0.16);
  return (
    <g opacity={o}>
      <path d={`M ${l + c} ${t} H ${l + w} V ${t + h} H ${l} V ${t + c} Z M ${l} ${t + c} H ${l + c} V ${t}`} {...line()} fill={T.paper} />
      {Array.from({ length: lines }, (_, i) => {
        const lp = Math.max(0, Math.min(1, p * lines - i));
        const right = l + w - w * 0.12;
        const len = (w * 0.76) * (i === 0 && heading ? 0.55 : i % 3 === 2 ? 0.6 : 0.95);
        const yy = t + h * 0.18 + i * ((h * 0.72) / lines);
        return <line key={i} x1={right} y1={yy} x2={right - len} y2={yy} {...line(i === 0 && heading ? 7 : 4)} stroke={i === 0 && heading ? T.ink : T.inkSoft} {...draw(lp)} />;
      })}
    </g>
  );
};

/** Doc line end point for pen-tip tracking (same geometry as <Doc>). */
export const docPen = (x: number, y: number, w: number, h: number, lines: number, p: number, heading = true) => {
  const l = x - w / 2;
  const t = y - h / 2;
  const i = Math.min(lines - 1, Math.floor(p * lines));
  const lp = Math.max(0, Math.min(1, p * lines - i));
  const right = l + w - w * 0.12;
  const len = (w * 0.76) * (i === 0 && heading ? 0.55 : i % 3 === 2 ? 0.6 : 0.95);
  const yy = t + h * 0.18 + i * ((h * 0.72) / lines);
  return { x: right - len * lp, y: yy - 18 };
};

/** Gear (rotating = "machine / agent working"). */
export const Gear: React.FC<{ x: number; y: number; r?: number; rot?: number; o?: number }> = ({ x, y, r = 50, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={-9} y={-r - 14} width={18} height={22} rx={4} transform={`rotate(${i * 45})`} {...line()} fill={T.paper} />
    ))}
    <circle r={r} {...line()} fill={T.paper} />
    <circle r={r * 0.36} {...line()} />
  </g>
);

/** Magnifying glass; (x,y) = lens center. */
export const Magnifier: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 70, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} {...line(6)} fill={T.paper} fillOpacity={0.35} />
    <line x1={x + r * 0.72} y1={y + r * 0.72} x2={x + r * 1.75} y2={y + r * 1.75} {...line(14)} />
  </g>
);

/** Coin seen from the front. */
export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 30, o = 1 }) => (
  <g opacity={o}>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} {...line()} fill={T.highlight} />
    <ellipse cx={x} cy={y} rx={r * 0.62} ry={r * 0.24} {...line(T.thin)} stroke={T.inkSoft} />
  </g>
);

/** Concentric target. */
export const Target: React.FC<{ x: number; y: number; r?: number; p?: number }> = ({ x, y, r = 46, p = 1 }) => (
  <g>
    {[1, 0.62, 0.26].map((k, i) => (
      <circle key={i} cx={x} cy={y} r={r * k} {...line(i === 2 ? 4 : 3.5)} fill={i === 2 ? T.bad : "none"} stroke={i === 2 ? T.bad : T.ink} {...draw(Math.max(0, Math.min(1, p * 3 - i)))} />
    ))}
  </g>
);

/** Small upward arrow (growth). */
export const UpArrow: React.FC<{ x: number; y: number; len?: number; p?: number; color?: string }> = ({ x, y, len = 160, p = 1, color = T.good }) => (
  <g stroke={color}>
    <line x1={x} y1={y} x2={x} y2={y - len} {...line(7)} stroke={color} {...draw(p)} />
    <path d={`M ${x - 26} ${y - len + 28} L ${x} ${y - len} L ${x + 26} ${y - len + 28}`} {...line(7)} stroke={color} opacity={p > 0.85 ? 1 : 0} />
  </g>
);

/** Tiny "user" icon (head + shoulders) — users, audience, customers. */
export const UserIcon: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string }> = ({ x, y, s = 1, o = 1, color = T.ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cx={0} cy={-12} r={10} fill={color} />
    <path d="M -17 16 Q -17 -1 0 -1 Q 17 -1 17 16 Z" fill={color} />
  </g>
);

/** Deterministic pseudo-random 0..1 for index i. */
export const rnd = (i: number) => {
  const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
};
