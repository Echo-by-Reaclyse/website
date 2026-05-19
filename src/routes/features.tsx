import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect, useCallback, createContext, useContext } from "react";
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
  { date: "8 May",        duration: "1:12", preview: "I feel most like myself when I'm walking alone early in the morning before anyone else is awake and the city..." },
  { date: "6 May",        duration: "0:38", preview: "The decision I keep delaying is the one that requires me to admit I already know the answer..." },
  { date: "4 May",        duration: "2:04", preview: "I didn't ask for space today but I needed it more than anything. The meeting felt suffocating and I stayed..." },
  { date: "30 Apr",       duration: "0:55", preview: "Something shifted this week. I noticed I'm less afraid of being wrong than I used to be..." },
];

const INSIGHTS_TRAITS = [
  { label: "Emotional range",    value: 0.82, color: "#BF6040" },
  { label: "Avoidance patterns", value: 0.45, color: "#6B8FC7" },
  { label: "Growth trajectory",  value: 0.71, color: "#BF6040" },
  { label: "Decision clarity",   value: 0.63, color: "#8FA8D4" },
  { label: "Authenticity index", value: 0.88, color: "#BF6040" },
];

const WAVE_HEIGHTS = Array.from({ length: 32 }, (_, i) =>
  Math.abs(Math.sin(i * 0.68) * 14 + Math.cos(i * 1.31) * 9) + 6
);

const CHAPTER_TEXT = [
  { eyebrow: "01 — The Question",  headline: "Every day,\none question.",        body: "No blank page. No pressure to perform. One question, crafted for honest reflection. Tap. Speak. Done.",                                                           detail: "Rotates from 200+ questions written for self-reflection." },
  { eyebrow: "02 — You Speak",     headline: "Speak freely.\nNo typing.",        body: "30 seconds or 10 minutes. Your voice captures what your fingers can't — raw and unfiltered.",                                                                       detail: "Works completely offline. Nothing leaves your device." },
  { eyebrow: "03 — It Transcribes",headline: "Your words,\nback to you.",        body: "WhisperKit processes your voice entirely on-device. No server. No human. No one listening.",                                                                        detail: "Encrypted at rest. Never used for training. Never shared." },
  { eyebrow: "04 — The Journal",   headline: "Every word\nyou've ever said.",    body: "Search, browse, revisit. Your complete history of reflections — private, encrypted, yours.",                                                                         detail: "Up to 30 days free. Unlimited history with subscription." },
  { eyebrow: "05 — Patterns Emerge",headline: "See yourself\nclearly.",          body: "Over weeks, ÉCHO builds a picture of your emotional patterns, recurring themes, and growth arc — all in your own words.",                                            detail: "8-point persona profile updated with every entry." },
  { eyebrow: "06 — Time Capsule",  headline: "Six months later,\nsame question.",body: "ÉCHO seals your words and returns them when enough time has passed. Compare who you were to who you are now.",                                                       detail: "Letters unlock automatically. No gamification. Just truth." },
];

type ScreenType = "question" | "recording" | "transcript" | "journal" | "insights" | "letters";
const CHAPTER_SCREENS: ScreenType[] = ["question", "recording", "transcript", "journal", "insights", "letters"];

// ─── Theme ─────────────────────────────────────────────────────────────────

const C_DARK = {
  bg:     "#0A1220",
  cream:  "rgba(255,246,233,0.92)",
  muted:  "rgba(255,246,233,0.45)",
  peach:  "rgba(255,228,184,0.65)",
  ember:  "#BF6040",
  card:   "rgba(14,50,114,0.35)",
  border: "rgba(255,228,184,0.09)",
  serif:  "Georgia, 'Times New Roman', serif",
  sans:   "Inter, ui-sans-serif, system-ui, sans-serif",
  navBg:  "rgba(10,18,32,0.82)",
  shadow: "rgba(0,0,0,0.55)",
};

const C_LIGHT = {
  bg:     "#FFF6E9",
  cream:  "rgba(26,15,5,0.9)",
  muted:  "rgba(26,15,5,0.5)",
  peach:  "rgba(191,96,64,0.85)",
  ember:  "#BF6040",
  card:   "rgba(191,96,64,0.07)",
  border: "rgba(26,15,5,0.1)",
  serif:  "Georgia, 'Times New Roman', serif",
  sans:   "Inter, ui-sans-serif, system-ui, sans-serif",
  navBg:  "rgba(255,246,233,0.88)",
  shadow: "rgba(0,0,0,0.18)",
};

// Phone screen is always dark (represents the real app)
const C_PHONE = C_DARK;

type Theme = typeof C_DARK;
const ThemeCtx = createContext<{ C: Theme; isDark: boolean }>({ C: C_DARK, isDark: true });
const useTheme = () => useContext(ThemeCtx);

