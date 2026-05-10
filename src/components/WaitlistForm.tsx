import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";

const emailSchema = z.string().trim().toLowerCase().email("Invalid email address");

export function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot — must stay empty
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side honeypot: if a bot filled the hidden field, silently pretend
    // success without hitting the API.
    if (hp) {
      setDone(true);
      return;
    }

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const locale = typeof navigator !== "undefined" ? navigator.language : null;
      const apiBase = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${apiBase}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, locale, source: "landing", hp, consent: true }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Something went wrong.");
      }
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-ember/30 bg-ember/10 px-5 py-3.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/25 text-sm font-semibold text-ember">
          ✓
        </span>
        <p className="font-display text-base italic text-ink">
          You're on the list. We'll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/*
        Honeypot — visually hidden, never shown to real users.
        Bots that auto-fill forms will populate this; we silently discard those.
        CSS-hidden rather than display:none so bots can't trivially detect it.
      */}
      <div aria-hidden="true" style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, overflow: "hidden", tabIndex: -1 }}>
        <label htmlFor={`website-${variant}`}>Website</label>
        <input
          id={`website-${variant}`}
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      {/* Pill: input + button as one unified element */}
      <div className="flex items-center gap-1.5 rounded-full border border-peach/20 bg-midnight/80 p-1.5 backdrop-blur-md transition-all duration-300 focus-within:border-ember/50 focus-within:shadow-[0_0_0_3px_rgba(191,96,64,0.10),0_0_48px_rgba(191,96,64,0.07)]">
        <label htmlFor={`email-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${variant}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/45 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !consented}
          className="btn-ember shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-sm tracking-wide disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-midnight/25 border-t-midnight/70" />
              Joining…
            </span>
          ) : variant === "footer" ? (
            "Join waitlist →"
          ) : (
            <>
              <span className="hidden sm:inline">Reserve your place </span>
              <span className="sm:hidden">Reserve </span>→
            </>
          )}
        </button>
      </div>
      <div className={`mt-3 flex items-start gap-2.5 ${variant === "footer" ? "justify-center" : ""}`}>
        <Checkbox
          id={`consent-${variant}`}
          checked={consented}
          onCheckedChange={(v) => setConsented(v === true)}
          className="mt-0.5 border-muted-foreground/30 data-[state=checked]:border-ember data-[state=checked]:bg-ember"
        />
        <label
          htmlFor={`consent-${variant}`}
          className="cursor-pointer text-xs leading-snug text-muted-foreground/55"
        >
          I agree to receive updates from RÉACLYSE. Unsubscribe anytime.{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Read our Privacy Policy.
          </Link>
        </label>
      </div>
    </form>
  );
}
