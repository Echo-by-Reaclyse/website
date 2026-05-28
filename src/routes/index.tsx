import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence, useScroll, useTransform, useAnimation, type MotionValue } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { WaitlistForm } from "@/components/WaitlistForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme as useGlobalTheme } from "@/components/ThemeProvider";
import { ThemeToggle as SharedThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

// ── Theme ──────────────────────────────────────────────────────
const C_DARK = {
  bg: "#0A1220",
  cream: "rgba(255,246,233,0.92)",
  muted: "rgba(255,246,233,0.45)",
  peach: "rgba(255,228,184,0.65)",
  ember: "#BF6040",
  card: "rgba(14,50,114,0.35)",
  border: "rgba(255,228,184,0.09)",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "Urbanist, ui-sans-serif, system-ui, sans-serif",
  navBg: "rgba(10,18,32,0.82)",
};
const C_LIGHT = {
  bg: "#FFF6E9",
  cream: "rgba(26,15,5,0.9)",
  muted: "rgba(26,15,5,0.5)",
  peach: "rgba(191,96,64,0.85)",
  ember: "#BF6040",
  card: "rgba(191,96,64,0.07)",
  border: "rgba(26,15,5,0.1)",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "Urbanist, ui-sans-serif, system-ui, sans-serif",
  navBg: "rgba(255,246,233,0.88)",
};
type ThemeColors = typeof C_DARK;
const ThemeCtx = createContext<{ C: ThemeColors; isDark: boolean }>({
  C: C_DARK,
  isDark: true,
});
const useLandingTheme = () => useContext(ThemeCtx);

// ── Animation config ───────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const VP = { once: true, margin: "-60px" } as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.95, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};
const staggerV = (delay = 0.09) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren: 0.04 } },
});

// ── Data ───────────────────────────────────────────────────────
const QUESTIONS = [
  "What are you avoiding\ntelling yourself?",
  "Where do you feel\nmost like yourself?",
  "What decision are\nyou delaying?",
  "What did you need today\nthat you didn't ask for?",
];

const JOURNAL_ENTRIES = [
  {
    date: "Today, 9 May",
    duration: "0:47",
    preview:
      "What I keep avoiding is the conversation about whether I actually want this — not whether I'm capable, but whether...",
  },
  {
    date: "8 May",
    duration: "1:12",
    preview:
      "I feel most like myself when I'm walking alone early in the morning before anyone else is awake and the city...",
  },
  {
    date: "6 May",
    duration: "0:38",
    preview:
      "The decision I keep delaying is the one that requires me to admit I already know the answer...",
  },
  {
    date: "4 May",
    duration: "2:04",
    preview:
      "I didn't ask for space today but I needed it more than anything. The meeting felt suffocating and I stayed...",
  },
  {
    date: "30 Apr",
    duration: "0:55",
    preview:
      "Something shifted this week. I noticed I'm less afraid of being wrong than I used to be...",
  },
];

const INSIGHTS_TRAITS = [
  { label: "Emotional range", value: 0.82, color: "#BF6040" },
  { label: "Avoidance patterns", value: 0.45, color: "#6B8FC7" },
  { label: "Growth trajectory", value: 0.71, color: "#BF6040" },
  { label: "Decision clarity", value: 0.63, color: "#8FA8D4" },
  { label: "Authenticity index", value: 0.88, color: "#BF6040" },
];

const WAVE_HEIGHTS = Array.from(
  { length: 32 },
  (_, i) => Math.abs(Math.sin(i * 0.68) * 14 + Math.cos(i * 1.31) * 9) + 6
);

// Tall bars for the hero background waveform (visual only, not interactive)
const WAVEFORM_BG = Array.from(
  { length: 54 },
  (_, i) => Math.abs(Math.sin(i * 0.43) * 55 + Math.cos(i * 0.91 + 0.8) * 30 + Math.sin(i * 1.85) * 16) + 8
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

type ScreenType =
  | "question"
  | "recording"
  | "transcript"
  | "journal"
  | "insights"
  | "letters";
const CHAPTER_SCREENS: ScreenType[] = [
  "question",
  "recording",
  "transcript",
  "journal",
  "insights",
  "letters",
];

const SIDE_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    text: "200+ thoughtfully written questions",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
    text: "Fully offline — works in airplane mode",
  },
  {
    icon: (
      <svg className="echo-waveform" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="2"  y1="11" x2="2"  y2="13"/>
        <line x1="6"  y1="8"  x2="6"  y2="16"/>
        <line x1="10" y1="4"  x2="10" y2="20"/>
        <line x1="14" y1="3"  x2="14" y2="21"/>
        <line x1="18" y1="7"  x2="18" y2="17"/>
        <line x1="22" y1="10" x2="22" y2="14"/>
      </svg>
    ),
    text: "WhisperKit: Apple-native on-device transcription",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    text: "Full-text search across your entire history",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    text: "8-dimensional longitudinal persona profile",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    text: "Auto time-lock — opens when the moment is right",
  },
];

const PRIVACY = [
  {
    title: "On-device transcription",
    body: "WhisperKit runs entirely on your iPhone. Your audio never travels to any server, ever.",
  },
  {
    title: "Encrypted at rest",
    body: "Every entry encrypted with device-level keys. No one — not even Réaclyse — can read them.",
  },
  {
    title: "Zero data sharing",
    body: "Your voice is never used to train AI. Never sold. Never monetised in any form.",
  },
  {
    title: "iCloud sync on your terms",
    body: "CloudKit keeps your devices in sync using Apple's encrypted infrastructure. Your keys.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is ÉCHO?",
    a: "ÉCHO is a private voice journal for iPhone. Every day, one question appears. You speak your answer — no typing, no blank pages. ÉCHO stores your recording and transcript encrypted on your device, then surfaces it weeks or months later so you can hear how your thinking has evolved.",
  },
  {
    q: "When does ÉCHO launch?",
    a: "ÉCHO launches on the iOS App Store in 2026, starting with European markets: France, Germany, Spain, Italy, Luxembourg, Belgium, the Netherlands, Austria, and Switzerland. Join the waitlist to be notified first and unlock early-access pricing.",
  },
  {
    q: "How is my voice data protected?",
    a: "Your voice recordings and transcripts are encrypted at rest and never used to train external AI models. Transcription happens on your device using WhisperKit — your audio never leaves your iPhone for that step. We never sell or share your personal data.",
  },
  {
    q: "How much does ÉCHO cost?",
    a: "ÉCHO is free to download. A subscription unlocks unlimited journaling history, advanced pattern insights, and time capsule comparisons. Plans start at €7.99 per month or €69 per year. Waitlist members will receive a founding-member offer at launch.",
  },
  {
    q: "Is ÉCHO available on Android?",
    a: "ÉCHO is iOS-only at launch (iPhone, iOS 18+). Android support may come in a later phase. Join the waitlist and we'll let you know when your platform is supported.",
  },
];

const FREE_FEATURES = [
  "Daily question & voice recording",
  "On-device transcription (private)",
  "Last 30 days of journal history",
  "Up to 3 active time capsules",
  "8 weeks of basic insights",
];
const PRO_FEATURES = [
  "Everything in Begin",
  "Unlimited journal history",
  "Full 8-part persona profile",
  "Deep emotional pattern analysis",
  "Unlimited time capsules",
  "Search across all entries",
  "Export your data",
  "Custom themes",
];

// ── iPhone Frame Components ────────────────────────────────────
function StatusBar() {
  return (
    <div
      style={{
        paddingTop: 56,
        paddingBottom: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          color: "rgba(255,246,233,0.75)",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
        }}
      >
        9:41
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <svg width={16} height={12} viewBox="0 0 16 12" fill="none">
          <rect
            x="0"
            y="4.5"
            width="3"
            height="7.5"
            rx="0.8"
            fill="rgba(255,246,233,0.4)"
          />
          <rect
            x="4.5"
            y="2.5"
            width="3"
            height="9.5"
            rx="0.8"
            fill="rgba(255,246,233,0.65)"
          />
          <rect
            x="9"
            y="0.5"
            width="3"
            height="11.5"
            rx="0.8"
            fill="rgba(255,246,233,0.9)"
          />
        </svg>
        <svg width={15} height={11} viewBox="0 0 15 11" fill="none">
          <path
            d="M7.5 8.5a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"
            fill="rgba(255,246,233,0.9)"
          />
          <path
            d="M4 6.2C5 5.1 6.2 4.5 7.5 4.5s2.5.6 3.5 1.7"
            stroke="rgba(255,246,233,0.65)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1.4 3.8C3.1 1.9 5.2 1 7.5 1S11.9 1.9 13.6 3.8"
            stroke="rgba(255,246,233,0.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <svg width={24} height={12} viewBox="0 0 24 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="20"
            height="11"
            rx="3.5"
            stroke="rgba(255,246,233,0.38)"
          />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="rgba(255,246,233,0.85)" />
          <path
            d="M22 4v4c.9-.4 1.5-1 1.5-2s-.6-1.6-1.5-2z"
            fill="rgba(255,246,233,0.38)"
          />
        </svg>
      </div>
    </div>
  );
}

