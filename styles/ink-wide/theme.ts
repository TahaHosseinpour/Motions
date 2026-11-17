import { FontId, fontPreset } from "../../core/fonts";
import { Story } from "../../core/types";

/**
 * ink-wide — the ink-dot aesthetic authored natively for 16:9 (1920×1080).
 * Black paper, warm-white marker strokes, one hero dot that travels the whole film.
 * Scenes draw directly in output coordinates (no portrait canvas remap).
 */
export const W = 1920;
export const H = 1080;

const THEMES = {
  dark: {
    paper: "#07090C",
    ink: "#F8FAFC",
    inkSoft: "rgba(248,250,252,0.52)",
    inkFaint: "rgba(248,250,252,0.16)",
    fill: "rgba(248,250,252,0.10)",
    good: "#01CD98",
    bad: "#F0564A",
    highlight: "#01CD98",
    /** Story accents: saffron (the real thing) vs turmeric (the confident mistake). */
    saffron: "#E8613C",
    turmeric: "#E8B93A",
    /** Cool digital tone for SMS / code / agent machinery. */
    digital: "#79C7E3",
    markText: "#04231A" as string | undefined,
    dark: true,
  },
};
export type ThemeId = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeId = "dark";
export const DEFAULT_FONT: FontId = "dast-nevis";

const font = fontPreset(DEFAULT_FONT, DEFAULT_FONT);

/** Live theme — Reel/Frame call applyStory() first; scenes read T.* at render time. */
export const T = {
  ...THEMES[DEFAULT_THEME],
  stroke: 4,
  thin: 2.5,
  dotR: 14,
  font: font.family,
  fontSans: fontPreset("iran-yekan", "iran-yekan").family,
  captionFont: font.family,
  captionWeight: font.weight,
  captionSize: 60 * font.size,
  cx: W / 2,
  cy: H / 2,
};

export const applyStory = (s: Story) => {
  const theme = THEMES[(s.theme ?? DEFAULT_THEME) as ThemeId];
  if (!theme) throw new Error(`ink-wide: unknown theme "${s.theme}".`);
  const sceneF = fontPreset(s.font, DEFAULT_FONT);
  const capF = fontPreset(s.captionFont ?? s.font, DEFAULT_FONT);
  Object.assign(T, theme, {
    font: sceneF.family,
    captionFont: capF.family,
    captionWeight: capF.weight,
    captionSize: 60 * capF.size,
  });
};

export type DotState = { x: number; y: number; r: number; o?: number };
export type CamState = { z?: number; x?: number; y?: number };
export type SceneProps = { f: number; dur: number; p: Record<string, unknown> };

/** Frame of caption page k (falls back to a fraction of the beat). */
export const cue = (p: Record<string, unknown>, k: number, dur: number, fallback = 0.5) => {
  const c = p._cues as number[] | undefined;
  return c && c[k] !== undefined ? c[k] : Math.round(dur * fallback);
};

export type SceneDef = {
  Visual: React.FC<SceneProps>;
  dot: (f: number, dur: number, p: Record<string, unknown>) => DotState;
  /** Optional camera move over the beat (zoom / pan in output px). */
  cam?: (f: number, dur: number, p: Record<string, unknown>) => CamState;
};

export const line = (w = T.stroke) => ({
  fill: "none",
  stroke: T.ink,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Persian digits for counters. */
export const fa = (n: number) => Math.round(n).toLocaleString("fa-IR");