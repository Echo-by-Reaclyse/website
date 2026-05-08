import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  useEffect(() => {
    document.title = "About — ÉCHO by Réaclyse";
  }, []);

  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ember">
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">About ÉCHO</h1>
        <p className="mt-4 text-sm text-muted-foreground">Built by Réaclyse · Luxembourg</p>

        <div className="mt-10 space-y-6 text-foreground/90">
          <Section title="What is ÉCHO?">
            ÉCHO is a private voice journal for iPhone. Every day, one question appears. You speak.
            ÉCHO stores your answer — encrypted, private, yours alone. Weeks later, it surfaces
            what you said before the doubt set in.
          </Section>
          <Section title="Why voice?">
            We think faster than we type. Speaking reveals what we actually believe, not a polished
            version of it. ÉCHO captures that first, honest voice — the one that knows before
            the mind starts to argue.
          </Section>
          <Section title="Privacy-first">
            ÉCHO is built on the principle that your inner voice belongs only to you.
            Voice recordings and transcripts are encrypted at rest, never used to train
            external models, and never shared with third parties.
          </Section>
          <Section title="Who built it?">
            ÉCHO is a product of Réaclyse, a studio based in Luxembourg focused on tools for
            reflection, decision-making, and emotional clarity. Questions?{" "}
            <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
              hello@reaclyse.com
            </a>
          </Section>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