function WaveBars({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        height: 44,
        padding: "0 6px",
      }}
    >
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: active ? "#BF6040" : "rgba(255,228,184,0.18)",
            transformOrigin: "center",
            ...(active
              ? {
                  animation: `featBarPulse ${(0.72 + (i % 5) * 0.11).toFixed(2)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.035).toFixed(3)}s`,
                  opacity: 0.85,
                  ["--bar-peak" as string]: (h / 7).toFixed(2),
                }
              : { transform: "scaleY(0.25)", opacity: 0.25 }),
          }}
        />
      ))}
    </div>
  );
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  const W = 290,
    H = 630,
    br = 50,
    si = 10,
    sbr = 42,
    diW = 110,
    diH = 32,
    diTop = 13,
    diR = 16,
    btnW = 4,
    btnR = 3;
  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          width: W * 0.75,
          height: 60,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(191,96,64,0.35), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: W,
          height: H,
          borderRadius: br,
          background:
            "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 45%, #101012 100%)",
          boxShadow:
            "0 70px 110px -20px rgba(0,0,0,0.8), 0 28px 48px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -1px 0 rgba(0,0,0,0.7), inset 1px 0 0 rgba(255,255,255,0.065), inset -1px 0 0 rgba(255,255,255,0.065)",
          overflow: "visible",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: br,
            background:
              "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 38%, transparent 62%, rgba(255,255,255,0.04) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: si,
            left: si,
            right: si,
            bottom: si,
            borderRadius: sbr,
            background: "#0A1220",
            overflow: "hidden",
          }}
        >
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
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "28%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.028), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
            {children}
          </div>
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.2)",
              zIndex: 20,
            }}
          />
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -btnW + 1,
            top: 130,
            width: btnW,
            height: 66,
            borderRadius: `0 ${btnR}px ${btnR}px 0`,
            background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -btnW + 1,
            top: 78,
            width: btnW,
            height: 24,
            borderRadius: `${btnR}px 0 0 ${btnR}px`,
            background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -btnW + 1,
            top: 112,
            width: btnW,
            height: 40,
            borderRadius: `${btnR}px 0 0 ${btnR}px`,
            background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -btnW + 1,
            top: 162,
            width: btnW,
            height: 60,
            borderRadius: `${btnR}px 0 0 ${btnR}px`,
            background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)",
          }}
        />
      </div>
    </div>
  );
}

// ── Phone Screens ──────────────────────────────────────────────
const C_PHONE = C_DARK;

function QuestionScreen() {
  const C = C_PHONE;
  const [qi, setQi] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => {
        setQi((q) => (q + 1) % QUESTIONS.length);
        setVis(true);
      }, 380);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: "100%", padding: "0 20px 28px", background: C.bg, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          padding: "0 4px",
        }}
      >
        <span
          style={{
            fontFamily: C.serif,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: C.peach,
            textTransform: "uppercase",
          }}
        >
          ÉCHO
        </span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>
          Saturday, 9 May
        </span>
      </div>
      <p
        style={{
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          color: C.muted,
          marginBottom: 10,
          fontFamily: C.sans,
        }}
      >
        Today's question
      </p>
      <div style={{ flex: 1, minHeight: 76, marginBottom: 20 }}>
        <p
          style={{
            fontFamily: C.serif,
            fontSize: 17,
            color: C.cream,
            lineHeight: 1.45,
            whiteSpace: "pre-line",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.38s ease, transform 0.38s ease",
          }}
        >
          {QUESTIONS[qi]}
        </p>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          height: 56,
          marginBottom: 18,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WaveBars active={false} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,228,184,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path
              d="M7 2L2 5l5 3"
              stroke="rgba(255,228,184,0.45)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "linear-gradient(145deg,#D47040,#BF6040)",
            boxShadow: "0 8px 20px rgba(191,96,64,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: "50%",
              background: "rgba(255,246,233,0.95)",
            }}
          />
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,228,184,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path
              d="M3 2l5 3-5 3"
              stroke="rgba(255,228,184,0.45)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RecordingScreen() {
  const C = C_PHONE;
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor(t / 60);
  const secs = (t % 60).toString().padStart(2, "0");

  return (
    <div style={{ height: "100%", padding: "0 20px 28px", background: C.bg, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: C.serif,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: C.peach,
            textTransform: "uppercase",
          }}
        >
          ÉCHO
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.ember,
              animation: "featBlink 1.1s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 10, color: C.ember, fontFamily: C.sans }}>
            Recording
          </span>
        </div>
      </div>
      <div
        style={{
          marginBottom: 14,
          padding: "10px 13px",
          background: C.card,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
        }}
      >
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: C.muted,
            marginBottom: 4,
            fontFamily: C.sans,
          }}
        >
          Today's question
        </p>
        <p
          style={{
            fontFamily: C.serif,
            fontSize: 13,
            color: C.cream,
            lineHeight: 1.4,
          }}
        >
          What are you avoiding telling yourself?
        </p>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          background: C.card,
          border: "1px solid rgba(191,96,64,0.3)",
          borderRadius: 14,
          height: 68,
          marginBottom: 10,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(191,96,64,0.08) inset",
        }}
      >
        <WaveBars active />
      </div>
      <p
        style={{
          textAlign: "center",
          fontFamily: C.serif,
          fontSize: 20,
          color: C.cream,
          marginBottom: 16,
        }}
      >
        {mins}:{secs}
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            animation: "featPulseScale 2.2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              background: "rgba(191,96,64,0.18)",
            }}
          />
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(145deg,#D47040,#BF6040)",
              boxShadow: "0 8px 24px rgba(191,96,64,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: "rgba(255,246,233,0.95)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptScreen() {
  const C = C_PHONE;
  const transcript =
    "What I keep avoiding is the conversation about whether I actually want this. Not whether I'm capable — I know I am. But whether it's what I want.";
  const words = transcript.split(" ");

  return (
    <div style={{ height: "100%", padding: "0 20px 28px", background: C.bg }}>
      <StatusBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: C.serif,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: C.peach,
            textTransform: "uppercase",
          }}
        >
          ÉCHO
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <circle
              cx="5"
              cy="5"
              r="4.5"
              stroke="rgba(255,228,184,0.45)"
            />
            <path
              d="M3 5l1.5 1.5L7 3.5"
              stroke="rgba(255,228,184,0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>
            Saved
          </span>
        </div>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "13px 15px",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 9,
          }}
        >
          <p style={{ fontSize: 10, color: C.peach, fontFamily: C.sans }}>
            9 May 2026
          </p>
          <p style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>
            0:47
          </p>
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.cream,
            lineHeight: 1.6,
            fontFamily: C.sans,
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline",
                opacity: 0,
                animation: `featWordIn 0.25s ease both`,
                animationDelay: `${0.35 + i * 0.022}s`,
              }}
            >
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "7px 11px",
          background: "rgba(27,77,168,0.18)",
          borderRadius: 10,
          border: "1px solid rgba(27,77,168,0.3)",
        }}
      >
        <svg width={11} height={13} viewBox="0 0 11 13" fill="none">
          <path
            d="M5.5 0L0 2.7V7c0 3 2.4 5.8 5.5 6.3C8.6 12.8 11 10 11 7V2.7L5.5 0z"
            fill="rgba(255,228,184,0.12)"
            stroke="rgba(255,228,184,0.45)"
            strokeWidth="0.7"
          />
          <path
            d="M3.5 6.5l1.4 1.4L8 4.5"
            stroke="rgba(255,228,184,0.65)"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{ fontSize: 9, color: C.muted, fontFamily: C.sans }}
        >
          On-device · Encrypted at rest · Never shared
        </span>
      </div>
    </div>
  );
}

