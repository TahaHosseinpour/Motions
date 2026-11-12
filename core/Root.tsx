import React from "react";
import { Composition } from "remotion";
import { STYLES } from "./styles";
import { FPS, HEIGHT, Story, WIDTH, normalizeStory, storyFrames } from "./types";

export const Root: React.FC = () => (
  <>
    {STYLES.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={storyFrames(normalizeStory(s.example))}
        defaultProps={s.example}
        calculateMetadata={({ props }) => {
          const story = normalizeStory(props as Story);
          return { durationInFrames: storyFrames(story), props: story };
        }}
      />
    ))}
  </>
);
