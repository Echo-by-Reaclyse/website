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
const APPLE_CLIENT_ID = (import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined) ?? "";
const APPLE_REDIRECT_URI = (import.meta.env.VITE_APPLE_REDIRECT_URI as string | undefined)
  ?? `${window.location.origin}/admin/login`;

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

function generateNonce(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
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
  const [appleLoading, setAppleLoading] = useState(false);
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

  // ── Apple Sign-In ─────────────────────────────────────────────────────────

  const handleApple = useCallback(async () => {
    if (!APPLE_CLIENT_ID) {
      setOauthError("Apple Sign In is not configured (VITE_APPLE_CLIENT_ID missing).");
      return;
    }
    setAppleLoading(true);
    setOauthError(null);
    try {
      await loadScript(
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
      );

      const nonce = generateNonce();
      const hashedNonce = await sha256(nonce);

      window.AppleID?.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "email name",
        redirectURI: APPLE_REDIRECT_URI,
        nonce: hashedNonce,
        usePopup: true,
      });

      const result = await window.AppleID!.auth.signIn();
      const displayName = [
        result.user?.name?.firstName,
        result.user?.name?.lastName,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

      await adminApi.loginWithApple(result.authorization.id_token, nonce, displayName);
      onSuccess();
    } catch (err) {
      if (err instanceof Error && err.message !== "popup_closed_by_user") {
        setOauthError(err instanceof Error ? err.message : "Apple sign-in failed.");
      }
    } finally {
      setAppleLoading(false);
    }
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

            {/* Apple button */}
            {APPLE_CLIENT_ID && (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => void handleApple()}
                disabled={appleLoading}
              >
                {appleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AppleIcon />
                )}
                Continue with Apple
              </Button>
            )}

            {/* Divider → email/password toggle */}
            {(GOOGLE_CLIENT_ID || APPLE_CLIENT_ID) && (
              <>
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
              </>
            )}

            {/* Email/password form — shown when no OAuth configured, or toggled */}
            {(!GOOGLE_CLIENT_ID && !APPLE_CLIENT_ID) || showEmailForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    autoFocus={!GOOGLE_CLIENT_ID && !APPLE_CLIENT_ID}
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

// ── Apple SVG icon ────────────────────────────────────────────────────────────

function AppleIcon() {
  return (
    <svg viewBox="0 0 814 1000" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 420.3 0 300.5 0 190.3c0-185 120.6-283 238.5-283 89.7 0 164 57.8 219.8 57.8 53 0 136.5-61.9 236.9-61.9 34.2 0 121.1 3.2 188.2 81.1zm-78.8-103.4c-30.4-36.1-72.5-55.5-115.2-55.5-40.9 0-75.1 20.1-104.5 20.1-29.5 0-68.4-21.7-113.5-21.7-.8 0-1.7 0-2.5.1C323.4 28 250.8 65 217.1 134.2c-13.7 27.8-21.2 59.2-21.2 93.3 0 69.9 38.7 142 83.5 187.4 21.3 21.3 47.1 36.2 73.3 36.2 28.6 0 54.3-18.1 96.4-18.1 43.3 0 68.8 18.3 103.4 18.3 27.1 0 54.2-16.9 77-39.6 27.3-26.5 49.6-66.3 56.5-104.8z" />
    </svg>
  );
}
