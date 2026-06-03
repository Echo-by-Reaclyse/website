import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetaPixelPageView() {
  const { location } = useRouterState();
  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);
  return null;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <>
      <MetaPixelPageView />
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundComponent,
});
