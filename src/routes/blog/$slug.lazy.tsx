import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { BLOG_POSTS, TOPIC_LABELS } from "@/lib/blog-posts";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/blog/$slug")({
  component: BlogPost,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function slugifyHeading(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function BlogPost() {
  const post = Route.useLoaderData();
  const [activeSection, setActiveSection] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const headings = post.sections.filter((s) => s.heading).map((s) => ({
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
        <div className="b-header-inner">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo.svg" alt="ÉCHO" width={32} height={32} />
            <span>ÉCHO</span>
          </Link>
          <nav className="b-nav" aria-label="Site navigation">
            <Link to="/blog" className="b-nav-link">Journal</Link>
          </nav>
          <a {...APP_STORE_LINK_PROPS} className="b-header-cta">
            Download ÉCHO
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
            image: { "@type": "ImageObject", url: `${BASE}/blog-og/${post.slug}.png`, width: 800, height: 420 },
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
          <h1 className="b-article-h1">{post.title}</h1>
          {post.description && (
            <p className="b-article-desc">{post.description}</p>
          )}
          <div className="b-byline">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* In short */}
        {post.inShort && (
          <div className="b-in-short">
            <p className="b-in-short-label">In short</p>
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
              <p className="b-toc-heading">Contents</p>
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
            </aside>
          )}

          <article className="b-body">
            {post.sections.map((section, i) => {
              const id = section.heading ? slugifyHeading(section.heading) : undefined;
              return (
                <section key={i} id={id}>
                  {section.heading && <h2 id={id}>{section.heading}</h2>}
                  {section.body.split("\n\n").map((para, j) => (
                    <p key={j}>{para.trim()}</p>
                  ))}
                </section>
              );
            })}
          </article>
        </div>

        {/* Product invite */}
        <div className="b-invite">
          <div className="b-invite-inner">
            <p className="b-invite-kicker">Try ÉCHO</p>
            <h2 className="b-invite-heading">One question. Spoken. Every day.</h2>
            <p className="b-invite-body">
              On-device transcription. No audio leaves your phone. Free to start.
            </p>
            <a {...APP_STORE_LINK_PROPS} className="b-invite-cta">
              Download on the App Store
            </a>
          </div>
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
            <h2 className="b-related-heading">Read next</h2>
            <div className="b-related-grid">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  to="/blog/$slug"
                  params={{ slug: rel.slug }}
                  className="b-related-card"
                >
                  <span className="b-related-label">{TOPIC_LABELS[rel.topic]}</span>
                  <p className="b-related-title">{rel.title}</p>
                  <p className="b-related-excerpt">{rel.excerpt}</p>
                  <span className="b-related-read">{rel.readingTime} →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="b-footer">
        <div className="b-footer-inner">
          <div className="b-footer-brand">
            <img src="/logo.svg" alt="ÉCHO" width={24} height={24} />
            <span>ÉCHO by RÉACLYSE</span>
          </div>
          <nav className="b-footer-nav" aria-label="Footer links">
            <Link to="/privacy" className="b-footer-link">Privacy</Link>
            <Link to="/terms" className="b-footer-link">Terms</Link>
            <Link to="/support" className="b-footer-link">Support</Link>
            <Link to="/contact" className="b-footer-link">Contact</Link>
          </nav>
          <p className="b-footer-copy">© {new Date().getFullYear()} ECHO by REACLYSE S.à r.l.-S, Luxembourg</p>
        </div>
      </footer>
    </div>
  );
}
