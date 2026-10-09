import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { PROMPT_GROUPS } from "@/lib/blog-prompts";
import { BLOG_POSTS, TOPIC_LABELS } from "@/lib/blog-posts";
import { CopyButton } from "@/components/blog/CopyButton";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/blog/voice-journaling-prompts")({
  component: PromptsPage,
});

const BASE = "https://www.echobyreaclyse.com";
const PAGE_URL = `${BASE}/blog/voice-journaling-prompts`;

const related = BLOG_POSTS.filter((p) =>
  ["daily-reflection-questions", "what-is-voice-journaling", "build-journaling-habit"].includes(p.slug)
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
      <meta
        property="og:description"
        content="35 short voice journaling prompts in seven groups. Copy one and start."
      />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:image" content={`${BASE}/blog-og/voice-journaling-prompts.png`} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal" />
      <meta
        name="twitter:description"
        content="35 short voice journaling prompts in seven groups. Copy one and start."
      />
      <meta name="twitter:image" content={`${BASE}/blog-og/voice-journaling-prompts.png`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
              { "@type": "ListItem", position: 3, name: "35 Voice Journaling Prompts", item: PAGE_URL },
            ],
          }),
        }}
      />

      {/* Sticky header */}
      <header className="b-header" role="banner">
        <div className="b-header-inner b-wrap">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo.svg" alt="ÉCHO" width={32} height={32} />
            <span>ÉCHO</span>
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
        {/* Breadcrumb */}
        <nav className="b-crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li aria-current="page">35 Voice Journaling Prompts</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="b-prompts-hero">
          <span className="b-topic-label">{TOPIC_LABELS["prompts"]}</span>
          <h1 className="b-article-h1">35 voice journaling prompts to answer out loud</h1>
          <p className="b-article-desc">
            Seven groups for different moments. Copy one, open ÉCHO, and answer it. No preparation required.
          </p>
          <div className="b-byline">
            <span>The ÉCHO Team</span>
            <span aria-hidden="true">·</span>
            <time dateTime="2026-10-08">8 Oct 2026</time>
            <span aria-hidden="true">·</span>
            <span>5 min read</span>
          </div>
        </div>

        {/* Jump links */}
        <section className="b-jump-links">
          <h2>Jump to:</h2>
          <nav aria-label="Jump to prompt group">
            {PROMPT_GROUPS.map((g) => (
              <a key={g.id} href={`#${g.anchor}`}>{g.name}</a>
            ))}
          </nav>
        </section>

        {/* Care note */}
        <div className="b-care-note">
          <p>
            <strong>A note on difficult prompts:</strong> Some of these questions touch on anxiety, relationships, and things you've been avoiding. If you find yourself in distress, please{" "}
            <Link to="/find-support">find support here</Link>. ÉCHO is a reflection tool, not a crisis service.
          </p>
        </div>

        {/* Prompt groups */}
        {PROMPT_GROUPS.map((group, groupIndex) => (
          <section key={group.id} className="b-prompt-group" id={group.anchor} aria-labelledby={`group-${group.id}`}>
            <div className="b-prompt-group-head">
              <p className="b-prompt-group-num">Group {groupIndex + 1} of {PROMPT_GROUPS.length}</p>
              <h2 id={`group-${group.id}`} className="b-prompt-group-name">{group.name}</h2>
              <p className="b-prompt-group-intro">{group.intro}</p>
            </div>

            <ol className="b-prompt-list">
              {group.prompts.map((prompt) => (
                <li key={prompt.id} className="b-prompt-item">
                  <span className="b-prompt-num">{prompt.number}</span>
                  <p className="b-prompt-text">{prompt.text}</p>
                  <CopyButton text={prompt.text} />
                </li>
              ))}
            </ol>

            {/* Product invite after group 4 */}
            {groupIndex === 3 && (
              <div className="b-invite b-invite--inline">
                <div className="b-invite-inner">
                  <p className="b-invite-kicker">ÉCHO</p>
                  <h2 className="b-invite-heading">Answer these out loud, not in writing.</h2>
                  <p className="b-invite-body">
                    ÉCHO gives you one question a day and transcribes your answer on your device. Free to start.
                  </p>
                  <a {...APP_STORE_LINK_PROPS} className="b-invite-cta">
                    Download on the App Store
                  </a>
                </div>
              </div>
            )}
          </section>
        ))}

        {/* How to use section */}
        <section className="b-how-to" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading">How to use these prompts</h2>
          <p>
            Pick one question. Open a voice memo app or ÉCHO. Press record. Answer it out loud for sixty seconds without stopping. The value is in not editing — whatever comes out first is the honest version.
          </p>
          <p>
            You don't need to answer every prompt. You don't need to work through them in order. Find one that produces a slight resistance — that's usually the right one.
          </p>
          <p>
            If you want to build a daily habit, pick one group and work through it across a week: one prompt per day. By day five, you'll have said things you didn't know you thought.
          </p>
        </section>

        {/* FAQ */}
        <section className="b-faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Common questions</h2>
          <dl>
            <div className="b-faq-item">
              <dt>Do I have to answer out loud?</dt>
              <dd>No, but speaking produces more honest answers than writing for most people. The absence of an edit key changes what comes out. Try it once before deciding it isn't for you.</dd>
            </div>
            <div className="b-faq-item">
              <dt>How long should my answer be?</dt>
              <dd>Sixty to ninety seconds is enough. The best answers are usually the ones where you say the obvious thing in the first sentence and then surprise yourself in the next one.</dd>
            </div>
            <div className="b-faq-item">
              <dt>What if I can't answer a prompt?</dt>
              <dd>That's useful information too. Say out loud why you can't answer it. You'll often find the thing you're avoiding is exactly what the prompt was pointing toward.</dd>
            </div>
            <div className="b-faq-item">
              <dt>Can I use these in written journaling?</dt>
              <dd>Yes. Any reflection is better than none. But these prompts were written with spoken answers in mind — they're short, direct, and don't require much setup. Give voice a try first.</dd>
            </div>
          </dl>
        </section>

        {/* Author */}
        <div className="b-author">
          <div className="b-author-avatar" aria-hidden="true">É</div>
          <div className="b-author-info">
            <p className="b-author-name">The ÉCHO Team</p>
            <p className="b-author-bio">
              The team behind ÉCHO — a private voice journal for iPhone, built by RÉACLYSE in Luxembourg.
            </p>
          </div>
        </div>

        {/* Related reading */}
        {related.length > 0 && (
          <section className="b-related" aria-label="Related articles">
            <h2 className="b-related-heading">Read next</h2>
            <div className="b-related-grid">
              {related.map((rel) => (
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
