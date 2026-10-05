import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminApi } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (adminApi.isAuthenticated()) {
      throw redirect({ to: "/admin/questions" });
    }
  },
});
