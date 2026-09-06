import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/faq")({
  component: FAQ,
});

const faqs = [
  {
    q: "What is ÉCHO?",
    a: "ÉCHO is a private voice journal for iPhone. Each day, one reflection question appears — you speak your answer, and ÉCHO transcribes it on-device, stores it encrypted, and builds a longitudinal picture of your thinking over time. Weeks or months later, it surfaces what you said before the doubt set in. It's evidence-based self-reflection, without the blank page.",
  },
  {
    q: "When does ÉCHO launch?",
    a: "ÉCHO is launching in 2026, starting with European markets including France, Germany, Spain, Italy, Luxembourg, Belgium, the Netherlands, Austria, and Switzerland. A broader global rollout will follow shortly after. Join the waitlist to be notified the moment it's available in your region.",
  },
  {
    q: "How do I join the waitlist?",
    a: "Enter your email address on the homepage at echobyreaclyse.com. Waitlist members are the first to know when ÉCHO launches and will receive an exclusive founding-member pricing offer that won't be available after general release.",
  },
  {
    q: "Which devices does ÉCHO run on?",
    a: "ÉCHO requires iPhone running iOS 18 or later. iPad support is planned and will arrive in a future update. Android is not currently on the roadmap — the on-device transcription engine (WhisperKit) is Apple-silicon exclusive, which is central to the privacy model.",
  },
  {
    q: "Is ÉCHO available in my country?",
    a: "At launch, ÉCHO will be available in France, Germany, Spain, Italy, Luxembourg, Belgium, the Netherlands, Austria, and Switzerland. A global rollout to additional markets will follow once the launch is stable. Join the waitlist — we'll notify you as soon as your region is live.",
  },
  {
    q: "How does transcription work?",
    a: "ÉCHO uses WhisperKit, an on-device speech recognition engine built for Apple Silicon. Your voice is transcribed entirely on your iPhone — the audio is never sent to any external server at any point in the process. Transcription happens in seconds, works fully offline, and leaves no audio data outside your device.",
  },
  {
    q: "Who can read my journal entries?",
    a: "Nobody except you. Your recordings and transcripts are encrypted at rest on your device. Réaclyse has no access to your entries. If you enable iCloud sync, Apple stores an encrypted copy in your private iCloud container — even Apple cannot read the contents. Your inner voice belongs to you alone.",
  },
  {
    q: "Is my data used to train AI?",
    a: "No, never. Your entries are not used to train AI models — not Réaclyse's models, not Google's models, not anyone's. The AI-generated insights in ÉCHO Pro work by sending anonymised reflection text to Google Gemini for pattern processing. Your audio is never sent. The text that is sent is never used for training, and cannot be traced back to you. You can disable AI insights at any time in Settings.",
  },
  {
    q: "Is ÉCHO GDPR compliant?",
    a: "Yes. Réaclyse is incorporated in Luxembourg and fully subject to EU data protection law (GDPR). You have the right to access, correct, and permanently delete all data associated with your account at any time — both from Settings inside the app and by contacting hello@reaclyse.com. We maintain a Data Processing Register and will respond to any GDPR request within the statutory 30-day window.",
  },
  {
    q: "What happens to my data if I delete the app?",
    a: "All locally stored recordings, transcripts, and derived data are deleted immediately when you remove the app. If you have iCloud sync enabled, your iCloud data persists until you explicitly delete your account via Settings → Delete Account inside the app, or contact support. Deletion is permanent and irreversible — there is no grace period.",
  },
  {
    q: "How much does ÉCHO cost?",
    a: "ÉCHO has a free tier with no time limit. PRO is normally €7.99/month or €69.99/year. Until 1 December 2026, founding members get a 7-day free trial and then €4.99/month or €49.99/year. After the deadline, new subscribers pay full price. Founding members who subscribe before 1 December lock in their price for as long as they stay subscribed.",
  },
  {
    q: "What's included in the free tier?",
    a: "The free tier includes the daily question and voice recording, on-device transcription via WhisperKit, access to the last 30 days of journal history, up to 3 active time capsules, and 8 weeks of basic emotional insights. Core privacy features — on-device transcription, local encryption — are always free and always on.",
  },
  {
    q: "What does PRO unlock?",
    a: "PRO unlocks your full journal history with no 30-day cap, the complete 8-part persona profile built from your own words, deep emotional pattern analysis across months and years, unlimited time capsules, full-text search across all entries, structured data export, and access to custom themes. PRO also gets early access to new features as they ship.",
  },
  {
    q: "What are time capsules (Letters)?",
    a: "Letters let you seal a voice snapshot — your answer to today's question — with a future unlock date you choose. When that date arrives, ÉCHO surfaces the sealed entry side-by-side with your current answer, so you can compare who you were to who you are now. It's a long-form mirror, months or years in the making, built from your own voice.",
  },
  {
    q: "Does ÉCHO work offline?",
    a: "Yes. Recording, on-device transcription, playback, and journal browsing all work with no internet connection — this is a core design principle. AI-generated insights (which use Gemini to synthesize patterns) and iCloud sync require connectivity. Any operations queued while offline are processed automatically when you reconnect.",
  },
  {
    q: "How do I export my data?",
    a: "Go to Settings → Export inside the app. ÉCHO generates a structured export of your full journal history — transcripts, timestamps, and metadata — in a portable format. PRO subscribers can export at any time. The export is yours to keep regardless of whether you continue your subscription.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings → Delete Account. This permanently removes all local data and, if iCloud sync is enabled, all data stored in your private iCloud container. Deletion cannot be undone — there is no recovery window. If you have an active PRO subscription, cancelling it separately through the App Store prevents future charges.",
  },
  {
    q: "How do I contact support?",
    a: "Email hello@reaclyse.com. We respond within one business day. For urgent privacy or data requests (GDPR access, correction, or deletion), please include 'Data Request' in the subject line and we will prioritise accordingly.",
  },
];