// ─── Hooks ──────────────────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useScrollReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: "-60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { ref, visible };
}

// ─── Stagger helper ────────────────────────────────────────────────────────
// Returns inline styles that create a CSS-only stagger entrance.
// phase "entering" = instant jump to hidden; phase "visible" = staggered transition in.

type PanelPhase = "visible" | "exiting" | "entering";

function staggerStyle(index: number, phase: PanelPhase, reduced: boolean): React.CSSProperties {
  if (reduced) return {};
  const delay = `${index * 90}ms`;
  if (phase === "visible") {
    return {
      opacity: 1,
      transform: "translateY(0)",
      filter: "blur(0px)",
      transition: `opacity 0.52s ${delay} cubic-bezier(0.22,1,0.36,1), transform 0.52s ${delay} cubic-bezier(0.22,1,0.36,1), filter 0.52s ${delay} cubic-bezier(0.22,1,0.36,1)`,
    };
  }
  if (phase === "entering") {
    return { opacity: 0, transform: "translateY(20px)", filter: "blur(6px)", transition: "none" };
  }
  // exiting
  return {
    opacity: 0,
    transform: "translateY(-10px)",
    filter: "blur(4px)",
    transition: "opacity 0.16s ease-in, transform 0.16s ease-in, filter 0.16s ease-in",
  };
}

// ─── iPhone Frame ───────────────────────────────────────────────────────────
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  const W = 290, H = 630, br = 50, screenInset = 10, screenBr = 42;
  const diW = 110, diH = 32, diTop = 13, diR = 16;
  const btnW = 4, btnR = 3;

  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>
      <div aria-hidden style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", width: W * 0.75, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(191,96,64,0.35), transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
      <div style={{ position: "relative", width: W, height: H, borderRadius: br, background: "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 45%, #101012 100%)", boxShadow: `0 70px 110px -20px rgba(0,0,0,0.8), 0 28px 48px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -1px 0 rgba(0,0,0,0.7), inset 1px 0 0 rgba(255,255,255,0.065), inset -1px 0 0 rgba(255,255,255,0.065)`, overflow: "visible" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: br, background: "linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 38%, transparent 62%, rgba(255,255,255,0.04) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: screenInset, left: screenInset, right: screenInset, bottom: screenInset, borderRadius: screenBr, background: C_PHONE.bg, overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: diTop, left: "50%", transform: "translateX(-50%)", width: diW, height: diH, borderRadius: diR, background: "#000", zIndex: 20 }} />
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(to bottom, rgba(255,255,255,0.028), transparent)", pointerEvents: "none", zIndex: 1 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>{children}</div>
          <div aria-hidden style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 110, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.2)", zIndex: 20 }} />
        </div>
        <div aria-hidden style={{ position: "absolute", right: -btnW + 1, top: 130, width: btnW, height: 66, borderRadius: `0 ${btnR}px ${btnR}px 0`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 78,  width: btnW, height: 24, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 112, width: btnW, height: 40, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
        <div aria-hidden style={{ position: "absolute", left: -btnW + 1, top: 162, width: btnW, height: 60, borderRadius: `${btnR}px 0 0 ${btnR}px`, background: "linear-gradient(180deg,#3A3A3C,#2C2C2E)" }} />
      </div>
    </div>
  );
}

// ─── Status Bar ─────────────────────────────────────────────────────────────
function StatusBar() {
  const C = C_PHONE;
  return (
    <div style={{ paddingTop: 56, paddingLeft: 22, paddingRight: 22, paddingBottom: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ color: "rgba(255,246,233,0.75)", fontSize: 13, fontWeight: 600, fontFamily: C.sans }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <svg width={16} height={12} viewBox="0 0 16 12" fill="none"><rect x="0" y="4.5" width="3" height="7.5" rx="0.8" fill="rgba(255,246,233,0.4)" /><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.8" fill="rgba(255,246,233,0.65)" /><rect x="9" y="0.5" width="3" height="11.5" rx="0.8" fill="rgba(255,246,233,0.9)" /></svg>
        <svg width={15} height={11} viewBox="0 0 15 11" fill="none"><path d="M7.5 8.5a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z" fill="rgba(255,246,233,0.9)" /><path d="M4 6.2C5 5.1 6.2 4.5 7.5 4.5s2.5.6 3.5 1.7" stroke="rgba(255,246,233,0.65)" strokeWidth="1.2" strokeLinecap="round" fill="none" /><path d="M1.4 3.8C3.1 1.9 5.2 1 7.5 1S11.9 1.9 13.6 3.8" stroke="rgba(255,246,233,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" /></svg>
        <svg width={24} height={12} viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="3.5" stroke="rgba(255,246,233,0.38)" /><rect x="2" y="2" width="16" height="8" rx="2" fill="rgba(255,246,233,0.85)" /><path d="M22 4v4c.9-.4 1.5-1 1.5-2s-.6-1.6-1.5-2z" fill="rgba(255,246,233,0.38)" /></svg>
      </div>
    </div>
  );
}

// ─── Waveform bars — CSS keyframe animation ─────────────────────────────────
function WaveBars({ active }: { active: boolean }) {
  const C = C_PHONE;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 44, padding: "0 6px" }}>
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: active ? C.ember : "rgba(255,228,184,0.18)",
            transformOrigin: "center",
            ...(active
              ? {
                  animation: `featBarPulse ${(0.72 + (i % 5) * 0.11).toFixed(2)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.035).toFixed(3)}s`,
                  opacity: 0.85,
                  // vary amplitude via scaleY range baked into a custom property
                  ["--bar-peak" as string]: (h / 7).toFixed(2),
                }
              : { transform: "scaleY(0.25)", opacity: 0.25, transition: "transform 0.35s ease, opacity 0.35s ease" }),
          }}
        />
      ))}
    </div>
  );
}

