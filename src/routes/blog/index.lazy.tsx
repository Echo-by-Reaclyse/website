import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, Fragment } from "react";
import { BLOG_POSTS, TOPIC_LABELS, type BlogTopic, type CardVisual } from "@/lib/blog-posts";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import { CopyButton } from "@/components/blog/CopyButton";
import { SiteFooter } from "@/components/SiteFooter";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/blog/")({
  component: BlogIndex,
});

const TOPICS: BlogTopic[] = ["voice", "prompts", "reflect", "privacy"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function CardVisualEl({ visual, slug }: { visual: CardVisual; slug: string }) {
  if (visual.type === "image") {
    return (
      <div className="b-vis-image">
        <img src={`/blog-covers/${slug}.svg`} alt="" aria-hidden="true" loading="lazy" width={800} height={420} />
      </div>
    );
  }
  if (visual.type === "steps" && visual.labels) {
    return (
      <div className="b-vis-graphic">
        <div className="b-vis-steps">
          {visual.labels.map((label, i) => (
            <Fragment key={i}>
              {i > 0 && <div className="b-vis-bar" aria-hidden="true" />}
              <div className="b-vis-steps-item">
                <div className="b-vis-step-num">{i + 1}</div>
                {label}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
  if (visual.type === "compare") {
    return (
      <div className="b-vis-graphic">
        <div className="b-vis-compare">
          <div className="a">
            <b>Speak</b>
            Faster, more honest<br />First thought, unfiltered
          </div>
          <div className="b">
            <b>Write</b>
            Slower, more considered<br />Edits before you read it
          </div>
        </div>
      </div>
    );
  }
  if (visual.type === "week") {
    return (
      <div className="b-vis-graphic">
        <div className="b-vis-week">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="b-vis-week-day">
              {d}<i className={i < 5 ? "filled" : ""} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (visual.type === "night") {
    return (
      <div className="b-vis-night">
        {visual.text}
      </div>
    );
  }
  if (visual.type === "checklist" && visual.items) {
    return (
      <div className="b-vis-graphic">
        <ul className="b-vis-check">
          {visual.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (visual.type === "three-words" && visual.labels) {
    return (
      <div className="b-vis-graphic">
        <div className="b-vis-three-words">
          {visual.labels.map((label, i) => (
            <div key={i}>{label}</div>
          ))}
        </div>
      </div>
    );
  }
  // prompt (default)
  return (
    <div className={`b-vis-prompt${visual.variant === "blue" ? " blue" : ""}`}>
      {visual.kicker && <span className="b-vis-kicker">{visual.kicker}</span>}
      <q>{visual.text}</q>
    </div>
  );
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="b-card"
    >
      <div className="b-card-vis">
        <CardVisualEl visual={post.cardVisual} slug={post.slug} />
      </div>
      <p className="b-card-topic">{TOPIC_LABELS[post.topic]}</p>
      <h3>{post.title}</h3>
      <p className="b-card-excerpt">{post.excerpt}</p>
      <p className="b-card-meta">{post.readingTime} · {formatDate(post.date)}</p>
    </Link>
  );
}

function BlogIndex() {
  const [activeTopic, setActiveTopic] = useState<BlogTopic | null>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const pathway = [
    { step: "01", text: "Find your first words" },
    { step: "02", text: "Try a simple routine" },
    { step: "03", text: "Choose one question" },
  ];

  const filtered = useMemo(() => {
    let posts = BLOG_POSTS;
    if (activeTopic) posts = posts.filter((p) => p.topic === activeTopic);
    if (query.trim()) {
      const q = query.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          TOPIC_LABELS[p.topic].toLowerCase().includes(q)
      );
    }
    return posts;
  }, [activeTopic, query]);

  return (
    <div className="blog-scope">
      {/* SEO */}
      <title>The ÉCHO Journal — Voice Journaling Guides and Prompts</title>
      <meta name="description" content="Voice journaling guides, prompts, and simple ways to reflect. Find something to say, build a practice that suits you, and revisit your thoughts over time." />
      <link rel="canonical" href="https://www.echobyreaclyse.com/blog" />
      <meta property="og:title" content="The ÉCHO Journal — Voice Journaling Guides and Prompts" />
      <meta property="og:description" content="Voice journaling guides, prompts, and simple ways to reflect. Find something to say, build a practice that suits you, and revisit your thoughts over time." />
      <meta property="og:url" content="https://www.echobyreaclyse.com/blog" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The ÉCHO Journal — Voice Journaling Guides and Prompts" />
      <meta name="twitter:description" content="Voice journaling guides, prompts, and simple ways to reflect. Find something to say, build a practice that suits you." />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.echobyreaclyse.com/" },
              { "@type": "ListItem", position: 2, name: "Journal", item: "https://www.echobyreaclyse.com/blog" },
            ],
          }),
        }}
      />

      {/* Sticky header */}
      <header className="b-header" role="banner">
        <div className="b-header-inner b-wrap">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo-main.svg" alt="ÉCHO" height={22} style={{ width: "auto" }} />
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

      <main>
        <div className="b-wrap">
          {/* Hero grid */}
          <section className="b-home-grid" aria-label="Featured content">
            {/* Intro */}
            <div className="b-intro">
              <p className="b-label">The ÉCHO Journal</p>
              <h1>
                A little space to <em>hear yourself.</em>
              </h1>
              <p className="b-intro-support">
                Voice journaling guides, prompts, and simple ways to reflect.
              </p>
              <p className="b-intro-desc">
                Find something to say, build a practice that suits you, and revisit your thoughts over time.
              </p>
              <div className="b-actions">
                <a {...APP_STORE_LINK_PROPS} className="b-btn b-btn-dark">
                  Start voice journaling
                </a>
                <Link to="/blog/voice-journaling-prompts" className="b-text-link">
                  Explore the prompts
                </Link>
              </div>
            </div>

            {/* Question card */}
            <div className="b-qcard-wrap">
              <div className="b-qcard">
                <p className="b-label">A question for today</p>
                <p className="b-qcard-quote">What stayed with you today?</p>
                <p style={{ fontSize: "15px", marginBottom: "18px", color: "#D8D2C8" }}>
                  Start there. You do not need to have it all figured out.
                </p>
                <CopyButton text="What stayed with you today?" label="Copy this prompt" />
                <p className="b-qcard-note">
                  <Link to="/blog/voice-journaling-prompts">Browse all 35 prompts</Link>
                </p>
              </div>
            </div>

            {/* Pathway */}
            <div className="b-pathway" aria-labelledby="pathway-heading">
              <div className="b-pathway-intro">
                <p className="b-label">New here?</p>
                <h2 id="pathway-heading">Start small.</h2>
              </div>
              <ol>
                {pathway.map((item) => (
                  <li key={item.step} className="b-pathway-item">
                    <span className="b-pathway-n">{item.step}</span>
                    <span className="b-pathway-t">{item.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Library */}
            <div className="b-library" aria-labelledby="library-heading">
              <div className="b-lib-head">
                <div>
                  <p className="b-label">Practical, not perfect</p>
                  <h2 id="library-heading">Find something useful.</h2>
                </div>
                <div className="b-search">
                  <label htmlFor="blog-search">Search the journal</label>
                  <input
                    id="blog-search"
                    type="search"
                    placeholder="Search the journal"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search articles"
                  />
                </div>
              </div>

              <fieldset className="b-filters">
                <legend className="b-visually-hidden">Filter by topic</legend>
                <div className="b-chips">
                  <input
                    type="radio"
                    id="topic-all"
                    name="topic-filter"
                    checked={activeTopic === null}
                    onChange={() => setActiveTopic(null)}
                  />
                  <label htmlFor="topic-all">All guides</label>
                  {TOPICS.map((t) => (
                    <Fragment key={t}>
                      <input
                        type="radio"
                        id={`topic-${t}`}
                        name="topic-filter"
                        checked={activeTopic === t}
                        onChange={() => setActiveTopic(t)}
                      />
                      <label htmlFor={`topic-${t}`}>{TOPIC_LABELS[t]}</label>
                    </Fragment>
                  ))}
                </div>
              </fieldset>

              {(activeTopic || query) && (
                <div className="b-result-row">
                  <span>{filtered.length} article{filtered.length !== 1 ? "s" : ""}</span>
                  <button
                    type="button"
                    className="b-link-btn"
                    onClick={() => { setActiveTopic(null); setQuery(""); }}
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="b-empty">
                  <h3>Nothing found.</h3>
                  <p>Try a different search or clear the filter.</p>
                  <button type="button" onClick={() => { setActiveTopic(null); setQuery(""); }} className="b-btn b-btn-secondary b-btn-sm">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="b-cards">
                  {filtered.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Library promo */}
            <div className="b-promo-lib" aria-label="Prompt library">
              <div className="b-promo-lib-txt">
                <p className="b-label">The prompt library</p>
                <h2>Not sure what to say?<br /><em>Begin with a question.</em></h2>
                <p>35 prompts for evenings, decisions, relationships, and the moments in between.</p>
                <Link to="/blog/voice-journaling-prompts" className="b-btn b-btn-dark">
                  Browse all 35 prompts
                </Link>
              </div>
              <div className="b-promo-cats">
                <a href="/blog/voice-journaling-prompts#evening" className="b-promo-cat">
                  <span className="b-promo-cat-name">Evening</span>
                  <span className="b-promo-cat-sub">Let the day settle</span>
                </a>
                <a href="/blog/voice-journaling-prompts#big-decisions" className="b-promo-cat">
                  <span className="b-promo-cat-name">Big decisions</span>
                  <span className="b-promo-cat-sub">Find your priorities</span>
                </a>
                <a href="/blog/voice-journaling-prompts#gratitude" className="b-promo-cat">
                  <span className="b-promo-cat-name">Gratitude</span>
                  <span className="b-promo-cat-sub">Notice the small things</span>
                </a>
                <a href="/blog/voice-journaling-prompts#self-discovery" className="b-promo-cat">
                  <span className="b-promo-cat-name">Self-discovery</span>
                  <span className="b-promo-cat-sub">Make room for you</span>
                </a>
              </div>
            </div>

            {/* Letters / newsletter */}
            <div className="b-letters" aria-label="Newsletter">
              <div className="b-letters-txt">
                <p className="b-label">A note to come back to</p>
                <h2>Letters from <em>Roksana.</em></h2>
                <p>A reflection prompt and a personal note from the person building ÉCHO.</p>
              </div>
              {submitted ? (
                <div className="b-letters-success">
                  <p className="b-letters-success-msg">You're on the list. We'll be in touch.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label htmlFor="nl-email">Your email address</label>
                  <input
                    id="nl-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                  <button type="submit" className="b-btn b-btn-dark">Subscribe</button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
