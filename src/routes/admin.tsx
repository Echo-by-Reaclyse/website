import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { LayoutGrid, Tag, LogOut, Mic, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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

  // Login page renders standalone — no sidebar chrome
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  function handleLogout() {
    adminApi.logout();
    toast.success("Logged out successfully");
    void router.navigate({ to: "/admin/login" });
  }

  return (
    <SidebarProvider>
      {/* ── Sidebar (fixed on desktop, Sheet on mobile) ───────────────────── */}
      <Sidebar collapsible="offcanvas">
        {/* Brand */}
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Mic className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold tracking-wide text-sidebar-foreground">
                ÉCHO
              </p>
              <p className="mt-0.5 text-xs text-sidebar-foreground/60">Admin</p>
            </div>
          </div>
        </SidebarHeader>

        {/* Nav */}
        <SidebarContent className="px-2 py-3">
          <SidebarMenu>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = pathname.startsWith(to);
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive} size="default">
                    <Link to={to}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <SidebarInset>
        {/* Mobile-only top bar with hamburger trigger */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Mic className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">ÉCHO Admin</span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
