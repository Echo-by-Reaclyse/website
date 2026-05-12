import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { LayoutGrid, Tag, LogOut, Mic, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";

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
  { to: "/admin/questions", label: "Questions", icon: LayoutGrid },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/flags", label: "Feature Flags", icon: ToggleLeft },
] as const;

// ── Layout ────────────────────────────────────────────────────────────────────

function AdminLayout() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  // If we land on the login page while authenticated, just render the outlet
  // (login.tsx handles its own redirect to /admin/questions).
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  function handleLogout() {
    adminApi.logout();
    toast.success("Logged out successfully");
    void router.navigate({ to: "/admin/login" });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Mic className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-wide text-foreground">ÉCHO</p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
