// Shared fonts. Files live in assets/fonts (licensed fonts — kept out of git).
// Loaded with FontFace; rendering waits until every face is ready.
import { continueRender, delayRender } from "remotion";
import yekanRegular from "../assets/fonts/IRANYekanXFaNum-Regular.ttf";
import yekanMedium from "../assets/fonts/IRANYekanXFaNum-Medium.ttf";
import yekanDemibold from "../assets/fonts/IRANYekanXFaNum-DemiBold.ttf";
import yekanBold from "../assets/fonts/IRANYekanXFaNum-Bold.ttf";
import dastNevis from "../assets/fonts/danstevis.otf";

type Face = { url: string; weight: string; format: string };

const FAMILIES: Record<string, Face[]> = {
  /** Clean UI sans (FaNum = Persian digits). Weights 400/500/600/700. */
  IRANYekanX: [
    { url: yekanRegular, weight: "400", format: "truetype" },
    { url: yekanMedium, weight: "500", format: "truetype" },
    { url: yekanDemibold, weight: "600", format: "truetype" },
    { url: yekanBold, weight: "700", format: "truetype" },
  ],
  /** Persian handwriting ("Dast Nevis"). Single weight; Persian only (almost no Latin). */
  DastNevis: [{ url: dastNevis, weight: "400", format: "opentype" }],
};

const loaded = new Set<string>();

/** Load a family once and return its CSS font-family name. */
export const loadFont = (family: keyof typeof FAMILIES) => {
  if (loaded.has(family) || typeof document === "undefined") return family;
  loaded.add(family);
  const handle = delayRender(`Loading font ${family}`);
  Promise.all(
    FAMILIES[family].map(({ url, weight, format }) => {
      const face = new FontFace(family, `url(${url}) format("${format}")`, { weight });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
  return family;
};

export const loadIranYekan = () => loadFont("IRANYekanX");
export const loadDastNevis = () => loadFont("DastNevis");

/**
 * Font presets — the ONLY place a style's main font is chosen.
 * Pick one per project with `"font": "<id>"` in story.json, or override at render time:
 *   npm run render -- <project> --font iran-yekan
 * Scenes/captions read the result through the theme, so no component changes are needed.
 * To add a font: drop the files in assets/fonts, add a family to FAMILIES above, add a preset here.
 */
export type FontPreset = {
  /** CSS font-family (with fallbacks). */
  family: string;
  /** Weight used for captions. */
  weight: number;
  /** Multiplier on caption/label sizes (fonts differ in optical size). */
  size: number;
};

export const FONT_PRESETS = {
  /** Persian handwriting; IRANYekanX fills missing glyphs (Latin, digits). */
  "dast-nevis": () => ({ family: `${loadDastNevis()}, ${loadIranYekan()}`, weight: 400, size: 1 }),
  /** Clean sans with Persian digits. */
  "iran-yekan": () => ({ family: loadIranYekan(), weight: 600, size: 0.82 }),
} satisfies Record<string, () => FontPreset>;

export type FontId = keyof typeof FONT_PRESETS;

export const fontPreset = (id: string | undefined, fallback: FontId): FontPreset => {
  const make = FONT_PRESETS[(id ?? fallback) as FontId];
  if (!make) throw new Error(`unknown font "${id}". Available: ${Object.keys(FONT_PRESETS).join(", ")}`);
  return make();
};
