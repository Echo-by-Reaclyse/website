import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { COMPETITORS } from "@/lib/competitors";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";
import { SiteFooter } from "@/components/SiteFooter";
import "@/styles/blog.css";

export const Route = createLazyFileRoute("/vs/$competitor")({
  component: VsPage,
});

const BASE = "https://www.echobyreaclyse.com";

function renderVal(val: boolean | string, echoCol: boolean) {
  if (val === true) return echoCol ? "✓" : "✓";
  if (val === false) return "✗";
  return val as string;
}

function VsPage() {
  const { competitor } = Route.useParams();
  const data = COMPETITORS.find((c) => c.slug === competitor);

  if (!data) {
    return (
      <div className="blog-scope">
        <main>
          <div className="b-wrap" style={{ padding: "80px 0", textAlign: "center" }}>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "36px", marginBottom: "16px" }}>
              Comparison not found
            </h1>
            <Link to="/blog" style={{ color: "#BF6040" }}>← Back to journal</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const pageUrl = `${BASE}/vs/${data.slug}`;
  const others = COMPETITORS.filter((c) => c.slug !== data.slug);

  return (
    <div className="blog-scope">
      <title>{`ÉCHO vs ${data.name} | ÉCHO Journal`}</title>
      <meta name="description" content={data.metaDescription} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content={`ÉCHO vs ${data.name} | ÉCHO Journal`} />
      <meta property="og:description" content={data.metaDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${BASE}/og-image.png`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`ÉCHO vs ${data.name} | ÉCHO Journal`} />
      <meta name="twitter:description" content={data.metaDescription} />
      <meta name="twitter:image" content={`${BASE}/og-image.png`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE}/vs/` },
              { "@type": "ListItem", position: 3, name: `ÉCHO vs ${data.name}`, item: pageUrl },
            ],
          }),
        }}
      />

      {/* Header */}
      <header className="b-header" role="banner">
        <div className="b-header-inner b-wrap">
          <Link to="/" className="b-logo" aria-label="ÉCHO home">
            <img src="/logo-main.svg" alt="ÉCHO" height={22} style={{ width: "auto" }} />
          </Link>
          <nav className="b-nav" aria-label="Site navigation">
            <Link to="/blog" className="b-nav-link">Journal</Link>
            <Link to="/blog/voice-journaling-prompts" className="b-nav-link">Prompts</Link>
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
              <li aria-current="page">ÉCHO vs {data.name}</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="b-vs-hero">
            <span className="b-vs-kicker">Side by side</span>
            <h1 className="b-vs-h1">
              ÉCHO vs {data.name}
              <span className="b-vs-sub">{data.heroSubtitle}</span>
            </h1>
            <p className="b-vs-intro">{data.intro}</p>
          </div>

          {/* At a glance */}
          <div className="b-vs-glance">
            <div className="b-vs-glance-card echo-card">
              <p className="b-vs-glance-label">ÉCHO</p>
              <p className="b-vs-glance-name">ÉCHO by RÉACLYSE</p>
              <div className="b-vs-glance-meta">
                <strong>Category:</strong> Voice Journaling App<br />
                <strong>Price:</strong> {data.echoPrice}<br />
                <strong>Platform:</strong> {data.echoPlatform}<br />
                <strong>Positioning:</strong> Voice-first daily reflection
              </div>
            </div>
            <div className="b-vs-glance-card">
              <p className="b-vs-glance-label">{data.name}</p>
              <p className="b-vs-glance-name">{data.name}</p>
              <div className="b-vs-glance-meta">
                <strong>Category:</strong> {data.category}<br />
                <strong>Price:</strong> {data.competitorPrice}<br />
                <strong>Platform:</strong> {data.competitorPlatform}<br />
                <strong>Positioning:</strong> {data.tagline}
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="b-vs-table">
            <h2 className="b-vs-table-title">Feature comparison</h2>
            <div className="b-vs-table-grid">
              <div className="b-vs-table-header">
                <span>Feature</span>
                <span>ÉCHO</span>
                <span>{data.name}</span>
              </div>
              {data.features.map((f, i) => (
                <div key={i} className="b-vs-table-row">
                  <span className="b-vs-feat">{f.name}</span>
                  <span className="b-vs-echo-val">{renderVal(f.echo, true)}</span>
                  <span className="b-vs-comp-val">{renderVal(f.competitor, false)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why ÉCHO */}
          <div className="b-vs-strengths">
            <h2 className="b-vs-strengths-title">Where ÉCHO goes further</h2>
            <div className="b-vs-strengths-grid">
              {data.strengths.map((s, i) => (
                <div key={i} className="b-vs-strength-card">
                  <span className="b-vs-strength-num">0{i + 1}</span>
                  <p className="b-vs-strength-title">{s.title}</p>
                  <p className="b-vs-strength-body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who it's for */}
          <div className="b-vs-for">
            <div className="b-vs-for-card echo-side">
              <span className="b-vs-for-label">ÉCHO is a better fit if…</span>
              <p className="b-vs-for-body">{data.echoFor}</p>
            </div>
            <div className="b-vs-for-card comp-side">
              <span className="b-vs-for-label">{data.name} might suit you if…</span>
              <p className="b-vs-for-body">{data.competitorFor}</p>
            </div>
          </div>

          {/* Verdict */}
          <div className="b-vs-verdict">
            <span className="b-vs-verdict-label">Our take</span>
            <p className="b-vs-verdict-text">{data.verdict}</p>
            <a {...APP_STORE_LINK_PROPS} className="b-vs-cta">
              Try ÉCHO free
            </a>
          </div>

          {/* Other comparisons */}
          <div className="b-vs-others">
            <p className="b-vs-others-title">Compare ÉCHO with</p>
            <div className="b-vs-others-grid">
              {others.map((c) => (
                <Link key={c.slug} to="/vs/$competitor" params={{ competitor: c.slug }} className="b-vs-other-link">
                  vs {c.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
