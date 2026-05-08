import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/support")({
  component: Support,
});

function Support() {
  useEffect(() => {
    document.title = "Help & Support — ÉCHO by Réaclyse";
  }, []);

  return (
    <InnerPage title="Help & Support" subtitle="We're here to help.">
      <Section title="Getting started">
        ÉCHO is not yet available — it launches on iOS in 2026. Join the waitlist on the
        home page to be notified first and unlock early-access pricing.
      </Section>
      <Section title="Account & data">
        Your voice data is encrypted and associated with your account only. You can request
        a full export or permanent deletion of your data at any time by contacting us directly.
      </Section>
      <Section title="Subscriptions & billing">
        ÉCHO will offer a monthly plan at €7.99 and an annual plan at €69. Founding members
        who join the waitlist early will receive a special offer at launch. All billing is
        handled through Apple's App Store.
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
