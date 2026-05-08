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

      if (error && error.code !== "23505") throw new Error(error.message);
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
        <p className="font-display text-base italic text-cream">
          You're on the list. We'll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
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
          disabled={loading}
          className="btn-ember shrink-0 rounded-full px-5 py-2.5 text-sm tracking-wide disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-midnight/25 border-t-midnight/70" />
              Joining…
            </span>
          ) : variant === "footer" ? (
            "Join the waitlist →"
          ) : (
            "Reserve your place →"
          )}
        </button>
      </div>
      <p className={`mt-3 text-xs text-muted-foreground/55 ${variant === "footer" ? "text-center" : ""}`}>
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
