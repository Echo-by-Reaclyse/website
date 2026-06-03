import { createFileRoute, Link } from "@tanstack/react-router";
import { InnerPage } from "@/components/InnerPage";
import { BLOG_POSTS } from "@/lib/blog-posts";

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
            <article className="border border-border rounded-xl p-6 transition-shadow hover:shadow-md card-lift">
              <p className="font-sans text-xs text-ember uppercase tracking-widest mb-2">
                {post.readingTime}
              </p>
              <h2 className="font-display text-2xl text-ink mb-2 group-hover:opacity-80 transition-opacity">
                {post.title}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-3">
                {post.description}
              </p>
              <span className="font-sans text-sm text-ember">Read article →</span>
            </article>
          </Link>
        ))}
      </div>
    </InnerPage>
  );
}