// ─── Phone Screens ──────────────────────────────────────────────────────────
// All internal animations offset by ~350ms so they start after PhoneScreen wrapper fades in.

function QuestionScreen() {
  const C = C_PHONE;
  const [qi, setQi] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setQi((q) => (q + 1) % QUESTIONS.length); setVis(true); }, 380);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, padding: "0 4px" }}>
        <span style={{ fontFamily: C.serif, fontSize: 11, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>Saturday, 9 May</span>
      </div>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 10, fontFamily: C.sans }}>Today's question</p>
      <div style={{ minHeight: 76, marginBottom: 20 }}>
        <p style={{ fontFamily: C.serif, fontSize: 17, color: C.cream, lineHeight: 1.45, whiteSpace: "pre-line", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(-6px)", transition: "opacity 0.38s ease, transform 0.38s ease" }}>
          {QUESTIONS[qi]}
        </p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, height: 56, marginBottom: 18, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WaveBars active={false} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none"><path d="M7 2L2 5l5 3" stroke="rgba(255,228,184,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(145deg,#D47040,#BF6040)", boxShadow: "0 8px 20px rgba(191,96,64,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 17, height: 17, borderRadius: "50%", background: "rgba(255,246,233,0.95)" }} />
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none"><path d="M3 2l5 3-5 3" stroke="rgba(255,228,184,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

function RecordingScreen() {
  const C = C_PHONE;
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(id); }, []);
  const mins = Math.floor(t / 60);
  const secs = (t % 60).toString().padStart(2, "0");

  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: C.serif, fontSize: 11, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.ember, animation: "featBlink 1.1s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, color: C.ember, fontFamily: C.sans }}>Recording</span>
        </div>
      </div>
      <div style={{ marginBottom: 14, padding: "10px 13px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, marginBottom: 4, fontFamily: C.sans }}>Today's question</p>
        <p style={{ fontFamily: C.serif, fontSize: 13, color: C.cream, lineHeight: 1.4 }}>What are you avoiding telling yourself?</p>
      </div>
      <div style={{ background: C.card, border: "1px solid rgba(191,96,64,0.3)", borderRadius: 14, height: 68, marginBottom: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(191,96,64,0.08) inset" }}>
        <WaveBars active />
      </div>
      <p style={{ textAlign: "center", fontFamily: C.serif, fontSize: 20, color: C.cream, marginBottom: 16 }}>{mins}:{secs}</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", animation: "featPulseScale 2.2s ease-in-out infinite" }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "rgba(191,96,64,0.18)" }} />
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(145deg,#D47040,#BF6040)", boxShadow: "0 8px 24px rgba(191,96,64,0.5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(255,246,233,0.95)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptScreen() {
  const C = C_PHONE;
  const transcript = "What I keep avoiding is the conversation about whether I actually want this. Not whether I'm capable — I know I am. But whether it's what I want.";
  const words = transcript.split(" ");

  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: C.serif, fontSize: 11, letterSpacing: "0.18em", color: C.peach, textTransform: "uppercase" }}>ÉCHO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="rgba(255,228,184,0.45)" /><path d="M3 5l1.5 1.5L7 3.5" stroke="rgba(255,228,184,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>Saved</span>
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 15px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
          <p style={{ fontSize: 10, color: C.peach, fontFamily: C.sans }}>9 May 2026</p>
          <p style={{ fontSize: 10, color: C.muted, fontFamily: C.sans }}>0:47</p>
        </div>
        <div style={{ fontSize: 12, color: C.cream, lineHeight: 1.6, fontFamily: C.sans }}>
          {words.map((word, i) => (
            <span key={i} style={{ display: "inline", opacity: 0, animation: `featWordIn 0.25s ease both`, animationDelay: `${0.35 + i * 0.022}s` }}>
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 11px", background: "rgba(27,77,168,0.18)", borderRadius: 10, border: "1px solid rgba(27,77,168,0.3)" }}>
        <svg width={11} height={13} viewBox="0 0 11 13" fill="none"><path d="M5.5 0L0 2.7V7c0 3 2.4 5.8 5.5 6.3C8.6 12.8 11 10 11 7V2.7L5.5 0z" fill="rgba(255,228,184,0.12)" stroke="rgba(255,228,184,0.45)" strokeWidth="0.7" /><path d="M3.5 6.5l1.4 1.4L8 4.5" stroke="rgba(255,228,184,0.65)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontSize: 9, color: C.muted, fontFamily: C.sans }}>On-device · Encrypted at rest · Never shared</span>
      </div>
    </div>
  );
}

function JournalScreen() {
  const C = C_PHONE;
  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontFamily: C.serif, fontSize: 19, color: C.cream }}>Journal</p>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,228,184,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={13} height={13} viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,228,184,0.5)" strokeWidth="1.1" /><path d="M8.5 8.5L11 11" stroke="rgba(255,228,184,0.5)" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {JOURNAL_ENTRIES.map((entry, i) => (
          <div key={i} style={{ background: i === 0 ? "rgba(191,96,64,0.1)" : C.card, border: `1px solid ${i === 0 ? "rgba(191,96,64,0.28)" : C.border}`, borderRadius: 12, padding: "9px 13px", opacity: 0, animation: `featFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${0.35 + i * 0.08}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <p style={{ fontSize: 9, color: i === 0 ? C.ember : C.muted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: C.sans }}>{entry.date}</p>
              <p style={{ fontSize: 9, color: C.muted, fontFamily: C.sans }}>{entry.duration}</p>
            </div>
            <p style={{ fontSize: 11, color: C.cream, lineHeight: 1.5, fontFamily: C.sans, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{entry.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsScreen() {
  const C = C_PHONE;
  return (
    <div style={{ height: "100%", padding: "0 20px", background: C.bg }}>
      <StatusBar />
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: C.serif, fontSize: 19, color: C.cream, marginBottom: 3 }}>Insights</p>
        <p style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: C.sans }}>Week 12 · 47 entries</p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 15px", marginBottom: 12 }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.peach, marginBottom: 13, fontFamily: C.sans }}>Your echo profile</p>
        {INSIGHTS_TRAITS.map((trait, i) => (
          <div key={i} style={{ marginBottom: i < INSIGHTS_TRAITS.length - 1 ? 11 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <p style={{ fontSize: 10, color: C.cream, fontFamily: C.sans }}>{trait.label}</p>
              <p style={{ fontSize: 10, color: trait.color, fontFamily: C.sans }}>{Math.round(trait.value * 100)}%</p>
            </div>
            <div style={{ height: 3.5, borderRadius: 2, background: "rgba(255,228,184,0.09)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${trait.color}, ${trait.color}99)`, ["--bar-target" as string]: `${trait.value * 100}%`, animation: `featBarFill 0.75s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${0.35 + i * 0.14 + 0.25}s` } as React.CSSProperties} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(191,96,64,0.09)", border: "1px solid rgba(191,96,64,0.22)", borderRadius: 12, padding: "11px 13px", opacity: 0, animation: `featFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: "1.2s" }}>
        <p style={{ fontSize: 9, color: C.ember, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: C.sans }}>Recurring theme</p>
        <p style={{ fontSize: 11, color: C.cream, lineHeight: 1.5, fontFamily: C.sans }}>"Avoidance of vulnerability" appears in 8 of your last 12 entries.</p>
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
        <p style={{ fontFamily: C.serif, fontSize: 19, color: C.cream, marginBottom: 3 }}>Letters</p>
        <p style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: C.sans }}>Time capsules</p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "18px 16px", marginBottom: 12, textAlign: "center", opacity: 0, animation: "featFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.35s" }}>
        <svg width={46} height={34} viewBox="0 0 46 34" fill="none" style={{ display: "block", margin: "0 auto 10px" }}>
          <rect x="1" y="1" width="44" height="32" rx="5" stroke="rgba(255,228,184,0.28)" strokeWidth="1.4" fill="rgba(14,50,114,0.45)" />
          <path d="M1 6l22 15L45 6" stroke="rgba(255,228,184,0.42)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M1 27L15 17" stroke="rgba(255,228,184,0.18)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M45 27L31 17" stroke="rgba(255,228,184,0.18)" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
        <p style={{ fontFamily: C.serif, fontSize: 14, color: C.cream, marginBottom: 4 }}>November → May</p>
        <p style={{ fontSize: 10, color: C.muted, marginBottom: 14, fontFamily: C.sans }}>6 months apart</p>
        <div style={{ background: "rgba(191,96,64,0.14)", border: "1px solid rgba(191,96,64,0.28)", borderRadius: 9, padding: "7px 12px" }}>
          <p style={{ fontSize: 11, color: C.ember, fontFamily: C.sans }}>Unlocked · Read your evolution →</p>
        </div>
      </div>
      <div style={{ background: "rgba(27,77,168,0.15)", border: "1px solid rgba(27,77,168,0.28)", borderRadius: 12, padding: "11px 14px", opacity: 0, animation: "featFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.65s" }}>
        <p style={{ fontSize: 9, color: "rgba(107,143,199,0.9)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 6, fontFamily: C.sans }}>6 months ago, you wrote</p>
        <p style={{ fontSize: 11, color: C.cream, lineHeight: 1.6, fontStyle: "italic", fontFamily: C.sans }}>"I don't know if I'm brave enough to leave..."</p>
        <div style={{ height: 1, background: C.border, margin: "9px 0" }} />
        <p style={{ fontSize: 9, color: C.ember, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4, fontFamily: C.sans }}>Today, you know</p>
        <p style={{ fontSize: 11, color: C.cream, lineHeight: 1.5, fontFamily: C.sans }}>You were. You did.</p>
      </div>
    </div>
  );
}

// ─── PhoneScreen — phase state machine for crossfade ───────────────────────
function PhoneScreen({ screen }: { screen: ScreenType }) {
  const [displayed, setDisplayed] = useState<ScreenType>(screen);
  const [phase, setPhase] = useState<"visible" | "exiting" | "entering">("visible");
  const phaseRef = useRef<"visible" | "exiting" | "entering">("visible");
  const pendingRef = useRef<ScreenType | null>(null);
  const reduced = usePrefersReducedMotion();

  const applyChange = useCallback((next: ScreenType) => {
    phaseRef.current = "exiting";
    setPhase("exiting");
    setTimeout(() => {
      setDisplayed(next);
      phaseRef.current = "entering";
      setPhase("entering");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        phaseRef.current = "visible";
        setPhase("visible");
        if (pendingRef.current !== null) {
          const queued = pendingRef.current;
          pendingRef.current = null;
          applyChange(queued);
        }
      }));
    }, 200);
  }, []);

  useEffect(() => {
    if (screen === displayed && phaseRef.current === "visible") return;
    if (phaseRef.current !== "visible") { pendingRef.current = screen; return; }
    applyChange(screen);
  }, [screen, displayed, applyChange]);

  const wrapStyle: React.CSSProperties = reduced ? {} : {
    position: "absolute",
    inset: 0,
    opacity: phase === "visible" ? 1 : 0,
    transform: `scale(${phase === "visible" ? 1 : phase === "entering" ? 0.96 : 1.02})`,
    transition: phase === "visible"
      ? "opacity 0.42s cubic-bezier(0.22,1,0.36,1), transform 0.42s cubic-bezier(0.22,1,0.36,1)"
      : phase === "entering" ? "none"
      : "opacity 0.18s ease-in, transform 0.18s ease-in",
  };

  return (
    <div style={{ position: "absolute", inset: 0, ...wrapStyle }}>
      {displayed === "question"   && <QuestionScreen />}
      {displayed === "recording"  && <RecordingScreen />}
      {displayed === "transcript" && <TranscriptScreen />}
      {displayed === "journal"    && <JournalScreen />}
      {displayed === "insights"   && <InsightsScreen />}
      {displayed === "letters"    && <LettersScreen />}
    </div>
  );
}