const gettingStarted = faqs.slice(0, 5);
const privacySecurity = faqs.slice(5, 10);
const featuresSubscription = faqs.slice(10, 15);
const accountSupport = faqs.slice(15, 18);

function QAList({ items }: { items: typeof faqs }) {
  return (
    <div className="space-y-6 mt-4">
      {items.map(({ q, a }) => (
        <div key={q}>
          <h3 className="font-sans font-semibold text-ink mb-1">{q}</h3>
          <p className="font-sans leading-relaxed text-muted-foreground">{a}</p>
        </div>
      ))}
    </div>
  );
}

function FAQ() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.echobyreaclyse.com/" },
      { "@type": "ListItem", position: 2, name: "FAQ", item: "https://www.echobyreaclyse.com/faq" },
    ],
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <InnerPage
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about ÉCHO."
    >
      <title>FAQ · ÉCHO</title>
      <meta
        name="description"
        content="Answers to common questions about ÉCHO: how it works, privacy, pricing, iCloud sync, time capsules, and more."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/faq" />
      <meta property="og:title" content="FAQ — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="Everything you need to know about ÉCHO — the private voice journal for iPhone."
      />
      <meta property="og:url" content="https://www.echobyreaclyse.com/faq" />
      <meta property="og:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="FAQ — ÉCHO Voice Journal" />
      <meta
        name="twitter:description"
        content="Everything you need to know about ÉCHO — the private voice journal for iPhone."
      />
      <meta name="twitter:image" content="https://www.echobyreaclyse.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <Section title="Getting started">
        <QAList items={gettingStarted} />
      </Section>

      <Section title="Privacy &amp; security">
        <QAList items={privacySecurity} />
      </Section>

      <Section title="Features &amp; subscription">
        <QAList items={featuresSubscription} />
      </Section>

      <Section title="Account &amp; support">
        <QAList items={accountSupport} />
      </Section>
    </InnerPage>
  );
}
