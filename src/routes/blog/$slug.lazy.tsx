import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { BLOG_POSTS, TOPIC_LABELS, type BlogSection } from "@/lib/blog-posts";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/blog/$slug")({
  component: BlogPost,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function splitTitle(title: string): { main: string; sub: string | null } {
  const qIdx = title.indexOf("? ");
  if (qIdx !== -1) return { main: title.slice(0, qIdx + 1), sub: title.slice(qIdx + 2).trim() };
  const cIdx = title.indexOf(": ");
  if (cIdx !== -1 && cIdx > 10) return { main: title.slice(0, cIdx), sub: title.slice(cIdx + 2).trim() };
  return { main: title, sub: null };
}

function slugifyHeading(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function FaqList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="b-faq-accordion">
      {faqs.map((item, i) => (
        <div key={i} className={`b-faq-item ${open === i ? "is-open" : ""}`}>
          <button
            type="button"
            className="b-faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <span className="b-faq-icon" aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="b-faq-a"><p>{item.a}</p></div>}
        </div>
      ))}
    </div>
  );
}

function renderSection(section: BlogSection, i: number) {
  const id = section.heading && section.type !== "invite" ? slugifyHeading(section.heading) : undefined;

  if (section.type === "invite") {
    return (
      <div key={i} className="b-invite b-invite--blue b-invite--mid">
        <div className="b-invite-inner">
          {section.kicker && <p className="b-invite-kicker">{section.kicker}</p>}
          {section.heading && <h2 className="b-invite-heading">{section.heading}</h2>}
          {section.ctaBody && <p className="b-invite-body">{section.ctaBody}</p>}
        </div>
        <a {...APP_STORE_LINK_PROPS} className="b-invite-cta">
          {section.ctaText ?? "Explore ÉCHO"}
        </a>
      </div>
    );
  }

  return (
    <section key={i} id={id}>
      {section.heading && <h2>{section.heading}</h2>}
      {section.body && section.body.split("\n\n").map((para, j) => (
        <p key={j}>{para.trim()}</p>
      ))}

      {section.steps && (
        <div className="b-steps">
          {section.steps.map((step, j) => (
            <div key={j} className="b-step">
              <span className="b-step-num">{step.num}</span>
              <p className="b-step-title">{step.title}</p>
              <p className="b-step-body">{step.body}</p>
            </div>
          ))}
        </div>
      )}

      {section.kicker && section.quote && (
        <div className="b-callout">
          <p className="b-callout-kicker">{section.kicker}</p>
          {section.prompt && <p className="b-callout-prompt">{section.prompt}</p>}
          <p className="b-callout-quote">{section.quote}</p>
          {section.disclaimer && <p className="b-callout-disclaimer">{section.disclaimer}</p>}
        </div>
      )}

      {section.left && section.right && (
        <div className="b-comparison">
          <div className="b-comparison-col b-comparison-col--left">
            <p className="b-comparison-label">{section.left.label}</p>
            <p className="b-comparison-heading">{section.left.heading}</p>
            <p>{section.left.body}</p>
          </div>
          <div className="b-comparison-col b-comparison-col--right">
            <p className="b-comparison-label">{section.right.label}</p>
            <p className="b-comparison-heading">{section.right.heading}</p>
            <p>{section.right.body}</p>
          </div>
        </div>
      )}

      {section.note && <p className="b-comparison-note">{section.note}</p>}

      {section.lines && (
        <blockquote className="b-blockquote">
          {section.lines.map((line, j) => <p key={j}>{line}</p>)}
        </blockquote>
      )}

      {section.tags && (
        <div className="b-tags">
          {section.tags.map((tag, j) => (
            <span key={j} className="b-tag">{tag}</span>
          ))}
        </div>
      )}

      {section.faqs && <FaqList faqs={section.faqs} />}

      {section.afterBody && section.afterBody.split("\n\n").map((para, j) => (
        <p key={j}>{para.trim()}</p>
      ))}

      {section.link && (
        <p>
          <Link to={section.link.to} className="b-body-link">
            {section.link.text}
          </Link>
        </p>
      )}
    </section>
  );
}

