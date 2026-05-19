import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

// ── IntersectionObserver reveal ────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

// ── Data ────────────────────────────────────────────────────────
const QUESTIONS = [
  "What did you need today that you didn't ask for?",
  "What are you avoiding telling yourself?",
  "Where do you feel most like yourself?",
  "What decision are you delaying?",
];

const PILLARS = [
  {
    title: "You speak.",
    body: "One question. Your voice. No typing, no blank pages. Just you, thinking out loud — the raw, honest version before the second-guessing begins.",
  },
  {
    title: "It holds.",
    body: "Encrypted. Private. Yours alone — not used for training, not shared, not monetised. Never.",
  },
  {
    title: "It returns.",
    body: "Weeks later, ÉCHO surfaces what you said before the fear set in. The words were always there. ÉCHO just kept them safe.",
  },
];

const STEPS = [
  { n: "01", title: "Record",   body: "One question appears. You speak. 30 seconds or 10 minutes." },
  { n: "02", title: "Remember", body: "ÉCHO transcribes on-device. You read your own words back. You already knew. You just forgot." },
  { n: "03", title: "Return",   body: "The words were always there. ÉCHO just kept them safe." },
];

const FEATURES = [
  { title: "Voice-first journaling",       body: "Speak naturally. On-device transcription captures every word without your audio leaving your iPhone." },
  { title: "End-to-end encrypted",         body: "Your recordings and transcripts are encrypted at rest. No one — not even us — can read your entries." },
  { title: "Emotional pattern tracking",   body: "ÉCHO builds a longitudinal picture of your emotional state, decisions, and recurring themes over months." },
  { title: "Time capsule comparisons",     body: "Compare who you were six months ago to who you are now. See how your thinking has evolved in your own words." },
  { title: "Offline-first",               body: "Record anywhere, any time. ÉCHO works without an internet connection — your entries sync when you reconnect." },
  { title: "Zero data sharing",           body: "Your voice is never used to train external AI models. Your data is never sold or shared with third parties." },
];

const FAQ_ITEMS = [
  { q: "What is ÉCHO?",               a: "ÉCHO is a private voice journal for iPhone. Every day, one question appears. You speak your answer — no typing, no blank pages. ÉCHO stores your recording and transcript encrypted on your device, then surfaces it weeks or months later so you can hear how your thinking has evolved." },
  { q: "When does ÉCHO launch?",      a: "ÉCHO launches on the iOS App Store in 2026, starting with European markets: France, Germany, Spain, Italy, Luxembourg, Belgium, the Netherlands, Austria, and Switzerland. Join the waitlist to be notified first and unlock early-access pricing." },
  { q: "Is ÉCHO available on Android?", a: "ÉCHO is iOS-only at launch (iPhone, iOS 26). Android support may come in a later phase. Join the waitlist and we'll let you know when your platform is supported." },
  { q: "How is my voice data protected?", a: "Your voice recordings and transcripts are encrypted at rest and are never used to train external AI models. Transcription happens on your device using on-device speech recognition — your audio never leaves your iPhone for that step. We never sell or share your personal data." },
  { q: "How much does ÉCHO cost?",    a: "ÉCHO is free to download. A subscription unlocks unlimited journaling history, advanced pattern insights, and time capsule comparisons. Plans start at €7.99 per month or €69 per year. Waitlist members will receive a special founding-member offer at launch." },
  { q: "How does ÉCHO work?",         a: "Three steps: (1) Open the app — one question appears. (2) Tap record and speak for 30 seconds or 10 minutes. (3) ÉCHO transcribes, stores, and analyses your entry. Over time, it identifies emotional patterns and surfaces past entries when they're most relevant to what you're going through now." },
];

