import React from "react";
import { Composition } from "remotion";
import { STYLES } from "./styles";
import { FPS, FRAME_SIZE, Story, formatOf, normalizeStory, storyFrames } from "./types";

export const Root: React.FC = () => (
  <>
    {STYLES.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        fps={FPS}
        {...FRAME_SIZE[formatOf(s.example)]}
        durationInFrames={storyFrames(normalizeStory(s.example))}
        defaultProps={s.example}
        calculateMetadata={({ props }) => {
          const story = normalizeStory(props as Story);
          // Output size follows story.format (portrait 9:16 / landscape 16:9).
          return { durationInFrames: storyFrames(story), props: story, ...FRAME_SIZE[formatOf(story)] };
        }}
      />
    ))}
  </>
);
