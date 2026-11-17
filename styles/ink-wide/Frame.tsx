// Pure frame renderer for ink-wide (used by Reel and tools/sheet.mjs).
import React from "react";
import { ease, mix, tween } from "../../core/anim";
import { AssetBaseContext, AssetsContext } from "../../core/AssetImage";
import { Caption } from "../../core/Caption";
import { Paper } from "../../core/Paper";
import { Beat, FPS, FRAME_SIZE, Story, beatFrames, formatOf, locateBeat, locatePage, normalizeStory, storyFrames } from "../../core/types";
import { SCENES } from "./scenes";
import { CamState, DotState, H, T, W, applyStory } from "./theme";
import { Txt } from "./kit";

const BLEND = 12;

/** Narrative acts → a small handwritten chapter chip at each act's opening. */
const ACTS = [
  { from: 0, label: "۱ · ارزشِ تازه" },
  { from: 3, label: "۲ · داستانِ امید" },
  { from: 9, label: "۳ · نیم ساعت فکر" },
  { from: 12, label: "۴ · آشپزخانه" },
  { from: 15, label: "۵ · روشِ کار" },
  { from: 21, label: "استارکوچ" },
];

const sceneOf = (id: string) => {
  const s = SCENES[id];
  if (!s) throw new Error(`ink-wide: unknown scene "${id}". Available: ${Object.keys(SCENES).join(", ")}`);
  return s;
};

const propsOf = (b: Beat) => ({
  ...(b.props ?? {}),
  _cues: (b.captions ?? []).map((c) => Math.round(c.at * FPS)),
  _pos: b.captionPos ?? "bottom",
});

const defaultCam = (f: number, dur: number): CamState => ({
  z: 1 + 0.03 * tween(f, 0, dur, 0, 1, ease.out),
  x: 6 * Math.sin(f * 0.02),
  y: 4 * Math.cos(f * 0.017),
});

export const Frame: React.FC<{ story: Story & { assetBaseUrl?: string }; frame: number }> = ({ story: raw, frame }) => {
  const story = normalizeStory(raw);
  applyStory(story);
  const fmt = formatOf(story);
  const { width, height } = FRAME_SIZE[fmt];
  const { index, local, dur } = locateBeat(story, frame);
  const beat = story.beats[index];
  const scene = sceneOf(beat.scene);
  const props = propsOf(beat);
  const page = locatePage(beat, local, dur);
  const isLast = index === story.beats.length - 1;
  const total = storyFrames(story);

  // Hero dot glides from the previous beat's final pose.
  let dot: DotState = scene.dot(local, dur, props);
  if (index > 0 && local < BLEND) {
    const prev = story.beats[index - 1];
    const pd = beatFrames(story, index - 1);
    const from = sceneOf(prev.scene).dot(pd - 1, pd, propsOf(prev));
    const t = tween(local, 0, BLEND, 0, 1, ease.inOut);
    dot = { x: mix(from.x, dot.x, t), y: mix(from.y, dot.y, t), r: mix(from.r, dot.r, t), o: dot.o };
  }

  // Camera: scene move + a soft settle on entry.
  const cam = (scene.cam ?? defaultCam)(local, dur, props);
  const settle = 1 - tween(local, 0, 10, 0, 1, ease.out);
  const z = (cam.z ?? 1) + 0.035 * settle;
  const panx = (cam.x ?? 0) + 10 * settle;
  const pany = cam.y ?? 0;
  const enter = tween(local, 0, 6, 0, 1, ease.out);

  // Landscape: scene coords == output coords. Portrait: letterbox the 16:9 stage up top.
  const stage = fmt === "landscape"
    ? `translate(${W / 2 + panx} ${H / 2 + pany}) scale(${z}) translate(${-W / 2} ${-H / 2})`
    : `translate(${width / 2 + panx * 0.56} ${560 + pany * 0.56}) scale(${0.5625 * z}) translate(${-W / 2} ${-H / 2})`;

  // Subtitles always sit below the visuals, centered (never top, never a side column).
  const capY = fmt === "landscape" ? 910 : 1430;
  const capW = fmt === "landscape" ? 1560 : 920;
  const capX = fmt === "landscape" ? W / 2 : undefined;
  const capSize = fmt === "landscape" ? T.captionSize : T.captionSize * 1.05;

  const act = [...ACTS].reverse().find((a) => index >= a.from)!;
  const chipO = index === act.from ? tween(local, 4, 14, 0, 0.62) * tween(local, 66, 80, 1, 0) : 0;
  const progress = frame / total;

  const { Visual } = scene;
  return (
    <AssetBaseContext.Provider value={raw.assetBaseUrl}>
      <AssetsContext.Provider value={story.availableAssets ?? []}>
        <div style={{ position: "absolute", left: 0, top: 0, width, height, overflow: "hidden", backgroundColor: T.paper }}>
          <Paper color={T.paper} dark={T.dark} />
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform={stage} opacity={enter}>
              <Visual f={local} dur={dur} p={props} />
              <circle cx={dot.x} cy={dot.y} r={Math.max(0, dot.r)} fill={T.ink} opacity={dot.o ?? 1} />
            </g>
            {chipO > 0.01 && fmt === "landscape" && (
              <g opacity={chipO}>
                <line x1={70} y1={92} x2={70 + 46} y2={92} {...{ stroke: T.highlight, strokeWidth: 4, strokeLinecap: "round" }} />
                <Txt x={130} y={104} size={34} anchor="start" color={T.inkSoft}>{act.label}</Txt>
              </g>
            )}
            {fmt === "landscape" && (
              <g opacity={0.22}>
                <line x1={0} y1={H - 4} x2={W} y2={H - 4} stroke={T.inkFaint} strokeWidth={3} />
                <line x1={0} y1={H - 4} x2={W * progress} y2={H - 4} stroke={T.ink} strokeWidth={3} />
              </g>
            )}
          </svg>
          {page && (
            <Caption
              key={`${index}-${page.index}`}
              text={page.page.text}
              f={page.local}
              dur={isLast && page.last ? page.dur + 100 : page.dur}
              x={capX}
              y={capY}
              maxWidth={capW}
              color={T.ink}
              fontFamily={T.captionFont}
              fontSize={capSize}
              fontWeight={T.captionWeight}
              highlight={T.highlight}
              markColor={T.markText}
            />
          )}
        </div>
      </AssetsContext.Provider>
    </AssetBaseContext.Provider>
  );
};