// ─── Story Section — scroll detection + CSS stagger ────────────────────────
function StorySection() {
  const { C, isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const N = CHAPTER_TEXT.length;

  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<PanelPhase>("visible");
  const phaseRef = useRef<PanelPhase>("visible");
  const pendingRef = useRef<number | null>(null);
  const chapterRef = useRef(0);

  const ambientColors = isDark
    ? ["rgba(27,77,168,0.16)", "rgba(191,96,64,0.14)", "rgba(14,50,114,0.14)", "rgba(27,77,168,0.13)", "rgba(191,96,64,0.12)", "rgba(107,143,199,0.15)"]
    : ["rgba(191,96,64,0.08)", "rgba(191,96,64,0.12)", "rgba(191,96,64,0.06)", "rgba(27,77,168,0.06)", "rgba(191,96,64,0.10)", "rgba(107,143,199,0.09)"];

  const applyChange = useCallback((next: number) => {
    phaseRef.current = "exiting";
    setPhase("exiting");
    setTimeout(() => {
      setDisplayed(next);
      phaseRef.current = "entering";
      setPhase("entering");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        phaseRef.current = "visible";
        setPhase("visible");
        if (pendingRef.current !== null && pendingRef.current !== next) {
          const queued = pendingRef.current;
          pendingRef.current = null;
          applyChange(queued);
        } else {
          pendingRef.current = null;
        }
      }));
    }, 180);
  }, []);

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
        if (phaseRef.current !== "visible") { pendingRef.current = c; return; }
        applyChange(c);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [N, applyChange]);

  const ct = CHAPTER_TEXT[displayed];
  const screen = CHAPTER_SCREENS[displayed];

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
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Ambient color shift — CSS transition */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: ambientColors[displayed], transition: "background 0.7s ease-in-out" }} />

        {/* Progress dots */}
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 10, zIndex: 20 }}>
          {CHAPTER_TEXT.map((_, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", transform: `scale(${i === displayed ? 1.5 : 1})`, opacity: i === displayed ? 1 : 0.3, background: i === displayed ? C.ember : (isDark ? "rgba(255,228,184,0.4)" : "rgba(26,15,5,0.25)"), transition: "transform 0.28s ease, opacity 0.28s ease, background 0.28s ease" }} />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: isDark ? "rgba(255,228,184,0.08)" : "rgba(26,15,5,0.08)", zIndex: 20 }}>
          <div style={{ height: "100%", background: C.ember, borderRadius: 1, width: `${((displayed + 1) / N) * 100}%`, transition: "width 0.4s ease-out" }} />
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14 w-full max-w-[1100px] px-6 lg:px-10" style={{ minWidth: 0 }}>

          {/* Left panel */}
          <div className="hidden lg:block" style={{ overflow: "hidden" }}>
            <div>
              {([
                <p key="ey" style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.ember, marginBottom: 16, fontFamily: C.sans, ...staggerStyle(0, phase, reduced) }}>{ct.eyebrow}</p>,
                <h2 key="hl" style={{ fontFamily: C.serif, fontSize: "clamp(1.9rem, 3.2vw, 3rem)", color: C.cream, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 18, whiteSpace: "pre-line" as const, ...staggerStyle(1, phase, reduced) }}>{ct.headline}</h2>,
                <p key="bd" style={{ fontSize: 16, color: isDark ? "rgba(255,246,233,0.68)" : "rgba(26,15,5,0.65)", lineHeight: 1.7, marginBottom: 14, maxWidth: 360, ...staggerStyle(2, phase, reduced) }}>{ct.body}</p>,
                <p key="dt" style={{ fontSize: 13, color: isDark ? "rgba(255,228,184,0.42)" : "rgba(26,15,5,0.4)", lineHeight: 1.6, ...staggerStyle(3, phase, reduced) }}>{ct.detail}</p>,
              ])}
            </div>
          </div>

          {/* Center: iPhone */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div className="block lg:hidden text-center">
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.ember, marginBottom: 6, fontFamily: C.sans }}>{ct.eyebrow}</p>
              <p style={{ fontFamily: C.serif, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: C.cream, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{ct.headline}</p>
            </div>
            <IPhoneFrame>
              <PhoneScreen screen={screen} />
            </IPhoneFrame>
          </div>

          {/* Right panel */}
          <div className="hidden lg:flex flex-col gap-5" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Meter */}
              <div style={staggerStyle(0, phase, reduced)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: isDark ? "rgba(255,228,184,0.3)" : "rgba(26,15,5,0.35)", fontFamily: C.sans }}>Feature</p>
                  <p style={{ fontSize: 11, color: isDark ? "rgba(255,228,184,0.3)" : "rgba(26,15,5,0.35)", fontFamily: C.sans }}>{displayed + 1} / {N}</p>
                </div>
                <div style={{ height: 2, background: isDark ? "rgba(255,228,184,0.09)" : "rgba(26,15,5,0.09)", borderRadius: 1 }}>
                  <div style={{ height: "100%", background: C.ember, borderRadius: 1, width: `${((displayed + 1) / N) * 100}%`, transition: "width 0.38s ease-out" }} />
                </div>
              </div>

              {/* Side card */}
              {sideCards[displayed].map((card, i) => (
                <div key={i} style={{ padding: "16px 18px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, ...staggerStyle(1 + i, phase, reduced) }}>
                  <span style={{ fontSize: 22, display: "block", marginBottom: 10, color: isDark ? "rgba(255,228,184,0.6)" : "rgba(26,15,5,0.5)" }}>{card.icon}</span>
                  <p style={{ fontSize: 13, color: isDark ? "rgba(255,246,233,0.6)" : "rgba(26,15,5,0.6)", lineHeight: 1.55, fontFamily: C.sans }}>{card.text}</p>
                </div>
              ))}

              {/* Scroll hint */}
              <p style={{ fontSize: 11, color: isDark ? "rgba(255,228,184,0.25)" : "rgba(26,15,5,0.3)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: C.sans, ...staggerStyle(2, phase, reduced) }}>
                ↓ Keep scrolling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function ShowcaseHero() {
  const { C, isDark } = useTheme();

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "130px 24px 80px" }}>
      <div aria-hidden className="blob-float-1 pointer-events-none absolute" style={{ left: "4%", top: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,96,64,0.28), transparent 70%)", filter: "blur(55px)", opacity: isDark ? 0.42 : 0.28 }} />
      <div aria-hidden className="blob-float-2 pointer-events-none absolute" style={{ right: "2%", top: "22%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,77,168,0.38), transparent 70%)", filter: "blur(55px)", opacity: isDark ? 0.32 : 0.18 }} />

      <div className="relative z-10 text-center w-full">
        {/* Badge */}
        <div style={{ marginBottom: 30, animation: "heroFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 999, border: `1px solid ${isDark ? "rgba(255,228,184,0.22)" : "rgba(191,96,64,0.3)"}`, background: isDark ? "rgba(255,228,184,0.05)" : "rgba(191,96,64,0.06)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: isDark ? "rgba(255,228,184,0.75)" : "rgba(26,15,5,0.6)", backdropFilter: "blur(8px)", fontFamily: C.sans }}>
            <span className="badge-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.ember, display: "inline-block" }} />
            ÉCHO for iPhone · European launch 2026
          </span>
        </div>

        {/* Headline */}
        {["The journal", "that listens."].map((line, li) => (
          <div key={line} style={{ overflow: "hidden" }}>
            <h1 className="hero-word" style={{ animationDelay: `${0.14 + li * 0.1}s`, fontFamily: C.serif, fontSize: "clamp(3.2rem, 10vw, 6.8rem)", letterSpacing: "-0.03em", lineHeight: 0.96, color: li === 0 ? C.cream : C.ember, display: "block", marginBottom: li === 0 ? 6 : 0 }}>
              {line}
            </h1>
          </div>
        ))}

        <p style={{ marginTop: 26, fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: isDark ? "rgba(255,246,233,0.62)" : "rgba(26,15,5,0.58)", maxWidth: 460, lineHeight: 1.68, margin: "26px auto 0", fontFamily: C.sans, animation: "heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.48s both" }}>
          One question. Your voice. Encrypted on your iPhone.
          <br />Returned to you when you need it most.
        </p>

        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "heroFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.1s both" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.22em", color: isDark ? "rgba(255,228,184,0.3)" : "rgba(26,15,5,0.3)", fontFamily: C.sans }}>Scroll to explore</p>
          <svg className="phone-float" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animationDuration: "1.9s" }}><path d="M9 3v11M4 10l5 5 5-5" stroke={isDark ? "rgba(255,228,184,0.38)" : "rgba(26,15,5,0.38)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* Floating phone */}
      <div className="phone-float" style={{ marginTop: 56, position: "relative", zIndex: 5, animationDelay: "0.38s", animation: "heroFadeUp 0.95s cubic-bezier(0.22,1,0.36,1) 0.38s both, phoneFloat 4.8s ease-in-out 1.4s infinite" }}>
        <IPhoneFrame>
          <QuestionScreen />
        </IPhoneFrame>
      </div>
    </section>
  );
}

