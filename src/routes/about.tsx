import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  useEffect(() => {
    document.title = "About — ÉCHO by Réaclyse";
  }, []);

  return (
    <InnerPage title="About ÉCHO" subtitle="Built by Réaclyse · Luxembourg">
      <Section title="What is ÉCHO?">
        ÉCHO is a private voice journal for iPhone. Every day, one question appears. You speak.
        ÉCHO stores your answer — encrypted, private, yours alone. Weeks later, it surfaces
        what you said before the doubt set in.
      </Section>
      <Section title="Why voice?">
        We think faster than we type. Speaking reveals what we actually believe, not a
        polished version of it. ÉCHO captures that first, honest voice — the one that
        knows before the mind starts to argue.
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
    </InnerPage>
  );
}
