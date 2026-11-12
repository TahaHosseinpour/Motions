// Generated image assets (outputs/<project>/assets/<id>.png).
// tools/render.mjs injects `availableAssets` into the story; anything missing
// renders as a dashed placeholder so a reel can be previewed before images exist.
import React, { createContext, useContext } from "react";
import { staticFile } from "remotion";

export const AssetsContext = createContext<string[]>([]);

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
  /** placeholder colors */
  ink?: string;
  font?: string;
}> = ({ id, x, y, w, h, p = 1, reveal = "wipe", ink = "#151515", font = "sans-serif" }) => {
  const available = useContext(AssetsContext);
  const has = available.includes(id);
  const clipId = `asset-clip-${id}`;
  const left = x - w / 2;
  const top = y - h / 2;
  const scale = reveal === "pop" ? p : 1;
  const opacity = reveal === "fade" ? p : reveal === "pop" ? Math.min(1, p * 2) : 1;

  const body = has ? (
    <image
      href={staticFile(`assets/${id}.png`)}
      x={left}
      y={top}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      filter="url(#asset-white-to-alpha)"
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
      {/* Line art on white → white becomes transparent (alpha = A − luminance), so it sits on any paper.
          Using A (not 1) keeps already-transparent pixels/edges transparent. */}
      <filter id="asset-white-to-alpha" colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.2126 -0.7152 -0.0722 1 0" />
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
