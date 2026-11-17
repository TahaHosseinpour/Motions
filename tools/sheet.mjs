#!/usr/bin/env node
// Instant contact sheet of a story — NO Remotion render (≈2 s instead of minutes).
// Works for styles that export a pure `Frame` component ({ story, frame }) from styles/<style>/Frame.tsx.
//
//   npm run sheet -- <project> --at 1.5,3.2,8          frames at these seconds
//   npm run sheet -- <project> --frames 0,45,90        …or at these frame numbers
//   npm run sheet -- <project> --beat 3 [--n 6]        n frames spread over beat 3 (0-based)
//   npm run sheet -- <project> --every 4               one frame every 4 s over the whole film
//   options: --format portrait|landscape  --font <id>  --cols 4  --scale 0.4  --out <file.png>
//   <project> may also be a path to any story .json (e.g. styles/<style>/example.story.json)
//
// Output: outputs/<project>/sheet.png (or --out). The frame's markup is rendered with react-dom/server
// and photographed once by the headless Chrome that ships with Remotion.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { cleanProjectAssets } from "./lib/nobg.mjs";

const root = resolve(import.meta.dirname, "..");
const [target, ...rest] = process.argv.slice(2);
if (!target) {
  console.error("usage: npm run sheet -- <project|story.json> [--at s,s | --frames f,f | --beat i [--n 6] | --every s] [--format ..] [--cols 4] [--scale 0.4] [--out file.png]");
  process.exit(1);
}
const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
const isFile = target.endsWith(".json");
const storyPath = isFile ? resolve(target) : join(root, "outputs", target, "story.json");
if (!existsSync(storyPath)) {
  console.error(`missing ${storyPath}`);
  process.exit(1);
}
const story = JSON.parse(readFileSync(storyPath, "utf8"));
for (const k of ["format", "font", "theme"]) if (flag(k)) story[k] = flag(k);
const assetsDir = join(dirname(storyPath), "assets");
cleanProjectAssets(assetsDir);
story.assetBaseUrl = pathToFileURL(assetsDir).href;
story.availableAssets = existsSync(assetsDir) ? readdirSync(assetsDir).filter((f) => f.endsWith(".png") && !f.startsWith("_")).map((f) => f.slice(0, -4)) : [];

const FPS = 30;
const [W, H] = story.format === "landscape" ? [1920, 1080] : [1080, 1920];

// beat boundaries (same maths as core/types.ts)
const starts = [];
{
  let t = 0;
  story.beats.forEach((b, i) => {
    const from = story.timing === "absolute" ? b.from ?? 0 : t;
    const to = story.timing === "absolute" ? (i < story.beats.length - 1 ? story.beats[i + 1].from : story.duration ?? from + 3) : t + (b.seconds ?? 0);
    starts.push([from, to]);
    t = to;
  });
}
const total = starts.length ? starts[starts.length - 1][1] : 1;

let frames;
if (flag("frames")) frames = flag("frames").split(",").map(Number);
else if (flag("at")) frames = flag("at").split(",").map((s) => Math.round(Number(s) * FPS));
else if (flag("beat") !== undefined) {
  const [a, b] = starts[Number(flag("beat"))];
  const n = Number(flag("n") ?? 6);
  frames = Array.from({ length: n }, (_, i) => Math.round((a + ((b - a) * (i + 0.5)) / n) * FPS));
} else {
  const step = Number(flag("every") ?? Math.max(1, total / 12));
  frames = [];
  for (let s = step / 2; s < total; s += step) frames.push(Math.round(s * FPS));
}

const tmp = join(tmpdir(), "motions-sheet");
mkdirSync(tmp, { recursive: true });
const bundle = join(tmp, `frame-${story.style}.cjs`);
await build({
  stdin: {
    contents: `import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Frame } from "./styles/${story.style}/Frame";
export const render = (story, frame) => renderToStaticMarkup(React.createElement(Frame, { story, frame }));`,
    resolveDir: root,
    loader: "tsx",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: bundle,
  jsx: "automatic",
  loader: { ".ttf": "empty", ".otf": "empty", ".png": "empty" },
  logLevel: "error",
});
const { render } = createRequire(import.meta.url)(bundle);

const cols = Number(flag("cols") ?? Math.min(frames.length, story.format === "landscape" ? 3 : 5));
const scale = Number(flag("scale") ?? (story.format === "landscape" ? 0.4 : 0.36));
const rows = Math.ceil(frames.length / cols);
const cw = Math.round(W * scale);
const ch = Math.round(H * scale);
const gap = 6;
const fontDir = pathToFileURL(join(root, "assets", "fonts")).href;
const face = (family, file, weight) => `@font-face{font-family:${family};src:url("${fontDir}/${file}");font-weight:${weight};}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${face("IRANYekanX", "IRANYekanXFaNum-Regular.ttf", 400)}${face("IRANYekanX", "IRANYekanXFaNum-Medium.ttf", 500)}
${face("IRANYekanX", "IRANYekanXFaNum-DemiBold.ttf", 600)}${face("IRANYekanX", "IRANYekanXFaNum-Bold.ttf", 700)}
${face("DastNevis", "danstevis.otf", 400)}
html,body{margin:0;background:#1b1b1b;}
.grid{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px;padding:${gap}px;}
.cell{position:relative;width:${cw}px;height:${ch}px;overflow:hidden;}
.in{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform:scale(${scale});transform-origin:0 0;}
.tag{position:absolute;left:4px;top:4px;font:12px monospace;color:#fff;background:rgba(0,0,0,.6);padding:1px 5px;border-radius:4px;}
</style></head><body><div class="grid">
${frames
  .map((f) => `<div class="cell"><div class="in">${render(story, f)}</div><div class="tag">${(f / FPS).toFixed(2)}s · f${f}</div></div>`)
  .join("\n")}
</div></body></html>`;
const htmlPath = join(tmp, "sheet.html");
writeFileSync(htmlPath, html, "utf8");

// An installed Chrome / Edge (the headless shell bundled with Remotion hangs on --screenshot).
const chrome = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!chrome) {
  console.error("Chrome / Edge not found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}
const out = resolve(flag("out") ?? join(dirname(storyPath), "sheet.png"));
const r = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    `--user-data-dir=${join(tmp, "profile")}`,
    `--window-size=${cols * (cw + gap) + gap},${rows * (ch + gap) + gap}`,
    `--screenshot=${out}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: ["ignore", "ignore", "pipe"], timeout: 90000 },
);
if (r.status !== 0 || !existsSync(out)) {
  console.error(String(r.stderr ?? ""));
  process.exit(1);
}
console.log(`✓ ${frames.length} frame(s) → ${out}`);
