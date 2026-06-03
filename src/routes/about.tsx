import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Linkedin, Instagram } from "lucide-react";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/about")({
  component: About,
});

// ── Team ──────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photo: string;
  linkedin: string;
  instagram?: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Roksana Skubis",
    role: "Chief Executive Officer",
    initials: "RS",
    photo: "/team-roksana.jpg",
    linkedin: "https://www.linkedin.com/in/roksana-skubis-b663101b2/",
  },
  {
    name: "Victor Mihaita",
    role: "Chief Technology Officer",
    initials: "VM",
    photo: "/team-victor.jpg",
    linkedin: "https://www.linkedin.com/in/vmihai12/",
    instagram: "#instagram-victor",
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1.5rem 1.75rem",
        borderRadius: "1.25rem",
        border: "1px solid rgba(191,96,64,0.18)",
        background: "var(--team-card-bg)",
        gap: "1rem",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      className="team-card"
    >
      {/* Portrait */}
      <div
        style={{
          width: 140,
          height: 168,
          borderRadius: "0.875rem",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid rgba(191,96,64,0.22)",
          background: "rgba(191,96,64,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!imgFailed ? (
          <img
            src={member.photo}
            alt={member.name}
            onError={() => setImgFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "#BF6040",
              userSelect: "none",
            }}
          >
            {member.initials}
          </span>
        )}
      </div>

      {/* Name & role */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.35rem",
            lineHeight: 1.2,
            color: "var(--ink)",
          }}
        >
          {member.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#BF6040",
            marginTop: "0.35rem",
          }}
        >
          {member.role}
        </p>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="social-icon-link"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(191,96,64,0.25)",
            color: "var(--muted-foreground)",
            transition: "color 0.18s, border-color 0.18s, background 0.18s",
            background: "transparent",
          }}
        >
          <Linkedin size={15} strokeWidth={1.75} />
        </a>
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="social-icon-link"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(191,96,64,0.25)",
              color: "var(--muted-foreground)",
              transition: "color 0.18s, border-color 0.18s, background 0.18s",
              background: "transparent",
            }}
          >
            <Instagram size={15} strokeWidth={1.75} />
          </a>
        )}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <section style={{ marginBottom: "0.5rem" }}>
      <style>{`
        :root {
          --team-card-bg: rgba(191,96,64,0.04);
        }
        .dark .team-card, :is(.dark *) .team-card {
          --team-card-bg: rgba(191,96,64,0.06);
        }
        .team-card:hover {
          border-color: rgba(191,96,64,0.38) !important;
          transform: translateY(-2px);
        }
        .social-icon-link:hover {
          color: #BF6040 !important;
          border-color: rgba(191,96,64,0.55) !important;
          background: rgba(191,96,64,0.08) !important;
        }
      `}</style>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          color: "var(--ink)",
          marginBottom: "1.25rem",
        }}
      >
        The team
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          maxWidth: 520,
        }}
      >
        {TEAM.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.78rem",
          color: "var(--muted-foreground)",
          marginTop: "1rem",
          opacity: 0.7,
          letterSpacing: "0.01em",
        }}
      >
        Mentors & advisors coming soon.
      </p>
    </section>
  );
}

