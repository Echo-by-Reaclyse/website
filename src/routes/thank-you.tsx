import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme as useGlobalTheme } from "@/components/ThemeProvider";
import en from "@/locales/en.json";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
});

const t = en;

const EASE = [0.22, 1, 0.36, 1] as const;
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

function ThankYouPage() {
  const { theme } = useGlobalTheme();
  const isDark = theme === "dark";

  // ECH-115: read waitlist position stored by WaitlistForm after successful submission
  const [position, setPosition] = useState<number | null>(null);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("echo_waitlist_position");
      if (stored) setPosition(Number(stored));
    } catch { /* ignore */ }
  }, []);

  const bg = isDark ? "#0A1220" : "#FFF6E9";
  const cream = isDark ? "rgba(255,246,233,0.92)" : "rgba(26,15,5,0.9)";
  const muted = isDark ? "rgba(255,246,233,0.5)" : "rgba(26,15,5,0.52)";
  const dimmed = isDark ? "rgba(255,246,233,0.28)" : "rgba(26,15,5,0.32)";
  const ember = "#BF6040";
  const emberSoft = isDark ? "rgba(191,96,64,0.15)" : "rgba(191,96,64,0.08)";
  const cardBg = isDark ? "rgba(255,228,184,0.04)" : "rgba(191,96,64,0.05)";
  const cardBorder = isDark ? "rgba(255,228,184,0.08)" : "rgba(26,15,5,0.09)";
  const serif = "'Instrument Serif', Georgia, 'Times New Roman', serif";
  const sans = "Urbanist, ui-sans-serif, system-ui, sans-serif";

  const shareUrl = "https://echo.réaclyse.com/early-access";
  const shareText = "I just joined the early access waitlist for ÉCHO — a private voice journaling app that helps you understand your own patterns over time. Check it out:";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(150deg, #0A1220 0%, #120F0D 60%, #0A1220 100%)"
          : "linear-gradient(150deg, #FFF6E9 0%, #FAF0E6 60%, #FFF6E9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px clamp(20px, 5vw, 80px) 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${emberSoft} 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 640,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%" }}
        >
          {/* Checkmark icon */}
          <motion.div
            variants={fadeUp}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: isDark
                ? "linear-gradient(135deg, rgba(191,96,64,0.25) 0%, rgba(191,96,64,0.08) 100%)"
                : "linear-gradient(135deg, rgba(191,96,64,0.15) 0%, rgba(191,96,64,0.04) 100%)",
              border: `1.5px solid ${ember}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${ember}, #A04E30)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${ember}44`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Waitlist position badge — ECH-115 */}
          {position !== null && (
            <motion.div variants={fadeUp}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: isDark ? "rgba(191,96,64,0.12)" : "rgba(191,96,64,0.07)",
                  border: `1px solid ${ember}44`,
                  borderRadius: 100,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontFamily: sans,
                  fontWeight: 700,
                  color: ember,
                  letterSpacing: "0.01em",
                }}
              >
                #{position.toLocaleString()} on the waitlist
              </span>
            </motion.div>
          )}

          {/* Eyebrow */}
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: emberSoft,
                border: `1px solid ${ember}33`,
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 12,
                fontFamily: sans,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ember,
              }}
            >
              <span style={{ fontSize: 10 }}>✦</span>
              {t.thankYou.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1
              style={{
                fontFamily: serif,
                fontSize: "clamp(44px, 7vw, 72px)",
                lineHeight: 1.08,
                color: cream,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {t.thankYou.headline}
            </h1>
            <p
              style={{
                fontFamily: sans,
                fontSize: "clamp(16px, 2vw, 18px)",
                lineHeight: 1.7,
                color: muted,
                margin: 0,
                maxWidth: 520,
              }}
            >
              {t.thankYou.body}
            </p>
          </motion.div>

          {/* What's next */}
          <motion.div
            variants={fadeUp}
            style={{
              width: "100%",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 24,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <p
              style={{
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ember,
                margin: 0,
                textAlign: "left",
              }}
            >
              {t.thankYou.whatNext}
            </p>

            {t.thankYou.steps.map((step, i) => (
              <div
                key={step.title}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: emberSoft,
                    border: `1px solid ${ember}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      fontWeight: 700,
                      color: ember,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, color: cream, margin: 0 }}>
                    {step.title}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Share nudge */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}
          >
            <p style={{ fontFamily: sans, fontSize: 14, color: muted, margin: 0 }}>
              {t.thankYou.share}
            </p>

            {/* Share buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 100,
                  padding: "10px 18px",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${ember}55`;
                  e.currentTarget.style.background = emberSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = cardBorder;
                  e.currentTarget.style.background = cardBg;
                }}
              >
                <svg viewBox="0 0 24 24" fill={cream} style={{ width: 16, height: 16 }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.265 5.645 5.9-5.645zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: cream }}>
                  Share on X
                </span>
              </a>

              {/* Copy link */}
              <CopyButton url={shareUrl} C={{ cardBg, cardBorder, ember, emberSoft, cream, sans }} />
            </div>
          </motion.div>

          {/* Back home */}
          <motion.div variants={fadeUp}>
            <Link
              to="/"
              style={{
                fontFamily: sans,
                fontSize: 14,
                color: dimmed,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = muted)}
              onMouseLeave={(e) => (e.currentTarget.style.color = dimmed)}
            >
              ← {t.thankYou.backHome}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function CopyButton({
  url,
  C,
}: {
  url: string;
  C: {
    cardBg: string;
    cardBorder: string;
    ember: string;
    emberSoft: string;
    cream: string;
    sans: string;
  };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: C.cardBg,
        border: `1px solid ${copied ? C.ember + "77" : C.cardBorder}`,
        borderRadius: 100,
        padding: "10px 18px",
        cursor: "pointer",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${C.ember}55`;
        e.currentTarget.style.background = C.emberSoft;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = copied ? `${C.ember}77` : C.cardBorder;
        e.currentTarget.style.background = C.cardBg;
      }}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.6" strokeLinecap="round" style={{ width: 16, height: 16 }}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
      <span
        style={{
          fontFamily: C.sans,
          fontSize: 13,
          fontWeight: 600,
          color: copied ? C.ember : C.cream,
          transition: "color 0.2s ease",
        }}
      >
        {copied ? "Copied!" : "Copy link"}
      </span>
    </button>
  );
}
