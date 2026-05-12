import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  return (
    <InnerPage title="Privacy Policy" subtitle="Last updated: May 2026">
      <title>Privacy Policy — ÉCHO by Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO privacy policy. Your voice recordings and transcripts are encrypted and never used to train AI models. GDPR-compliant. Built by Réaclyse, Luxembourg."
      />
      <link rel="canonical" href="https://echobyreaclyse.com/privacy" />
      <meta name="robots" content="noindex, follow" />

      <Section title="Data controller">
        ÉCHO is developed and operated by Réaclyse, a company based in Luxembourg. As a
        Luxembourg-based entity, Réaclyse is subject to the General Data Protection Regulation
        (GDPR) and applicable EU data protection law. For any data-related enquiries, contact us
        at{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
      </Section>

      <Section title="What we collect">
        <strong className="text-ink">On the waitlist:</strong> email address, browser locale, and
        the referring page — used only to notify you at launch.
        <br />
        <br />
        <strong className="text-ink">In the app:</strong> voice recordings and their transcripts,
        daily reflection answers, your persona profile (built locally from your entries), and
        anonymous usage events (crash reports, feature engagement). We never collect advertising
        identifiers, location data, or contact-book contents.
      </Section>

      <Section title="Voice recordings & transcripts">
        Transcription is performed entirely on your iPhone using WhisperKit — your audio never
        leaves your device for that step. Recordings and transcripts are encrypted at rest and
        associated exclusively with your account. We do not sell, share, or use your voice data to
        train external AI models.
      </Section>

      <Section title="iCloud sync">
        When you enable iCloud Sync, your entries are backed up to your personal iCloud account via
        Apple's CloudKit. This sync is governed by Apple's privacy policy. You can disable iCloud
        Sync at any time in ÉCHO's settings; doing so stops all future uploads but does not delete
        data already in iCloud.
      </Section>

      <Section title="AI insights (Gemini)">
        ÉCHO's pattern and insight features send anonymised reflection text to Google Gemini to
        generate summaries and persona updates. Identifying information (name, email, device ID) is
        never included in these requests. You can disable AI insights in Settings → Insights at any
        time.
      </Section>

      <Section title="Data retention">
        Your in-app data is stored on your device and, optionally, in iCloud. It is retained until
        you delete it or close your account. Waitlist email addresses are deleted within 30 days
        after launch notifications are sent.
      </Section>

      <Section title="Your rights (GDPR)">
        You may request access, correction, or permanent deletion of your personal data at any
        time. To export your data, use Settings → Export in the app. To delete your account and all
        associated data, use Settings → Delete Account. For other GDPR requests, email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . We respond within 30 days.
      </Section>

      <Section title="Third-party services">
        ÉCHO uses the following third-party services: Apple iCloud (CloudKit) for optional sync,
        Google Gemini for AI insight generation, RevenueCat for subscription management, and
        Apple's crash-reporting tools. Each provider has its own privacy policy and data handling
        practices.
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
