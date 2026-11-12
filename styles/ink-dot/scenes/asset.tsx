// asset — shows one generated doodle image (outputs/<project>/assets/<id>.png),
// revealed right→left like it is being drawn. The dot stays the hero: it sits
// on/next to the image instead of disappearing.
// props:
//   id: string                 asset id (required; listed in outputs/<project>/assets.json)
//   w?, h?: number             box size in px (default 560×560), centered at (T.cx, T.cy)
//   reveal?: "wipe"|"pop"|"fade"
//   dot?: "top" | "left" | "right" | "hide" | { x: number, y: number }   (default "top")
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { ease, exitFade, tween } from "../../../core/anim";
import { SceneDef, T } from "../theme";

const box = (p: Record<string, unknown>) => ({ w: (p.w as number) ?? 560, h: (p.h as number) ?? 560 });

export const asset: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const { w, h } = box(p);
    const reveal = (p.reveal as "wipe" | "pop" | "fade") ?? "wipe";
    return (
      <g opacity={exitFade(f, dur)}>
        <AssetImage
          id={(p.id as string) ?? "missing-id"}
          x={T.cx}
          y={T.cy}
          w={w}
          h={h}
          reveal={reveal}
          p={tween(f, 2, 26, 0, 1, reveal === "pop" ? ease.back : ease.inOut)}
          ink={T.ink}
          font={T.fontSans}
        />
      </g>
    );
  },
  dot: (_f, _d, p) => {
    const { w, h } = box(p);
    const d = p.dot ?? "top";
    if (typeof d === "object" && d) return { ...(d as { x: number; y: number }), r: T.dotR };
    if (d === "left") return { x: T.cx - w / 2 - 40, y: T.cy, r: T.dotR };
    if (d === "right") return { x: T.cx + w / 2 + 40, y: T.cy, r: T.dotR };
    if (d === "hide") return { x: T.cx, y: T.cy, r: 0 };
    return { x: T.cx, y: T.cy - h / 2 - 30, r: T.dotR };
  },
};
