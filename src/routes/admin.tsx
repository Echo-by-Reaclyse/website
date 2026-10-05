import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminApi } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (
      !adminApi.isAuthenticated() &&
      location.pathname !== "/admin/login"
    ) {
      throw redirect({ to: "/admin/login" });
    }
  },
});
