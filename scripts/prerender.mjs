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
const PROMPT_GROUPS = JSON.parse(readFileSync(join(distDir, "prompts-data.json"), "utf8"));

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
    title: "The ÉCHO Journal — Voice Journaling Guides and Prompts",
    description:
      "Voice journaling guides, prompts, and simple ways to reflect. Find something to say, build a practice that suits you, and revisit your thoughts over time.",
    ogTitle: "The ÉCHO Journal — Voice Journaling Guides and Prompts",
    ogDescription:
      "Voice journaling guides, prompts, and simple ways to reflect.",
    ogImage: `${BASE}/og-image.png`,
  },
  // Prompts page — static route (not via $slug)
  {
    path: "blog/voice-journaling-prompts",
    promptsPage: true,
    title: "35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal",
    description:
      "35 short voice journaling prompts in seven groups: evening, anxious days, gratitude, big decisions, self-discovery, relationships and your future self. Copy one and start.",
    ogTitle: "35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal",
    ogDescription:
      "35 short voice journaling prompts in seven groups. Copy one and start.",
    ogImage: `${BASE}/blog-og/voice-journaling-prompts.png`,
    ogType: "article",
  },
  // Blog posts — derived from BLOG_POSTS data (prompts page handled above as static route)
  ...BLOG_POSTS.filter((p) => p.slug !== "voice-journaling-prompts").map((p) => ({
    path: `blog/${p.slug}`,
    title: `${p.title} — ÉCHO Journal`,
    description: p.description,
    ogTitle: `${p.title} — ÉCHO Journal`,
    ogDescription: p.description,
    ogImage: `${BASE}/blog-og/${p.slug}.png`,
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
 * Render the homepage as plain HTML to inject into <div id="root">.
 * Gives crawlers the app description and links to key sections.
 */
function renderHomepageHtml(posts) {
  const recentLinks = posts
    .slice(0, 5)
    .map(
      (p) =>
        `<li><a href="/blog/${escHtml(p.slug)}">${escHtml(p.title)}</a></li>`
    )
    .join("");

  return (
    `<main>` +
    `<h1>ÉCHO — Private Voice Journal for iPhone</h1>` +
    `<p>One question a day. Your voice, recorded and encrypted on-device. Weeks later, ÉCHO surfaces what you said before the doubt set in. Free on the App Store.</p>` +
    `<section>` +
    `<h2>Voice journaling guides</h2>` +
    `<ul>${recentLinks}</ul>` +
    `<a href="/blog">Browse all articles</a>` +
    `</section>` +
    `<section>` +
    `<h2>Compare ÉCHO</h2>` +
    `<ul>` +
    `<li><a href="/vs/day-one">ÉCHO vs Day One</a></li>` +
    `<li><a href="/vs/reflectly">ÉCHO vs Reflectly</a></li>` +
    `<li><a href="/vs/rosebud">ÉCHO vs Rosebud</a></li>` +
    `<li><a href="/vs/journey">ÉCHO vs Journey</a></li>` +
    `<li><a href="/vs/chatgpt">ÉCHO vs ChatGPT</a></li>` +
    `<li><a href="/vs/apple-journal">ÉCHO vs Apple Journal</a></li>` +
    `</ul>` +
    `</section>` +
    `</main>`
  );
}

/**
 * Render the /blog/voice-journaling-prompts page as plain HTML.
 * Gives crawlers the full list of prompts without running JS.
 */
function renderPromptsHtml(groups) {
  const groupsHtml = groups.map((group) => {
    const promptsHtml = group.prompts
      .map(
        (p) =>
          `<li>` +
          `<span>${p.number}.</span>` +
          `<p>${escHtml(p.text)}</p>` +
          `</li>`
      )
      .join("");
    return (
      `<section id="${escHtml(group.anchor)}">` +
      `<h2>${escHtml(group.name)}</h2>` +
      `<p>${escHtml(group.intro)}</p>` +
      `<ol>${promptsHtml}</ol>` +
      `</section>`
    );
  }).join("");

  const totalPrompts = groups.reduce((n, g) => n + g.prompts.length, 0);

  return (
    `<main>` +
    `<h1>${totalPrompts} voice journaling prompts to answer out loud</h1>` +
    `<p>Find a question for the moment you are in. Choose what is on your mind. Pick one question. Take it at your own pace.</p>` +
    groupsHtml +
    `</main>`
  );
}

/**
 * Render the /blog listing as plain HTML to inject into <div id="root">.
 * Gives crawlers a full list of article links without running JS.
 */
function renderBlogListingHtml(posts) {
  const items = posts
    .map((post) => {
      const formatted = new Date(post.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return (
        `<article>` +
        `<a href="/blog/${escHtml(post.slug)}">` +
        `<img src="/blog-covers/${escHtml(post.slug)}.svg" alt="${escHtml(post.title)}" width="800" height="420" loading="lazy">` +
        `<h2>${escHtml(post.title)}</h2>` +
        `<p>${escHtml(post.description)}</p>` +
        `<p>${escHtml(post.author)} · ${formatted} · ${escHtml(post.readingTime)}</p>` +
        `</a>` +
        `</article>`
      );
    })
    .join("");

  return (
    `<main>` +
    `<h1>A little space to hear yourself.</h1>` +
    `<p>Voice journaling guides, prompts, and simple ways to reflect.</p>` +
    items +
    `</main>`
  );
}

/**
 * Render a blog post's content as plain HTML to inject into <div id="root">.
 * React's createRoot() replaces this on hydration; it exists solely for
 * crawlers that don't execute JavaScript.
 */
function renderArticleHtml(post) {
  const sectionsHtml = post.sections
    .map((section) => {
      if (section.type === "invite" || section.type === "callout") return "";
      const heading = section.heading
        ? `<h2>${escHtml(section.heading)}</h2>`
        : "";

      const bodyText = section.body || "";
      const paragraphs = bodyText.split("\n\n").filter(Boolean)
        .map((p) => `<p>${escHtml(p.trim())}</p>`).join("");

      const stepsHtml = section.steps
        ? section.steps.map((s) =>
            `<div><strong>${escHtml(s.title)}</strong><p>${escHtml(s.body)}</p></div>`
          ).join("")
        : "";

      const faqsHtml = section.faqs
        ? section.faqs.map((f) =>
            `<div><strong>${escHtml(f.q)}</strong><p>${escHtml(f.a)}</p></div>`
          ).join("")
        : "";

      const comparisonHtml =
        section.left && section.right
          ? `<div><strong>${escHtml(section.left.label)}:</strong> ${escHtml(section.left.heading)} ${escHtml(section.left.body)}</div>` +
            `<div><strong>${escHtml(section.right.label)}:</strong> ${escHtml(section.right.heading)} ${escHtml(section.right.body)}</div>`
          : "";

      const linesHtml = section.lines
        ? section.lines.map((l) => `<p>${escHtml(l)}</p>`).join("")
        : "";

      const afterText = (section.afterBody || "").split("\n\n").filter(Boolean)
        .map((p) => `<p>${escHtml(p.trim())}</p>`).join("");

      const quoteHtml = section.quote && !section.kicker
        ? `<blockquote><p>${escHtml(section.quote)}</p></blockquote>`
        : section.kicker && section.quote
        ? `<p><em>${escHtml(section.kicker)}:</em> ${escHtml(section.quote)}</p>`
        : "";

      return `<section>${heading}${paragraphs}${stepsHtml}${faqsHtml}${comparisonHtml}${linesHtml}${quoteHtml}${afterText}</section>`;
    })
    .filter(Boolean)
    .join("");

  let relatedHtml = "";
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const relatedPosts = post.relatedSlugs
      .map((s) => BLOG_POSTS.find((p) => p.slug === s))
      .filter(Boolean);
    if (relatedPosts.length > 0) {
      const links = relatedPosts
        .map(
          (rel) =>
            `<a href="/blog/${escHtml(rel.slug)}">` +
            `<h3>${escHtml(rel.title)}</h3>` +
            `<p>${escHtml(rel.description)}</p>` +
            `</a>`
        )
        .join("");
      relatedHtml = `<section><h2>Related articles</h2>${links}</section>`;
    }
  }

  return (
    `<article>` +
    `<h1>${escHtml(post.title)}</h1>` +
    `<p>${escHtml(post.description)}</p>` +
    sectionsHtml +
    relatedHtml +
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
      for (const para of (section.body || "").split("\n\n")) {
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
  const ogImage = route.ogImage ?? `${BASE}/og-image.png`;
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

  // hreflang: replace homepage href with per-page canonical URL
  html = html.replace(
    /(<link rel="alternate" hreflang="en" href=")[^"]*(")/g,
    `$1${url}$2`
  );
  html = html.replace(
    /(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/g,
    `$1${url}$2`
  );

  // Inject prompts page HTML for /blog/voice-journaling-prompts
  if (route.promptsPage) {
    const promptsHtml = renderPromptsHtml(PROMPT_GROUPS);
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${promptsHtml}</div>`
    );
    const promptsBreadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: "35 Voice Journaling Prompts", item: url },
      ],
    });
    html = html.replace(
      "</head>",
      `<script type="application/ld+json">${promptsBreadcrumb}</script>\n</head>`
    );
  }

  // Inject blog listing into #root for /blog so crawlers see all article links
  if (route.path === "blog") {
    const listingHtml = renderBlogListingHtml(BLOG_POSTS);
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${listingHtml}</div>`
    );
    const blogBreadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      ],
    });
    html = html.replace(
      "</head>",
      `<script type="application/ld+json">${blogBreadcrumb}</script>\n</head>`
    );
  }

  // Inject article body + structured data for blog post pages
  if (route.post) {
    const articleHtml = renderArticleHtml(route.post);
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${articleHtml}</div>`
    );

    const schemas = [];

    // BlogPosting schema
    schemas.push(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: route.post.title,
        description: route.post.description,
        datePublished: route.post.date,
        image: {
          "@type": "ImageObject",
          url: ogImage,
          width: 800,
          height: 420,
        },
        author: {
          "@type": "Organization",
          name: "ÉCHO by RÉACLYSE",
          url: BASE,
        },
        publisher: {
          "@type": "Organization",
          name: "ÉCHO by RÉACLYSE",
          logo: {
            "@type": "ImageObject",
            url: `${BASE}/logo.svg`,
            width: 56,
            height: 57,
          },
          url: BASE,
        },
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      })
    );

    // BreadcrumbList schema
    schemas.push(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
          { "@type": "ListItem", position: 3, name: route.post.title, item: url },
        ],
      })
    );

    // FAQ schema if the article has FAQ sections
    const faqSchema = buildFaqSchema(route.post);
    if (faqSchema) schemas.push(faqSchema);

    html = html.replace(
      "</head>",
      schemas.map((s) => `<script type="application/ld+json">${s}</script>`).join("\n") +
        "\n</head>"
    );
  }

  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const baseHtml = readFileSync(join(distDir, "index.html"), "utf8");
console.log(`[prerender] Base HTML: ${baseHtml.length} bytes`);

// Pre-render homepage: inject visible content into dist/index.html so crawlers
// see links and copy without waiting for JavaScript.
const homepageHtml = baseHtml.replace(
  /<div id="root"><\/div>/,
  `<div id="root">${renderHomepageHtml(BLOG_POSTS)}</div>`
);
writeFileSync(join(distDir, "index.html"), homepageHtml, "utf8");
console.log(`[prerender] / → ${join(distDir, "index.html")}`);

let count = 1; // homepage counts
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
