import { FontId, fontPreset } from "../../core/fonts";
import { Story } from "../../core/types";

/** Color themes. "dark" (default): black background, white ink & character. "light": the original cream paper. */
const THEMES = {
  dark: {
    paper: "#0D0D0D",
    ink: "#F8FAFC",
    inkSoft: "rgba(248,250,252,0.45)",
    inkFaint: "rgba(248,250,252,0.16)",
    fill: "rgba(248,250,252,0.18)",
    good: "#01CD98",
    bad: "#F05A4E",
    highlight: "#01CD98",
    /** Text color of *highlighted* caption words (dark on the green marker). */
    markText: "#0D0D0D" as string | undefined,
    dark: true,
  },
  light: {
    paper: "#F8FAFC",
    ink: "#151515",
    inkSoft: "rgba(21,21,21,0.38)",
    inkFaint: "rgba(21,21,21,0.14)",
    fill: "rgba(21,21,21,0.16)",
    good: "#01CD98",
    bad: "#D9463B",
    highlight: "#01CD98",
    markText: "#0D0D0D" as string | undefined,
    dark: false,
  },
};
export type ThemeId = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeId = "dark";
export const DEFAULT_FONT: FontId = "dast-nevis";

const font = fontPreset(DEFAULT_FONT, DEFAULT_FONT);

/**
 * Live theme. Scenes read T.* while rendering, and Reel calls applyStory() first,
 * so theme/font switches from story.json (or render flags) reach every scene
 * without touching scene code. Never copy T.* into module-level constants.
 */
export const T = {
  ...THEMES[DEFAULT_THEME],
  /** Semantic accents (good/bad) — ONLY for meaning (✓ / ✕, gain / loss), never decoration. */
  stroke: 3.5,
  thin: 2,
  dotR: 15,
  font: font.family,
  fontSans: fontPreset("iran-yekan", "iran-yekan").family,
  captionWeight: font.weight,
  captionSize: 76 * font.size,
  /** Drawing scale: scenes are authored at 1×; the whole drawing is enlarged by this factor in Reel. */
  scale: 1.25,
  /** Main drawing area center in scene coordinates (1080×1920). */
  cx: 540,
  cy: 920,
};

/** Apply a story's theme + font to T. Called by Reel before rendering scenes. */
export const applyStory = (s: Story) => {
  const theme = THEMES[(s.theme ?? DEFAULT_THEME) as ThemeId];
  if (!theme) throw new Error(`ink-dot: unknown theme "${s.theme}". Available: ${Object.keys(THEMES).join(", ")}`);
  const f = fontPreset(s.font, DEFAULT_FONT);
  Object.assign(T, theme, { font: f.family, captionWeight: f.weight, captionSize: 76 * f.size });
};

export type DotState = { x: number; y: number; r: number; o?: number };

/** p = beat props + `_cues` (frames where each caption page starts, beat-relative). */
export type SceneProps = { f: number; dur: number; p: Record<string, unknown> };

/** Frame of caption page k (falls back to a fraction of the beat). */
export const cue = (p: Record<string, unknown>, k: number, dur: number, fallback = 0.5) => {
  const c = p._cues as number[] | undefined;
  return c && c[k] !== undefined ? c[k] : Math.round(dur * fallback);
};

export type SceneDef = {
  /** Everything except the hero dot, drawn in a 1080x1920 SVG. */
  Visual: React.FC<SceneProps>;
  /** Where the hero dot is at local frame f. */
  dot: (f: number, dur: number, p: Record<string, unknown>) => DotState;
};

/** Shared SVG stroke style. */
export const line = (w = T.stroke) => ({
  fill: "none",
  stroke: T.ink,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});
