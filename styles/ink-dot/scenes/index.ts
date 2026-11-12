// Scene registry: story.json → beats[].scene must be one of these keys.
import { SceneDef } from "../theme";
import { asset } from "./asset";
import { bill } from "./bill";
import { chart } from "./chart";
import { equal } from "./equal";
import { leak } from "./leak";
import { loavesBuy, loavesLoss } from "./loaves";
import { shrink } from "./shrink";
import { timeline } from "./timeline";
import { agent, checklist, codeWindow, evaluate, writeDoc } from "./ai-build";
import { follow } from "./cta";
import { attract, crowdProducts, fastBuild, fillUp, flatline } from "./growth";
import { clock, crowdBuild, pickDirection } from "./judgement";
import { opinions, pillars, question, temple } from "./structure";

export const SCENES: Record<string, SceneDef> = {
  bill,
  "loaves-buy": loavesBuy,
  "loaves-loss": loavesLoss,
  timeline,
  equal,
  leak,
  chart,
  shrink,
  asset,
  // structure / frameworks
  question,
  opinions,
  pillars,
  temple,
  // judgement
  "crowd-build": crowdBuild,
  "pick-direction": pickDirection,
  clock,
  // building with AI
  "code-window": codeWindow,
  "write-doc": writeDoc,
  agent,
  evaluate,
  checklist,
  // growth
  "crowd-products": crowdProducts,
  attract,
  "fill-up": fillUp,
  "fast-build": fastBuild,
  flatline,
  // closing
  follow,
};
