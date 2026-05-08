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
        content="Get help with ÉCHO, the private voice journal for iPhone. Questions about your account, subscription, data, or the iOS launch? We respond within one business day."
      />
      <link rel="canonical" href="https://echo.reaclyse.com/support" />
      <meta property="og:title" content="Help & Support — ÉCHO Voice Journal" />
      <meta
        property="og:description"
        content="Get help with ÉCHO. Questions about your account, subscription, or the iOS launch? We respond within one business day."
      />
      <meta property="og:url" content="https://echo.reaclyse.com/support" />

      <Section title="Getting started">
        ÉCHO is not yet available — it launches on iOS in 2026. Join the waitlist on the home page
        to be notified first and unlock early-access pricing. We'll send you everything you need
        before launch day.
      </Section>
      <Section title="Account & data">
        Your voice data is encrypted and associated with your account only. You can request a full
        export or permanent deletion of your data at any time by contacting us directly. We comply
        fully with GDPR.
      </Section>
      <Section title="Subscriptions & billing">
        ÉCHO will offer a monthly plan at €7.99 and an annual plan at €69. Founding members who
        join the waitlist early will receive a special offer at launch. All billing is handled
        through Apple's App Store — we never store your payment information.
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
