import { useState, useEffect, useRef } from "react";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";

const DISMISSED_KEY = "echo_app_banner_dismissed";

// ECH-108: smart app banner for mobile visitors.
// Rendered inside SiteNav (which is position:fixed), so it naturally
// stacks above the nav row without any extra positioning.
// Was a pre-launch banner pointing at the waitlist; 1.0 went live 29 Sep 2026
// and it now links to the listing.
export function SmartAppBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // sessionStorage unavailable (private mode) — don't show
      return;
    }
    // Only show on mobile-width screens
    const isMobile = window.innerWidth < 768;
    if (isMobile) setVisible(true);
  }, []);

  // The nav (with this banner) is position:fixed, so it doesn't reserve layout
  // space. Reserve the banner's height as body top-padding while it's shown, so
  // it never overlaps page content. Cleared on dismiss/unmount.
  useEffect(() => {
    if (!visible) return;
    const el = bannerRef.current;
    if (!el) return;
    const apply = () => { document.body.style.paddingTop = `${el.offsetHeight}px`; };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      document.body.style.paddingTop = "";
    };
  }, [visible]);

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="banner"
      aria-label="Get ÉCHO on the App Store"
      style={{
        width: "100%",
        background: "rgba(10,18,32,0.97)",
        borderBottom: "1px solid rgba(191,96,64,0.20)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
      }}
    >
      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        style={{
          background: "none",
          border: "none",
          padding: "4px 6px",
          cursor: "pointer",
          color: "rgba(255,246,233,0.45)",
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>

      {/* App icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "linear-gradient(135deg, #BF6040, #9B3D1A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(191,96,64,0.35)",
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: 20 }}>É</span>
      </div>

      {/* App info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,246,233,0.92)",
            fontFamily: "Urbanist, sans-serif",
            lineHeight: 1.2,
          }}
        >
          ÉCHO
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "rgba(255,246,233,0.45)",
            fontFamily: "Urbanist, sans-serif",
            lineHeight: 1.3,
            marginTop: 1,
          }}
        >
          Private voice journal · On the App Store
        </p>
      </div>

      {/* CTA */}
      <a
        {...APP_STORE_LINK_PROPS}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "7px 14px",
          borderRadius: 100,
          background: "#BF6040",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "Urbanist, sans-serif",
          textDecoration: "none",
          flexShrink: 0,
          whiteSpace: "nowrap",
          letterSpacing: "0.01em",
        }}
      >
        Get
      </a>
    </div>
  );
}
