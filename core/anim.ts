// Shared animation helpers — used by every style.
import { Easing, interpolate } from "remotion";

export const ease = {
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

/** Clamped 0→1 (or from→to) progress between frames a and b. */
export const tween = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = ease.inOut,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Props that make an SVG stroke "draw itself" (p: 0→1). */
export const draw = (p: number) => ({
  pathLength: 1,
  strokeDasharray: "1 1",
  strokeDashoffset: 1 - p,
});

/** Fade out over the last n frames of a beat. */
export const exitFade = (f: number, dur: number, n = 8) =>
  tween(f, dur - n, dur, 1, 0);

/** Parabolic hop between two points (h = arc height in px). */
export const hop = (
  t: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  h: number,
) => ({ x: mix(x0, x1, t), y: mix(y0, y1, t) - 4 * h * t * (1 - t) });
