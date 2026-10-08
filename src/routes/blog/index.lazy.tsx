import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { BLOG_POSTS, TOPIC_LABELS, type BlogTopic, type CardVisual } from "@/lib/blog-posts";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
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
      <div className="v-image">
        <img src={`/blog-covers/${slug}.svg`} alt="" aria-hidden="true" loading="lazy" />
      </div>
    );
  }
  if (visual.type === "steps" && visual.labels) {
    return (
      <div className="v-steps">
        {visual.labels.map((label, i) => (
          <span key={i} className="v-step">
            <span className="v-step-num">{i + 1}</span>
            {label}
          </span>
        ))}
      </div>
    );
  }
  if (visual.type === "compare") {
    return (
      <div className="v-compare">
        <div className="v-col">
          <span className="v-col-head">Writing</span>
          <span className="v-col-body">Slower, more considered</span>
          <span className="v-col-body">Edits before you read it back</span>
        </div>
        <div className="v-divider" aria-hidden="true" />
        <div className="v-col">
          <span className="v-col-head">Voice</span>
          <span className="v-col-body">Faster, more honest</span>
          <span className="v-col-body">First thought, unfiltered</span>
        </div>
      </div>
    );
  }
  if (visual.type === "week") {
    return (
      <div className="v-week">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className={`v-day${i < 5 ? " done" : ""}`}>
            {d}
          </span>
        ))}
        <span className="v-week-label">Day 5 streak</span>
      </div>
    );
  }
  if (visual.type === "night") {
    return (
      <div className="v-night">
        <span className="v-night-text">{visual.text}</span>
      </div>
    );
  }
  if (visual.type === "checklist" && visual.items) {
    return (
      <ul className="v-check">
        {visual.items.map((item, i) => (
          <li key={i} className="v-check-item">
            <span className="v-check-box" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (visual.type === "three-words" && visual.labels) {
    return (
      <div className="v-name">
        {visual.labels.map((label, i) => (
          <span key={i} className="v-word">
            {label}
          </span>
        ))}
      </div>
    );
  }
  // prompt (default)
  return (
    <div className={`v-prompt${visual.variant === "blue" ? " blue" : ""}`}>
      {visual.kicker && <span className="v-kicker">{visual.kicker}</span>}
      <p className="v-q">{visual.text}</p>
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
      <div className="b-card-visual">
        <CardVisualEl visual={post.cardVisual} slug={post.slug} />
      </div>
      <div className="b-card-body">
        <span className="b-card-label">{TOPIC_LABELS[post.topic]}</span>
        <h3 className="b-card-title">{post.title}</h3>
        <p className="b-card-excerpt">{post.excerpt}</p>
        <div className="b-card-meta">
          <span>{post.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}

function BlogIndex() {
  const [activeTopic, setActiveTopic] = useState<BlogTopic | null>(null);
  const [query, setQuery] = useState("");

  const featured = BLOG_POSTS.slice(0, 1)[0];
  const pathway = [
    { step: 1, text: "Start with one question. Answer it out loud." },
    { step: 2, text: "Listen back a week later. Notice the difference." },
    { step: 3, text: "Watch patterns surface across months." },
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
      {/* Sticky header */}
      <header className="b-header" role="banner">
        <div className="b-header-inner">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo.svg" alt="ÉCHO" width={32} height={32} />
            <span>ÉCHO</span>
          </Link>
          <nav className="b-nav" aria-label="Blog navigation">
            <Link to="/blog" className="b-nav-link active">Journal</Link>
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTopic(activeTopic === t ? null : t)}
                className={`b-nav-link${activeTopic === t ? " active" : ""}`}
              >
                {TOPIC_LABELS[t]}
              </button>
            ))}
          </nav>
          <a {...APP_STORE_LINK_PROPS} className="b-header-cta">
            Download ÉCHO
          </a>
        </div>
      </header>

      <main>
        {/* Hero grid */}
        <section className="b-home-grid" aria-label="Featured content">
          {/* Intro */}
          <div className="b-intro">
            <p className="b-intro-kicker">The ÉCHO Journal</p>
            <h1 className="b-intro-heading">
              Reflection starts with a single spoken sentence.
            </h1>
            <p className="b-intro-body">
              Articles on voice journaling, daily reflection, and understanding yourself over time. No performance required.
            </p>
            <Link to="/blog/$slug" params={{ slug: "what-is-voice-journaling" }} className="b-intro-link">
              Start here: what is voice journaling →
            </Link>
          </div>

          {/* Question card */}
          <div className="b-qcard" aria-label="Today's prompt">
            <p className="b-qcard-label">Today's question</p>
            <p className="b-qcard-q">What moment from today am I still thinking about?</p>
            <a {...APP_STORE_LINK_PROPS} className="b-qcard-cta">
              Answer in ÉCHO →
            </a>
          </div>

          {/* Pathway */}
          <div className="b-pathway" aria-label="How it works">
            <p className="b-pathway-label">How it works</p>
            <ol className="b-pathway-steps">
              {pathway.map((item) => (
                <li key={item.step} className="b-pathway-step">
                  <span className="b-pathway-num">{item.step}</span>
                  <span className="b-pathway-text">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Library */}
          <div className="b-library" aria-label="Article library">
            <div className="b-library-head">
              <h2 className="b-library-title">All articles</h2>
              <div className="b-filters" role="group" aria-label="Filter by topic">
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  className={`b-filter-chip${activeTopic === null ? " active" : ""}`}
                >
                  All
                </button>
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTopic(activeTopic === t ? null : t)}
                    className={`b-filter-chip${activeTopic === t ? " active" : ""}`}
                  >
                    {TOPIC_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="b-search-wrap">
                <label htmlFor="blog-search" className="sr-only">Search articles</label>
                <input
                  id="blog-search"
                  type="search"
                  placeholder="Search articles…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="b-search"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="b-empty">No articles match. <button type="button" onClick={() => { setActiveTopic(null); setQuery(""); }} className="b-empty-reset">Clear filters</button></p>
            ) : (
              <div className="b-cards">
                {filtered.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Letters / newsletter */}
          <div className="b-letters" aria-label="Newsletter">
            <div className="b-letters-inner">
              <p className="b-letters-kicker">Letters from ÉCHO</p>
              <h2 className="b-letters-heading">Quiet notes on reflection, once a month.</h2>
              <p className="b-letters-body">
                No noise. Just a short letter on something worth sitting with. Unsubscribe any time.
              </p>
              <form
                className="b-letters-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                  window.location.href = `mailto:hello@reaclyse.com?subject=Subscribe&body=Email: ${email}`;
                }}
              >
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="b-letters-input"
                />
                <button type="submit" className="b-letters-submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
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
