#!/usr/bin/env node
// Transcribe a voice-over through the Whisper API (AvalAI / OpenAI-compatible — no local model).
//
//   npm run transcribe -- inputs/voice.mp3 --project inflation [--lang fa] [--pause 0.45] [--max-words 10]
//   npm run transcribe -- inputs/voice.mp3                       (no project: writes inputs/voice.transcript.json)
//
// With --project <name> it writes into outputs/<name>/:
//   voice.mp3              the narration (copied / extracted from video) — used as story.audio
//   transcript.raw.json    untouched API response (never needs re-paying)
//   transcript.json        text + segments + words + sentences (pause-based)
//   story.draft.json       one beat per sentence, timed to the voice (scene: "TODO") — never overwrites story.json
//
// Spelling fixes: tools/glossary.json (global) + outputs/<project>/corrections.json, applied to text/segments/sentences.
// Re-group / re-correct later without calling the API:  npm run sentences -- <project> --pause 0.6
//
// .env:  OPENAI_API_KEY, OPENAI_BASE_URL (AvalAI: https://api.avalai.ir/v1), WHISPER_MODEL (whisper-1)
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { draftStory, makeSentences } from "./lib/sentences.mjs";
import { applyCorrections, loadCorrections } from "./lib/corrections.mjs";

const root = resolve(import.meta.dirname, "..");
if (existsSync(join(root, ".env"))) process.loadEnvFile(join(root, ".env"));

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : def;
};
const input = argv.find((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
if (!input) {
  console.error("usage: npm run transcribe -- <audio|video> [--project name] [--lang fa] [--pause 0.45] [--max-words 10]");
  process.exit(1);
}

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("OPENAI_API_KEY is not set (put it in .env — see .env.example)");
  process.exit(1);
}
const base = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
const model = process.env.WHISPER_MODEL ?? "whisper-1";
const lang = flag("lang", "fa");
const project = flag("project");
const params = { pause: Number(flag("pause", 0.45)), maxWords: Number(flag("max-words", 9)) };
const src = resolve(input);
if (!existsSync(src)) {
  console.error(`not found: ${src}`);
  process.exit(1);
}

const outDir = project ? join(root, "outputs", project) : join(root, "inputs");
mkdirSync(outDir, { recursive: true });
const stem = project ? "" : `${basename(src, extname(src))}.`;

const ffmpeg = (args) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) process.exit(1);
};

// 1) Narration file for the reel (project mode): keep audio as-is, extract from video.
const audioExt = [".mp3", ".m4a", ".wav", ".ogg", ".webm"];
const isAudio = audioExt.includes(extname(src).toLowerCase());
let voiceName;
if (project) {
  voiceName = isAudio ? `voice${extname(src).toLowerCase()}` : "voice.mp3";
  const dst = join(outDir, voiceName);
  if (isAudio) copyFileSync(src, dst);
  else ffmpeg(["-i", src, "-vn", "-ac", "2", "-ar", "44100", "-b:a", "192k", dst]);
  console.log(`• narration → ${dst}`);
}

// 2) Small mono file for the API (25 MB limit).
let upload = src;
if (!isAudio || statSync(src).size > 24 * 1024 * 1024) {
  upload = join(tmpdir(), `whisper-${Date.now()}.mp3`);
  ffmpeg(["-i", src, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "48k", upload]);
}

// 3) Call Whisper.
const form = new FormData();
form.append("file", new Blob([readFileSync(upload)]), basename(upload));
form.append("model", model);
form.append("language", lang);
form.append("response_format", "verbose_json");
form.append("timestamp_granularities[]", "word");
form.append("timestamp_granularities[]", "segment");

console.log(`• ${base}/audio/transcriptions  (${model}, ${lang})`);
let res;
try {
  res = await fetch(`${base}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal: AbortSignal.timeout(180_000),
  });
} catch (e) {
  console.error(`✗ could not reach ${base} — ${e.cause?.code ?? e.message}`);
  console.error("  (AvalAI may be unreachable through a VPN — try with the VPN off / split-tunnel.)");
  process.exit(1);
}
if (!res.ok) {
  console.error(`✗ ${res.status} ${res.statusText}\n${await res.text()}`);
  process.exit(1);
}
const raw = await res.json();
writeFileSync(join(outDir, `${stem}transcript.raw.json`), JSON.stringify(raw, null, 2), "utf8");

// 4) Normalise + sentences.
const segments = (raw.segments ?? []).map((s) => ({ start: s.start, end: s.end, text: s.text.trim() }));
const words = (raw.words ?? []).map((w) => ({ start: w.start, end: w.end, word: w.word }));
const sentences = makeSentences({ words, segments }, params);
if (!words.length) console.warn("! no word timestamps in response — sentences fall back to Whisper segments");

const transcriptBase = {
  source: src,
  model,
  language: raw.language ?? lang,
  duration: raw.duration,
  text: raw.text,
  params,
  sentences,
  segments,
  words,
};
const transcript = applyCorrections(transcriptBase, loadCorrections(root, project ? outDir : null));
const tPath = join(outDir, `${stem}transcript.json`);
writeFileSync(tPath, JSON.stringify(transcript, null, 2), "utf8");
console.log(`✓ ${words.length} words, ${segments.length} segments, ${sentences.length} sentences → ${tPath}`);

if (project) {
  const draft = draftStory({ title: project, style: "ink-dot", audio: voiceName, duration: raw.duration, sentences });
  writeFileSync(join(outDir, "story.draft.json"), JSON.stringify(draft, null, 2), "utf8");
  console.log(`✓ story.draft.json — ${draft.beats.length} beats; pick scenes, then save as story.json`);
}
for (const s of sentences) console.log(`  [${s.start.toFixed(2)}–${s.end.toFixed(2)}] ${s.text}`);
