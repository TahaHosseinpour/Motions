import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Story, normalizeStory, storyFrames } from "../../core/types";
import { Frame } from "./Frame";

export const InkWideReel: React.FC<Story> = (story) => {
  const frame = useCurrentFrame();
  const total = storyFrames(normalizeStory(story));
  const base = story.bgmVolume ?? 0.15;
  return (
    <AbsoluteFill>
      <Frame story={story} frame={frame} />
      {story.audio ? <Audio src={staticFile(story.audio)} /> : null}
      {story.bgm ? (
        <Audio
          src={staticFile(story.bgm)}
          loop
          volume={(f) => base * Math.min(1, f / 45) * Math.max(0, Math.min(1, (total - f) / 75))}
        />
      ) : null}
    </AbsoluteFill>
  );
};