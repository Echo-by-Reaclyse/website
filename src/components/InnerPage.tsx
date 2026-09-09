import { Link } from "@tanstack/react-router";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

interface InnerPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
];

const NAV_CTA = { label: "Join waitlist", to: "/" };

export function InnerPage({ title, subtitle, children }: InnerPageProps) {
  return (
    <div className="relative min-h-screen bg-background [overflow-x:clip]">
      <SiteNav links={NAV_LINKS} cta={NAV_CTA} />

      {/* ── Content ── */}
      <main id="main-content" className="mx-auto max-w-2xl px-4 pb-24 pt-20 sm:px-6 sm:pt-24">
        <h1 className="font-display text-5xl text-ink leading-tight tracking-tight sm:text-6xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 font-sans text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-10 space-y-8">{children}</div>

        {/* Waitlist CTA — ECH-111 */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem 1.75rem",
            borderRadius: "1.25rem",
            border: "1px solid rgba(191,96,64,0.22)",
            background: "rgba(191,96,64,0.05)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.45rem",
              lineHeight: 1.25,
              color: "var(--ink)",
              marginBottom: "0.5rem",
            }}
          >
            Start hearing your own voice clearly.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            ÉCHO is launching in 2026. Join the waitlist for early access and founding-member pricing.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.65rem 1.5rem",
              borderRadius: 100,
              background: "#BF6040",
              color: "#0A1220",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Join the waitlist →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-2 font-sans leading-relaxed text-muted-foreground break-words">{children}</div>
    </section>
  );
}
