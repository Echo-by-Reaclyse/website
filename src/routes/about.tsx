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
  /** Set true to hide from the page until photo/bio is ready */
  hidden?: boolean;
}

const TEAM: TeamMember[] = [
  {
    name: "Roksana Skubis",
    role: "Chief Executive Officer",
    initials: "RS",
    photo: "/team-roksana.jpg",
    linkedin: "https://www.linkedin.com/in/roksana-skubis-b663101b2/",
    instagram: "https://www.instagram.com/roksanaskubis/",
  },
  {
    name: "Victor Mihaita",
    role: "Chief Technology Officer",
    initials: "VM",
    photo: "/team-victor.jpg",
    linkedin: "https://www.linkedin.com/in/vmihai12/",
  },
  {
    name: "Susana Monroy",
    role: "Chief Marketing Officer",
    initials: "SM",
    photo: "/team-susana.png",
    linkedin: "",
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
        {member.linkedin && (
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
        )}
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
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
          maxWidth: 820,
        }}
      >
        {TEAM.filter((m) => !m.hidden).map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>

      {/* ECH-110: Mentors & advisors section — hidden until we have real content.
          Placeholder: 2-3 advisors with photo, name, area of expertise, and a 1-line bio.
          Content needed from Roksana before this section goes live. */}
    </section>
  );
}

function About() {
  return (
    <InnerPage title="About ÉCHO" subtitle="Built by RÉACLYSE · Luxembourg">
      <title>About · ÉCHO</title>
      <meta
        name="description"
        content="ÉCHO is a private voice journal for iPhone, built by RÉACLYSE in Luxembourg. Learn how we built a privacy-first journaling app for reflective adults across Europe."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/about" />
      <meta property="og:title" content="About · ÉCHO — Private Voice Journal" />
      <meta
        property="og:description"
        content="ÉCHO is a private voice journal for iPhone built by RÉACLYSE in Luxembourg. Privacy-first journaling for reflective adults."
      />
      <meta property="og:url" content="https://www.echobyreaclyse.com/about" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About · ÉCHO — Private Voice Journal" />
      <meta name="twitter:description" content="ÉCHO is a private voice journal for iPhone built by RÉACLYSE in Luxembourg. Privacy-first journaling for reflective adults." />
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
        ÉCHO is a private voice journal for iPhone. Every day, one question appears — you speak,
        and ÉCHO stores your answer, encrypted and yours alone. Weeks later, it surfaces what you
        said before the doubt set in.
      </Section>

      <Section title="Why voice?">
        We think faster than we type. Speaking reveals what we actually believe, not a polished
        version of it — ÉCHO captures that first, honest voice before the mind starts to argue.
      </Section>

      <Section title="How it works">
        Each day brings a single reflection question. You record a voice answer; ÉCHO transcribes
        it on-device using WhisperKit and stores it locally. Over time, the Insights tab builds an
        8-part persona profile from your own words.
      </Section>

      <Section title="Privacy-first">
        Transcription runs entirely on your iPhone — your audio never leaves your device. Every
        entry is encrypted at rest, AI insights are opt-in, and your data is never shared or used
        to train external models.
      </Section>

      <Section title="Time capsules">
        The Letters feature lets you seal a snapshot of your current voice and thoughts, then
        unlock it on a future date for a side-by-side comparison with who you've become.
      </Section>

      <Section title="Who built it?">
        ÉCHO is built by RÉACLYSE, a studio based in Luxembourg focused on tools for
        reflection, decision-making, and emotional clarity. Questions?{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
      </Section>

      <Section title="The science of voice">
        Verbal externalization activates different neural pathways than writing — forming a spoken
        sentence is itself an act of sense-making, which is why spoken thoughts often come out
        differently than written ones. The paraverbal record (pace, hesitation, pauses) carries
        emotional data that transcripts alone can't recover.
      </Section>

      <Section title="Why one question, not a blank page">
        A blank page forces a meta-decision — what's worth reflecting on — before reflection can
        even begin. One specific, slightly uncomfortable question removes that friction entirely
        and directs attention straight to an honest answer.
      </Section>

    </InnerPage>
  );
}
