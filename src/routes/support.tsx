import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/support")({
  component: Support,
});

function Support() {
  useEffect(() => {
    document.title = "Help & Support — ÉCHO by Réaclyse";
  }, []);

  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ember">
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">Help & Support</h1>
        <p className="mt-4 text-sm text-muted-foreground">We're here to help.</p>

        <div className="mt-10 space-y-6 text-foreground/90">
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
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