function BlogPost() {
  const post = Route.useLoaderData();
  const [activeSection, setActiveSection] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const headings = post.sections
    .filter((s) => s.heading && s.type !== "invite")
    .map((s) => ({
      id: slugifyHeading(s.heading!),
      text: s.heading!,
    }));

  useEffect(() => {
    if (!headings.length) return;
    const sectionEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sectionEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [post.slug]);

  const BASE = "https://www.echobyreaclyse.com";
  const url = `${BASE}/blog/${post.slug}`;

  const relatedPosts = (post.relatedSlugs ?? [])
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter(Boolean) as typeof BLOG_POSTS;

  return (
    <div className="blog-scope">
      {/* Sticky header */}
      <header className="b-header" role="banner">
        <div className="b-header-inner b-wrap">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo.svg" alt="ÉCHO" width={32} height={32} />
            <span>ÉCHO</span>
          </Link>
          <nav className="b-nav" aria-label="Site navigation">
            <Link to="/blog" className="b-nav-link active">Journal</Link>
            <Link to="/blog/voice-journaling-prompts" className="b-nav-link">Prompts</Link>
          </nav>
          <a {...APP_STORE_LINK_PROPS} className="b-header-cta">
            Explore ÉCHO
          </a>
        </div>
      </header>

      {/* SEO head tags */}
      <title>{post.searchTitle ?? `${post.title} — ÉCHO Journal`}</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={`${post.title} — ÉCHO Journal`} />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${BASE}/blog-og/${post.slug}.png`} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${post.title} — ÉCHO Journal`} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={`${BASE}/blog-og/${post.slug}.png`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            image: { "@type": "ImageObject", url: `${BASE}/blog-og/${post.slug}.png`, width: 1200, height: 630 },
            author: { "@type": "Organization", name: "ÉCHO by RÉACLYSE", url: BASE },
            publisher: {
              "@type": "Organization",
              name: "ÉCHO by RÉACLYSE",
              logo: { "@type": "ImageObject", url: `${BASE}/logo.svg`, width: 56, height: 57 },
              url: BASE,
            },
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        }}
      />

      <main>
        <div className="b-wrap">
        {/* Breadcrumb */}
        <nav className="b-crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </nav>

        {/* Article head */}
        <div className="b-article-head">
          <span className="b-topic-label">{TOPIC_LABELS[post.topic]}</span>
          {(() => {
            const { main, sub } = splitTitle(post.title);
            return (
              <h1 className="b-article-h1">
                {main}
                {sub && <span className="b-article-h1-sub">{/[.!?]$/.test(sub) ? sub : `${sub}.`}</span>}
              </h1>
            );
          })()}
          {post.description && (
            <p className="b-article-desc">{post.description}</p>
          )}
          <div className="b-byline">
            <div className="b-byline-who">
              <div className="b-byline-avatar" aria-hidden="true">É</div>
              <div>
                <span className="b-byline-name">{post.author}</span>
                <span className="b-byline-role">ÉCHO by RÉACLYSE</span>
              </div>
            </div>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* The quick answer */}
        {post.inShort && (
          <div className="b-in-short">
            <p className="b-in-short-label">The quick answer</p>
            <p>{post.inShort}</p>
          </div>
        )}

        {/* Mobile ToC toggle */}
        {headings.length > 2 && (
          <div className="b-toc-mobile">
            <button
              type="button"
              className="b-toc-toggle"
              aria-expanded={tocOpen}
              onClick={() => setTocOpen(!tocOpen)}
            >
              {tocOpen ? "Hide" : "Show"} contents
            </button>
            {tocOpen && (
              <nav aria-label="Table of contents">
                <ol className="b-toc-list">
                  {headings.map(({ id, text }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={activeSection === id ? "active" : ""}
                        onClick={() => setTocOpen(false)}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        )}

        {/* Layout: sidebar ToC + body */}
        <div className="b-layout">
          {headings.length > 2 && (
            <aside className="b-toc" aria-label="Table of contents">
              <p className="b-toc-heading">In this guide</p>
              <nav>
                <ol className="b-toc-list">
                  {headings.map(({ id, text }) => (
                    <li key={id}>
                      <a href={`#${id}`} className={activeSection === id ? "active" : ""}>
                        {text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="b-toc-promo">
                <p className="b-toc-promo-title">Need a first question?</p>
                <Link to="/blog/voice-journaling-prompts" className="b-toc-promo-link">
                  Explore 35 prompts →
                </Link>
              </div>
            </aside>
          )}

          <article className="b-body">
            {post.sections.map((section, i) => renderSection(section, i))}
          </article>
        </div>

        {/* Product invite */}
        <div className="b-invite b-invite--blue">
          <div className="b-invite-inner">
            <p className="b-invite-kicker">Try ÉCHO</p>
            <h2 className="b-invite-heading">One question. Spoken. Every day.</h2>
            <p className="b-invite-body">
              On-device transcription. No audio leaves your phone. Free to start.
            </p>
          </div>
          <a {...APP_STORE_LINK_PROPS} className="b-invite-cta">
            Download on the App Store
          </a>
        </div>

        {/* Author */}
        <div className="b-author">
          <div className="b-author-avatar" aria-hidden="true">É</div>
          <div className="b-author-info">
            <p className="b-author-name">{post.author}</p>
            <p className="b-author-bio">
              The team behind ÉCHO — a private voice journal for iPhone, built by RÉACLYSE in Luxembourg.
            </p>
          </div>
        </div>

        {/* Related reading */}
        {relatedPosts.length > 0 && (
          <section className="b-related" aria-label="Related articles">
            <p className="b-related-kicker">Keep exploring</p>
            <h2 className="b-related-heading">Your next small step.</h2>
            <div className="b-related-list">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  to="/blog/$slug"
                  params={{ slug: rel.slug }}
                  className="b-related-item"
                >
                  <div className="b-related-cover">
                    <img
                      src={`/blog-covers/${rel.slug}.svg`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      width={220}
                      height={138}
                    />
                  </div>
                  <div className="b-related-text">
                    <span className="b-related-label">{TOPIC_LABELS[rel.topic]}</span>
                    <p className="b-related-title">{rel.title}</p>
                    <span className="b-related-cta">
                      {rel.slug === "voice-journaling-prompts" ? "Browse the prompts" : "Read the guide"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        </div>{/* end b-wrap */}
      </main>

      {/* Footer */}
      <footer className="b-footer">
        <div className="b-footer-inner b-wrap">
          <div>
            <img src="/logo.svg" alt="" aria-hidden="true" width={32} height={32} />
            <p className="b-footer-tag">A little space to hear yourself.</p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>ÉCHO by RÉACLYSE</p>
          </div>
          <nav aria-label="Footer links">
            <ul>
              <li><Link to="/blog">Journal</Link></li>
              <li><Link to="/blog/voice-journaling-prompts">Prompts</Link></li>
              <li><Link to="/">Explore the app</Link></li>
              <li><Link to="/privacy">Privacy &amp; support</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
