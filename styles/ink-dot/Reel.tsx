import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, mix, tween } from "../../core/anim";
import { AssetsContext } from "../../core/AssetImage";
import { Caption } from "../../core/Caption";
import { Paper } from "../../core/Paper";
import { Beat, FPS, Format, Story, beatFrames, formatOf, locateBeat, locatePage, normalizeStory } from "../../core/types";
import { SCENES } from "./scenes";
import { DotState, T, applyStory } from "./theme";

/**
 * Where the 1080×1920 scene canvas lands in each output format.
 *  - portrait: drawing scaled up around its center; captions above/below it.
 *  - landscape: drawing on the left, captions in a column on the right (RTL reading start),
 *    so they never collide; captionPos is ignored.
 * at = output point that the scene center (T.cx, T.cy) maps to.
 */
const LAYOUT: Record<Format, {
  at: [number, number];
  zoom: number;
  caption: (pos: "top" | "bottom" | undefined) => { x?: number; y: number };
  captionWidth: number;
}> = {
  portrait: {
    at: [540, 920],
    zoom: 1,
    caption: (pos) => ({ y: pos === "top" ? 430 : 1400 }),
    captionWidth: 900,
  },
  landscape: {
    at: [960, 410],
    zoom: 0.72,
    caption: () => ({ x: 960, y: 845 }),
    captionWidth: 1680,
  },
};

/** Frames over which the hero dot glides from the previous beat's last pose. */
const BLEND = 12;

const sceneOf = (id: string) => {
  const s = SCENES[id];
  if (!s) throw new Error(`ink-dot: unknown scene "${id}". Available: ${Object.keys(SCENES).join(", ")}`);
  return s;
};

/** Scene props + `_cues`: frame (beat-relative) where each caption page starts —
 *  lets a scene time its motion to the narration without hard-coding seconds. */
const propsOf = (b: Beat) => ({
  ...(b.props ?? {}),
  _cues: (b.captions ?? []).map((c) => Math.round(c.at * FPS)),
});

export const InkDotReel: React.FC<Story> = (raw) => {
  const story = normalizeStory(raw);
  applyStory(story);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = LAYOUT[formatOf(story)];
  const k = T.scale * L.zoom;
  const place = `translate(${L.at[0]} ${L.at[1]}) scale(${k}) translate(${-T.cx} ${-T.cy})`;
  const { index, local, dur } = locateBeat(story, frame);
  const beat = story.beats[index];
  const scene = sceneOf(beat.scene);
  const props = propsOf(beat);
  const page = locatePage(beat, local, dur);
  const isLast = index === story.beats.length - 1;

  // Hero dot: continuous across beats.
  let dot: DotState = scene.dot(local, dur, props);
  if (index > 0 && local < BLEND) {
    const prev = story.beats[index - 1];
    const pd = beatFrames(story, index - 1);
    const from = sceneOf(prev.scene).dot(pd - 1, pd, propsOf(prev));
    const t = tween(local, 0, BLEND, 0, 1, ease.inOut);
    dot = { x: mix(from.x, dot.x, t), y: mix(from.y, dot.y, t), r: mix(from.r, dot.r, t), o: dot.o };
  }

  const { Visual } = scene;
  return (
    <AssetsContext.Provider value={story.availableAssets ?? []}>
    <AbsoluteFill>
      <Paper color={T.paper} dark={T.dark} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute" }}>
        <g transform={place}>
          <Visual f={local} dur={dur} p={props} />
          <circle cx={dot.x} cy={dot.y} r={Math.max(0, dot.r)} fill={T.ink} opacity={dot.o ?? 1} />
        </g>
      </svg>
      {page && (
      <Caption
        key={`${index}-${page.index}`}
        text={page.page.text}
        f={page.local}
        dur={isLast && page.last ? page.dur + 100 : page.dur}
        {...L.caption(page.page.pos ?? beat.captionPos)}
        maxWidth={L.captionWidth}
        color={T.ink}
        fontFamily={T.font}
        fontSize={T.captionSize}
        fontWeight={T.captionWeight}
        highlight={T.highlight}
        markColor={T.markText}
      />
      )}
      {story.audio ? <Audio src={staticFile(story.audio)} /> : null}
      {story.bgm ? (
        <Audio
          src={staticFile(story.bgm)}
          volume={(story.bgmVolume ?? 0.045) * tween(frame, 0, 45) * tween(frame, (story.duration ?? 113.4) * FPS - 75, (story.duration ?? 113.4) * FPS, 1, 0)}
          loop
        />
      ) : null}
    </AbsoluteFill>
    </AssetsContext.Provider>
  );
};
