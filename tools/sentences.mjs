#!/usr/bin/env node
// Re-group an existing transcript into sentences (no API call) and refresh story.draft.json.
//
//   npm run sentences -- <project> [--pause 0.6] [--max-words 8]
//
// Also re-applies tools/glossary.json + outputs/<project>/corrections.json (spelling fixes).
// Tune --pause up if sentences are too chopped, down if they run together.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { draftStory, makeSentences } from "./lib/sentences.mjs";
import { applyCorrections, loadCorrections } from "./lib/corrections.mjs";

const root = resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);
const flag = (n, d) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : d);
const project = argv[0];
const dir = join(root, "outputs", project ?? "");
const tPath = join(dir, "transcript.json");
if (!project || !existsSync(tPath)) {
  console.error("usage: npm run sentences -- <project> [--pause 0.6] [--max-words 8]   (needs outputs/<project>/transcript.json)");
  process.exit(1);
}

const t = JSON.parse(readFileSync(tPath, "utf8"));
const params = { pause: Number(flag("pause", t.params?.pause ?? 0.45)), maxWords: Number(flag("max-words", t.params?.maxWords ?? 9)) };
t.params = params;
if (existsSync(join(dir, "transcript.raw.json"))) {
  const raw = JSON.parse(readFileSync(join(dir, "transcript.raw.json"), "utf8"));
  t.text = raw.text;
  t.segments = (raw.segments ?? []).map((s) => ({ start: s.start, end: s.end, text: s.text.trim() }));
}
t.sentences = makeSentences({ words: t.words ?? [], segments: t.segments ?? [] }, params);
applyCorrections(t, loadCorrections(root, dir));
writeFileSync(tPath, JSON.stringify(t, null, 2), "utf8");

const audio = ["voice.mp3", "voice.m4a", "voice.wav", "voice.ogg", "voice.webm"].find((f) => existsSync(join(dir, f)));
const draft = draftStory({ title: project, style: "ink-dot", audio, duration: t.duration, sentences: t.sentences });
writeFileSync(join(dir, "story.draft.json"), JSON.stringify(draft, null, 2), "utf8");

console.log(`✓ ${t.sentences.length} sentences (pause ≥ ${params.pause}s, max ${params.maxWords} words)`);
for (const s of t.sentences) console.log(`  [${s.start.toFixed(2)}–${s.end.toFixed(2)}] (+${s.pauseAfter ?? "-"}s) ${s.text}`);