function About() {
  return (
    <InnerPage title="About ÉCHO" subtitle="Built by Réaclyse · Luxembourg">
      <title>About ÉCHO — Private Voice Journal for iPhone | Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO is a private voice journal for iPhone, built by Réaclyse in Luxembourg. Learn how we built a privacy-first journaling app for reflective adults across Europe."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/about" />
      <meta property="og:title" content="About ÉCHO — Private Voice Journal | Réaclyse" />
      <meta
        property="og:description"
        content="ÉCHO is a private voice journal for iPhone built by Réaclyse in Luxembourg. Privacy-first journaling for reflective adults."
      />
      <meta property="og:url" content="https://www.echobyreaclyse.com/about" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About ÉCHO — Private Voice Journal | Réaclyse" />
      <meta name="twitter:description" content="ÉCHO is a private voice journal for iPhone built by Réaclyse in Luxembourg. Privacy-first journaling for reflective adults." />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.echobyreaclyse.com/" },
              { "@type": "ListItem", position: 2, name: "About", item: "https://www.echobyreaclyse.com/about" },
            ],
          }),
        }}
      />

      <TeamSection />

      <Section title="What is ÉCHO?">
        ÉCHO is a private voice journal for iPhone. Every day, one question appears. You speak.
        ÉCHO stores your answer — encrypted, private, yours alone. Weeks later, it surfaces what
        you said before the doubt set in. It's evidence-based self-reflection, without the blank
        page.
      </Section>

      <Section title="Why voice?">
        We think faster than we type. Speaking reveals what we actually believe — not a polished
        version of it. ÉCHO captures that first, honest voice: the one that knows before the mind
        starts to argue. Voice journaling removes the friction that stops most people from
        journaling consistently.
      </Section>

      <Section title="How it works">
        Each day ÉCHO presents a single reflection question — drawn from a curated set designed to
        surface clarity rather than just feelings. You record a voice answer, ÉCHO transcribes it
        on-device using WhisperKit, and stores it locally. Over time, the Insights tab builds a
        persona profile from your own words: your reasoning style, recurring themes, emotional
        patterns, and how your perspective shifts across months.
      </Section>

      <Section title="Privacy-first">
        ÉCHO is built on the principle that your inner voice belongs only to you. Transcription
        runs on-device using WhisperKit — your audio never leaves your iPhone for that step.
        Recordings and transcripts are encrypted at rest. We never use your data to train external
        AI models, and we never share it with third parties. AI-generated insights are opt-in and
        can be disabled at any time.
      </Section>

      <Section title="Time capsules">
        The Letters feature lets you seal a snapshot of your current voice and thoughts, then
        unlock it on a future date for a side-by-side comparison with who you've become. It's a
        long-form mirror — months or years in the making.
      </Section>

      <Section title="Who built it?">
        ÉCHO is a product of Réaclyse, a studio based in Luxembourg focused on tools for
        reflection, decision-making, and emotional clarity. We build for people who want to
        understand themselves better over time — not just track moods in the moment. Questions?{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
      </Section>

      <Section title="The science of voice">
        Verbal externalization — speaking thoughts out loud — activates different neural pathways
        than writing. When you articulate something aloud, the brain is forced to construct meaning
        rather than simply retrieve a pre-packaged version of it. The process of forming the
        sentence is itself an act of sense-making. This is why the same thought, when spoken, often
        comes out differently than it does on paper: the spoken version hasn't been edited yet.

        Talk therapy has decades of evidence for processing emotions through speech. The mechanism
        isn't primarily about receiving advice — it's about the act of speaking itself. Studies on
        therapeutic disclosure show consistent improvements in psychological wellbeing when people
        articulate difficult experiences to a receptive listener (or, it turns out, to a recording
        device). Voice journaling applies the same mechanism to self-directed reflection, removing
        the need for a second person while preserving the core dynamic.

        The acoustic record of how you said something carries emotional data that written words
        lose entirely. Pace, hesitation, the length of a pause before a word — these paraverbal
        signals are as informative as the words themselves. When you play back a recording from six
        months ago, you hear not just what you said, but how certain you were when you said it.
        That's information written transcripts can't recover.
      </Section>

      <Section title="Why one question, not a blank page">
        Cognitive load is the hidden reason most journaling habits fail. A blank page requires you
        to decide what's worth reflecting on before you can reflect — a meta-decision that
        consumes the attention you needed for the reflection itself. Most people stall at this
        stage, not because they have nothing to say, but because the decision of where to start is
        too open. A single, specific question removes that decision entirely and lets you go
        straight to the answer.

        The best therapy questions work the same way: they constrain the space just enough that the
        answer has somewhere to go. Open questions like "how are you feeling?" can be deflected
        easily. Specific questions — "what did you avoid thinking about today?" — are harder to
        sidestep. ÉCHO's questions are written to be slightly uncomfortable, concrete, and
        answerable in under a minute. They're designed to surface clarity rather than just
        feelings.

        The result is a record that's consistently more honest than open-ended journaling, because
        the question does the work of directing your attention. Over months, those directed answers
        accumulate into a picture of your baseline — what you return to when different questions
        point at the same underlying concerns.
      </Section>

      <Section title="Launching in Europe first">
        The European Union has the strictest privacy standards in the world, and building for GDPR
        from day one is harder than retrofitting compliance before a launch. But it means the
        privacy architecture is structural, not cosmetic. On-device transcription, opt-in AI
        insights, explicit data controls, real deletion — these aren't features we added to pass
        a legal review; they're the foundation the product was designed around. That foundation
        is more expensive to build. It's also the right way to build a product that holds your
        inner voice.

        The nine launch markets — France, Germany, Spain, Italy, Luxembourg, Belgium, the
        Netherlands, Austria, and Switzerland — share a cultural orientation toward privacy and
        interiority that aligns with what ÉCHO is doing. These are societies with strong traditions
        of private life, scepticism about surveillance capitalism, and genuine demand for tools that
        don't treat personal data as an asset to be monetised. That's the audience ÉCHO is built
        for.

        Luxembourg as home base is a deliberate choice. Proximity to EU institutions and the
        European Court of Justice means we're operating in the jurisdiction that sets the standards
        we're building to. The legal framework for data protection here is robust, well-interpreted,
        and enforced. We'd rather build inside the strictest framework from the start than expand
        into it later.
      </Section>

      <Section title="What's coming">
        iPad support is in active development. The larger screen unlocks genuinely new ways to
        review your history — side-by-side comparisons, fuller timelines, richer persona visualisations
        — and the journal experience on iPad should feel qualitatively different from iPhone, not
        just scaled up. No ship date yet, but it's the next major platform addition.

        Widget support will bring daily questions directly to the home screen and Lock Screen,
        removing one more step between you and the habit. The ideal state is that the question is
        waiting for you before you've even opened the app. Android is in planning — no firm date,
        and we won't rush it. An Android version built badly is worse than no Android version.

        The roadmap is driven by the insight layer first. Everything that helps you understand
        yourself better over time — deeper persona analysis, richer thought-graph connections,
        more sophisticated evolution comparisons — takes priority over surface-level features.
        The goal is a product that becomes more valuable the longer you use it, not one that
        front-loads novelty and then plateaus.
      </Section>
    </InnerPage>
  );
}
