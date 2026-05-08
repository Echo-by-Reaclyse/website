import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  return (
    <InnerPage title="Privacy Policy" subtitle="Last updated: 2026">
      <title>Privacy Policy — ÉCHO by Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO privacy policy. Your voice recordings and transcripts are encrypted and never used to train AI models. GDPR-compliant. Built by Réaclyse, Luxembourg."
      />
      <link rel="canonical" href="https://echo.reaclyse.com/privacy" />
      <meta name="robots" content="noindex, follow" />

      <Section title="What we collect">
        On the waitlist, we collect only your email address, your browser locale, and the page that
        referred you. We use this solely to contact you about ÉCHO's launch.
      </Section>
      <Section title="Voice and transcripts">
        ÉCHO is designed privacy-first. Voice recordings and transcripts are encrypted and remain
        associated with your account only. On-device transcription means your audio is processed
        locally on your iPhone — it never leaves your device for that step. We do not sell, share,
        or use your voice data to train external models.
      </Section>
      <Section title="Your rights (GDPR)">
        You may request access, correction, or deletion of your personal data at any time by
        contacting us at{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . As a Luxembourg-based company, Réaclyse is subject to GDPR and EU data protection law.
      </Section>
      <Section title="Contact">
        Réaclyse · Luxembourg ·{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
      </Section>
    </InnerPage>
  );
}