function JournalScreen() {
  const C = C_PHONE;
  return (
    <div style={{ height: "100%", padding: "0 20px 28px", background: C.bg }}>
      <StatusBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <p style={{ fontFamily: C.serif, fontSize: 19, color: C.cream }}>
          Journal
        </p>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "rgba(255,228,184,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={13} height={13} viewBox="0 0 13 13" fill="none">
            <circle
              cx="5.5"
              cy="5.5"
              r="4"
              stroke="rgba(255,228,184,0.5)"
              strokeWidth="1.1"
            />
            <path
              d="M8.5 8.5L11 11"
              stroke="rgba(255,228,184,0.5)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {JOURNAL_ENTRIES.map((entry, i) => (
          <div
            key={i}
            style={{
              background: i === 0 ? "rgba(191,96,64,0.1)" : C.card,
              border: `1px solid ${i === 0 ? "rgba(191,96,64,0.28)" : C.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              opacity: 0,
              animation: `featFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) both`,
              animationDelay: `${0.35 + i * 0.08}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <p
                style={{
                  fontSize: 9,
                  color: i === 0 ? C.ember : C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: C.sans,
                }}
              >
                {entry.date}
              </p>
              <p style={{ fontSize: 9, color: C.muted, fontFamily: C.sans }}>
                {entry.duration}
              </p>
            </div>
            <p
              style={{
                fontSize: 11,
                color: C.cream,
                lineHeight: 1.5,
                fontFamily: C.sans,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {entry.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsScreen() {
  const C = C_PHONE;
  return (
    <div style={{ height: "100%", padding: "0 20px 28px", background: C.bg }}>
      <StatusBar />
      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            fontFamily: C.serif,
            fontSize: 19,
            color: C.cream,
            marginBottom: 3,
          }}
        >
          Insights
        </p>
        <p
          style={{
            fontSize: 9,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontFamily: C.sans,
          }}
        >
          Week 12 · 47 entries
        </p>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "13px 15px",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: C.peach,
            marginBottom: 13,
            fontFamily: C.sans,
          }}
        >
          Your echo profile
        </p>
        {INSIGHTS_TRAITS.map((trait, i) => (
          <div
            key={i}
            style={{ marginBottom: i < INSIGHTS_TRAITS.length - 1 ? 11 : 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <p
                style={{ fontSize: 10, color: C.cream, fontFamily: C.sans }}
              >
                {trait.label}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: trait.color,
                  fontFamily: C.sans,
                }}
              >
                {Math.round(trait.value * 100)}%
              </p>
            </div>
            <div
              style={{
                height: 3.5,
                borderRadius: 2,
                background: "rgba(255,228,184,0.09)",
                overflow: "hidden",
              }}
            >
              <div
                style={
                  {
                    height: "100%",
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${trait.color}, ${trait.color}99)`,
                    ["--bar-target" as string]: `${trait.value * 100}%`,
                    animation: `featBarFill 0.75s cubic-bezier(0.22,1,0.36,1) both`,
                    animationDelay: `${0.35 + i * 0.14 + 0.25}s`,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(191,96,64,0.09)",
          border: "1px solid rgba(191,96,64,0.22)",
          borderRadius: 12,
          padding: "11px 13px",
          opacity: 0,
          animation: `featFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both`,
          animationDelay: "1.2s",
        }}
      >
        <p
          style={{
            fontSize: 9,
            color: C.ember,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontFamily: C.sans,
          }}
        >
          Recurring theme
        </p>
        <p
          style={{
            fontSize: 11,
            color: C.cream,
            lineHeight: 1.5,
            fontFamily: C.sans,
          }}
        >
          "Avoidance of vulnerability" appears in 8 of your last 12 entries.
        </p>
      </div>
    </div>
  );
}

function LettersScreen() {
  const C = C_PHONE;
  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontFamily: C.serif,
            fontSize: 19,
            color: C.cream,
            marginBottom: 3,
          }}
        >
          Letters
        </p>
        <p
          style={{
            fontSize: 9,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontFamily: C.sans,
          }}
        >
          Time capsules
        </p>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: "18px 16px",
          marginBottom: 12,
          textAlign: "center",
          opacity: 0,
          animation: "featFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
          animationDelay: "0.35s",
        }}
      >
        <svg
          width={46}
          height={34}
          viewBox="0 0 46 34"
          fill="none"
          style={{ display: "block", margin: "0 auto 10px" }}
        >
          <rect
            x="1"
            y="1"
            width="44"
            height="32"
            rx="5"
            stroke="rgba(255,228,184,0.28)"
            strokeWidth="1.4"
            fill="rgba(14,50,114,0.45)"
          />
          <path
            d="M1 6l22 15L45 6"
            stroke="rgba(255,228,184,0.42)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M1 27L15 17"
            stroke="rgba(255,228,184,0.18)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M45 27L31 17"
            stroke="rgba(255,228,184,0.18)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
        <p
          style={{
            fontFamily: C.serif,
            fontSize: 14,
            color: C.cream,
            marginBottom: 4,
          }}
        >
          November → May
        </p>
        <p
          style={{
            fontSize: 10,
            color: C.muted,
            marginBottom: 14,
            fontFamily: C.sans,
          }}
        >
          6 months apart
        </p>
        <div
          style={{
            background: "rgba(191,96,64,0.14)",
            border: "1px solid rgba(191,96,64,0.28)",
            borderRadius: 9,
            padding: "7px 12px",
          }}
        >
          <p style={{ fontSize: 11, color: C.ember, fontFamily: C.sans }}>
            Unlocked · Read your evolution →
          </p>
        </div>
      </div>
      <div
        style={{
          background: "rgba(27,77,168,0.15)",
          border: "1px solid rgba(27,77,168,0.28)",
          borderRadius: 12,
          padding: "11px 14px",
          opacity: 0,
          animation: "featFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
          animationDelay: "0.65s",
        }}
      >
        <p
          style={{
            fontSize: 9,
            color: "rgba(107,143,199,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            marginBottom: 6,
            fontFamily: C.sans,
          }}
        >
          6 months ago, you wrote
        </p>
        <p
          style={{
            fontSize: 11,
            color: C.cream,
            lineHeight: 1.6,
            fontStyle: "italic",
            fontFamily: C.sans,
          }}
        >
          "I don't know if I'm brave enough to leave..."
        </p>
        <div
          style={{
            height: 1,
            background: C.border,
            margin: "9px 0",
          }}
        />
        <p
          style={{
            fontSize: 9,
            color: C.ember,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: 4,
            fontFamily: C.sans,
          }}
        >
          Today, you know
        </p>
        <p
          style={{
            fontSize: 11,
            color: C.cream,
            lineHeight: 1.5,
            fontFamily: C.sans,
          }}
        >
          You were. You did.
        </p>
      </div>
    </div>
  );
}

// ── PhoneScreen state machine ──────────────────────────────────
type PanelPhase = "visible" | "exiting" | "entering";

function PhoneScreen({ screen }: { screen: ScreenType }) {
  const [displayed, setDisplayed] = useState<ScreenType>(screen);
  const [phase, setPhase] = useState<PanelPhase>("visible");
  const phaseRef = useRef<PanelPhase>("visible");
  const pendingRef = useRef<ScreenType | null>(null);

  const applyChange = useCallback((next: ScreenType) => {
    phaseRef.current = "exiting";
    setPhase("exiting");
    setTimeout(() => {
      setDisplayed(next);
      phaseRef.current = "entering";
      setPhase("entering");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          phaseRef.current = "visible";
          setPhase("visible");
          if (pendingRef.current !== null) {
            const q = pendingRef.current;
            pendingRef.current = null;
            applyChange(q);
          }
        })
      );
    }, 200);
  }, []);

  useEffect(() => {
    if (screen === displayed && phaseRef.current === "visible") return;
    if (phaseRef.current !== "visible") {
      pendingRef.current = screen;
      return;
    }
    applyChange(screen);
  }, [screen, displayed, applyChange]);

  const wrapStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: phase === "visible" ? 1 : 0,
    transform: `scale(${phase === "visible" ? 1 : phase === "entering" ? 0.96 : 1.02})`,
    transition:
      phase === "visible"
        ? "opacity 0.42s cubic-bezier(0.22,1,0.36,1), transform 0.42s cubic-bezier(0.22,1,0.36,1)"
        : phase === "entering"
          ? "none"
          : "opacity 0.18s ease-in, transform 0.18s ease-in",
  };

  return (
    <div style={{ position: "absolute", inset: 0, ...wrapStyle }}>
      {displayed === "question" && <QuestionScreen />}
      {displayed === "recording" && <RecordingScreen />}
      {displayed === "transcript" && <TranscriptScreen />}
      {displayed === "journal" && <JournalScreen />}
      {displayed === "insights" && <InsightsScreen />}
      {displayed === "letters" && <LettersScreen />}
    </div>
  );
}

// ── StorySection stagger helper ────────────────────────────────
function staggerStyle(
  index: number,
  phase: PanelPhase
): React.CSSProperties {
  const delay = `${index * 90}ms`;
  if (phase === "visible")
    return {
      opacity: 1,
      transform: "translateY(0)",
      filter: "blur(0px)",
      transition: `opacity 0.52s ${delay} cubic-bezier(0.22,1,0.36,1), transform 0.52s ${delay} cubic-bezier(0.22,1,0.36,1), filter 0.52s ${delay} cubic-bezier(0.22,1,0.36,1)`,
    };
  if (phase === "entering")
    return {
      opacity: 0,
      transform: "translateY(20px)",
      filter: "blur(6px)",
      transition: "none",
    };
  return {
    opacity: 0,
    transform: "translateY(-10px)",
    filter: "blur(4px)",
    transition:
      "opacity 0.16s ease-in, transform 0.16s ease-in, filter 0.16s ease-in",
  };
}

// ── Nav ────────────────────────────────────────────────────────
function Nav() {
  const { C, isDark } = useLandingTheme();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navBgActive = scrolled || menuOpen;

  return (
    <header
      className="nav-entrance"
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 50,
        transition: "all 0.3s",
        backdropFilter: navBgActive ? "blur(18px) saturate(150%)" : "none",
        WebkitBackdropFilter: navBgActive ? "blur(18px) saturate(150%)" : "none",
        background: navBgActive ? C.navBg : "transparent",
        borderBottom: navBgActive ? `1px solid ${C.border}` : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "12px 20px" : "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, position: "relative" }}>
          {/* Full wordmark — fades out on mobile when scrolled */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              opacity: isMobile && scrolled ? 0 : 1,
              transition: "opacity 0.25s",
              pointerEvents: isMobile && scrolled ? "none" : "auto",
            }}
          >
            <img
              src="/logo-name.svg"
              alt="ÉCHO"
              style={{ height: 22, width: "auto", opacity: 0.92 }}
            />
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: C.muted,
                fontFamily: C.sans,
                paddingBottom: 2,
              }}
            >
              by Réaclyse
            </span>
          </div>
          {/* Icon-only — fades in on mobile when scrolled */}
          <div
            className="sm:hidden"
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: scrolled ? 0.85 : 0,
              transition: "opacity 0.25s",
              pointerEvents: scrolled ? "auto" : "none",
            }}
          >
            <img src="/logo.svg" alt="ÉCHO" style={{ height: 18, width: "auto" }} />
          </div>
        </div>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden sm:flex" style={{ alignItems: "center", gap: 22 }}>
          <button
            onClick={() => scrollTo("story")}
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: C.muted,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: C.sans,
              transition: "color 0.2s",
              padding: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.ember)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("waitlist")}
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: C.muted,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: C.sans,
              transition: "color 0.2s",
              padding: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.ember)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
          >
            Waitlist
          </button>
          <SharedThemeToggle />
        </div>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          className="flex sm:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            padding: "2px",
            flexShrink: 0,
          }}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden"
          style={{
            padding: "4px 24px 16px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <button
            onClick={() => scrollTo("story")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: C.muted,
              background: "none",
              border: "none",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: C.sans,
              padding: "14px 0",
            }}
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("waitlist")}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: C.muted,
              background: "none",
              border: "none",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: C.sans,
              padding: "14px 0",
            }}
          >
            Waitlist
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
            }}
          >
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: C.muted,
                fontFamily: C.sans,
              }}
            >
              Theme
            </span>
            <SharedThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

// ── MarqueeStrip ───────────────────────────────────────────────
function MarqueeStrip({ reversed }: { reversed?: boolean }) {
  const { C, isDark } = useLandingTheme();
  const items = [
    "ONE QUESTION",
    "YOUR VOICE",
    "ON-DEVICE",
    "ENCRYPTED",
    "PRIVATE",
    "OFFLINE-FIRST",
    "YOUR WORDS",
  ];
  const track = items.map((i) => `${i}  ·  `).join("");
  return (
    <div
      className="overflow-hidden border-y py-4"
      style={{
        borderColor: isDark ? "rgba(255,228,184,0.08)" : "rgba(26,15,5,0.1)",
      }}
    >
      <div
        className="marquee-track font-display text-[10px] uppercase tracking-[0.24em] whitespace-nowrap"
        style={{
          color: isDark
            ? "rgba(255,228,184,0.26)"
            : "rgba(26,15,5,0.28)",
          animationDirection: reversed ? "reverse" : "normal",
        }}
      >
        {track}
        {track}
        {track}
        {track}
      </div>
    </div>
  );
}

// ── Card content components (reused in desktop + mobile) ──────

function Card1Content() {
  return (
    <div style={{
      padding: "26px 28px 22px",
      borderRadius: 28,
      background: "linear-gradient(165deg, rgba(16,26,52,0.97) 0%, rgba(6,10,18,0.99) 100%)",
      border: "1px solid rgba(255,228,184,0.12)",
      boxShadow: "0 64px 110px rgba(0,0,0,0.7), 0 0 60px rgba(191,96,64,0.09), inset 0 1px 0 rgba(255,246,233,0.07)",
      backdropFilter: "blur(14px)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,228,184,0.32)" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: "rgba(255,228,184,0.05)", border: "1px solid rgba(255,228,184,0.09)" }}>
          <svg width={8} height={8} viewBox="0 0 10 10" fill="none" aria-hidden><circle cx="5" cy="5" r="4.5" stroke="rgba(255,228,184,0.45)" strokeWidth="0.8" /><path d="M3 5l1.5 1.5L7.5 3" stroke="rgba(255,228,184,0.65)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 8, color: "rgba(255,228,184,0.38)", letterSpacing: "0.12em", fontFamily: "Inter, sans-serif" }}>Saved</span>
        </div>
      </div>
      <p style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(255,228,184,0.28)", marginBottom: 9, fontFamily: "Inter, sans-serif" }}>Today's question</p>
      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 16.5, color: "rgba(255,246,233,0.91)", lineHeight: 1.4, marginBottom: 16, fontStyle: "italic" }}>
        What are you avoiding telling yourself?
      </p>
      <div style={{ padding: "11px 13px", borderRadius: 12, background: "rgba(255,228,184,0.04)", border: "1px solid rgba(255,228,184,0.07)", marginBottom: 16 }}>
        <p style={{ fontSize: 11.5, color: "rgba(255,246,233,0.62)", lineHeight: 1.68, fontFamily: "Inter, sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          What I keep avoiding is the conversation about whether I actually want this — not whether I'm capable, but whether it's truly what I want.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 1.5, height: 18 }}>
          {WAVE_HEIGHTS.slice(0, 26).map((h, i) => (
            <div key={i} style={{ width: 2.5, height: Math.max(2, Math.round(h * 0.5)), borderRadius: 1.5, background: `rgba(191,96,64,${0.32 + (i % 4) * 0.1})` }} />
          ))}
        </div>
        <span style={{ fontSize: 9, color: "rgba(255,228,184,0.32)", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>0:47</span>
      </div>
    </div>
  );
}

function Card2Content() {
  return (
    <div style={{
      padding: "22px 24px",
      borderRadius: 24,
      background: "linear-gradient(165deg, rgba(16,26,52,0.96) 0%, rgba(6,10,18,0.99) 100%)",
      border: "1px solid rgba(107,143,199,0.14)",
      boxShadow: "0 44px 80px rgba(0,0,0,0.58), 0 0 40px rgba(27,77,168,0.07), inset 0 1px 0 rgba(255,246,233,0.06)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(107,143,199,0.75)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>8 months ago, you wrote</p>
        <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 13.5, color: "rgba(255,246,233,0.72)", lineHeight: 1.58, fontStyle: "italic" }}>
          "I don't know if I'm brave enough to leave..."
        </p>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, rgba(191,96,64,0.28), transparent)", margin: "0 0 14px" }} />
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(191,96,64,0.72)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>Today, you know</p>
        <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 16, color: "rgba(255,246,233,0.94)", letterSpacing: "0" }}>You were. You did.</p>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "rgba(191,96,64,0.1)", border: "1px solid rgba(191,96,64,0.22)" }}>
        <svg width={7} height={8} viewBox="0 0 8 9" fill="none" aria-hidden><path d="M4 0.5L0.5 2.2V5.5c0 1.8 1.5 3.2 3.5 3.5C6 8.7 7.5 7.3 7.5 5.5V2.2L4 0.5z" fill="rgba(191,96,64,0.25)" stroke="rgba(191,96,64,0.65)" strokeWidth="0.7" /></svg>
        <span style={{ fontSize: 8, color: "rgba(191,96,64,0.82)", letterSpacing: "0.14em", textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif" }}>Unlocked · 6 months</span>
      </div>
    </div>
  );
}

// ── HeroWaveLines — gentle SVG undulating strokes ─────────────
// ── FloatCard — continuous float animation ──────────────────────
function FloatCard({
  floatY,
  floatRotate,
  duration,
  delay = 0,
  children,
}: {
  floatY: number[];
  floatRotate: number[];
  duration: number;
  delay?: number;
  children: React.ReactNode;
}) {
  const controls = useAnimation();

  const startFloat = useCallback(() => {
    controls.start({
      y: floatY,
      rotate: floatRotate,
      transition: { duration, ease: "easeInOut", repeat: Infinity },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(startFloat, delay * 1000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div animate={controls} style={{ cursor: "default" }}>
      {children}
    </motion.div>
  );
}

function HeroWaveLines({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity, position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <svg
        viewBox="0 0 900 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* Wave A — warm ember, lowest */}
        <g style={{ animation: "wave-drift-a 10s ease-in-out infinite" }}>
          <path d="M-50,590 C150,545 300,635 500,590 C700,545 820,610 950,575"
            stroke="rgba(191,96,64,0.10)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
        {/* Wave B — ember, mid-low */}
        <g style={{ animation: "wave-drift-b 13s ease-in-out infinite" }}>
          <path d="M-50,465 C120,425 280,510 480,468 C680,425 810,495 950,458"
            stroke="rgba(191,96,64,0.065)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>
        {/* Wave C — cool blue, center */}
        <g style={{ animation: "wave-drift-c 16s ease-in-out infinite" }}>
          <path d="M-50,348 C140,308 290,390 490,348 C690,305 820,374 950,338"
            stroke="rgba(107,143,199,0.055)" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
        {/* Wave D — ember, upper */}
        <g style={{ animation: "wave-drift-a 19s ease-in-out infinite reverse" }}>
          <path d="M-50,228 C130,192 280,268 490,226 C700,184 820,248 950,216"
            stroke="rgba(191,96,64,0.038)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </g>
        {/* Wave E — blue, top */}
        <g style={{ animation: "wave-drift-b 23s ease-in-out infinite reverse" }}>
          <path d="M-50,118 C160,82 310,150 510,110 C710,70 830,132 950,98"
            stroke="rgba(107,143,199,0.028)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

// ── HeroVisual — desktop full-bleed floating composition ───────
function HeroVisual({ bg, scrollYProgress }: { bg: string; scrollYProgress: MotionValue<number> }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor(tick / 60);
  const secs = (tick % 60).toString().padStart(2, "0");

  // Pixel parallax — predictable depth per card layer
  const c1y = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const c2y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const c3y = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const allO = useTransform(scrollYProgress, [0.35, 0.72], [1, 0]);
  const bgO  = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>

      {/* Decorative É — faint editorial texture */}
      <motion.div aria-hidden style={{ opacity: bgO, position: "absolute", top: "0%", right: "-4%", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(240px, 28vw, 420px)", lineHeight: 1, fontStyle: "italic", userSelect: "none", pointerEvents: "none", color: "rgba(191,96,64,0.028)", letterSpacing: "-0.05em" }}>
        É
      </motion.div>

      {/* Gentle SVG wave lines */}
      <HeroWaveLines opacity={bgO} />

      {/* Ambient glows */}
      <motion.div aria-hidden style={{ opacity: bgO, position: "absolute", top: "35%", left: "18%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,96,64,0.09), transparent 65%)", filter: "blur(100px)", pointerEvents: "none" }} />
      <motion.div aria-hidden style={{ opacity: bgO, position: "absolute", top: "8%",  right: "8%",  width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,77,168,0.10),  transparent 65%)", filter: "blur(60px)",  pointerEvents: "none" }} />

      {/* Card 2: time capsule — upper right */}
      <motion.div style={{ y: c2y, opacity: allO, position: "absolute", top: "18%", right: "5%", width: 262, zIndex: 4 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <FloatCard floatY={[0, -14, 0]} floatRotate={[2.5, 1.0, 2.5]} duration={7} delay={0.5}>
            <Card2Content />
          </FloatCard>
        </motion.div>
      </motion.div>

      {/* Card 3: ghost recording — lower right */}
      <motion.div style={{ y: c3y, opacity: allO, position: "absolute", bottom: "18%", right: "6%", width: 196, zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 0.44, y: 0 }} transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}>
          <FloatCard floatY={[0, -11, 0]} floatRotate={[3, 4.4, 3]} duration={8.5} delay={1.2}>
            <div style={{ borderRadius: 20, padding: "16px 18px", background: "linear-gradient(165deg, rgba(14,22,44,0.84), rgba(6,10,18,0.90))", border: "1px solid rgba(255,228,184,0.05)", boxShadow: "0 18px 40px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,246,233,0.04)", backdropFilter: "blur(10px)", transition: "box-shadow 0.35s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#BF6040", animation: "featBlink 1.1s ease-in-out infinite" }} />
                  <span style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: "rgba(191,96,64,0.8)", fontFamily: "Inter, sans-serif" }}>Rec</span>
                </div>
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 11, color: "rgba(255,246,233,0.45)", letterSpacing: "0.04em" }}>{mins}:{secs}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 1.5, height: 22, marginBottom: 9 }}>
                {WAVE_HEIGHTS.slice(0, 20).map((h, i) => (
                  <div key={i} style={{ width: 2.5, height: Math.max(3, Math.round(h * 0.65)), borderRadius: 1.5, background: "rgba(191,96,64,0.45)" }} />
                ))}
              </div>
              <p style={{ fontSize: 8.5, color: "rgba(255,228,184,0.2)", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em" }}>3 May 2026</p>
            </div>
          </FloatCard>
        </motion.div>
      </motion.div>

      {/* Card 1: journal entry — PRIMARY, vertically centered */}
      <motion.div style={{ y: c1y, opacity: allO, position: "absolute", top: "50%", left: "20%", zIndex: 10 }}>
        <div style={{ transform: "translateY(-50%)", width: 296 }}>
          <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.15, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}>
            <FloatCard floatY={[0, -16, 0]} floatRotate={[-1.5, -3.0, -1.5]} duration={6} delay={0.8}>
              <Card1Content />
            </FloatCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Left-edge fade — no sharp boundary between text column and cards */}
      <div aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 180, background: `linear-gradient(to right, ${bg} 0%, ${bg} 25%, transparent 100%)`, pointerEvents: "none", zIndex: 25 }} />

      {/* Bottom fade */}
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: `linear-gradient(to top, ${bg}, transparent)`, pointerEvents: "none", zIndex: 20 }} />
    </div>
  );
}

// ── HeroVisualMobile — compact stacked cards for small screens ─
function HeroVisualMobile() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto", height: 290 }}>
      {/* Card 2 peeking behind — ghost */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 0.48, y: 0 }}
        transition={{ duration: 1.0, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", top: 0, left: 10, right: -10, zIndex: 1 }}
      >
        <FloatCard floatY={[0, -12, 0]} floatRotate={[3, 1.8, 3]} duration={7.5} delay={1.0}>
          <Card2Content />
        </FloatCard>
      </motion.div>
      {/* Card 1 on top — primary */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 22 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      >
        <FloatCard floatY={[0, -15, 0]} floatRotate={[-1.5, -3.0, -1.5]} duration={6} delay={0.7}>
          <Card1Content />
        </FloatCard>
      </motion.div>
    </div>
  );
}

// ── HeroSection ────────────────────────────────────────────────
function HeroSection() {
  const { C, isDark } = useLandingTheme();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Background orb parallax
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  // Left-column text lifts slightly as you scroll out (creates depth)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textO = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scrollCueO = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", display: "flex", alignItems: "center" }}
    >
      {/* Background orbs */}
      <motion.div aria-hidden style={{ y: y1, position: "absolute", left: "1%", top: "6%", width: 580, height: 580, pointerEvents: "none", zIndex: 1 }}>
        <div className="blob-float-1" style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(191,96,64,0.26), transparent 68%)", filter: "blur(65px)", opacity: isDark ? 0.35 : 0.16 }} />
      </motion.div>
      <motion.div aria-hidden style={{ y: y2, position: "absolute", left: "16%", bottom: "4%", width: 400, height: 400, pointerEvents: "none", zIndex: 1 }}>
        <div className="blob-float-2" style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(27,77,168,0.38), transparent 68%)", filter: "blur(58px)", opacity: isDark ? 0.26 : 0.12 }} />
      </motion.div>

      {/* Left content column */}
      <motion.div
        style={{ y: textY, opacity: textO }}
        className="relative z-10 w-full lg:w-auto lg:flex-none"
      >
        <div style={{
          width: "min(580px, 100%)",
          paddingTop: 130,
          paddingBottom: 90,
          paddingLeft: "max(40px, min(6vw, 96px))",
          paddingRight: "max(40px, min(4vw, 60px))",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }} className="max-lg:items-center max-lg:text-center max-lg:!px-6 max-lg:!w-full max-lg:max-w-lg max-lg:mx-auto max-lg:!pt-[72px]">

          {/* Badge */}
          <div className="hero-badge" style={{ marginBottom: 32 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 999, border: `1px solid ${isDark ? "rgba(255,228,184,0.2)" : "rgba(191,96,64,0.28)"}`, background: isDark ? "rgba(255,228,184,0.05)" : "rgba(191,96,64,0.06)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, fontFamily: C.sans }}>
              <span className="badge-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.ember, display: "inline-block" }} />
              European launch — iOS 2026
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: C.serif, fontSize: "clamp(3.2rem, 6.5vw, 5.6rem)", letterSpacing: "0", lineHeight: 0.94, marginBottom: 28 }}>
            <span className="block" style={{ overflow: "hidden" }}>
              {"The journal".split(" ").map((word, i) => (
                <span key={word} className="hero-word" style={{ color: C.cream, display: "inline-block", marginRight: "0.22em", animationDelay: `${0.14 + i * 0.08}s` }}>{word}</span>
              ))}
            </span>
            <span className="block" style={{ overflow: "hidden" }}>
              <span className="hero-word" style={{ color: C.cream, display: "inline-block", marginRight: "0.22em", animationDelay: "0.30s" }}>that</span>
              <span className="hero-word" style={{ color: C.ember, fontStyle: "italic", display: "inline-block", animationDelay: "0.38s" }}>listens.</span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="hero-fade" style={{ fontFamily: C.sans, fontSize: "clamp(0.95rem, 1.4vw, 1.08rem)", color: C.muted, maxWidth: 400, lineHeight: 1.75, marginBottom: 36, animationDelay: "0.55s" }}>
            One question a day. Your voice, encrypted on your iPhone.
            Returned to you when you need it most.
          </p>

          {/* Waitlist form */}
          <div className="hero-fade w-full" style={{ maxWidth: 440, animationDelay: "0.70s" }}>
            <WaitlistForm variant="hero" />
          </div>

          {/* Stats */}
          <div className="hero-fade" style={{ display: "flex", flexWrap: "wrap", gap: "12px 36px", marginTop: 36, animationDelay: "0.88s" }}>
            {[{ k: "2026", v: "Launch" }, { k: "iOS 18+", v: "Platform" }, { k: "9 countries", v: "Europe first" }].map(({ k, v }) => (
              <div key={k}>
                <p style={{ fontFamily: C.serif, fontSize: 18, color: C.cream, letterSpacing: "0" }}>{k}</p>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: C.muted, fontFamily: C.sans, marginTop: 2 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Mobile visual — shown only below lg */}
          <div className="block lg:hidden hero-fade w-full mt-12 pb-6" style={{ animationDelay: "1.0s" }}>
            <HeroVisualMobile />
          </div>
        </div>
      </motion.div>

      {/* Desktop right panel — fills from 580px mark to right screen edge */}
      <div className="hidden lg:block" style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: "min(580px, 50%)", zIndex: 5 }}>
        <HeroVisual bg={C.bg} scrollYProgress={scrollYProgress} />
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20"
        aria-hidden
      >
        <motion.div style={{ opacity: scrollCueO }}>
          <div style={{ height: 44, width: 1, background: `linear-gradient(to bottom, ${isDark ? "rgba(255,228,184,0.5)" : "rgba(26,15,5,0.3)"}, transparent)` }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── ManifestoSection ───────────────────────────────────────────
function ManifestoSection() {
  const { C, isDark } = useLandingTheme();

  return (
    <section
      id="manifesto"
      style={{
        position: "relative",
        padding: "120px 24px",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: isDark
          ? "radial-gradient(circle, rgba(191,96,64,0.07), transparent 65%)"
          : "radial-gradient(circle, rgba(191,96,64,0.05), transparent 65%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            color: C.ember,
            marginBottom: 20,
            fontFamily: C.sans,
          }}
        >
          — The concept
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            letterSpacing: "0",
            color: C.cream,
            lineHeight: 1.08,
            marginBottom: 24,
          }}
        >
          Most journals stay empty.{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            Not anymore.
          </em>
        </motion.h2>

        <motion.div
          variants={staggerV(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {[
            "ÉCHO removes the hardest part of journaling — the blank page, the cursor blinking, the pressure to sound articulate. Instead, one question appears. You speak. That's it.",
            "Over weeks, your voice becomes a record of who you are: what you're afraid of, what energises you, what you've been avoiding. Not a diary — a mirror.",
            "And six months later, ÉCHO returns your own words to you. You'll be surprised how much you already knew.",
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
                color: C.muted,
                lineHeight: 1.75,
                fontFamily: C.sans,
              }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>

        {/* Quote callout */}
        <motion.blockquote
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            margin: "48px 0 0",
            padding: "28px 32px",
            background: isDark
              ? "rgba(191,96,64,0.07)"
              : "rgba(191,96,64,0.05)",
            border: `1px solid ${isDark ? "rgba(191,96,64,0.2)" : "rgba(191,96,64,0.15)"}`,
            borderLeft: `3px solid ${C.ember}`,
            borderRadius: "0 16px 16px 0",
          }}
        >
          <p
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
              color: C.cream,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "You were clearer than you thought. You already knew what you
            needed to know."
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}

// ── StorySection ───────────────────────────────────────────────
function StorySection() {
  const { C, isDark } = useLandingTheme();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const N = CHAPTER_TEXT.length;

  // headline(40) + gap(16) + phone(630)
  const MOBILE_CONTENT_H = 686;
  const [mobileScale, setMobileScale] = useState(1);

  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<PanelPhase>("visible");
  const phaseRef = useRef<PanelPhase>("visible");
  const pendingRef = useRef<number | null>(null);
  const chapterRef = useRef(0);

  const ambientColors = isDark
    ? [
        "rgba(27,77,168,0.16)",
        "rgba(191,96,64,0.14)",
        "rgba(14,50,114,0.14)",
        "rgba(27,77,168,0.13)",
        "rgba(191,96,64,0.12)",
        "rgba(107,143,199,0.15)",
      ]
    : [
        "rgba(191,96,64,0.08)",
        "rgba(191,96,64,0.12)",
        "rgba(191,96,64,0.06)",
        "rgba(27,77,168,0.06)",
        "rgba(191,96,64,0.10)",
        "rgba(107,143,199,0.09)",
      ];

  const applyChapterChange = useCallback((next: number) => {
    phaseRef.current = "exiting";
    setPhase("exiting");
    setTimeout(() => {
      setDisplayed(next);
      phaseRef.current = "entering";
      setPhase("entering");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          phaseRef.current = "visible";
          setPhase("visible");
          if (
            pendingRef.current !== null &&
            pendingRef.current !== next
          ) {
            const queued = pendingRef.current;
            pendingRef.current = null;
            applyChapterChange(queued);
          } else {
            pendingRef.current = null;
          }
        })
      );
    }, 180);
  }, []);

  // Single scroll handler for all screen sizes — reads container height
  // dynamically so it works for both mobile (N×50vh) and desktop (N×100vh).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(0.9999, -rect.top / scrollable));
      const c = Math.min(N - 1, Math.floor(progress * N));
      if (c !== chapterRef.current) {
        chapterRef.current = c;
        if (phaseRef.current !== "visible") {
          pendingRef.current = c;
          return;
        }
        applyChapterChange(c);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [N, applyChapterChange]);

  // Compute scale so the phone + headline + dots fit between nav and bottom of viewport.
  // Nav is ~46px tall (no viewport-fit=cover, so page starts below OS status bar).
  // 56px top clearance + 16px bottom padding = 72px reserved.
  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      const avail = window.innerHeight - 72;
      setMobileScale(Math.min(1, avail / MOBILE_CONTENT_H));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isMobile, MOBILE_CONTENT_H]);

  const ct = CHAPTER_TEXT[displayed];
  const screen = CHAPTER_SCREENS[displayed];

  return (
    <div ref={containerRef} style={{ position: "relative", height: isMobile ? `${N * 50}vh` : `${N * 100}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "clip",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
          paddingTop: isMobile ? 56 : 0,
          paddingBottom: isMobile ? 16 : 0,
          // Pre-promote to compositing layer so there is no dynamic "sticky
          // promotion" event in iOS Safari — that event is what creates the
          // 1px seam artifact.
          willChange: "transform",
        }}
      >
        {/* Ambient color */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: ambientColors[displayed],
            transition: "background 0.7s ease-in-out",
          }}
        />

        {/* Progress bar — desktop only */}
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: isDark
              ? "rgba(255,228,184,0.08)"
              : "rgba(26,15,5,0.08)",
            zIndex: 20,
          }}
        >
          <div
            style={{
              height: "100%",
              background: C.ember,
              borderRadius: 1,
              width: `${((displayed + 1) / N) * 100}%`,
              transition: "width 0.4s ease-out",
            }}
          />
        </div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 20,
          }}
        >
          {CHAPTER_TEXT.map((_, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                transform: `scale(${i === displayed ? 1.5 : 1})`,
                opacity: i === displayed ? 1 : 0.3,
                background:
                  i === displayed
                    ? C.ember
                    : isDark
                      ? "rgba(255,228,184,0.4)"
                      : "rgba(26,15,5,0.25)",
                transition:
                  "transform 0.28s ease, opacity 0.28s ease, background 0.28s ease",
              }}
            />
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14 w-full max-w-[1100px] px-6 lg:px-10"
          style={{ minWidth: 0 }}
        >
          {/* Left panel — desktop only */}
          <div className="hidden lg:block" style={{ overflow: "hidden" }}>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                color: C.ember,
                marginBottom: 16,
                fontFamily: C.sans,
                ...staggerStyle(0, phase),
              }}
            >
              {ct.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.9rem, 3.2vw, 3rem)",
                color: C.cream,
                lineHeight: 1.08,
                letterSpacing: "0",
                marginBottom: 18,
                whiteSpace: "pre-line",
                ...staggerStyle(1, phase),
              }}
            >
              {ct.headline}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: isDark
                  ? "rgba(255,246,233,0.68)"
                  : "rgba(26,15,5,0.65)",
                lineHeight: 1.7,
                marginBottom: 14,
                maxWidth: 360,
                ...staggerStyle(2, phase),
              }}
            >
              {ct.body}
            </p>
            <p
              style={{
                fontSize: 13,
                color: isDark
                  ? "rgba(255,228,184,0.42)"
                  : "rgba(26,15,5,0.4)",
                lineHeight: 1.6,
                ...staggerStyle(3, phase),
              }}
            >
              {ct.detail}
            </p>
          </div>

          {/* Center: iPhone + mobile text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* Scale wrapper — on mobile, shrinks to fit viewport height */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                ...(isMobile && mobileScale < 1 ? {
                  transform: `scale(${mobileScale})`,
                  transformOrigin: "top center",
                  // Pull following content up so layout height = visual height
                  marginBottom: MOBILE_CONTENT_H * (mobileScale - 1),
                } : {}),
              }}
            >
              {/* Mobile headline — hidden on desktop */}
              <div className="block lg:hidden text-center">
                <p
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: C.ember,
                    marginBottom: 6,
                    fontFamily: C.sans,
                  }}
                >
                  {ct.eyebrow}
                </p>
                <p
                  style={{
                    fontFamily: C.serif,
                    fontSize: "clamp(1.4rem, 5vw, 2rem)",
                    color: C.cream,
                    lineHeight: 1.15,
                    letterSpacing: "0",
                    whiteSpace: "pre-line",
                  }}
                >
                  {ct.headline}
                </p>
              </div>
              <IPhoneFrame>
                <PhoneScreen screen={screen} />
              </IPhoneFrame>
            </div>
          </div>

          {/* Right panel — desktop only */}
          <div
            className="hidden lg:flex flex-col gap-5"
            style={{ overflow: "hidden" }}
          >
            {/* Feature meter */}
            <div style={staggerStyle(0, phase)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: isDark
                      ? "rgba(255,228,184,0.3)"
                      : "rgba(26,15,5,0.35)",
                    fontFamily: C.sans,
                  }}
                >
                  Feature
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: isDark
                      ? "rgba(255,228,184,0.3)"
                      : "rgba(26,15,5,0.35)",
                    fontFamily: C.sans,
                  }}
                >
                  {displayed + 1} / {N}
                </p>
              </div>
              <div
                style={{
                  height: 2,
                  background: isDark
                    ? "rgba(255,228,184,0.09)"
                    : "rgba(26,15,5,0.09)",
                  borderRadius: 1,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: C.ember,
                    borderRadius: 1,
                    width: `${((displayed + 1) / N) * 100}%`,
                    transition: "width 0.38s ease-out",
                  }}
                />
              </div>
            </div>

            {/* Side card */}
            <div
              style={{
                padding: "22px 22px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                ...staggerStyle(1, phase),
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`icon-${displayed}`}
                  initial={{ opacity: 0, scale: 0.55, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 8 }}
                  transition={{ type: "spring", stiffness: 480, damping: 22 }}
                  style={{
                    display: "inline-flex",
                    marginBottom: 14,
                    color: isDark ? "rgba(255,228,184,0.65)" : "rgba(26,15,5,0.5)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -2.5, 0] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                  >
                    {SIDE_CARDS[displayed].icon}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`text-${displayed}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut", delay: 0.05 }}
                  style={{
                    fontSize: 13,
                    color: isDark ? "rgba(255,246,233,0.6)" : "rgba(26,15,5,0.6)",
                    lineHeight: 1.55,
                    fontFamily: C.sans,
                    margin: 0,
                  }}
                >
                  {SIDE_CARDS[displayed].text}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Scroll hint */}
            <p
              style={{
                fontSize: 11,
                color: isDark
                  ? "rgba(255,228,184,0.25)"
                  : "rgba(26,15,5,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontFamily: C.sans,
                ...staggerStyle(2, phase),
              }}
            >
              ↓ Keep scrolling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PrivacySection ─────────────────────────────────────────────
const PRIVACY_ICONS = [
  <svg key="mic" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  <svg key="lock" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V5l7-3z" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  <svg key="cloud" viewBox="0 0 24 24" fill="none">
    <path d="M18 10a6 6 0 00-11.9-1A4 4 0 105 17h13a3 3 0 000-7h-.1" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <rect x="10" y="16" width="4" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1.1" fill="none" />
    <path d="M10.8 16v-1a1.2 1.2 0 012.4 0v1" stroke="currentColor" strokeWidth="1.1" fill="none" />
  </svg>,
];

function PrivacySection() {
  const { C, isDark } = useLandingTheme();

  const iconColor = isDark ? "rgba(191,96,64,0.8)" : "rgba(168,75,42,0.75)";
  const iconBg = isDark ? "rgba(191,96,64,0.10)" : "rgba(168,75,42,0.08)";
  const iconBorder = isDark ? "rgba(191,96,64,0.2)" : "rgba(168,75,42,0.15)";

  return (
    <section
      id="privacy"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 100px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(191,96,64,0.09), transparent 65%)"
            : "radial-gradient(circle, rgba(191,96,64,0.07), transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}
      >
        <motion.div
          variants={staggerV(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: C.ember,
              marginBottom: 14,
              fontFamily: C.sans,
            }}
          >
            Privacy by design
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              letterSpacing: "0",
              color: C.cream,
              lineHeight: 1.08,
              marginBottom: 18,
            }}
          >
            On your iPhone.{" "}
            <em style={{ color: C.ember, fontStyle: "italic" }}>
              Nowhere else.
            </em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 17,
              color: C.muted,
              maxWidth: 460,
              margin: "0 auto",
              lineHeight: 1.68,
              fontFamily: C.sans,
            }}
          >
            Your voice is the most intimate thing you share. ÉCHO treats it
            accordingly.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerV(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {PRIVACY.map((p, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              style={{
                padding: "28px 24px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                backdropFilter: "blur(8px)",
                transition:
                  "border-color 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                cursor: "default",
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.28 },
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  color: iconColor,
                }}
              >
                {PRIVACY_ICONS[i]}
              </div>
              <h3
                style={{
                  fontFamily: C.serif,
                  fontSize: 17,
                  color: C.cream,
                  marginBottom: 10,
                  letterSpacing: "0",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.65,
                  fontFamily: C.sans,
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── PricingSection ─────────────────────────────────────────────
function PricingSection() {
  const { C, isDark } = useLandingTheme();

  return (
    <section
      id="pricing"
      style={{
        position: "relative",
        padding: "100px 24px",
        textAlign: "center",
      }}
    >
      <motion.div
        variants={staggerV(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{ marginBottom: 56 }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            color: C.ember,
            marginBottom: 14,
            fontFamily: C.sans,
          }}
        >
          Pricing
        </motion.p>
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            letterSpacing: "0",
            color: C.cream,
            lineHeight: 1.08,
          }}
        >
          Free for the{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            first circle.
          </em>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerV(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{
          display: "grid",
          gap: 20,
          maxWidth: 820,
          margin: "0 auto",
          alignItems: "stretch",
        }}
        className="grid-cols-1 sm:grid-cols-2"
      >
        {/* Begin — free tier */}
        <motion.div
          variants={scaleUp}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            border: `1px solid ${C.border}`,
            background: C.card,
            padding: "32px 28px",
            backdropFilter: "blur(8px)",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,228,184,0.2) 50%, transparent 100%)" }} />

          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, fontFamily: C.sans, marginBottom: 20 }}>
            Begin
          </p>

          <div style={{ marginBottom: 6 }}>
            <span style={{ fontFamily: C.serif, fontSize: "clamp(2.4rem, 5vw, 3.2rem)", color: C.cream, letterSpacing: "-0.02em" }}>€0</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, fontFamily: C.sans, marginBottom: 32 }}>
            Forever free · No card required
          </p>

          <ul style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 32 }}>
            {FREE_FEATURES.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: C.muted, fontFamily: C.sans, lineHeight: 1.4 }}>
                <span style={{ color: isDark ? "rgba(255,228,184,0.35)" : "rgba(26,15,5,0.3)", marginTop: 2, flexShrink: 0, fontSize: 11 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "11px 24px",
              borderRadius: 999,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontFamily: C.sans,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.muted,
              marginTop: "auto",
            }}
          >
            Get notified at launch
          </button>
        </motion.div>

        {/* Unfold — pro tier */}
        <motion.div
          variants={scaleUp}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            border: `1px solid ${isDark ? "rgba(191,96,64,0.4)" : "rgba(168,75,42,0.32)"}`,
            background: isDark ? "rgba(191,96,64,0.07)" : "rgba(191,96,64,0.05)",
            padding: "32px 28px",
            backdropFilter: "blur(8px)",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            boxShadow: isDark
              ? "0 0 80px rgba(191,96,64,0.12), 0 24px 60px rgba(0,0,0,0.3), inset 0 0 40px rgba(191,96,64,0.04)"
              : "0 8px 48px rgba(191,96,64,0.14), 0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(191,96,64,0.7) 50%, transparent 100%)" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, fontFamily: C.sans }}>
              Unfold
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, background: C.ember, color: "#0A1220", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, fontFamily: C.sans, flexShrink: 0 }}>
              Most popular
            </span>
          </div>

          <div style={{ marginBottom: 6 }}>
            <span style={{ fontFamily: C.serif, fontSize: "clamp(2.4rem, 5vw, 3.2rem)", color: C.ember, letterSpacing: "-0.02em" }}>€7.99</span>
            <span style={{ fontSize: 15, color: C.muted, fontFamily: C.sans, marginLeft: 6 }}>/ mo</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, fontFamily: C.sans, marginBottom: 32 }}>
            or €69 / year · 7-day free trial · Founding price for waitlist
          </p>

          <ul style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 32 }}>
            {PRO_FEATURES.map((f, i) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: i === 0 ? C.muted : C.cream, fontFamily: C.sans, lineHeight: 1.4, fontStyle: i === 0 ? "italic" : "normal", opacity: i === 0 ? 0.6 : 1 }}>
                <span style={{ color: i === 0 ? C.muted : C.ember, marginTop: 2, flexShrink: 0, fontSize: i === 0 ? 13 : 11 }}>{i === 0 ? "·" : "✦"}</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-ember"
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "13px 24px",
              borderRadius: 999,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontFamily: C.sans,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              marginTop: "auto",
            }}
          >
            Join waitlist — founding price
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── FAQSection ─────────────────────────────────────────────────
function FAQSection() {
  const { C, isDark } = useLandingTheme();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        position: "relative",
        padding: "80px 24px 100px",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          color: C.ember,
          marginBottom: 14,
          fontFamily: C.sans,
        }}
      >
        FAQ
      </motion.p>
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{
          fontFamily: C.serif,
          fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
          letterSpacing: "0",
          color: C.cream,
          lineHeight: 1.08,
          marginBottom: 52,
        }}
      >
        Questions{" "}
        <em style={{ color: C.ember, fontStyle: "italic" }}>
          answered.
        </em>
      </motion.h2>

      <motion.dl
        variants={staggerV(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {FAQ_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            style={{
              borderRadius: 18,
              border: `1px solid ${open === i ? (isDark ? "rgba(191,96,64,0.32)" : "rgba(168,75,42,0.28)") : C.border}`,
              background:
                open === i
                  ? isDark
                    ? "rgba(191,96,64,0.07)"
                    : "rgba(191,96,64,0.04)"
                  : isDark
                    ? "rgba(14,50,114,0.18)"
                    : "rgba(191,96,64,0.03)",
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
          >
            <dt>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "20px 22px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: C.serif,
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    color: C.cream,
                    lineHeight: 1.4,
                  }}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  style={{
                    marginTop: 2,
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: `1px solid ${open === i ? "rgba(191,96,64,0.55)" : C.border}`,
                    background:
                      open === i
                        ? "rgba(191,96,64,0.18)"
                        : "rgba(191,96,64,0.05)",
                    color: open === i ? C.ember : C.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontFamily: C.sans,
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease, background 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  +
                </span>
              </button>
            </dt>
            <div
              className="faq-body"
              data-open={open === i ? "true" : "false"}
            >
              <div>
                <p
                  style={{
                    padding: "0 22px 20px",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: C.muted,
                    fontFamily: C.sans,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}

// ── WaitlistSection ────────────────────────────────────────────
function WaitlistSection() {
  const { C, isDark } = useLandingTheme();

  return (
    <section
      id="waitlist"
      style={{
        position: "relative",
        padding: "100px 24px 120px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Ambient ember glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(191,96,64,0.12), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "glowPulse 5s ease-in-out infinite",
        }}
      />

      <motion.div
        variants={staggerV(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        style={{ position: "relative" }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            color: C.ember,
            marginBottom: 20,
            fontFamily: C.sans,
          }}
        >
          — Join the waitlist
        </motion.p>

        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            letterSpacing: "0",
            color: C.cream,
            lineHeight: 1.08,
            marginBottom: 20,
          }}
        >
          The first voice you should trust{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            is yours.
          </em>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 17,
            color: C.muted,
            maxWidth: 440,
            margin: "0 auto 44px",
            lineHeight: 1.68,
            fontFamily: C.sans,
          }}
        >
          Join the waitlist. Founding-member pricing at launch.
        </motion.p>

        <motion.div
          variants={scaleUp}
          style={{ maxWidth: 480, margin: "0 auto 32px" }}
        >
          <WaitlistForm variant="footer" />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {["On-device only", "Encrypted", "Zero data sharing"].map((b) => (
            <span
              key={b}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 999,
                border: `1px solid ${isDark ? "rgba(191,96,64,0.18)" : "rgba(168,75,42,0.16)"}`,
                background: isDark
                  ? "rgba(191,96,64,0.05)"
                  : "rgba(168,75,42,0.04)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: C.muted,
                fontFamily: C.sans,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.ember,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              />
              {b}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  const { C, isDark } = useLandingTheme();

  return (
    <footer
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: "40px 24px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
        >
          <img
            src="/logo-name.svg"
            alt="ÉCHO"
            style={{ height: 20, width: "auto", opacity: isDark ? 0.88 : 0.75 }}
          />
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: isDark
                ? "rgba(255,246,233,0.3)"
                : "rgba(26,15,5,0.35)",
              fontFamily: C.sans,
              paddingBottom: 2,
            }}
          >
            by Réaclyse
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px 22px",
          }}
        >
          {[
            { label: "Privacy", to: "/privacy" as const },
            { label: "GDPR", to: "/gdpr" as const },
            { label: "Support", to: "/support" as const },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: C.muted,
                textDecoration: "none",
                fontFamily: C.sans,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  C.ember)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  C.muted)
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <p
          style={{
            fontSize: 11,
            color: isDark
              ? "rgba(255,246,233,0.22)"
              : "rgba(26,15,5,0.28)",
            fontFamily: C.sans,
          }}
        >
          © 2026 Réaclyse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Landing (root) ─────────────────────────────────────────────
function Landing() {
  const { resolvedTheme } = useGlobalTheme();
  const isDark = resolvedTheme === "dark";
  const C = isDark ? C_DARK : C_LIGHT;

  return (
    <ThemeCtx.Provider value={{ C, isDark }}>
      <div
        style={{
          background: C.bg,
          color: C.cream,
          transition: "background 0.4s ease, color 0.4s ease",
          minHeight: "100vh",
          overflowX: "clip",
        }}
      >
        <title>ÉCHO — Private Voice Journal for iPhone | Réaclyse</title>
        <meta
          name="description"
          content="ÉCHO is a private voice journal for iPhone. One question a day, your voice recorded and encrypted on-device. Weeks later, ÉCHO surfaces what you said before the doubt set in. Launching on iOS in Europe 2026."
        />
        <link rel="canonical" href="https://echobyreaclyse.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />

        {/* Ambient background orbs */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            className="ambient-orb-a"
            style={{ opacity: isDark ? 1 : 0.5 }}
          />
          <div
            className="ambient-orb-b"
            style={{ opacity: isDark ? 1 : 0.4 }}
          />
          <div
            className="ambient-orb-c"
            style={{ opacity: isDark ? 1 : 0.35 }}
          />
        </div>

        <Toaster richColors position="top-center" />
        <Nav />
        <HeroSection />
        <MarqueeStrip />
        <ManifestoSection />
        <div id="story">
          <StorySection />
        </div>
        <MarqueeStrip reversed />
        <PrivacySection />
        <PricingSection />
        <FAQSection />
        <WaitlistSection />
        <Footer />
      </div>
    </ThemeCtx.Provider>
  );
}
