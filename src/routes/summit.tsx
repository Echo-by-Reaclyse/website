import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Instagram, Mic, RotateCcw, Shield } from "lucide-react";

export const Route = createFileRoute("/summit")({
  component: Summit,
});

// ── Palette ────────────────────────────────────────────────────
const C = {
  bg: "#FAF7F4",
  ink: "#1C0E06",
  inkMuted: "rgba(28,14,6,0.52)",
  ember: "#BF6040",
  pink: "#D63B72",
  pinkDim: "rgba(214,59,114,0.09)",
  pinkBorder: "rgba(214,59,114,0.30)",
  cardBg: "rgba(0,0,0,0.025)",
  cardBorder: "rgba(0,0,0,0.08)",
};

// ── Animation helpers ──────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.72, ease: EASE, delay },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: EASE, delay },
});

// ── Features data ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: Mic,
    label: "Speak, don't type",
    desc: "One question a day. Say what's on your mind. ÉCHO turns your voice into a private reflection.",
    accent: C.pink,
  },
  {
    icon: Brain,
    label: "ÉCHO remembers",
    desc: "Your reflections build over time, creating a record of the thoughts and questions you keep returning to.",
    accent: C.ember,
  },
  {
    icon: RotateCcw,
    label: "Rediscover your own words",
    desc: "Look back at what you said before and notice what changed, what stayed and what keeps coming back.",
    accent: C.pink,
  },
];

// ── Instagram handles ──────────────────────────────────────────
const ECHO_IG = "https://www.instagram.com/roksanaskubis/";
const ROKSANA_IG = "https://www.instagram.com/roksanaskubis/";

// ── GFR Crown icon ─────────────────────────────────────────────
function GfrCrown({
  width = 28,
  height = 22,
  color = "white",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 52" aria-hidden="true">
      <path
        d="M4 46 L4 30 L16 39 L24 22 L32 4 L40 22 L48 39 L60 30 L60 46 Z"
        fill={color}
      />
      <rect x="2" y="44" width="60" height="7" rx="2" fill={color} />
      <circle cx="4" cy="30" r="3.2" fill={color} />
      <circle cx="24" cy="22" r="3.2" fill={color} />
      <circle cx="32" cy="4" r="3.8" fill={color} />
      <circle cx="40" cy="22" r="3.2" fill={color} />
      <circle cx="60" cy="30" r="3.2" fill={color} />
    </svg>
  );
}

// ── Ticker band ────────────────────────────────────────────────
const TICKER_ITEMS = [
  { type: "text" as const, label: "25 September", italic: false },
  { type: "crown" as const },
  { type: "text" as const, label: "Łódź, Poland", italic: false },
  { type: "crown" as const },
  { type: "text" as const, label: "Join Us!", italic: true },
  { type: "crown" as const },
  { type: "text" as const, label: "GFR Summit", italic: false },
  { type: "crown" as const },
];

function TickerContent() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.1rem",
        padding: "0 1.1rem",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {TICKER_ITEMS.map((item, i) =>
        item.type === "crown" ? (
          <span
            key={i}
            style={{ display: "flex", alignItems: "center", opacity: 0.88 }}
          >
            <GfrCrown width={26} height={20} />
          </span>
        ) : (
          <span
            key={i}
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontSize: "0.82rem",
              fontWeight: item.italic ? 600 : 700,
              fontStyle: item.italic ? "italic" : "normal",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {item.label}
          </span>
        )
      )}
    </div>
  );
}

