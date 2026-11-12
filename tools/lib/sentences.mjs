// Group Whisper word timestamps into sentences using pauses.
//
// Rules:
//  1. A silence >= `pause` seconds between two words starts a new sentence.
//  2. A word ending in . ! ? ؟ … also ends a sentence (if Whisper kept punctuation).
//  3. Sentences longer than `maxWords` are split at their LONGEST internal gap
//     (recursively), never leaving a piece shorter than `minWords`.

const END_PUNCT = /[.!?؟…]$/;

export function groupSentences(words, { pause = 0.45, maxWords = 10, minWords = 2 } = {}) {
  const clean = words
    .map((w) => ({ ...w, word: String(w.word).trim() }))
    .filter((w) => w.word.length > 0);

  // pass 1: pauses + punctuation
  const groups = [];
  let cur = [];
  clean.forEach((w, i) => {
    if (cur.length) {
      const gap = w.start - clean[i - 1].end;
      if (gap >= pause || END_PUNCT.test(clean[i - 1].word)) {
        groups.push(cur);
        cur = [];
      }
    }
    cur.push(w);
  });
  if (cur.length) groups.push(cur);

  // pass 2: split long groups at the biggest gap
  const split = (g) => {
    if (g.length <= maxWords) return [g];
    let best = -1;
    let bestGap = -Infinity;
    for (let i = minWords; i <= g.length - minWords; i++) {
      const gap = g[i].start - g[i - 1].end;
      if (gap > bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    if (best < 0) return [g];
    return [...split(g.slice(0, best)), ...split(g.slice(best))];
  };

  return groups.flatMap(split).map((g, i, all) => ({
    index: i,
    text: g.map((w) => w.word).join(" "),
    start: round(g[0].start),
    end: round(g[g.length - 1].end),
    /** silence after this sentence (s) */
    pauseAfter: i < all.length - 1 ? round(all[i + 1][0].start - g[g.length - 1].end) : null,
    words: g.map((w) => ({ word: w.word, start: round(w.start), end: round(w.end) })),
  }));
}

/**
 * Preferred for Persian: Whisper's word timestamps are nearly gap-less, so pauses
 * alone can't find sentence ends. Segments are good phrase units; long ones are
 * split before a conjunction near the middle (و، که، ولی، اما، وقتی، بعد، حالا، تا).
 * Text comes from the segment (keeps Whisper punctuation) when token counts match.
 */
const SPLIT_BEFORE = new Set(["و", "که", "ولی", "اما", "وقتی", "بعد", "حالا", "تا", "یا", "پس"]);

export function sentencesFromSegmentsAndWords(segments, words, { maxWords = 9, minWords = 3 } = {}) {
  const ws = words.map((w) => ({ ...w, word: String(w.word).trim() })).filter((w) => w.word);
  const out = [];
  let wi = 0;
  for (const seg of segments) {
    const mine = [];
    while (wi < ws.length && ws[wi].start < seg.end - 0.02) mine.push(ws[wi++]);
    if (!mine.length) continue;
    const segTokens = seg.text.trim().split(/\s+/);
    const tokens = segTokens.length === mine.length ? segTokens : mine.map((w) => w.word);
    const items = mine.map((w, i) => ({ ...w, word: tokens[i] }));

    const split = (g) => {
      if (g.length <= maxWords) return [g];
      const mid = g.length / 2;
      let best = -1;
      let bestScore = Infinity;
      for (let i = minWords; i <= g.length - minWords; i++) {
        const gap = g[i].start - g[i - 1].end;
        const score = Math.abs(i - mid) - (SPLIT_BEFORE.has(g[i].word) ? 3 : 0) - gap * 10;
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      }
      if (best < 0) return [g];
      return [...split(g.slice(0, best)), ...split(g.slice(best))];
    };
    out.push(...split(items));
  }
  return out.map((g, i, all) => ({
    index: i,
    text: g.map((w) => w.word).join(" "),
    start: round(g[0].start),
    end: round(g[g.length - 1].end),
    pauseAfter: i < all.length - 1 ? round(all[i + 1][0].start - g[g.length - 1].end) : null,
    words: g.map((w) => ({ word: w.word, start: round(w.start), end: round(w.end) })),
  }));
}

/** Pick the best method for the data we have. */
export function makeSentences({ words = [], segments = [] }, params = {}) {
  if (words.length && segments.length) return sentencesFromSegmentsAndWords(segments, words, params);
  if (words.length) return groupSentences(words, params);
  return sentencesFromSegments(segments);
}

/** Fallback when the API returns no word timestamps: use segments as sentences. */
export function sentencesFromSegments(segments) {
  return segments.map((s, i, all) => ({
    index: i,
    text: s.text.trim(),
    start: round(s.start),
    end: round(s.end),
    pauseAfter: i < all.length - 1 ? round(all[i + 1].start - s.end) : null,
    words: [],
  }));
}

/**
 * Draft story: one beat per sentence. A beat runs from its sentence start to the
 * next sentence start (so the pause belongs to the beat that just spoke); the
 * first beat also covers any leading silence. Beat lengths sum to the audio length.
 */
export function draftStory({ title, style, audio, duration, sentences }) {
  const beats = sentences.map((s, i) => {
    const from = i === 0 ? 0 : s.start;
    const to = i < sentences.length - 1 ? sentences[i + 1].start : Math.max(duration ?? s.end, s.end) + 0.4;
    return {
      scene: "TODO",
      seconds: round(to - from),
      captionPos: i % 2 ? "top" : "bottom",
      caption: s.text,
      _spoken: [s.start, s.end],
    };
  });
  return { title, style, audio, beats };
}

const round = (n) => Math.round(n * 100) / 100;
