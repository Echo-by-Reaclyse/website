import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { PROMPT_GROUPS } from "@/lib/blog-prompts";
import { BLOG_POSTS, TOPIC_LABELS } from "@/lib/blog-posts";
import { CopyButton } from "@/components/blog/CopyButton";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import { SiteFooter } from "@/components/SiteFooter";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/blog/voice-journaling-prompts")({
  component: PromptsPage,
});

const BASE = "https://www.echobyreaclyse.com";
const PAGE_URL = `${BASE}/blog/voice-journaling-prompts`;

const related = BLOG_POSTS.filter((p) =>
  ["what-is-voice-journaling", "evening-journaling", "how-to-reflect-on-your-day"].includes(p.slug)
);

function PromptsPage() {
  return (
    <div className="blog-scope">
      {/* SEO */}
      <title>35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal</title>
      <meta
        name="description"
        content="35 short voice journaling prompts in seven groups: evening, anxious days, gratitude, big decisions, self-discovery, relationships and your future self. Copy one and start."
      />
      <link rel="canonical" href={PAGE_URL} />
      <meta property="og:title" content="35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal" />
      <meta property="og:description" content="35 short voice journaling prompts in seven groups. Copy one and start." />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:image" content={`${BASE}/blog-og/voice-journaling-prompts.png`} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal" />
      <meta name="twitter:description" content="35 short voice journaling prompts in seven groups. Copy one and start." />
      <meta name="twitter:image" content={`${BASE}/blog-og/voice-journaling-prompts.png`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Journal", item: `${BASE}/blog` },
              { "@type": "ListItem", position: 3, name: "35 Voice Journaling Prompts", item: PAGE_URL },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "New to voice journaling?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pick one prompt. Open a voice memo app or ÉCHO. Press record. Answer it out loud for sixty seconds without stopping. The value is in not editing — whatever comes out first is the honest version. If you want to build a daily habit, pick one group and work through it across a week: one prompt per day. By day five, you will have said things you did not know you thought.",
                },
              },
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
            <Link to="/blog" className="b-nav-link">Journal</Link>
            <Link to="/blog/voice-journaling-prompts" className="b-nav-link active">Prompts</Link>
          </nav>
          <a {...APP_STORE_LINK_PROPS} className="b-header-cta">
            Explore ÉCHO
          </a>
        </div>
      </header>

      <main>
        <div className="b-wrap">

          {/* Breadcrumb */}
          <nav className="b-crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blog">Journal</Link></li>
              <li aria-current="page">Prompt library</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="b-prompts-hero">
            <p className="b-prompts-kicker">35 questions · No account needed</p>
            <h1 className="b-prompts-h1">
              35 voice journaling prompts
              <span className="b-prompts-sub">to answer out loud.</span>
            </h1>
            <p className="b-prompts-desc">
              Find a question for the moment you are in.
              Choose what is on your mind. Pick one question. Take it at your own pace.
            </p>
          </div>

          {/* Start here box */}
          <div className="b-start-here">
            <strong>Start here:</strong> choose a prompt, speak for about a minute, and stop whenever you need to. You can also ask any question.
          </div>

          {/* Category pills */}
          <nav className="b-prompt-pills" aria-label="Jump to prompt group">
            {PROMPT_GROUPS.map((g) => (
              <a key={g.id} href={`#${g.anchor}`} className="b-prompt-pill">
                {g.name}
              </a>
            ))}
          </nav>

          {/* Two-column layout: sidebar + prompts */}
          <div className="b-prompts-layout">

            {/* Sidebar */}
            <aside className="b-prompts-sidebar" aria-label="Browse by prompt group">
              <p className="b-prompts-sidebar-heading">Browse by prompt</p>
              <nav>
                {PROMPT_GROUPS.map((g) => (
                  <a key={g.id} href={`#${g.anchor}`} className="b-sidebar-group-link">
                    <span className="b-sidebar-group-name">{g.name}</span>
                    <span className="b-sidebar-count">{g.prompts.length} prompts</span>
                  </a>
                ))}
              </nav>
              <div className="b-sidebar-promo">
                <p className="b-sidebar-promo-title">Make the question yours.</p>
                <p className="b-sidebar-promo-body">
                  You can adapt the wording or choose another prompt whenever you want.
                </p>
                <a href="#evening" className="b-sidebar-promo-link">browse all prompts →</a>
              </div>
            </aside>

            {/* Main content */}
            <div className="b-prompts-main">
              {PROMPT_GROUPS.map((group, groupIndex) => (
                <section
                  key={group.id}
                  className="b-prompt-group"
                  id={group.anchor}
                  aria-labelledby={`group-${group.id}`}
                >
                  <div className="b-prompt-group-head">
                    <div className="b-prompt-group-row">
                      <h2 id={`group-${group.id}`} className="b-prompt-group-name">
                        {group.name}
                      </h2>
                      <span className="b-prompt-count">{group.prompts.length} prompts</span>
                    </div>
                    <p className="b-prompt-group-intro">{group.intro}</p>
                  </div>

                  <ol className="b-prompt-list">
                    {group.prompts.map((prompt) => (
                      <li key={prompt.id} className="b-prompt-item">
                        <span className="b-prompt-num">
                          {String(prompt.number).padStart(2, "0")}
                        </span>
                        <p className="b-prompt-text">{prompt.text}</p>
                        <CopyButton text={prompt.text} label={`Copy prompt ${prompt.number}`} />
                      </li>
                    ))}
                  </ol>

                  {/* Mid-content invite after Gratitude */}
                  {groupIndex === 2 && (
                    <div className="b-invite b-invite--blue">
                      <div className="b-invite-inner">
                        <p className="b-invite-kicker">Make it yours</p>
                        <h2 className="b-invite-heading">One question is enough to begin.</h2>
                        <p className="b-invite-body">
                          Try a short reflection. Explore ÉCHO when you are ready.
                        </p>
                      </div>
                      <a {...APP_STORE_LINK_PROPS} className="b-invite-cta">
                        Explore ÉCHO
                      </a>
                    </div>
                  )}
                </section>
              ))}

              {/* A gentle note */}
              <div className="b-gentle-note" role="note">
                <p className="b-gentle-note-title">A gentle note</p>
                <p className="b-gentle-note-body">
                  These questions are for personal reflection, not a substitute for mental health care.
                  You do not have to work through something difficult alone.{" "}
                  <Link to="/find-support" className="b-body-link">Find support here.</Link>
                </p>
              </div>

              {/* FAQ — single accordion item */}
              <div className="b-prompts-faq">
                <details className="b-prompts-faq-item">
                  <summary className="b-prompts-faq-q">
                    <span>New to voice journaling?</span>
                    <span className="b-prompts-faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div className="b-prompts-faq-a">
                    <p>
                      Pick one prompt. Open a voice memo app or ÉCHO. Press record. Answer it out loud
                      for sixty seconds without stopping. The value is in not editing — whatever comes
                      out first is the honest version.
                    </p>
                    <p>
                      If you want to build a daily habit, pick one group and work through it across a
                      week: one prompt per day. By day five, you will have said things you did not know
                      you thought.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Related reading */}
          {related.length > 0 && (
            <section className="b-related" aria-label="Related guides">
              <p className="b-related-kicker">Make a little room</p>
              <h2 className="b-related-heading">Keep your practice simple.</h2>
              <div className="b-related-list">
                {related.map((rel) => (
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
                      <span className="b-related-cta">Read the guide</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>{/* end b-wrap */}
      </main>

      <SiteFooter />
    </div>
  );
}
