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
      <link rel="canonical" href="https://echo.reaclyse.com/contact" />
      <meta property="og:title" content="Contact Réaclyse — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="General enquiries, press, partnerships, or data requests — hello@reaclyse.com."
      />
      <meta property="og:url" content="https://echo.reaclyse.com/contact" />

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
    </InnerPage>
  );
}
