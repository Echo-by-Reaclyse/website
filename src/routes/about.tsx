import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <InnerPage title="About ÉCHO" subtitle="Built by Réaclyse · Luxembourg">
      <title>About ÉCHO — Private Voice Journal for iPhone | Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO is a private voice journal for iPhone, built by Réaclyse in Luxembourg. Learn how we built a privacy-first journaling app for reflective adults across Europe."
      />
      <link rel="canonical" href="https://echobyreaclyse.com/about" />
      <meta property="og:title" content="About ÉCHO — Private Voice Journal | Réaclyse" />
      <meta
        property="og:description"
        content="ÉCHO is a private voice journal for iPhone built by Réaclyse in Luxembourg. Privacy-first journaling for reflective adults."
      />
      <meta property="og:url" content="https://echobyreaclyse.com/about" />

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
    </InnerPage>
  );
}
