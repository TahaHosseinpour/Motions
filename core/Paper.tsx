import React from "react";
import { AbsoluteFill } from "remotion";

/** Static paper texture: flat tone + fine grain + soft vignette. */
export const Paper: React.FC<{ color: string; grain?: number; dark?: boolean }> = ({
  color,
  grain = 0.08,
  dark = false,
}) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <svg width="100%" height="100%" style={{ position: "absolute" }}>
      <filter id="paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={2}
          seed={7}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id="paper-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="60%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor={dark ? "#000" : "#3a2f1c"} stopOpacity={dark ? 0.5 : 0.06} />
      </radialGradient>
      <rect
        width="100%"
        height="100%"
        filter="url(#paper-grain)"
        opacity={dark ? grain * 0.5 : grain}
        style={{ mixBlendMode: dark ? "screen" : "multiply" }}
      />
      <rect width="100%" height="100%" fill="url(#paper-vignette)" />
    </svg>
  </AbsoluteFill>
);
