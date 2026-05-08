import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  useEffect(() => {
    document.title = "Contact — ÉCHO by Réaclyse";
  }, []);

  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ember">
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">Contact</h1>
        <p className="mt-4 text-sm text-muted-foreground">We'd love to hear from you.</p>

        <div className="mt-10 space-y-6 text-foreground/90">
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
            <a href="https://reaclyse.com" target="_blank" rel="noreferrer noopener" className="text-ember transition hover:opacity-75">
              reaclyse.com
            </a>
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
