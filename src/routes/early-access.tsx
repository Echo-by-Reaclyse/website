import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { useTheme as useGlobalTheme } from "@/components/ThemeProvider";
import { SiteNav } from "@/components/SiteNav";
import { captureUTM } from "@/lib/utm";
import { trackCTAClick, trackSectionView } from "@/lib/analytics";
import en from "@/locales/en.json";

export const Route = createFileRoute("/early-access")({
  component: EarlyAccessPage,
});

// ── i18n ─────────────────────────────────────────────────────────────────────
// All strings come from en.json — swap locale object to add a new language.
const t = en;

// ── Theme ─────────────────────────────────────────────────────────────────────
const DARK = {
  pageBg: "#0A1220",
  altBg: "#100C08",
  deepBg: "#120F0D",
  cream: "rgba(255,246,233,0.92)",
  muted: "rgba(255,246,233,0.48)",
  dimmed: "rgba(255,246,233,0.28)",
  ember: "#BF6040",
  emberSoft: "rgba(191,96,64,0.15)",
  cardBg: "rgba(255,228,184,0.04)",
  cardBorder: "rgba(255,228,184,0.08)",
  navBg: "rgba(10,18,32,0.82)",
  phoneBg: "#F0EBE3",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "Urbanist, ui-sans-serif, system-ui, sans-serif",
};
const LIGHT = {
  pageBg: "#FFF6E9",
  altBg: "#F5EDE0",
  deepBg: "#FAF0E6",
  cream: "rgba(26,15,5,0.9)",
  muted: "rgba(26,15,5,0.52)",
  dimmed: "rgba(26,15,5,0.32)",
  ember: "#BF6040",
  emberSoft: "rgba(191,96,64,0.08)",
  cardBg: "rgba(191,96,64,0.05)",
  cardBorder: "rgba(26,15,5,0.09)",
  navBg: "rgba(255,246,233,0.88)",
  phoneBg: "#F0EBE3",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "Urbanist, ui-sans-serif, system-ui, sans-serif",
};
type C = typeof DARK;

// ── Animation ─────────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const VP = { once: true, margin: "-64px" } as const;
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = (delay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

// ── Section tracker hook ──────────────────────────────────────────────────────
function useSectionTrack(name: string) {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackSectionView(name);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name]);
  return ref;
}

