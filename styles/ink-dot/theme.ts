import { loadDastNevis, loadIranYekan } from "../../core/fonts";

// Handwriting for narration + labels; IRANYekanX as fallback (missing glyphs) and for UI-ish text.
const hand = loadDastNevis();
const sans = loadIranYekan();

export const T = {
  paper: "#F3EFE6",
  ink: "#151515",
  inkSoft: "rgba(21,21,21,0.38)",
  inkFaint: "rgba(21,21,21,0.14)",
  fill: "rgba(21,21,21,0.16)",
  /** Semantic accents — ONLY for meaning (✓ / ✕, gain / loss), never decoration. */
  good: "#2F9E5B",
  bad: "#D9463B",
  /** Yellow marker behind key words in captions (*word* in story.json). */
  highlight: "#FFD84A",
  stroke: 3.5,
  thin: 2,
  dotR: 15,
  font: `${hand}, ${sans}`,
  fontSans: sans,
  captionSize: 60,
  /** Main drawing area center (between the two caption slots). */
  cx: 540,
  cy: 920,
  captionTop: 560,
  captionBottom: 1260,
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
