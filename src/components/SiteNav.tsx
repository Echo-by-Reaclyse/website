import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export interface NavLink {
  label: string;
  /** Route path — renders as a <Link> */
  to?: string;
  /** Anchor id (without #) — renders as a scroll button */
  anchor?: string;
}

export interface NavCTA {
  label: string;
  /** Route path — renders as a <Link> */
  to?: string;
  /** Scroll to this anchor id (without #) — renders as a button */
  anchor?: string;
}

interface SiteNavProps {
  links: NavLink[];
  cta: NavCTA;
}

export function SiteNav({ links, cta }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const navActive = scrolled || menuOpen;

  return (
    <header
      className="site-nav-header"
      style={{
        position: "fixed",
        top: "var(--banner-height, 0px)",
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: navActive ? "blur(18px) saturate(150%)" : "none",
        WebkitBackdropFilter: navActive ? "blur(18px) saturate(150%)" : "none",
        background: navActive ? "var(--nav-bg)" : "transparent",
        borderBottom: navActive ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
      }}
    >

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px clamp(16px, 4vw, 32px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "flex-end", gap: 8 }}>
          <img src="/logo-main.svg" alt="ÉCHO" style={{ height: 22, width: "auto", opacity: 0.92 }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--muted-foreground)",
              paddingBottom: 2,
              opacity: scrolled ? 0 : 1,
              transition: "opacity 0.25s",
            }}
            className="hidden sm:block"
          >
            by RÉACLYSE
          </span>
        </Link>

        {/* Centre links — hidden on mobile */}
        <nav
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 28, flex: 1, justifyContent: "center" }}
          aria-label="Site navigation"
        >
          {links.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="site-nav-link">
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.anchor!)}
                className="site-nav-link"
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Right: ThemeToggle + CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <ThemeToggle />

          {/* CTA — hidden on mobile (accessible via hamburger drawer below) */}
          <span className="hidden sm:block">
            {cta.to ? (
              <Link to={cta.to} className="site-nav-cta">
                {cta.label}
              </Link>
            ) : (
              <button onClick={() => scrollTo(cta.anchor!)} className="site-nav-cta">
                {cta.label}
              </button>
            )}
          </span>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 2, flexShrink: 0 }}
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            padding: "8px 24px 16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="site-nav-link"
                style={{ padding: "8px 0", display: "block" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.anchor!)}
                className="site-nav-link"
                style={{ padding: "8px 0", textAlign: "left" }}
              >
                {link.label}
              </button>
            )
          )}
          {/* CTA in mobile drawer */}
          <div style={{ marginTop: 8 }}>
            {cta.to ? (
              <Link to={cta.to} className="site-nav-cta" onClick={() => setMenuOpen(false)}>
                {cta.label}
              </Link>
            ) : (
              <button onClick={() => scrollTo(cta.anchor!)} className="site-nav-cta">
                {cta.label}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
