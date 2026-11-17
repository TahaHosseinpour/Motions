// Generated image assets (outputs/<project>/assets/<id>.png).
// tools/assets.mjs and tools/render.mjs strip the background to alpha=0 and
// normalize strokes to warm white (#F4F1EA) via tools/lib/nobg.mjs.
// tools/render.mjs injects `availableAssets` into the story; anything missing
// renders as a dashed placeholder so a reel can be previewed before images exist.
import React, { createContext, useContext } from "react";
import { staticFile } from "remotion";

export const AssetsContext = createContext<string[]>([]);
export const AssetBaseContext = createContext<string | undefined>(undefined);

export const AssetImage: React.FC<{
  id: string;
  /** center */
  x: number;
  y: number;
  w: number;
  h: number;
  /** reveal progress 0→1 */
  p?: number;
  /** wipe = right→left reveal like drawing (RTL); pop = scale; fade = opacity */
  reveal?: "wipe" | "pop" | "fade";
  /** stroke / placeholder ink color */
  ink?: string;
  font?: string;
}> = ({ id, x, y, w, h, p = 1, reveal = "wipe", ink = "#F4F1EA", font = "sans-serif" }) => {
  const available = useContext(AssetsContext);
  const baseUrl = useContext(AssetBaseContext);
  const has = available.includes(id);
  const clipId = `asset-clip-${id}-${Math.round(x)}-${Math.round(y)}`;
  // Transparent-background PNG strokes are tinted to the theme's ink color (white on dark theme, dark on light theme).
  const [r, g, b] = /^#[0-9a-f]{6}$/i.test(ink) ? [1, 3, 5].map((i) => parseInt(ink.slice(i, i + 2), 16) / 255) : [0.957, 0.945, 0.918];
  const filterId = `asset-ink-${id}-${Math.round(x)}-${Math.round(y)}`;
  const left = x - w / 2;
  const top = y - h / 2;
  const scale = reveal === "pop" ? p : 1;
  const opacity = reveal === "fade" ? p : reveal === "pop" ? Math.min(1, p * 2) : 1;
  const href = baseUrl ? `${baseUrl}/${id}.png` : staticFile(`assets/${id}.png`);

  const body = has ? (
    <image
      href={href}
      x={left}
      y={top}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      filter={`url(#${filterId})`}
    />
  ) : (
    <g>
      <rect x={left} y={top} width={w} height={h} rx={24} fill="none" stroke={ink} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="14 12" />
      <text x={x} y={y} textAnchor="middle" fontFamily={font} fontSize={34} fill={ink} fillOpacity={0.45}>
        {`asset: ${id}`}
      </text>
    </g>
  );

  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
      {/* Asset PNGs have transparent background (alpha = 0) and white strokes;
          this filter preserves alpha (A_out = A_in) and sets RGB to the active theme ink. */}
      <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
        <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0`} />
      </filter>
      {reveal === "wipe" && (
        <clipPath id={clipId}>
          <rect x={left + w * (1 - p)} y={top - 4} width={w * p + 4} height={h + 8} />
        </clipPath>
      )}
      <g clipPath={reveal === "wipe" ? `url(#${clipId})` : undefined}>{body}</g>
    </g>
  );
};
