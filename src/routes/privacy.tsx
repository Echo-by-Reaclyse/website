import { createFileRoute, Link } from "@tanstack/react-router";
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
        ÉCHO is developed and operated by Réaclyse (legal entity in formation, Luxembourg). As a
        Luxembourg-based entity, Réaclyse is subject to the General Data Protection Regulation
        (GDPR, Regulation (EU) 2016/679) and applicable EU data protection law. For any
        data-related enquiries, contact us at{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
        <br />
        <br />
        For our full internal data protection regulations, see our{" "}
        <Link to="/gdpr" className="text-ember transition hover:opacity-75">
          GDPR & Data Protection Regulations
        </Link>{" "}
        page.
      </Section>

      <Section title="What we collect">
        <strong className="text-ink">On the waitlist:</strong> email address, browser locale, and
        the referring page — used only to notify you at launch. Legal basis: consent (you
        submitted the form).
        <br />
        <br />
        <strong className="text-ink">In the app:</strong> voice recordings and their transcripts,
        daily reflection answers, your persona profile (built locally from your entries), and
        anonymous usage events (crash reports, feature engagement). Legal basis: performance of the
        service you signed up for, and our legitimate interest in improving app reliability.
        <br />
        <br />
        We never collect advertising identifiers, precise location data, or contact-book contents.
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
        data already in iCloud. Legal basis: your consent (the toggle is off by default).
      </Section>

      <Section title="AI insights (Gemini)">
        ÉCHO's pattern and insight features send anonymised reflection text to Google Gemini to
        generate summaries and persona updates. Identifying information (name, email, device ID) is
        never included in these requests. You can disable AI insights in{" "}
        <em>Settings → Insights</em> at any time. Legal basis: your consent (you may opt out at any
        time with no loss of core functionality).
      </Section>

      <Section title="Data retention">
        Your in-app data is stored on your device and, optionally, in iCloud. It is retained until
        you delete it or close your account. Waitlist email addresses are deleted within 30 days
        after launch notifications are sent. We do not retain voice recordings on our servers at
        any point.
      </Section>

      <Section title="Your rights (GDPR)">
        As a user based in the EU or EEA, you have the following rights regarding your personal
        data:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li><strong>Right of access</strong> — obtain a copy of the data we hold about you.</li>
          <li><strong>Right to rectification</strong> — correct inaccurate or incomplete data.</li>
          <li>
            <strong>Right to erasure</strong> — delete your account and all associated data via{" "}
            <em>Settings → Delete Account</em>.
          </li>
          <li>
            <strong>Right to data portability</strong> — export your reflections via{" "}
            <em>Settings → Export</em>.
          </li>
          <li>
            <strong>Right to restrict processing</strong> — request that we limit how we use your
            data.
          </li>
          <li>
            <strong>Right to object</strong> — object to processing based on legitimate interests or
            for direct marketing.
          </li>
          <li>
            <strong>Right to withdraw consent</strong> — you can withdraw consent (e.g., disable AI
            insights or iCloud sync) at any time without affecting prior processing.
          </li>
          <li>
            <strong>Right to lodge a complaint</strong> — with the Luxembourg data protection
            authority (CNPD) at cnpd.public.lu.
          </li>
        </ul>
        <br />
        For any GDPR request, email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . We respond within 30 days. See our full{" "}
        <Link to="/gdpr" className="text-ember transition hover:opacity-75">
          GDPR Regulations
        </Link>{" "}
        for the complete policy.
      </Section>

      <Section title="Third-party services">
        ÉCHO uses the following third-party services, each with their own privacy policy:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li><strong>Apple iCloud (CloudKit)</strong> — optional sync and backup.</li>
          <li>
            <strong>Google Gemini</strong> — AI insight generation from anonymised text.
          </li>
          <li>
            <strong>Apple StoreKit 2</strong> — in-app subscription management, handled natively
            by Apple. No payment data is processed by us directly.
          </li>
          <li>
            <strong>Neon</strong> — backend database for server-managed content such as daily
            questions. No user reflection data is stored.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery for waitlist communications.
          </li>
          <li><strong>Vercel</strong> — website and API hosting.</li>
        </ul>
      </Section>

      <Section title="Contact">
        Réaclyse · Luxembourg ·{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        <br />
        <br />
        For full data protection regulations:{" "}
        <Link to="/gdpr" className="text-ember transition hover:opacity-75">
          GDPR & Data Protection Regulations
        </Link>
      </Section>
    </InnerPage>
  );
}
