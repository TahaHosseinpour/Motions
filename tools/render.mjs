#!/usr/bin/env node
// Render a project: outputs/<project>/story.json  →  outputs/<project>/<project>.mp4
//
//   npm run render -- inflation
//   npm run render -- inflation --still 40      (single PNG frame for a quick check)
//
// The project folder is used as Remotion's public dir, so story.audio
// (e.g. "voice.mp3") is resolved relative to the project folder.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [project, ...rest] = process.argv.slice(2);
if (!project) {
  console.error("usage: npm run render -- <project> [--still <frame>]");
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

// Inject which generated images exist (outputs/<project>/assets/<id>.png); missing ones render as placeholders.
const assetsDir = join(dir, "assets");
story.availableAssets = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith(".png") && !f.startsWith("_")).map((f) => f.slice(0, -4))
  : [];
const propsPath = join(tmpdir(), `motions-props-${project}.json`);
writeFileSync(propsPath, JSON.stringify(story), "utf8");

const stillIdx = rest.indexOf("--still");
const isStill = stillIdx >= 0;
const frame = isStill ? rest[stillIdx + 1] ?? "0" : null;
const out = isStill ? join(dir, `still-${frame}.png`) : join(dir, `${project}.mp4`);

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

console.log(`▶ ${story.title}  [style: ${story.style}]  →  ${out}`);
if (story.availableAssets.length) console.log(`  assets: ${story.availableAssets.join(", ")}`);
const r = spawnSync("npx", args, { cwd: root, stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