// ── Hero Visualization ──────────────────────────────────────────
// Listening-orb animation: no phone chrome — concentric rings + waveform.
function HeroVisualization() {
  const [qIdx, setQIdx] = useState(0);
  const [qVisible, setQVisible] = useState(true);
  const [elapsed, setElapsed] = useState(32);

  useEffect(() => {
    const cycle = setInterval(() => {
      setQVisible(false);
      setTimeout(() => { setQIdx(q => (q + 1) % QUESTIONS.length); setQVisible(true); }, 450);
    }, 4500);
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(cycle); clearInterval(timer); };
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = (elapsed % 60).toString().padStart(2, "0");

  // Sine-pattern bar heights for a natural audio-spectrum look
  const N = 28;
  const barH = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * Math.PI * 3.6;
    return Math.max(5, Math.round(7 + Math.abs(Math.sin(t) * 22 + Math.sin(t * 1.8 + 0.6) * 10)));
  });

  return (
    <div className="relative flex flex-col items-center"
         style={{ width: "min(380px, calc(100vw - 2.5rem))" }}>

      {/* Ambient glow beneath card */}
      <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full blur-3xl"
           style={{
             width: "90%", height: 100,
             background: "radial-gradient(ellipse, rgba(191,96,64,0.3), transparent 70%)",
             animation: "glowPulse 4s ease-in-out infinite",
           }} />

      {/* Glass card */}
      <div className="relative w-full overflow-hidden rounded-[36px]"
           style={{
             padding: "30px 28px 24px",
             background: "linear-gradient(165deg, rgba(14,24,48,0.96) 0%, rgba(6,10,18,0.99) 100%)",
             border: "1px solid rgba(255,228,184,0.09)",
             boxShadow: "0 48px 96px rgba(0,0,0,0.6), 0 0 80px rgba(191,96,64,0.07), inset 0 1px 0 rgba(255,246,233,0.06)",
           }}>

        {/* Top bar: ÉCHO wordmark + REC badge */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-[10px] uppercase tracking-[0.28em]"
             style={{ color: "rgba(255,228,184,0.32)" }}>ÉCHO</p>
          <div className="flex items-center gap-1.5">
            <div className="badge-dot rounded-full" style={{ width: 6, height: 6, background: "#BF6040" }} />
            <span className="font-display text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(191,96,64,0.85)" }}>REC</span>
          </div>
        </div>

        {/* Cycling question */}
        <div className="mb-6" style={{ minHeight: 62 }}>
          <p className="font-display text-center leading-snug"
             style={{
               fontSize: "clamp(14px, 4.2vw, 17px)",
               color: "rgba(255,246,233,0.88)",
               opacity: qVisible ? 1 : 0,
               transform: qVisible ? "translateY(0)" : "translateY(-8px)",
               transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)",
             }}>
            {QUESTIONS[qIdx]}
          </p>
        </div>

        {/* Orb + expanding rings */}
        <div className="relative flex items-center justify-center mb-4" style={{ height: 156 }}>

          {/* Three staggered rings that expand outward and fade */}
          {[0, 1, 2].map(i => (
            <div key={i} aria-hidden className="orb-ring absolute rounded-full pointer-events-none"
                 style={{
                   width: 80, height: 80,
                   border: "1px solid rgba(191,96,64,0.5)",
                   animationDelay: `${i * 1.13}s`,
                 }} />
          ))}

          {/* Soft diffuse glow */}
          <div aria-hidden className="pointer-events-none absolute rounded-full blur-2xl"
               style={{
                 width: 130, height: 130,
                 background: "radial-gradient(circle, rgba(191,96,64,0.25), transparent 70%)",
                 animation: "glowPulse 3.2s ease-in-out infinite",
               }} />

          {/* Central orb */}
          <div className="orb-breathe relative flex items-center justify-center rounded-full"
               style={{
                 width: 76, height: 76,
                 background: "linear-gradient(145deg, #D97242 0%, #BF6040 55%, #9A3820 100%)",
                 boxShadow: "0 10px 40px rgba(191,96,64,0.55), 0 3px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
               }}>
            {/* Microphone icon */}
            <svg width="20" height="25" viewBox="0 0 20 25" fill="none" aria-hidden>
              <rect x="6" y="0" width="8" height="14" rx="4" fill="rgba(255,246,233,0.95)" />
              <path d="M2 10c0 4.4 3.6 8 8 8s8-3.6 8-8"
                    stroke="rgba(255,246,233,0.9)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <line x1="10" y1="18" x2="10" y2="23"
                    stroke="rgba(255,246,233,0.85)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="6" y1="23" x2="14" y2="23"
                    stroke="rgba(255,246,233,0.85)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Timer */}
        <p className="mb-4 text-center font-display text-[26px]"
           style={{ color: "rgba(255,246,233,0.88)", letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}>
          {mins}:{secs}
        </p>

        {/* Waveform bars — varied sine-pattern heights, centered scale animation */}
        <div className="flex items-center justify-center gap-[3px]" style={{ height: 40 }}>
          {barH.map((h, i) => (
            <div key={i} className="rounded-full"
                 style={{
                   width: 3,
                   height: h,
                   background: `rgba(191,96,64,${0.42 + (i % 5) * 0.09})`,
                   animation: `featBarPulse ${0.60 + (i % 8) * 0.12}s ease-in-out infinite`,
                   animationDelay: `${(i * 0.04).toFixed(3)}s`,
                 }} />
          ))}
        </div>

        {/* Home indicator */}
        <div className="mt-5 flex justify-center">
          <div className="rounded-full" style={{ width: 96, height: 4, background: "rgba(255,246,233,0.1)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Marquee ────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ["ONE QUESTION", "YOUR VOICE", "ENCRYPTED", "PRIVATE", "RETURNS", "NO TYPING", "ON-DEVICE"];
  const track = items.map((i) => `${i}  ·  `).join("");
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(255,228,184,0.09)" }}>
      <div className="marquee-track font-display text-[11px] uppercase tracking-[0.22em] whitespace-nowrap"
        style={{ color: "rgba(255,228,184,0.28)" }}>
        {track}{track}{track}{track}
      </div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────
// All entrance animations are CSS keyframes — run before JS hydration.
const H1_LINE1 = ["Hear", "your", "own"];
const H1_LINE2 = ["voice", "again."];

function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-24 sm:pb-0 sm:pt-28">
      {/* Background orbs — pure CSS blob animations */}
      <div aria-hidden
        className="blob-float-1 pointer-events-none absolute left-[8%] top-[12%] h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(191,96,64,0.35), transparent 70%)", opacity: 0.38, willChange: "transform" }}
      />
      <div aria-hidden
        className="blob-float-2 pointer-events-none absolute right-[4%] top-[28%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(27,77,168,0.5), transparent 70%)", opacity: 0.3, willChange: "transform" }}
      />
      <div aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-[28%] h-[360px] w-[360px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,228,184,0.12), transparent 70%)", opacity: 0.4 }}
      />

      {/* Badge */}
      <div className="hero-badge mb-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-peach/30 bg-peach/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-peach backdrop-blur-sm">
          <span className="badge-dot h-1.5 w-1.5 rounded-full bg-peach" />
          European launch — iOS 2026
        </span>
      </div>

      {/* Headline — word by word via CSS animation-delay */}
      <h1 className="mb-8 text-center font-display leading-[0.9] tracking-tight"
        style={{ fontSize: "clamp(2.75rem, 10.5vw, 7.25rem)" }}>
        <span className="mb-[0.04em] block">
          {H1_LINE1.map((word, i) => (
            <span key={word} className="hero-word mr-[0.2em] text-ink"
              style={{ animationDelay: `${0.18 + i * 0.075}s` }}>
              {word}
            </span>
          ))}
        </span>
        <span className="block">
          {H1_LINE2.map((word, i) => (
            <span key={word}
              className={`hero-word mr-[0.2em] ${i === 1 ? "text-gradient-ember" : "text-ink"}`}
              style={{ animationDelay: `${0.18 + (H1_LINE1.length + i) * 0.075}s` }}>
              {word}
            </span>
          ))}
        </span>
      </h1>

      {/* Subheadline + body */}
      <p className="hero-fade max-w-lg text-center font-display text-xl text-ink sm:text-2xl"
        style={{ animationDelay: "0.72s" }}>
        You already know. ÉCHO gives you the evidence.
      </p>
      <p className="hero-fade mt-3 max-w-md text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        style={{ animationDelay: "0.82s" }}>
        One question. Your voice. No typing, no blank pages.
      </p>

      {/* Waitlist form */}
      <div id="rejoindre"
        className="hero-fade mt-10 w-full max-w-md scroll-mt-24"
        style={{ animationDelay: "0.95s" }}>
        <WaitlistForm />
      </div>

      {/* Stats */}
      <div className="hero-fade mt-10 flex flex-wrap justify-center gap-5 sm:gap-10" style={{ animationDelay: "1.12s" }}>
        {[{ k: "2026", v: "Launch" }, { k: "iOS 26", v: "Platform" }, { k: "9 countries", v: "Europe first" }].map(({ k, v }) => (
          <div key={k} className="text-center">
            <p className="font-display text-base text-ink sm:text-xl">{k}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{v}</p>
          </div>
        ))}
      </div>

      {/* Hero visualization */}
      <div className="hero-fade mt-14 pb-8 sm:mt-20 sm:pb-20" style={{ animationDelay: "0.55s" }}>
        <HeroVisualization />
      </div>

      {/* Scroll cue */}
      <div className="hero-fade absolute bottom-7 left-1/2 -translate-x-1/2" style={{ animationDelay: "1.5s" }}>
        <div className="scroll-cue-line" style={{ height: 44, width: 1, background: "linear-gradient(to bottom, rgba(255,228,184,0.7), transparent)" }} />
      </div>
    </section>
  );
}

