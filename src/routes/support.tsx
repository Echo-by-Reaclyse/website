import { createFileRoute, Link } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/support")({
  component: Support,
});

function Support() {
  return (
    <InnerPage title="Help & Support" subtitle="We're here to help.">
      <title>Help & Support · ÉCHO</title>
      <meta
        name="description"
        content="Get help with ÉCHO, the private voice journal for iPhone. Questions about recordings, transcription, your subscription, data export, or your account? We respond within one business day."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/support" />
      <meta property="og:title" content="Help & Support — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="Get help with ÉCHO. Questions about recordings, your account, or subscription? We respond within one business day."
      />
      <meta property="og:url" content="https://www.echobyreaclyse.com/support" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Help & Support — ÉCHO Voice Journal" />
      <meta name="twitter:description" content="Get help with ÉCHO. Questions about recordings, your account, or subscription? We respond within one business day." />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.echobyreaclyse.com/" },
              { "@type": "ListItem", position: 2, name: "Support", item: "https://www.echobyreaclyse.com/support" },
            ],
          }),
        }}
      />

      <Section title="Getting started">
        Download ÉCHO from the App Store and create an account. Once you're in, your first daily
        question appears on the home tab. Tap the record button, speak your answer, and tap stop.
        ÉCHO transcribes your words on-device and saves your entry — no internet required for that
        step. If it's your first time using a voice journaling app, a single two-minute session
        is enough to understand the rhythm.
      </Section>

      <Section title="Recording & transcription">
        ÉCHO uses WhisperKit for on-device speech recognition, so your audio never leaves your
        iPhone during transcription. If a transcript looks off, you can edit it directly in the
        Journal tab by tapping the entry and choosing Edit. Transcription quality improves in quiet
        environments with clear speech. If you're in a noisy space, moving a few metres away from
        the source usually makes a significant difference.
      </Section>

      <Section title="Journal & archive">
        All your past entries are in the Journal tab. You can search by keyword, filter by date
        range, and tap any entry to read or play back its recording. Entries are stored locally and
        optionally synced to your private iCloud account (enable in Settings → iCloud Sync). The
        archive is unlimited on the PRO plan; free-tier users can access their most recent 30 days.
      </Section>

      <Section title="Insights & persona">
        The Insights tab shows emotional trends, recurring themes, and your evolving persona
        profile — built from your own words over time. New insights appear after each recording
        session. AI-generated patterns require an internet connection and can be disabled in
        Settings. The persona profile builds gradually — after around ten entries it starts to
        show patterns that are genuinely informative.
      </Section>

      <Section title="Letters (time capsules)">
        Letters let you seal a snapshot of your current voice and unlock it in the future for a
        side-by-side comparison with who you are then. Create a letter in the Letters tab, set an
        unlock date, and ÉCHO will surface it when the time comes. Sealed letters are stored
        encrypted locally and synced to iCloud — they're safe even if you change devices before
        the unlock date arrives.
      </Section>

      <Section title="Subscriptions & billing">
        ÉCHO offers a free tier and a PRO plan (monthly or annual). PRO unlocks unlimited archive
        history, advanced insights, multiple daily reminders, and letter features. All billing is
        handled through Apple's App Store — we never store your payment information. To manage or
        cancel your subscription, go to Settings → Manage Subscription or visit your iPhone's
        App Store subscription settings. Cancellations take effect at the end of the current
        billing period; you keep PRO access until then.
      </Section>

      <Section title="Data export & deletion">
        To export all your data, go to Settings → Export. Your entries, transcripts, and persona
        data are exported as a structured JSON file you can keep indefinitely. To delete your
        account and all associated data permanently, go to Settings → Delete Account. Deletions
        are irreversible. Your data can also be deleted from iCloud via Settings → iCloud on
        your iPhone — removing iCloud data does not delete local device data, so both steps may
        be needed for a complete wipe.
      </Section>

      <Section title="Contact support">
        For any questions, email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        {" "}or visit our{" "}
        <Link to="/contact" className="text-ember transition hover:opacity-75">
          contact page
        </Link>
        . We aim to respond within one business day. Please include your iOS version and ÉCHO
        app version (Settings → About) when reporting a bug — it helps us diagnose faster.
      </Section>

      <Section title="Notifications & reminders">
        To set a daily reminder, go to Settings → Reminder time and choose the time that works
        for you. ÉCHO sends a single daily notification containing only the day's question — it
        never includes content from past entries or any personal information. If you miss a day,
        nothing is lost and no streak is broken: the next day's question is waiting on the home
        tab, exactly as normal. ÉCHO is designed without streak pressure because journaling under
        guilt produces less honest entries.
      </Section>

      <Section title="Offline use">
        The following features work fully offline: recording, on-device transcription, audio
        playback, journal browsing, and time capsule creation. An internet connection is required
        for: AI insight generation, iCloud sync across devices, and question updates from the
        server. If your locally cached question has already loaded, you can record even mid-flight.
        ÉCHO queues any pending sync operations and drains them automatically when connectivity
        is restored.
      </Section>

      <Section title="Privacy controls">
        You can disable AI-generated insights at any time via Settings → Insights → Disable AI —
        this stops all outbound API calls for insight processing. To disable iCloud sync, go to
        Settings → iCloud Sync → Off; your data remains on-device only. To revoke analytics
        participation, go to Settings → Privacy. Each of these controls is independent — you can
        disable AI insights while keeping iCloud sync active, or run the app in a fully local
        mode with no data leaving your device at any point. All controls take effect immediately.
      </Section>

      <Section title="Supported languages">
        Transcription is powered by WhisperKit, which supports English, French, German, Spanish,
        Italian, and Portuguese at launch. The model runs on-device, so no audio is sent to a
        server during transcription regardless of language. The app interface is in English at
        launch; localised versions of the UI are planned for the main European markets and will
        follow the transcription language availability closely.
      </Section>

      <Section title="Troubleshooting">
        <strong className="font-medium text-ink">Microphone permission:</strong> if transcription
        doesn't start when you tap the record button, check Settings → Privacy & Security →
        Microphone → ÉCHO and ensure the toggle is on. ÉCHO cannot record without this permission
        and the app will prompt you to enable it if it's missing.
        <br />
        <br />
        <strong className="font-medium text-ink">Transcription accuracy:</strong> WhisperKit works
        best in quiet environments with clear, moderately paced speech. If a word is transcribed
        incorrectly, tap the entry in the Journal tab → Edit to correct it. Your correction is
        saved locally and synced to iCloud if sync is enabled.
        <br />
        <br />
        <strong className="font-medium text-ink">iCloud sync delay:</strong> sync can take a few
        minutes depending on your connection and how many entries are queued. If entries don't
        appear on another device, check Settings → iCloud on both devices to ensure the ÉCHO
        toggle is on and that both devices are signed into the same Apple ID.
      </Section>

      <Section title="Press & partnerships">
        Journalists and media: a press kit including screenshots, app description, and founder
        bio is available on request. Email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>{" "}
        with "Press" in the subject line and we'll respond within 24 hours.{" "}
        Partnership enquiries from wellness platforms, coaches, and therapists:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>{" "}
        with "Partnership" in the subject line. You can also find more information on our{" "}
        <Link to="/contact" className="text-ember transition hover:opacity-75">
          contact page
        </Link>
        .
      </Section>
    </InnerPage>
  );
}
