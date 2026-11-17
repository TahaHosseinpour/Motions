// Background removal & white-stroke normalizer for ink-dot doodle assets.
//
// Converts any input image (white bg + black lines, black bg + white lines, or
// existing transparent PNG) into a clean 1024×1024 RGBA PNG with:
//   - 100% transparent background (alpha = 0)
//   - Warm white strokes (#F4F1EA = rgb(244, 241, 234)) matching ink-dot dark theme
//   - Auto-trimmed & centered subject with generous margin so it never looks bloated
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const INK_R = 248;
const INK_G = 250;
const INK_B = 252;

// CRC32 table for PNG chunk writing
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function encodeRgbaPng(width, height, rgba, customTag = "ink-dot-nobg-v1") {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA (colorType 6)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type 0 (None)
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }
  const idat = deflateSync(raw, { level: 6 });
  const textData = Buffer.from(`Software\0${customTag}`, "ascii");
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("tEXt", textData),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function readDimensions(filePath) {
  const buf = readFileSync(filePath);
  // Check PNG signature + IHDR
  if (
    buf.length > 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const alreadyCleaned = buf.includes(Buffer.from("Software\0ink-dot-nobg-v1", "ascii"));
    return { w, h, alreadyCleaned };
  }
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", filePath],
    { encoding: "utf8" },
  );
  const m = String(probe.stdout ?? "").trim().match(/^(\d+)x(\d+)/);
  if (!m) throw new Error(`Cannot read dimensions of ${filePath}`);
  return { w: Number(m[1]), h: Number(m[2]), alreadyCleaned: false };
}

function decodeToRgba(filePath, w, h) {
  const res = spawnSync(
    "ffmpeg",
    ["-v", "error", "-i", filePath, "-f", "rawvideo", "-pix_fmt", "rgba", "-frames:v", "1", "pipe:1"],
    { maxBuffer: w * h * 4 + 1024 * 1024 },
  );
  if (res.status !== 0 || !res.stdout || res.stdout.length < w * h * 4) {
    throw new Error(`ffmpeg decode failed for ${filePath}: ${String(res.stderr ?? "")}`);
  }
  return res.stdout.subarray(0, w * h * 4);
}

/**
 * Clean a single PNG file in-place:
 *  - strips white or black background to alpha = 0
 *  - sets stroke color to warm white (#F4F1EA)
 *  - trims and centers into targetSize × targetSize with generous padding
 */
