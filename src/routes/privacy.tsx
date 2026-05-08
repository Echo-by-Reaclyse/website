import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — ÉCHO by Réaclyse";
  }, []);

  return (
    <div className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ember">
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: 2026</p>

        <div className="mt-10 space-y-6 text-foreground/90">
          <Section title="What we collect">
            On the waitlist, we collect only your email address, your browser locale,
            and the page that referred you. We use this to contact you about ÉCHO's launch.
          </Section>
          <Section title="Voice and transcripts">
            ÉCHO is designed privacy-first. Voice recordings and transcripts are encrypted
            and remain associated with your account. We do not sell, share, or use your
            voice data to train external models.
          </Section>
          <Section title="Your rights (GDPR)">
            You may request access, correction, or deletion of your personal data at any
            time by contacting us at hello@reaclyse.com.
          </Section>
          <Section title="Contact">
            Réaclyse · Luxembourg · hello@reaclyse.com
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
