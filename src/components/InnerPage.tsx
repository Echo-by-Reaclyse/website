import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

interface InnerPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function InnerPage({ title, subtitle, children }: InnerPageProps) {
  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-30 nav-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="transition hover:opacity-80">
            <img src="/logo-name.svg" alt="ÉCHO" className="h-5 w-auto" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ember"
        >
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-sm text-muted-foreground">{subtitle}</p>
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
      <p className="mt-2 leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
