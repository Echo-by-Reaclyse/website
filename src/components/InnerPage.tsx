import { Link } from "@tanstack/react-router";
import { SiteNav } from "./SiteNav";

interface InnerPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: "How it works", to: "/early-access" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
];

const NAV_CTA = { label: "Join waitlist", to: "/early-access" };

const FOOTER_PRODUCT = [
  { label: "FAQ", to: "/faq" },
  { label: "About ÉCHO", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Privacy", to: "/privacy" },
];

const FOOTER_COMPANY = [
  { label: "About Réaclyse", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/privacy" },
];

export function InnerPage({ title, subtitle, children }: InnerPageProps) {
  return (
    <div className="relative min-h-screen bg-background [overflow-x:clip]">
      <SiteNav links={NAV_LINKS} cta={NAV_CTA} />

      {/* ── Content ── */}
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-20 sm:px-6 sm:pt-24">
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
            to="/early-access"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.65rem 1.5rem",
              borderRadius: 100,
              background: "#BF6040",
              color: "#fff",
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

      {/* ── Footer — ECH-113 ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(191,96,64,0.12)",
          padding: "3rem clamp(1.25rem, 5vw, 4rem) 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src="/logo-main.svg" alt="ÉCHO" style={{ height: 20, width: "auto", opacity: 0.85 }} />
            </Link>
            <p className="font-sans text-xs text-muted-foreground" style={{ lineHeight: 1.65, maxWidth: 200, margin: 0 }}>
              A private voice journal for iPhone. Launching 2026.
            </p>
          </div>

          {/* Product */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#BF6040", margin: 0 }}
            >
              Product
            </p>
            {FOOTER_PRODUCT.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-sans text-sm text-muted-foreground transition hover:text-ink"
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#BF6040", margin: 0 }}
            >
              Company
            </p>
            {FOOTER_COMPANY.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-sans text-sm text-muted-foreground transition hover:text-ink"
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Get the app */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#BF6040", margin: 0 }}
            >
              Get ÉCHO
            </p>
            <p className="font-sans text-sm text-muted-foreground" style={{ margin: 0, lineHeight: 1.55 }}>
              Coming to the App Store in 2026.
            </p>
            <Link
              to="/early-access"
              className="font-sans text-sm font-semibold"
              style={{
                color: "#BF6040",
                textDecoration: "none",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {/* TODO ECH-108: replace with App Store link when app ships */}
              Join the waitlist →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1100,
            margin: "2rem auto 0",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(191,96,64,0.10)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p className="font-sans text-xs text-muted-foreground" style={{ margin: 0 }}>
            © 2026 Réaclyse S.à r.l. · Luxembourg
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {([
              { label: "Privacy", to: "/privacy" },
              { label: "Terms", to: "/privacy" },
              { label: "Contact", to: "/contact" },
            ] as { label: string; to: string }[]).map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-sans text-xs text-muted-foreground transition hover:text-ink"
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
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
