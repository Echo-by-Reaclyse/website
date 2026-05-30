import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

interface InnerPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function InnerPage({ title, subtitle, children }: InnerPageProps) {
  return (
    <div className="relative min-h-screen bg-background [overflow-x:clip]">
      <header className="fixed inset-x-0 top-0 z-50 nav-blur">
        <div
          className="mx-auto flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4"
          style={{ maxWidth: 1100 }}
        >
          <Link to="/" className="flex items-end gap-2.5 transition hover:opacity-80">
            <img src="/logo-main.svg" alt="ÉCHO" style={{ height: 22, width: "auto", opacity: 0.92 }} />
            <span className="hidden pb-0.5 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              by Réaclyse
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-20 sm:px-6 sm:pt-24">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 font-sans text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-10 space-y-8">{children}</div>
      </main>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-2 font-sans leading-relaxed text-muted-foreground break-words">{children}</div>
    </section>
  );
}
