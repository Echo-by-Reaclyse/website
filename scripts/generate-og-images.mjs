/**
 * Convert per-article SVG blog covers to PNG for use as og:image.
 *
 * Social platforms (Facebook, X/Twitter, WhatsApp, iMessage) do not render
 * SVG og:images. This script runs after `vite build` and outputs one PNG per
 * article to dist/blog-og/<slug>.png, which prerender.mjs then references as
 * the og:image for each article route.
 *
 * Uses @resvg/resvg-js — a Wasm-based SVG renderer with no native compile step.
 * System fonts may not be available in the CI environment; text will fall back
 * to resvg's built-in font but the visual shapes and layout are preserved.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist");
const coversDir = join(__dirname, "../public/blog-covers");
const outDir = join(distDir, "blog-og");

mkdirSync(outDir, { recursive: true });

const BLOG_POSTS = JSON.parse(
  readFileSync(join(distDir, "blog-posts.json"), "utf8")
);

let count = 0;
for (const post of BLOG_POSTS) {
  const svgPath = join(coversDir, `${post.slug}.svg`);

  if (!existsSync(svgPath)) {
    console.warn(`[og-images] No SVG for "${post.slug}" — skipping.`);
    continue;
  }

  try {
    const svgData = readFileSync(svgPath, "utf8");
    const resvg = new Resvg(svgData, {
      fitTo: { mode: "width", value: 800 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    writeFileSync(join(outDir, `${post.slug}.png`), pngBuffer);
    count++;
    console.log(`[og-images] ${post.slug}.png`);
  } catch (err) {
    console.error(`[og-images] Error on "${post.slug}": ${err.message}`);
  }
}

console.log(`[og-images] Done — ${count} / ${BLOG_POSTS.length} images generated.`);
