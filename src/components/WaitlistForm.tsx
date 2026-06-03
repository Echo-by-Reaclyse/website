import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { trackLead } from "@/lib/pixel";

const emailSchema = z.string().trim().toLowerCase().email("Invalid email address");

export function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot — must stay empty
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!consented) {
      setShake(true);
      setTimeout(() => setShake(false), 650);
      return;
    }

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
      trackLead(parsed.data);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
    {done ? (
      <motion.div
        key="done"
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.95,  y: -6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 rounded-full border border-ember/30 bg-ember/10 px-5 py-3.5"
      >
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/25 text-sm font-semibold text-ember"
        >
          ✓
        </motion.span>
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-base italic text-ink"
        >
          You're on the list. We'll be in touch.
        </motion.p>
      </motion.div>
    ) : (
    <motion.form
      key="form"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit} className="w-full">
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
          disabled={loading}
          className="btn-ember shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-sm tracking-wide disabled:opacity-60 overflow-hidden"
          style={{ minWidth: variant === "footer" ? 140 : 130 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-2"
              >
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-midnight/25 border-t-midnight/70" />
                Joining…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {variant === "footer" ? (
                  "Join waitlist →"
                ) : (
                  <>
                    <span className="hidden sm:inline">Reserve your place </span>
                    <span className="sm:hidden">Reserve </span>→
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <motion.div
        className={`mt-3 flex items-start gap-2.5 ${variant === "footer" ? "justify-center" : ""}`}
        animate={shake ? { x: [0, -7, 7, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <Checkbox
          id={`consent-${variant}`}
          checked={consented}
          onCheckedChange={(v) => setConsented(v === true)}
          className={`mt-0.5 transition-colors duration-200 ${shake && !consented ? "border-red-400 bg-red-400/10" : "border-muted-foreground/30 data-[state=checked]:border-ember data-[state=checked]:bg-ember"}`}
        />
        <label
          htmlFor={`consent-${variant}`}
          className={`cursor-pointer text-xs leading-snug transition-colors duration-200 ${shake && !consented ? "text-red-400/80" : "text-muted-foreground/55"}`}
        >
          I agree to receive updates from RÉACLYSE. Unsubscribe anytime.{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Read our Privacy Policy.
          </Link>
        </label>
      </motion.div>
    </motion.form>
    )}
    </AnimatePresence>
  );
}