// ── Atmospheric divider ───────────────────────────────────────────────────────
function AtmoDivider({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: 120,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        marginTop: -1,
      }}
    />
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ C, isDark, onSuccess }: { C: C; isDark: boolean; onSuccess: () => void }) {
  const ref = useSectionTrack("hero");
  return (
    <section
      id="hero"
      ref={ref}
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(150deg, #0A1220 0%, #120F0D 60%, #0A1220 100%)"
          : "linear-gradient(150deg, #FFF6E9 0%, #FAF0E6 60%, #FFF6E9 100%)",
        display: "flex",
        alignItems: "center",
        padding: "100px clamp(20px, 5vw, 72px) 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="ea-hero-grid"
        style={{
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: copy + form */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: 22 }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.emberSoft,
                border: `1px solid ${C.ember}33`,
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 12,
                fontFamily: C.sans,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.ember,
              }}
            >
              <span style={{ fontSize: 10 }}>✦</span>
              {t.hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(40px, 5.5vw, 72px)",
              lineHeight: 1.07,
              color: C.cream,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {t.hero.headline1}
            <br />
            <em style={{ color: C.ember, fontStyle: "italic" }}>{t.hero.headline2}</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: C.sans,
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.65,
              color: C.muted,
              maxWidth: 480,
              margin: 0,
            }}
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} id="hero-form" style={{ width: "100%", maxWidth: 480 }}>
            <WaitlistForm variant="hero" onSuccess={onSuccess} />
          </motion.div>

          <motion.p variants={fadeUp} style={{ fontFamily: C.sans, fontSize: 12, color: C.dimmed, margin: 0 }}>
            {t.hero.trust}
          </motion.p>
        </motion.div>

        {/* Right: phone image placeholder */}
        <motion.div
          className="ea-hero-phone"
          initial={{ opacity: 0, x: 32, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Glow behind phone */}
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.emberSoft} 0%, transparent 70%)`, pointerEvents: "none" }} />
          <IPhoneFrameSmall>
            <MiniPhoneScreen idx={0} C={C} />
          </IPhoneFrameSmall>
        </motion.div>
      </div>
    </section>
  );
}

// ── Problem ───────────────────────────────────────────────────────────────────
function ProblemSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("problem");
  return (
    <section
      id="problem"
      ref={ref}
      style={{
        background: isDark ? C.altBg : C.altBg,
        padding: "100px clamp(20px, 5vw, 80px)",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 20 }}
          >
            {t.problem.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.1,
              color: C.cream,
              fontWeight: 400,
              margin: "0 0 60px",
              whiteSpace: "pre-line",
            }}
          >
            {t.problem.headline}
          </motion.h2>

          <motion.div
            variants={stagger(0.08)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {t.problem.cards.map((card) => (
              <motion.div
                key={card.text}
                variants={fadeUp}
                style={{
                  position: "relative",
                  borderRadius: 24,
                  padding: "26px 22px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  overflow: "hidden",
                  background: isDark
                    ? "linear-gradient(145deg, rgba(255,246,233,0.07) 0%, rgba(255,246,233,0.03) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.28) 100%)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: isDark
                    ? "1px solid rgba(255,246,233,0.10)"
                    : "1px solid rgba(255,255,255,0.65)",
                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,246,233,0.10), 0 4px 24px rgba(0,0,0,0.28)"
                    : "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                {/* Specular highlight */}
                <div aria-hidden style={{
                  position: "absolute", inset: "0 0 auto 0", height: 1,
                  background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,246,233,0.18) 40%, rgba(255,246,233,0.18) 60%, transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, transparent)",
                  pointerEvents: "none",
                }} />

                {/* Icon pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: isDark
                    ? "linear-gradient(145deg, rgba(255,246,233,0.10) 0%, rgba(255,246,233,0.04) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.35) 100%)",
                  border: isDark
                    ? "1px solid rgba(255,246,233,0.12)"
                    : "1px solid rgba(255,255,255,0.80)",
                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,246,233,0.12)"
                    : "inset 0 1px 0 rgba(255,255,255,1), 0 2px 8px rgba(0,0,0,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{card.icon}</span>
                </div>

                <p style={{
                  fontFamily: C.sans,
                  fontSize: 15,
                  fontWeight: 500,
                  color: isDark ? "rgba(255,246,233,0.88)" : "rgba(26,15,5,0.82)",
                  lineHeight: 1.45,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}>
                  {card.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Outcome ───────────────────────────────────────────────────────────────────
function OutcomeSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("outcome");
  return (
    <section
      id="outcome"
      ref={ref}
      style={{
        background: isDark
          ? "linear-gradient(160deg, #120F0D 0%, #1A1008 50%, #120F0D 100%)"
          : "linear-gradient(160deg, #FAF0E6 0%, #F5E6D5 50%, #FAF0E6 100%)",
        padding: "120px clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.emberSoft} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 20 }}
          >
            {t.outcome.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.08,
              color: C.cream,
              fontWeight: 400,
              margin: "0 0 72px",
            }}
          >
            {t.outcome.headline}
          </motion.h2>

          {/* 4-pillar flow */}
          <motion.div
            variants={stagger(0.1)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 0,
              position: "relative",
            }}
          >
            {t.outcome.pillars.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: "0 32px 0 0",
                  borderLeft: i === 0 ? "none" : `1px solid ${C.cardBorder}`,
                  paddingLeft: i === 0 ? 0 : 32,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: C.emberSoft,
                    border: `1px solid ${C.ember}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 700, color: C.ember }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 600, color: C.cream, margin: 0, lineHeight: 1.3 }}>
                  {p.title}
                </p>
                <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("how_it_works");
  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{
        background: isDark ? C.pageBg : C.pageBg,
        padding: "120px clamp(20px, 5vw, 80px)",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 20 }}
          >
            {t.howItWorks.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.1,
              color: C.cream,
              fontWeight: 400,
              margin: "0 0 72px",
            }}
          >
            {t.howItWorks.headline}
          </motion.h2>

          <motion.div
            variants={stagger(0.12)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
            }}
          >
            {t.howItWorks.steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: C.serif,
                    fontSize: 56,
                    color: C.emberSoft,
                    lineHeight: 1,
                    fontStyle: "italic",
                    userSelect: "none",
                  }}
                >
                  {step.number}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontFamily: C.sans, fontSize: 18, fontWeight: 700, color: C.cream, margin: 0 }}>
                    {step.title}
                  </p>
                  <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                    {step.body}
                  </p>
                </div>
                {i < t.howItWorks.steps.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 28,
                      right: -16,
                      fontSize: 18,
                      color: C.dimmed,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Why Voice ─────────────────────────────────────────────────────────────────
const VOICE_WAVE = Array.from({ length: 48 }, (_, i) => {
  const pos = i / 47;
  return (
    0.5 +
    0.3 * Math.sin(pos * Math.PI * 3.1) +
    0.12 * Math.sin(pos * Math.PI * 7.4 + 0.8) +
    0.06 * Math.cos(pos * Math.PI * 13 + 1.2)
  );
});

function WhyVoiceSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("why_voice");
  return (
    <section
      id="why-voice"
      ref={ref}
      style={{
        background: isDark ? C.altBg : C.altBg,
        padding: "120px clamp(20px, 5vw, 80px)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px 80px",
          alignItems: "center",
        }}
      >
        {/* Left: photo placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -24, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.75, ease: EASE } }}
          viewport={VP}
          style={{
            aspectRatio: "4/5",
            borderRadius: 28,
            background: isDark
              ? "linear-gradient(145deg, rgba(191,96,64,0.10) 0%, rgba(255,228,184,0.03) 100%)"
              : "linear-gradient(145deg, rgba(191,96,64,0.07) 0%, rgba(255,228,184,0.25) 100%)",
            border: `1px solid ${C.cardBorder}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src="/team-roksana.jpg"
            alt="Roksana, founder of ÉCHO"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </motion.div>

        {/* Right: copy + pillars */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ display: "flex", flexDirection: "column", gap: 28 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 20 }}
            >
              {t.whyVoice.eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                lineHeight: 1.12,
                color: C.cream,
                fontWeight: 400,
                margin: "0 0 24px",
                whiteSpace: "pre-line",
              }}
            >
              {t.whyVoice.headline}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: C.sans, fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}
            >
              {t.whyVoice.body}
            </motion.p>
          </div>

          <motion.div variants={stagger(0.08)} style={{ display: "flex", gap: 16 }}>
            {t.whyVoice.pillars.map((p) => (
              <motion.div
                key={p.label}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                  background: C.cardBg,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 16,
                  padding: "20px 12px",
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.emberSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="1.6" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                    {p.label === "Fast" && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
                    {p.label === "Natural" && (
                      <>
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path d="M19 10v2a7 7 0 01-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                      </>
                    )}
                    {p.label === "Authentic" && (
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    )}
                  </svg>
                </div>
                <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.cream }}>
                  {p.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Product — Sticky Scroll ───────────────────────────────────────────────────
const PRODUCT_SCREENS: { tab: string; title: string; body: string }[] = t.product.features;

function MiniPhoneScreen({ idx, C }: { idx: number; C: C }) {
  // Simplified phone UI per feature
  const screens = [
    // 0 — Record: question + mic button
    <div key={0} style={{ height: "100%", background: "#F0EBE3", display: "flex", flexDirection: "column", padding: "52px 14px 12px", gap: 12, overflow: "hidden" }}>
      <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist,sans-serif", marginTop: 2 }}>Good morning, Roksana.</p>
      <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist,sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Today's Question</p>
        <p style={{ fontSize: 14, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: "italic", lineHeight: 1.35 }}>What's been sitting with you today?</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 8 }}>
        <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(191,96,64,0.12)" }} />
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#BF6040", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(191,96,64,0.35)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
            </svg>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Urbanist,sans-serif" }}>Begin</p>
      </div>
    </div>,
    // 1 — Archive: entry list
    <div key={1} style={{ height: "100%", background: "#F0EBE3", display: "flex", flexDirection: "column", padding: "44px 14px 12px", gap: 10, overflow: "hidden" }}>
      <p style={{ fontSize: 20, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400 }}>The Archive</p>
      {[
        { date: "Today", preview: "What I keep avoiding is the conversation about whether I actually want this…" },
        { date: "Yesterday", preview: "I feel most like myself when I'm walking alone early in the morning…" },
        { date: "3 days ago", preview: "The decision I keep delaying is the one that requires me to admit…" },
      ].map((e) => (
        <div key={e.date} style={{ background: "#fff", borderRadius: 14, padding: "10px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 10, color: "#BF6040", fontFamily: "Urbanist,sans-serif", fontWeight: 600, marginBottom: 4 }}>{e.date}</p>
          <p style={{ fontSize: 11, color: "rgba(0,0,0,0.6)", fontFamily: "Urbanist,sans-serif", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box" as "block", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as "vertical" }}>{e.preview}</p>
        </div>
      ))}
    </div>,
    // 2 — Mirror: traits
    <div key={2} style={{ height: "100%", background: "#F0EBE3", display: "flex", flexDirection: "column", padding: "44px 14px 12px", gap: 10, overflow: "hidden" }}>
      <p style={{ fontSize: 20, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400 }}>The Mirror</p>
      <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Emotional range", v: 0.82 },
          { label: "Avoidance", v: 0.45 },
          { label: "Growth", v: 0.71 },
          { label: "Decision clarity", v: 0.63 },
        ].map(({ label, v }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#1A1A1A", fontFamily: "Urbanist,sans-serif" }}>{label}</span>
              <span style={{ fontSize: 10, color: "#BF6040", fontFamily: "Urbanist,sans-serif" }}>{Math.round(v * 100)}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(0,0,0,0.07)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${v * 100}%`, background: "#BF6040", borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>,
    // 3 — Letters: envelope
    <div key={3} style={{ height: "100%", background: "#F0EBE3", display: "flex", flexDirection: "column", padding: "44px 16px 12px", gap: 12, overflow: "hidden", alignItems: "center" }}>
      <p style={{ fontSize: 20, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400, alignSelf: "flex-start" }}>Letters</p>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "50%", background: "rgba(191,96,64,0.08)" }} />
          <div style={{ position: "absolute", width: 66, height: 66, borderRadius: "50%", background: "rgba(191,96,64,0.10)" }} />
          <svg viewBox="0 0 54 40" fill="none" style={{ width: 44, height: 32, position: "relative", zIndex: 1 }}>
            <rect x="1" y="1" width="52" height="38" rx="4" fill="white" stroke="rgba(191,96,64,0.2)" strokeWidth="1" />
            <polyline points="1,5 27,22 53,5" stroke="rgba(191,96,64,0.25)" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
        <p style={{ fontSize: 16, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", textAlign: "center" }}>Words to your future self.</p>
        <p style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist,sans-serif", textAlign: "center", lineHeight: 1.5 }}>Sealed today. Opened when the time is right.</p>
      </div>
    </div>,
    // 4 — Privacy: shield
    <div key={4} style={{ height: "100%", background: "#F0EBE3", display: "flex", flexDirection: "column", padding: "44px 14px 12px", gap: 12, overflow: "hidden" }}>
      <p style={{ fontSize: 20, color: "#1A1A1A", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400 }}>Privacy</p>
      {[
        { icon: "🔒", label: "On-device transcription" },
        { icon: "🛡️", label: "Encrypted at rest" },
        { icon: "🚫", label: "No tracking, ever" },
        { icon: "🗑️", label: "Delete anything, anytime" },
      ].map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist,sans-serif", fontWeight: 500 }}>{item.label}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ position: "absolute", inset: 0 }}
      >
        {screens[idx] ?? screens[0]}
      </motion.div>
    </AnimatePresence>
  );
}

function IPhoneFrameSmall({ children }: { children: React.ReactNode }) {
  const W = 260, H = 540, br = 46, si = 9;
  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>
      <div style={{ position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)", width: W * 0.72, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(191,96,64,0.3), transparent 70%)", filter: "blur(16px)", pointerEvents: "none" }} />
      <div style={{ position: "relative", width: W, height: H, borderRadius: br, background: "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 45%, #101012 100%)", boxShadow: "0 60px 100px -20px rgba(0,0,0,0.75), 0 24px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.11)", overflow: "visible" }}>
        <div style={{ position: "absolute", top: si, left: si, right: si, bottom: si, borderRadius: br - 6, background: "#F0EBE3", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 96, height: 28, borderRadius: 14, background: "#000", zIndex: 20 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>{children}</div>
          <div aria-hidden style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 96, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.25)", zIndex: 20 }} />
        </div>
        <div aria-hidden style={{ position: "absolute", right: -3, top: 110, width: 4, height: 58, borderRadius: "0 3px 3px 0", background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -3, top: 68, width: 4, height: 22, borderRadius: "3px 0 0 3px", background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -3, top: 98, width: 4, height: 36, borderRadius: "3px 0 0 3px", background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -3, top: 142, width: 4, height: 54, borderRadius: "3px 0 0 3px", background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
      </div>
    </div>
  );
}

function ProductSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("product");
  const [activeIdx, setActiveIdx] = useState(0);
  const current = PRODUCT_SCREENS[activeIdx];

  return (
    <section
      id="product"
      ref={ref}
      style={{
        background: isDark ? C.deepBg : C.deepBg,
        padding: "100px clamp(20px, 5vw, 72px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.emberSoft} 0%, transparent 68%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p variants={fadeUp} style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 16 }}>
            {t.product.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} style={{ fontFamily: C.serif, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.1, color: C.cream, fontWeight: 400, margin: "0 0 48px", whiteSpace: "pre-line" }}>
            {t.product.headline}
          </motion.h2>

          {/* Tab bar */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
            {PRODUCT_SCREENS.map((screen, i) => (
              <button
                key={screen.tab}
                onClick={() => setActiveIdx(i)}
                style={{
                  background: i === activeIdx ? C.ember : C.cardBg,
                  border: `1px solid ${i === activeIdx ? C.ember : C.cardBorder}`,
                  borderRadius: 100,
                  padding: "8px 18px",
                  fontFamily: C.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  color: i === activeIdx ? "#fff" : C.muted,
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => { if (i !== activeIdx) e.currentTarget.style.borderColor = `${C.ember}66`; }}
                onMouseLeave={(e) => { if (i !== activeIdx) e.currentTarget.style.borderColor = C.cardBorder; }}
              >
                {screen.tab}
              </button>
            ))}
          </motion.div>

          {/* Content: text left, phone right */}
          <div className="ea-product-grid">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <h3 style={{ fontFamily: C.serif, fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.12, color: C.cream, fontWeight: 400, margin: 0 }}>
                  {current.title}
                </h3>
                <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.7, margin: 0, maxWidth: 460 }}>
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="ea-product-phone">
              <IPhoneFrameSmall>
                <MiniPhoneScreen idx={activeIdx} C={C} />
              </IPhoneFrameSmall>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Founder ───────────────────────────────────────────────────────────────────
function FounderSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("founder");
  // ECH-109: Video coming soon — show a tooltip/overlay until founder video is ready.
  // TODO: replace this modal with a real video embed (see ECH-122 for video brief).
  const [showVideoToast, setShowVideoToast] = useState(false);
  return (
    <section
      id="founder"
      ref={ref}
      style={{
        background: isDark ? C.pageBg : C.pageBg,
        padding: "120px clamp(20px, 5vw, 80px)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px 80px",
          alignItems: "center",
        }}
      >
        {/* Left: photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } }}
          viewport={VP}
          style={{
            aspectRatio: "4/5",
            borderRadius: 28,
            background: isDark
              ? "linear-gradient(145deg, rgba(191,96,64,0.12) 0%, rgba(255,228,184,0.04) 100%)"
              : "linear-gradient(145deg, rgba(191,96,64,0.08) 0%, rgba(255,228,184,0.3) 100%)",
            border: `1px solid ${C.cardBorder}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="/team-roksana.jpg"
            alt="Roksana, founder of ÉCHO"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </motion.div>

        {/* Right: copy */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, margin: 0 }}
          >
            {t.founder.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.12,
              color: C.cream,
              fontWeight: 400,
              margin: 0,
            }}
          >
            {t.founder.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.75, margin: 0 }}
          >
            {t.founder.body}
          </motion.p>

          {/* Video CTA — ECH-109: wired to show coming-soon state until video is ready (ECH-122) */}
          <div style={{ position: "relative", alignSelf: "flex-start" }}>
            <motion.button
              variants={fadeUp}
              onClick={() => {
                trackCTAClick("Watch founder story", "founder");
                setShowVideoToast(true);
                setTimeout(() => setShowVideoToast(false), 3500);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                border: `1.5px solid ${C.ember}`,
                borderRadius: 100,
                padding: "12px 22px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.emberSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.ember, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: 12, height: 12, marginLeft: 2 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span style={{ fontFamily: C.sans, fontSize: 14, fontWeight: 600, color: C.cream }}>
                {t.founder.videoCta}
              </span>
            </motion.button>
            <AnimatePresence>
              {showVideoToast && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: 0,
                    whiteSpace: "nowrap",
                    background: isDark ? "rgba(30,18,10,0.96)" : "rgba(255,246,233,0.98)",
                    border: `1px solid ${C.ember}40`,
                    borderRadius: 12,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontFamily: C.sans,
                    color: C.cream,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    zIndex: 50,
                  }}
                >
                  🎬 Founder story coming soon — follow{" "}
                  <a
                    href="https://www.instagram.com/roksanaskubis/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: C.ember, textDecoration: "underline" }}
                  >
                    @roksanaskubis
                  </a>{" "}
                  for updates.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Social Proof ──────────────────────────────────────────────────────────────
// ECH-112 / ECH-124: Replace placeholder quotes with real beta tester testimonials
// when collected. Prompt: ask 4-6 beta users "In one or two sentences, what changed
// after using ÉCHO for a week?" and capture their first name + city.
const TESTIMONIALS = [
  {
    initials: "S.L.",
    name: "Sophie L.",
    location: "Paris",
    quote:
      "I didn't realise how often I said I was 'fine' until ÉCHO showed me three weeks of recordings where I never once said I felt calm.",
  },
  {
    initials: "M.K.",
    name: "Markus K.",
    location: "Berlin",
    quote:
      "It's the only journaling app I've kept open for more than a month. One question a day is exactly the right amount of friction.",
  },
  {
    initials: "A.R.",
    name: "Anaïs R.",
    location: "Brussels",
    quote:
      "Hearing my own voice from two months ago was genuinely strange — I sounded more certain than I remember feeling. That contrast is powerful.",
  },
];

function SocialProofSection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("social_proof");

  return (
    <section
      ref={ref}
      style={{
        background: isDark ? C.pageBg : C.pageBg,
        padding: "5rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: "1.25rem" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 16 16" fill={C.ember} style={{ width: 18, height: 18, opacity: 0.9 }}>
              <path d="M8 1l1.854 3.756L14 5.528l-3 2.922.708 4.131L8 10.5l-3.708 2.081L5 8.45 2 5.528l4.146-.772z" />
            </svg>
          ))}
        </div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            color: C.cream,
            textAlign: "center",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          What early users are saying
        </motion.h2>

        <p
          style={{
            fontFamily: C.sans,
            fontSize: "0.875rem",
            color: C.muted,
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          From our closed beta — launching 2026
        </p>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {TESTIMONIALS.map(({ initials, name, location, quote }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              style={{
                background: isDark ? C.cardBg : "rgba(191,96,64,0.04)",
                border: `1px solid ${isDark ? C.cardBorder : "rgba(191,96,64,0.14)"}`,
                borderRadius: "1.125rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Quote */}
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: C.cream,
                  flex: 1,
                }}
              >
                "{quote}"
              </p>

              {/* Attribution */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(191,96,64,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.sans,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: C.ember,
                    }}
                  >
                    {initials}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: C.sans,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: C.cream,
                      lineHeight: 1.2,
                    }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      fontFamily: C.sans,
                      fontSize: "0.72rem",
                      color: C.muted,
                      lineHeight: 1.2,
                    }}
                  >
                    {location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Privacy ───────────────────────────────────────────────────────────────────
function PrivacySection({ C, isDark }: { C: C; isDark: boolean }) {
  const ref = useSectionTrack("privacy");
  const icons = [
    // Lock
    <svg key="lock" viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="1.5" strokeLinecap="round" style={{ width: 22, height: 22 }}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>,
    // No share
    <svg key="noshare" viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="1.5" strokeLinecap="round" style={{ width: 22, height: 22 }}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3" />
    </svg>,
    // Control
    <svg key="control" viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="1.5" strokeLinecap="round" style={{ width: 22, height: 22 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
    // Delete
    <svg key="delete" viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="1.5" strokeLinecap="round" style={{ width: 22, height: 22 }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>,
  ];

  return (
    <section
      id="privacy"
      ref={ref}
      style={{
        background: isDark ? C.altBg : C.altBg,
        padding: "120px clamp(20px, 5vw, 80px)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div variants={stagger()} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, marginBottom: 20 }}
          >
            {t.privacy.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.1,
              color: C.cream,
              fontWeight: 400,
              margin: "0 0 64px",
            }}
          >
            {t.privacy.headline}
          </motion.h2>

          <motion.div
            variants={stagger(0.08)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              marginBottom: 48,
            }}
          >
            {t.privacy.pillars.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  background: C.cardBg,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 20,
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.emberSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icons[i]}
                </div>
                <p style={{ fontFamily: C.sans, fontSize: 14, fontWeight: 600, color: C.cream, margin: 0, lineHeight: 1.4, whiteSpace: "pre-line" }}>
                  {p.title}
                </p>
                <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link
              to="/privacy"
              style={{
                fontFamily: C.sans,
                fontSize: 13,
                color: C.ember,
                textDecoration: "underline",
                textDecorationColor: `${C.ember}55`,
                textUnderlineOffset: 3,
              }}
            >
              {t.privacy.link} →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Early Access Offer ────────────────────────────────────────────────────────
function EarlyAccessSection({
  C,
  isDark,
  onSuccess,
}: {
  C: C;
  isDark: boolean;
  onSuccess: () => void;
}) {
  const ref = useSectionTrack("early_access_offer");
  const offer = t.earlyAccess.offer;

  return (
    <section
      ref={ref}
      style={{
        background: isDark ? C.deepBg : C.deepBg,
        padding: "120px clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient */}
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${C.emberSoft} 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" }}
        >
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember, margin: 0 }}
          >
            {t.earlyAccess.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.1,
              color: C.cream,
              fontWeight: 400,
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {t.earlyAccess.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.65, margin: 0, maxWidth: 520 }}
          >
            {t.earlyAccess.subheadline}
          </motion.p>

          {/* Pricing card */}
          <motion.div
            variants={fadeUp}
            style={{
              background: C.cardBg,
              border: `1px solid ${C.ember}44`,
              borderRadius: 24,
              padding: "36px 32px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.emberSoft, border: `1px solid ${C.ember}44`, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontFamily: C.sans, fontWeight: 600, color: C.ember, letterSpacing: "0.08em" }}>
                ✦ {offer.badge}
              </span>
            </div>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontFamily: C.serif, fontSize: 48, color: C.cream, lineHeight: 1, fontWeight: 400 }}>{offer.monthly}</span>
                  <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{offer.monthlyPeriod}</span>
                </div>
                <span style={{ fontFamily: C.sans, fontSize: 11, color: C.dimmed }}>billed monthly</span>
              </div>
              <div style={{ width: 1, background: C.cardBorder, alignSelf: "stretch" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontFamily: C.serif, fontSize: 48, color: C.cream, lineHeight: 1, fontWeight: 400 }}>{offer.yearly}</span>
                  <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{offer.yearlyPeriod}</span>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(52,199,89,0.12)", color: "#34C759", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontFamily: C.sans, fontWeight: 600 }}>
                  {offer.yearlySave}
                </span>
              </div>
            </div>

            <p style={{ fontFamily: C.sans, fontSize: 13, color: C.ember, fontWeight: 600, margin: 0, textAlign: "center" }}>
              🔒 {offer.lockedIn}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {offer.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,199,89,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#34C759" }}>✓</span>
                  </div>
                  <span style={{ fontFamily: C.sans, fontSize: 14, color: C.cream }}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} style={{ width: "100%" }}>
            <WaitlistForm variant="footer" onSuccess={onSuccess} />
          </motion.div>

          <motion.p variants={fadeUp} style={{ fontFamily: C.sans, fontSize: 12, color: C.dimmed, margin: 0 }}>
            {t.earlyAccess.trust}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function EarlyAccessFooter({ C }: { C: C }) {
  return (
    <footer
      style={{
        background: C.pageBg,
        borderTop: `1px solid ${C.cardBorder}`,
        padding: "60px clamp(20px, 5vw, 80px) 40px",
      }}
    >
      <div
        className="ea-footer-grid"
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontFamily: C.serif, fontSize: 22, color: C.cream, letterSpacing: "0.02em" }}>ÉCHO</span>
          <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0, maxWidth: 240 }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Product */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ember, margin: 0 }}>{t.footer.product}</p>
          {([
            { label: t.footer.links.howItWorks, to: "/faq" },
            { label: t.footer.links.forYou, to: "/early-access" },
            { label: t.footer.links.privacy, to: "/privacy" },
            { label: t.footer.links.faq, to: "/faq" },
          ] as { label: string; to: string }[]).map(({ label, to }) => (
            <Link key={label} to={to} style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
              {label}
            </Link>
          ))}
        </div>

        {/* Company */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ember, margin: 0 }}>{t.footer.company}</p>
          {([
            { label: t.footer.links.about, to: "/about" },
            { label: t.footer.links.contact, to: "/contact" },
            { label: t.footer.links.terms, to: "/privacy" },
          ] as { label: string; to: string }[]).map(({ label, to }) => (
            <Link key={label} to={to} style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
              {label}
            </Link>
          ))}
        </div>

        {/* Stay in the loop */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ember, margin: 0 }}>{t.footer.stayInLoop}</p>
          <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, lineHeight: 1.55, margin: 0 }}>{t.footer.links.earlyAccess}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "48px auto 0", paddingTop: 24, borderTop: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontFamily: C.sans, fontSize: 12, color: C.dimmed, margin: 0 }}>
          © 2026 ÉCHO by RÉACLYSE S.à r.l.-S. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {([
            { label: t.footer.links.privacy, to: "/privacy" },
            { label: t.footer.links.terms, to: "/privacy" },
          ] as { label: string; to: string }[]).map(({ label, to }) => (
            <Link key={label} to={to} style={{ fontFamily: C.sans, fontSize: 12, color: C.dimmed, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function EarlyAccessPage() {
  const { theme } = useGlobalTheme();
  const isDark = theme === "dark";
  const C = isDark ? DARK : LIGHT;
  const navigate = useNavigate();

  // Capture UTM params on mount
  useEffect(() => {
    captureUTM();
  }, []);

  const handleSuccess = useCallback(() => {
    navigate({ to: "/thank-you" });
  }, [navigate]);

  return (
    <div style={{ background: C.pageBg, minHeight: "100vh" }}>
      <SiteNav
        links={[
          { label: "How it works", anchor: "how-it-works" },
          { label: "For You", anchor: "why-voice" },
          { label: "Privacy", anchor: "privacy" },
          { label: "FAQ", to: "/faq" },
        ]}
        cta={{ label: "Join waitlist", anchor: "hero-form" }}
      />
      <div id="main-content" />

      <HeroSection C={C} isDark={isDark} onSuccess={handleSuccess} />
      <AtmoDivider from={isDark ? "#120F0D" : "#FAF0E6"} to={isDark ? C.altBg : C.altBg} />

      <ProblemSection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? C.altBg : C.altBg} to={isDark ? "#1A1008" : "#F5E6D5"} />

      <OutcomeSection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? "#120F0D" : "#FAF0E6"} to={isDark ? C.pageBg : C.pageBg} />

      <HowItWorksSection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? C.pageBg : C.pageBg} to={isDark ? C.altBg : C.altBg} />

      <WhyVoiceSection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? C.altBg : C.altBg} to={isDark ? C.deepBg : C.deepBg} />

      <ProductSection C={C} isDark={isDark} />

      <AtmoDivider from={isDark ? C.deepBg : C.deepBg} to={isDark ? C.pageBg : C.pageBg} />
      <FounderSection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? C.pageBg : C.pageBg} to={isDark ? C.altBg : C.altBg} />

      {/* SocialProofSection hidden until real beta quotes are available — ECH-112 / ECH-124 */}

      <PrivacySection C={C} isDark={isDark} />
      <AtmoDivider from={isDark ? C.altBg : C.altBg} to={isDark ? C.deepBg : C.deepBg} />

      <EarlyAccessSection C={C} isDark={isDark} onSuccess={handleSuccess} />

      <EarlyAccessFooter C={C} />
    </div>
  );
}
