/**
 * Post-build prerender script.
 *
 * After `vite build`, this script generates route-specific index.html files
 * in dist/ so that each URL serves the correct <title>, <meta description>,
 * OG tags, and canonical link in the initial HTML response — without waiting
 * for React to hydrate. Vercel serves a static file that matches the request
 * path before falling back to the SPA rewrite, so this "wins" for crawlers
 * and social-preview bots that don't execute JS.
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist");

// ---------------------------------------------------------------------------
// Route manifest — title / description / ogTitle / ogDescription / url
// ---------------------------------------------------------------------------
const BASE = "https://www.echobyreaclyse.com";

const BLOG_POSTS = [
  {
    slug: "what-is-voice-journaling",
    title: "What Is Voice Journaling? A Beginner's Complete Guide",
    description:
      "Discover what voice journaling is, how it differs from traditional journaling, and why speaking your thoughts reveals more than writing them ever could.",
  },
  {
    slug: "voice-journaling-vs-writing",
    title: "Voice Journaling vs. Writing: Why Your Voice Reveals More Than Your Pen",
    description:
      "We write to look good. We speak to think. Here's why voice journaling consistently surfaces deeper truths than written journaling — and what the research says.",
  },
  {
    slug: "daily-reflection-questions",
    title: "5 Daily Reflection Questions That Actually Change How You Think",
    description:
      "Not all reflection prompts are equal. These five questions are designed to disrupt habitual thinking and surface the insights you're not looking for.",
  },
  {
    slug: "build-journaling-habit",
    title: "How to Build a Journaling Habit That Actually Sticks",
    description:
      "Most journaling habits fail in the first two weeks. Here's why — and what the research on habit formation says about making reflection a daily constant.",
  },
  {
    slug: "best-journaling-apps-iphone-2026",
    title: "Best Journaling Apps for iPhone in 2026",
    description:
      "A clear-eyed comparison of the top journaling apps available on iPhone in 2026: Day One, Reflectly, Rosebud, Journey, and ÉCHO — what each does well and who it's for.",
  },
];

const ROUTES = [
  // Inner pages
  {
    path: "about",
    title: "About · ÉCHO",
    description:
      "ÉCHO is a private voice journal for iPhone, built by RÉACLYSE in Luxembourg. Learn how we built a privacy-first journaling app for reflective adults across Europe.",
    ogTitle: "About · ÉCHO — Private Voice Journal",
    ogDescription:
      "ÉCHO is a private voice journal for iPhone, built by RÉACLYSE in Luxembourg.",
  },
  {
    path: "faq",
    title: "FAQ · ÉCHO",
    description:
      "Answers to common questions about ÉCHO: how it works, privacy, pricing, iCloud sync, Letters, and more.",
    ogTitle: "FAQ — ÉCHO Voice Journal",
    ogDescription:
      "Answers to common questions about ÉCHO: how it works, privacy, pricing, iCloud sync, Letters, and more.",
  },
  {
    path: "support",
    title: "Help & Support · ÉCHO",
    description:
      "Get help with ÉCHO, the private voice journal for iPhone. Questions about recordings, transcription, your subscription, data export, or your account? We respond within one business day.",
    ogTitle: "Help & Support — ÉCHO Voice Journal",
    ogDescription:
      "Get help with ÉCHO, the private voice journal for iPhone. We respond within one business day.",
  },
  {
    path: "contact",
    title: "Contact · ÉCHO",
    description:
      "Contact ÉCHO — general enquiries, press, partnerships, or GDPR data requests. We'd love to hear from you. hello@reaclyse.com.",
    ogTitle: "Contact · ÉCHO",
    ogDescription:
      "General enquiries, press, partnerships, or GDPR data requests. hello@reaclyse.com.",
  },
  {
    path: "find-support",
    title: "Find Support — ÉCHO",
    description:
      "Resources and guidance for finding mental health support. ÉCHO is a journaling app, not a crisis service.",
    ogTitle: "Find Support — ÉCHO",
    ogDescription:
      "Resources and guidance for finding mental health support.",
  },
  {
    path: "privacy",
    title: "Privacy Policy · ÉCHO",
    description:
      "ÉCHO privacy policy. Your voice recordings and transcripts are encrypted and never used to train AI models. GDPR-compliant. Built by RÉACLYSE, Luxembourg.",
    ogTitle: "Privacy Policy · ÉCHO",
    ogDescription:
      "Your voice recordings and transcripts are encrypted and never used to train AI models.",
  },
  {
    path: "terms",
    title: "Terms of Service · ÉCHO",
    description:
      "Terms of Service for the ÉCHO app and website, operated by ECHO by REACLYSE S.à r.l.-S, Luxembourg.",
    ogTitle: "Terms of Service · ÉCHO",
    ogDescription:
      "Terms of Service for the ÉCHO app and website, operated by ECHO by REACLYSE S.à r.l.-S.",
  },
  {
    path: "gdpr",
    title: "GDPR & Data Protection · ÉCHO",
    description:
      "ÉCHO's internal regulations on personal data management, in accordance with GDPR (EU) 2016/679.",
    ogTitle: "GDPR & Data Protection · ÉCHO",
    ogDescription:
      "How we collect, process, and protect your data. In accordance with GDPR (EU) 2016/679.",
  },
  {
    path: "summit",
    title: "ÉCHO × Girls Future Ready Summit",
    description:
      "The first AI mirror powered by your own voice. ÉCHO is live on the App Store, free to download, with founding-member pricing on your first year.",
    ogTitle: "ÉCHO × Girls Future Ready Summit",
    ogDescription:
      "ÉCHO — private voice journal, live on the App Store.",
  },
  // Blog listing
  {
    path: "blog",
    title: "The ÉCHO Journal — Voice Journaling Articles",
    description:
      "Articles on voice journaling, daily reflection, building better habits, and long-term self-understanding. By the team behind ÉCHO.",
    ogTitle: "The ÉCHO Journal — Voice Journaling Articles",
    ogDescription:
      "Articles on voice journaling, daily reflection, building better habits, and long-term self-understanding.",
  },
  // Blog posts
  ...BLOG_POSTS.map((p) => ({
    path: `blog/${p.slug}`,
    title: `${p.title} — ÉCHO Journal`,
    description: p.description,
    ogTitle: `${p.title} — ÉCHO Journal`,
    ogDescription: p.description,
    ogImage: `${BASE}/blog-covers/${p.slug}.svg`,
  })),
];

// ---------------------------------------------------------------------------
// HTML mutation helpers
// ---------------------------------------------------------------------------
function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function injectMeta(html, route) {
  const url = `${BASE}/${route.path}`;
  const ogTitle = route.ogTitle ?? route.title;
  const ogDesc = route.ogDescription ?? route.description;
  const ogImage = route.ogImage ?? `${BASE}/og-image.png`;

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`);

  // <meta name="title">
  html = html.replace(
    /<meta name="title" content="[^"]*"/,
    `<meta name="title" content="${esc(route.title)}"`
  );

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"/,
    `<meta name="description" content="${esc(route.description)}"`
  );

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${url}"`
  );

  // OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${esc(ogTitle)}"`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"/,
    `<meta property="og:description" content="${esc(ogDesc)}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${url}"`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"/,
    `<meta property="og:image" content="${ogImage}"`
  );

  // Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${esc(ogTitle)}"`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"/,
    `<meta name="twitter:description" content="${esc(ogDesc)}"`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"/,
    `<meta name="twitter:image" content="${ogImage}"`
  );

  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const baseHtml = readFileSync(join(distDir, "index.html"), "utf8");
console.log(`[prerender] Base HTML: ${baseHtml.length} bytes`);

let count = 0;
for (const route of ROUTES) {
  const outDir = join(distDir, route.path);
  const outFile = join(outDir, "index.html");

  mkdirSync(outDir, { recursive: true });
  const html = injectMeta(baseHtml, route);
  writeFileSync(outFile, html, "utf8");

  count++;
  console.log(`[prerender] /${route.path} → ${outFile}`);
}

console.log(`[prerender] Done — ${count} routes pre-rendered.`);