function TickerBand() {
  return (
    <div
      aria-label="Girls Future Ready Summit — 25 September, Łódź, Poland"
      style={{
        position: "relative",
        zIndex: 20,
        width: "100%",
        background: "#E4507A",
        overflow: "hidden",
        padding: "0.65rem 0",
      }}
    >
      <div style={{ display: "flex", overflow: "hidden", width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "ticker-scroll 28s linear infinite",
          }}
        >
          <TickerContent />
          <TickerContent />
          <TickerContent />
          <TickerContent />
        </div>
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-scroll { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Apple logo SVG ─────────────────────────────────────────────
function AppleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ── Phone mockup placeholder ───────────────────────────────────
function AppVisualPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "0 1.5rem 5rem",
      }}
    >
      <div
        style={{
          width: 220,
          height: 440,
          borderRadius: "2.5rem",
          border: `2px solid rgba(28,14,6,0.12)`,
          background:
            "linear-gradient(160deg, rgba(214,59,114,0.06) 0%, rgba(191,96,64,0.06) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 72,
            height: 20,
            borderRadius: 12,
            background: "rgba(28,14,6,0.10)",
          }}
        />
        <img
          src="/logo-main.svg"
          alt="ÉCHO"
          style={{ height: 22, width: "auto", opacity: 0.28 }}
        />
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(28,14,6,0.30)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          App screenshot
          <br />
          coming soon
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────
function Summit() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.ink,
        minHeight: "100dvh",
        overflowX: "hidden",
        fontFamily: "Urbanist, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* ── Head meta ─────────────────────────────────────── */}
      <title>ÉCHO — Girls Future Ready Summit</title>
      <meta
        name="description"
        content="ÉCHO is a private daily voice journal for iPhone. Scan, download, and start your first reflection today."
      />
      <meta name="robots" content="noindex" />

      {/* ── Atmospheric glows ─────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <div
          style={{
            position: "absolute",
            top: "-12%",
            right: "-8%",
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(214,59,114,0.10) 0%, transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-10%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(191,96,64,0.09) 0%, transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "30%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(214,59,114,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Ticker ────────────────────────────────────────── */}
      <TickerBand />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header
        style={{
          position: "relative",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 0.9rem 0.4rem 0.65rem",
            borderRadius: 999,
            border: "1px solid rgba(28,14,6,0.10)",
            background: "transparent",
            textDecoration: "none",
            transition: "border-color 0.18s, background 0.18s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(191,96,64,0.28)";
            el.style.background = "rgba(191,96,64,0.05)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(28,14,6,0.10)";
            el.style.background = "transparent";
          }}
        >
          <img
            src="/logo-main.svg"
            alt="ÉCHO"
            style={{ height: 17, width: "auto", opacity: 0.88 }}
          />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(28,14,6,0.36)",
              paddingBottom: 1,
            }}
          >
            by Réaclyse
          </span>
        </Link>
        <a
          href="https://www.girlsfutureready.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.pinkBorder,
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = C.pink)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = C.pinkBorder)
          }
        >
          GFR Foundation ↗
        </a>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 800,
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        {/* Summit badge */}
        <motion.div {...fadeIn(0)} style={{ marginBottom: "2rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.32rem 0.9rem",
              borderRadius: 999,
              border: `1px solid ${C.pinkBorder}`,
              background: C.pinkDim,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.pink,
            }}
          >
            <GfrCrown width={18} height={14} color={C.pink} />
            Girls Future Ready Summit · 2026
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...rise(0.07)}
          style={{
            fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2.6rem, 8vw, 4.8rem)",
            lineHeight: 1.07,
            letterSpacing: "-0.025em",
            color: C.ink,
            marginBottom: "1.6rem",
          }}
        >
          Your voice holds
          <br />
          <em style={{ color: C.pink, fontStyle: "italic" }}>
            more than you think.
          </em>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...rise(0.16)}
          style={{
            fontSize: "1.08rem",
            lineHeight: 1.72,
            color: C.inkMuted,
            maxWidth: 520,
            marginBottom: "0.75rem",
          }}
        >
          ÉCHO is a private voice journal for iPhone. One question a day. Speak
          what's on your mind, and over time, ÉCHO helps you rediscover the
          thoughts, patterns and words you keep coming back to.
        </motion.p>

        {/* Privacy line */}
        <motion.p
          {...rise(0.22)}
          style={{
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "rgba(28,14,6,0.44)",
            maxWidth: 520,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Shield
            size={13}
            strokeWidth={2}
            style={{ color: C.ember, flexShrink: 0, marginTop: 1 }}
          />
          Your voice is transcribed on-device. It never reaches a server.
        </motion.p>

        {/* Exclusivity */}
        <motion.p
          {...rise(0.27)}
          style={{
            fontSize: "1.02rem",
            lineHeight: 1.68,
            color: "rgba(28,14,6,0.60)",
            maxWidth: 520,
            marginBottom: "2.75rem",
          }}
        >
          ÉCHO is at the Girls Future Ready Summit because the next generation of
          leaders deserves space to hear their own voice clearly.{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            You're among the first 1,100 people invited to experience it.
          </strong>
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...rise(0.33)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            alignItems: "center",
          }}
        >
          {/* App Store — primary CTA, coming soon */}
          <span
            aria-label="Download ÉCHO on the App Store — coming soon"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.85rem 1.65rem",
              borderRadius: "0.875rem",
              background: "rgba(28,14,6,0.06)",
              color: "rgba(28,14,6,0.30)",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.005em",
              whiteSpace: "nowrap",
              cursor: "not-allowed",
              border: "1px solid rgba(28,14,6,0.10)",
              position: "relative",
              userSelect: "none",
            }}
          >
            <AppleLogo size={18} />
            Download on the App Store
            <span
              style={{
                position: "absolute",
                top: -9,
                right: -2,
                background: C.ember,
                color: "#fff",
                fontSize: "0.56rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 7px",
                borderRadius: 100,
                lineHeight: 1.5,
              }}
            >
              Soon
            </span>
          </span>

          {/* Follow ÉCHO on Instagram */}
          <a
            href={ECHO_IG}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow ÉCHO on Instagram"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.65rem",
              borderRadius: "0.875rem",
              background: C.pink,
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.005em",
              textDecoration: "none",
              transition: "transform 0.18s, box-shadow 0.18s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 12px 32px rgba(214,59,114,0.30)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "";
              el.style.boxShadow = "";
            }}
          >
            <Instagram size={16} strokeWidth={1.75} />
            Follow ÉCHO
          </a>
        </motion.div>
      </section>

      {/* ── Divider ────────────────────────────────────────── */}
      <motion.div
        {...fadeIn(0.4)}
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(214,59,114,0.22) 30%, rgba(191,96,64,0.18) 70%, transparent)",
          }}
        />
      </motion.div>

      {/* ── How it works ──────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "4.5rem 1.5rem 3rem",
        }}
      >
        <motion.p
          {...fadeIn(0.45)}
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.ember,
            marginBottom: "2.5rem",
          }}
        >
          How it works
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.25rem",
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.label} feature={f} delay={0.5 + i * 0.1} />
          ))}
        </div>

        {/* Privacy note below the cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            background: "rgba(191,96,64,0.06)",
            border: "1px solid rgba(191,96,64,0.14)",
          }}
        >
          <Shield
            size={14}
            strokeWidth={2}
            style={{ color: C.ember, flexShrink: 0 }}
          />
          <p
            style={{
              fontSize: "0.85rem",
              color: C.inkMuted,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Nothing leaves your phone. Transcription runs on-device — your voice
            never reaches a server.
          </p>
        </motion.div>
      </section>

      {/* ── App visual placeholder ─────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "2rem 1.5rem 1rem",
        }}
      >
        <AppVisualPlaceholder />
      </section>

      {/* ── Quote / pull section ──────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 1.5rem 5rem",
        }}
      >
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            borderLeft: `2px solid ${C.pink}`,
            paddingLeft: "1.5rem",
            margin: 0,
          }}
        >
          <p
            style={{
              fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.35rem, 3.5vw, 1.8rem)",
              lineHeight: 1.45,
              color: C.ink,
              fontStyle: "italic",
              marginBottom: "1rem",
            }}
          >
            "Most of us speak more honestly than we write. ÉCHO is built around
            that truth — one question a day, one voice note, no performance
            required."
          </p>
          <cite
            style={{
              fontStyle: "normal",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.ember,
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Roksana Skubis, CEO · Réaclyse
          </cite>
          <a
            href={ROKSANA_IG}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: C.inkMuted,
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = C.pink)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = C.inkMuted)
            }
          >
            <Instagram size={13} strokeWidth={1.75} />
            Follow Roksana, founder of ÉCHO →
          </a>
        </motion.blockquote>
      </section>

      {/* ── Summit CTA box ────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            padding: "2.5rem",
            borderRadius: "1.25rem",
            background:
              "linear-gradient(135deg, rgba(232,65,122,0.06) 0%, rgba(191,96,64,0.06) 100%)",
            border: "1px solid rgba(232,65,122,0.14)",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.pink,
              marginBottom: "1rem",
            }}
          >
            ✦ For GFR Summit Attendees
          </p>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              lineHeight: 1.25,
              color: C.ink,
              marginBottom: "1rem",
            }}
          >
            Your invitation to ÉCHO starts here.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: C.inkMuted,
              maxWidth: 520,
              marginBottom: "1.75rem",
            }}
          >
            You're among the first people invited to experience ÉCHO. Download
            the app, start your first reflection, and follow ÉCHO to see what
            comes next.
          </p>

          {/* Primary CTAs */}
          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            {/* App Store — coming soon */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                background: "rgba(28,14,6,0.06)",
                color: "rgba(28,14,6,0.30)",
                fontSize: "0.88rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "not-allowed",
                border: "1px solid rgba(28,14,6,0.10)",
                position: "relative",
                userSelect: "none",
              }}
            >
              <AppleLogo size={16} />
              Download on the App Store
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -2,
                  background: C.ember,
                  color: "#fff",
                  fontSize: "0.52rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: 100,
                  lineHeight: 1.5,
                }}
              >
                Soon
              </span>
            </span>

            {/* Follow ÉCHO */}
            <a
              href={ECHO_IG}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.75rem 1.35rem",
                borderRadius: "0.75rem",
                border: `1px solid ${C.pinkBorder}`,
                color: C.pink,
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = C.pinkDim)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Instagram size={15} strokeWidth={1.75} />
              Follow ÉCHO
            </a>
          </div>

          {/* Secondary follow links */}
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(28,14,6,0.36)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem 0.5rem",
              alignItems: "center",
            }}
          >
            Also follow:{"  "}
            <a
              href={ECHO_IG}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: C.inkMuted,
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.pink)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.inkMuted)
              }
            >
              ÉCHO
            </a>
            {" · "}
            <a
              href={ROKSANA_IG}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: C.inkMuted,
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.pink)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.inkMuted)
              }
            >
              Roksana, founder of ÉCHO
            </a>
          </p>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(28,14,6,0.10)",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              opacity: 0.55,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.55")
            }
          >
            <img
              src="/logo-main.svg"
              alt="ÉCHO"
              style={{ height: 16, width: "auto" }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.inkMuted,
              }}
            >
              by RÉACLYSE
            </span>
          </Link>

          <p
            style={{
              fontSize: "0.72rem",
              color: "rgba(28,14,6,0.32)",
              letterSpacing: "0.02em",
            }}
          >
            Private voice journaling · Luxembourg
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────────
function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof FEATURES)[0];
  delay: number;
}) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      style={{
        padding: "1.75rem",
        borderRadius: "1rem",
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        transition: "border-color 0.2s",
      }}
      whileHover={{ borderColor: "rgba(28,14,6,0.14)" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "0.625rem",
          background: `${feature.accent}18`,
          border: `1px solid ${feature.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.1rem",
        }}
      >
        <Icon size={18} strokeWidth={1.75} style={{ color: feature.accent }} />
      </div>
      <h3
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "1.15rem",
          color: C.ink,
          marginBottom: "0.5rem",
          lineHeight: 1.25,
        }}
      >
        {feature.label}
      </h3>
      <p
        style={{
          fontSize: "0.88rem",
          lineHeight: 1.65,
          color: C.inkMuted,
        }}
      >
        {feature.desc}
      </p>
    </motion.div>
  );
}
