import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/support")({
  component: Support,
});

function Support() {
  return (
    <InnerPage title="Help & Support" subtitle="We're here to help.">
      <title>Help & Support — ÉCHO Voice Journal | Réaclyse</title>
      <meta
        name="description"
        content="Get help with ÉCHO, the private voice journal for iPhone. Questions about recordings, transcription, your subscription, data export, or your account? We respond within one business day."
      />
      <link rel="canonical" href="https://echobyreaclyse.com/support" />
      <meta property="og:title" content="Help & Support — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="Get help with ÉCHO. Questions about recordings, your account, or subscription? We respond within one business day."
      />
      <meta property="og:url" content="https://echobyreaclyse.com/support" />
      <meta property="og:image" content="https://echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Help & Support — ÉCHO Voice Journal" />
      <meta name="twitter:description" content="Get help with ÉCHO. Questions about recordings, your account, or subscription? We respond within one business day." />
      <meta name="twitter:image" content="https://echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://echobyreaclyse.com/" },
              { "@type": "ListItem", position: 2, name: "Support", item: "https://echobyreaclyse.com/support" },
            ],
          }),
        }}
      />

      <Section title="Getting started">
        Download ÉCHO from the App Store and create an account. Once you're in, your first daily
        question appears on the home tab. Tap the record button, speak your answer, and tap stop.
        ÉCHO transcribes your words on-device and saves your entry — no internet required for that
        step.
      </Section>

      <Section title="Recording & transcription">
        ÉCHO uses WhisperKit for on-device speech recognition, so your audio never leaves your
        iPhone during transcription. If a transcript looks off, you can edit it directly in the
        Journal tab by tapping the entry and choosing Edit. Transcription quality improves in quiet
        environments with clear speech.
      </Section>

      <Section title="Journal & archive">
        All your past entries are in the Journal tab. You can search by keyword, filter by date
        range, and tap any entry to read or play back its recording. Entries are stored locally and
        optionally synced to your private iCloud account (enable in Settings → iCloud Sync).
      </Section>

      <Section title="Insights & persona">
        The Insights tab shows emotional trends, recurring themes, and your evolving persona
        profile — built from your own words over time. New insights appear after each recording
        session. AI-generated patterns require an internet connection and can be disabled in
        Settings.
      </Section>

      <Section title="Letters (time capsules)">
        Letters let you seal a snapshot of your current voice and unlock it in the future for a
        side-by-side comparison with who you are then. Create a letter in the Letters tab, set an
        unlock date, and ÉCHO will surface it when the time comes.
      </Section>

      <Section title="Subscriptions & billing">
        ÉCHO offers a free tier and a PRO plan (monthly or annual). PRO unlocks unlimited archive
        history, advanced insights, multiple daily reminders, and letter features. All billing is
        handled through Apple's App Store — we never store your payment information. To manage or
        cancel your subscription, go to Settings → Manage Subscription or visit your iPhone's
        App Store subscription settings.
      </Section>

      <Section title="Data export & deletion">
        To export all your data, go to Settings → Export. To delete your account and all associated
        data permanently, go to Settings → Delete Account. Deletions are irreversible. Your data
        can also be deleted from iCloud via Settings → iCloud on your iPhone.
      </Section>

      <Section title="Contact support">
        For any questions, email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . We aim to respond within one business day.
      </Section>
    </InnerPage>
  );
}
