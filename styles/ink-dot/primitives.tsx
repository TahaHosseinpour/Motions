// Reusable line-art pieces for the ink-dot style. All are pure SVG <g>s.
import React from "react";
import { draw } from "../../core/anim";
import { T, line } from "./theme";

/** Banknote: outer frame, inner hairline frame, center medallion, corner value. */
export const Bill: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  p?: number; // draw progress 0→1
  value?: string;
  showMedallion?: boolean;
}> = ({ x, y, w = 440, h = 220, p = 1, value = "۱۰۰", showMedallion = true }) => {
  const inner = Math.max(0, Math.min(1, (p - 0.3) / 0.7));
  const k = w / 440;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={18 * k}
        {...line()}
        {...draw(p)}
      />
      <rect
        x={x - w / 2 + 18 * k}
        y={y - h / 2 + 18 * k}
        width={w - 36 * k}
        height={h - 36 * k}
        rx={8 * k}
        {...line(T.thin)}
        stroke={T.inkSoft}
        {...draw(inner)}
      />
      {showMedallion && (
        <circle
          cx={x}
          cy={y}
          r={52 * k}
          {...line(T.thin)}
          {...draw(inner)}
        />
      )}
      <g
        opacity={inner}
        fontFamily={T.fontSans}
        fontSize={30 * k}
        fontWeight={700}
        fill={T.ink}
      >
        <text x={x + w / 2 - 40 * k} y={y - h / 2 + 58 * k} textAnchor="middle">
          {value}
        </text>
        <text x={x - w / 2 + 40 * k} y={y + h / 2 - 34 * k} textAnchor="middle">
          {value}
        </text>
      </g>
    </g>
  );
};

/** Slice-of-bread silhouette (instantly reads as "bread"), ~96×92 at s=1. */
const SLICE =
  "M -36 40 Q -36 46 -30 46 L 30 46 Q 36 46 36 40 L 36 -8 Q 50 -14 48 -30 Q 44 -46 20 -46 L -20 -46 Q -44 -46 -48 -30 Q -50 -14 -36 -8 Z";

export const Loaf: React.FC<{
  x: number;
  y: number;
  s?: number; // scale
  rot?: number;
  o?: number;
  dashed?: boolean;
  /** 0→1: draws a red ✕ over the loaf */
  cross?: number;
}> = ({ x, y, s = 1, rot = 0, o = 1, dashed, cross = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path d={SLICE} {...line()} fill={T.paper} strokeDasharray={dashed ? "9 8" : undefined} />
    <path d={SLICE} transform="scale(0.72) translate(0 6)" {...line(T.thin)} stroke={T.inkSoft} />
    {cross > 0 && <Cross x={0} y={0} size={34} p={cross} />}
  </g>
);

/** Red ✕ (wrong / lost / removed). */
export const Cross: React.FC<{ x: number; y: number; size?: number; p?: number }> = ({ x, y, size = 40, p = 1 }) => (
  <g transform={`translate(${x} ${y})`} {...line(6)} stroke={T.bad}>
    <line x1={-size} y1={-size} x2={size} y2={size} {...draw(Math.min(1, p * 2))} />
    <line x1={size} y1={-size} x2={-size} y2={size} {...draw(Math.max(0, p * 2 - 1))} />
  </g>
);

/** Green ✓ (correct / kept / gained). */
export const Check: React.FC<{ x: number; y: number; size?: number; p?: number }> = ({ x, y, size = 40, p = 1 }) => (
  <path
    d={`M ${x - size} ${y} L ${x - size * 0.3} ${y + size * 0.7} L ${x + size} ${y - size * 0.7}`}
    {...line(6)}
    stroke={T.good}
    {...draw(p)}
  />
);

/** Open-top glass (U shape). Returns the path; fill is drawn by caller. */
export const glassPath = (x: number, top: number, w: number, h: number, r = 26) => {
  const l = x - w / 2;
  const rr = x + w / 2;
  const b = top + h;
  return `M ${l} ${top} L ${l} ${b - r} Q ${l} ${b} ${l + r} ${b} L ${rr - r} ${b} Q ${rr} ${b} ${rr} ${b - r} L ${rr} ${top}`;
};
