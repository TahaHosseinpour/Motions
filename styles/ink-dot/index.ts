import type { StyleDef } from "../../core/styles";
import example from "./example.story.json";
import { InkDotReel } from "./Reel";

export const inkDot: StyleDef = {
  id: "ink-dot",
  component: InkDotReel,
  example: example as StyleDef["example"],
};
