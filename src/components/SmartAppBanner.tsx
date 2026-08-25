import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const DISMISSED_KEY = "echo_app_banner_dismissed";

// ECH-108: Pre-launch smart app banner for mobile visitors.
// Shows above the nav on mobile, can be dismissed.
// TODO: When app is on the App Store, replace the CTA with a real App Store link.
export function SmartAppBanner() {
  const [visible, setVisible] = useState(false);

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
      role="banner"
      aria-label="Get ÉCHO on the App Store"
      style={{
        position: "relative",
        zIndex: 100,
        width: "100%",
        background: "rgba(10,18,32,0.97)",
        borderBottom: "1px solid rgba(191,96,64,0.20)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          Private voice journal · Coming to iOS
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/early-access"
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
        Join waitlist
      </Link>
    </div>
  );
}
