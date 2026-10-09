/**
 * Generate 1200x630 OG images for each blog post.
 *
 * Usage (dev, to pre-generate static files):
 *   node scripts/generate-og-images.mjs
 *   node scripts/generate-og-images.mjs --out public/blog-og
 *
 * Usage (post-build, to add to dist):
 *   node scripts/generate-og-images.mjs --out dist/blog-og
 *
 * Uses @resvg/resvg-js — Wasm-based, no native compile step required.
 */

import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const outFlagIdx = args.indexOf("--out");
const outDir = outFlagIdx !== -1
  ? join(process.cwd(), args[outFlagIdx + 1])
  : join(__dirname, "../public/blog-og");

mkdirSync(outDir, { recursive: true });

// Read blog post data directly from source — no build step required
// We parse the TS file as text and extract slug/title/description/topic
// using a simple regex approach rather than compiling TypeScript.
import { readFileSync } from "fs";
const blogPostsTs = readFileSync(join(__dirname, "../src/lib/blog-posts.ts"), "utf8");

// Extract blog post data by parsing slug, title, description, and topic fields
function extractPosts(src) {
  const posts = [];
  // Find each object starting with 'slug:'
  const slugRegex = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = slugRegex.exec(src)) !== null) {
    const slug = m[1];
    const afterSlug = src.slice(m.index);

    // Extract title (next field after slug in the object)
    const titleMatch = afterSlug.match(/\btitle:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug;

    // Extract description
    const descMatch = afterSlug.match(/\bdescription:\s*"([^"]+)"/);
    const description = descMatch ? descMatch[1] : "";

    // Extract topic
    const topicMatch = afterSlug.match(/\btopic:\s*"([^"]+)"/);
    const topic = topicMatch ? topicMatch[1] : "voice";

    posts.push({ slug, title, description, topic });
  }
  return posts;
}

const BLOG_POSTS = extractPosts(blogPostsTs);

const TOPIC_LABELS = {
  voice: "Voice Journaling",
  prompts: "Prompts & Practice",
  reflect: "Reflection",
  privacy: "Privacy",
};

function escXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function buildSVG(post) {
  const W = 1200;
  const H = 630;
  const topic = TOPIC_LABELS[post.topic] ?? post.topic;

  const rawTitleLines = wrap(post.title, 28);
  const titleLines = rawTitleLines.slice(0, 3);
  if (rawTitleLines.length > 3) {
    titleLines[2] = titleLines[2].replace(/\s+\S+$/, "") + "…";
  }

  const rawDescLines = wrap(post.description ?? "", 55);
  const descLines = rawDescLines.slice(0, 2);

  const TITLE_Y_START = 248;
  const TITLE_LINE_H = 72;
  const DESC_Y_START = TITLE_Y_START + titleLines.length * TITLE_LINE_H + 28;

  const titleSVG = titleLines
    .map(
      (line, i) =>
        `<text x="88" y="${TITLE_Y_START + i * TITLE_LINE_H}" font-family="Georgia,serif" font-style="italic" font-size="58" fill="#0F1A2C" letter-spacing="-0.8">${escXml(line)}</text>`
    )
    .join("\n  ");

  const descSVG = descLines
    .map(
      (line, i) =>
        `<text x="88" y="${DESC_Y_START + i * 30}" font-family="system-ui,-apple-system,sans-serif" font-size="19" fill="#6B5244" font-weight="400">${escXml(line)}</text>`
    )
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bg" cx="72%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#F2E8DA"/>
      <stop offset="100%" stop-color="#FFF6E9"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <circle cx="990" cy="315" r="310" fill="none" stroke="#BF6040" stroke-width="0.8" opacity="0.07"/>
  <circle cx="990" cy="315" r="248" fill="none" stroke="#BF6040" stroke-width="0.9" opacity="0.11"/>
  <circle cx="990" cy="315" r="192" fill="none" stroke="#BF6040" stroke-width="1.1" opacity="0.16"/>
  <circle cx="990" cy="315" r="142" fill="none" stroke="#BF6040" stroke-width="1.4" opacity="0.24"/>
  <circle cx="990" cy="315" r="98"  fill="none" stroke="#BF6040" stroke-width="1.8" opacity="0.36"/>
  <circle cx="990" cy="315" r="60"  fill="none" stroke="#BF6040" stroke-width="2.2" opacity="0.50"/>
  <circle cx="990" cy="315" r="28"  fill="#BF6040" opacity="0.18"/>
  <circle cx="990" cy="315" r="14"  fill="#BF6040" opacity="0.85"/>

  <g transform="translate(920,448)" opacity="0.65">
    <rect x="0"   y="18" width="6" height="8"  rx="3" fill="#BF6040" opacity="0.35"/>
    <rect x="12"  y="11" width="6" height="15" rx="3" fill="#BF6040" opacity="0.50"/>
    <rect x="24"  y="4"  width="6" height="22" rx="3" fill="#BF6040" opacity="0.65"/>
    <rect x="36"  y="0"  width="6" height="26" rx="3" fill="#BF6040" opacity="0.80"/>
    <rect x="48"  y="6"  width="6" height="20" rx="3" fill="#BF6040" opacity="0.65"/>
    <rect x="60"  y="13" width="6" height="13" rx="3" fill="#BF6040" opacity="0.52"/>
    <rect x="72"  y="7"  width="6" height="19" rx="3" fill="#BF6040" opacity="0.60"/>
    <rect x="84"  y="2"  width="6" height="24" rx="3" fill="#BF6040" opacity="0.72"/>
    <rect x="96"  y="9"  width="6" height="17" rx="3" fill="#BF6040" opacity="0.58"/>
    <rect x="108" y="16" width="6" height="10" rx="3" fill="#BF6040" opacity="0.42"/>
  </g>

  <line x1="88" y1="112" x2="148" y2="112" stroke="#BF6040" stroke-width="2.5" opacity="0.70"/>
  <text x="88" y="148" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="#BF6040" letter-spacing="0.2em" font-weight="700">${escXml(topic.toUpperCase())}</text>

  ${titleSVG}
  ${descSVG}

  <rect x="0" y="${H - 72}" width="${W}" height="72" fill="#0F1A2C" opacity="0.96"/>
  <text x="88" y="${H - 34}" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#FFF6E9" font-weight="700" letter-spacing="0.08em">ÉCHO</text>
  <text x="88" y="${H - 14}" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="#D8D2C8" letter-spacing="0.02em">echobyreaclyse.com · A little space to hear yourself.</text>
</svg>`;
}

let count = 0;
for (const post of BLOG_POSTS) {
  try {
    const svg = buildSVG(post);
    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    const png = resvg.render().asPng();
    writeFileSync(join(outDir, `${post.slug}.png`), png);
    count++;
    console.log(`[og-images] ${post.slug}.png`);
  } catch (err) {
    console.error(`[og-images] Error on "${post.slug}": ${err.message}`);
  }
}

console.log(`[og-images] Done — ${count} / ${BLOG_POSTS.length} images generated to ${outDir}`);
