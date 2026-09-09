import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ── Auth guard ────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (
      !adminApi.isAuthenticated() &&
      location.pathname !== "/admin/login"
    ) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: "/admin/questions", label: "Questions" },
  { to: "/admin/categories", label: "Categories" },
] as const;

// ── Layout ────────────────────────────────────────────────────────────────────

function AdminLayout() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  if (pathname === "/admin/login") {
    return (
      <>
        <meta name="robots" content="noindex, nofollow" />
        <Outlet />
      </>
    );
  }

  function handleLogout() {
    adminApi.logout();
    toast.success("Logged out");
    void router.navigate({ to: "/admin/login" });
  }

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div className="min-h-screen flex flex-col">
        {/* ── Top nav ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-background">
          <div className="flex h-14 items-center gap-6 px-6">
            {/* Brand */}
            <span className="text-sm font-semibold tracking-wide">ÉCHO Admin</span>

            <Separator orientation="vertical" className="h-4" />

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label }) => {
                const isActive = pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
          <Separator />
        </header>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
