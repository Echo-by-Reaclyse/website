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
import { Pointer, Smartphone, ShieldCheck, EyeOff, Cloud } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme as useGlobalTheme } from "@/components/ThemeProvider";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistForm } from "@/components/WaitlistForm";

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

type TabId = "home" | "archive" | "mirror" | "letters" | "profile";

const TAB_INFO: Record<TabId, { eyebrow: string; headline: string; body: string; detail: string }> = {
  home: {
    eyebrow: "01 — The Question",
    headline: "Every day,\none question.",
    body: "No blank page. No pressure to perform. One question, crafted for honest reflection. Tap. Speak. Done.",
    detail: "Rotates from 200+ questions written for self-reflection.",
  },
  archive: {
    eyebrow: "04 — The Archive",
    headline: "Every word\nyou've ever said.",
    body: "Search, browse, revisit. Your complete history of reflections — private, encrypted, yours.",
    detail: "Up to 30 days free. Unlimited history with subscription.",
  },
  mirror: {
    eyebrow: "05 — Patterns Emerge",
    headline: "See yourself\nclearly.",
    body: "Over weeks, ÉCHO builds a picture of your emotional patterns, recurring themes, and growth arc.",
    detail: "8-point persona profile updated with every entry.",
  },
  letters: {
    eyebrow: "06 — Time Capsule",
    headline: "Six months later,\nsame question.",
    body: "ÉCHO seals your words and returns them when enough time has passed. Compare who you were to who you are now.",
    detail: "Letters unlock automatically. No gamification. Just truth.",
  },
  profile: {
    eyebrow: "07 — Privacy First",
    headline: "Private\nby design.",
    body: "On-device transcription. Encrypted at rest. No tracking. No advertising identifiers. Ever.",
    detail: "GDPR compliant. iCloud sync optional. Your data is yours.",
  },
};

const TAB_RIGHT_BULLETS: Record<TabId, string[]> = {
  home:    ["200+ reflection questions", "Works completely offline", "No typing required"],
  archive: ["Encrypted at rest", "Calendar + feed view", "Full-text search"],
  mirror:  ["8-point persona profile", "Emotional arc over time", "Thought connections map"],
  letters: ["Auto-unlock by chosen date", "Side-by-side comparison", "No gamification"],
  profile: ["iCloud sync optional", "No ad identifiers", "GDPR compliant"],
};

const TAB_AMBIENT: Record<TabId, { dark: string; light: string }> = {
  home:    { dark: "rgba(191,96,64,0.10)",  light: "rgba(191,96,64,0.07)" },
  archive: { dark: "rgba(191,96,64,0.10)",  light: "rgba(191,96,64,0.07)" },
  mirror:  { dark: "rgba(191,96,64,0.10)",  light: "rgba(191,96,64,0.06)" },
  letters: { dark: "rgba(191,96,64,0.10)",  light: "rgba(191,96,64,0.06)" },
  profile: { dark: "rgba(191,96,64,0.10)",  light: "rgba(191,96,64,0.06)" },
};

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
    title: "Your voice stays private",
    body: "Audio is processed on your device and never uploaded. Your journal entries exist only where you choose to keep them.",
  },
  {
    title: "Your entries belong to you",
    body: "Delete your reflections whenever you want. No lock-in, no data held hostage. Your words, your rules.",
  },
  {
    title: "European by design",
    body: "Built in Luxembourg and designed around GDPR from day one. Privacy is architecture here, not a setting.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is ÉCHO?",
    a: "ÉCHO is a private voice journal for iPhone. Every day, one thoughtful question appears. You speak your answer — no typing, no blank page. Over time, ÉCHO surfaces what you said weeks or months ago so you can hear how your thinking has shifted.",
  },
  {
    q: "When does ÉCHO launch?",
    a: "ÉCHO launches on the iOS App Store in 2026, starting with European markets: France, Germany, Spain, Italy, Luxembourg, Belgium, the Netherlands, Austria, and Switzerland. Join the waitlist to be first in line and unlock early-access pricing.",
  },
  {
    q: "Is my voice data private?",
    a: "Completely. Your voice is converted to text directly on your iPhone — nothing is ever sent to a server. Your entries are encrypted before they're stored, so nobody can read them, including us. We never sell your data or use it to train AI.",
  },
  {
    q: "How much does ÉCHO cost?",
    a: "ÉCHO is free to download and use every day. A subscription unlocks your full journal history, deeper personal insights, and unlimited time capsules. Founding members pay €3.99/month or €34.99/year (regular price: €7.99/month or €69.99/year). Founding member pricing remains active for as long as your subscription stays active.",
  },
  {
    q: "Do I need to write anything?",
    a: "Not a word. ÉCHO is built for voice. You tap, speak your answer, and you're done — usually in under a minute. The app handles everything else: transcription, storage, and surfacing your past reflections at the right moment.",
  },
  {
    q: "Is ÉCHO available on Android?",
    a: "ÉCHO is iPhone-only at launch. Android support may follow in a later phase — join the waitlist and we'll let you know as soon as your platform is supported.",
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
  "Everything in ÉCHO",
  "Founding member pricing while your subscription remains active",
  "Priority access at launch",
  "Opportunity to help shape future features",
  "Unlimited journal history",
  "Full persona profile & pattern analysis",
  "Unlimited time capsule letters",
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
            background: "#F0EBE3",
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
              background: "rgba(0,0,0,0.28)",
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

// ── Phone Tab Screens ─────────────────────────────────────────
type HomeState = "idle" | "recording" | "processing" | "result";
type PanelPhase = "visible" | "exiting" | "entering";

const TAB_DEFS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" fill="white" />
      </svg>
    ),
  },
  {
    id: "archive",
    label: "The Archive",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <rect x="2" y="4" width="20" height="3" rx="1" fill="currentColor" stroke="none" />
        <rect x="2" y="10" width="20" height="3" rx="1" fill="currentColor" stroke="none" />
        <rect x="2" y="16" width="20" height="3" rx="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "mirror",
    label: "The Mirror",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "letters",
    label: "Letters",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <polyline points="2,7 12,14 22,7" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
      </svg>
    ),
  },
];

function PhoneTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        borderTop: "0.5px solid rgba(0,0,0,0.08)",
        background: "rgba(247,242,235,0.97)",
        backdropFilter: "blur(10px)",
        flexShrink: 0,
        padding: "4px 10px 2px",
      }}
    >
      {TAB_DEFS.map(({ id, label, icon }) => {
        const active = id === activeTab;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "5px 2px 4px",
              border: "none",
              background: active ? "rgba(191,96,64,0.12)" : "none",
              borderRadius: active ? 12 : 0,
              cursor: "pointer",
              color: active ? "#BF6040" : "#1A1A1A",
              transition: "color 0.2s ease, background 0.2s ease",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              margin: "0 1px 3px",
            }}
          >
            <div>{icon}</div>
            <span
              style={{
                fontSize: 8,
                fontFamily: "Urbanist, sans-serif",
                fontWeight: active ? 600 : 400,
                letterSpacing: "0.01em",
                lineHeight: 1,
                transition: "font-weight 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function HomeTabScreen({
  homeState,
  setHomeState,
  recordingSeconds,
}: {
  homeState: HomeState;
  setHomeState: (s: HomeState) => void;
  recordingSeconds: number;
}) {
  const [savedMoods, setSavedMoods] = useState<Set<string>>(new Set());
  const [justSaved, setJustSaved] = useState(false);
  const WAVEFORM_BARS = 24;
  const question = "What thought keeps coming back to you?";

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSave = () => {
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setSavedMoods(new Set());
      setHomeState("idle");
    }, 1200);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F0EBE3",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "54px 14px 12px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none" }}>

        {homeState === "idle" && (
          <>
            {/* Greeting */}
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", marginTop: 2 }}>Good morning, Reflector.</p>

            {/* Question card */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Today's Question</p>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 9, color: "#BF6040" }}>⚡</span>
                  <span style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>Fear</span>
                </div>
              </div>
              <p style={{ fontSize: 15, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", lineHeight: 1.3, fontStyle: "italic", marginBottom: 10 }}>
                {question}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "#1A1A1A" }}>⚡</span>
                <span style={{ fontSize: 10, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>Fear</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: "#BF6040" }}>↺</span>
                <span style={{ fontSize: 10, color: "#BF6040", fontFamily: "Urbanist, sans-serif" }}>Get another question</span>
              </div>
            </div>

            {/* Record button */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 4 }}>
              <div style={{ position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(191,96,64,0.12)" }} />
                <button
                  onClick={() => setHomeState("recording")}
                  style={{ width: 62, height: 62, borderRadius: "50%", background: "#BF6040", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(191,96,64,0.35)", WebkitTapHighlightColor: "transparent", position: "relative", zIndex: 1 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ width: 24, height: 24 }}>
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>Begin</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(191,96,64,0.10)", borderRadius: 20, padding: "4px 10px" }}>
                <span style={{ fontSize: 11 }}>🔥</span>
                <span style={{ fontSize: 11, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>0 day record</span>
              </div>
              <p style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif", textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.25)" }}>Can't speak right now? Write instead.</p>
              <div style={{ border: "1px solid rgba(0,0,0,0.15)", borderRadius: 20, padding: "7px 18px" }}>
                <p style={{ fontSize: 12, color: "#BF6040", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>Or just speak freely.</p>
              </div>
            </div>

            {/* The Mirror preview card */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>The Mirror</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "You return to the theme of control in 6 of your last 10 entries.",
                  "Your tone shifts noticeably when you speak about Sunday evenings.",
                  "You mention your family in nearly every reflection this month.",
                ].map((line, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ fontSize: 6, color: "#BF6040", marginTop: 4, flexShrink: 0 }}>●</span>
                    <span style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", lineHeight: 1.4 }}>{line}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid rgba(0,0,0,0.07)", paddingTop: 10 }}>
                <span style={{ fontSize: 12, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 500 }}>Look closer</span>
                <span style={{ fontSize: 14, color: "#BF6040" }}>→</span>
              </div>
            </div>
          </>
        )}

        {homeState === "recording" && (
          <>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", marginTop: 2 }}>Good morning, Reflector.</p>

            {/* Question card — stays visible during recording */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Today's Question</p>
              </div>
              <p style={{ fontSize: 14, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", lineHeight: 1.3, fontStyle: "italic", marginBottom: 8 }}>
                {question}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10 }}>⚡</span>
                <span style={{ fontSize: 10, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>Fear</span>
              </div>
            </div>

            {/* Waveform card with recording indicator */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "12px 14px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {/* Recording row */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#BF6040", animation: "recDot 1s ease-in-out infinite", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#555", fontFamily: "Urbanist, sans-serif" }}>Recording...</span>
                <span style={{ marginLeft: "auto", fontSize: 13, color: "#1A1A1A", fontFamily: "monospace", letterSpacing: "0.05em" }}>{formatTime(recordingSeconds)}</span>
              </div>
              {/* Waveform bars — hardcoded speech envelope, VU-meter animation */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 64, gap: 1 }}>
                {(() => {
                  // Realistic speech amplitude: 3 phrases separated by pauses
                  // Each value = peak height (0–1) for that bar column
                  const AMP = [
                    // Phrase 1 — short word
                    0.12, 0.38, 0.72, 0.90, 0.82, 0.52, 0.24,
                    // Pause
                    0.05, 0.06,
                    // Phrase 2 — longer phrase, two syllable peaks
                    0.18, 0.52, 0.88, 0.98, 0.90, 0.82, 0.96, 0.88, 0.68, 0.45, 0.25, 0.11,
                    // Pause
                    0.05, 0.06, 0.05,
                    // Phrase 3 — medium phrase, trailing off
                    0.14, 0.44, 0.78, 0.95, 0.90, 0.75, 0.88, 0.94, 0.78, 0.52, 0.28, 0.12,
                    // Trailing silence
                    0.06, 0.05,
                  ]; // 7+2+12+3+12+2 = 38
                  return AMP.map((amp, i) => {
                    const isSpeech = amp > 0.12;
                    const maxH = amp;
                    const minH = isSpeech ? Math.max(0.03, amp * 0.05) : amp * 0.80;
                    // Each speech bar has an independent pseudo-random phase offset
                    const phaseDelay = isSpeech
                      ? (Math.abs(Math.sin(i * 13.7 + 2.4)) * 0.65).toFixed(2)
                      : (Math.abs(Math.sin(i * 4.1)) * 0.5).toFixed(2);
                    const dur = isSpeech
                      ? (0.52 + (i % 6) * 0.055).toFixed(2)   // 0.52–0.80 s
                      : (4.5 + (i % 3) * 0.4).toFixed(2);      // 4.5–5.3 s
                    const anim = isSpeech ? "barMeter" : "barDance";
                    const timing = isSpeech ? "cubic-bezier(0.25,0,0.15,1)" : "ease-in-out";
                    return (
                      <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div
                          style={{
                            width: "100%",
                            height: `${Math.max(3, Math.round(maxH * 64))}px`,
                            background: isSpeech ? "#BF6040" : "rgba(191,96,64,0.38)",
                            borderRadius: 3,
                            transformOrigin: "bottom",
                            ["--bar-max" as string]: maxH.toFixed(3),
                            ["--bar-min" as string]: minH.toFixed(3),
                            animation: `${anim} ${dur}s ${phaseDelay}s ${timing} infinite`,
                          }}
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Stop button */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 2 }}>
              <div style={{ position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(191,96,64,0.10)" }} />
                <button
                  onClick={() => setHomeState("processing")}
                  style={{ width: 62, height: 62, borderRadius: "50%", background: "#BF6040", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(191,96,64,0.35)", WebkitTapHighlightColor: "transparent", position: "relative", zIndex: 1 }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: "white" }} />
                </button>
              </div>
              <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>Tap to stop</p>
            </div>
          </>
        )}

        {homeState === "processing" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingTop: 40 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#BF6040",
                    animation: `dotBounce 1.1s ${(i * 0.18).toFixed(2)}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", textAlign: "center" }}>
              Reading between<br />the lines…
            </p>
          </div>
        )}

        {homeState === "result" && (
          <>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", marginTop: 2 }}>Good morning, Reflector.</p>
            {/* Transcribed entry */}
            <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Today's entry</p>
              <p style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", lineHeight: 1.55 }}>
                "Everyone's life seems to be turning into something while mine still feels like a draft. I keep waiting for the version of me who has it figured out to show up."
              </p>
            </div>
            {/* 3 weeks later surfaced memory */}
            <div style={{ background: "rgba(191,96,64,0.07)", borderRadius: 14, padding: "12px 14px", border: "1px solid rgba(191,96,64,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>3 weeks ago</span>
              </div>
              <p style={{ fontSize: 12, color: "#BF6040", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", lineHeight: 1.55 }}>
                "What if she's already here?"
              </p>
            </div>
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: justSaved ? "rgba(52,199,89,0.15)" : "#BF6040",
                border: justSaved ? "1px solid rgba(52,199,89,0.4)" : "none",
                color: justSaved ? "#34C759" : "white",
                fontSize: 13,
                fontFamily: "Urbanist, sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.3s ease",
              }}
            >
              {justSaved ? "✓ Saved" : "Save entry"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ArchiveTabScreen() {
  const [calView, setCalView] = useState<"calendar" | "feed">("calendar");

  // May 2026 calendar data
  // May 1 = Friday (day index 5 in Sun-start week)
  const MAY_START_DOW = 5; // 0=Sun, 5=Fri
  const MAY_DAYS = 31;
  const RECORDED_DAYS = new Set([28]);
  const TAPABLE_DAYS = new Set([24, 25, 26, 27, 29]);
  const TODAY = 30;

  const cells: (number | null)[] = [
    ...Array(MAY_START_DOW).fill(null),
    ...Array.from({ length: MAY_DAYS }, (_, i) => i + 1),
  ];
  // pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0EBE3", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "44px 14px 12px", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Title */}
        <div style={{ marginTop: 2 }}>
          <p style={{ fontSize: 22, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, marginBottom: 2 }}>The Archive</p>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>Everything you've said.</p>
        </div>

        {/* Calendar/Feed toggle */}
        <div style={{ background: "rgba(0,0,0,0.07)", borderRadius: 20, padding: 3, display: "flex" }}>
          {(["calendar", "feed"] as const).map(v => (
            <button
              key={v}
              onClick={() => setCalView(v)}
              style={{
                flex: 1,
                padding: "6px 0",
                border: "none",
                borderRadius: 17,
                background: calView === v ? "#FFFFFF" : "transparent",
                color: calView === v ? "#1A1A1A" : "rgba(0,0,0,0.45)",
                fontSize: 12,
                fontFamily: "Urbanist, sans-serif",
                fontWeight: calView === v ? 600 : 400,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                boxShadow: calView === v ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.18s ease",
                textTransform: "capitalize",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Feed view */}
        {calView === "feed" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {JOURNAL_ENTRIES.map((entry, i) => {
              const TAGS = [["Reflective", "Curious"], ["Present", "Honest"], ["Unsettled", "Brave"], ["Thoughtful", "Curious"], ["Peaceful"]];
              const tags = TAGS[i % TAGS.length];
              return (
                <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>{entry.date}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" style={{ width: 11, height: 11 }}>
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif" }}>{entry.duration}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(0,0,0,0.6)", fontFamily: "Urbanist, sans-serif", lineHeight: 1.55, marginBottom: 10, display: "-webkit-box" as "block", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as "vertical", overflow: "hidden" }}>
                    {entry.preview}
                  </p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(191,96,64,0.10)", color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Calendar card */}
        {calView === "calendar" && <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#BF6040", fontSize: 16, padding: "0 4px", WebkitTapHighlightColor: "transparent" }}>‹</button>
            <p style={{ fontSize: 14, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>May 2026</p>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#BF6040", fontSize: 16, padding: "0 4px", WebkitTapHighlightColor: "transparent" }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 10, color: "rgba(0,0,0,0.35)", fontFamily: "Urbanist, sans-serif", fontWeight: 500, padding: "2px 0" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px 0" }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const recorded = RECORDED_DAYS.has(day);
              const tapable = TAPABLE_DAYS.has(day);
              const isToday = day === TODAY;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 28,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      background: recorded ? "#BF6040" : "transparent",
                      border: tapable
                        ? "1.5px dashed rgba(191,96,64,0.55)"
                        : isToday
                        ? "1.5px solid #BF6040"
                        : "none",
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      fontFamily: "Urbanist, sans-serif",
                      fontWeight: isToday || recorded ? 600 : 400,
                      color: recorded ? "#FFFFFF" : isToday ? "#BF6040" : "#1A1A1A",
                    }}>{day}</span>
                    {tapable && (
                      <span style={{ position: "absolute", fontSize: 8, color: "rgba(191,96,64,0.55)", bottom: -1, right: -1, lineHeight: 1 }}>+</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#BF6040" }} />
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>Recorded</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px dashed rgba(191,96,64,0.55)" }} />
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>Tap to fill</span>
            </div>
          </div>
        </div>}

        {/* Streak stats — calendar view only */}
        {calView === "calendar" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🔥", value: "0", label: "Current streak" },
              { icon: "🏆", value: "1", label: "Longest streak" },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{ background: "#FFFFFF", borderRadius: 14, padding: "14px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 22, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 700, lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", textAlign: "center" }}>{label}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function MirrorTabScreen({ mirrorKey }: { mirrorKey: number }) {
  const WAVEFORM_BARS = 46;
  const WORDS = [
    { word: "Control", count: 8, max: 8 },
    { word: "Family", count: 6, max: 8 },
    { word: "Growth", count: 5, max: 8 },
    { word: "Present", count: 4, max: 8 },
    { word: "Clarity", count: 3, max: 8 },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0EBE3", overflow: "hidden" }}>
      {/* Mirror waveform — multi-harmonic shape, slow traveling wave */}
      <div style={{ flexShrink: 0, padding: "52px 8px 10px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 108, background: "#F0EBE3" }}>
        {Array.from({ length: WAVEFORM_BARS }, (_, i) => {
          const pos = i / (WAVEFORM_BARS - 1);
          // Multi-harmonic envelope → looks like real recorded audio, not a plain sine
          const h =
            0.44 +
            0.28 * Math.sin(pos * Math.PI * 2.0) +
            0.16 * Math.sin(pos * Math.PI * 5.2 + 0.9) +
            0.09 * Math.sin(pos * Math.PI * 9.1 + 1.7) +
            0.05 * Math.cos(pos * Math.PI * 13.4 + 2.3);
          const maxH = Math.max(0.18, Math.min(0.95, h));
          // Floor stays visible — wave never collapses to nothing
          const minH = 0.12 + maxH * 0.08;
          // All bars identical period → seamless traveling wave
          const T = 3.2;
          const delay = (pos * T).toFixed(3);
          return (
            <div
              key={`${mirrorKey}-${i}`}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                paddingLeft: i > 0 ? 1 : 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.round(maxH * 46)}px`,
                  background: "#BF6040",
                  borderRadius: 2,
                  transformOrigin: "bottom",
                  ["--bar-max" as string]: maxH.toFixed(3),
                  ["--bar-min" as string]: minH.toFixed(3),
                  animation: `barDance ${T}s ${delay}s ease-in-out infinite`,
                  animationFillMode: "backwards",
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 12px", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { value: "3", label: "Total entries" },
            { value: "Thursday", label: "Most active day" },
          ].map(({ value, label }) => (
            <div key={label} style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 18, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 700, lineHeight: 1.2 }}>{value}</span>
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Most used words */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Your Most Used Words</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {WORDS.map(({ word, count, max }) => (
              <div key={word}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 500 }}>{word}</span>
                    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontFamily: "Urbanist, sans-serif" }}>—</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>{count}</span>
                </div>
                <div style={{ height: 5, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(count / max) * 100}%`, background: "#BF6040", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional landscape */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Emotional Landscape</p>
            <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontFamily: "Urbanist, sans-serif" }}>This week</span>
          </div>
          {[
            { label: "Reflection", value: 0.82, color: "#BF6040" },
            { label: "Clarity", value: 0.65, color: "#8FA8D4" },
            { label: "Growth", value: 0.71, color: "#BF6040" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>{label}</span>
                <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontFamily: "Urbanist, sans-serif" }}>{Math.round(value * 100)}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${value * 100}%`, background: color, borderRadius: 2, opacity: 0.8 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Thought connections */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36, flexShrink: 0 }}>
            <circle cx="20" cy="20" r="4" fill="#BF6040" opacity="0.9" />
            <circle cx="8" cy="12" r="3" fill="#BF6040" opacity="0.5" />
            <circle cx="32" cy="10" r="3" fill="#BF6040" opacity="0.5" />
            <circle cx="10" cy="30" r="3" fill="#BF6040" opacity="0.5" />
            <circle cx="30" cy="30" r="2.5" fill="#BF6040" opacity="0.4" />
            <line x1="20" y1="20" x2="8" y2="12" stroke="#BF6040" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="20" x2="32" y2="10" stroke="#BF6040" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="20" x2="10" y2="30" stroke="#BF6040" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="20" x2="30" y2="30" stroke="#BF6040" strokeWidth="1" opacity="0.3" />
            <line x1="8" y1="12" x2="10" y2="30" stroke="#BF6040" strokeWidth="0.8" opacity="0.25" />
          </svg>
          <div>
            <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Thought Connections</p>
            <p style={{ fontSize: 16, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 700, lineHeight: 1 }}>3 <span style={{ fontSize: 12, fontWeight: 400, color: "#1A1A1A" }}>connections</span></p>
            <p style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", lineHeight: 1.4, marginTop: 4 }}>Your memories are linked across themes, moods, and people.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function LettersTabScreen() {
  const PROMPTS = [
    "Where do I see myself in a year?",
    "What's weighing on me right now?",
    "What would I tell my past self?",
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0EBE3", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "44px 16px 12px", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Title */}
        <div style={{ marginTop: 2 }}>
          <p style={{ fontSize: 22, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, marginBottom: 2 }}>Letters</p>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif" }}>Messages to your future self</p>
        </div>

        {/* Envelope illustration */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 8, paddingBottom: 4 }}>
          <div style={{ position: "relative", width: 110, height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Outer circle */}
            <div style={{ position: "absolute", width: 110, height: 110, borderRadius: "50%", background: "rgba(191,96,64,0.08)" }} />
            {/* Middle circle */}
            <div style={{ position: "absolute", width: 82, height: 82, borderRadius: "50%", background: "rgba(191,96,64,0.10)" }} />
            {/* Envelope */}
            <div style={{ position: "relative", width: 54, height: 40, zIndex: 1 }}>
              <svg viewBox="0 0 54 40" fill="none" style={{ width: 54, height: 40 }}>
                <rect x="1" y="1" width="52" height="38" rx="4" fill="white" stroke="rgba(191,96,64,0.2)" strokeWidth="1" />
                <polyline points="1,5 27,22 53,5" stroke="rgba(191,96,64,0.25)" strokeWidth="1.2" fill="none" />
                <line x1="1" y1="39" x2="20" y2="22" stroke="rgba(191,96,64,0.15)" strokeWidth="1" />
                <line x1="53" y1="39" x2="34" y2="22" stroke="rgba(191,96,64,0.15)" strokeWidth="1" />
              </svg>
              {/* Seal */}
              <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#BF6040", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 9, color: "white", fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}>R</span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state text */}
        <div style={{ textAlign: "center", paddingTop: 4 }}>
          <p style={{ fontSize: 18, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, marginBottom: 6 }}>No letters yet.</p>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", fontFamily: "Urbanist, sans-serif", lineHeight: 1.5, maxWidth: 220, margin: "0 auto" }}>The words you say today become wisdom tomorrow.</p>
        </div>

        {/* Prompts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <p style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontFamily: "Urbanist, sans-serif", textAlign: "center" }}>start with a question</p>
          {PROMPTS.map(prompt => (
            <div
              key={prompt}
              style={{ background: "#FFFFFF", borderRadius: 20, padding: "10px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", textAlign: "center", cursor: "pointer" }}
            >
              <p style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>{prompt}</p>
            </div>
          ))}
        </div>

      </div>

      {/* CTA button pinned at bottom */}
      <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
        <button style={{ width: "100%", padding: "13px", borderRadius: 14, background: "#BF6040", border: "none", color: "white", fontSize: 14, fontFamily: "Urbanist, sans-serif", fontWeight: 600, cursor: "pointer", WebkitTapHighlightColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
          </svg>
          Write your first letter
        </button>
      </div>
    </div>
  );
}

function ProfileTabScreen() {
  const PREF_ROWS = [
    { icon: "🔔", label: "Notifications", sub: "Manage your alerts" },
    { icon: "⏰", label: "Reminder time", sub: "09:00" },
    { icon: "✉️", label: "Letter arrival time", sub: "" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0EBE3", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "60px 14px 12px", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* User card */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/user-avatar.jpeg"
            alt="Avatar"
            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 600, marginBottom: 1 }}>Jordan L.</p>
            <p style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "Urbanist, sans-serif", marginBottom: 2 }}>jordan.l@icloud.com</p>
            <span style={{ fontSize: 10, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>PRO Member</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>

        {/* Your reflection journey */}
        <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>Your Reflection Journey</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "🔥", value: "0 days", label: "record" },
            { icon: "💬", value: "3", label: "entries" },
            { icon: "✉️", value: "0", label: "letters" },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{ background: "#FFFFFF", borderRadius: 12, padding: "10px 6px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{value}</span>
              <span style={{ fontSize: 9, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ÉCHO PRO subscription card */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <img src="/logo.svg" alt="ÉCHO" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>ÉCHO PRO</p>
              <p style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>Active subscription</p>
              <p style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif" }}>Renews May 30, 2026</p>
            </div>
            <div style={{ background: "rgba(52,199,89,0.12)", borderRadius: 20, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34C759" }} />
              <span style={{ fontSize: 9, color: "#1E9940", fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>Active</span>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>💳</span>
              <span style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>Manage Subscription</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" style={{ width: 14, height: 14 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif", textAlign: "center" }}>↺ Restore Purchases</p>

        {/* iCloud Sync */}
        <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>iCloud Sync</p>
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>Sync to iCloud</span>
          {/* Toggle on */}
          <div style={{ width: 38, height: 22, borderRadius: 11, background: "#BF6040", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", right: 2, top: 2, width: 18, height: 18, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

        {/* Preferences */}
        <p style={{ fontSize: 9, color: "#BF6040", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Preferences</p>
        <div style={{ background: "#FFFFFF", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {PREF_ROWS.map(({ icon, label, sub }, i) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < PREF_ROWS.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: "#1A1A1A", fontFamily: "Urbanist, sans-serif" }}>{label}</p>
                {sub && <p style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontFamily: "Urbanist, sans-serif" }}>{sub}</p>}
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" style={{ width: 14, height: 14 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function GhostHintCursor({ hasInteracted, phoneRef }: { hasInteracted: boolean; phoneRef: React.RefObject<HTMLDivElement | null> }) {
  const [state, setState] = useState<"waiting" | "moving" | "tapping" | "gone">("waiting");

  useEffect(() => {
    if (hasInteracted) { setState("gone"); return; }
    const t1 = setTimeout(() => setState("moving"), 2000);
    const t2 = setTimeout(() => setState("tapping"), 2600);
    const t3 = setTimeout(() => setState("gone"), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [hasInteracted]);

  if (state === "gone" || state === "waiting") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: 72,
        left: "50%",
        transform: `translateX(-50%) scale(${state === "tapping" ? 0.85 : 1})`,
        zIndex: 30,
        pointerEvents: "none",
        transition: "transform 0.15s ease, opacity 0.3s ease",
        opacity: state === "moving" ? 1 : 0.7,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {state === "tapping" && (
        <div style={{ position: "absolute", width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(191,96,64,0.5)", animation: "tapRipple 0.5s ease-out forwards" }} />
      )}
      <svg viewBox="0 0 32 40" fill="none" style={{ width: 28, height: 35, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}>
        <path d="M8 2C8 1.4 8.4 1 9 1h14c.6 0 1 .4 1 1v20l-3 3-4-2-4 2-3-2-2 1V2z" fill="white" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <path d="M16 6v10M12 10l4 6 4-6" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9 22l3-2 4 2 4-2 3 2v6c0 3-2 7-7 8-5-1-7-5-7-8v-6z" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      </svg>
      <span style={{ fontSize: 10, color: "rgba(255,246,233,0.7)", fontFamily: "Urbanist, sans-serif", background: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap", backdropFilter: "blur(4px)" }}>
        Tap to explore
      </span>
    </div>
  );
}

// ── Panel stagger helper ───────────────────────────────────────
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

// ── MarqueeStrip ───────────────────────────────────────────────
function MarqueeStrip({ reversed }: { reversed?: boolean }) {
  const { C, isDark } = useLandingTheme();
  const BASE = [
    "ONE QUESTION", "YOUR VOICE", "ON-DEVICE",
    "ENCRYPTED", "PRIVATE", "OFFLINE-FIRST", "YOUR WORDS",
  ];
  // Reversed strip shows items in opposite order so both strips look like they're flowing together
  const ITEMS = reversed ? [...BASE].reverse() : BASE;

  const firstSetRef = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(0);
  const [smooth, setSmooth] = useState(false);

  const getItemW = useCallback(() => {
    const el = firstSetRef.current;
    return el ? el.offsetWidth / ITEMS.length : 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSetW = useCallback(() => firstSetRef.current?.offsetWidth ?? 0, []);

  // Step one item forward every tick
  useEffect(() => {
    const id = setInterval(() => {
      const itemW = getItemW();
      if (itemW === 0) return;
      setSmooth(true);
      setPx(p => p + itemW);
    }, 2500);
    return () => clearInterval(id);
  }, [getItemW]);

  // After each transition completes, silently reset position using modulo
  // (3 copies of items means the visual is identical at px and px % setW)
  useEffect(() => {
    const t = setTimeout(() => {
      setSmooth(false);
      const setW = getSetW();
      if (setW > 0) setPx(p => p % setW);
    }, 540);
    return () => clearTimeout(t);
  }, [px, getSetW]);

  const textColor = isDark ? "rgba(255,228,184,0.48)" : "rgba(26,15,5,0.42)";

  const itemStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 20,
    padding: "0 20px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    fontFamily: C.sans,
    color: textColor,
    whiteSpace: "nowrap",
    flexShrink: 0,
    userSelect: "none",
  };

  const dot = <span style={{ opacity: 0.25, fontSize: 9 }}>·</span>;

  const renderSet = (prefix: string) =>
    ITEMS.map((item, i) => (
      <span key={`${prefix}-${i}`} style={itemStyle}>
        {item}{dot}
      </span>
    ));

  return (
    <div
      style={{
        borderTop:    `1px solid ${isDark ? "rgba(255,228,184,0.07)" : "rgba(26,15,5,0.08)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(255,228,184,0.07)" : "rgba(26,15,5,0.08)"}`,
        padding: "16px 0",
        overflow: "hidden",
        // Fade the edges so items dissolve in/out rather than hard-clip
        maskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(-${px}px)`,
          transition: smooth ? "transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          willChange: "transform",
        }}
      >
        {/* Three copies so the loop never shows a gap */}
        <div ref={firstSetRef} style={{ display: "flex", flexShrink: 0 }}>{renderSet("a")}</div>
        <div style={{ display: "flex", flexShrink: 0 }}>{renderSet("b")}</div>
        <div style={{ display: "flex", flexShrink: 0 }}>{renderSet("c")}</div>
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

function Card3Content() {
  const TRAITS = [
    { label: "Emotional range", pct: 82, color: "#BF6040" },
    { label: "Growth trajectory", pct: 71, color: "#BF6040" },
    { label: "Avoidance patterns", pct: 45, color: "#6B8FC7" },
  ];
  return (
    <div style={{ padding: "20px 22px", borderRadius: 24, background: "linear-gradient(165deg, rgba(16,26,52,0.97) 0%, rgba(6,10,18,0.99) 100%)", border: "1px solid rgba(107,143,199,0.14)", boxShadow: "0 44px 80px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,246,233,0.06)", backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,228,184,0.32)" }}>ÉCHO</span>
        <span style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(107,143,199,0.65)", fontFamily: "Inter, sans-serif" }}>The Mirror</span>
      </div>
      <p style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(255,228,184,0.28)", marginBottom: 12, fontFamily: "Inter, sans-serif" }}>Echo profile</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TRAITS.map(({ label, pct, color }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "rgba(255,246,233,0.6)", fontFamily: "Inter, sans-serif" }}>{label}</span>
              <span style={{ fontSize: 10, color, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: "rgba(255,246,233,0.55)", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", lineHeight: 1.55 }}>
        "You return to the question of what you actually want."
      </p>
    </div>
  );
}

function Card4Content() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const timer = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  // Varied durations per bar for organic feel — primes & irrationals avoid phase sync
  const BAR_DURS = [1.8, 2.3, 1.5, 2.1, 1.6, 2.4, 1.9, 1.4, 2.2, 1.7,
                   2.0, 1.5, 2.3, 1.8, 1.6, 2.1, 1.4, 2.4, 1.9, 2.0,
                   1.7, 1.5, 2.2, 1.8, 2.3, 1.6, 1.9, 2.1];

  return (
    <div style={{ padding: "20px 22px", borderRadius: 24, background: "linear-gradient(165deg, rgba(16,26,52,0.97) 0%, rgba(6,10,18,0.99) 100%)", border: "1px solid rgba(191,96,64,0.18)", boxShadow: "0 44px 80px rgba(0,0,0,0.58), 0 0 40px rgba(191,96,64,0.07), inset 0 1px 0 rgba(255,246,233,0.06)", backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,228,184,0.32)" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF3B30", animation: "recDot 1s ease-in-out infinite" }} />
          <span style={{ fontSize: 8, color: "rgba(255,246,233,0.4)", letterSpacing: "0.12em", fontFamily: "Inter, sans-serif" }}>REC</span>
        </div>
      </div>
      <p style={{ fontSize: 8, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: "rgba(255,228,184,0.28)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>Today's question</p>
      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 15, color: "rgba(255,246,233,0.88)", lineHeight: 1.4, marginBottom: 14, fontStyle: "italic" }}>
        What decision are you delaying?
      </p>
      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2.5, height: 44, padding: "0 4px" }}>
        {WAVE_HEIGHTS.slice(0, 28).map((h, i) => {
          const maxScale = Math.max(0.25, Math.min(1, h * 0.055));
          return (
            <div
              key={i}
              style={{
                width: 3,
                height: Math.max(4, Math.round(h * 0.72)),
                borderRadius: 1.5,
                transformOrigin: "bottom",
                background: `rgba(191,96,64,${0.35 + maxScale * 0.5})`,
                ["--bar-max" as string]: maxScale.toFixed(2),
                animation: `barDance ${BAR_DURS[i]}s ${(i * 0.06).toFixed(2)}s ease-in-out infinite alternate`,
              }}
            />
          );
        })}
      </div>
      {/* Timer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,246,233,0.45)", fontFamily: "monospace", letterSpacing: "0.08em" }}>{timer}</span>
      </div>
    </div>
  );
}

// ── Swipeable card stack (mobile hero) ─────────────────────────

type SwipeCardId = 0 | 1 | 2 | 3;

const STACK_OFFSETS = [
  { y: 0,  x: 0,   scale: 1,    rotate: -1.0, zIndex: 4 },
  { y: 14, x: 12,  scale: 0.95, rotate: 5.0,  zIndex: 3 },
  { y: 24, x: -10, scale: 0.90, rotate: -3.5, zIndex: 2 },
  { y: 32, x: 7,   scale: 0.86, rotate: 2.8,  zIndex: 1 },
] as const;

const CARD_CONTENT: Record<SwipeCardId, React.ReactNode> = {
  0: <Card1Content />,
  1: <Card2Content />,
  2: <Card3Content />,
  3: <Card4Content />,
};

function StackCard({
  cardId,
  stackIndex,
  isTop,
  isExiting,
  exitDir,
  showHint,
  onStartSwipe,
}: {
  cardId: SwipeCardId;
  stackIndex: number;
  isTop: boolean;
  isExiting: boolean;
  exitDir: number;
  showHint: boolean;
  onStartSwipe: (dir: number) => void;
}) {
  const controls = useAnimation();
  const capped = Math.min(stackIndex, STACK_OFFSETS.length - 1);
  const { y, x: xOffset, scale, rotate: defaultRotate, zIndex } = STACK_OFFSETS[capped];
  const prevIndexRef = useRef(stackIndex);
  const startXRef = useRef(0);
  const currentDxRef = useRef(0);
  const isDragging = useRef(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Position / exit animation
  useEffect(() => {
    if (isExiting) {
      controls.start({
        x: exitDir * 680,
        rotate: exitDir * 24,
        opacity: 0,
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      });
      return;
    }
    const wasTop = prevIndexRef.current === 0;
    const nowBottom = stackIndex === STACK_OFFSETS.length - 1;
    prevIndexRef.current = stackIndex;

    if (wasTop && nowBottom) {
      controls.set({ x: xOffset, y, scale, rotate: defaultRotate, opacity: 0 });
      controls.start({ opacity: 1, transition: { duration: 0.22, delay: 0.06 } });
    } else {
      controls.start({
        x: xOffset, y, scale, rotate: defaultRotate, opacity: 1,
        transition: { type: "spring" as const, stiffness: 310, damping: 28, restDelta: 0.001 },
      });
    }
  }, [isExiting, stackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hint wiggle — strong repeating swipe nudge so it's obvious the card slides
  useEffect(() => {
    if (!isTop || !showHint) return;
    hintTimerRef.current = setTimeout(() => {
      // L-R, L-R (fast) then L-R (slower), back to rest — repeating
      controls.start({
        x: [
          xOffset,
          xOffset - 30, xOffset + 32,
          xOffset - 26, xOffset + 28,
          xOffset - 16, xOffset + 18,
          xOffset,
        ],
        rotate: [
          defaultRotate,
          defaultRotate - 5, defaultRotate + 6,
          defaultRotate - 4, defaultRotate + 5,
          defaultRotate - 2.5, defaultRotate + 3,
          defaultRotate,
        ],
        transition: {
          duration: 2.4,
          ease: "easeInOut",
          times: [0, 0.10, 0.23, 0.36, 0.50, 0.66, 0.82, 1],
          repeat: Infinity,
          repeatDelay: 2.0,
        },
      });
    }, 900);
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      controls.stop();
    };
  }, [isTop, showHint]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop || isExiting) return;
    controls.stop();
    startXRef.current = e.clientX;
    currentDxRef.current = 0;
    isDragging.current = true;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }, [isTop, isExiting, controls]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startXRef.current;
    currentDxRef.current = dx;
    controls.set({ x: xOffset + dx, rotate: dx / 8, y });
  }, [xOffset, y]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = currentDxRef.current;
    if (Math.abs(dx) > 72) {
      onStartSwipe(dx > 0 ? 1 : -1);
    } else {
      controls.start({
        x: xOffset, y, rotate: defaultRotate,
        transition: { type: "spring" as const, stiffness: 480, damping: 36 },
      });
    }
  }, [xOffset, y, defaultRotate, onStartSwipe]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      animate={controls}
      initial={{ x: xOffset, y, scale, rotate: defaultRotate, opacity: 1 }}
      style={{
        position: "absolute", top: 0, left: 0, right: 0,
        zIndex,
        cursor: isTop ? "grab" : "default",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {CARD_CONTENT[cardId]}
    </motion.div>
  );
}

function SwipeableCardStack() {
  const [order, setOrder] = useState<SwipeCardId[]>([0, 1, 2, 3]);
  const [exitingId, setExitingId] = useState<SwipeCardId | null>(null);
  const exitDirRef = useRef(1);
  const busy = useRef(false);
  const [hasInteractedWithCards, setHasInteractedWithCards] = useState(false);

  const handleStartSwipe = useCallback((dir: number) => {
    if (busy.current) return;
    busy.current = true;
    exitDirRef.current = dir;
    setExitingId(order[0]);
    setHasInteractedWithCards(true);
    setTimeout(() => {
      setOrder(([first, ...rest]) => [...rest, first] as SwipeCardId[]);
      setExitingId(null);
      busy.current = false;
    }, 380);
  }, [order]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
      <div style={{ position: "relative", height: 300 }}>
        {order.map((cardId, stackIndex) => (
          <StackCard
            key={cardId}
            cardId={cardId}
            stackIndex={stackIndex}
            isTop={stackIndex === 0}
            isExiting={exitingId === cardId}
            exitDir={exitDirRef.current}
            showHint={stackIndex === 0 && !hasInteractedWithCards}
            onStartSwipe={handleStartSwipe}
          />
        ))}
      </div>
      {/* Hint */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          marginTop: 20,
          opacity: hasInteractedWithCards ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 28 14" fill="none" style={{ width: 28 }}>
          <path d="M1 7h10M7 3l-6 4 6 4" stroke="#BF6040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 7H17M21 3l6 4-6 4" stroke="#BF6040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 12, color: "rgba(255,246,233,0.85)", fontFamily: "Urbanist, sans-serif", fontWeight: 500, letterSpacing: "0.1em" }}>
          swipe to explore
        </span>
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

// ── HeroVisualMobile — swipeable card stack for small screens ──
function HeroVisualMobile() {
  return <SwipeableCardStack />;
}

// ── HeroSection ────────────────────────────────────────────────
function HeroSection() {
  const { C, isDark } = useLandingTheme();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const textO = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const imgO  = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  const scrollCueO = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", display: "flex", alignItems: "center" }}
    >
      {/* Mobile: right-side atmospheric panel */}
      <motion.div
        className="block lg:hidden"
        style={{ opacity: imgO, position: "absolute", top: 0, bottom: 0, right: 0, left: "52%", zIndex: 1, overflow: "hidden" }}
      >
        <img
          src={isDark ? "/hero-lifestyle-dark.webp" : "/hero-lifestyle-light.webp"}
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "65% center", display: "block", opacity: 0.72 }}
        />
        {/* Heavy left fade — covers most of the panel so text is never overlapped */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.bg} 0%, ${C.bg} 50%, transparent 100%)`, pointerEvents: "none" }} />
        {/* Top + bottom bleed */}
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: `linear-gradient(to bottom, ${C.bg}, transparent)`, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: `linear-gradient(to top, ${C.bg}, transparent)`, pointerEvents: "none" }} />
      </motion.div>

      {/* Desktop: right-side panel */}
      <motion.div
        className="hidden lg:block"
        style={{ opacity: imgO, position: "absolute", top: 0, bottom: 0, right: 0, left: "36%", zIndex: 1, overflow: "hidden" }}
      >
        <img
          src={isDark ? "/hero-lifestyle-dark.webp" : "/hero-lifestyle-light.webp"}
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% center", display: "block" }}
        />
        {/* Left — blend into text column */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.bg} 0%, ${C.bg} 2%, transparent 36%)`, pointerEvents: "none" }} />
        {/* Top */}
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "18%", background: `linear-gradient(to bottom, ${C.bg}, transparent)`, pointerEvents: "none" }} />
        {/* Bottom */}
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: `linear-gradient(to top, ${C.bg}, transparent)`, pointerEvents: "none" }} />
        {/* Right */}
        <div aria-hidden style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "10%", background: `linear-gradient(to left, ${C.bg}, transparent)`, pointerEvents: "none" }} />
      </motion.div>

      {/* Left content column */}
      <motion.div
        style={{ y: textY, opacity: textO }}
        className="relative z-10 w-full lg:w-auto lg:flex-none"
      >
        <div
          style={{
            width: "min(840px, 100%)",
            paddingTop: 130,
            paddingBottom: 90,
            paddingLeft: "max(48px, min(8vw, 110px))",
            paddingRight: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
          className="max-lg:items-center max-lg:text-center max-lg:!px-6 max-lg:!w-full max-lg:max-w-lg max-lg:mx-auto max-lg:!pt-[72px]"
        >

          {/* Badge */}
          <div className="hero-badge" style={{ marginBottom: 22 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 18px", borderRadius: 999,
              border: `1px solid ${isDark ? "rgba(255,228,184,0.2)" : "rgba(191,96,64,0.28)"}`,
              background: isDark ? "rgba(255,228,184,0.05)" : "rgba(191,96,64,0.06)",
              fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.2em",
              color: C.muted, fontFamily: C.sans,
            }}>
              <span className="badge-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.ember, display: "inline-block" }} />
              Private voice journal · Coming first to iPhone
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(2.4rem, 4.8vw, 4rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              marginBottom: 28,
              color: C.cream,
            }}
          >
            <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.12s" }}>
              Everyone's asking AI for answers.
            </span>{" "}
            <em style={{ color: C.ember, fontStyle: "italic", display: "block", marginTop: 4 }}>
              ÉCHO helps you hear your own.
            </em>
          </h1>

          {/* Body */}
          <p
            className="hero-fade"
            style={{
              fontFamily: C.sans,
              fontSize: "clamp(0.95rem, 1.35vw, 1.06rem)",
              color: C.muted,
              maxWidth: 420,
              lineHeight: 1.78,
              marginBottom: 36,
              animationDelay: "0.34s",
            }}
          >
            A private voice journal that remembers what you said, notices the thoughts you return to, and brings your own words back when they matter.
          </p>

          {/* Hero CTAs */}
          <div
            className="hero-fade max-lg:justify-center"
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, animationDelay: "0.56s" }}
          >
            <button
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{
                padding: "13px 28px", borderRadius: 999,
                background: C.ember, color: "#FFF6E9",
                fontFamily: C.sans, fontSize: 14, fontWeight: 600,
                border: "none", cursor: "pointer", letterSpacing: "0.02em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Join the founding waitlist →
            </button>
          </div>

          {/* Supporting line */}
          <p
            className="hero-fade"
            style={{
              fontFamily: C.sans,
              fontSize: 13,
              color: C.muted,
              lineHeight: 1.6,
              animationDelay: "0.72s",
              opacity: 0.75,
            }}
          >
            Be among the first to access ÉCHO and the first 1,000 subscribers eligible for founding member pricing.
          </p>

</div>
      </motion.div>

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

// ── WhyEchoSection (Section 2) ─────────────────────────────────
function WhyEchoSection() {
  const { C, isDark } = useLandingTheme();

  const CARDS = [
    { text: "The decision you keep reconsidering",          c1: "#3D1A0A", c2: "#7A3218" },
    { text: "The thought that comes back three months later", c1: "#2A1509", c2: "#5A3018" },
    { text: "The goal you keep talking about",              c1: "#2C0E05", c2: "#6A2510" },
    { text: "The version of you who already knew",          c1: "#261508", c2: "#4A2A0A" },
  ];

  return (
    <section
      id="why"
      style={{
        position: "relative",
        padding: "80px 24px",
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
          — WHY ÉCHO
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            letterSpacing: "0",
            color: C.cream,
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          ÉCHO{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            keeps them.
          </em>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ fontSize: "clamp(1rem, 1.6vw, 1.08rem)", color: C.muted, lineHeight: 1.72, fontFamily: C.sans, marginBottom: 40, maxWidth: 540 }}
        >
          The thoughts you don't want to lose, held gently in one place — so you can return to what matters.
        </motion.p>

        {/* 2×2 image-led card grid */}
        <motion.div
          variants={staggerV(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                aspectRatio: "4/5",
                background: `linear-gradient(145deg, ${card.c1} 0%, ${card.c2} 100%)`,
              }}
            >
              {/* Top-left scrim for text legibility */}
              <div aria-hidden style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(0,0,0,0.62) 0%, transparent 58%)",
              }} />
              {/* Caption — top-left */}
              <p style={{
                position: "absolute",
                top: 18,
                left: 18,
                right: 18,
                margin: 0,
                fontFamily: C.serif,
                fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                color: "#FFF6E9",
                lineHeight: 1.28,
              }}>
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── HowItWorksSection (Section 3) ──────────────────────────────
function HowItWorksSection() {
  const { C, isDark } = useLandingTheme();

  const STEPS = [
    {
      num: "01",
      title: "Speak",
      body: "A question waits for you. Answer however it comes out — messy, unfinished, completely yours.",
    },
    {
      num: "02",
      title: "ÉCHO remembers",
      body: "Your words become part of your private journal, building a record of the thoughts you keep coming back to.",
    },
    {
      num: "03",
      title: "Hear yourself again",
      body: "When a thought returns, ÉCHO surfaces what you said before — so you can see what changed and what didn't.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        position: "relative",
        padding: "68px 24px 72px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <motion.div
          variants={staggerV(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <motion.p variants={fadeUp} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: C.ember, marginBottom: 14, fontFamily: C.sans }}>
            — How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: C.cream, lineHeight: 1.1 }}
          >
            Three steps.{" "}
            <em style={{ color: C.ember, fontStyle: "italic" }}>That's the whole app.</em>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerV(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              style={{
                padding: "28px 26px 26px",
                background: isDark ? "rgba(255,246,233,0.04)" : "rgba(255,246,233,0.9)",
                border: `1px solid ${isDark ? "rgba(255,228,184,0.09)" : "rgba(191,96,64,0.1)"}`,
                borderRadius: 20,
                position: "relative",
              }}
            >
              <p style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 3vw, 2.6rem)", color: C.ember, marginBottom: 14, opacity: 0.22, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {step.num}
              </p>
              <h3 style={{ fontFamily: C.serif, fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)", color: C.cream, marginBottom: 12, lineHeight: 1.2 }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: C.sans, fontSize: 14.5, color: C.muted, lineHeight: 1.72, margin: 0 }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── InteractivePhoneSection ─────────────────────────────────────
function InteractivePhoneSection() {
  const { C, isDark } = useLandingTheme();
  const isMobile = useIsMobile();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Left/right panel transition
  const [phase, setPhase] = useState<PanelPhase>("visible");
  const phaseRef = useRef<PanelPhase>("visible");
  const pendingTabRef = useRef<TabId | null>(null);

  // Home tab state
  const [homeState, setHomeState] = useState<HomeState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Mirror tab key (re-triggers bar animation)
  const [mirrorKey, setMirrorKey] = useState(0);

  const phoneRef = useRef<HTMLDivElement>(null);

  // Recording timer
  useEffect(() => {
    if (homeState !== "recording") { setRecordingSeconds(0); return; }
    const id = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [homeState]);

  // Auto-advance processing → result
  useEffect(() => {
    if (homeState !== "processing") return;
    const t = setTimeout(() => setHomeState("result"), 2500);
    return () => clearTimeout(t);
  }, [homeState]);

  // Reset homeState when leaving home tab
  useEffect(() => {
    if (activeTab !== "home") {
      setHomeState("idle");
      setRecordingSeconds(0);
    }
  }, [activeTab]);

  const applyTabChange = useCallback((tab: TabId) => {
    phaseRef.current = "exiting";
    setPhase("exiting");
    setTimeout(() => {
      setActiveTab(tab);
      if (tab === "mirror") setMirrorKey(k => k + 1);
      phaseRef.current = "entering";
      setPhase("entering");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          phaseRef.current = "visible";
          setPhase("visible");
          if (pendingTabRef.current !== null && pendingTabRef.current !== tab) {
            const q = pendingTabRef.current;
            pendingTabRef.current = null;
            applyTabChange(q);
          } else {
            pendingTabRef.current = null;
          }
        })
      );
    }, 180);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === activeTab) return;
    setHasInteracted(true);
    if (phaseRef.current !== "visible") {
      pendingTabRef.current = tab;
      return;
    }
    applyTabChange(tab);
  }, [activeTab, applyTabChange]);

  const ambientColor = TAB_AMBIENT[activeTab][isDark ? "dark" : "light"];
  const tabInfo = TAB_INFO[activeTab];

  // Phone inner content
  const phoneContent = (
    <>
      {/* Screen + tab bar (stops above home indicator) */}
      <div style={{ position: "absolute", inset: "0 0 22px 0", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 42 }}>
        {/* Screen content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {activeTab === "home" && (
            <HomeTabScreen
              homeState={homeState}
              setHomeState={setHomeState}
              recordingSeconds={recordingSeconds}
            />
          )}
          {activeTab === "archive" && <ArchiveTabScreen />}
          {activeTab === "mirror" && <MirrorTabScreen mirrorKey={mirrorKey} />}
          {activeTab === "letters" && <LettersTabScreen />}
          {activeTab === "profile" && <ProfileTabScreen />}
        </div>
        {/* Tab bar */}
        <PhoneTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      {/* Interactive overlay — covers full phone screen (inset:0 = full area incl. home indicator) */}
      <div
        onClick={() => setHasInteracted(true)}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 42,
          background: "rgba(6,10,22,0.62)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          zIndex: 10,
          cursor: "pointer",
          opacity: hasInteracted ? 0 : 1,
          pointerEvents: hasInteracted ? "none" : "auto",
          transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Ripple rings + tap icon */}
        <div style={{ position: "relative", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: "1.5px solid rgba(191,96,64,0.35)", animation: "tapRipple 2s 0s ease-out infinite" }} />
          <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(191,96,64,0.5)", animation: "tapRipple 2s 0.7s ease-out infinite" }} />
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,96,64,0.22) 0%, rgba(191,96,64,0.06) 70%)", border: "1.5px solid rgba(191,96,64,0.55)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px rgba(191,96,64,0.2)" }}>
            <Pointer size={26} color="#BF6040" strokeWidth={1.6} />
          </div>
        </div>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 5 }}>
          <p style={{ fontSize: 15, color: "rgba(255,246,233,0.95)", fontFamily: "Urbanist, sans-serif", fontWeight: 600, letterSpacing: "0.01em" }}>Tap anywhere to start</p>
          <p style={{ fontSize: 11, color: "rgba(255,246,233,0.5)", fontFamily: "Urbanist, sans-serif", letterSpacing: "0.04em" }}>Then tap any tab to switch screens</p>
        </div>
      </div>
    </>
  );

  // Mobile layout
  if (isMobile) {
    return (
      <div
        id="interactive-phone"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 56,
          paddingBottom: 140,
          overflow: "clip",
        }}
      >
        {/* Ambient */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: ambientColor, transition: "background 0.7s ease-in-out", pointerEvents: "none" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Section headline */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <p style={{ fontSize: 11, color: C.ember, fontFamily: C.sans, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
              — The demo
            </p>
            <h2 style={{ fontFamily: C.serif, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: C.cream, lineHeight: 1.12, marginBottom: 0 }}>
              See what ÉCHO{" "}
              <em style={{ color: C.ember, fontStyle: "italic" }}>feels like.</em>
            </h2>
          </div>
          {/* Chapter label above phone */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 10, color: C.ember, fontFamily: C.sans, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>
              {tabInfo.eyebrow}
            </p>
            <p style={{ fontSize: "clamp(1.4rem, 5vw, 1.8rem)", color: C.cream, fontFamily: C.serif, lineHeight: 1.15, whiteSpace: "pre-line" }}>
              {tabInfo.headline}
            </p>
          </div>
          {/* Phone with glow ring */}
          <div ref={phoneRef} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ borderRadius: 52, animation: hasInteracted ? "none" : "phoneGlow 2.2s ease-in-out infinite", transition: "animation 0.5s" }}>
              <IPhoneFrame>{phoneContent}</IPhoneFrame>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      id="interactive-phone"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        overflow: "hidden",
      }}
    >
      {/* Ambient */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: ambientColor, transition: "background 0.7s ease-in-out", pointerEvents: "none" }} />

      {/* Section headline */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: 52 }}>
        <p style={{ fontSize: 11, color: C.ember, fontFamily: C.sans, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 12 }}>
          — The demo
        </p>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.cream, lineHeight: 1.12 }}>
          See what ÉCHO{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>feels like.</em>
        </h2>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: isDark ? "rgba(255,228,184,0.08)" : "rgba(26,15,5,0.08)", zIndex: 20 }}>
        <div style={{ height: "100%", background: C.ember, borderRadius: 1, width: `${((Object.keys(TAB_INFO).indexOf(activeTab) + 1) / Object.keys(TAB_INFO).length) * 100}%`, transition: "width 0.4s ease-out" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14 w-full max-w-[1100px] px-6 lg:px-10" style={{ minWidth: 0, position: "relative", zIndex: 1 }}>
        {/* Left panel */}
        <div className="hidden lg:block" style={{ overflow: "hidden" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: C.ember, marginBottom: 16, fontFamily: C.sans, ...staggerStyle(0, phase) }}>
            {tabInfo.eyebrow}
          </p>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(1.9rem, 3.2vw, 3rem)", color: C.cream, lineHeight: 1.08, marginBottom: 18, whiteSpace: "pre-line", ...staggerStyle(1, phase) }}>
            {tabInfo.headline}
          </h2>
          <p style={{ fontSize: 16, color: isDark ? "rgba(255,246,233,0.68)" : "rgba(26,15,5,0.65)", lineHeight: 1.7, marginBottom: 14, maxWidth: 360, ...staggerStyle(2, phase) }}>
            {tabInfo.body}
          </p>
          <p style={{ fontSize: 13, color: isDark ? "rgba(255,228,184,0.42)" : "rgba(26,15,5,0.4)", lineHeight: 1.6, ...staggerStyle(3, phase) }}>
            {tabInfo.detail}
          </p>
        </div>

        {/* Center: phone with glow ring */}
        <div ref={phoneRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ borderRadius: 52, animation: hasInteracted ? "none" : "phoneGlow 2.2s ease-in-out infinite" }}>
            <IPhoneFrame>{phoneContent}</IPhoneFrame>
          </div>
          {!hasInteracted && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(191,96,64,0.12)", border: "1px solid rgba(191,96,64,0.28)", animation: "tapBadgePulse 2s ease-in-out infinite" }}>
              <Pointer size={13} color="#BF6040" strokeWidth={1.8} />
              <span style={{ fontSize: 11, color: "#BF6040", fontFamily: "Urbanist, sans-serif", fontWeight: 500, letterSpacing: "0.04em" }}>Tap to explore</span>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="hidden lg:flex flex-col gap-5" style={{ overflow: "hidden" }}>
          <div style={staggerStyle(0, phase)}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: isDark ? "rgba(255,228,184,0.3)" : "rgba(26,15,5,0.35)", fontFamily: C.sans, marginBottom: 12 }}>
              Key features
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TAB_RIGHT_BULLETS[activeTab].map((bullet, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.ember, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: C.cream, fontFamily: C.sans, lineHeight: 1.4 }}>{bullet}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "12px 14px", background: isDark ? "rgba(14,22,44,0.6)" : "rgba(191,96,64,0.04)", borderRadius: 12, border: `1px solid ${isDark ? "rgba(255,228,184,0.07)" : "rgba(191,96,64,0.12)"}`, ...staggerStyle(1, phase) }}>
            <p style={{ fontSize: 12, color: isDark ? "rgba(255,246,233,0.55)" : "rgba(26,15,5,0.5)", fontFamily: C.sans, lineHeight: 1.6, fontStyle: "italic" }}>
              "Private by design — nothing leaves your device without your permission."
            </p>
          </div>
        </div>
      </div>

      {/* Closing line */}
      <p style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: 48, fontFamily: C.sans, fontSize: 14, color: C.muted, opacity: 0.7 }}>
        No account. No download. Just a glimpse of the ÉCHO experience.
      </p>
    </div>
  );
}

// ── FeatureListingSection (Section 5) ─────────────────────────
function FeatureListingSection() {
  const { C, isDark } = useLandingTheme();
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const N = 4;

  const resetTimer = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setActive(a => (a + 1) % N), 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  const next = () => { setActive(a => (a + 1) % N); resetTimer(); };
  const prev = () => { setActive(a => (a - 1 + N) % N); resetTimer(); };
  const goto = (i: number) => { setActive(i); resetTimer(); };

  const FEATURES: Array<{
    tag: string;
    body: string;
    grad: string;
    cardContent: React.ReactNode;
  }> = [
    {
      tag: "Record",
      body: "One tap starts it. Just talk — ÉCHO writes it down as you go.",
      grad: "linear-gradient(168deg, #EDE0CC 0%, #D8B87A 50%, #B08040 100%)",
      cardContent: (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,245,220,0.55) 0%, transparent 55%)" }} />
          {/* "Just talk…" label */}
          <p style={{ position: "absolute", top: "30%", left: 0, right: 0, textAlign: "center", margin: 0, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(16px, 4.5vw, 20px)", fontStyle: "italic", color: "rgba(80,42,8,0.55)", letterSpacing: "0.01em" }}>
            Just talk…
          </p>
          {/* Mic button */}
          <div style={{ position: "absolute", top: "52%", left: "50%", transform: "translate(-50%,-50%)", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.88)", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#BF6040" }} />
          </div>
          {/* Soundwave lines */}
          <div style={{ position: "absolute", bottom: "22%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, alignItems: "flex-end" }}>
            {[10, 16, 22, 16, 12, 20, 14, 10].map((h, idx) => (
              <div key={idx} style={{ width: 3, height: h, borderRadius: 2, background: "rgba(255,255,255,0.45)" }} />
            ))}
          </div>
        </>
      ),
    },
    {
      tag: "Reflect",
      body: "Come back to any entry. Read it, or hear it in your own voice — exactly as you said it.",
      grad: "linear-gradient(168deg, #E4D8C0 0%, #C8AE88 50%, #9A7050 100%)",
      cardContent: (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 65% 25%, rgba(255,240,210,0.48) 0%, transparent 52%)" }} />
          {/* Journal lines */}
          <div style={{ position: "absolute", top: "20%", left: "14%", right: "14%", display: "flex", flexDirection: "column", gap: 9 }}>
            {[80, 92, 70, 88, 60].map((w, idx) => (
              <div key={idx} style={{ width: `${w}%`, height: 1.5, borderRadius: 1, background: "rgba(255,255,255,0.38)" }} />
            ))}
          </div>
          {/* "A quieter me." text */}
          <p style={{ position: "absolute", bottom: "28%", left: 0, right: 0, textAlign: "center", margin: 0, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(17px, 4.5vw, 21px)", fontStyle: "italic", color: "rgba(75,38,8,0.58)" }}>
            A quieter me.
          </p>
        </>
      ),
    },
    {
      tag: "The Mirror",
      body: "The thoughts you keep circling back to, gathered and shown to you — not analyzed, not explained.",
      grad: "linear-gradient(168deg, #D8D0C0 0%, #B4A890 50%, #8A7860 100%)",
      cardContent: (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 72%, rgba(255,245,225,0.42) 0%, transparent 58%)" }} />
          {/* Mirror shape — oval frame */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -54%)", width: 88, height: 118, borderRadius: "50% 50% 46% 46%", border: "2.5px solid rgba(255,255,255,0.55)", boxShadow: "0 0 0 1px rgba(255,255,255,0.15), inset 0 0 24px rgba(255,255,255,0.08)" }} />
          {/* Shadow cast */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-20%, -20%) rotate(20deg)", width: 60, height: 120, background: "linear-gradient(135deg, rgba(0,0,0,0.07) 0%, transparent 70%)", borderRadius: 4, pointerEvents: "none" }} />
        </>
      ),
    },
    {
      tag: "Letters",
      body: "Write to a version of yourself who isn't here yet. Set a date. ÉCHO holds it until then.",
      grad: "linear-gradient(168deg, #EAD8B4 0%, #CCB07A 50%, #9E8050 100%)",
      cardContent: (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 52% 18%, rgba(255,248,220,0.52) 0%, transparent 54%)" }} />
          {/* Envelope shape */}
          <div style={{ position: "absolute", top: "28%", left: "50%", transform: "translateX(-50%)", width: 100, height: 70, borderRadius: 6, border: "2px solid rgba(255,255,255,0.52)", background: "rgba(255,255,255,0.10)" }}>
            {/* Flap lines */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderBottom: "1.5px solid rgba(255,255,255,0.30)", background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }} />
          </div>
          {/* "To a brighter you." */}
          <p style={{ position: "absolute", bottom: "26%", left: 0, right: 0, textAlign: "center", margin: 0, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(15px, 4vw, 18px)", fontStyle: "italic", color: "rgba(75,40,5,0.54)" }}>
            To a brighter you.
          </p>
        </>
      ),
    },
  ];

  // Stacking positions — matches mockup: front tilts left, back cards fan clockwise
  // pivot near card bottom (originY 88%) so fan feels like a held deck
  const STACK = [
    { x: 0,   y: 0,  scale: 1,    rotate: -4,  opacity: 1,    z: 4 },
    { x: 86,  y: 4,  scale: 0.86, rotate:  5,  opacity: 0.84, z: 3 },
    { x: 154, y: 8,  scale: 0.73, rotate: 14,  opacity: 0.65, z: 2 },
    { x: 208, y: 12, scale: 0.61, rotate: 23,  opacity: 0.47, z: 1 },
  ];

  // Card dimensions — taller to match mockup portrait proportions
  const CARD_W = "min(300px, 82vw)";
  const CARD_H = "clamp(500px, 130vw, 560px)";

  return (
    <section
      id="features"
      style={{ position: "relative", padding: "72px 0 88px", overflowX: "clip" }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.65 }}
          style={{ textAlign: "center", marginBottom: 52, padding: "0 24px" }}
        >
          <p style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.ember, margin: "0 0 14px", fontFamily: C.sans }}>
            — What's inside
          </p>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 7vw, 3.2rem)", color: isDark ? C.cream : "#1A0F05", lineHeight: 1.1, margin: "0 0 14px" }}>
            Four things ÉCHO{" "}
            <em style={{ color: C.ember, fontStyle: "italic" }}>actually does.</em>
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: "clamp(0.9rem, 3vw, 1rem)", color: C.muted, lineHeight: 1.65, maxWidth: 360, margin: "0 auto" }}>
            A quieter mind, one tap at a time.
          </p>
        </motion.div>

        {/* Card stack — centered; fanned cards overflow-clipped by section */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 24px" }}>
          <div
            style={{ position: "relative", width: CARD_W, height: CARD_H, outline: "none" }}
            tabIndex={0}
            onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowDown") next(); if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev(); }}
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 36) { dx < 0 ? next() : prev(); }
              touchStartX.current = null;
            }}
          >
            {FEATURES.map((f, i) => {
              const d = (i - active + N) % N;
              const s = STACK[d];
              return (
                <motion.div
                  key={i}
                  animate={{ x: s.x, y: s.y, scale: s.scale, rotate: s.rotate, opacity: s.opacity }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => d === 0 ? next() : goto(i)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: s.z,
                    borderRadius: 24,
                    background: isDark ? "#231810" : "#FEFCF8",
                    border: `1px solid ${isDark ? "rgba(255,228,184,0.07)" : "rgba(191,96,64,0.08)"}`,
                    boxShadow: d === 0
                      ? "0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.06)"
                      : "0 6px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column" as const,
                    padding: 14,
                    userSelect: "none" as const,
                    // pivot near bottom so rotation fans like a held deck of cards
                    originX: "50%",
                    originY: "88%",
                  }}
                >
                  {/* Top row: counter + tag pill */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0 }}>
                    <span style={{ fontFamily: C.sans, fontSize: 11, color: isDark ? "rgba(255,246,233,0.26)" : "rgba(26,15,5,0.24)", fontWeight: 600, letterSpacing: "0.07em" }}>
                      {i + 1} / {N}
                    </span>
                    <span style={{
                      padding: "4px 14px",
                      borderRadius: 999,
                      border: `1px solid ${isDark ? "rgba(191,96,64,0.28)" : "rgba(191,96,64,0.18)"}`,
                      background: isDark ? "rgba(191,96,64,0.07)" : "rgba(255,246,233,0.97)",
                      fontFamily: C.serif,
                      fontSize: 13,
                      color: C.ember,
                      fontStyle: "italic",
                    }}>
                      {f.tag}
                    </span>
                  </div>

                  {/* Image area — styled gradient placeholder with feature content */}
                  <div style={{
                    flex: 1,
                    borderRadius: 16,
                    background: f.grad,
                    marginBottom: 14,
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 0,
                  }}>
                    {/* Bottom vignette */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.10) 100%)" }} />
                    {/* Feature-specific overlay content */}
                    {f.cardContent}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: C.sans,
                    fontSize: 13.5,
                    color: isDark ? "rgba(255,246,233,0.75)" : "rgba(26,15,5,0.70)",
                    lineHeight: 1.68,
                    margin: 0,
                    flexShrink: 0,
                  }}>
                    {f.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots + hint */}
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, marginTop: 48, padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                style={{ width: 24, height: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <div style={{
                  width: i === active ? 22 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === active ? C.ember : isDark ? "rgba(191,96,64,0.22)" : "rgba(191,96,64,0.18)",
                  transition: "width 0.28s ease, background 0.28s ease",
                }} />
              </button>
            ))}
          </div>
          <p style={{ fontFamily: C.serif, fontSize: 14, color: C.muted, fontStyle: "italic", margin: 0, opacity: 0.55 }}>
            Tap to explore, or swipe
          </p>
        </div>
      </div>
    </section>
  );
}

// ── FounderSection (Section 7) ─────────────────────────────────
function FounderSection() {
  const { C, isDark } = useLandingTheme();

  return (
    <section
      id="founder"
      style={{ position: "relative", padding: "68px 24px 72px", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div
          variants={staggerV(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.p variants={fadeUp} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: C.ember, marginBottom: 20, fontFamily: C.sans }}>
            — The founder
          </motion.p>

          <motion.div
            variants={scaleUp}
            style={{
              padding: "36px 36px 32px",
              background: isDark
                ? "rgba(255,246,233,0.04)"
                : "rgba(255,246,233,0.92)",
              border: `1px solid ${isDark ? "rgba(191,96,64,0.18)" : "rgba(191,96,64,0.12)"}`,
              borderRadius: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Soft ember accent top */}
            <div aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 2, background: `linear-gradient(90deg, transparent, ${C.ember}55, transparent)` }} />

            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #C87D5A, #8B3D1A)",
                boxShadow: "0 3px 12px rgba(191,96,64,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: C.serif, fontSize: 20, color: "#FFF6E9", fontStyle: "italic" }}>R</span>
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: C.sans, fontSize: 14, fontWeight: 700, color: isDark ? C.cream : "#2A1008" }}>Roksana</p>
                <p style={{ margin: 0, fontFamily: C.sans, fontSize: 12, color: C.muted }}>Founder of ÉCHO</p>
              </div>
            </div>

            <span aria-hidden style={{ display: "block", fontFamily: C.serif, fontSize: 52, lineHeight: 0.85, color: C.ember, marginBottom: 10, userSelect: "none" as const, opacity: 0.7 }}>"</span>

            <p style={{ fontFamily: C.serif, fontSize: "clamp(1.1rem, 2.2vw, 1.38rem)", color: isDark ? C.cream : "#1A0A02", lineHeight: 1.62, margin: "0 0 20px", fontStyle: "italic" }}>
              I didn't want another app telling me what I should think. I wanted something that could help me remember what I already knew."
            </p>

            <p style={{ fontFamily: C.sans, fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
              ÉCHO started as a personal tool — a way to keep track of the thoughts I kept losing. If it helps you too, that's everything.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── PrivacySection ─────────────────────────────────────────────
const PRIVACY_ICONS = [
  <Smartphone key="smartphone" size={22} strokeWidth={1.5} />,
  <ShieldCheck key="shield" size={22} strokeWidth={1.5} />,
  <EyeOff key="eye" size={22} strokeWidth={1.5} />,
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
        padding: "68px 24px 72px",
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
        style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}
      >
        <motion.div
          variants={staggerV(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ textAlign: "center", marginBottom: 44 }}
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
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              letterSpacing: "0",
              color: C.cream,
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            Your journal should feel{" "}
            <em style={{ color: C.ember, fontStyle: "italic" }}>
              private enough to be honest.
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5"
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

        {/* Privacy CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <Link
            to="/privacy"
            style={{
              fontFamily: C.sans,
              fontSize: 14,
              color: C.ember,
              textDecoration: "none",
              opacity: 0.85,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
          >
            See exactly how ÉCHO protects your data →
          </Link>
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
        padding: "72px 24px 80px",
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
          — Pricing
        </motion.p>
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            letterSpacing: "0",
            color: C.cream,
            lineHeight: 1.1,
          }}
        >
          Be one of ÉCHO's first{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            1,000 founding members.
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
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.muted,
              marginTop: "auto",
              cursor: "pointer",
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

          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", color: C.ember, fontFamily: C.sans, fontWeight: 700 }}>Founding member price</span>
          </div>
          <div style={{ marginBottom: 32 }}>
            {/* Crossed-out regular price */}
            <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, textDecoration: "line-through", opacity: 0.5, margin: "0 0 6px" }}>
              €69.99 / yr
            </p>
            {/* Founding member price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: C.serif, fontSize: "clamp(2.4rem, 5vw, 3.2rem)", color: C.ember, letterSpacing: "-0.02em" }}>€34.99</span>
              <span style={{ fontSize: 15, color: C.muted, fontFamily: C.sans }}>/&thinsp;yr</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: C.sans, margin: "0 0 10px" }}>
              €2.92&thinsp;/&thinsp;mo · billed annually
            </p>
            <p style={{ fontSize: 12, color: C.muted, fontFamily: C.sans, margin: 0 }}>
              Founding member pricing remains active for as long as your subscription stays active.
            </p>
          </div>

          <ul style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 32 }}>
            {PRO_FEATURES.map((f, i) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: i === 0 ? C.muted : C.cream, fontFamily: C.sans, lineHeight: 1.4, fontStyle: i === 0 ? "italic" : "normal", opacity: i === 0 ? 0.6 : 1 }}>
                <span style={{ color: i === 0 ? C.muted : C.ember, marginTop: 2, flexShrink: 0, fontSize: i === 0 ? 13 : 11 }}>{i === 0 ? "·" : "✦"}</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
              marginTop: "auto",
              cursor: "pointer",
              border: "none",
            }}
          >
            Join waitlist — founding price
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── TestimonialsPlaceholder ────────────────────────────────────
function TestimonialsPlaceholder() {
  const { C, isDark } = useLandingTheme();
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Warm translucent cards — no stark white
  const cardBg = isDark ? "rgba(255,246,233,0.06)" : "rgba(191,96,64,0.04)";
  const cardBd = isDark ? "rgba(255,228,184,0.09)" : "rgba(191,96,64,0.10)";
  const qColor = isDark ? C.cream : "#1A0F05";

  const CARDS = [
    {
      quote: "ÉCHO helps me slow down and actually listen to myself. I didn't realise how much I needed this.",
      init: "S.", tag: "Joined the beta", location: "FRANCE",
      grad: "linear-gradient(135deg,#C87D5A,#8B4020)",
    },
    {
      quote: "It's like a conversation with my future self. The reminders always come at the right time.",
      init: "M.", tag: "Early user", location: "GERMANY",
      grad: "linear-gradient(135deg,#A0785A,#7B5028)",
    },
    {
      quote: "Simple, beautiful and so meaningful. ÉCHO helps me see patterns I kept missing.",
      init: "L.", tag: "Joined the beta", location: "LUXEMBOURG",
      grad: "linear-gradient(135deg,#8B6A50,#6A4830)",
    },
    {
      quote: "I always knew what I needed to do. I just needed to hear myself say it again.",
      init: "A.", tag: "Early user", location: "BELGIUM",
      grad: "linear-gradient(135deg,#C8956A,#9B6A40)",
    },
  ];

  const scrollTo = (idx: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const el = container.children[idx] as HTMLElement;
    if (!el) return;
    // Scroll only the carousel container — scrollIntoView scrolls the entire page
    container.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
    setActive(idx);
  };

  const tagPill = (label: string) => (
    <span style={{
      padding: "2px 10px", borderRadius: 99,
      background: isDark ? "rgba(255,228,184,0.08)" : "rgba(191,96,64,0.06)",
      border: `1px solid ${isDark ? "rgba(255,228,184,0.16)" : "rgba(191,96,64,0.14)"}`,
      fontSize: 10, fontFamily: C.sans, color: C.ember,
      letterSpacing: "0.04em", whiteSpace: "nowrap" as const,
    }}>{label}</span>
  );

  const arrowBtn = (onClick: () => void, label: string, icon: string) => (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 34, height: 34, borderRadius: "50%",
        background: isDark ? "rgba(255,228,184,0.07)" : "rgba(191,96,64,0.06)",
        border: `1px solid ${cardBd}`,
        cursor: "pointer", color: C.ember, fontSize: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}
    >{icon}</button>
  );

  return (
    <section id="testimonials" style={{ position: "relative", padding: "80px 0 88px", overflowX: "clip", overflowY: "visible" }}>

      {/* Ambient blobs */}
      <div aria-hidden style={{ position: "absolute", top: -60, right: -80, width: 420, height: 420, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(191,96,64,0.07) 0%,transparent 70%)" : "radial-gradient(circle,rgba(191,96,64,0.08) 0%,transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: 80, left: -100, width: 300, height: 300, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(191,96,64,0.05) 0%,transparent 70%)" : "radial-gradient(circle,rgba(191,96,64,0.06) 0%,transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* No horizontal padding — carousel goes edge-to-edge; sub-elements set their own inset */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header — padded */}
        <motion.div variants={staggerV(0.09)} initial="hidden" whileInView="visible" viewport={VP}
          style={{ textAlign: "center", marginBottom: 48, padding: "0 20px" }}>
          <motion.p variants={fadeUp} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: C.ember, marginBottom: 14, fontFamily: C.sans }}>
            — Real stories
          </motion.p>
          <motion.h2 variants={fadeUp} style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: C.cream, lineHeight: 1.1, margin: "0 0 16px" }}>
            What people are{" "}
            <em style={{ color: C.ember, fontStyle: "italic" }}>already saying.</em>
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontFamily: C.sans, fontSize: "clamp(0.88rem, 1.4vw, 1rem)", color: C.muted, lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
            Early users are already feeling the difference.
          </motion.p>
        </motion.div>

        {/* Carousel — edge to edge, cards slide past the window boundary */}
        <div ref={carouselRef} style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingBottom: 4,
        } as React.CSSProperties}>
          {CARDS.map((card, i) => (
            <div key={i} style={{
              flex: "0 0 min(300px, 88vw)",
              scrollSnapAlign: "start",
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${cardBd}`,
              padding: "22px 20px 20px",
              display: "flex",
              flexDirection: "column",
              // First card: small left margin so rounded corner breathes from screen edge
              marginLeft: i === 0 ? 16 : 0,
              // Last card: right margin so it doesn't jam into the screen edge on scroll end
              marginRight: i === CARDS.length - 1 ? 16 : 0,
            }}>
              <span aria-hidden style={{ display: "block", fontFamily: C.serif, fontSize: 40, lineHeight: 0.85, color: C.ember, marginBottom: 10, userSelect: "none" as const }}>"</span>
              <p style={{ fontFamily: C.serif, fontSize: "clamp(0.9rem, 1.3vw, 1.02rem)", color: qColor, lineHeight: 1.64, margin: "0 0 20px", flex: 1 }}>
                {card.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: card.grad, flexShrink: 0 }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 700, color: qColor }}>{card.init}</span>
                    {tagPill(card.tag)}
                  </div>
                  <span style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, letterSpacing: "0.06em" }}>{card.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation: arrows flanking dots — padded to match page content */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 20, marginBottom: 40, padding: "0 20px" }}>
          {arrowBtn(() => scrollTo(Math.max(0, active - 1)), "Previous", "‹")}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)} aria-label={`Go to card ${i + 1}`}
                style={{ width: 24, height: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <div style={{
                  width: i === active ? 22 : 6, height: 6, borderRadius: 99,
                  background: i === active ? C.ember : (isDark ? "rgba(255,228,184,0.22)" : "rgba(191,96,64,0.22)"),
                  transition: "width 0.25s ease, background 0.25s ease",
                }} />
              </button>
            ))}
          </div>
          {arrowBtn(() => scrollTo(Math.min(CARDS.length - 1, active + 1)), "Next", "›")}
        </div>

        {/* Featured quote — padded from edges */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
          style={{ padding: "0 16px", marginBottom: 44 }}>
        <div style={{
            borderRadius: 24,
            background: isDark ? "rgba(255,246,233,0.04)" : "rgba(191,96,64,0.035)",
            border: `1px solid ${cardBd}`,
            padding: "32px 28px 26px",
          }}>
          <span aria-hidden style={{ display: "block", fontFamily: C.serif, fontSize: 52, lineHeight: 0.9, color: C.ember, marginBottom: 10, userSelect: "none" as const, opacity: 0.75 }}>"</span>
          <p style={{ fontFamily: C.serif, fontSize: "clamp(1.1rem, 2.2vw, 1.38rem)", color: qColor, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 600, fontStyle: "italic" }}>
            ÉCHO gives me space to hear myself clearly instead of rushing past my thoughts."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#C87D5A,#8B4020)", flexShrink: 0, boxShadow: "0 2px 10px rgba(191,96,64,0.2)" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" as const }}>
                <span style={{ fontFamily: C.sans, fontSize: 14, fontWeight: 700, color: qColor }}>Maya</span>
                {tagPill("Early waitlist")}
              </div>
              <span style={{ fontFamily: C.sans, fontSize: 12, color: C.muted }}>Marketing Director, 28</span>
            </div>
          </div>
        </div>
        </motion.div>

        {/* Social proof bar — padded from edges */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
          style={{ padding: "0 16px" }}>
        <div style={{
            borderTop: `1px solid ${isDark ? "rgba(255,228,184,0.09)" : "rgba(191,96,64,0.12)"}`,
            paddingTop: 22,
            display: "flex", flexWrap: "wrap" as const, justifyContent: "space-between", alignItems: "center", gap: 14,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {[
                "linear-gradient(135deg,#C87D5A,#8B4020)",
                "linear-gradient(135deg,#A0785A,#7B5028)",
                "linear-gradient(135deg,#C8956A,#9B6A40)",
              ].map((grad, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: grad,
                  marginLeft: i > 0 ? -10 : 0,
                  border: `2px solid ${isDark ? "#0A1220" : "#FFF6E9"}`,
                  flexShrink: 0,
                }} />
              ))}
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: isDark ? "rgba(255,246,233,0.10)" : "rgba(191,96,64,0.08)",
                border: `2px solid ${isDark ? "#0A1220" : "#FFF6E9"}`,
                marginLeft: -10, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: C.sans, fontSize: 7, color: C.ember, fontWeight: 700, lineHeight: 1 }}>+1K</span>
              </div>
            </div>
            <div>
              <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 700, color: C.ember }}>1,000+</span>
              <span style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, marginLeft: 6, textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>people on the waitlist</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden="true">
              <path d="M2 7C5 3 9 11 14 7C19 3 23 11 26 7" stroke={C.ember} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
            <span style={{ fontFamily: C.sans, fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.14em" }}>Real thoughts. Real people.</span>
          </div>
        </div>
        </motion.div>

      </div>
    </section>
  );
}

// ── FAQSection ─────────────────────────────────────────────────
function FAQSection() {
  const { C, isDark } = useLandingTheme();
  const [open, setOpen] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="faq"
      style={{
        position: "relative",
        padding: "68px 24px 72px",
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

      {/* Toggle button — always visible */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 999,
            border: `1px solid ${isDark ? "rgba(191,96,64,0.28)" : "rgba(191,96,64,0.20)"}`,
            background: isDark ? "rgba(191,96,64,0.06)" : "rgba(191,96,64,0.05)",
            fontFamily: C.sans,
            fontSize: 14,
            color: C.ember,
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.2s, border-color 0.2s",
            marginBottom: expanded ? 28 : 0,
          }}
        >
          <span>{expanded ? "Hide questions" : "Read the FAQ"}</span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `1px solid rgba(191,96,64,0.35)`,
            fontSize: 14,
            lineHeight: 1,
            transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}>+</span>
        </button>
      </motion.div>

      {/* Collapsible FAQ list */}
      <AnimatePresence>
        {expanded && (
          <motion.dl
            key="faq-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}
          >
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 18,
                  border: `1px solid ${open === i ? (isDark ? "rgba(191,96,64,0.32)" : "rgba(168,75,42,0.28)") : C.border}`,
                  background:
                    open === i
                      ? isDark ? "rgba(191,96,64,0.07)" : "rgba(191,96,64,0.04)"
                      : isDark ? "rgba(14,50,114,0.18)" : "rgba(191,96,64,0.03)",
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
                    <span style={{ fontFamily: C.serif, fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: C.cream, lineHeight: 1.4 }}>
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
                        background: open === i ? "rgba(191,96,64,0.18)" : "rgba(191,96,64,0.05)",
                        color: open === i ? C.ember : C.muted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontFamily: C.sans,
                        transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease, background 0.2s ease, border-color 0.2s ease",
                      }}
                    >+</span>
                  </button>
                </dt>
                <div className="faq-body" data-open={open === i ? "true" : "false"}>
                  <div>
                    <p style={{ padding: "0 22px 20px", fontSize: 15, lineHeight: 1.7, color: C.muted, fontFamily: C.sans }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Link
                to="/faq"
                style={{ fontFamily: C.sans, fontSize: 14, color: C.ember, opacity: 0.8, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
              >
                See all questions →
              </Link>
            </div>
          </motion.dl>
        )}
      </AnimatePresence>
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
        padding: "72px 24px 88px",
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
          Your answers might{" "}
          <em style={{ color: C.ember, fontStyle: "italic" }}>
            already be there.
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
          ÉCHO helps you keep them long enough to hear them again.
        </motion.p>

        <motion.div
          variants={scaleUp}
          style={{ maxWidth: 480, margin: "0 auto 32px" }}
        >
          <WaitlistForm variant="hero" />
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
            src="/logo-main.svg"
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
            by RÉACLYSE
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
            { label: "About", to: "/about" as const },
            { label: "Blog", to: "/blog" as const },
            { label: "Contact", to: "/contact" as const },
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
          © 2026 ÉCHO by RÉACLYSE S.à r.l.-S. All rights reserved.
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
        <title>ÉCHO — Private Voice Journal for iPhone</title>
        <meta
          name="description"
          content="ÉCHO is a private voice journal for iPhone. One question a day, your voice recorded and encrypted on-device. Weeks later, ÉCHO surfaces what you said before the doubt set in. Launching on iOS in Europe 2026."
        />
        <link rel="canonical" href="https://www.echobyreaclyse.com/" />
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
        <SiteNav
          links={[
            { label: "How it works", anchor: "interactive-phone" },
            { label: "Privacy", anchor: "privacy" },
            { label: "FAQ", anchor: "faq" },
            { label: "Blog", to: "/blog" },
          ]}
          cta={{ label: "Join the founding waitlist", anchor: "waitlist" }}
        />
        <div id="main-content" />
        <HeroSection />
        <MarqueeStrip />
        <WhyEchoSection />
        <HowItWorksSection />
        <div id="story">
          <InteractivePhoneSection />
        </div>
        <MarqueeStrip reversed />
        <FeatureListingSection />
        <FounderSection />
        <PrivacySection />
        <PricingSection />
        <TestimonialsPlaceholder />
        <FAQSection />
        <WaitlistSection />
        <SiteFooter />
      </div>
    </ThemeCtx.Provider>
  );
}
