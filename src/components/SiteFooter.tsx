import { Link } from "@tanstack/react-router";

const FOOTER_PRODUCT = [
  { label: "FAQ", to: "/faq" },
  { label: "About ÉCHO", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Privacy", to: "/privacy" },
];

const FOOTER_COMPANY = [
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/terms" },
  { label: "GDPR", to: "/gdpr" },
];

export function SiteFooter() {
  return (
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

        {/* Get ÉCHO */}
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
          <a
            href="/#waitlist"
            className="font-sans text-sm font-semibold"
            style={{
              color: "#BF6040",
              textDecoration: "none",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            onClick={(e) => {
              const el = document.getElementById("waitlist");
              if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
            }}
          >
            Join the waitlist →
          </a>
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
          © 2026 ÉCHO by RÉACLYSE S.à r.l.-S · Luxembourg
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {([
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
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
  );
}
