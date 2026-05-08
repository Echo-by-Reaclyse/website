import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Waveform } from "@/components/Waveform";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

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
    q: "Is ÉCHO available on Android?",
    a: "ÉCHO is iOS-only at launch (iPhone, iOS 17+). Android support may come in a later phase. Join the waitlist and we'll let you know when your platform is supported.",
  },
  {
    q: "How is my voice data protected?",
    a: "Your voice recordings and transcripts are encrypted at rest and are never used to train external AI models. Transcription happens on your device using on-device speech recognition — your audio never leaves your iPhone for that step. We never sell or share your personal data.",
  },
  {
    q: "How much does ÉCHO cost?",
    a: "ÉCHO is free to download. A subscription unlocks unlimited journaling history, advanced pattern insights, and time capsule comparisons. Plans start at €7.99 per month or €69 per year. Waitlist members will receive a special founding-member offer at launch.",
  },
  {
    q: "How does ÉCHO work?",
    a: "Three steps: (1) Open the app — one question appears. (2) Tap record and speak for 30 seconds or 10 minutes. (3) ÉCHO transcribes, stores, and analyses your entry. Over time, it identifies emotional patterns and surfaces past entries when they're most relevant to what you're going through now.",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function Landing() {
  const rootRef = useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden">
      {/* React 19: title + meta rendered in <head> automatically */}
      <title>ÉCHO — Private Voice Journal for iPhone | Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO is a private voice journal for iPhone. One question a day, your voice recorded and encrypted. Weeks later, ÉCHO surfaces what you said before the doubt set in. Launching on iOS in Europe 2026."
      />
      <link rel="canonical" href="https://echo.reaclyse.com/" />

      {/* FAQPage structured data */}
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

      <Toaster richColors position="top-center" />

      {/* Top bar */}
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          scrolled ? "nav-blur" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-tight text-ink">ÉCHO</span>
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              by Réaclyse
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#rejoindre"
              className="hidden text-xs uppercase tracking-[0.2em] text-ink/70 transition hover:text-peach sm:inline"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-40">
        <div
          aria-hidden
          className="blob-float-1 pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(191,96,64,0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="blob-float-2 pointer-events-none absolute -right-24 top-40 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,228,184,0.22), transparent 70%)" }}
        />

        <div className="relative grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-peach/30 bg-peach/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-peach">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-peach" />
              European launch — iOS 2026
            </p>
            <h1 className="reveal reveal-delay-1 font-display text-5xl leading-[0.95] text-ink sm:text-6xl md:text-7xl">
              Hear your own
              <br />
              <em className="font-display italic text-gradient-ember">voice again.</em>
            </h1>
            <p className="reveal reveal-delay-2 mt-7 max-w-xl font-display text-2xl leading-snug text-ink">
              You already know. ÉCHO gives you the evidence.
            </p>
            <p className="reveal reveal-delay-3 mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              One question. Your voice. No typing, no blank pages. Just you, thinking out loud —
              stored encrypted, surfaced back when it matters most.
            </p>

            <div id="rejoindre" className="reveal reveal-delay-4 mt-10 max-w-md scroll-mt-24">
              <WaitlistForm />
            </div>

            <dl className="reveal reveal-delay-5 mt-12 grid grid-cols-3 gap-6 pt-8">
              <div className="col-span-3 divider-gradient mb-2" />
              <Stat k="2026" v="Launch" />
              <Stat k="iOS 17+" v="Platform" />
              <Stat k="🇫🇷 🇩🇪 🇪🇸 🇮🇹" v="Europe first" />
            </dl>
          </div>

          <figure className="reveal reveal-delay-2 relative mx-auto w-full max-w-sm sm:max-w-none lg:mx-0">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
              style={{ background: "var(--gradient-ember)" }}
            />
            <div
              className="grain waveform-card relative aspect-[3/2] overflow-hidden rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(12,10,8,0.92) 0%, rgba(20,12,8,0.88) 50%, rgba(15,10,6,0.90) 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                border: "1px solid rgba(191,96,64,0.18)",
              }}
            >
              <Waveform />
            </div>
            <figcaption className="mt-3 font-display text-sm italic text-muted-foreground/60">
              "From the creator of The Return — RÉACLYSE's journal for decisions."
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative" aria-label="How ÉCHO works">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="reveal font-display text-4xl text-ink sm:text-5xl">
            What ÉCHO <em className="italic text-gradient-ember">does.</em>
          </h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            <Pillar
              delay="reveal-delay-1"
              title="You speak."
              body="One question. Your voice. No typing, no blank pages. Just you, thinking out loud — the raw, honest version before the second-guessing begins."
            />
            <Pillar
              delay="reveal-delay-2"
              title="It holds."
              body="Every word stored. Encrypted. Private. Yours alone — never used to train AI models, never shared with third parties."
            />
            <Pillar
              delay="reveal-delay-3"
              title="It returns."
              body="Weeks later, ÉCHO surfaces what you said before the fear set in. Your past self becomes evidence for your present decisions."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative" aria-label="Three steps to start journaling">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">How it works</p>
          <h2 className="reveal reveal-delay-1 mt-3 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
            Three taps. <em className="italic text-gradient-ember">The rest is listening.</em>
          </h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            <Step
              delay="reveal-delay-1"
              n="01"
              title="Record"
              body="One question appears. You speak. 30 seconds or 10 minutes — there's no wrong answer, only your honest one."
            />
            <Step
              delay="reveal-delay-2"
              n="02"
              title="Remember"
              body="ÉCHO transcribes your voice on-device. You read your own words back. You already knew. You just forgot."
            />
            <Step
              delay="reveal-delay-3"
              n="03"
              title="Return"
              body="Patterns surface. Emotions tracked. The words were always there — ÉCHO just kept them safe and brought them back."
            />
          </ol>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative" aria-label="Key features">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">Features</p>
          <h2 className="reveal reveal-delay-1 mt-3 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
            Built for privacy. <em className="italic text-gradient-ember">Designed for clarity.</em>
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="🎙️"
              title="Voice-first journaling"
              body="Speak naturally. On-device transcription captures every word without your audio leaving your iPhone."
            />
            <Feature
              icon="🔒"
              title="End-to-end encrypted"
              body="Your recordings and transcripts are encrypted at rest. No one — not even us — can read your entries."
            />
            <Feature
              icon="📈"
              title="Emotional pattern tracking"
              body="ÉCHO builds a longitudinal picture of your emotional state, decisions, and recurring themes over months."
            />
            <Feature
              icon="⏳"
              title="Time capsule comparisons"
              body="Compare who you were six months ago to who you are now. See how your thinking has evolved in your own words."
            />
            <Feature
              icon="✈️"
              title="Offline-first"
              body="Record anywhere, any time. ÉCHO works without an internet connection — your entries sync when you reconnect."
            />
            <Feature
              icon="🤫"
              title="Zero data sharing"
              body="Your voice is never used to train external AI models. Your data is never sold or shared with third parties."
            />
          </div>
        </div>
      </section>

      {/* ÉCHO moment */}
      <section className="relative px-6 py-28" aria-label="About ÉCHO">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,228,184,0.35), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="reveal font-display text-4xl text-ink sm:text-6xl">
            You said this.
            <br />
            <em className="italic text-gradient-ember">Six weeks before you proved it right.</em>
          </h2>
          <blockquote className="reveal reveal-delay-2 mt-14">
            <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">
              <span className="font-display text-6xl leading-none text-peach/60">"</span>
              Speech is more faithful than memory.
              <br />
              <em className="italic text-gradient-ember">ÉCHO keeps it for you.</em>
              <span className="font-display text-6xl leading-none text-peach/60">"</span>
            </p>
            <footer className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              — Réaclyse, Luxembourg
            </footer>
          </blockquote>
          <p className="reveal reveal-delay-3 mt-10 font-display text-sm italic text-muted-foreground">
            Not what the AI thinks. What you said.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative" aria-label="Pricing">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">Pricing</p>
          <h2 className="reveal reveal-delay-1 mt-3 font-display text-4xl text-ink sm:text-5xl">
            Free for the <em className="italic text-gradient-ember">first circle.</em>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto mt-7 font-display text-2xl text-ink sm:text-3xl">
            <span className="text-peach">€7.99</span>{" "}
            <span className="text-muted-foreground">/ month</span>
            <span className="mx-3 text-muted-foreground">·</span>
            <span className="text-peach">€69</span>{" "}
            <span className="text-muted-foreground">/ year</span>
          </p>
          <p className="reveal reveal-delay-3 mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
            Waitlist members receive a special founding-member offer at launch. Your voice. Your words.
            Never used for anything else. All billing through Apple's App Store.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative" aria-label="Frequently asked questions">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-3xl px-6 py-24">
          <p className="reveal text-[11px] uppercase tracking-[0.2em] text-peach">FAQ</p>
          <h2 className="reveal reveal-delay-1 mt-3 font-display text-4xl text-ink sm:text-5xl">
            Questions <em className="italic text-gradient-ember">answered.</em>
          </h2>
          <dl className="mt-14 space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="reveal rounded-2xl border border-peach/10 bg-card/30 backdrop-blur-sm transition hover:border-peach/20"
              >
                <dt>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-display text-lg text-ink">{item.q}</span>
                    <span
                      aria-hidden
                      className={`mt-1 shrink-0 text-peach transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </dt>
                {openFaq === i && (
                  <dd className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative" aria-label="Join the waitlist">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="reveal font-display text-4xl text-ink sm:text-5xl">
            The first voice you should trust
            <br />
            <em className="italic text-gradient-ember">is yours.</em>
          </h2>
          <p className="reveal reveal-delay-1 mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            Join the waitlist for ÉCHO — the private voice journal launching on iPhone in Europe in 2026.
          </p>
          <div className="reveal reveal-delay-2 mx-auto mt-10 max-w-md">
            <WaitlistForm variant="footer" />
          </div>
        </div>
      </section>

      <footer className="relative">
        <div className="divider-gradient mx-auto max-w-6xl" />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="font-display text-sm text-ink">
              ÉCHO <span className="text-muted-foreground">— RÉACLYSE's journal for decisions.</span>
            </p>
            <p>© 2026 Réaclyse. Luxembourg.</p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 uppercase tracking-[0.18em]"
          >
            <a
              href="https://reaclyse.com"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-peach"
            >
              réaclyse.com
            </a>
            <a
              href="https://instagram.com/reaclyse"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-peach"
            >
              Instagram
            </a>
            <Link to="/about" className="transition hover:text-peach">
              About
            </Link>
            <Link to="/support" className="transition hover:text-peach">
              Support
            </Link>
            <Link to="/contact" className="transition hover:text-peach">
              Contact
            </Link>
            <Link to="/privacy" className="transition hover:text-peach">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, body, delay }: { n: string; title: string; body: string; delay?: string }) {
  return (
    <li className={`reveal ${delay ?? ""} relative pt-6`}>
      <div className="divider-gradient absolute inset-x-0 top-0" />
      <span className="font-display text-sm text-peach">{n}</span>
      <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </li>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-base text-ink sm:text-xl">{k}</dt>
      <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{v}</dd>
    </div>
  );
}

function Pillar({ title, body, delay }: { title: string; body: string; delay?: string }) {
  return (
    <div
      className={`reveal ${delay ?? ""} group relative rounded-2xl border border-peach/10 bg-card/30 p-7 backdrop-blur-sm transition hover:border-peach/30 hover:bg-card/50`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-6 right-6 h-px"
        style={{ background: "var(--gradient-divider)" }}
      />
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="reveal group relative rounded-2xl border border-peach/10 bg-card/30 p-6 backdrop-blur-sm transition hover:border-peach/30 hover:bg-card/50">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-6 right-6 h-px"
        style={{ background: "var(--gradient-divider)" }}
      />
      <span className="text-2xl" role="img" aria-hidden>
        {icon}
      </span>
      <h3 className="mt-3 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
