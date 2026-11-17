#!/usr/bin/env node
// Render a project: outputs/<project>/story.json  →  outputs/<project>/<project>.mp4
//
//   npm run render -- inflation
//   npm run render -- inflation --still 40      (single PNG frame for a quick check)
//   npm run render -- inflation --format landscape --font iran-yekan --theme light
//
// --format / --font / --theme override story.json for this render only (no file edits).
// Output: <project>.mp4 (portrait) or <project>-landscape.mp4; extra suffix for a non-default font/theme flag.
//
// The project folder is used as Remotion's public dir, so story.audio
// (e.g. "voice.mp3") is resolved relative to the project folder.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { cleanProjectAssets } from "./lib/nobg.mjs";

const [project, ...rest] = process.argv.slice(2);
if (!project) {
  console.error("usage: npm run render -- <project> [--still <frame>] [--format portrait|landscape] [--font <id>] [--theme <id>]");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const dir = join(root, "outputs", project);
const storyPath = join(dir, "story.json");
if (!existsSync(storyPath)) {
  console.error(`missing ${storyPath}`);
  process.exit(1);
}
const story = JSON.parse(readFileSync(storyPath, "utf8"));

const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
const overrides = { format: flag("format"), font: flag("font"), captionFont: flag("caption-font"), theme: flag("theme"), bgm: flag("bgm") };
if (flag("bgm-volume")) story.bgmVolume = Number(flag("bgm-volume"));
if (overrides.format && !["portrait", "landscape"].includes(overrides.format)) {
  console.error(`--format must be portrait or landscape (got "${overrides.format}")`);
  process.exit(1);
}
for (const [k, v] of Object.entries(overrides)) if (v) story[k] = v;
const suffix = [
  story.format === "landscape" ? "landscape" : null,
  overrides.font ?? null,
  overrides.captionFont ?? null,
  overrides.theme ?? null,
  overrides.bgm ? "bgm" : null,
].filter(Boolean).map((x) => `-${x}`).join("");

// Ensure any generated images in outputs/<project>/assets/<id>.png have transparent background + white strokes.
const assetsDir = join(dir, "assets");
cleanProjectAssets(assetsDir);
story.availableAssets = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith(".png") && !f.startsWith("_")).map((f) => f.slice(0, -4))
  : [];
const propsPath = join(tmpdir(), `motions-props-${project}.json`);
writeFileSync(propsPath, JSON.stringify(story), "utf8");

const stillIdx = rest.indexOf("--still");
const isStill = stillIdx >= 0;
const frame = isStill ? rest[stillIdx + 1] ?? "0" : null;
const out = isStill ? join(dir, `still-${frame}${suffix}.png`) : join(dir, `${project}${suffix}.mp4`);

const args = [
  "remotion",
  isStill ? "still" : "render",
  "core/index.ts",
  story.style,
  out,
  `--props=${propsPath}`,
  `--public-dir=${dir}`,
  ...(isStill ? [`--frame=${frame}`] : ["--codec=h264", "--crf=18"]),
];

console.log(`▶ ${story.title}  [style: ${story.style} · ${story.format ?? "portrait"} · font: ${story.font ?? "default"} · theme: ${story.theme ?? "default"}]  →  ${out}`);
if (story.availableAssets.length) console.log(`  assets: ${story.availableAssets.join(", ")}`);
const r = spawnSync("npx", args, { cwd: root, stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
