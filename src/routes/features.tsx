import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";

export const Route = createFileRoute("/features")({
  component: ShowcasePage,
});

// ─── Data ──────────────────────────────────────────────────────────────────

const QUESTIONS = [
  "What are you avoiding\ntelling yourself?",
  "Where do you feel\nmost like yourself?",
  "What decision are\nyou delaying?",
  "What did you need today\nthat you didn't ask for?",
];

const JOURNAL_ENTRIES = [
  { date: "Today, 9 May", duration: "0:47", preview: "What I keep avoiding is the conversation about whether I actually want this — not whether I'm capable, but whether..." },
  { date: "8 May", duration: "1:12", preview: "I feel most like myself when I'm walking alone early in the morning before anyone else is awake and the city..." },
  { date: "6 May", duration: "0:38", preview: "The decision I keep delaying is the one that requires me to admit I already know the answer..." },
  { date: "4 May", duration: "2:04", preview: "I didn't ask for space today but I needed it more than anything. The meeting felt suffocating and I stayed..." },
  { date: "30 Apr", duration: "0:55", preview: "Something shifted this week. I noticed I'm less afraid of being wrong than I used to be..." },
];

const INSIGHTS_TRAITS = [
  { label: "Emotional range", value: 0.82, color: "#BF6040" },
  { label: "Avoidance patterns", value: 0.45, color: "#6B8FC7" },
  { label: "Growth trajectory", value: 0.71, color: "#BF6040" },
  { label: "Decision clarity", value: 0.63, color: "#8FA8D4" },
  { label: "Authenticity index", value: 0.88, color: "#BF6040" },
];

// Pre-computed wave heights (sine-based so they look natural)
const WAVE_HEIGHTS = Array.from({ length: 32 }, (_, i) =>
  Math.abs(Math.sin(i * 0.68) * 14 + Math.cos(i * 1.31) * 9) + 6
);

const CHAPTER_TEXT = [
  {
    eyebrow: "01 — The Question",
    headline: "Every day,\none question.",
    body: "No blank page. No pressure to perform. One question, crafted for honest reflection. Tap. Speak. Done.",
    detail: "Rotates from 200+ questions written for self-reflection.",
  },
  {
    eyebrow: "02 — You Speak",
    headline: "Speak freely.\nNo typing.",
    body: "30 seconds or 10 minutes. Your voice captures what your fingers can't — raw and unfiltered.",
    detail: "Works completely offline. Nothing leaves your device.",
  },
  {
    eyebrow: "03 — It Transcribes",
    headline: "Your words,\nback to you.",
    body: "WhisperKit processes your voice entirely on-device. No server. No human. No one listening.",
    detail: "Encrypted at rest. Never used for training. Never shared.",
  },
  {
    eyebrow: "04 — The Journal",
    headline: "Every word\nyou've ever said.",
    body: "Search, browse, revisit. Your complete history of reflections — private, encrypted, yours.",
    detail: "Up to 30 days free. Unlimited history with subscription.",
  },
  {
    eyebrow: "05 — Patterns Emerge",
    headline: "See yourself\nclearly.",
    body: "Over weeks, ÉCHO builds a picture of your emotional patterns, recurring themes, and growth arc — all in your own words.",
    detail: "8-point persona profile updated with every entry.",
  },
  {
    eyebrow: "06 — Time Capsule",
    headline: "Six months later,\nsame question.",
    body: "ÉCHO seals your words and returns them when enough time has passed. Compare who you were to who you are now.",
    detail: "Letters unlock automatically. No gamification. Just truth.",
  },
];

type ScreenType = "question" | "recording" | "transcript" | "journal" | "insights" | "letters";
const CHAPTER_SCREENS: ScreenType[] = ["question", "recording", "transcript", "journal", "insights", "letters"];

// ─── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg:      "#0A1220",
  cream:   "rgba(255,246,233,0.92)",
  muted:   "rgba(255,246,233,0.45)",
  peach:   "rgba(255,228,184,0.65)",
  ember:   "#BF6040",
  card:    "rgba(14,50,114,0.35)",
  border:  "rgba(255,228,184,0.09)",
  indigo:  "rgba(27,77,168,0.3)",
  serif:   "Georgia, 'Times New Roman', serif",
  sans:    "Inter, ui-sans-serif, system-ui, sans-serif",
};

