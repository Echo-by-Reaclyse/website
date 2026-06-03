import { createFileRoute, Link } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <InnerPage title="Contact" subtitle="We'd love to hear from you.">
      <title>Contact Réaclyse — ÉCHO Voice Journal</title>
      <meta
        name="description"
        content="Contact Réaclyse about ÉCHO, the private voice journal for iPhone. General enquiries, press, partnerships, or GDPR data requests — hello@reaclyse.com."
      />
      <link rel="canonical" href="https://echobyreaclyse.com/contact" />
      <meta property="og:title" content="Contact Réaclyse — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="General enquiries, press, partnerships, or data requests — hello@reaclyse.com."
      />
      <meta property="og:url" content="https://echobyreaclyse.com/contact" />

      <Section title="General enquiries">
        For questions about ÉCHO, partnerships, or press:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
      </Section>
      <Section title="Support">
        Need help with your account or subscription?{" "}
        <Link to="/support" className="text-ember transition hover:opacity-75">
          Visit our support page
        </Link>{" "}
        or email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
      </Section>
      <Section title="Data & privacy">
        To request access, correction, or deletion of your personal data under GDPR:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
      </Section>
      <Section title="Réaclyse">
        Réaclyse · Luxembourg ·{" "}
        <a
          href="https://reaclyse.com"
          target="_blank"
          rel="noreferrer noopener"
          className="text-ember transition hover:opacity-75"
        >
          reaclyse.com
        </a>
      </Section>

      <Section title="Press & media">
        Journalists covering wellness, productivity, privacy, or European tech are welcome to
        reach out. We can provide screenshots, app description, founder bio, technical architecture
        details, and access to the app for review. We're also happy to speak on the record about
        the business model, privacy architecture, or the broader voice journaling space. Email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>{" "}
        with "Press" in the subject line. We respond to press enquiries within 24 hours.
      </Section>

      <Section title="Partnerships">
        We're open to partnerships with wellness apps, therapists, executive coaches, and
        productivity platforms whose values align with privacy and long-term self-understanding.
        If you're building something that could benefit from ÉCHO's longitudinal insight layer —
        or if you work with clients who would benefit from structured daily reflection — let's
        talk. We're particularly interested in integrations that preserve the privacy-first
        principle and add genuine value for users, not just distribution. Email{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>{" "}
        with "Partnership" in the subject line.
      </Section>
    </InnerPage>
  );
}
