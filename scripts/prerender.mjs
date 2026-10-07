/**
 * Post-build prerender script.
 *
 * After `vite build`, this script generates route-specific index.html files
 * in dist/ so that each URL serves:
 *   - correct <title>, <meta description>, OG tags, canonical link
 *   - full article text already in the HTML (for Bing / AI crawlers / no-JS)
 *   - og:type "article" on blog posts (not "website")
 *   - og:image as a valid JPG (SVG not supported by Facebook / X / WhatsApp)
 *   - FAQ structured data on articles with question–answer sections
 *
 * React's createRoot() replaces the pre-rendered body on hydration, so users
 * always see the styled app. Crawlers that don't run JS see the plain HTML.
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist");

// ---------------------------------------------------------------------------
// Blog post data — emitted as dist/blog-posts.json by the Vite exportBlogData
// plugin in vite.config.ts so this script (plain .mjs) can read it without TS.
// ---------------------------------------------------------------------------
const BLOG_POSTS = JSON.parse(readFileSync(join(distDir, "blog-posts.json"), "utf8"));

// ---------------------------------------------------------------------------
// Route manifest — title / description / ogTitle / ogDescription / url
// ---------------------------------------------------------------------------
const BASE = "https://www.echobyreaclyse.com";

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
  // Blog posts — derived from BLOG_POSTS data
  ...BLOG_POSTS.map((p) => ({
    path: `blog/${p.slug}`,
    title: `${p.title} — ÉCHO Journal`,
    description: p.description,
    ogTitle: `${p.title} — ÉCHO Journal`,
    ogDescription: p.description,
    // OG image: use the global og-image.jpg — social platforms don't render SVG.
    // Individual per-post PNG covers can replace this once generated.
    ogImage: `${BASE}/og-image.jpg`,
    ogType: "article",
    post: p,
  })),
];

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render a blog post's content as plain HTML to inject into <div id="root">.
 * React's createRoot() replaces this on hydration; it exists solely for
 * crawlers that don't execute JavaScript.
 */
function renderArticleHtml(post) {
  const sectionsHtml = post.sections
    .map((section) => {
      const heading = section.heading
        ? `<h2>${escHtml(section.heading)}</h2>`
        : "";
      const paragraphs = section.body
        .split("\n\n")
        .map((p) => `<p>${escHtml(p.trim())}</p>`)
        .join("");
      return `<section>${heading}${paragraphs}</section>`;
    })
    .join("");

  return (
    `<article>` +
    `<h1>${escHtml(post.title)}</h1>` +
    `<p>${escHtml(post.description)}</p>` +
    sectionsHtml +
    `</article>`
  );
}

/**
 * Build FAQ JSON-LD for a blog post.
 *
 * Two patterns are detected:
 *   1. Section heading ends with "?" → heading is the question, body is the answer.
 *   2. Section heading is "Common questions" → body contains paragraphs of the
 *      form "Question text? Answer text." that are parsed into individual pairs.
 *
 * Returns null when no qualifying sections are found.
 */
function buildFaqSchema(post) {
  const items = [];

  for (const section of post.sections) {
    if (!section.heading) continue;

    if (section.heading.toLowerCase() === "common questions") {
      // Parse "Q? A." pairs from separate paragraphs
      for (const para of section.body.split("\n\n")) {
        const trimmed = para.trim();
        const qMark = trimmed.indexOf("?");
        if (qMark !== -1) {
          const question = trimmed.slice(0, qMark + 1).trim();
          const answer = trimmed.slice(qMark + 1).trim();
          if (question && answer) {
            items.push({ question, answer });
          }
        }
      }
    } else if (section.heading.trimEnd().endsWith("?")) {
      items.push({ question: section.heading, answer: section.body });
    }
  }

  if (items.length === 0) return null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}

function injectMeta(html, route) {
  const url = `${BASE}/${route.path}`;
  const ogTitle = route.ogTitle ?? route.title;
  const ogDesc = route.ogDescription ?? route.description;
  const ogImage = route.ogImage ?? `${BASE}/og-image.jpg`;
  const ogType = route.ogType ?? "website";

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

  // OG type (website by default, article for blog posts)
  html = html.replace(
    /<meta property="og:type" content="[^"]*"/,
    `<meta property="og:type" content="${ogType}"`
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

  // Inject article body content into <div id="root"> so crawlers read the text
  if (route.post) {
    const articleHtml = renderArticleHtml(route.post);
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${articleHtml}</div>`
    );

    // Inject FAQ schema if the article has FAQ sections
    const faqSchema = buildFaqSchema(route.post);
    if (faqSchema) {
      html = html.replace(
        "</head>",
        `<script type="application/ld+json">${faqSchema}</script>\n</head>`
      );
    }
  }

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
