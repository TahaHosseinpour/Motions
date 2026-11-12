import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ease, mix, tween } from "../../core/anim";
import { AssetsContext } from "../../core/AssetImage";
import { Caption } from "../../core/Caption";
import { Paper } from "../../core/Paper";
import { Beat, FPS, HEIGHT, Story, WIDTH, beatFrames, locateBeat, locatePage, normalizeStory } from "../../core/types";
import { SCENES } from "./scenes";
import { DotState, T } from "./theme";

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
  const frame = useCurrentFrame();
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
      <Paper color={T.paper} />
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute" }}>
        <Visual f={local} dur={dur} p={props} />
        <circle cx={dot.x} cy={dot.y} r={Math.max(0, dot.r)} fill={T.ink} opacity={dot.o ?? 1} />
      </svg>
      {page && (
      <Caption
        key={`${index}-${page.index}`}
        text={page.page.text}
        f={page.local}
        dur={isLast && page.last ? page.dur + 100 : page.dur}
        y={(page.page.pos ?? beat.captionPos) === "top" ? T.captionTop : T.captionBottom}
        color={T.ink}
        fontFamily={T.font}
        fontSize={T.captionSize}
        fontWeight={400}
        highlight={T.highlight}
      />
      )}
      {story.audio ? <Audio src={staticFile(story.audio)} /> : null}
    </AbsoluteFill>
    </AssetsContext.Provider>
  );
};
