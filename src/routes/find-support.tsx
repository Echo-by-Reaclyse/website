import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/find-support")({
  component: FindSupport,
});

function FindSupport() {
  return (
    <InnerPage
      title="You don't have to manage it alone."
      subtitle="Confidential support is available, wherever you are."
    >
      <title>Find Support — ÉCHO</title>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://www.echobyreaclyse.com/find-support" />

      <Section title="If you're in immediate danger">
        If you or someone you know is in immediate danger, call your local emergency services (112
        in Europe, 911 in the US and Canada, 999 in the UK) or go to your nearest emergency room.
        Emergency services are available 24 hours a day, 7 days a week.
      </Section>

      <Section title="United Kingdom">
        <strong className="font-medium text-ink">Samaritans</strong> — Call{" "}
        <a href="tel:116123" className="text-ember transition hover:opacity-75">
          116 123
        </a>{" "}
        (free, 24/7). You can also email{" "}
        <a href="mailto:jo@samaritans.org" className="text-ember transition hover:opacity-75">
          jo@samaritans.org
        </a>{" "}
        or visit{" "}
        <a
          href="https://www.samaritans.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          samaritans.org
        </a>
        .
        <br />
        <br />
        <strong className="font-medium text-ink">PAPYRUS (under 35)</strong> — Call{" "}
        <a href="tel:08000684141" className="text-ember transition hover:opacity-75">
          0800 068 4141
        </a>{" "}
        or text 07860 039967.
      </Section>

      <Section title="United States">
        <strong className="font-medium text-ink">988 Suicide & Crisis Lifeline</strong> — Call or
        text{" "}
        <a href="tel:988" className="text-ember transition hover:opacity-75">
          988
        </a>{" "}
        (free, 24/7). Chat available at{" "}
        <a
          href="https://988lifeline.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          988lifeline.org
        </a>
        .
        <br />
        <br />
        <strong className="font-medium text-ink">Crisis Text Line</strong> — Text HOME to{" "}
        <a href="sms:741741" className="text-ember transition hover:opacity-75">
          741741
        </a>
        .
      </Section>

      <Section title="Canada">
        <strong className="font-medium text-ink">Talk Suicide Canada</strong> — Call{" "}
        <a href="tel:18334564566" className="text-ember transition hover:opacity-75">
          1-833-456-4566
        </a>{" "}
        (24/7) or text 45645 (4 pm – midnight ET).
      </Section>

      <Section title="Australia">
        <strong className="font-medium text-ink">Lifeline</strong> — Call{" "}
        <a href="tel:131114" className="text-ember transition hover:opacity-75">
          13 11 14
        </a>{" "}
        (24/7) or text 0477 13 11 14.
        <br />
        <br />
        <strong className="font-medium text-ink">Beyond Blue</strong> — Call{" "}
        <a href="tel:1300224636" className="text-ember transition hover:opacity-75">
          1300 22 4636
        </a>{" "}
        (24/7).
      </Section>

      <Section title="Ireland">
        <strong className="font-medium text-ink">Samaritans Ireland</strong> — Call{" "}
        <a href="tel:116123" className="text-ember transition hover:opacity-75">
          116 123
        </a>{" "}
        (free, 24/7).
        <br />
        <br />
        <strong className="font-medium text-ink">Pieta</strong> — Call{" "}
        <a href="tel:116123" className="text-ember transition hover:opacity-75">
          116 123
        </a>{" "}
        or text HELP to 51444.
      </Section>

      <Section title="European Union">
        A Europe-wide emotional support line is available at{" "}
        <a href="tel:116123" className="text-ember transition hover:opacity-75">
          116 123
        </a>{" "}
        in many EU countries (availability varies by country). Visit{" "}
        <a
          href="https://www.befrienders.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          befrienders.org
        </a>{" "}
        for a full directory of crisis centres worldwide.
      </Section>

      <Section title="International directory">
        The{" "}
        <a
          href="https://www.befrienders.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          Befrienders Worldwide
        </a>{" "}
        directory lists crisis support centres in over 50 countries. The{" "}
        <a
          href="https://www.iasp.info/resources/Crisis_Centres/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember transition hover:opacity-75"
        >
          International Association for Suicide Prevention
        </a>{" "}
        also maintains a global list of crisis centres.
      </Section>
    </InnerPage>
  );
}
