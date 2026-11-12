// Story format shared by all styles. A project's story.json follows this shape.

export type CaptionPage = {
  /** Seconds from the beat start (relative timing) or from the audio start (absolute timing). */
  at: number;
  text: string;
  pos?: "top" | "bottom";
};

export type Beat = {
  /** Scene id from the style's scene registry (see styles/<style>/STYLE.md). */
  scene: string;
  /** Single caption for the whole beat… */
  caption?: string;
  /** …or several caption pages synced to the narration (overrides `caption`). */
  captions?: CaptionPage[];
  /** Beat length in seconds (relative timing). */
  seconds?: number;
  /** Beat start in the audio, seconds (absolute timing — length comes from the next beat). */
  from?: number;
  /** Default caption slot. */
  captionPos?: "top" | "bottom";
  /** Free-form scene parameters. */
  props?: Record<string, unknown>;
};

export type Story = {
  title: string;
  /** Style folder name under styles/, also the Remotion composition id. */
  style: string;
  beats: Beat[];
  /**
   * "relative" (default): beats have `seconds`, caption `at` is from beat start.
   * "absolute": beats have `from` (audio time), caption `at` is audio time; needs `duration`.
   */
  timing?: "relative" | "absolute";
  /** Total length in seconds (absolute timing). */
  duration?: number;
  /** Optional voice-over file (relative to the project folder). */
  audio?: string;
  /** Injected by tools/render.mjs: ids of images present in outputs/<project>/assets/. */
  availableAssets?: string[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Convert absolute timing to relative (seconds + beat-relative caption pages). Idempotent. */
export const normalizeStory = (s: Story): Story => {
  if (s.timing !== "absolute") return s;
  const beats = s.beats.map((b, i) => {
    const from = b.from ?? 0;
    const to = i < s.beats.length - 1 ? s.beats[i + 1].from ?? from : s.duration ?? from + 3;
    return {
      ...b,
      seconds: Math.max(0.1, to - from),
      captions: b.captions?.map((c) => ({ ...c, at: Math.max(0, c.at - from) })),
    };
  });
  return { ...s, timing: "relative", beats };
};

// Rounding beat *boundaries* (not lengths) keeps long voice-synced stories from drifting.
const boundaries = (s: Story) => {
  const out = [0];
  let t = 0;
  for (const b of s.beats) {
    t += b.seconds ?? 0;
    out.push(Math.round(t * FPS));
  }
  return out;
};

export const beatFrames = (s: Story, i: number) => {
  const b = boundaries(s);
  return b[i + 1] - b[i];
};
export const storyFrames = (s: Story) => Math.max(1, boundaries(s)[s.beats.length]);

/** Which beat is active at global frame f, and the local frame inside it. */
export const locateBeat = (s: Story, f: number) => {
  const b = boundaries(s);
  for (let i = 0; i < s.beats.length; i++) {
    if (f < b[i + 1] || i === s.beats.length - 1) return { index: i, local: f - b[i], dur: b[i + 1] - b[i] };
  }
  return { index: 0, local: 0, dur: 1 };
};

/** Active caption page of a beat at local frame f. */
export const locatePage = (beat: Beat, f: number, dur: number) => {
  const pages: CaptionPage[] = beat.captions?.length ? beat.captions : beat.caption ? [{ at: 0, text: beat.caption }] : [];
  if (!pages.length) return null;
  let k = 0;
  for (let i = 0; i < pages.length; i++) if (Math.round(pages[i].at * FPS) <= f) k = i;
  const start = Math.round(pages[k].at * FPS);
  const end = k < pages.length - 1 ? Math.round(pages[k + 1].at * FPS) : dur;
  return { page: pages[k], index: k, local: f - start, dur: end - start, last: k === pages.length - 1 };
};
