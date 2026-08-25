import { createFileRoute, Link } from "@tanstack/react-router";
import { InnerPage } from "@/components/InnerPage";
import { BLOG_POSTS } from "@/lib/blog-posts";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <InnerPage
      title="The ÉCHO Journal"
      subtitle="Thoughts on reflection, voice, and building a healthier inner life."
    >
      <title>The ÉCHO Journal — Voice Journaling Articles</title>
      <meta
        name="description"
        content="Articles on voice journaling, daily reflection, building better habits, and long-term self-understanding. By the team behind ÉCHO."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/blog" />
      <meta property="og:title" content="The ÉCHO Journal — Voice Journaling Articles" />
      <meta
        property="og:description"
        content="Articles on voice journaling, daily reflection, building better habits, and long-term self-understanding. By the team behind ÉCHO."
      />
      <meta property="og:url" content="https://www.echobyreaclyse.com/blog" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The ÉCHO Journal — Voice Journaling Articles" />
      <meta
        name="twitter:description"
        content="Articles on voice journaling, daily reflection, building better habits, and long-term self-understanding. By the team behind ÉCHO."
      />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.echobyreaclyse.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.echobyreaclyse.com/blog",
              },
            ],
          }),
        }}
      />

      <div className="mt-10 space-y-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block group"
          >
            <article className="border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md card-lift">
              {/* ECH-120: Replace placeholder with real cover image at /blog-covers/{post.slug}.jpg when assets are ready (ECH-85) */}
              <div
                className="w-full bg-[rgba(191,96,64,0.06)] border-b border-border flex items-center justify-center"
                style={{ height: 160 }}
                aria-hidden="true"
              >
                <span className="font-display text-3xl text-[rgba(191,96,64,0.25)] select-none">ÉCHO</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-sans text-xs text-ember uppercase tracking-widest">
                    {post.readingTime}
                  </p>
                  <span className="text-border text-xs">·</span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {formatDate(post.date)}
                  </p>
                  <span className="text-border text-xs">·</span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {post.author}
                  </p>
                </div>
                <h2 className="font-display text-2xl text-ink mb-2 group-hover:opacity-80 transition-opacity sm:text-3xl leading-tight">
                  {post.title}
                </h2>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-4">
                  {post.description}
                </p>
                <span className="font-sans text-sm text-ember">Read article →</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </InnerPage>
  );
}
