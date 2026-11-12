// Fix Whisper misspellings: global glossary (tools/glossary.json) + per-project
// outputs/<project>/corrections.json. Both are { "wrong phrase": "right phrase" }.
// Applied to text, segments[].text and sentences[].text (word timings stay raw).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const load = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {});

export function loadCorrections(root, projectDir) {
  const merged = { ...load(join(root, "tools", "glossary.json")), ...(projectDir ? load(join(projectDir, "corrections.json")) : {}) };
  delete merged._comment;
  // longest phrases first so "ای آی پردک" beats "ای آی"
  return Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function correct(text, pairs) {
  let out = ` ${text} `;
  for (const [from, to] of pairs) {
    // whole-word match (Persian has no \b — use whitespace/punctuation boundaries)
    const re = new RegExp(`(?<=[\\s،,.!?؟«»"'()])${esc(from)}(?=[\\s،,.!?؟«»"'()])`, "g");
    out = out.replace(re, to);
  }
  return out.trim().replace(/\s+/g, " ");
}

export function applyCorrections(t, pairs) {
  if (!pairs.length) return t;
  t.text = correct(t.text ?? "", pairs);
  for (const s of t.segments ?? []) s.text = correct(s.text, pairs);
  for (const s of t.sentences ?? []) s.text = correct(s.text, pairs);
  t.corrected = true;
  return t;
}
