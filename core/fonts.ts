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