// ─── Privacy Section ─────────────────────────────────────────────────────────
const PRIVACY = [
  { icon: "▣", title: "On-device transcription", body: "WhisperKit runs entirely on your iPhone. Your audio never travels to any server, ever." },
  { icon: "◆", title: "Encrypted at rest",       body: "Every entry encrypted with device-level keys. No one — not even Réaclyse — can read them." },
  { icon: "⊗", title: "Zero data sharing",        body: "Your voice is never used to train AI. Never sold. Never monetised in any form." },
  { icon: "☁", title: "iCloud sync on your terms",body: "CloudKit keeps your devices in sync using Apple's encrypted infrastructure. Your keys." },
];

function PrivacySection() {
  const { C, isDark } = useTheme();
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} style={{ position: "relative", overflow: "hidden", padding: "120px 24px 100px" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: isDark ? "radial-gradient(circle, rgba(27,77,168,0.18), transparent 65%)" : "radial-gradient(circle, rgba(191,96,64,0.1), transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 920, margin: "0 auto", position: "relative" }}>
        <div className={`reveal${visible ? " is-visible" : ""}`} style={{ textAlign: "center", marginBottom: 68 }}>
          <p style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.24em", color: C.ember, marginBottom: 14, fontFamily: C.sans }}>Privacy by design</p>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2.4rem, 6vw, 4.4rem)", letterSpacing: "-0.025em", color: C.cream, lineHeight: 1.1, marginBottom: 18 }}>
            On your iPhone.{" "}<br /><em style={{ color: C.ember, fontStyle: "italic" }}>Nowhere else.</em>
          </h2>
          <p style={{ fontSize: 17, color: isDark ? "rgba(255,246,233,0.58)" : "rgba(26,15,5,0.55)", maxWidth: 460, margin: "0 auto", lineHeight: 1.68, fontFamily: C.sans }}>
            Your voice is the most intimate thing you share. ÉCHO treats it accordingly.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PRIVACY.map((p, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1}${visible ? " is-visible" : ""}`} style={{ padding: "24px 22px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 14, color: isDark ? "rgba(255,228,184,0.55)" : "rgba(26,15,5,0.4)" }}>{p.icon}</span>
              <h3 style={{ fontFamily: C.serif, fontSize: 17, color: C.cream, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: isDark ? "rgba(255,246,233,0.56)" : "rgba(26,15,5,0.55)", lineHeight: 1.62, fontFamily: C.sans }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const { isDark } = useTheme();
  const items = ["ONE QUESTION", "YOUR VOICE", "ON-DEVICE", "ENCRYPTED", "PRIVATE", "OFFLINE-FIRST", "YOUR WORDS"];
  const track = items.map((i) => `${i}  ·  `).join("");
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: isDark ? "rgba(255,228,184,0.08)" : "rgba(26,15,5,0.1)" }}>
      <div className="marquee-track font-display text-[10px] uppercase tracking-[0.24em] whitespace-nowrap" style={{ color: isDark ? "rgba(255,228,184,0.26)" : "rgba(26,15,5,0.28)" }}>
        {track}{track}{track}{track}
      </div>
    </div>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function ShowcaseCTA() {
  const { C, isDark } = useTheme();
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} id="waitlist" style={{ padding: "100px 24px 140px", textAlign: "center" }}>
      <div className={`reveal${visible ? " is-visible" : ""}`}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: "-0.02em", color: C.cream, lineHeight: 1.15, marginBottom: 14 }}>
          The first voice you should trust<br />
          <em style={{ color: C.ember, fontStyle: "italic" }}>is yours.</em>
        </h2>
        <p style={{ fontSize: 16, color: isDark ? "rgba(255,246,233,0.56)" : "rgba(26,15,5,0.55)", marginBottom: 40, fontFamily: C.sans }}>
          Join the waitlist. Founding-member pricing at launch.
        </p>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <WaitlistForm variant="footer" />
        </div>
      </div>
    </section>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function ShowcaseNav({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const { C } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 50, transition: "all 0.3s", backdropFilter: scrolled ? "blur(18px)" : "none", background: scrolled ? C.navBg : "transparent", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none" }}>
          <span style={{ fontFamily: C.serif, fontSize: 22, letterSpacing: "-0.01em", color: C.cream }}>ÉCHO</span>
          <span style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.18em", color: isDark ? "rgba(255,246,233,0.38)" : "rgba(26,15,5,0.4)", fontFamily: C.sans }}>by Réaclyse</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Light/dark toggle */}
          <button
            onClick={onToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: 36, height: 20, borderRadius: 10, border: `1px solid ${C.border}`, background: isDark ? "rgba(255,228,184,0.1)" : "rgba(26,15,5,0.1)", cursor: "pointer", position: "relative", transition: "background 0.25s ease", flexShrink: 0 }}
          >
            <div style={{ position: "absolute", top: 3, left: isDark ? 3 : 17, width: 12, height: 12, borderRadius: "50%", background: C.ember, transition: "left 0.25s cubic-bezier(0.22,1,0.36,1)" }} />
          </button>
          <a href="#waitlist" style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: isDark ? "rgba(255,246,233,0.55)" : "rgba(26,15,5,0.5)", textDecoration: "none", fontFamily: C.sans, transition: "color 0.2s" }}>
            Join waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function ShowcasePage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const C = isDark ? C_DARK : C_LIGHT;

  return (
    <ThemeCtx.Provider value={{ C, isDark }}>
      <div style={{ background: C.bg, color: C.cream, minHeight: "100vh", overflowX: "clip", transition: "background 0.4s ease, color 0.4s ease" }}>
        <title>ÉCHO — See how it works | Réaclyse</title>
        <meta name="description" content="See how ÉCHO works: one daily question, voice recording, on-device transcription, pattern insights, and time capsule letters. Private voice journaling for iPhone." />

        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
          <div className="ambient-orb-a" style={{ opacity: isDark ? 1 : 0.5 }} />
          <div className="ambient-orb-b" style={{ opacity: isDark ? 1 : 0.4 }} />
        </div>

        <ShowcaseNav isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
        <ShowcaseHero />
        <MarqueeStrip />
        <StorySection />
        <PrivacySection />
        <ShowcaseCTA />

        <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center" }}>
          <Link to="/" style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: isDark ? "rgba(255,246,233,0.35)" : "rgba(26,15,5,0.35)", textDecoration: "none", fontFamily: C.sans }}>
            ← Back to ÉCHO
          </Link>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
