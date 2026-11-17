#!/usr/bin/env node
// Image-asset pipeline for a project.
//
//   npm run assets -- <project> prompts         write assets/PROMPTS.md (+ copy the reference sheet next to it)
//   npm run assets -- <project> check           strip backgrounds + convert strokes to white (#F4F1EA), then check & refresh PLAN.md
//   npm run assets -- <project> nobg            force background removal & white-stroke normalization on all assets/*.png
//   npm run assets -- <project> generate [id]   (optional) generate via image API — ALWAYS with the reference sheet attached
//
// Manifest: outputs/<project>/assets.json
//   { "assets": [ { "id": "shopper", "beat": 4, "subject": "...", "size": "1024x1024", "notes": "" } ] }
// Images go to: outputs/<project>/assets/<id>.png   (used in story.json scenes by id)
//
// Every asset image in outputs/<project>/assets/<id>.png is automatically processed by
// tools/lib/nobg.mjs so its background is 100% transparent (alpha = 0) and its strokes
// are warm white (#F4F1EA), ready to sit cleanly on the dark canvas.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { cleanAssetPng, cleanProjectAssets } from "./lib/nobg.mjs";

const root = resolve(import.meta.dirname, "..");
if (existsSync(join(root, ".env"))) process.loadEnvFile(join(root, ".env"));

const [project, cmd = "prompts", onlyId] = process.argv.slice(2);
if (!project) {
  console.error("usage: npm run assets -- <project> [prompts|check|nobg|generate [id]]");
  process.exit(1);
}

const dir = join(root, "outputs", project);
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const story = read(join(dir, "story.json"));
const manifestPath = join(dir, "assets.json");
if (!existsSync(manifestPath)) {
  console.error(`no ${manifestPath} — this project needs no generated assets.`);
  process.exit(0);
}
const manifest = read(manifestPath);
const styleDir = join(root, "styles", story.style);
const cfg = read(join(styleDir, "assets.config.json"));
const refSrc = join(styleDir, cfg.reference);
if (!existsSync(refSrc)) {
  console.error(`✗ reference sheet missing: ${refSrc}\n  Images must never be generated without it.`);
  process.exit(1);
}

const assetsDir = join(dir, "assets");
mkdirSync(assetsDir, { recursive: true });
const refName = `_reference${refSrc.slice(refSrc.lastIndexOf("."))}`;
copyFileSync(refSrc, join(assetsDir, refName));

const promptFor = (a) =>
  [cfg.stylePrompt, "", `Subject: ${a.subject}`, ...(a.notes ? [`Notes: ${a.notes}`] : [])].join("\n");
const fileFor = (a) => join(assetsDir, `${a.id}.${cfg.format ?? "png"}`);
const list = manifest.assets.filter((a) => !onlyId || a.id === onlyId);

// ── prompts ──────────────────────────────────────────────────────────────
if (cmd === "prompts") {
  const md = [
    `# Asset prompts — ${story.title}`,
    "",
    `Style: \`${story.style}\``,
    "",
    `> **Attach \`${refName}\` (in this folder) to EVERY generation.** It is the character sheet;`,
    "> the model must copy its line style. Do not generate from text alone.",
    ">",
    `> Save each result as \`assets/<id>.png\`, then run \`npm run assets -- ${project} check\`.`,
    "> `check` automatically removes the background (alpha = 0) and turns the lines warm white (`#F4F1EA`).",
    "",
    ...list.flatMap((a) => [
      `## \`${a.id}\`  ·  beat ${a.beat ?? "-"}  ·  ${a.size ?? cfg.defaultSize}`,
      "",
      `Attach: \`${refName}\`  →  save as: \`${basename(fileFor(a))}\``,
      "",
      "```text",
      promptFor(a),
      "```",
      "",
    ]),
  ].join("\n");
  writeFileSync(join(assetsDir, "PROMPTS.md"), md, "utf8");
  console.log(`✓ ${list.length} prompt(s) → ${join(assetsDir, "PROMPTS.md")}\n✓ reference sheet → ${join(assetsDir, refName)}`);
}

// ── nobg / check (+ refresh PLAN.md) ─────────────────────────────────────
if (cmd === "nobg" || cmd === "check" || cmd === "prompts") {
  const cleaned = cleanProjectAssets(assetsDir, { force: cmd === "nobg" });
  for (const c of cleaned) {
    if (!c.skipped) console.log(`✓ nobg + white ink (${c.mode}) → ${c.file}`);
  }
  const rows = manifest.assets.map((a) => ({ a, ok: existsSync(fileFor(a)) }));
  if (cmd === "check" || cmd === "nobg") {
    for (const { a, ok } of rows) console.log(`${ok ? "✓" : "✗"} ${a.id.padEnd(20)} beat ${a.beat ?? "-"}  ${ok ? "(transparent + white ink)" : "(missing)"}`);
  }
  const planPath = join(dir, "PLAN.md");
  if (existsSync(planPath)) {
    const table = [
      "<!-- assets:start (auto — npm run assets -- <project> check) -->",
      "| asset | بیت | وضعیت | چه چیزی |",
      "|---|---|---|---|",
      ...rows.map(({ a, ok }) => `| \`${a.id}\` | ${a.beat ?? "-"} | ${ok ? "✅ آماده (بدون بک‌گراند + خطوط سفید)" : "⏳ منتظر تصویر"} | ${a.subject} |`),
      "",
      `پرامپت‌ها: \`assets/PROMPTS.md\` — کاراکتر شیت: \`assets/${refName}\` (همیشه ضمیمه شود)`,
      "<!-- assets:end -->",
    ].join("\n");
    let plan = readFileSync(planPath, "utf8");
    const re = /<!-- assets:start[\s\S]*?<!-- assets:end -->/;
    plan = re.test(plan) ? plan.replace(re, table) : `${plan.trimEnd()}\n\n## Assets\n\n${table}\n`;
    writeFileSync(planPath, plan, "utf8");
    console.log("✓ PLAN.md asset table refreshed");
  }
}

// ── generate (optional, needs an image API) ──────────────────────────────
if (cmd === "generate") {
  const key = process.env.IMAGE_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("IMAGE_API_KEY / OPENAI_API_KEY not set. Use `prompts` and generate by hand instead.");
    process.exit(1);
  }
  const base = (process.env.IMAGE_BASE_URL ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.IMAGE_MODEL ?? "gpt-image-1";
  const ref = readFileSync(refSrc);
  for (const a of list) {
    if (existsSync(fileFor(a)) && !onlyId) {
      console.log(`• ${a.id}: exists, skipped`);
      continue;
    }
    // Image-edit endpoint = prompt + reference image(s). The sheet is ALWAYS attached.
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", promptFor(a));
    form.append("size", a.size ?? cfg.defaultSize);
    form.append("image[]", new Blob([ref], { type: "image/png" }), refName);
    console.log(`• ${a.id}: generating with ${model} (+ reference sheet)…`);
    const res = await fetch(`${base}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
    if (!res.ok) {
      console.error(`✗ ${a.id}: ${res.status} ${await res.text()}`);
      continue;
    }
    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      console.error(`✗ ${a.id}: no image in response`);
      continue;
    }
    writeFileSync(fileFor(a), Buffer.from(b64, "base64"));
    cleanAssetPng(fileFor(a), { force: true });
    console.log(`✓ ${a.id} → ${fileFor(a)} (transparent + white ink)`);
  }
}
