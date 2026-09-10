import { createFileRoute, Link } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <InnerPage
      title="Terms of Service"
      subtitle="Last updated: September 2026"
    >
      <title>Terms of Service · ÉCHO</title>
      <meta
        name="description"
        content="Terms of Service for the ÉCHO app and website, operated by ECHO by REACLYSE S.à r.l.-S, Luxembourg."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/terms" />

      {/* ── I. Who we are ── */}
      <Section title="I. Who we are">
        ÉCHO is a private voice journalling application developed and operated by{" "}
        <strong>ECHO by REACLYSE S.à r.l.-S</strong>, a company incorporated in Luxembourg
        (hereinafter "ECHO by REACLYSE", "we", "us", or "our"). Our registered office is in
        Luxembourg. Contact:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
      </Section>

      {/* ── II. Acceptance ── */}
      <Section title="II. Acceptance of these terms">
        By downloading, installing, or using the ÉCHO app or visiting the ÉCHO website
        (collectively, the "Service"), you agree to be bound by these Terms of Service
        (the "Terms"). If you do not agree, do not use the Service.
        <br />
        <br />
        These Terms form a legally binding agreement between you and ECHO by REACLYSE. We may
        update them from time to time; continued use of the Service after an update
        constitutes acceptance of the revised Terms. We will notify you of material
        changes via the app or by email.
        <br />
        <br />
        You must be at least <strong>17 years old</strong> (or the minimum age required in
        your jurisdiction) to use ÉCHO. By using the Service you confirm that you meet
        this requirement.
      </Section>

      {/* ── III. Description ── */}
      <Section title="III. Description of the Service">
        ÉCHO is a personal reflection and voice-journalling application. The Service allows
        you to:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>Record spoken reflections in response to daily prompts;</li>
          <li>
            Receive on-device transcripts of your recordings via WhisperKit (audio is never
            transmitted for transcription);
          </li>
          <li>
            Optionally receive AI-generated insights (Pro subscribers) powered by Google
            Gemini — only anonymised reflection text is sent, with no identifying
            information;
          </li>
          <li>Browse your personal journal, track patterns, and view your evolving persona;</li>
          <li>Back up and sync your journal privately via Apple iCloud (optional).</li>
        </ul>
        <br />
        The Service is provided on an "as is" and "as available" basis. We may modify,
        suspend, or discontinue features at any time, with reasonable notice where
        practicable.
      </Section>

      {/* ── IV. Accounts ── */}
      <Section title="IV. Your account">
        ÉCHO does not require a user account at this time — your data lives on your device
        and in your personal iCloud (if sync is enabled). You are responsible for
        maintaining the security of your device and iCloud account.
        <br />
        <br />
        If account-based features are introduced in the future, you will be notified and
        these Terms updated accordingly.
      </Section>

      {/* ── V. Subscriptions ── */}
      <Section title="V. Subscriptions and payments">
        ÉCHO offers a free tier and an optional <strong>ÉCHO Pro</strong> subscription
        that unlocks additional features (AI insights, unlimited recordings, full journal
        history, and more). Subscriptions are managed entirely through{" "}
        <strong>Apple's App Store</strong> using StoreKit 2.
        <br />
        <br />
        <strong>Billing.</strong> Subscription fees are charged to your Apple ID at
        confirmation of purchase. Subscriptions renew automatically at the end of each
        billing period unless cancelled at least 24 hours before the renewal date.
        <br />
        <br />
        <strong>Free trials.</strong> Where a free trial is offered, any unused portion is
        forfeited upon purchase of a subscription.
        <br />
        <br />
        <strong>Cancellations and refunds.</strong> You may cancel your subscription at
        any time via your Apple ID settings. Refunds are handled by Apple in accordance
        with{" "}
        <a
          href="https://www.apple.com/legal/internet-services/itunes/us/terms.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          Apple's Terms of Sale
        </a>
        . ECHO by REACLYSE does not process payments or issue refunds directly.
        <br />
        <br />
        <strong>Price changes.</strong> We may change subscription prices with reasonable
        advance notice. Existing subscribers will be notified before any price change takes
        effect.
      </Section>

      {/* ── VI. Acceptable use ── */}
      <Section title="VI. Acceptable use">
        You agree to use the Service only for lawful, personal, non-commercial purposes.
        You must not:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>Reverse engineer, decompile, or attempt to extract source code from the app;</li>
          <li>Use the Service to store or transmit unlawful, harmful, or offensive content;</li>
          <li>Attempt to circumvent any subscription or access restriction;</li>
          <li>
            Interfere with or disrupt the integrity or performance of the Service or its
            infrastructure;
          </li>
          <li>Use automated tools to access or scrape the Service.</li>
        </ul>
        <br />
        We reserve the right to suspend access to the Service for users who breach these
        restrictions.
      </Section>

      {/* ── VII. Your content ── */}
      <Section title="VII. Your content">
        All voice recordings, transcripts, and reflections you create through ÉCHO
        ("Your Content") belong to you. We do not claim any ownership over Your Content.
        <br />
        <br />
        <strong>On-device storage.</strong> Your Content is stored on your device and,
        optionally, in your personal iCloud. ECHO by REACLYSE does not store copies of your
        recordings or transcripts on its own servers.
        <br />
        <br />
        <strong>AI processing (Pro).</strong> When AI insights are enabled, anonymised
        text from your reflections is sent to Google Gemini for processing. No names,
        email addresses, or device identifiers are included in these requests. You can
        disable AI insights at any time in Settings.
        <br />
        <br />
        <strong>Deletion.</strong> You can permanently delete all Your Content at any
        time via <em>Settings → Delete Account</em>. You can export Your Content via{" "}
        <em>Settings → Export</em>.
        <br />
        <br />
        We will not use Your Content to train AI models, sell data to third parties, or
        use it for advertising purposes.
      </Section>

      {/* ── VIII. Intellectual property ── */}
      <Section title="VIII. Intellectual property">
        The ÉCHO name, logo, design, software, and all related materials are the
        exclusive property of ECHO by REACLYSE S.à r.l.-S and are protected by copyright,
        trademark, and other applicable laws. Nothing in these Terms grants you any right
        to use ECHO by REACLYSE's trademarks or branding without prior written permission.
        <br />
        <br />
        The app incorporates open-source components, including{" "}
        <strong>WhisperKit</strong> (Argmax, Inc.). Use of those components is subject to
        their respective licences.
      </Section>

      {/* ── IX. Disclaimers ── */}
      <Section title="IX. Disclaimers">
        <strong>Not a medical or mental-health service.</strong> ÉCHO is a personal
        reflection tool. It is not a substitute for professional mental-health care,
        therapy, or crisis support. If you are experiencing a mental-health emergency,
        please contact a qualified professional or emergency services in your country.
        <br />
        <br />
        <strong>No guarantee of availability.</strong> We strive for high availability but
        do not guarantee uninterrupted access to the Service. Maintenance, updates, or
        events beyond our control may cause temporary unavailability.
        <br />
        <br />
        <strong>AI-generated content.</strong> Insights generated by AI are for personal
        reflection only and may not always be accurate. They should not be relied upon
        for medical, legal, financial, or other professional advice.
      </Section>

      {/* ── X. Limitation of liability ── */}
      <Section title="X. Limitation of liability">
        To the fullest extent permitted by applicable law, ECHO by REACLYSE shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages arising
        from your use of the Service, including but not limited to loss of data, loss of
        profits, or business interruption.
        <br />
        <br />
        ECHO by REACLYSE's total aggregate liability to you for any claims arising from these
        Terms or your use of the Service shall not exceed the amount you paid for the
        Service in the twelve (12) months preceding the claim (or €10 if you have not
        made any payment).
        <br />
        <br />
        Nothing in these Terms excludes or limits liability that cannot be excluded under
        applicable Luxembourg or EU consumer-protection law.
      </Section>

      {/* ── XI. Termination ── */}
      <Section title="XI. Termination">
        You may stop using ÉCHO at any time by deleting the app from your device. To
        cancel a Pro subscription, do so via your Apple ID settings before the next
        renewal date.
        <br />
        <br />
        We may suspend or terminate your access to the Service if you breach these Terms
        or if we are required to do so by law, with notice where reasonably practicable.
        <br />
        <br />
        On termination, your data remains on your device and in your iCloud until you
        choose to delete it. Sections VII, VIII, IX, X, and XII survive termination.
      </Section>

      {/* ── XII. Governing law ── */}
      <Section title="XII. Governing law and disputes">
        These Terms are governed by the laws of the <strong>Grand Duchy of Luxembourg</strong>,
        without regard to its conflict-of-law provisions. Any dispute arising from or
        relating to these Terms shall be submitted to the exclusive jurisdiction of the
        competent courts of Luxembourg City, unless mandatory consumer-protection law in
        your country of residence provides otherwise.
        <br />
        <br />
        If you are an EU consumer, you may also access the European Commission's Online
        Dispute Resolution platform at{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </Section>

      {/* ── XIII. Changes ── */}
      <Section title="XIII. Changes to these Terms">
        We may revise these Terms at any time. When we make material changes, we will
        update the date at the top of this page and notify you via the app or email.
        Your continued use of the Service after the effective date of any revision
        constitutes your acceptance of the updated Terms.
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact">
        For questions about these Terms:
        <br />
        <br />
        <strong>ECHO by REACLYSE S.à r.l.-S</strong> · Luxembourg
        <br />
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        <br />
        <br />
        For data and privacy questions, see our{" "}
        <Link to="/privacy" className="text-ember transition hover:opacity-75">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link to="/gdpr" className="text-ember transition hover:opacity-75">
          GDPR & Data Protection Regulations
        </Link>
        .
      </Section>
    </InnerPage>
  );
}