// ─── iPhone 16 Pro Frame ────────────────────────────────────────────────────
function IPhoneFrame({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const W = 290 * scale;
  const H = 630 * scale;
  const br = 50 * scale;
  const screenInset = 10 * scale;
  const screenBr = 42 * scale;
  const diW = 110 * scale;
  const diH = 32 * scale;
  const diTop = 13 * scale;
  const diR = 16 * scale;
  const btnW = 4 * scale;
  const btnR = 3 * scale;

  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>
      {/* Glow under phone */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -30 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: W * 0.75,
          height: 60 * scale,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(191,96,64,0.35), transparent 70%)",
          filter: `blur(${20 * scale}px)`,
          pointerEvents: "none",
        }}
      />

      {/* Chassis */}
      <div
        style={{
          position: "relative",
          width: W,
          height: H,
          borderRadius: br,
          background: "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 45%, #101012 100%)",
          boxShadow: [
            `0 ${70 * scale}px ${110 * scale}px -${20 * scale}px rgba(0,0,0,0.8)`,
            `0 ${28 * scale}px ${48 * scale}px -${10 * scale}px rgba(0,0,0,0.55)`,
            "inset 0 1px 0 rgba(255,255,255,0.11)",
            "inset 0 -1px 0 rgba(0,0,0,0.7)",
            "inset 1px 0 0 rgba(255,255,255,0.065)",
            "inset -1px 0 0 rgba(255,255,255,0.065)",
          ].join(", "),
          overflow: "visible",
        }}
      >
        {/* Titanium edge shimmer */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: br,
            background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 38%, transparent 62%, rgba(255,255,255,0.04) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Screen */}
        <div
          style={{
            position: "absolute",
            top: screenInset,
            left: screenInset,
            right: screenInset,
            bottom: screenInset,
            borderRadius: screenBr,
            background: C.bg,
            overflow: "hidden",
          }}
        >
          {/* Dynamic Island */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: diTop,
              left: "50%",
              transform: "translateX(-50%)",
              width: diW,
              height: diH,
              borderRadius: diR,
              background: "#000",
              zIndex: 20,
            }}
          />

          {/* Screen glare */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "28%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.028), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>{children}</div>

          {/* Home indicator */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 8 * scale,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110 * scale,
              height: 5 * scale,
              borderRadius: 3 * scale,
              background: "rgba(255,255,255,0.2)",
              zIndex: 20,
            }}
          />
        </div>

        {/* Power button */}
        <div aria-hidden style={{ position: "absolute", right: -btnW + 1, top: 130 * scale, width: btnW, height: 66 * scale, borderRadius: `0 ${btnR}px ${btnR}px 0`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        {/* Silent switch */}
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 78 * scale, width: btnW, height: 24 * scale, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        {/* Vol + */}
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 112 * scale, width: btnW, height: 40 * scale, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        {/* Vol - */}
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 162 * scale, width: btnW, height: 60 * scale, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
      </div>
    </div>
  );
}

// ─── Status Bar ─────────────────────────────────────────────────────────────
function StatusBar({ scale = 1 }: { scale?: number }) {
  const pt = 56 * scale;
  const px = 22 * scale;
  return (
    <div style={{ paddingTop: pt, paddingLeft: px, paddingRight: px, paddingBottom: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ color: "rgba(255,246,233,0.75)", fontSize: 13 * scale, fontWeight: 600, fontFamily: C.sans }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 * scale }}>
        <svg width={16 * scale} height={12 * scale} viewBox="0 0 16 12" fill="none">
          <rect x="0" y="4.5" width="3" height="7.5" rx="0.8" fill="rgba(255,246,233,0.4)" />
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.8" fill="rgba(255,246,233,0.65)" />
          <rect x="9" y="0.5" width="3" height="11.5" rx="0.8" fill="rgba(255,246,233,0.9)" />
        </svg>
        <svg width={15 * scale} height={11 * scale} viewBox="0 0 15 11" fill="none">
          <path d="M7.5 8.5a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z" fill="rgba(255,246,233,0.9)" />
          <path d="M4 6.2C5 5.1 6.2 4.5 7.5 4.5s2.5.6 3.5 1.7" stroke="rgba(255,246,233,0.65)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M1.4 3.8C3.1 1.9 5.2 1 7.5 1S11.9 1.9 13.6 3.8" stroke="rgba(255,246,233,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <svg width={24 * scale} height={12 * scale} viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3.5" stroke="rgba(255,246,233,0.38)" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="rgba(255,246,233,0.85)" />
          <path d="M22 4v4c.9-.4 1.5-1 1.5-2s-.6-1.6-1.5-2z" fill="rgba(255,246,233,0.38)" />
        </svg>
      </div>
    </div>
  );
}

