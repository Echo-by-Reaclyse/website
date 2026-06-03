import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { InnerPage } from "@/components/InnerPage";
import { getPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <InnerPage title={post.title} subtitle={`${post.date} · ${post.readingTime}`}>
      <title>{post.title} — ÉCHO Journal</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={`https://www.echobyreaclyse.com/blog/${post.slug}`} />
      <meta property="og:title" content={`${post.title} — ÉCHO Journal`} />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={`https://www.echobyreaclyse.com/blog/${post.slug}`} />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${post.title} — ÉCHO Journal`} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: "Réaclyse",
              url: "https://reaclyse.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Réaclyse",
              url: "https://reaclyse.com",
            },
            url: `https://www.echobyreaclyse.com/blog/${post.slug}`,
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
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://www.echobyreaclyse.com/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />

      <Link
        to="/blog"
        className="font-sans text-sm text-ember hover:opacity-75 transition-opacity"
      >
        ← Back to The ÉCHO Journal
      </Link>

      <div className="mt-10 space-y-10">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="font-display text-2xl text-ink mb-3">{section.heading}</h2>
            )}
            <div className="space-y-4">
              {section.body.split("\n\n").map((para, j) => (
                <p key={j} className="font-sans leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <p className="font-display text-2xl text-ink mb-2">Try ÉCHO when it launches.</p>
        <p className="font-sans text-sm text-muted-foreground mb-4">
          Join the waitlist for early access and founding-member pricing.
        </p>
        <Link
          to="/"
          className="font-sans text-sm text-ember hover:opacity-75 transition-opacity"
        >
          Join the waitlist →
        </Link>
      </div>
    </InnerPage>
  );
}
