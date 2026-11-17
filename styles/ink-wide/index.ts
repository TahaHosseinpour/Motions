import type { StyleDef } from "../../core/styles";
import example from "./example.story.json";
import { InkWideReel } from "./Reel";

export const inkWide: StyleDef = {
  id: "ink-wide",
  component: InkWideReel,
  example: example as StyleDef["example"],
};