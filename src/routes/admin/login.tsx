import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
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

// ── Env ───────────────────────────────────────────────────────────────────────

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

function LoginPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSuccess = useCallback(() => {
    toast.success("Welcome back!");
    void navigate({ to: "/admin/questions" });
  }, [navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    loadScript("https://accounts.google.com/gsi/client")
      .then(() => {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setError(null);
            try {
              await adminApi.loginWithGoogle(response.credential);
              onSuccess();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Sign-in failed.");
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
            width: 300,
          });
        }
        setGoogleReady(true);
      })
      .catch(() => setError("Failed to load Google Sign-In."));
  }, [onSuccess]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xs space-y-6 text-center">
        {/* Brand */}
        <div>
          <p className="text-xl font-semibold tracking-wide">ÉCHO</p>
          <p className="mt-1 text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        {/* Google button */}
        <div className="flex flex-col items-center gap-3">
          {!googleReady && GOOGLE_CLIENT_ID && (
            <div className="flex h-10 items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          )}
          <div
            ref={googleButtonRef}
            className={cn(!googleReady && "opacity-0 pointer-events-none h-0 overflow-hidden")}
          />
          {!GOOGLE_CLIENT_ID && (
            <p className="text-sm text-destructive">Google Sign-In is not configured.</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <p className="text-xs text-muted-foreground">Admin access only.</p>
      </div>
    </div>
  );
}