// ─── Waveform bars ──────────────────────────────────────────────────────────
function WaveBars({ active, scale = 1 }: { active: boolean; scale?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 * scale, height: 44 * scale, padding: `0 ${6 * scale}px` }}>
      {WAVE_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          style={{ width: 3 * scale, minHeight: 4 * scale, borderRadius: 2 * scale, background: active ? C.ember : "rgba(255,228,184,0.18)", transformOrigin: "center" }}
          animate={active ? { scaleY: [1, h / 12, 0.5, h / 9, 1], opacity: [0.7, 1, 0.75, 1, 0.7] } : { scaleY: 0.25, opacity: 0.25 }}
          initial={{ height: 14 * scale, scaleY: 1 }}
          transition={active ? { duration: 0.72 + (i % 5) * 0.11, repeat: Infinity, delay: i * 0.035, ease: "easeInOut" } : { duration: 0.35 }}
        />
      ))}
    </div>
  );
}

// ─── Phone Screens ──────────────────────────────────────────────────────────

// (motion handled by PhoneScreen wrapper — screens are plain divs)

function QuestionScreen({ scale = 1 }: { scale?: number }) {
  const [qi, setQi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setQi((q) => (q + 1) % QUESTIONS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const px = 20 * scale;
  const words = QUESTIONS[qi].split(/\s+/);

  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 * scale, padding: `0 ${4 * scale}px` }}>
        <span style={{ fontFamily: C.serif, fontSize: 11 * scale, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <span style={{ fontSize: 10 * scale, color: C.muted, fontFamily: C.sans }}>Saturday, 9 May</span>
      </div>
      <p style={{ fontSize: 9 * scale, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 10 * scale, fontFamily: C.sans }}>
        Today's question
      </p>
      <div style={{ minHeight: 76 * scale, marginBottom: 20 * scale }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={qi}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: C.serif, fontSize: 17 * scale, color: C.cream, lineHeight: 1.45, whiteSpace: "pre-line" }}
          >
            {QUESTIONS[qi]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 * scale, height: 56 * scale, marginBottom: 18 * scale, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WaveBars active={false} scale={scale} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 26 * scale }}>
        <div style={{ width: 34 * scale, height: 34 * scale, borderRadius: "50%", background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={10 * scale} height={10 * scale} viewBox="0 0 10 10" fill="none"><path d="M7 2L2 5l5 3" stroke="rgba(255,228,184,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ width: 50 * scale, height: 50 * scale, borderRadius: "50%", background: "linear-gradient(145deg,#D47040,#BF6040)", boxShadow: `0 ${8 * scale}px ${20 * scale}px rgba(191,96,64,0.45)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 17 * scale, height: 17 * scale, borderRadius: "50%", background: "rgba(255,246,233,0.95)" }} />
        </div>
        <div style={{ width: 34 * scale, height: 34 * scale, borderRadius: "50%", background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={10 * scale} height={10 * scale} viewBox="0 0 10 10" fill="none"><path d="M3 2l5 3-5 3" stroke="rgba(255,228,184,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

function RecordingScreen({ scale = 1 }: { scale?: number }) {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(id); }, []);
  const mins = Math.floor(t / 60);
  const secs = (t % 60).toString().padStart(2, "0");
  const px = 20 * scale;

  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 * scale }}>
        <span style={{ fontFamily: C.serif, fontSize: 11 * scale, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 * scale }}>
          <motion.div style={{ width: 6 * scale, height: 6 * scale, borderRadius: "50%", background: C.ember }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
          <span style={{ fontSize: 10 * scale, color: C.ember, fontFamily: C.sans }}>Recording</span>
        </div>
      </div>
      <div style={{ marginBottom: 14 * scale, padding: `${10 * scale}px ${13 * scale}px`, background: C.card, borderRadius: 12 * scale, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 9 * scale, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, marginBottom: 4 * scale, fontFamily: C.sans }}>Today's question</p>
        <p style={{ fontFamily: C.serif, fontSize: 13 * scale, color: C.cream, lineHeight: 1.4 }}>What are you avoiding telling yourself?</p>
      </div>
      <div style={{ background: C.card, border: `1px solid rgba(191,96,64,0.3)`, borderRadius: 14 * scale, height: 68 * scale, marginBottom: 10 * scale, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(191,96,64,0.08) inset" }}>
        <WaveBars active scale={scale} />
      </div>
      <p style={{ textAlign: "center", fontFamily: C.serif, fontSize: 20 * scale, color: C.cream, marginBottom: 16 * scale }}>{mins}:{secs}</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -10 * scale, borderRadius: "50%", background: "rgba(191,96,64,0.18)" }} />
          <div style={{ width: 56 * scale, height: 56 * scale, borderRadius: "50%", background: "linear-gradient(145deg,#D47040,#BF6040)", boxShadow: `0 ${8 * scale}px ${24 * scale}px rgba(191,96,64,0.5)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ width: 18 * scale, height: 18 * scale, borderRadius: 4 * scale, background: "rgba(255,246,233,0.95)" }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TranscriptScreen({ scale = 1 }: { scale?: number }) {
  const transcript = "What I keep avoiding is the conversation about whether I actually want this. Not whether I'm capable — I know I am. But whether it's what I want.";
  const words = transcript.split(" ");
  const px = 20 * scale;

  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 * scale }}>
        <span style={{ fontFamily: C.serif, fontSize: 11 * scale, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 * scale }}>
          <svg width={10 * scale} height={10 * scale} viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="rgba(255,228,184,0.45)" /><path d="M3 5l1.5 1.5L7 3.5" stroke="rgba(255,228,184,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 10 * scale, color: C.muted, fontFamily: C.sans }}>Saved</span>
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 * scale, padding: `${13 * scale}px ${15 * scale}px`, marginBottom: 12 * scale }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 * scale }}>
          <p style={{ fontSize: 10 * scale, color: C.peach, fontFamily: C.sans }}>9 May 2026</p>
          <p style={{ fontSize: 10 * scale, color: C.muted, fontFamily: C.sans }}>0:47</p>
        </div>
        <div style={{ fontSize: 12 * scale, color: C.cream, lineHeight: 1.6, fontFamily: C.sans }}>
          {words.map((word, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.022, duration: 0.25 }}>
              {word}{" "}
            </motion.span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 * scale, padding: `${7 * scale}px ${11 * scale}px`, background: "rgba(27,77,168,0.18)", borderRadius: 10 * scale, border: "1px solid rgba(27,77,168,0.3)" }}>
        <svg width={11 * scale} height={13 * scale} viewBox="0 0 11 13" fill="none"><path d="M5.5 0L0 2.7V7c0 3 2.4 5.8 5.5 6.3C8.6 12.8 11 10 11 7V2.7L5.5 0z" fill="rgba(255,228,184,0.12)" stroke="rgba(255,228,184,0.45)" strokeWidth="0.7" /><path d="M3.5 6.5l1.4 1.4L8 4.5" stroke="rgba(255,228,184,0.65)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontSize: 9 * scale, color: C.muted, fontFamily: C.sans }}>On-device · Encrypted at rest · Never shared</span>
      </div>
    </div>
  );
}

function JournalScreen({ scale = 1 }: { scale?: number }) {
  const px = 20 * scale;
  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 * scale }}>
        <p style={{ fontFamily: C.serif, fontSize: 19 * scale, color: C.cream }}>Journal</p>
        <div style={{ width: 30 * scale, height: 30 * scale, borderRadius: 9 * scale, background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={13 * scale} height={13 * scale} viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,228,184,0.5)" strokeWidth="1.1" /><path d="M8.5 8.5L11 11" stroke="rgba(255,228,184,0.5)" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 * scale }}>
        {JOURNAL_ENTRIES.map((entry, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.38, ease: "easeOut" }}
            style={{ background: i === 0 ? "rgba(191,96,64,0.1)" : C.card, border: `1px solid ${i === 0 ? "rgba(191,96,64,0.28)" : C.border}`, borderRadius: 12 * scale, padding: `${9 * scale}px ${13 * scale}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 * scale }}>
              <p style={{ fontSize: 9 * scale, color: i === 0 ? C.ember : C.muted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: C.sans }}>{entry.date}</p>
              <p style={{ fontSize: 9 * scale, color: C.muted, fontFamily: C.sans }}>{entry.duration}</p>
            </div>
            <p style={{ fontSize: 11 * scale, color: C.cream, lineHeight: 1.5, fontFamily: C.sans, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{entry.preview}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InsightsScreen({ scale = 1 }: { scale?: number }) {
  const px = 20 * scale;
  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ marginBottom: 14 * scale }}>
        <p style={{ fontFamily: C.serif, fontSize: 19 * scale, color: C.cream, marginBottom: 3 * scale }}>Insights</p>
        <p style={{ fontSize: 9 * scale, color: C.muted, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: C.sans }}>Week 12 · 47 entries</p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 * scale, padding: `${13 * scale}px ${15 * scale}px`, marginBottom: 12 * scale }}>
        <p style={{ fontSize: 9 * scale, textTransform: "uppercase", letterSpacing: "0.2em", color: C.peach, marginBottom: 13 * scale, fontFamily: C.sans }}>Your echo profile</p>
        {INSIGHTS_TRAITS.map((trait, i) => (
          <div key={i} style={{ marginBottom: i < INSIGHTS_TRAITS.length - 1 ? 11 * scale : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 * scale }}>
              <p style={{ fontSize: 10 * scale, color: C.cream, fontFamily: C.sans }}>{trait.label}</p>
              <p style={{ fontSize: 10 * scale, color: trait.color, fontFamily: C.sans }}>{Math.round(trait.value * 100)}%</p>
            </div>
            <div style={{ height: 3.5 * scale, borderRadius: 2 * scale, background: "rgba(255,228,184,0.09)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${trait.value * 100}%` }} transition={{ delay: i * 0.14 + 0.25, duration: 0.75, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 2 * scale, background: `linear-gradient(90deg, ${trait.color}, ${trait.color}99)` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(191,96,64,0.09)", border: "1px solid rgba(191,96,64,0.22)", borderRadius: 12 * scale, padding: `${11 * scale}px ${13 * scale}px` }}>
        <p style={{ fontSize: 9 * scale, color: C.ember, marginBottom: 4 * scale, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: C.sans }}>Recurring theme</p>
        <p style={{ fontSize: 11 * scale, color: C.cream, lineHeight: 1.5, fontFamily: C.sans }}>"Avoidance of vulnerability" appears in 8 of your last 12 entries.</p>
      </div>
    </div>
  );
}

function LettersScreen({ scale = 1 }: { scale?: number }) {
  const px = 20 * scale;
  return (
    <div style={{ height: "100%", padding: `0 ${px}px`, background: C.bg }}>
      <StatusBar scale={scale} />
      <div style={{ marginBottom: 16 * scale }}>
        <p style={{ fontFamily: C.serif, fontSize: 19 * scale, color: C.cream, marginBottom: 3 * scale }}>Letters</p>
        <p style={{ fontSize: 9 * scale, color: C.muted, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: C.sans }}>Time capsules</p>
      </div>
      <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.55 }}
        style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18 * scale, padding: `${18 * scale}px ${16 * scale}px`, marginBottom: 12 * scale, textAlign: "center" }}>
        <svg width={46 * scale} height={34 * scale} viewBox="0 0 46 34" fill="none" style={{ display: "block", margin: `0 auto ${10 * scale}px` }}>
          <rect x="1" y="1" width="44" height="32" rx="5" stroke="rgba(255,228,184,0.28)" strokeWidth="1.4" fill="rgba(14,50,114,0.45)" />
          <path d="M1 6l22 15L45 6" stroke="rgba(255,228,184,0.42)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M1 27L15 17" stroke="rgba(255,228,184,0.18)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M45 27L31 17" stroke="rgba(255,228,184,0.18)" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
        <p style={{ fontFamily: C.serif, fontSize: 14 * scale, color: C.cream, marginBottom: 4 * scale }}>November → May</p>
        <p style={{ fontSize: 10 * scale, color: C.muted, marginBottom: 14 * scale, fontFamily: C.sans }}>6 months apart</p>
        <div style={{ background: "rgba(191,96,64,0.14)", border: "1px solid rgba(191,96,64,0.28)", borderRadius: 9 * scale, padding: `${7 * scale}px ${12 * scale}px` }}>
          <p style={{ fontSize: 11 * scale, color: C.ember, fontFamily: C.sans }}>Unlocked · Read your evolution →</p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.55 }}
        style={{ background: "rgba(27,77,168,0.15)", border: "1px solid rgba(27,77,168,0.28)", borderRadius: 12 * scale, padding: `${11 * scale}px ${14 * scale}px` }}>
        <p style={{ fontSize: 9 * scale, color: "rgba(107,143,199,0.9)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 6 * scale, fontFamily: C.sans }}>6 months ago, you wrote</p>
        <p style={{ fontSize: 11 * scale, color: C.cream, lineHeight: 1.6, fontStyle: "italic", fontFamily: C.sans }}>"I don't know if I'm brave enough to leave..."</p>
        <div style={{ height: 1, background: C.border, margin: `${9 * scale}px 0` }} />
        <p style={{ fontSize: 9 * scale, color: C.ember, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 * scale, fontFamily: C.sans }}>Today, you know</p>
        <p style={{ fontSize: 11 * scale, color: C.cream, lineHeight: 1.5, fontFamily: C.sans }}>You were. You did.</p>
      </motion.div>
    </div>
  );
}

