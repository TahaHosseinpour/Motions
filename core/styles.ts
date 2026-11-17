// Style registry. To add a style: create styles/<id>/ with index.ts exporting a
// StyleDef, then add it to the list below.
import React from "react";
import { Story } from "./types";
import { inkDot } from "../styles/ink-dot";
import { inkWide } from "../styles/ink-wide";

export type StyleDef = {
  id: string;
  component: React.FC<Story>;
  /** Story used as the default preview in Remotion Studio. */
  example: Story;
};

export const STYLES: StyleDef[] = [inkDot, inkWide];
