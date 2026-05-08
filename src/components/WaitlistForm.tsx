import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const emailSchema = z.string().trim().toLowerCase().email("Invalid email address");

export function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const locale = typeof navigator !== "undefined" ? navigator.language : null;
      const { error } = await supabase
        .from("waitlist_signups")
        .insert({ email: parsed.data, locale, source: "landing" });

      if (error && error.code !== "23505") {
        throw new Error(error.message);
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
      <div
        className={
          variant === "hero"
            ? "rounded-md border border-ember/40 bg-ember/10 px-5 py-4 text-cream"
            : "text-cream"
        }
      >
        <p className="font-display text-lg italic text-cream">
          You're on the list. We'll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
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
          placeholder="you@example.com"
          className="flex-1 rounded-md border border-peach/20 bg-midnight/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 outline-none backdrop-blur-sm transition focus:border-peach focus:ring-2 focus:ring-peach/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-ember inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold tracking-wide disabled:opacity-60"
        >
          {loading ? "…" : "Reserve your place"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