export function cleanAssetPng(filePath, { force = false, targetSize = 1024 } = {}) {
  if (!existsSync(filePath)) return { skipped: true, reason: "missing" };
  const { w, h, alreadyCleaned } = readDimensions(filePath);
  if (alreadyCleaned && !force) return { skipped: true, reason: "already-cleaned" };

  const src = decodeToRgba(filePath, w, h);

  // Sample border pixels (outer 2px ring) to detect background mode
  let borderCount = 0;
  let alphaSum = 0;
  let lumSum = 0;
  const samplePixel = (x, y) => {
    const idx = (y * w + x) * 4;
    const r = src[idx];
    const g = src[idx + 1];
    const b = src[idx + 2];
    const a = src[idx + 3];
    alphaSum += a;
    lumSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    borderCount++;
  };
  for (let x = 0; x < w; x++) {
    samplePixel(x, 0);
    samplePixel(x, Math.min(h - 1, 1));
    samplePixel(x, Math.max(0, h - 2));
    samplePixel(x, h - 1);
  }
  for (let y = 2; y < h - 2; y++) {
    samplePixel(0, y);
    samplePixel(Math.min(w - 1, 1), y);
    samplePixel(Math.max(0, w - 2), y);
    samplePixel(w - 1, y);
  }

  const avgAlpha = alphaSum / Math.max(1, borderCount);
  const avgLum = lumSum / Math.max(1, borderCount);

  // Mode: "transparent" | "light-bg" | "dark-bg"
  const mode = avgAlpha < 30 ? "transparent" : avgLum > 128 ? "light-bg" : "dark-bg";

  // Extract stroke alpha mask (0..255) for each pixel
  const alphaMask = new Uint8Array(w * h);
  let minX = w,
    minY = h,
    maxX = -1,
    maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const idx = i * 4;
      const r = src[idx];
      const g = src[idx + 1];
      const b = src[idx + 2];
      const a = src[idx + 3];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      let outA = 0;
      if (mode === "transparent") {
        outA = a < 24 ? 0 : Math.min(255, Math.round(((a - 24) / 200) * 255));
      } else if (mode === "light-bg") {
        // White/off-white background (>= 215) -> 0; dark marker lines -> 255
        if (a > 16 && lum < 215) {
          const strength = Math.min(1, Math.max(0, (215 - lum) / 150));
          outA = Math.round(strength * (a / 255) * 255);
        }
      } else {
        // Dark/black background (<= 40) -> 0; white marker lines -> 255
        if (a > 16 && lum > 40) {
          const strength = Math.min(1, Math.max(0, (lum - 40) / 150));
          outA = Math.round(strength * (a / 255) * 255);
        }
      }

      if (outA < 12) outA = 0;
      alphaMask[i] = outA;

      if (outA >= 28) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const out = Buffer.alloc(targetSize * targetSize * 4, 0);

  if (maxX >= minX && maxY >= minY) {
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    // Fit bounding box into 78% of targetSize so there is always at least 11% clean padding on every side
    const maxDim = Math.round(targetSize * 0.78);
    const scale = Math.min(maxDim / bw, maxDim / bh);
    const dstW = Math.max(1, Math.round(bw * scale));
    const dstH = Math.max(1, Math.round(bh * scale));
    const offsetX = Math.round((targetSize - dstW) / 2);
    const offsetY = Math.round((targetSize - dstH) / 2);

    // Bilinear resampling of the alpha mask onto the centered target canvas
    for (let dy = 0; dy < dstH; dy++) {
      const sy = minY + (dy + 0.5) / scale - 0.5;
      const y0 = Math.max(minY, Math.min(maxY, Math.floor(sy)));
      const y1 = Math.max(minY, Math.min(maxY, y0 + 1));
      const fy = Math.max(0, sy - y0);

      for (let dx = 0; dx < dstW; dx++) {
        const sx = minX + (dx + 0.5) / scale - 0.5;
        const x0 = Math.max(minX, Math.min(maxX, Math.floor(sx)));
        const x1 = Math.max(minX, Math.min(maxX, x0 + 1));
        const fx = Math.max(0, sx - x0);

        const a00 = alphaMask[y0 * w + x0];
        const a10 = alphaMask[y0 * w + x1];
        const a01 = alphaMask[y1 * w + x0];
        const a11 = alphaMask[y1 * w + x1];

        const aTop = a00 + (a10 - a00) * fx;
        const aBot = a01 + (a11 - a01) * fx;
        const aVal = Math.round(aTop + (aBot - aTop) * fy);

        if (aVal > 8) {
          const outIdx = ((offsetY + dy) * targetSize + (offsetX + dx)) * 4;
          out[outIdx] = INK_R;
          out[outIdx + 1] = INK_G;
          out[outIdx + 2] = INK_B;
          out[outIdx + 3] = Math.min(255, aVal);
        }
      }
    }
  }

  writeFileSync(filePath, encodeRgbaPng(targetSize, targetSize, out));
  return { skipped: false, mode, bbox: [minX, minY, maxX, maxY] };
}

/**
 * Clean all asset PNGs in outputs/<project>/assets/ (skipping _reference.png).
 */
export function cleanProjectAssets(assetsDir, opts = {}) {
  if (!existsSync(assetsDir)) return [];
  const files = readdirSync(assetsDir).filter((f) => f.endsWith(".png") && !f.startsWith("_"));
  return files.map((f) => {
    const full = join(assetsDir, f);
    return { file: f, ...cleanAssetPng(full, opts) };
  });
}
