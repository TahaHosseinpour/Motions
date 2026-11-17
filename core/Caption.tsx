import React from "react";
import { ease, tween } from "./anim";
import { stripDiacritics } from "./text";

/** RTL caption with a soft word-by-word reveal. Splitting on spaces is safe
 *  for Persian (letters never join across a space).
 *
 *  Markup inside `text`:
 *    "\n"        forced line break
 *    *word*      yellow marker highlight (may span several words: *two words*)
 */
export const Caption: React.FC<{
  text: string;
  f: number;
  dur: number;
  y: number;
  color: string;
  fontFamily: string;
  fontSize?: number;
  fontWeight?: number;
  stagger?: number;
  highlight?: string;
  /** Text color of highlighted words (dark ink on the yellow marker, even on a dark theme). */
  markColor?: string;
  /** Horizontal center of the caption block (default: frame center). */
  x?: number;
  maxWidth?: number;
}> = ({
  text,
  f,
  dur,
  y,
  color,
  fontFamily,
  fontSize = 50,
  fontWeight = 500,
  stagger = 3,
  highlight = "#FFD84A",
  markColor,
  x,
  maxWidth = 820,
}) => {
  let n = 0;
  let inMark = false;
  const lines = stripDiacritics(text).split("\n").map((l) =>
    l
      .split(/\s+/)
      .filter(Boolean)
      .map((raw) => {
        const opens = /^«?\*/.test(raw);
        const closes = /\*[،.؟!»:؛)]*$/.test(raw);
        const w = raw.replace(/\*/g, "");
        if (opens) inMark = true;
        const mark = inMark;
        if (closes) inMark = false;
        return { w, i: n++, mark };
      }),
  );
  const out = tween(f, dur - 6, dur, 1, 0);
  const allIn = 12 + (n - 1) * stagger;

  return (
    <div
      style={{
        position: "absolute",
        left: x === undefined ? 0 : x - maxWidth / 2,
        ...(x === undefined ? { right: 0 } : { width: maxWidth }),
        top: y,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          direction: "rtl",
          textAlign: "center",
          maxWidth,
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight: 1.6,
          color,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map(({ w, i, mark }) => {
              const p = tween(f, 2 + i * stagger, 12 + i * stagger, 0, 1, ease.out);
              // marker sweeps right→left once the sentence is in
              const hp = mark ? tween(f, allIn + i * 2, allIn + i * 2 + 10, 0, 1, ease.out) : 0;
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      position: "relative",
                      isolation: "isolate",
                      opacity: p,
                      transform: `translateY(${(1 - p) * 14}px)`,
                      filter: `blur(${(1 - p) * 6}px)`,
                      color: mark && markColor && hp > 0.35 ? markColor : undefined,
                    }}
                  >
                    {mark && (
                      <span
                        style={{
                          position: "absolute",
                          zIndex: -1,
                          left: -10,
                          right: -10,
                          top: "8%",
                          bottom: "8%",
                          background: highlight,
                          borderRadius: 8,
                          transformOrigin: "right center",
                          transform: `scaleX(${hp}) rotate(-1.2deg)`,
                        }}
                      />
                    )}
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