// ── Manifesto section ──────────────────────────────────────────
function ManifestoSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <h2 className="reveal font-display text-4xl text-ink sm:text-5xl">
        What ÉCHO <em className="italic text-gradient-ember">does.</em>
      </h2>
      <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <div key={p.title}
            className={`reveal reveal-delay-${i + 1} card-lift group relative overflow-hidden rounded-2xl border border-peach/10 bg-card/30 p-6 sm:p-8 backdrop-blur-sm hover:border-peach/[0.28] hover:bg-card/50`}>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--gradient-divider)" }} />
            <span aria-hidden
              className="pointer-events-none absolute right-5 top-4 font-display text-7xl font-light leading-none select-none"
              style={{ color: "rgba(255,228,184,0.04)" }}>
              0{i + 1}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">{p.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── How it works section ───────────────────────────────────────
function HowItWorksSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">How it works</p>
      <h2 className="reveal reveal-delay-1 mt-3 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
        Three taps. <em className="italic text-gradient-ember">The rest is listening.</em>
      </h2>
      <ol className="mt-12 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-0">
        {STEPS.map((step, i) => (
          <li key={step.n} className={`reveal reveal-delay-${i + 1} relative`}>
            {i < STEPS.length - 1 && (
              <div aria-hidden
                className="pointer-events-none absolute right-0 top-[22px] hidden h-px w-full translate-x-1/2 md:block"
                style={{ background: "linear-gradient(90deg, rgba(255,228,184,0.15) 0%, rgba(255,228,184,0.06) 100%)" }}
              />
            )}
            <div className="border-t border-peach/12 pt-8 md:pr-12">
              <span className="font-display text-lg text-gradient-ember">{step.n}</span>
              <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── Features section ───────────────────────────────────────────
function FeaturesSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">Features</p>
      <h2 className="reveal reveal-delay-1 mt-3 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
        Built for privacy. <em className="italic text-gradient-ember">Designed for clarity.</em>
      </h2>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {FEATURES.map((feat, i) => (
          <div key={feat.title}
            className={`reveal reveal-delay-${(i % 3) + 1} card-lift relative overflow-hidden rounded-2xl border border-peach/10 bg-card/25 p-6 sm:p-7 backdrop-blur-sm hover:border-peach/[0.26] hover:bg-card/40`}>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--gradient-divider)" }} />
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] uppercase tracking-[0.18em] text-peach font-medium"
              style={{ background: "rgba(191,96,64,0.1)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-xl text-ink">{feat.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feat.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Quote section ──────────────────────────────────────────────
function QuoteSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-32 lg:py-36">
      <div aria-hidden
        className="quote-glow pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,228,184,0.13), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="reveal font-display text-3xl text-ink sm:text-5xl lg:text-6xl">
          You said this.
          <br />
          <em className="italic text-gradient-ember">
            Six weeks before you proved it right.
          </em>
        </h2>
        <p className="reveal reveal-delay-2 mt-8 sm:mt-10 text-base text-muted-foreground sm:text-lg">
          Not what the AI thinks. What <em>you</em> said.
        </p>
      </div>
    </section>
  );
}

// ── Pricing section ────────────────────────────────────────────
function PricingSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-16 sm:py-28 text-center">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">Pricing</p>
      <h2 className="reveal reveal-delay-1 mt-3 font-display text-4xl text-ink sm:text-5xl">
        Free for the <em className="italic text-gradient-ember">first circle.</em>
      </h2>
      <div className="reveal reveal-delay-2 mt-10 inline-block w-full sm:w-auto">
        <div className="card-lift relative overflow-hidden rounded-3xl border border-peach/15 bg-card/30 p-6 sm:p-10 backdrop-blur-sm hover:border-peach/[0.28]">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "var(--gradient-divider)" }} />
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 font-display text-2xl sm:text-3xl lg:text-4xl">
            <span>
              <span className="text-gradient-ember">€7.99</span>
              <span className="ml-1 text-lg sm:text-xl text-muted-foreground">/ month</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span>
              <span className="text-gradient-ember">€69</span>
              <span className="ml-1 text-lg sm:text-xl text-muted-foreground">/ year</span>
            </span>
          </div>
          <p className="mt-5 mx-auto max-w-xs text-sm text-muted-foreground">
            Your voice. Your words. Never used for anything else.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/55">
            Waitlist members get founding-member pricing at launch.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── FAQ section — CSS grid accordion, zero JS animation ───────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-16 sm:py-28">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">FAQ</p>
      <h2 className="reveal reveal-delay-1 mt-3 font-display text-4xl text-ink sm:text-5xl">
        Questions <em className="italic text-gradient-ember">answered.</em>
      </h2>
      <dl className="mt-12 sm:mt-14 space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}
            className="reveal rounded-2xl border backdrop-blur-sm transition-colors duration-200"
            style={{
              background: "rgba(14,50,114,0.15)",
              borderColor: open === i ? "rgba(255,228,184,0.22)" : "rgba(255,228,184,0.10)",
            }}>
            <dt>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left"
              >
                <span className="font-display text-base sm:text-lg text-ink">{item.q}</span>
                <span aria-hidden
                  className="mt-1 shrink-0 text-peach text-xl leading-none transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                  +
                </span>
              </button>
            </dt>
            {/* CSS grid height animation */}
            <div className="faq-body" data-open={open === i ? "true" : "false"}>
              <div>
                <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── Final CTA section ──────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-16 sm:py-28 text-center">
      <div className="divider-gradient mb-14 sm:mb-16" />
      <h2 className="reveal font-display text-3xl sm:text-4xl lg:text-5xl text-ink">
        The first voice you should trust
        <br />
        <em className="italic text-gradient-ember">is yours.</em>
      </h2>
      <div className="reveal reveal-delay-2 mx-auto mt-10 max-w-md">
        <WaitlistForm variant="footer" />
      </div>
    </section>
  );
}

// ── Nav ────────────────────────────────────────────────────────
function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <header className={`nav-entrance fixed inset-x-0 top-0 z-30 transition-all duration-300 ${scrolled ? "nav-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 py-4 sm:py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl sm:text-2xl tracking-tight text-ink">ÉCHO</span>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            by Réaclyse
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <ThemeToggle />
          <Link to="/features"
            className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-peach">
            See it in action
          </Link>
          <a href="#rejoindre"
            className="text-xs uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-peach">
            <span className="hidden sm:inline">Join waitlist</span>
            <span className="sm:hidden">Join →</span>
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative">
      <div className="divider-gradient mx-auto max-w-6xl" />
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:px-6 py-8 sm:py-10 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="font-display text-sm text-ink">
            ÉCHO <span className="text-muted-foreground">— RÉACLYSE's journal for decisions.</span>
          </p>
          <p>© 2026 Réaclyse. Luxembourg.</p>
        </div>
        <nav aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 uppercase tracking-[0.18em]">
          <a href="https://reaclyse.com" target="_blank" rel="noreferrer noopener"
            className="transition-colors hover:text-peach">réaclyse.com</a>
          <a href="https://instagram.com/reaclyse" target="_blank" rel="noreferrer noopener"
            className="transition-colors hover:text-peach">Instagram</a>
          <Link to="/about" className="transition-colors hover:text-peach">About</Link>
          <Link to="/support" className="transition-colors hover:text-peach">Support</Link>
          <Link to="/privacy" className="transition-colors hover:text-peach">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}

// ── Landing (root) ─────────────────────────────────────────────
function Landing() {
  const revealRef = useReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div ref={revealRef} className="relative overflow-x-hidden">
      <title>ÉCHO — Private Voice Journal for iPhone | Réaclyse</title>
      <meta name="description"
        content="ÉCHO is a private voice journal for iPhone. One question a day, your voice recorded and encrypted. Weeks later, ÉCHO surfaces what you said before the doubt set in. Launching on iOS in Europe 2026." />
      <link rel="canonical" href="https://echobyreaclyse.com/" />
      <script type="application/ld+json"
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

      {/* Ambient background — fixed, behind all content, very slow GPU-only drift */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-orb-a" />
        <div className="ambient-orb-b" />
        <div className="ambient-orb-c" />
      </div>

      <Toaster richColors position="top-center" />
      <Nav scrolled={scrolled} />
      <HeroSection />
      <MarqueeStrip />
      <ManifestoSection />
      <HowItWorksSection />
      <FeaturesSection />
      <QuoteSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
