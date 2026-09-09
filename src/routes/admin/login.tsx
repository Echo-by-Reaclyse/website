import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Mic, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (adminApi.isAuthenticated()) {
      throw redirect({ to: "/admin/questions" });
    }
  },
  component: LoginPage,
});

// ── Env vars ──────────────────────────────────────────────────────────────────

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface LoginFormValues {
  email: string;
  password: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function LoginPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginFormValues>({ defaultValues: { email: "", password: "" } });

  // ── Success handler shared by all login methods ───────────────────────────

  const onSuccess = useCallback(() => {
    toast.success("Welcome back!");
    void navigate({ to: "/admin/questions" });
  }, [navigate]);

  // ── Google Sign-In ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    loadScript("https://accounts.google.com/gsi/client")
      .then(() => {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setOauthError(null);
            try {
              await adminApi.loginWithGoogle(response.credential);
              onSuccess();
            } catch (err) {
              setOauthError(err instanceof Error ? err.message : "Google sign-in failed.");
            }
          },
        });

        if (googleButtonRef.current) {
          window.google?.accounts.id.renderButton(googleButtonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            width: 320,
          });
        }
        setGoogleReady(true);
      })
      .catch(() => {
        // GIS failed to load — silently hide the button
      });
  }, [onSuccess]);

  // ── Email/password ────────────────────────────────────────────────────────

  async function onSubmit(values: LoginFormValues) {
    setOauthError(null);
    try {
      await adminApi.login(values.email, values.password);
      onSuccess();
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Login failed. Please try again.",
      });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Mic className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">ÉCHO</h1>
            <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            {/* OAuth error banner */}
            {oauthError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                <p className="text-xs text-destructive">{oauthError}</p>
              </div>
            )}

            {/* Google button (rendered by GIS into ref) */}
            {GOOGLE_CLIENT_ID && (
              <div
                ref={googleButtonRef}
                className={cn(
                  "flex justify-center transition-opacity",
                  !googleReady && "opacity-0 pointer-events-none h-10"
                )}
              />
            )}

            {/* Divider → email/password toggle */}
            {GOOGLE_CLIENT_ID && (
              <div className="relative">
                <Separator />
                <button
                  type="button"
                  onClick={() => setShowEmailForm((v) => !v)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-expanded={showEmailForm}
                  aria-label="Toggle email sign-in"
                >
                  <span className="flex items-center gap-1 bg-card px-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    or use email
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        showEmailForm && "rotate-180"
                      )}
                    />
                  </span>
                </button>
              </div>
            )}

            {/* Email/password form — shown when no OAuth configured, or toggled */}
            {!GOOGLE_CLIENT_ID || showEmailForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    autoFocus={!GOOGLE_CLIENT_ID}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {errors.root && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                    <p className="text-xs text-destructive">{errors.root.message}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Admin access only. Unauthorised users will be rejected.
        </p>
      </div>
    </div>
  );
}
