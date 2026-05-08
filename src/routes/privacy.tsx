import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — ÉCHO by Réaclyse";
  }, []);

  return (
    <InnerPage title="Privacy Policy" subtitle="Last updated: 2026">
      <Section title="What we collect">
        On the waitlist, we collect only your email address, your browser locale,
        and the page that referred you. We use this solely to contact you about ÉCHO's launch.
      </Section>
      <Section title="Voice and transcripts">
        ÉCHO is designed privacy-first. Voice recordings and transcripts are encrypted
        and remain associated with your account only. We do not sell, share, or use your
        voice data to train external models.
      </Section>
      <Section title="Your rights (GDPR)">
        You may request access, correction, or deletion of your personal data at any
        time by contacting us at{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
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