// ─── Render the right screen based on state ─────────────────────────────────
// AnimatePresence MUST have a motion element as its direct child to coordinate
// exit animations. We use a single motion.div wrapper keyed by screen name.
function PhoneScreen({ screen, scale = 1 }: { screen: ScreenType; scale?: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >
        {screen === "question"   && <QuestionScreen   scale={scale} />}
        {screen === "recording"  && <RecordingScreen  scale={scale} />}
        {screen === "transcript" && <TranscriptScreen scale={scale} />}
        {screen === "journal"    && <JournalScreen    scale={scale} />}
        {screen === "insights"   && <InsightsScreen   scale={scale} />}
        {screen === "letters"    && <LettersScreen    scale={scale} />}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Panel animation variants ───────────────────────────────────────────────
const panelContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0 } },
  exit:   { transition: { staggerChildren: 0 } },
} as const;

const panelItem = {
  hidden:   { opacity: 0, y: 22, filter: "blur(6px)" },
  visible:  { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const } },
  exit:     { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.16, ease: "easeIn" as const } },
} as const;

const panelItemReduced = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
} as const;

// ─── Main Story Section (sticky scroll) ────────────────────────────────────
function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Spring-smooth the raw scroll value for natural, physics-based chapter detection
  const scrollYProgress = useSpring(rawProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const N = CHAPTER_TEXT.length;
  const screen = CHAPTER_SCREENS[chapter];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const clamped = Math.max(0, Math.min(1 - 0.001, v));
    const c = Math.min(N - 1, Math.floor(clamped * N));
    if (c !== chapterRef.current) {
      chapterRef.current = c;
      setChapter(c);
    }
  });

  const ambientColors = [
    "rgba(27,77,168,0.16)",
    "rgba(191,96,64,0.14)",
    "rgba(14,50,114,0.14)",
    "rgba(27,77,168,0.13)",
    "rgba(191,96,64,0.12)",
    "rgba(107,143,199,0.15)",
  ];

  const ct = CHAPTER_TEXT[chapter];

  const sideCards = [
    [{ icon: "◆", text: "200+ thoughtfully written questions" }],
    [{ icon: "⊙", text: "Fully offline — works in airplane mode" }],
    [{ icon: "▣", text: "WhisperKit: Apple-native on-device transcription" }],
    [{ icon: "⌕", text: "Full-text search across your entire history" }],
    [{ icon: "◈", text: "8-dimensional longitudinal persona profile" }],
    [{ icon: "◷", text: "Auto time-lock — opens when the moment is right" }],
  ];

  return (
    <div ref={containerRef} style={{ height: `${N * 100}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Ambient background color shift */}
        <motion.div
          aria-hidden
          animate={{ background: ambientColors[chapter] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Chapter progress dots — right side */}
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 10, zIndex: 20 }}>
          {CHAPTER_TEXT.map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === chapter ? 1.5 : 1, opacity: i === chapter ? 1 : 0.3, background: i === chapter ? C.ember : "rgba(255,228,184,0.4)" }}
              transition={{ duration: 0.28 }}
              style={{ width: 7, height: 7, borderRadius: "50%" }}
            />
          ))}
        </div>

        {/* Progress bar — top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,228,184,0.08)", zIndex: 20 }}>
          <motion.div
            animate={{ width: `${((chapter + 1) / N) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", background: C.ember, borderRadius: 1 }}
          />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14 w-full max-w-[1100px] px-6 lg:px-10" style={{ minWidth: 0 }}>

          {/* Left panel */}
          <div className="hidden lg:block" style={{ overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                variants={panelContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  variants={prefersReduced ? panelItemReduced : panelItem}
                  style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: C.ember, marginBottom: 16, fontFamily: C.sans }}
                >
                  {ct.eyebrow}
                </motion.p>
                <motion.h2
                  variants={prefersReduced ? panelItemReduced : panelItem}
                  style={{ fontFamily: C.serif, fontSize: "clamp(1.9rem, 3.2vw, 3rem)", color: "#FFF6E9", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 18, whiteSpace: "pre-line" }}
                >
                  {ct.headline}
                </motion.h2>
                <motion.p
                  variants={prefersReduced ? panelItemReduced : panelItem}
                  style={{ fontSize: 16, color: "rgba(255,246,233,0.68)", lineHeight: 1.7, marginBottom: 14, maxWidth: 360 }}
                >
                  {ct.body}
                </motion.p>
                <motion.p
                  variants={prefersReduced ? panelItemReduced : panelItem}
                  style={{ fontSize: 13, color: "rgba(255,228,184,0.42)", lineHeight: 1.6 }}
                >
                  {ct.detail}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center: iPhone */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {/* Mobile chapter label */}
            <div className="block lg:hidden text-center">
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.ember, marginBottom: 6, fontFamily: C.sans }}>
                {ct.eyebrow}
              </p>
              <p style={{ fontFamily: C.serif, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "#FFF6E9", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                {ct.headline}
              </p>
            </div>

            <IPhoneFrame>
              <PhoneScreen screen={screen} />
            </IPhoneFrame>
          </div>

          {/* Right panel */}
          <div className="hidden lg:flex flex-col gap-5" style={{ overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                variants={panelContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Chapter meter */}
                <motion.div variants={prefersReduced ? panelItemReduced : panelItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,228,184,0.3)", fontFamily: C.sans }}>Feature</p>
                    <p style={{ fontSize: 11, color: "rgba(255,228,184,0.3)", fontFamily: C.sans }}>{chapter + 1} / {N}</p>
                  </div>
                  <div style={{ height: 2, background: "rgba(255,228,184,0.09)", borderRadius: 1 }}>
                    <motion.div
                      animate={{ width: `${((chapter + 1) / N) * 100}%` }}
                      transition={{ duration: 0.38, ease: "easeOut" }}
                      style={{ height: "100%", background: C.ember, borderRadius: 1 }}
                    />
                  </div>
                </motion.div>

                {sideCards[chapter].map((card, i) => (
                  <motion.div
                    key={i}
                    variants={prefersReduced ? panelItemReduced : panelItem}
                    style={{ padding: "16px 18px", background: "rgba(255,228,184,0.04)", border: `1px solid ${C.border}`, borderRadius: 14 }}
                  >
                    <span style={{ fontSize: 22, display: "block", marginBottom: 10, color: "rgba(255,228,184,0.6)" }}>{card.icon}</span>
                    <p style={{ fontSize: 13, color: "rgba(255,246,233,0.6)", lineHeight: 1.55, fontFamily: C.sans }}>{card.text}</p>
                  </motion.div>
                ))}

                {/* Scroll hint */}
                <motion.p
                  variants={prefersReduced ? panelItemReduced : panelItem}
                  style={{ fontSize: 11, color: "rgba(255,228,184,0.25)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: C.sans }}
                >
                  ↓ Keep scrolling
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────
function ShowcaseHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY   = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const phoneY  = useTransform(scrollYProgress, [0, 1], [0,  55]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "130px 24px 80px" }}>
      {/* Orbs */}
      <div aria-hidden className="blob-float-1 pointer-events-none absolute" style={{ left: "4%", top: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,96,64,0.28), transparent 70%)", filter: "blur(55px)", opacity: 0.42 }} />
      <div aria-hidden className="blob-float-2 pointer-events-none absolute" style={{ right: "2%", top: "22%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,77,168,0.38), transparent 70%)", filter: "blur(55px)", opacity: 0.32 }} />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center w-full">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 30 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 999, border: "1px solid rgba(255,228,184,0.22)", background: "rgba(255,228,184,0.05)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: "rgba(255,228,184,0.75)", backdropFilter: "blur(8px)", fontFamily: C.sans }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.ember, display: "inline-block" }} />
            ÉCHO for iPhone · European launch 2026
          </span>
        </motion.div>

        {/* Headline */}
        {["The journal", "that listens."].map((line, li) => (
          <div key={line} style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.14 + li * 0.1, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: C.serif, fontSize: "clamp(3.2rem, 10vw, 6.8rem)", letterSpacing: "-0.03em", lineHeight: 0.96, color: li === 0 ? "#FFF6E9" : C.ember, display: "block", marginBottom: li === 0 ? 6 : 0 }}
            >
              {line}
            </motion.h1>
          </div>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.6 }}
          style={{ marginTop: 26, fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: "rgba(255,246,233,0.62)", maxWidth: 460, lineHeight: 1.68, margin: "26px auto 0", fontFamily: C.sans }}
        >
          One question. Your voice. Encrypted on your iPhone.
          <br />
          Returned to you when you need it most.
        </motion.p>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(255,228,184,0.3)", fontFamily: C.sans }}>
            Scroll to explore
          </p>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v11M4 10l5 5 5-5" stroke="rgba(255,228,184,0.38)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating phone */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.38, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: phoneY, marginTop: 56, position: "relative", zIndex: 5 }}
      >
        <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>
          <IPhoneFrame>
            <QuestionScreen />
          </IPhoneFrame>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Privacy Section ─────────────────────────────────────────────────────────
const PRIVACY = [
  { icon: "▣", title: "On-device transcription", body: "WhisperKit runs entirely on your iPhone. Your audio never travels to any server, ever." },
  { icon: "◆", title: "Encrypted at rest", body: "Every entry encrypted with device-level keys. No one — not even Réaclyse — can read them." },
  { icon: "⊗", title: "Zero data sharing", body: "Your voice is never used to train AI. Never sold. Never monetised in any form." },
  { icon: "☁", title: "iCloud sync on your terms", body: "CloudKit keeps your devices in sync using Apple's encrypted infrastructure. Your keys." },
];

function PrivacySection() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px 100px" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,77,168,0.18), transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 920, margin: "0 auto", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.65, ease: "easeOut" }} style={{ textAlign: "center", marginBottom: 68 }}>
          <p style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.ember, marginBottom: 14, fontFamily: C.sans }}>Privacy by design</p>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2.4rem, 6vw, 4.4rem)", letterSpacing: "-0.025em", color: "#FFF6E9", lineHeight: 1.1, marginBottom: 18 }}>
            On your iPhone.{" "}<br />
            <em style={{ color: C.ember, fontStyle: "italic" }}>Nowhere else.</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,246,233,0.58)", maxWidth: 460, margin: "0 auto", lineHeight: 1.68, fontFamily: C.sans }}>
            Your voice is the most intimate thing you share. ÉCHO treats it accordingly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PRIVACY.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.09, duration: 0.55, ease: "easeOut" }}
              style={{ padding: "24px 22px", background: "rgba(14,50,114,0.22)", border: `1px solid ${C.border}`, borderRadius: 20, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 14, color: "rgba(255,228,184,0.55)" }}>{p.icon}</span>
              <h3 style={{ fontFamily: C.serif, fontSize: 17, color: "#FFF6E9", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,246,233,0.56)", lineHeight: 1.62, fontFamily: C.sans }}>{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ["ONE QUESTION", "YOUR VOICE", "ON-DEVICE", "ENCRYPTED", "PRIVATE", "OFFLINE-FIRST", "YOUR WORDS"];
  const track = items.map((i) => `${i}  ·  `).join("");
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(255,228,184,0.08)" }}>
      <div className="marquee-track font-display text-[10px] uppercase tracking-[0.24em] whitespace-nowrap" style={{ color: "rgba(255,228,184,0.26)" }}>
        {track}{track}{track}{track}
      </div>
    </div>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function ShowcaseCTA() {
  return (
    <section id="waitlist" style={{ padding: "100px 24px 140px", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: "easeOut" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: "-0.02em", color: "#FFF6E9", lineHeight: 1.15, marginBottom: 14 }}>
          The first voice you should trust
          <br />
          <em style={{ color: C.ember, fontStyle: "italic" }}>is yours.</em>
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,246,233,0.56)", marginBottom: 40, fontFamily: C.sans }}>
          Join the waitlist. Founding-member pricing at launch.
        </p>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <WaitlistForm variant="footer" />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function ShowcaseNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 50, transition: "all 0.3s", backdropFilter: scrolled ? "blur(18px)" : "none", background: scrolled ? "rgba(10,18,32,0.82)" : "transparent", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none" }}>
          <span style={{ fontFamily: C.serif, fontSize: 22, letterSpacing: "-0.01em", color: "#FFF6E9" }}>ÉCHO</span>
          <span style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "rgba(255,246,233,0.38)", fontFamily: C.sans }}>by Réaclyse</span>
        </Link>
        <a href="#waitlist" style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: "rgba(255,246,233,0.55)", textDecoration: "none", fontFamily: C.sans, transition: "color 0.2s" }}>
          Join waitlist
        </a>
      </div>
    </header>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function ShowcasePage() {
  return (
    <div style={{ background: C.bg, color: "#FFF6E9", minHeight: "100vh", overflowX: "clip" }}>
      <title>ÉCHO — See how it works | Réaclyse</title>
      <meta name="description" content="See how ÉCHO works: one daily question, voice recording, on-device transcription, pattern insights, and time capsule letters. Private voice journaling for iPhone." />

      {/* Fixed ambient */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
        <div className="ambient-orb-a" />
        <div className="ambient-orb-b" />
      </div>

      <ShowcaseNav />
      <ShowcaseHero />
      <MarqueeStrip />
      <StorySection />
      <PrivacySection />
      <ShowcaseCTA />

      {/* Footer link */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center" }}>
        <Link to="/" style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: "rgba(255,246,233,0.35)", textDecoration: "none", fontFamily: C.sans }}>
          ← Back to ÉCHO
        </Link>
      </div>
    </div>
  );
}
